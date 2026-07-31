import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowUpDown, SlidersHorizontal, Star, X } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { ProductCard } from "@/components/ProductCard";
import { byCategory, categories, inr } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/category/$slug")({
  head: ({ params }) => {
    const name =
      categories.find((c) => c.slug === params.slug)?.name ?? "Jewellery";
    return {
      meta: [
        { title: `${name} — Buy Online | LumiAura` },
        {
          name: "description",
          content: `Shop ${name.toLowerCase()} in gold, diamond and platinum. Filter by price, metal, occasion and more.`,
        },
        { property: "og:title", content: `${name} — Buy Online | LumiAura` },
        {
          property: "og:description",
          content: `Shop ${name.toLowerCase()} with certified diamonds and lifetime exchange.`,
        },
      ],
    };
  },
  component: CategoryPage,
});

const sorts = ["Popularity", "Price: Low to High", "Price: High to Low", "Rating", "Newest"] as const;
const materials = ["Gold", "Diamond"] as const;
const metals = ["Yellow Gold", "Rose Gold", "White Gold", "Platinum"] as const;
const diamondTypes = ["Natural", "Lab Grown"] as const;
const genders = ["Women", "Men"] as const;
const occasionsF = ["Daily Wear", "Wedding", "Gifting", "Office Wear", "Festive"] as const;

function Chip({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "press shrink-0 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function CategoryPage() {
  const { slug } = Route.useParams();
  const base = byCategory(slug);
  const name = categories.find((c) => c.slug === slug)?.name ?? "Jewellery";

  const [sheet, setSheet] = useState<"filter" | "sort" | null>(null);
  const [sort, setSort] = useState<(typeof sorts)[number]>("Popularity");
  const [maxPrice, setMaxPrice] = useState(200000);
  const [material, setMaterial] = useState<string | null>(null);
  const [metal, setMetal] = useState<string | null>(null);
  const [dType, setDType] = useState<string | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const [occasion, setOccasion] = useState<string | null>(null);
  const [minRating, setMinRating] = useState(0);

  const list = useMemo(() => {
    let out = base.filter(
      (p) =>
        p.price <= maxPrice &&
        (!material || p.material === material) &&
        (!metal || p.metal === metal) &&
        (!dType || p.diamondType === dType) &&
        (!gender || p.gender === gender) &&
        (!occasion || p.occasion.includes(occasion)) &&
        p.rating >= minRating,
    );
    if (sort === "Price: Low to High") out = [...out].sort((a, b) => a.price - b.price);
    if (sort === "Price: High to Low") out = [...out].sort((a, b) => b.price - a.price);
    if (sort === "Rating") out = [...out].sort((a, b) => b.rating - a.rating);
    return out;
  }, [base, maxPrice, material, metal, dType, gender, occasion, minRating, sort]);

  const activeCount = [material, metal, dType, gender, occasion].filter(Boolean).length;

  const reset = () => {
    setMaterial(null);
    setMetal(null);
    setDType(null);
    setGender(null);
    setOccasion(null);
    setMinRating(0);
    setMaxPrice(200000);
  };

  return (
    <div className="min-h-screen">
      <PageHeader title={name} subtitle={`${list.length} designs`} />

      <div className="no-scrollbar sticky top-[57px] z-30 flex gap-2 overflow-x-auto bg-background/95 px-4 py-3 backdrop-blur">
        {categories.map((c) => (
          <Link key={c.slug} to="/category/$slug" params={{ slug: c.slug }}>
            <Chip active={c.slug === slug}>{c.name}</Chip>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 px-4 pb-4">
        {list.map((p) => (
          <div key={p.id} className="animate-fade-up">
            <ProductCard product={p} />
          </div>
        ))}
        {list.length === 0 && (
          <p className="col-span-2 py-16 text-center text-sm text-muted-foreground">
            No designs match these filters.
          </p>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-24 z-40 mx-auto flex max-w-[480px] justify-center gap-2 px-4">
        <button
          onClick={() => setSheet("sort")}
          className="press glass flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold shadow-float"
        >
          <ArrowUpDown size={15} /> Sort
        </button>
        <button
          onClick={() => setSheet("filter")}
          className="press flex items-center gap-2 rounded-full gradient-primary px-5 py-2.5 text-[13px] font-semibold text-primary-foreground shadow-float"
        >
          <SlidersHorizontal size={15} /> Filter
          {activeCount > 0 && (
            <span className="rounded-full bg-background/25 px-1.5 text-[11px]">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {sheet && (
        <div className="fixed inset-0 z-50 mx-auto max-w-[480px]">
          <div
            className="absolute inset-0 bg-black/40 animate-soft-in"
            onClick={() => setSheet(null)}
          />
          <div className="animate-fade-up absolute inset-x-0 bottom-0 max-h-[78vh] overflow-y-auto rounded-t-3xl bg-background p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold">
                {sheet === "sort" ? "Sort by" : "Filters"}
              </h3>
              <button onClick={() => setSheet(null)} aria-label="Close">
                <X size={18} />
              </button>
            </div>

            {sheet === "sort" ? (
              <div className="space-y-1">
                {sorts.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setSort(s);
                      setSheet(null);
                    }}
                    className={cn(
                      "press w-full rounded-xl px-3 py-3 text-left text-sm",
                      sort === s ? "bg-primary-soft font-semibold text-primary" : "bg-card",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-5 pb-4">
                <div>
                  <p className="mb-2 text-[13px] font-semibold">
                    Price range · up to {inr(maxPrice)}
                  </p>
                  <input
                    type="range"
                    min={10000}
                    max={200000}
                    step={5000}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-[oklch(0.42_0.18_305)]"
                  />
                </div>
                {[
                  { label: "Material", opts: materials, val: material, set: setMaterial },
                  { label: "Metal Colour", opts: metals, val: metal, set: setMetal },
                  { label: "Diamond Type", opts: diamondTypes, val: dType, set: setDType },
                  { label: "Gender", opts: genders, val: gender, set: setGender },
                  { label: "Occasion", opts: occasionsF, val: occasion, set: setOccasion },
                ].map((g) => (
                  <div key={g.label}>
                    <p className="mb-2 text-[13px] font-semibold">{g.label}</p>
                    <div className="flex flex-wrap gap-2">
                      {g.opts.map((o) => (
                        <Chip
                          key={o}
                          active={g.val === o}
                          onClick={() => g.set(g.val === o ? null : (o as string))}
                        >
                          {o}
                        </Chip>
                      ))}
                    </div>
                  </div>
                ))}
                <div>
                  <p className="mb-2 text-[13px] font-semibold">Customer rating</p>
                  <div className="flex gap-2">
                    {[4, 4.5, 4.8].map((r) => (
                      <Chip key={r} active={minRating === r} onClick={() => setMinRating(minRating === r ? 0 : r)}>
                        <span className="flex items-center gap-1">
                          {r} <Star size={11} className="fill-gold text-gold" /> & up
                        </span>
                      </Chip>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={reset}
                    className="press flex-1 rounded-xl border border-border py-3 text-sm font-semibold"
                  >
                    Clear all
                  </button>
                  <button
                    onClick={() => setSheet(null)}
                    className="press flex-1 rounded-xl gradient-primary py-3 text-sm font-semibold text-primary-foreground"
                  >
                    Show {list.length} designs
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
