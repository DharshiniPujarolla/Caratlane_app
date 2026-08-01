import { Link } from "@tanstack/react-router";
import { Sparkles, Upload } from "lucide-react";

function MirrorIllustration() {
  return (
    <div className="relative flex h-28 w-28 items-center justify-center rounded-[1.4rem] border border-white/60 bg-[linear-gradient(135deg,_rgba(255,255,255,0.78),_rgba(255,255,255,0.28))] p-3 shadow-[0_20px_50px_-20px_rgba(91,33,182,0.45)]">
      <div className="absolute inset-2 rounded-[1.1rem] border border-violet-200/70" />
      <svg viewBox="0 0 180 180" className="relative h-full w-full" aria-hidden="true">
        <rect x="42" y="34" width="96" height="112" rx="24" fill="rgba(91,33,182,0.08)" />
        <circle cx="90" cy="90" r="38" fill="rgba(255,255,255,0.9)" />
        <path d="M70 82c8-16 32-22 46-12 8 6 12 16 12 27 0 12-8 22-20 27-7 3-16 3-23 0-10-4-17-13-17-24 0-7 2-13 2-18Z" fill="rgba(168,85,247,0.8)" />
        <path d="M82 62c5-6 13-8 20-6 8 2 13 8 13 15v7c0 3-2 5-5 5h-8c-5 0-9-4-9-9v-8c0-2-2-4-4-4h-4c-2 0-3 1-3 3Z" fill="rgba(255,255,255,0.92)" />
        <path d="M56 54c6-8 18-12 28-10" stroke="rgba(91,33,182,0.38)" strokeWidth="6" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function LumiMirrorCard() {
  return (
    <div className="group relative overflow-hidden rounded-[2rem] border border-white/70 bg-[linear-gradient(135deg,_rgba(255,255,255,0.98),_rgba(248,244,255,0.95))] p-5 text-slate-900 shadow-[0_24px_70px_-24px_rgba(91,33,182,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_80px_-22px_rgba(91,33,182,0.38)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(168,85,247,0.12),_transparent_38%)]" />

      <div className="relative flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-violet-700">
            <Sparkles size={12} /> LumiMirror
          </div>

          <h3 className="mt-3 text-[1.3rem] font-semibold leading-tight sm:text-[1.5rem]">
            Try your look with a smart mirror in seconds
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-[15px]">
            Preview jewellery instantly with a selfie and let the experience feel effortless, polished, and luxurious.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-violet-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-700">
              AI Powered
            </span>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-700">
              Instant Preview
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-700">
              Smart Mirror
            </span>
          </div>
        </div>

        <div className="hidden sm:flex">
          <MirrorIllustration />
        </div>
      </div>

      <div className="relative mt-5 flex flex-wrap items-center gap-3">
        <Link
          to="/lumimirror"
          className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-violet-700 via-fuchsia-600 to-pink-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_-12px_rgba(168,85,247,0.85)] transition-all duration-200 hover:translate-y-[-1px]"
        >
          <Upload size={16} className="mr-2" />
          Open Smart Mirror
        </Link>

        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
          <Sparkles size={15} className="text-violet-600" />
          Crafted for effortless styling
        </div>
      </div>
    </div>
  );
}