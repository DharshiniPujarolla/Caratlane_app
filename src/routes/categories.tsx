import { createFileRoute, Link } from "@tanstack/react-router";
import { categories, collections, occasionsList } from "@/lib/data";
import { SectionHeader } from "@/components/PageHeader";
import { TileCard } from "@/components/Cards";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Shop Jewellery Categories — LumiAura" },
      {
        name: "description",
        content:
          "Browse rings, earrings, pendants, necklaces, bracelets, bangles and chains in gold and diamond.",
      },
      { property: "og:title", content: "Shop Jewellery Categories — LumiAura" },
      {
        property: "og:description",
        content: "Rings, earrings, pendants, necklaces, bracelets and more.",
      },
    ],
  }),
  component: Categories,
});

function Categories() {
  return (
    <div className="space-y-7">
      <header className="glass sticky top-0 z-40 px-4 pb-3 pt-5">
        <h1 className="text-lg font-semibold">Categories</h1>
        <p className="text-xs text-muted-foreground">Find your next heirloom</p>
      </header>

      <div className="grid grid-cols-2 gap-3 px-4">
        {categories.map((c) => (
          <Link
            key={c.slug}
            to="/category/$slug"
            params={{ slug: c.slug }}
            className="press overflow-hidden rounded-2xl bg-card shadow-soft"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={c.image}
                alt={c.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            <p className="p-3 text-[13px] font-medium">{c.name}</p>
          </Link>
        ))}
      </div>

      <section>
        <SectionHeader title="Shop by Occasion" />
        <div className="no-scrollbar flex gap-3 overflow-x-auto px-4">
          {occasionsList.map((o) => (
            <TileCard key={o.name} title={o.name} image={o.image} to="/category/diamond" />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Curated Collections" />
        <div className="no-scrollbar flex gap-3 overflow-x-auto px-4">
          {collections.map((c) => (
            <TileCard
              key={c.id}
              title={c.name}
              caption={`${c.count} designs`}
              image={c.image}
              to="/category/gold"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
