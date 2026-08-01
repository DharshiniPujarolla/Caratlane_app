import { TryOnBanner } from "@/components/TryOnBanner";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Bell, ChevronDown, Heart, MapPin, Search, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { BannerCarousel } from "@/components/BannerCarousel";
import { CategoryCircle, OfferCard, TileCard } from "@/components/Cards";
import { SectionHeader } from "@/components/PageHeader";
import { ProductCard } from "@/components/ProductCard";
import { LumiMirrorCard } from "@/components/lumimirror/LumiMirrorCard";
import SplashScreen from "@/components/SplashScreen";
import lumiauraImg from "@/assets/brand-lumiaura.jpg";
import shayaImg from "@/assets/brand-shaya.jpg";
import { LumiAuraQuestModal } from "@/components/LumiAuraQuestModal";
import { StreakBadge } from "@/components/StreakBadge";
import { BottomNav } from "@/components/BottomNav";
import { ConciergeFab } from "@/components/ConciergeFab";

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
import { actions, useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LumiAura — Everyday Diamond & Gold Jewellery" },
      {
        name: "description",
        content:
          "Discover trending collections, new arrivals and best sellers in diamond and gold jewellery, crafted for everyday luxury.",
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
    <div className="no-scrollbar flex gap-4 overflow-x-auto px-4 lg:px-8 pb-1">
      {children}
    </div>
  );
}

function BrandsSection() {
  return (
    <div id="brands-section" className="flex min-h-[100svh] flex-col justify-center gap-4 px-4 py-10">
      <p className="text-center text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
        Choose your world
      </p>

      <a
        href="#home-content"
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
      </a>

      <Link
        to="/shaya"
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

function Index() {
  const navigate = useNavigate();
  const recent = useStore((s) => s.recentlyViewed);
  const cart = useStore((s) => s.cart);
  const wish = useStore((s) => s.wishlist.length);

  const [showBottomNav, setShowBottomNav] = useState(false);

  useEffect(() => {
    actions.initializeJourney();

    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBottomNav(true);
      } else {
        setShowBottomNav(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const trending = products.slice(0, 6);
  const newArrivals = products.filter((p) => p.tags.includes("New Arrival")).slice(0, 6);
  const bestSellers = products.filter((p) => p.tags.includes("Best Seller")).slice(0, 6);
  const recentProducts = recent.map(findProduct).filter(Boolean);
  const continueItem = cart[0] ? findProduct(cart[0].id) : undefined;

  return (
    <div className="mx-auto max-w-7xl">
      <SplashScreen />
      <LumiAuraQuestModal />
      <BrandsSection />

      <div id="home-content" className="space-y-7 lg:space-y-10 pb-24">
        <header className="glass sticky top-0 z-40 space-y-3 px-4 lg:px-8 pb-3 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/" className="flex flex-col">
                <h1 className="font-display text-3xl font-bold text-primary">
                  LumiAura
                </h1>
                <span className="text-xs text-muted-foreground">
                  Fine Diamond & Gold Jewellery
                </span>
              </Link>

              <button className="press flex items-center gap-1.5">
                <MapPin size={16} className="text-primary" />
                <span className="text-sm font-semibold">Chennai</span>
                <ChevronDown size={14} className="text-muted-foreground" />
              </button>
            </div>

            <div className="flex items-center gap-2.5">
              <StreakBadge />

              <Link
                to="/wishlist"
                className="press relative flex h-10 w-10 items-center justify-center rounded-full bg-secondary"
              >
                <Heart size={18} />
                {wish > 0 && (
                  <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </Link>

              <button className="press relative flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                <Bell size={18} />
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
        <TryOnBanner />

        <section className="px-4">
          <LumiMirrorCard />
        </section>

        <section className="px-4">
          <Link
            to="/lumisignature"
            className="press block overflow-hidden rounded-3xl bg-gradient-to-r from-violet-700 via-fuchsia-600 to-pink-500 p-6 text-white shadow-float"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] opacity-80">
                  ✨ LUMISIGNATURE™
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  Discover Your Jewellery DNA
                </h2>

                <p className="mt-2 max-w-md text-sm text-white/90">
                  Answer 5 quick questions and uncover the jewellery style that
                  matches your personality.
                </p>

                <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-violet-700">
                  Discover My DNA
                <ArrowRight size={16} />
                </div>
              </div>

              <div className="hidden md:flex items-center justify-center text-7xl opacity-30">
              🧬
              </div>
            </div>
          </Link>
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
                <span className="text-[11px] text-[#8C7A70]">Explore designs</span>
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

      {/* Navigation tab reveals when scrolling down */}
      {showBottomNav && <BottomNav />}

      {/* Voice Assistant is always visible on the landing page */}
      <ConciergeFab />
    </div>
  );
}