import { cn } from "@/lib/utils";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { FilesetResolver, FaceLandmarker } from "@mediapipe/tasks-vision";
import { processOverlayImageToTransparentDataUrl, type FacePlacement } from "@/lib/lumimirror-overlay";

type JewelleryOverlayProps = {
  src: string;
  alt?: string;
  overlaySrc?: string;
  className?: string;
  overlayClassName?: string;
  overlayStyle?: CSSProperties;
  placement?: FacePlacement | null;
};

export function JewelleryOverlay({
  src,
  alt = "Try-on preview",
  overlaySrc,
  className,
  overlayClassName,
  overlayStyle,
  placement,
}: JewelleryOverlayProps) {
  const [processedOverlaySrc, setProcessedOverlaySrc] = useState<string | undefined>(overlaySrc);
  const previewRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);

  const drawOverlay = useMemo(() => {
    return async (reason: "initial" | "resize") => {
      const canvas = canvasRef.current;
      const previewElement = previewRef.current;

      if (!canvas || !previewElement || !processedOverlaySrc) {
        if (canvas) {
          const ctx = canvas.getContext("2d");
          ctx?.clearRect(0, 0, canvas.width, canvas.height);
        }
        return;
      }

      const rect = previewElement.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) {
        return;
      }

      const dpr = window.devicePixelRatio || 1;
      const cssWidth = Math.max(1, Math.round(rect.width));
      const cssHeight = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(cssWidth * dpr);
      canvas.height = Math.round(cssHeight * dpr);
      canvas.style.width = `${cssWidth}px`;
      canvas.style.height = `${cssHeight}px`;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cssWidth, cssHeight);

      const sourceImage = previewElement.querySelector("img") as HTMLImageElement | null;
      const overlayImage = new Image();
      overlayImage.src = processedOverlaySrc;
      await overlayImage.decode().catch(() => undefined);

      let landmarks: Array<{ x: number; y: number }> | null = null;
      const faceLandmarker = faceLandmarkerRef.current;

      if (faceLandmarker && sourceImage) {
        const imageElement = new Image();
        imageElement.src = src;
        await imageElement.decode().catch(() => undefined);

        try {
          const result = await faceLandmarker.detect(imageElement);
          landmarks = result.faceLandmarks?.[0] ?? null;
        } catch {
          landmarks = null;
        }
      }

      const leftJaw = landmarks?.[172] ?? { x: 0.46, y: 0.66 };
      const rightJaw = landmarks?.[397] ?? { x: 0.54, y: 0.66 };
      const chin = landmarks?.[152] ?? { x: 0.5, y: 0.66 };
      const leftEar = landmarks?.[454] ?? { x: 0.42, y: 0.56 };
      const rightEar = landmarks?.[234] ?? { x: 0.58, y: 0.56 };
      const nose = landmarks?.[1] ?? { x: 0.5, y: 0.52 };

      const jawDistance = Math.abs(rightJaw.x - leftJaw.x) * cssWidth;
      const neckWidthPx = Math.max(110, Math.min(cssWidth * 0.72, jawDistance * 0.98 + (placement?.neckWidth ?? 0.18) * cssWidth * 0.5));
      const neckHeightPx = Math.max(70, Math.min(cssHeight * 0.42, neckWidthPx * 0.7));
      const anchorX = placement?.anchorX ?? (leftJaw.x + rightJaw.x) / 2;
      const anchorY = placement?.anchorY ?? chin.y + (placement?.neckLength ?? 0.12) * 0.45 + (nose.y - chin.y) * 0.12;
      const centerX = anchorX * cssWidth;
      const centerY = anchorY * cssHeight + (placement?.neckLength ?? 0.12) * cssHeight * 0.35;
      const headTilt = Math.atan2(rightEar.y - leftEar.y, rightEar.x - leftEar.x);
      const rotationDegrees = (((placement?.rotationAngle ?? headTilt) * 180) / Math.PI) * 0.35;
      const perspectiveX = Math.max(-0.2, Math.min(0.2, headTilt * 0.16));
      const perspectiveY = Math.max(-0.08, Math.min(0.08, (chin.y - nose.y) * 0.25));
      const scale = Math.max(0.86, Math.min(1.16, 0.92 + (placement?.neckLength ?? 0.12) * 0.85 + (placement?.faceHeight ?? 0.2) * 0.2));

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate((rotationDegrees * Math.PI) / 180);
      ctx.scale(scale, scale);
      ctx.transform(1, perspectiveY, perspectiveX, 1, 0, 0);
      ctx.shadowColor = "rgba(15, 23, 42, 0.34)";
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 10;
      ctx.globalAlpha = 0.96;
      ctx.drawImage(overlayImage, -neckWidthPx / 2, -neckHeightPx / 2, neckWidthPx, neckHeightPx);
      ctx.restore();

      const fadeGradient = ctx.createLinearGradient(0, centerY - neckHeightPx / 2, 0, centerY - neckHeightPx / 2 + Math.min(26, neckHeightPx * 0.22));
      fadeGradient.addColorStop(0, "rgba(255, 255, 255, 0)");
      fadeGradient.addColorStop(1, "rgba(255, 255, 255, 0.28)");

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate((rotationDegrees * Math.PI) / 180);
      ctx.scale(scale, scale);
      ctx.transform(1, perspectiveY, perspectiveX, 1, 0, 0);
      ctx.globalAlpha = 0.94;
      ctx.fillStyle = fadeGradient;
      ctx.fillRect(-neckWidthPx / 2, -neckHeightPx / 2, neckWidthPx, Math.min(26, neckHeightPx * 0.22));
      ctx.restore();

      console.info("[LumiMirror] overlay draw", {
        redrawReason: reason,
        rotationDegrees: Number(rotationDegrees.toFixed(2)),
        scale: Number(scale.toFixed(3)),
        position: {
          x: Number(centerX.toFixed(2)),
          y: Number(centerY.toFixed(2)),
        },
        size: {
          width: Number(neckWidthPx.toFixed(2)),
          height: Number(neckHeightPx.toFixed(2)),
        },
        canvas: {
          width: Number(cssWidth.toFixed(2)),
          height: Number(cssHeight.toFixed(2)),
          clientWidth: Number(rect.width.toFixed(2)),
          clientHeight: Number(rect.height.toFixed(2)),
        },
      });
    };
  }, [placement, processedOverlaySrc, src]);

  useEffect(() => {
    let cancelled = false;

    if (!overlaySrc) {
      setProcessedOverlaySrc(undefined);
      return;
    }

    processOverlayImageToTransparentDataUrl(overlaySrc).then((result) => {
      if (!cancelled) {
        setProcessedOverlaySrc(result);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [overlaySrc]);

  useEffect(() => {
    let cancelled = false;

    async function initFaceLandmarker() {
      if (faceLandmarkerRef.current) {
        return;
      }

      const filesetResolver = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm",
      );

      const landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          delegate: "GPU",
        },
        runningMode: "IMAGE",
        numFaces: 1,
      });

      if (!cancelled) {
        faceLandmarkerRef.current = landmarker;
      }
    }

    initFaceLandmarker();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const previewElement = previewRef.current;

    if (!canvas || !previewElement) {
      return;
    }

    const redraw = () => {
      void drawOverlay("resize");
    };

    redraw();

    const resizeObserver = new ResizeObserver(() => {
      redraw();
    });
    resizeObserver.observe(previewElement);

    window.addEventListener("resize", redraw);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", redraw);
    };
  }, [drawOverlay]);

  return (
    <div ref={previewRef} className={cn("relative overflow-hidden rounded-[1.5rem] bg-muted", className)}>
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        onLoad={() => drawOverlay("initial")}
      />
      {processedOverlaySrc ? (
        <>
          {placement?.visibleNeck === false ? (
            <div className="pointer-events-none absolute left-3 right-3 top-3 rounded-full bg-black/60 px-3 py-2 text-center text-[11px] font-medium text-white">
              {placement.message}
            </div>
          ) : null}
          <canvas
            ref={canvasRef}
            className="pointer-events-none absolute inset-0 h-full w-full"
            style={{ ...overlayStyle }}
          />
        </>
      ) : null}
    </div>
  );
}
