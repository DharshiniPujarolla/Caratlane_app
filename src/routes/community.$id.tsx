import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { ProductCard } from "@/components/ProductCard";
import { leaderboard, inspirations } from "@/lib/styleMissions";
import { products } from "@/lib/data";

export const Route = createFileRoute("/community/$id")({
  loader: ({ params }) => {
    const user = leaderboard.find((u) => String(u.rank) === params.id);
    if (!user) throw notFound();

    const userInspirations = inspirations.filter((i) => i.stylist === user.name);

    // Build keyword phrases from the user's inspirations (e.g. "Polki necklace", "Jhumkas")
    const phrases = userInspirations
      .flatMap((i) => i.jewellery.split("·"))
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    // Helper to test if a product matches any phrase
    const matchesPhrase = (p: typeof products[number]) => {
      const hay = [p.name, p.category, p.description, ...(p.tags || [])].join(" ").toLowerCase();
      for (const phrase of phrases) {
        // match whole phrase or any significant word in it
        if (hay.includes(phrase)) return true;
        const words = phrase.split(/\s+/).filter((w) => w.length > 2);
        for (const w of words) {
          if (hay.includes(w)) return true;
        }
      }
      return false;
    };

    // Find matching products from the existing catalog, prefer direct matches and then fill with category items
    const matched: typeof products = [];
    // First pass: exact phrase matches
    for (const p of products) {
      if (matchesPhrase(p)) matched.push(p);
      if (matched.length >= 6) break;
    }

    // Second pass: fallback by category weight for common jewellery categories
    if (matched.length < 6) {
      const preferredCats = ["Necklaces", "Earrings", "Pendants", "Rings", "Bracelets"];
      for (const cat of preferredCats) {
        for (const p of products) {
          if (matched.includes(p)) continue;
          if (p.category === cat) matched.push(p);
          if (matched.length >= 6) break;
        }
        if (matched.length >= 6) break;
      }
    }

    const collection = matched.slice(0, 6);

    return { user, collection, userInspirations };
  },
  component: CommunityProfile,
});

function CommunityProfile() {
  const { user, collection, userInspirations } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title={user.name} subtitle={user.title} />

      <div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h3 className="text-lg font-semibold">About {user.name}</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {user.title} · {user.votes} votes · Score {user.score}
          </p>
          {userInspirations.length > 0 && (
            <div className="mt-3 text-sm text-foreground">
              <p className="font-medium">Notable looks</p>
              <ul className="mt-2 list-disc pl-5">
                {userInspirations.map((i: (typeof inspirations)[number]) => (
                  <li key={i.id} className="mt-1 text-sm text-muted-foreground">
                    {i.title} · {i.jewellery}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div>
          <h3 className="mb-3 text-lg font-semibold">Featured Jewellery</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {collection.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
