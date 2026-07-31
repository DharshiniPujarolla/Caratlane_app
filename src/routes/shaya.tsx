import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Sparkles } from "lucide-react";
import shayaImg from "@/assets/brand-shaya.jpg";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/data";

export const Route = createFileRoute("/shaya")({
  head: () => ({
    meta: [
      { title: "SHAYA — Modern Silver Jewellery to Twin With Your Bestie" },
      {
        name: "description",
        content:
          "SHAYA silver jewellery: minimal, modern everyday pieces in silver and blue-green tones, made to twin with your bestie.",
      },
      { property: "og:title", content: "SHAYA — Modern Silver Jewellery" },
      {
        property: "og:description",
        content: "Minimal silver jewellery made to twin with your bestie.",
      },
    ],
  }),
  component: Shaya,
});

function Shaya() {
  const picks = products.slice(6, 16);

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-64 overflow-hidden">
        <img
          src={shayaImg}
          alt="Two friends wearing matching silver jewellery"
          width={1200}
          height={800}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.25_0.06_200_/_0.9)] via-transparent to-[oklch(0.25_0.06_200_/_0.35)]" />
        <Link
          to="/brands"
          className="glass press absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full"
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h1 className="font-display text-3xl font-bold tracking-[0.2em] text-primary-foreground">
            SHAYA
          </h1>
          <p className="mt-1 text-[11px] uppercase tracking-[0.25em] text-primary-foreground/85">
            Twin With Your Bestie
          </p>
        </div>
      </div>

      <div className="space-y-5 p-4">
        <div className="flex items-center gap-3 rounded-2xl bg-teal-soft p-4">
          <Sparkles size={18} className="text-teal" />
          <p className="text-[13px] font-medium text-foreground">
            925 silver · Modern minimal · Made for two
          </p>
        </div>

        <div>
          <h2 className="mb-3 text-base font-semibold">Bestie picks</h2>
          <div className="grid grid-cols-2 gap-3">
            {picks.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
