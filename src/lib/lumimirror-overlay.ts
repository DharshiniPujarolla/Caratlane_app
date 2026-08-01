import { FaceLandmarker, FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision";

export type FacePlacement = {
  neckWidth: number;
  anchorX: number;
  anchorY: number;
  faceHeight: number;
  chinY: number;
  neckLength: number;
  rotationAngle: number;
  visibleNeck: boolean;
  message?: string;
};

type FacePoint = {
  x: number;
  y: number;
  z?: number;
};

type PosePoint = FacePoint;

const overlayCache = new Map<string, string>();
let faceLandmarkerPromise: Promise<FaceLandmarker> | null = null;
let poseLandmarkerPromise: Promise<PoseLandmarker> | null = null;

export async function processOverlayImageToTransparentDataUrl(src: string): Promise<string> {
  if (typeof window === "undefined") {
    return src;
  }

  if (overlayCache.has(src)) {
    return overlayCache.get(src)!;
  }

  const image = await loadImage(src);
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth || image.width;
  canvas.height = image.naturalHeight || image.height;
  const context = canvas.getContext("2d");

  if (!context) {
    return src;
  }

  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const data = context.getImageData(0, 0, canvas.width, canvas.height);

  for (let index = 0; index < data.data.length; index += 4) {
    const red = data.data[index];
    const green = data.data[index + 1];
    const blue = data.data[index + 2];
    const alpha = data.data[index + 3];

    if (alpha > 0 && red > 240 && green > 240 && blue > 240) {
      data.data[index + 3] = 0;
    }
  }

  context.putImageData(data, 0, 0);
  const processed = canvas.toDataURL("image/png");
  overlayCache.set(src, processed);
  return processed;
}

export function deriveFacePlacement(
  landmarks: FacePoint[],
  width: number,
  height: number,
  poseLandmarks?: PosePoint[],
): FacePlacement {
  const leftJaw = landmarks[172];
  const rightJaw = landmarks[397];
  const chin = landmarks[152];
  const leftEar = landmarks[454];
  const rightEar = landmarks[234];
  const noseTip = landmarks[1];
  const leftEye = landmarks[33];
  const rightEye = landmarks[263];

  if (!leftJaw || !rightJaw || !chin) {
    return {
      neckWidth: 0.18,
      anchorX: 0.5,
      anchorY: 0.58,
      faceHeight: 0.24,
      chinY: 0.58,
      neckLength: 0.08,
      rotationAngle: 0,
      visibleNeck: false,
      message: "For best results, use a photo showing your neck and shoulders.",
    };
  }

  const jawWidthPx = Math.abs(rightJaw.x - leftJaw.x) * width;
  const shoulderProxyWidthPx = Math.abs((rightEar?.x ?? rightJaw.x) - (leftEar?.x ?? leftJaw.x)) * width;
  const neckWidthPx = jawWidthPx * 0.72 + shoulderProxyWidthPx * 0.28;
  const anchorX = (leftJaw.x + rightJaw.x) / 2;

  const eyeCenterY = ((leftEye?.y ?? chin.y - 0.12) + (rightEye?.y ?? chin.y - 0.12)) / 2;
  const faceHeightPx = Math.abs(chin.y - (noseTip?.y ?? eyeCenterY)) * height;
  const faceHeight = Math.max(0.08, Math.min(0.34, faceHeightPx / Math.max(1, height)));

  const shoulderLineY = getShoulderLineY({
    chin,
    faceHeight,
    poseLandmarks,
    leftEar,
    rightEar,
    height,
  });
  const neckLength = Math.max(0.04, Math.min(0.42, shoulderLineY - chin.y));
  const visibleNeck = neckLength > 0.10;
  const anchorY = Math.min(0.95, Math.max(0.02, chin.y + Math.max(0.01, neckLength * 0.10)));
  const normalizedNeckWidth = Math.max(0.08, Math.min(0.5, neckWidthPx / width));
  const jawAngle = Math.atan2((rightJaw.y ?? 0) - (leftJaw.y ?? 0), (rightJaw.x ?? 0) - (leftJaw.x ?? 0));
  const rotationAngle = Number.isFinite(jawAngle) ? jawAngle : 0;

  const message = visibleNeck
    ? undefined
    : "For best results, use a photo showing your neck and shoulders.";

  console.info("[LumiMirror] neck debug", {
    neckLength: Number(neckLength.toFixed(4)),
    anchorX: Number(anchorX.toFixed(4)),
    anchorY: Number(anchorY.toFixed(4)),
    faceHeight: Number(faceHeight.toFixed(4)),
    chinY: Number(chin.y.toFixed(4)),
    rotationAngle: Number(rotationAngle.toFixed(4)),
  });

  return {
    neckWidth: normalizedNeckWidth,
    anchorX,
    anchorY,
    faceHeight,
    chinY: chin.y,
    neckLength,
    rotationAngle,
    visibleNeck,
    message,
  };
}

function getShoulderLineY(input: {
  chin: FacePoint;
  faceHeight: number;
  poseLandmarks?: PosePoint[];
  leftEar?: FacePoint;
  rightEar?: FacePoint;
  height: number;
}) {
  const { chin, faceHeight, poseLandmarks, leftEar, rightEar, height } = input;

  const poseShoulders = poseLandmarks?.slice(11, 13);
  if (poseShoulders?.[0] && poseShoulders?.[1]) {
    const leftShoulder = poseShoulders[0];
    const rightShoulder = poseShoulders[1];
    return (leftShoulder.y + rightShoulder.y) / 2;
  }

  const shoulderProxy = Math.max(
    chin.y + faceHeight * 0.85,
    ((leftEar?.y ?? chin.y + 0.02) + (rightEar?.y ?? chin.y + 0.02)) / 2 + faceHeight * 0.30,
  );

  return Math.min(0.96, Math.max(0.04, shoulderProxy + (height > 0 ? 0.01 : 0)));
}

export async function getFacePlacementFromImage(imageSrc: string): Promise<FacePlacement | null> {
  if (typeof window === "undefined") {
    return null;
  }

  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth || image.width;
  canvas.height = image.naturalHeight || image.height;
  const context = canvas.getContext("2d");

  if (!context) {
    return null;
  }

  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return detectPlacementFromCanvas(canvas);
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    image.src = src;
  });
}

