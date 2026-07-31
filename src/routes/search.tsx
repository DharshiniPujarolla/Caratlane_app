import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Camera, Clock, Mic, Search, TrendingUp, X } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { ProductCard } from "@/components/ProductCard";
import { products, trendingSearches } from "@/lib/data";
import { actions, useStore } from "@/lib/store";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search Jewellery — LumiAura" },
      { name: "description", content: "Search rings, earrings, chains and more. Try voice or image search." },
      { property: "og:title", content: "Search Jewellery — LumiAura" },
      { property: "og:description", content: "Find your next piece with text, voice or image search." },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const recent = useStore((s) => s.recentSearches);
  const results = q.trim()
    ? products.filter((p) =>
        (p.name + p.category + p.metal + p.material).toLowerCase().includes(q.toLowerCase()),
      )
    : [];

  return (
    <div className="min-h-screen">
      <PageHeader title="Search" />
      <div className="sticky top-[57px] z-30 bg-background px-4 py-3">
        <div className="flex items-center gap-2 rounded-full border border-border bg-muted/60 px-4 py-2.5">
          <Search size={16} className="text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && actions.search(q)}
            placeholder="Search for rings, earrings, gold chains…"
            className="flex-1 bg-transparent text-[13px] outline-none"
          />
          {q ? (
            <button onClick={() => setQ("")} aria-label="Clear">
              <X size={15} className="text-muted-foreground" />
            </button>
          ) : (
            <>
              <button aria-label="Voice search" className="press text-primary">
                <Mic size={16} />
              </button>
              <button aria-label="Image search" className="press text-primary">
                <Camera size={16} />
              </button>
            </>
          )}
        </div>
      </div>

      {q ? (
        <div className="grid grid-cols-2 gap-3 px-4 pb-4">
          {results.map((p) => (
            <div key={p.id} className="animate-fade-up">
              <ProductCard product={p} />
            </div>
          ))}
          {results.length === 0 && (
            <p className="col-span-2 py-20 text-center text-sm text-muted-foreground">
              No results for “{q}”
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-6 px-4 pb-6">
          {recent.length > 0 && (
            <section>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[13px] font-semibold">Recent searches</p>
                <button onClick={actions.clearSearches} className="text-[11px] font-semibold text-primary">
                  Clear
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recent.map((r) => (
                  <button
                    key={r}
                    onClick={() => setQ(r)}
                    className="press flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-[12px]"
                  >
                    <Clock size={12} className="text-muted-foreground" /> {r}
                  </button>
                ))}
              </div>
            </section>
          )}

          <section>
            <p className="mb-2 text-[13px] font-semibold">Trending searches</p>
            <div className="flex flex-wrap gap-2">
              {trendingSearches.map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setQ(t);
                    actions.search(t);
                  }}
                  className="press flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1.5 text-[12px] font-medium text-primary"
                >
                  <TrendingUp size={12} /> {t}
                </button>
              ))}
            </div>
          </section>

          <section>
            <p className="mb-2 text-[13px] font-semibold">Popular right now</p>
            <div className="grid grid-cols-2 gap-3">
              {products.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>

          <button
            onClick={() => navigate({ to: "/categories" })}
            className="press w-full rounded-xl border border-border py-3 text-[13px] font-semibold text-primary"
          >
            Browse all categories
          </button>
          <Link to="/stores" className="sr-only">
            Stores
          </Link>
        </div>
      )}
    </div>
  );
}
