import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import ringPng from "@/assets/splash-ring.png";

export const Route = createFileRoute("/splash")({
  head: () => ({
    meta: [
      { title: "LumiAura — Fine Jewellery" },
      { name: "description", content: "LumiAura fine jewellery. Everyday luxury, crafted to last." },
      { property: "og:title", content: "LumiAura — Fine Jewellery" },
      { property: "og:description", content: "Everyday luxury, crafted to last." },
    ],
  }),
  component: Splash,
});

const SPARKLES = [
  { top: "18%", left: "16%", size: 10, delay: "0s" },
  { top: "26%", left: "78%", size: 14, delay: "0.4s" },
  { top: "40%", left: "8%", size: 8, delay: "0.9s" },
  { top: "52%", left: "88%", size: 11, delay: "1.3s" },
  { top: "62%", left: "22%", size: 9, delay: "0.6s" },
  { top: "34%", left: "50%", size: 7, delay: "1.7s" },
  { top: "70%", left: "66%", size: 12, delay: "1.1s" },
  { top: "12%", left: "44%", size: 8, delay: "2s" },
];

function Sparkle({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 0c.8 6.2 5 10.4 12 12-7 1.6-11.2 5.8-12 12-.8-6.2-5-10.4-12-12C7 10.4 11.2 6.2 12 0Z"
        fill="white"
      />
    </svg>
  );
}

function Splash() {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => navigate({ to: "/brands" }), 2800);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden gradient-blush px-6">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-white/50 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-[-10%] h-64 w-64 rounded-full bg-gold-soft/70 blur-3xl" />

      {SPARKLES.map((s, i) => (
        <span
          key={i}
          className="pointer-events-none absolute animate-twinkle drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]"
          style={{ top: s.top, left: s.left, animationDelay: s.delay }}
        >
          <Sparkle size={s.size} />
        </span>
      ))}

      <div className="relative animate-soft-in">
        <div className="absolute inset-0 -z-10 mx-auto my-auto h-52 w-52 rounded-full bg-white/60 blur-2xl" />
        <div className="animate-float">
          <img
            src={ringPng}
            alt="Butterfly sapphire and diamond ring in white gold"
            width={1024}
            height={1024}
            className="h-56 w-56 object-contain drop-shadow-[0_18px_28px_rgba(120,60,90,0.25)]"
          />
          <span className="pointer-events-none absolute inset-0 animate-shine rounded-full" />
        </div>
      </div>

      <div className="animate-logo mt-4 text-center">
        <h1 className="text-3xl font-semibold tracking-[0.22em] text-foreground">LUMIAURA</h1>
        <p className="mt-3 text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
          Everyday Luxury
        </p>
      </div>

      <div className="mt-12 h-0.5 w-40 overflow-hidden rounded-full bg-foreground/10">
        <div className="h-full w-1/3 animate-[shimmer-move_1.4s_infinite_linear] bg-foreground/40" />
      </div>
    </div>
  );
}