async function detectPlacementFromCanvas(canvas: HTMLCanvasElement): Promise<FacePlacement | null> {
  const faceLandmarker = await getFaceLandmarker();
  const poseLandmarker = await getPoseLandmarker();

  const faceResult = faceLandmarker.detect(canvas);
  const poseResult = poseLandmarker.detect(canvas);

  if (!faceResult.faceLandmarks?.length) {
    return null;
  }

  const poseLandmarks = poseResult.landmarks?.[0];
  return deriveFacePlacement(faceResult.faceLandmarks[0], canvas.width, canvas.height, poseLandmarks);
}

async function getFaceLandmarker(): Promise<FaceLandmarker> {
  if (faceLandmarkerPromise) {
    return faceLandmarkerPromise;
  }

  faceLandmarkerPromise = (async () => {
    const filesetResolver = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm",
    );

    return FaceLandmarker.createFromOptions(filesetResolver, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
        delegate: "GPU",
      },
      runningMode: "IMAGE",
      numFaces: 1,
    });
  })();

  return faceLandmarkerPromise;
}

async function getPoseLandmarker(): Promise<PoseLandmarker> {
  if (poseLandmarkerPromise) {
    return poseLandmarkerPromise;
  }

  poseLandmarkerPromise = (async () => {
    const filesetResolver = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm",
    );

    return PoseLandmarker.createFromOptions(filesetResolver, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_heavy/float16/1/pose_landmarker_heavy.task",
        delegate: "GPU",
      },
      runningMode: "IMAGE",
      numPoses: 1,
    });
  })();

  return poseLandmarkerPromise;
}
