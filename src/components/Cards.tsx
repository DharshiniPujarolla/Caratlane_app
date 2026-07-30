import { Link } from "@tanstack/react-router";
import { Star, BadgePercent } from "lucide-react";

export function CategoryCircle({
  name,
  image,
  slug,
}: {
  name: string;
  image: string;
  slug: string;
}) {
  return (
    <Link
      to="/category/$slug"
      params={{ slug }}
      className="press flex w-[72px] shrink-0 flex-col items-center gap-2"
    >
      <span className="rounded-full bg-gradient-to-br from-primary/30 to-gold/40 p-[2px]">
        <img
          src={image}
          alt={name}
          loading="lazy"
          className="h-16 w-16 rounded-full border-2 border-background object-cover"
        />
      </span>
      <span className="text-center text-[11px] font-medium leading-tight">{name}</span>
    </Link>
  );
}

export function TileCard({
  title,
  caption,
  image,
  to,
}: {
  title: string;
  caption?: string;
  image: string;
  to: string;
}) {
  return (
    <Link
      to={to as never}
      className="press relative h-32 w-[150px] shrink-0 overflow-hidden rounded-2xl shadow-soft"
    >
      <img src={image} alt={title} loading="lazy" className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-2.5">
        <p className="text-[13px] font-semibold text-primary-foreground">{title}</p>
        {caption && <p className="text-[10px] text-primary-foreground/80">{caption}</p>}
      </div>
    </Link>
  );
}

export function OfferCard({
  code,
  title,
  desc,
}: {
  code: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex w-[240px] shrink-0 items-center gap-3 rounded-2xl border border-dashed border-primary/30 bg-primary-soft/60 p-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <BadgePercent size={18} />
      </span>
      <div className="min-w-0">
        <p className="truncate text-[13px] font-semibold">{title}</p>
        <p className="truncate text-[11px] text-muted-foreground">{desc}</p>
        <p className="mt-0.5 text-[11px] font-semibold tracking-wider text-primary">{code}</p>
      </div>
    </div>
  );
}

export function ReviewCard({
  name,
  rating,
  date,
  title,
  body,
}: {
  name: string;
  rating: number;
  date: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-semibold">{name}</p>
        <span className="text-[11px] text-muted-foreground">{date}</span>
      </div>
      <div className="mt-1 flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={12}
            className={i < rating ? "fill-gold text-gold" : "text-border"}
          />
        ))}
      </div>
      <p className="mt-1.5 text-[13px] font-medium">{title}</p>
      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}
