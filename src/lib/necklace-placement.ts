import { removeBackground } from "@imgly/background-removal";
import { FaceLandmarker, FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision";

export type PlacementPoint = {
  x: number;
  y: number;
  z?: number;
};

export type NecklacePlacement = {
  anchorX: number;
  anchorY: number;
  scale: number;
  rotation: number;
  curvature: number;
  perspective: number;
  pendantDrop: number;
  chainWidth: number;
  neckWidth: number;
  shoulderWidth: number;
  message?: string;
};

export type NecklaceAnchorPoints = {
  leftEndX: number;
  rightEndX: number;
  chainCenterX: number;
  pendantLocationX: number;
  pendantLocationY: number;
  pendantLowestY: number;
};

type LandmarksInput = {
  faceLandmarks?: PlacementPoint[];
  poseLandmarks?: PlacementPoint[];
  width: number;
  height: number;
};

const overlayCache = new Map<string, string>();
let faceLandmarkerPromise: Promise<FaceLandmarker> | null = null;
let poseLandmarkerPromise: Promise<PoseLandmarker> | null = null;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function lerp(start: number, end: number, amount: number) {
  return start + (end - start) * amount;
}

export function deriveNecklacePlacement(input: LandmarksInput): NecklacePlacement {
  const { faceLandmarks, poseLandmarks, width, height } = input;

  const leftJaw = faceLandmarks?.[172];
  const rightJaw = faceLandmarks?.[397];
  const chin = faceLandmarks?.[152];
  const nose = faceLandmarks?.[1];
  const leftEye = faceLandmarks?.[33];
  const rightEye = faceLandmarks?.[263];
  const leftShoulder = poseLandmarks?.[11];
  const rightShoulder = poseLandmarks?.[12];

  if (!leftJaw || !rightJaw || !chin || !leftShoulder || !rightShoulder) {
    return {
      anchorX: 0.5,
      anchorY: 0.56,
      scale: 0.28,
      rotation: 0,
      curvature: 0.16,
      perspective: 0.06,
      pendantDrop: 0.1,
      chainWidth: 0.3,
      neckWidth: 0.16,
      shoulderWidth: 0.28,
      message: "We couldn't detect enough pose detail for a precise necklace fit.",
    };
  }

  const jawWidthPx = Math.abs((rightJaw.x ?? 0) - (leftJaw.x ?? 0)) * width;
  const shoulderWidthPx = Math.abs((rightShoulder.x ?? 0) - (leftShoulder.x ?? 0)) * width;
  const neckWidthPx = clamp(jawWidthPx * 0.72 + shoulderWidthPx * 0.28, width * 0.08, width * 0.34);
  const faceHeightPx = Math.abs((chin.y ?? 0) - (nose?.y ?? chin.y)) * height;
  const shoulderCenterY = ((leftShoulder.y ?? chin.y) + (rightShoulder.y ?? chin.y)) / 2;
  const neckLengthPx = clamp((shoulderCenterY - (chin.y ?? 0)) * height * 0.6, height * 0.06, height * 0.26);

  const anchorX = (leftJaw.x + rightJaw.x) / 2;
  const anchorY = clamp((chin.y ?? 0) + neckLengthPx / height * 0.25, 0.1, 0.9);

  const eyeAngle = Math.atan2((rightEye?.y ?? 0) - (leftEye?.y ?? 0), (rightEye?.x ?? 0) - (leftEye?.x ?? 0));
  const shoulderSlope = Math.atan2((rightShoulder.y ?? 0) - (leftShoulder.y ?? 0), (rightShoulder.x ?? 0) - (leftShoulder.x ?? 0));
  const rotation = clamp(eyeAngle * 0.45 + shoulderSlope * 0.15, -0.55, 0.55);

  const faceScale = clamp(faceHeightPx / Math.max(1, height) * 1.6, 0.2, 0.8);
  const bodyScale = clamp(shoulderWidthPx / Math.max(1, width) * 1.2, 0.16, 0.7);
  const scale = clamp(0.24 + faceScale * 0.3 + bodyScale * 0.2 + neckWidthPx / width * 0.12, 0.24, 0.74);

  const curvature = clamp(0.08 + Math.abs(rotation) * 0.16 + (shoulderWidthPx / width) * 0.08, 0.06, 0.42);
  const perspective = clamp(0.04 + Math.abs(rotation) * 0.08 + (Math.abs((rightShoulder.x ?? 0) - (leftShoulder.x ?? 0))) * 0.02, 0.04, 0.18);
  const pendantDrop = clamp(0.06 + neckLengthPx / height * 0.3, 0.06, 0.22);
  const chainWidth = clamp(0.24 + neckWidthPx / width * 0.3 + shoulderWidthPx / width * 0.12, 0.2, 0.48);

  return {
    anchorX,
    anchorY,
    scale,
    rotation,
    curvature,
    perspective,
    pendantDrop,
    chainWidth,
    neckWidth: clamp(neckWidthPx / width, 0.08, 0.3),
    shoulderWidth: clamp(shoulderWidthPx / width, 0.16, 0.46),
  };
}

export function extractNecklaceAnchorPoints(image: HTMLImageElement): NecklaceAnchorPoints {
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth || image.width;
  canvas.height = image.naturalHeight || image.height;
  const context = canvas.getContext("2d");

  if (!context) {
    return {
      leftEndX: 0.2,
      rightEndX: 0.8,
      chainCenterX: 0.5,
      pendantLocationX: 0.5,
      pendantLocationY: 0.65,
      pendantLowestY: 0.9,
    };
  }

  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  const points: Array<{ x: number; y: number }> = [];

  for (let index = 0; index < pixels.length; index += 4) {
    const alpha = pixels[index + 3];
    if (alpha > 0) {
      const x = (index / 4) % canvas.width;
      const y = Math.floor(index / 4 / canvas.width);
      points.push({ x, y });
    }
  }

  if (!points.length) {
    return {
      leftEndX: 0.2,
      rightEndX: 0.8,
      chainCenterX: 0.5,
      pendantLocationX: 0.5,
      pendantLocationY: 0.65,
      pendantLowestY: 0.9,
    };
  }

  const leftEndX = Math.min(...points.map((point) => point.x)) / canvas.width;
  const rightEndX = Math.max(...points.map((point) => point.x)) / canvas.width;
  const chainCenterX = (leftEndX + rightEndX) / 2;
  const topRegion = points.filter((point) => point.y < canvas.height * 0.55);
  const bottomRegion = points.filter((point) => point.y >= canvas.height * 0.55);
  const pendantLocation = bottomRegion.length
    ? bottomRegion.reduce(
        (acc, point) => {
          if (point.x < acc.x) {
            acc.x = point.x;
          }
          if (point.y > acc.y) {
            acc.y = point.y;
          }
          return acc;
        },
        { x: Number.POSITIVE_INFINITY, y: Number.NEGATIVE_INFINITY },
      )
    : { x: canvas.width * 0.5, y: canvas.height * 0.65 };

  return {
    leftEndX,
    rightEndX,
    chainCenterX,
    pendantLocationX: clamp((pendantLocation.x === Number.POSITIVE_INFINITY ? canvas.width * 0.5 : pendantLocation.x) / canvas.width, 0.1, 0.9),
    pendantLocationY: clamp((topRegion.length ? topRegion.reduce((acc, point) => (point.y < acc ? point.y : acc), canvas.height) : canvas.height * 0.55) / canvas.height, 0.1, 0.95),
    pendantLowestY: clamp((bottomRegion.length ? bottomRegion.reduce((acc, point) => (point.y > acc ? point.y : acc), 0) : canvas.height * 0.9) / canvas.height, 0.2, 0.99),
  };
}

export async function prepareTransparentOverlay(src: string): Promise<string> {
  if (typeof window === "undefined") {
    return src;
  }

  if (overlayCache.has(src)) {
    return overlayCache.get(src)!;
  }

  try {
    const blob = await removeBackground(src);
    const dataUrl = await blobToDataUrl(blob);
    const transparentDataUrl = await makeImageTransparent(dataUrl);
    overlayCache.set(src, transparentDataUrl);
    return transparentDataUrl;
  } catch {
    const transparentDataUrl = await makeImageTransparent(src);
    overlayCache.set(src, transparentDataUrl);
    return transparentDataUrl;
  }
}

export async function generateNecklaceTryOn(
  baseImageSrc: string,
  jewelryImageSrc: string,
  category: string,
): Promise<string> {
  const baseImage = await loadImage(baseImageSrc);
  const transparentOverlaySrc = await prepareTransparentOverlay(jewelryImageSrc);
  const overlayImage = await loadImage(transparentOverlaySrc);

  const sourceWidth = baseImage.naturalWidth || baseImage.width || 1080;
  const sourceHeight = baseImage.naturalHeight || baseImage.height || 1350;

  const placement = await detectNecklacePlacementForImage(baseImageSrc, category);
  const anchors = extractNecklaceAnchorPoints(overlayImage);

  const canvas = document.createElement("canvas");
  canvas.width = sourceWidth;
  canvas.height = sourceHeight;
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas is not supported in this browser.");
  }

  context.drawImage(baseImage, 0, 0, sourceWidth, sourceHeight);

  drawNecklaceOverlay(context, overlayImage, sourceWidth, sourceHeight, placement, anchors);
  return canvas.toDataURL("image/png");
}

