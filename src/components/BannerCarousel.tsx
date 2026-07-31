import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { banners } from "@/lib/data";
import { cn } from "@/lib/utils";

export function BannerCarousel() {
  const [index, setIndex] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % banners.length), 4200);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
  }, [index]);

  return (
    <div className="px-4 lg:px-8">
      <div
        ref={ref}
        onScroll={(e) => {
          const el = e.currentTarget;
          setIndex(Math.round(el.scrollLeft / el.clientWidth));
        }}
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto rounded-3xl"
      >
        {banners.map((b) => (
          <Link
            key={b.id}
            to={b.to as never}
            className="relative aspect-[16/10] lg:aspect-[21/8] w-full shrink-0 snap-center overflow-hidden rounded-3xl"
          >
            <img
              src={b.image}
              alt={b.title}
              width={1200}
              height={800}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-gold-soft">
                {b.subtitle}
              </p>
              <h3 className="mt-1 max-w-[80%] text-lg font-semibold leading-tight text-primary-foreground">
                {b.title}
              </h3>
              <span className="mt-2 inline-flex rounded-full bg-background/95 px-3 py-1.5 text-[11px] font-semibold text-primary">
                {b.cta}
              </span>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-2 flex justify-center gap-1.5">
        {banners.map((b, i) => (
          <span
            key={b.id}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === index ? "w-5 bg-primary" : "w-1.5 bg-border",
            )}
          />
        ))}
      </div>
    </div>
  );
}
