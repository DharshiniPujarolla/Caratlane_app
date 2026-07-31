import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

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

function Splash() {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => navigate({ to: "/auth" }), 2400);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gradient-primary px-6 text-primary-foreground">
      <div className="animate-logo text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/30 bg-white/10">
          <span className="font-display text-2xl font-semibold">L</span>
        </div>
        <h1 className="text-3xl font-semibold tracking-[0.22em]">LUMIAURA</h1>
        <p className="mt-3 text-[11px] uppercase tracking-[0.35em] opacity-80">
          Everyday Luxury
        </p>
      </div>
      <div className="mt-14 h-0.5 w-40 overflow-hidden rounded-full bg-white/20">
        <div className="h-full w-1/3 animate-[shimmer-move_1.4s_infinite_linear] bg-white/80" />
      </div>
    </div>
  );
}
