import { Link } from "@tanstack/react-router";
import { Camera, Sparkles, Upload } from "lucide-react";

export function LumiMirrorCard() {
  return (
    <div className="overflow-hidden rounded-3xl gradient-primary p-5 text-primary-foreground shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-gold-soft" />
            <p className="text-[11px] uppercase tracking-[0.3em] text-primary-foreground/80">
              LumiMirror
            </p>
          </div>
          <h3 className="mt-2 text-lg font-semibold leading-snug">
            See how your look changes with a tap
          </h3>
          <p className="mt-1 text-sm text-primary-foreground/80">
            Try on styles instantly with your camera or a selfie.
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Link
          to="/lumimirror"
          className="press inline-flex items-center justify-center rounded-full bg-background px-4 py-2.5 text-sm font-semibold text-primary"
        >
          <Camera size={16} className="mr-2" />
          Open Camera
        </Link>
        <Link
          to="/lumimirror"
          className="press inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          <Upload size={16} className="mr-2" />
          Upload Selfie
        </Link>
      </div>
    </div>
  );
}