export async function detectNecklacePlacementForImage(baseImageSrc: string, category: string): Promise<NecklacePlacement> {
  if (!category.toLowerCase().includes("neck") && !category.toLowerCase().includes("pendant")) {
    return {
      anchorX: 0.5,
      anchorY: 0.56,
      scale: 0.28,
      rotation: 0,
      curvature: 0.16,
      perspective: 0.06,
      pendantDrop: 0.1,
      chainWidth: 0.3,
      neckWidth: 0.16,
      shoulderWidth: 0.28,
      message: "This experience is tuned for necklaces and pendants.",
    };
  }

  if (typeof window === "undefined") {
    return {
      anchorX: 0.5,
      anchorY: 0.56,
      scale: 0.28,
      rotation: 0,
      curvature: 0.16,
      perspective: 0.06,
      pendantDrop: 0.1,
      chainWidth: 0.3,
      neckWidth: 0.16,
      shoulderWidth: 0.28,
    };
  }

  const image = await loadImage(baseImageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth || image.width;
  canvas.height = image.naturalHeight || image.height;
  const context = canvas.getContext("2d");

  if (!context) {
    return {
      anchorX: 0.5,
      anchorY: 0.56,
      scale: 0.28,
      rotation: 0,
      curvature: 0.16,
      perspective: 0.06,
      pendantDrop: 0.1,
      chainWidth: 0.3,
      neckWidth: 0.16,
      shoulderWidth: 0.28,
    };
  }

  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const faceLandmarker = await getFaceLandmarker();
  const poseLandmarker = await getPoseLandmarker();
  const faceResult = await faceLandmarker.detect(canvas);
  const poseResult = await poseLandmarker.detect(canvas);
  const faceLandmarks = faceResult.faceLandmarks?.[0];
  const poseLandmarks = poseResult.landmarks?.[0];

  return deriveNecklacePlacement({
    faceLandmarks,
    poseLandmarks,
    width: canvas.width,
    height: canvas.height,
  });
}

function drawNecklaceOverlay(
  context: CanvasRenderingContext2D,
  overlayImage: HTMLImageElement,
  sourceWidth: number,
  sourceHeight: number,
  placement: NecklacePlacement,
  anchors: NecklaceAnchorPoints,
) {
  const baseWidth = Math.max(sourceWidth * 0.24, Math.min(sourceWidth * 0.78, sourceWidth * (0.28 + placement.scale * 0.44)));
  const baseHeight = (overlayImage.naturalHeight || overlayImage.height || 1) / Math.max(1, overlayImage.naturalWidth || overlayImage.width || 1) * baseWidth;
  const targetCenterX = placement.anchorX * sourceWidth;
  const targetCenterY = placement.anchorY * sourceHeight;
  const leftX = targetCenterX - baseWidth * 0.5;
  const rightX = targetCenterX + baseWidth * 0.5;
  const startY = Math.max(8, targetCenterY - baseHeight * 0.2);
  const endY = Math.min(sourceHeight - 8, targetCenterY + baseHeight * 0.42 + placement.pendantDrop * sourceHeight);

  const segments = 16;
  const segmentWidth = baseWidth / segments;
  const segmentHeight = baseHeight / segments;
  const curveAmplitude = placement.curvature * sourceHeight * 0.08;
  const perspectiveStretch = placement.perspective * sourceHeight * 0.14;

  context.save();
  context.globalCompositeOperation = "source-over";
  context.translate(0, 0);

  for (let index = 0; index < segments; index += 1) {
    const ratio = index / (segments - 1);
    const xProgress = ratio;
    const curveOffset = Math.sin(Math.PI * xProgress) * curveAmplitude;
    const perspectiveOffset = (ratio - 0.5) * perspectiveStretch;
    const destX = lerp(leftX, rightX, xProgress) + curveOffset + perspectiveOffset;
    const destY = lerp(startY, endY, xProgress);
    const destWidth = Math.max(baseWidth * 0.18, baseWidth * (0.6 + (1 - Math.abs(ratio - 0.5) * 2) * 0.4));
    const destHeight = Math.max(baseHeight * 0.08, baseHeight * (0.52 + (1 - Math.abs(ratio - 0.5) * 2) * 0.38));
    const sourceX = (anchors.leftEndX + (anchors.rightEndX - anchors.leftEndX) * ratio) * (overlayImage.naturalWidth || overlayImage.width || 1);
    const sourceWidthSlice = Math.max(8, (overlayImage.naturalWidth || overlayImage.width || 1) / segments);

    context.drawImage(
      overlayImage,
      Math.max(0, sourceX),
      0,
      Math.max(4, sourceWidthSlice),
      overlayImage.naturalHeight || overlayImage.height || 1,
      destX - destWidth / 2,
      destY - destHeight * 0.5,
      destWidth,
      destHeight,
    );
  }

  const pendantCenterX = targetCenterX + (anchors.chainCenterX - 0.5) * baseWidth * 0.08;
  const pendantCenterY = endY + placement.pendantDrop * sourceHeight * 0.35;
  const pendantWidth = Math.max(baseWidth * 0.22, baseWidth * 0.34);
  const pendantHeight = pendantWidth * ((overlayImage.naturalHeight || overlayImage.height || 1) / Math.max(1, overlayImage.naturalWidth || overlayImage.width || 1)) * 1.1;

  context.translate(pendantCenterX, pendantCenterY);
  context.rotate(placement.rotation * 0.18);
  context.translate(-pendantCenterX, -pendantCenterY);
  context.drawImage(
    overlayImage,
    0,
    0,
    overlayImage.naturalWidth || overlayImage.width || 1,
    overlayImage.naturalHeight || overlayImage.height || 1,
    pendantCenterX - pendantWidth / 2,
    pendantCenterY - pendantHeight * 0.8,
    pendantWidth,
    pendantHeight,
  );
  context.restore();
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Unable to load the selected image."));
    image.src = src;
  });
}

async function makeImageTransparent(src: string) {
  try {
    const image = await loadImage(src);
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth || image.width;
    canvas.height = image.naturalHeight || image.height;
    const context = canvas.getContext("2d");

    if (!context) {
      return src;
    }

    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    for (let index = 0; index < pixels.length; index += 4) {
      const red = pixels[index];
      const green = pixels[index + 1];
      const blue = pixels[index + 2];
      const alpha = pixels[index + 3];

      const isBrightBackground = alpha > 0 && red > 220 && green > 220 && blue > 220;
      if (isBrightBackground) {
        pixels[index + 3] = 0;
      }
    }

    context.putImageData(imageData, 0, 0);
    return canvas.toDataURL("image/png");
  } catch {
    return src;
  }
}

async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(new Error("Unable to process the jewellery image."));
    reader.readAsDataURL(blob);
  });
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
