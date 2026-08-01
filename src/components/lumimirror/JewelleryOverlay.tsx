import { cn } from "@/lib/utils";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { processOverlayImageToTransparentDataUrl } from "@/lib/lumimirror-overlay";

type JewelleryOverlayProps = {
  src: string;
  alt?: string;
  overlaySrc?: string;
  className?: string;
  overlayClassName?: string;
  overlayStyle?: CSSProperties;
  placement?: {
    neckWidth: number;
    anchorX: number;
    anchorY: number;
    faceHeight: number;
    chinY: number;
    neckLength: number;
    visibleNeck: boolean;
    message?: string;
  } | null;
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

  const drawOverlay = useMemo(() => {
    return (reason: "initial" | "resize") => {
      const canvas = canvasRef.current;
      const previewElement = previewRef.current;

      if (!canvas || !previewElement || !placement || !processedOverlaySrc) {
        if (canvas) {
          const ctx = canvas.getContext("2d");
          ctx?.clearRect(0, 0, canvas.width, canvas.height);
        }
        return;
      }

      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) {
        return;
      }

      const canvasWidth = Math.max(1, Math.round(rect.width));
      const canvasHeight = Math.max(1, Math.round(rect.height));
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }

      const widthPx = Math.max(80, placement.neckWidth * canvas.width);
      const leftPx = Math.max(0, Math.min(canvas.width - widthPx, (placement.anchorX - placement.neckWidth / 2) * canvas.width));
      const chinPixelY = placement.chinY * canvas.height;
      const neckLengthPixels = placement.neckLength * canvas.height;
      const finalY = chinPixelY + neckLengthPixels;
      const heightPx = Math.max(80, Math.min(canvas.height * 0.55, placement.neckLength * canvas.height * 1.4));

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const overlayImage = new Image();
      overlayImage.onload = () => {
        console.info("[LumiMirror] overlay canvas draw", {
          redrawReason: reason,
          canvasElement: canvas.tagName,
          canvasId: canvas.id || "(none)",
          canvasPropertyUsed: "canvas.width / canvas.height",
          canvasWidth: Number(canvas.width.toFixed(2)),
          canvasHeight: Number(canvas.height.toFixed(2)),
          clientWidth: Number(canvas.clientWidth.toFixed(2)),
          clientHeight: Number(canvas.clientHeight.toFixed(2)),
          renderedWidth: Number(rect.width.toFixed(2)),
          renderedHeight: Number(rect.height.toFixed(2)),
          drawImageArgs: {
            sx: 0,
            sy: 0,
            sw: overlayImage.width,
            sh: overlayImage.height,
            dx: Number(leftPx.toFixed(2)),
            dy: Number(finalY.toFixed(2)),
            dw: Number(widthPx.toFixed(2)),
            dh: Number(heightPx.toFixed(2)),
          },
          normalized: {
            anchorX: Number(placement.anchorX.toFixed(4)),
            anchorY: Number(placement.anchorY.toFixed(4)),
            neckLength: Number(placement.neckLength.toFixed(4)),
            faceHeight: Number(placement.faceHeight.toFixed(4)),
            neckWidth: Number(placement.neckWidth.toFixed(4)),
            chinY: Number(placement.chinY.toFixed(4)),
          },
          pixel: {
            chinPixelY: Number(chinPixelY.toFixed(2)),
            neckLengthPixels: Number(neckLengthPixels.toFixed(2)),
            finalY: Number(finalY.toFixed(2)),
            x: Number(leftPx.toFixed(2)),
            width: Number(widthPx.toFixed(2)),
            height: Number(heightPx.toFixed(2)),
          },
        });

        ctx.drawImage(overlayImage, leftPx, finalY, widthPx, heightPx);
      };

      overlayImage.src = processedOverlaySrc;
    };
  }, [placement, processedOverlaySrc]);

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
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    drawOverlay("initial");

    const resizeObserver = new ResizeObserver(() => {
      drawOverlay("resize");
    });
    resizeObserver.observe(canvas);

    window.addEventListener("resize", () => {
      drawOverlay("resize");
    });

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", () => {
        drawOverlay("resize");
      });
    };
  }, [drawOverlay]);

  return (
    <div ref={previewRef} className={cn("relative overflow-hidden rounded-[1.5rem] bg-muted", className)}>
      <img src={src} alt={alt} className="h-full w-full object-cover" />
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
