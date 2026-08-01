import { useEffect, useRef, useState } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

const NECKLACE_WIDTH_MULT = 1.35;
const NECKLACE_HEIGHT_RATIO = 0.6;
const NECKLACE_VERTICAL_GAP = 0.015;
const EARRING_SIZE_MULT = 0.055;
const EARRING_VERTICAL_OFFSET = 0.03;
const EARRING_LANDMARK_LEFT_IDX = 454;
const EARRING_LANDMARK_RIGHT_IDX = 234;

interface VirtualTryOnProps {
  jewelryType: "necklace" | "earring";
  imageSrc: string;
}

export default function VirtualTryOn({ jewelryType, imageSrc }: VirtualTryOnProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const jewelryImageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    let faceLandmarker: FaceLandmarker;
    let animationId = 0;
    let stream: MediaStream | undefined;

    const jewelryImg = new Image();
    jewelryImg.src = imageSrc;
    jewelryImageRef.current = jewelryImg;

    async function setup() {
      const filesetResolver = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
      );

      faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numFaces: 1,
      });

      stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 480, height: 640 },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setLoading(false);
      renderLoop();
    }

    function renderLoop() {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || !faceLandmarker) {
        animationId = window.requestAnimationFrame(renderLoop);
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        animationId = window.requestAnimationFrame(renderLoop);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const results = faceLandmarker.detectForVideo(video, performance.now());
      if (results.faceLandmarks.length > 0) {
        const landmarks = results.faceLandmarks[0];
        const leftEar = landmarks[EARRING_LANDMARK_LEFT_IDX];
        const rightEar = landmarks[EARRING_LANDMARK_RIGHT_IDX];
        const chin = landmarks[152];
        const leftJaw = landmarks[172];
        const rightJaw = landmarks[397];
        const jewelryImg = jewelryImageRef.current;

        if (jewelryImg?.complete) {
          switch (jewelryType) {
            case "earring": {
              const size = canvas.width * EARRING_SIZE_MULT;
              const leftX = leftEar.x * canvas.width - size / 2;
              const leftY = leftEar.y * canvas.height + canvas.height * EARRING_VERTICAL_OFFSET;
              const rightX = rightEar.x * canvas.width - size / 2;
              const rightY = rightEar.y * canvas.height + canvas.height * EARRING_VERTICAL_OFFSET;
              ctx.drawImage(jewelryImg, leftX, leftY, size, size * 1.4);
              ctx.drawImage(jewelryImg, rightX, rightY, size, size * 1.4);
              break;
            }
            case "necklace": {
              const jawWidth = Math.abs(rightJaw.x - leftJaw.x) * canvas.width;
              const width = jawWidth * NECKLACE_WIDTH_MULT;
              const height = width * NECKLACE_HEIGHT_RATIO;
              const topY = chin.y * canvas.height + NECKLACE_VERTICAL_GAP * canvas.height;
              ctx.drawImage(jewelryImg, chin.x * canvas.width - width / 2, topY, width, height);
              break;
            }
          }
        }
      }

      animationId = window.requestAnimationFrame(renderLoop);
    }

    setup();

    return () => {
      cancelAnimationFrame(animationId);
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [imageSrc, jewelryType]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{ position: "relative", width: 480, height: 640, margin: "0 auto" }}>
        {loading && <p style={{ textAlign: "center" }}>Loading camera & model...</p>}
        <video ref={videoRef} style={{ display: "none" }} playsInline muted />
        <canvas ref={canvasRef} style={{ width: "100%", height: "100%", borderRadius: 16, transform: "scaleX(-1)" }} />
      </div>
    </div>
  );
}