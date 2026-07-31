import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Bell, ChevronDown, Heart, MapPin, Search, Sparkles } from "lucide-react";
import { BannerCarousel } from "@/components/BannerCarousel";
import { CategoryCircle, OfferCard, TileCard } from "@/components/Cards";
import { SectionHeader } from "@/components/PageHeader";
import { ProductCard } from "@/components/ProductCard";
import { LumiMirrorCard } from "@/components/lumimirror/LumiMirrorCard";
import {
  categories,
  collections,
  findProduct,
  images,
  occasionsList,
  offers,
  priceBuckets,
  products,
} from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LumiAura — Everyday Diamond & Gold Jewellery" },
      {
        name: "description",
        content:
          "Discover \ending collections, new arrivals and best sellers in diamond and gold jewellery, crafted for everyday luxury.",
      },
      { property: "og:title", content: "LumiAura — Everyday Diamond & Gold Jewellery" },
      {
        property: "og:description",
        content: "Trending collections, new arrivals and best sellers in fine jewellery.",
      },
    ],
  }),
  component: Index,
});

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-1">{children}</div>
  );
}

function Index() {
  const navigate = useNavigate();
  const recent = useStore((s) => s.recentlyViewed);
  const cart = useStore((s) => s.cart);
  const wish = useStore((s) => s.wishlist.length);

  const trending = products.slice(0, 6);
  const newArrivals = products.filter((p) => p.tags.includes("New Arrival")).slice(0, 6);
  const bestSellers = products.filter((p) => p.tags.includes("Best Seller")).slice(0, 6);
  const recentProducts = recent.map(findProduct).filter(Boolean);
  const continueItem = cart[0] ? findProduct(cart[0].id) : undefined;

  return (
    <div className="space-y-7">
      <header className="glass sticky top-0 z-40 space-y-3 px-4 pb-3 pt-4">
        <div className="flex items-center justify-between">
          <button className="press flex items-center gap-1.5 text-left">
            <MapPin size={16} className="text-primary" />
            <span className="text-[13px] font-semibold">Bengaluru, 560038</span>
            <ChevronDown size={14} className="text-muted-foreground" />
          </button>
          <div className="flex items-center gap-1">
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="press relative flex h-9 w-9 items-center justify-center rounded-full bg-secondary"
            >
              <Heart size={17} />
              {wish > 0 && (
                <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-primary" />
              )}
            </Link>
            <button
              aria-label="Notifications"
              className="press relative flex h-9 w-9 items-center justify-center rounded-full bg-secondary"
            >
              <Bell size={17} />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            </button>
          </div>
        </div>
        <button
          onClick={() => navigate({ to: "/search" })}
          className="press flex w-full items-center gap-2 rounded-full border border-border bg-muted/60 px-4 py-2.5 text-left"
        >
          <Search size={16} className="text-muted-foreground" />
          <span className="text-[13px] text-muted-foreground">
            Search for rings, earrings, gold chains…
          </span>
        </button>
      </header>

      <BannerCarousel />

      <section className="px-4">
        <LumiMirrorCard />
      </section>

      <section>
        <SectionHeader title="Shop by Category" to="/categories" />
        <Row>
          {categories.map((c) => (
            <CategoryCircle key={c.slug} {...c} />
          ))}
        </Row>
      </section>

      <section>
        <SectionHeader title="Trending Collections" caption="Loved by 2 lakh+ customers" />
        <Row>
          {collections.map((c) => (
            <TileCard
              key={c.id}
              title={c.name}
              caption={`${c.count} designs`}
              image={c.image}
              to="/category/diamond"
            />
          ))}
        </Row>
      </section>

      <section>
        <SectionHeader title="New Arrivals" caption="Fresh off the bench" to="/categories" />
        <Row>
          {newArrivals.map((p) => (
            <ProductCard key={p.id} product={p} wide />
          ))}
        </Row>
      </section>

      <section className="px-4">
        <div className="overflow-hidden rounded-3xl gradient-primary p-5 text-primary-foreground">
          <Sparkles size={20} className="text-gold-soft" />
          <h3 className="mt-2 text-lg font-semibold leading-snug">
            Zero making charges
            <br /> on 22KT gold this week
          </h3>
          <p className="mt-1 text-xs opacity-85">Ends Sunday · Use code GOLDZERO</p>
          <Link
            to="/category/$slug"
            params={{ slug: "gold" }}
            className="press mt-3 inline-flex rounded-full bg-background px-4 py-2 text-xs font-semibold text-primary"
          >
            Shop Gold Jewellery
          </Link>
        </div>
      </section>

      <section>
        <SectionHeader title="Best Sellers" caption="Restocked this week" />
        <Row>
          {bestSellers.map((p) => (
            <ProductCard key={p.id} product={p} wide />
          ))}
        </Row>
      </section>

      <section>
        <SectionHeader title="Shop by Occasion" />
        <Row>
          {occasionsList.map((o) => (
            <TileCard key={o.name} title={o.name} image={o.image} to="/categories" />
          ))}
        </Row>
      </section>

      <section>
        <SectionHeader title="Shop by Price" />
        <Row>
          {priceBuckets.map((b) => (
            <Link
              key={b.label}
              to="/category/$slug"
              params={{ slug: "diamond" }}
              className="press flex h-20 w-[130px] shrink-0 flex-col justify-center rounded-2xl border border-border bg-card px-3 shadow-soft"
            >
              <span className="text-[13px] font-semibold">{b.label}</span>
              <span className="text-[11px] text-muted-foreground">Explore designs</span>
            </Link>
          ))}
        </Row>
      </section>

      <section className="grid grid-cols-2 gap-3 px-4">
        <Link
          to="/category/$slug"
          params={{ slug: "gold" }}
          className="press relative h-36 overflow-hidden rounded-2xl"
        >
          <img src={images.hero2} alt="Gold jewellery" loading="lazy" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <p className="absolute bottom-3 left-3 text-sm font-semibold text-primary-foreground">
            Gold Jewellery
          </p>
        </Link>
        <Link
          to="/category/$slug"
          params={{ slug: "diamond" }}
          className="press relative h-36 overflow-hidden rounded-2xl"
        >
          <img src={images.hero1} alt="Diamond jewellery" loading="lazy" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <p className="absolute bottom-3 left-3 text-sm font-semibold text-primary-foreground">
            Diamond Jewellery
          </p>
        </Link>
      </section>

      <section>
        <SectionHeader title="Offers & Coupons" caption="Applied at checkout" />
        <Row>
          {offers.map((o) => (
            <OfferCard key={o.code} {...o} />
          ))}
        </Row>
      </section>

      <section>
        <SectionHeader title="Recommended for you" caption="Based on your browsing" />
        <Row>
          {trending.map((p) => (
            <ProductCard key={p.id} product={p} wide />
          ))}
        </Row>
      </section>

      {recentProducts.length > 0 && (
        <section>
          <SectionHeader title="Recently Viewed" />
          <Row>
            {recentProducts.map((p) => p && <ProductCard key={p.id} product={p} wide />)}
          </Row>
        </section>
      )}

      {continueItem && (
        <section className="px-4">
          <SectionHeader title="Continue Shopping" />
          <Link
            to="/cart"
            className="press flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-soft"
          >
            <img
              src={continueItem.image}
              alt={continueItem.name}
              loading="lazy"
              className="h-14 w-14 rounded-xl object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium">{continueItem.name}</p>
              <p className="text-[11px] text-muted-foreground">Still in your bag</p>
            </div>
            <span className="rounded-full bg-primary px-3 py-1.5 text-[11px] font-semibold text-primary-foreground">
              Resume
            </span>
          </Link>
        </section>
      )}

      <footer className="px-4 pb-4 text-center text-[11px] text-muted-foreground">
        <p>Lifetime exchange · 15-day returns · Certified diamonds</p>
        <Link to="/stores" className="mt-1 inline-block font-semibold text-primary">
          Find a LumiAura store near you
        </Link>
      </footer>
    </div>
  );
}
