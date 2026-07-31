import { useEffect, useRef, useState } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import necklaceImgSrc1 from "@/assets/necklace-tryon.png";
import necklaceImgSrc2 from "@/assets/necklace-tryon-2.png";
import earringImgSrc from "@/assets/earring-tryon.png";

// 🔧 Tune these while testing — save & it hot-reloads instantly
const NECKLACE_WIDTH_MULT = 1.15;      // bigger = wider necklace
const NECKLACE_HEIGHT_RATIO = 0.6;    // bigger = taller necklace
const NECKLACE_VERTICAL_GAP = 0.015;  // fraction of video height below chin — try 0, or even -0.01 to pull UP
const EARRING_SIZE_MULT = 0.055;      // bigger = bigger earrings

interface VirtualTryOnProps {
  showNecklace?: boolean;
  showEarring?: boolean;
}

export default function VirtualTryOn({ showNecklace = true, showEarring = true }: VirtualTryOnProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [necklaceStyle, setNecklaceStyle] = useState<1 | 2>(1);
  const necklaceImg1Ref = useRef<HTMLImageElement | null>(null);
  const necklaceImg2Ref = useRef<HTMLImageElement | null>(null);
  const earringImageRef = useRef<HTMLImageElement | null>(null);
  const necklaceStyleRef = useRef(necklaceStyle);
  necklaceStyleRef.current = necklaceStyle;

  useEffect(() => {
    let faceLandmarker: FaceLandmarker;
    let animationId: number;

    const n1 = new Image();
    n1.src = necklaceImgSrc1;
    necklaceImg1Ref.current = n1;

    const n2 = new Image();
    n2.src = necklaceImgSrc2;
    necklaceImg2Ref.current = n2;

    const earringImg = new Image();
    earringImg.src = earringImgSrc;
    earringImageRef.current = earringImg;

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

      const stream = await navigator.mediaDevices.getUserMedia({
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
        animationId = requestAnimationFrame(renderLoop);
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const results = faceLandmarker.detectForVideo(video, performance.now());

      if (results.faceLandmarks.length > 0) {
        const landmarks = results.faceLandmarks[0];

        const leftEar = landmarks[454];
        const rightEar = landmarks[234];
        const chin = landmarks[152];
        const leftJaw = landmarks[172];
        const rightJaw = landmarks[397];

        if (showEarring && earringImageRef.current?.complete) {
          const size = canvas.width * EARRING_SIZE_MULT;
          ctx.drawImage(earringImageRef.current, leftEar.x * canvas.width - size / 2, leftEar.y * canvas.height, size, size * 1.4);
          ctx.drawImage(earringImageRef.current, rightEar.x * canvas.width - size / 2, rightEar.y * canvas.height, size, size * 1.4);
        }

        if (showNecklace) {
          const activeImg = necklaceStyleRef.current === 1 ? necklaceImg1Ref.current : necklaceImg2Ref.current;
          if (activeImg?.complete) {
            const jawWidth = Math.abs(rightJaw.x - leftJaw.x) * canvas.width;
            const width = jawWidth * NECKLACE_WIDTH_MULT;
            const height = width * NECKLACE_HEIGHT_RATIO;
            const topY = chin.y * canvas.height + NECKLACE_VERTICAL_GAP * canvas.height;

            ctx.drawImage(activeImg, chin.x * canvas.width - width / 2, topY, width, height);
          }
        }
      }

      animationId = requestAnimationFrame(renderLoop);
    }

    setup();

    return () => {
      cancelAnimationFrame(animationId);
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [showNecklace, showEarring]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{ position: "relative", width: 480, height: 640, margin: "0 auto" }}>
        {loading && <p style={{ textAlign: "center" }}>Loading camera & model...</p>}
        <video ref={videoRef} style={{ display: "none" }} playsInline muted />
        <canvas ref={canvasRef} style={{ width: "100%", height: "100%", borderRadius: 16, transform: "scaleX(-1)" }} />
      </div>

      {showNecklace && (
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => setNecklaceStyle(1)}
            style={{
              padding: "8px 16px",
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 600,
              background: necklaceStyle === 1 ? "#a855f7" : "#2a2a2a",
              color: "#fff",
              border: "none",
            }}
          >
            Style 1
          </button>
          <button
            onClick={() => setNecklaceStyle(2)}
            style={{
              padding: "8px 16px",
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 600,
              background: necklaceStyle === 2 ? "#a855f7" : "#2a2a2a",
              color: "#fff",
              border: "none",
            }}
          >
            Style 2
          </button>
        </div>
      )}
    </div>
  );
}