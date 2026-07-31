import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Share2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { findProduct, inr } from "@/lib/data";
import { actions, useStore } from "@/lib/store";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Your Wishlist — LumiAura Jewellery" },
      { name: "description", content: "Everything you've saved at LumiAura, ready to move to your bag." },
      { property: "og:title", content: "Your Wishlist — LumiAura Jewellery" },
      { property: "og:description", content: "Saved jewellery designs, ready when you are." },
    ],
  }),
  component: Wishlist,
});

function Wishlist() {
  const ids = useStore((s) => s.wishlist);
  const items = ids.map(findProduct).filter(Boolean);

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Wishlist"
        subtitle={`${items.length} saved designs`}
        right={
          <button
            onClick={() => toast.success("Wishlist link copied")}
            aria-label="Share wishlist"
            className="press flex h-9 w-9 items-center justify-center rounded-full bg-secondary"
          >
            <Share2 size={16} />
          </button>
        }
      />

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-8 py-28 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft text-primary">
            <Heart size={26} />
          </span>
          <p className="mt-4 text-sm font-semibold">Your wishlist is empty</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Tap the heart on any design to save it here.
          </p>
          <Link
            to="/categories"
            className="press mt-5 rounded-xl gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
          >
            Start exploring
          </Link>
        </div>
      ) : (
        <div className="space-y-3 p-4">
          {items.map(
            (p) =>
              p && (
                <div
                  key={p.id}
                  className="animate-fade-up flex gap-3 rounded-2xl bg-card p-3 shadow-soft"
                >
                  <Link to="/product/$id" params={{ id: p.id }} className="shrink-0">
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      className="h-24 w-24 rounded-xl object-cover"
                    />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="truncate text-[13px] font-medium">{p.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {p.purity} {p.metal}
                    </p>
                    <p className="mt-1 text-[13px] font-semibold">{inr(p.price)}</p>
                    <div className="mt-auto flex gap-2 pt-2">
                      <button
                        onClick={() => {
                          actions.addToCart(p.id);
                          actions.removeWishlist(p.id);
                          toast.success("Moved to bag");
                        }}
                        className="press flex-1 rounded-lg gradient-primary py-2 text-[12px] font-semibold text-primary-foreground"
                      >
                        Move to Cart
                      </button>
                      <button
                        onClick={() => actions.removeWishlist(p.id)}
                        aria-label="Remove"
                        className="press flex h-8 w-9 items-center justify-center rounded-lg border border-border"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ),
          )}
        </div>
      )}
    </div>
  );
}
