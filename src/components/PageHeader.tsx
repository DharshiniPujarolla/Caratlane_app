import { Link, useRouter } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  const router = useRouter();
  return (
    <header className="glass sticky top-0 z-40 flex items-center gap-3 border-b border-border/60 px-4 py-3">
      <button
        onClick={() => router.history.back()}
        aria-label="Go back"
        className="press flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground"
      >
        <ChevronLeft size={18} />
      </button>
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-base font-semibold">{title}</h1>
        {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {right}
    </header>
  );
}

export function SectionHeader({
  title,
  caption,
  to,
}: {
  title: string;
  caption?: string;
  to?: string;
}) {
  return (
    <div className="mb-3 flex items-end justify-between px-4">
      <div>
        <h2 className="text-[15px] font-semibold tracking-tight">{title}</h2>
        {caption && <p className="text-xs text-muted-foreground">{caption}</p>}
      </div>
      {to && (
        <Link to={to} className="text-xs font-semibold text-primary">
          View all
        </Link>
      )}
    </div>
  );
}
