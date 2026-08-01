import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";

function JewelleryIllustration() {
  return (
    <div className="relative flex h-32 w-32 items-center justify-center rounded-[1.5rem] border border-white/40 bg-white/20 p-3 shadow-[0_20px_60px_-18px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <div className="absolute inset-3 rounded-[1.2rem] border border-white/35" />
      <svg viewBox="0 0 180 180" className="relative h-full w-full" aria-hidden="true">
        <circle cx="90" cy="90" r="70" fill="rgba(255,255,255,0.16)" />
        <path d="M60 78c0-14 11-25 25-25h10c14 0 25 11 25 25v14c0 17-14 31-32 33-18-2-32-16-32-33V78Z" fill="rgba(255,255,255,0.75)" />
        <path d="M76 72c0-7 5-13 12-13h4c7 0 12 6 12 13v8c0 6-5 11-11 12-7-1-13-6-13-12v-8Z" fill="rgba(168,85,247,0.85)" />
        <path d="M82 62c-10 0-18 8-18 18v9c0 3 2 5 5 5h4c2 0 4-2 4-4v-7c0-5 4-9 9-9h6c5 0 9 4 9 9v7c0 2 2 4 4 4h4c3 0 5-2 5-5v-9c0-10-8-18-18-18h-6Z" fill="rgba(255,255,255,0.92)" />
        <ellipse cx="90" cy="132" rx="34" ry="13" fill="rgba(255,255,255,0.22)" />
      </svg>
    </div>
  );
}

export function TryOnBanner() {
  return (
    <Link
      to="/product/$id"
      params={{ id: "necklaces-1" }}
      className="group press mx-4 mt-4 block overflow-hidden rounded-[2rem] border border-white/60 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.25),_transparent_42%),linear-gradient(135deg,_#5b21b6_0%,_#8b5cf6_42%,_#f59e0b_100%)] p-5 text-white shadow-[0_24px_70px_-20px_rgba(91,33,182,0.55)]"
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/80 backdrop-blur">
            <Sparkles size={12} /> New · AI Powered
          </div>

          <h2 className="mt-4 text-[1.6rem] font-semibold leading-tight sm:text-[2rem]">
            See your next heirloom before you buy
          </h2>

          <p className="mt-2 max-w-lg text-sm leading-6 text-white/85 sm:text-[15px]">
            Try necklaces and earrings live with a refined preview experience that feels as polished as the jewellery itself.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90">
              Instant Preview
            </span>
            <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90">
              Luxury Fit
            </span>
            <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90">
              Smart Styling
            </span>
          </div>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition-transform duration-200 group-hover:translate-x-1">
            Explore the experience
            <ArrowRight size={16} />
          </div>
        </div>

        <div className="relative flex justify-center md:justify-end">
          <div className="absolute inset-0 rounded-[2rem] bg-white/10 blur-3xl" />
          <JewelleryIllustration />
        </div>
      </div>
    </Link>
  );
}