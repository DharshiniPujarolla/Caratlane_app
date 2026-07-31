import { cn } from "@/lib/utils";
import type { CSSProperties } from "react";

type JewelleryOverlayProps = {
  src: string;
  alt?: string;
  overlaySrc?: string;
  className?: string;
  overlayClassName?: string;
  overlayStyle?: CSSProperties;
};

export function JewelleryOverlay({
  src,
  alt = "Try-on preview",
  overlaySrc,
  className,
  overlayClassName,
  overlayStyle,
}: JewelleryOverlayProps) {
  return (
    <div className={cn("relative overflow-hidden rounded-[1.5rem] bg-muted", className)}>
      <img src={src} alt={alt} className="h-full w-full object-cover" />
      <img
        src={overlaySrc}
        alt="Jewellery overlay"
        className={cn(
          "pointer-events-none absolute inset-0 h-full w-full object-contain opacity-95",
          overlayClassName,
        )}
        style={overlayStyle}
      />
    </div>
  );
}
