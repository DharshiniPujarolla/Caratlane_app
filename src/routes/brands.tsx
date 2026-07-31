import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import lumiauraImg from "@/assets/brand-lumiaura.jpg";
import shayaImg from "@/assets/brand-shaya.jpg";

export const Route = createFileRoute("/brands")({
  head: () => ({
    meta: [
      { title: "Choose your world — LumiAura & SHAYA" },
      {
        name: "description",
        content:
          "Pick your collection: LumiAura fine diamond and gold jewellery, or SHAYA modern silver jewellery for you and your bestie.",
      },
      { property: "og:title", content: "Choose your world — LumiAura & SHAYA" },
      {
        property: "og:description",
        content: "Two collections, one app: LumiAura fine jewellery and SHAYA silver.",
      },
    ],
  }),
  component: Brands,
});

function Brands() {
  return (
    <div className="flex h-[100svh] flex-col justify-center gap-4 overflow-hidden px-4 py-5">
      <p className="text-center text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
        Choose your world
      </p>

      <Link
        to="/"
        style={{ animationDelay: "60ms, 660ms" }}
        className="brand-card group relative block h-[38svh] overflow-hidden rounded-3xl shadow-float"
      >
        <img
          src={lumiauraImg}
          alt="LumiAura diamond and gold jewellery"
          width={1200}
          height={800}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06] group-active:scale-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-wide text-primary-foreground">
              LumiAura
            </h2>
            <p className="mt-1 text-[11px] uppercase tracking-[0.25em] text-gold-soft">
              Diamond & Gold
            </p>
          </div>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-float">
            <ArrowRight size={18} />
          </span>
        </div>
      </Link>

      <Link
        to="/shaya"
        style={{ animationDelay: "200ms, 800ms" }}
        className="brand-card group relative block h-[38svh] overflow-hidden rounded-3xl shadow-float"
      >
        <img
          src={shayaImg}
          alt="SHAYA silver jewellery for best friends"
          width={1200}
          height={800}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06] group-active:scale-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.25_0.06_200_/_0.85)] via-[oklch(0.25_0.06_200_/_0.25)] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-[0.2em] text-primary-foreground">
              SHAYA
            </h2>
            <p className="mt-1 text-[11px] uppercase tracking-[0.25em] text-primary-foreground/85">
              Twin With Your Bestie
            </p>
          </div>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal text-primary-foreground shadow-float">
            <ArrowRight size={18} />
          </span>
        </div>
      </Link>
    </div>
  );
}
