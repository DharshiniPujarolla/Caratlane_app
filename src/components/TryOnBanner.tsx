import { Link } from "@tanstack/react-router";
import { Camera, Sparkles } from "lucide-react";

export function TryOnBanner() {
  return (
    <Link
      to="/product/$id"
      params={{ id: "necklaces-1" }}
      className="press mx-4 mt-4 block h-full min-h-[220px] flex flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-r from-purple-700 via-fuchsia-600 to-amber-500 p-4 text-white shadow-card"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/80">
            <Sparkles size={12} /> New · AI Powered
          </div>
          <p className="text-[16px] font-bold leading-tight">Try It On, Instantly</p>
          <p className="mt-0.5 text-[12px] text-white/85">
            See necklaces & earrings on you — live, before you buy
          </p>
        </div>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/20">
          <Camera size={22} />
        </div>
      </div>
    </Link>
  );
}