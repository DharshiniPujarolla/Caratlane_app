import { useEffect, useRef, useState } from "react";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";

const RING_SIZE_MULT = 2.4;
const RING_LANDMARK_START_IDX = 13;
const RING_LANDMARK_END_IDX = 14;
const RING_THICKNESS_REF_IDX = 17;

interface RingTryOnProps {
  imageSrc: string;
}

export default function RingTryOn({ imageSrc }: RingTryOnProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const ringImageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    let handLandmarker: HandLandmarker;
    let animationId = 0;
    let stream: MediaStream | undefined;
    let isActive = true;

    const ringImg = new Image();
    ringImg.src = imageSrc;
    ringImageRef.current = ringImg;

    async function setup() {
      const filesetResolver = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
      );

      handLandmarker = await HandLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
          delegate: "CPU",
        },
        runningMode: "VIDEO",
        numHands: 2,
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
      if (!isActive || !video || !canvas || !handLandmarker) {
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

      const results = handLandmarker.detectForVideo(video, performance.now());
      const ringImg = ringImageRef.current;

      if (ringImg?.complete && results.landmarks) {
        for (const landmarks of results.landmarks) {
          if (!landmarks?.[RING_LANDMARK_START_IDX] || !landmarks?.[RING_LANDMARK_END_IDX]) continue;

          const start = landmarks[RING_LANDMARK_START_IDX];
          const end = landmarks[RING_LANDMARK_END_IDX];
          const reference = landmarks[RING_THICKNESS_REF_IDX];

          const centerX = (start.x + end.x) / 2 * canvas.width;
          const centerY = (start.y + end.y) / 2 * canvas.height;
          const dx = (end.x - start.x) * canvas.width;
          const dy = (end.y - start.y) * canvas.height;
          const angle = Math.atan2(dy, dx);
          const thickness = Math.hypot(
            (reference.x - start.x) * canvas.width,
            (reference.y - start.y) * canvas.height,
          );
          const size = Math.max(24, thickness * RING_SIZE_MULT);

          ctx.save();
          ctx.translate(centerX, centerY);
          ctx.rotate(angle);
          ctx.drawImage(ringImg, -size / 2, -size * 0.35, size, size * 0.7);
          ctx.restore();
        }
      }

      if (isActive) {
        animationId = window.requestAnimationFrame(renderLoop);
      }
    }

    setup().catch((err) => {
      console.error("Ring try-on setup failed:", err);
      setLoading(false);
    });

    return () => {
      isActive = false;
      cancelAnimationFrame(animationId);
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [imageSrc]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{ position: "relative", width: 480, height: 640, margin: "0 auto" }}>
        {loading && <p style={{ textAlign: "center" }}>Loading camera & model...</p>}
        <video ref={videoRef} style={{ display: "none" }} playsInline muted />
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: "100%", borderRadius: 16, transform: "scaleX(-1)" }}
        />
      </div>
    </div>
  );
}
