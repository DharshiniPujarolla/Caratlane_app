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
    let isActive = true;

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

      if (!isActive) return;
      setLoading(false);
      renderLoop();
    }

    function renderLoop() {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!isActive || !video || !canvas || !faceLandmarker) {
        animationId = window.requestAnimationFrame(renderLoop);
        return;
      }

      const dpr = window.devicePixelRatio || 1;
      const cssWidth = video.videoWidth;
      const cssHeight = video.videoHeight;
      canvas.width = Math.round(cssWidth * dpr);
      canvas.height = Math.round(cssHeight * dpr);
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        animationId = window.requestAnimationFrame(renderLoop);
        return;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cssWidth, cssHeight);
      ctx.drawImage(video, 0, 0, cssWidth, cssHeight);

      try {
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
            if (jewelryType === "earring") {
              const size = cssWidth * EARRING_SIZE_MULT;
              const renderEarring = (x: number, y: number) => {
                ctx.save();
                ctx.translate(x, y);
                ctx.shadowColor = "rgba(15, 23, 42, 0.3)";
                ctx.shadowBlur = 14;
                ctx.shadowOffsetY = 8;
                ctx.globalAlpha = 0.96;
                ctx.drawImage(jewelryImg, -size / 2, 0, size, size * 1.4);
                ctx.restore();
              };
              renderEarring(
                leftEar.x * cssWidth,
                leftEar.y * cssHeight + cssHeight * EARRING_VERTICAL_OFFSET
              );
              renderEarring(
                rightEar.x * cssWidth,
                rightEar.y * cssHeight + cssHeight * EARRING_VERTICAL_OFFSET
              );
            }

            if (jewelryType === "necklace") {
              const jawWidth = Math.abs(rightJaw.x - leftJaw.x) * cssWidth;
              const width = Math.max(120, Math.min(cssWidth * 0.9, jawWidth * NECKLACE_WIDTH_MULT));
              const height = Math.max(80, Math.min(cssHeight * 0.36, width * NECKLACE_HEIGHT_RATIO));
              const topY = chin.y * cssHeight + NECKLACE_VERTICAL_GAP * cssHeight;
              const centerX = chin.x * cssWidth;
              const centerY = topY + height * 0.55;
              const tilt = Math.atan2(rightJaw.y - leftJaw.y, rightJaw.x - leftJaw.x);

              ctx.save();
              ctx.translate(centerX, centerY);
              ctx.rotate(tilt * 0.2);
              ctx.transform(1, 0.04, 0.02, 1, 0, 0);
              ctx.shadowColor = "rgba(15, 23, 42, 0.34)";
              ctx.shadowBlur = 16;
              ctx.shadowOffsetY = 10;
              ctx.globalAlpha = 0.96;
              ctx.drawImage(jewelryImg, -width / 2, -height / 2, width, height);
              ctx.restore();
            }
          }
        }
      } catch (error) {
        console.error("[VirtualTryOn] Frame render failed", {
          jewelryType,
          error,
        });
      }

      if (isActive) {
        animationId = window.requestAnimationFrame(renderLoop);
      }
    }

    setup();

    return () => {
      isActive = false;
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