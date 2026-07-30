import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ChevronRight,
  Heart,
  PlayCircle,
  Ruler,
  Share2,
  ShieldCheck,
  Star,
  Truck,
  ZoomIn,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader, SectionHeader } from "@/components/PageHeader";
import { ProductCard } from "@/components/ProductCard";
import { ReviewCard } from "@/components/Cards";
import type { Product } from "@/lib/data";
import { discount, findProduct, inr, offers, products, reviewsData } from "@/lib/data";
import { actions, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }): { product: Product } => {
    const product = findProduct(params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return { meta: [{ title: "Unavailable — Luméa" }, { name: "robots", content: "noindex" }] };
    const p = loaderData.product;
    return {
      meta: [
        { title: `${p.name} — ${inr(p.price)} | Luméa` },
        { name: "description", content: `${p.name} in ${p.purity} ${p.metal}. ${p.description.slice(0, 110)}` },
        { property: "og:title", content: `${p.name} — Luméa` },
        { property: "og:description", content: `${p.purity} ${p.metal} · ${inr(p.price)}` },
      ],
    };
  },
  component: ProductPage,
});

const ringSizes = ["10", "12", "14", "16", "18", "20"];

function ProductPage() {
  const { product } = Route.useLoaderData();
  const navigate = useNavigate();
  const saved = useStore((s) => s.wishlist.includes(product.id));
  const [slide, setSlide] = useState(0);
  const [size, setSize] = useState(ringSizes[2]);
  const [zoom, setZoom] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [tab, setTab] = useState<"details" | "reviews">("details");

  useEffect(() => {
    actions.view(product.id);
    setSlide(0);
  }, [product.id]);

  const similar = products.filter((p) => p.category === product.category && p.id !== product.id);
  const recent = useStore((s) => s.recentlyViewed)
    .filter((id) => id !== product.id)
    .map(findProduct)
    .filter(Boolean)
    .slice(0, 6);
  const emi = Math.round(product.price / 6);

  return (
    <div className="min-h-screen pb-28">
      <PageHeader
        title={product.category}
        right={
          <button
            onClick={() => toast.success("Product link copied")}
            aria-label="Share"
            className="press flex h-9 w-9 items-center justify-center rounded-full bg-secondary"
          >
            <Share2 size={16} />
          </button>
        }
      />

      <div className="relative">
        <div
          onScroll={(e) => setSlide(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto bg-muted"
        >
          {product.gallery.map((g, i) => (
            <button
              key={i}
              onClick={() => setZoom(true)}
              className="relative aspect-square w-full shrink-0 snap-center"
            >
              <img src={g} alt={`${product.name} view ${i + 1}`} className="h-full w-full object-cover" />
              {i === 3 && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/25 text-primary-foreground">
                  <PlayCircle size={44} strokeWidth={1.4} />
                </span>
              )}
            </button>
          ))}
        </div>
        <span className="glass absolute bottom-3 right-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium">
          <ZoomIn size={12} /> Tap to zoom
        </span>
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          {product.gallery.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === slide ? "w-4 bg-primary" : "w-1.5 bg-background/80",
              )}
            />
          ))}
        </div>
      </div>

      {zoom && (
        <div
          className="fixed inset-0 z-50 mx-auto flex max-w-[480px] items-center justify-center bg-black/90 animate-soft-in"
          onClick={() => setZoom(false)}
        >
          <img
            src={product.gallery[slide]}
            alt={product.name}
            className="w-full scale-125 object-contain transition-transform duration-500"
          />
        </div>
      )}

      <div className="space-y-5 px-4 pt-4">
        <div>
          <h1 className="text-[17px] font-semibold leading-snug">{product.name}</h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {product.purity} {product.metal} · {product.weight}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-[color:var(--success)]">
              <Star size={11} className="fill-current" /> {product.rating}
            </span>
            <span className="text-[11px] text-muted-foreground">
              {product.reviews} ratings & reviews
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-xl font-semibold">{inr(product.price)}</span>
            <span className="text-sm text-muted-foreground line-through">{inr(product.mrp)}</span>
            <span className="text-sm font-semibold text-primary">{discount(product)}% off</span>
          </div>
          <p className="text-[11px] text-muted-foreground">Inclusive of all taxes</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-3">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-semibold">Size</p>
            <button
              onClick={() => setShowGuide(true)}
              className="flex items-center gap-1 text-[12px] font-semibold text-primary"
            >
              <Ruler size={13} /> Size guide
            </button>
          </div>
          <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
            {ringSizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={cn(
                  "press h-10 w-10 shrink-0 rounded-full border text-[13px] font-medium",
                  size === s
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card",
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2 rounded-2xl border border-border bg-card p-3 text-[12px]">
          <p className="flex items-center gap-2">
            <Truck size={15} className="text-primary" /> Delivered by{" "}
            <b className="font-semibold">06 Aug 2026</b> · Free shipping
          </p>
          <p className="flex items-center gap-2">
            <ShieldCheck size={15} className="text-primary" /> BIS hallmarked · Lifetime
            exchange · 15-day returns
          </p>
          <p className="text-muted-foreground">
            EMI from <b className="font-semibold text-foreground">{inr(emi)}/month</b> for 6 months
          </p>
        </div>

        <div className="space-y-2">
          {offers.slice(0, 2).map((o) => (
            <div
              key={o.code}
              className="flex items-center justify-between rounded-2xl border border-dashed border-primary/30 bg-primary-soft/60 px-3 py-2.5"
            >
              <div>
                <p className="text-[12px] font-semibold">{o.title}</p>
                <p className="text-[11px] text-muted-foreground">{o.desc}</p>
              </div>
              <span className="text-[11px] font-semibold tracking-wider text-primary">
                {o.code}
              </span>
            </div>
          ))}
        </div>

        <div>
          <div className="flex gap-2">
            {(["details", "reviews"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "press rounded-full px-4 py-1.5 text-[12px] font-semibold capitalize",
                  tab === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                )}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === "details" ? (
            <div className="mt-3 space-y-3">
              <p className="text-[13px] leading-relaxed text-muted-foreground">
                {product.description}
              </p>
              <dl className="grid grid-cols-2 gap-2 text-[12px]">
                {[
                  ["Metal", product.metal],
                  ["Purity", product.purity],
                  ["Gross weight", product.weight],
                  ["Diamond", product.diamondType === "None" ? "—" : `${product.diamondType} · VS/SI`],
                  ["Stone count", product.diamondType === "None" ? "—" : "18"],
                  ["Gender", product.gender],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-xl bg-muted/70 px-3 py-2">
                    <dt className="text-[11px] text-muted-foreground">{k}</dt>
                    <dd className="font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              <div className="flex items-center gap-4 rounded-2xl bg-muted/70 p-3">
                <div className="text-center">
                  <p className="text-2xl font-semibold">{product.rating}</p>
                  <div className="flex justify-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={11}
                        className={i < Math.round(product.rating) ? "fill-gold text-gold" : "text-border"}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground">{product.reviews} ratings</p>
                </div>
                <div className="flex-1 space-y-1">
                  {[78, 15, 4, 2, 1].map((pct, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-3 text-[10px] text-muted-foreground">{5 - i}</span>
                      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                        <span className="block h-full rounded-full bg-gold" style={{ width: `${pct}%` }} />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              {reviewsData.map((r) => (
                <ReviewCard key={r.id} {...r} />
              ))}
            </div>
          )}
        </div>
      </div>

      <section className="mt-8">
        <SectionHeader title="Similar Products" />
        <div className="no-scrollbar flex gap-3 overflow-x-auto px-4">
          {similar.map((p) => (
            <ProductCard key={p.id} product={p} wide />
          ))}
        </div>
      </section>

      {recent.length > 0 && (
        <section className="mt-7">
          <SectionHeader title="Recently Viewed" />
          <div className="no-scrollbar flex gap-3 overflow-x-auto px-4">
            {recent.map((p) => p && <ProductCard key={p.id} product={p} wide />)}
          </div>
        </section>
      )}

      {showGuide && (
        <div className="fixed inset-0 z-50 mx-auto max-w-[480px]">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowGuide(false)} />
          <div className="animate-fade-up absolute inset-x-0 bottom-0 rounded-t-3xl bg-background p-5">
            <h3 className="text-base font-semibold">Ring size guide</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Measure the inner diameter of a ring that fits you well.
            </p>
            <div className="mt-3 divide-y divide-border rounded-2xl border border-border">
              {[
                ["10", "49.3 mm", "15.7 mm"],
                ["12", "51.8 mm", "16.5 mm"],
                ["14", "54.4 mm", "17.3 mm"],
                ["16", "56.9 mm", "18.1 mm"],
                ["18", "59.5 mm", "18.9 mm"],
                ["20", "62.1 mm", "19.8 mm"],
              ].map(([s, c, d]) => (
                <div key={s} className="flex justify-between px-3 py-2 text-[12px]">
                  <span className="font-medium">Size {s}</span>
                  <span className="text-muted-foreground">{c} circumference</span>
                  <span className="text-muted-foreground">{d}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowGuide(false)}
              className="press mt-4 w-full rounded-xl gradient-primary py-3 text-sm font-semibold text-primary-foreground"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      <div className="glass fixed inset-x-0 bottom-0 z-40 mx-auto flex max-w-[480px] items-center gap-2 border-t border-border/60 px-3 py-3 pb-4">
        <button
          onClick={() => {
            actions.toggleWishlist(product.id);
            toast.success(saved ? "Removed from wishlist" : "Saved to wishlist");
          }}
          aria-label="Wishlist"
          className="press flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card"
        >
          <Heart size={18} className={saved ? "fill-primary text-primary" : ""} />
        </button>
        <button
          onClick={() => {
            actions.addToCart(product.id, size);
            toast.success("Added to bag");
          }}
          className="press h-11 flex-1 rounded-xl border border-primary text-[13px] font-semibold text-primary"
        >
          Add to Cart
        </button>
        <button
          onClick={() => {
            actions.addToCart(product.id, size);
            navigate({ to: "/checkout" });
          }}
          className="press h-11 flex-1 rounded-xl gradient-primary text-[13px] font-semibold text-primary-foreground"
        >
          Buy Now
        </button>
      </div>

      <Link to="/stores" className="sr-only">
        Store locator
      </Link>
      <ChevronRight className="hidden" />
    </div>
  );
}
