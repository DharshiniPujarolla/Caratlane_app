import { Link } from "@tanstack/react-router";
import { Heart, Star } from "lucide-react";
import { toast } from "sonner";
import { discount, inr, type Product } from "@/lib/data";
import { actions, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ProductCard({ product, wide = false }: { product: Product; wide?: boolean }) {
  const saved = useStore((s) => s.wishlist.includes(product.id));
  const off = discount(product);

  return (
    <Link
      to="/product/$id"
      params={{ id: product.id }}
      className={cn(
        "press group block overflow-hidden rounded-2xl bg-card shadow-soft transition-shadow hover:shadow-card",
        wide ? "w-[164px] shrink-0" : "w-full",
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {off > 0 && (
          <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
            {off}% OFF
          </span>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            actions.toggleWishlist(product.id);
            toast.success(saved ? "Removed from wishlist" : "Added to wishlist");
          }}
          aria-label="Toggle wishlist"
          className="glass press absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full"
        >
          <Heart
            size={15}
            className={saved ? "fill-primary text-primary" : "text-foreground"}
          />
        </button>
      </div>
      <div className="space-y-1 p-3">
        <p className="truncate text-[13px] font-medium">{product.name}</p>
        <p className="truncate text-[11px] text-muted-foreground">
          {product.purity} {product.metal}
        </p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-[13px] font-semibold">{inr(product.price)}</span>
          <span className="text-[11px] text-muted-foreground line-through">
            {inr(product.mrp)}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <Star size={11} className="fill-gold text-gold" />
          {product.rating}
          <span>({product.reviews})</span>
        </div>
      </div>
    </Link>
  );
}

export function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl bg-card shadow-soft">
      <div className="shimmer aspect-square w-full" />
      <div className="space-y-2 p-3">
        <div className="shimmer h-3 w-3/4 rounded-full" />
        <div className="shimmer h-3 w-1/2 rounded-full" />
      </div>
    </div>
  );
}
