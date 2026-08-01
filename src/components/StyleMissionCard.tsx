import { Link } from "@tanstack/react-router";
import { Flame, Sparkles, Timer, Trophy } from "lucide-react";
import { weeklyMission } from "@/lib/styleMissions";

export function StyleMissionCard() {
  const progress = (weeklyMission.completedCount / weeklyMission.totalCount) * 100;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card p-5 shadow-[0_18px_50px_rgba(88,28,135,0.10)] transition duration-300 hover:-translate-y-0.5">
      <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-primary/10 blur-3xl" />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            <Sparkles size={13} /> {weeklyMission.title}
          </p>
          <h3 className="mt-1.5 text-xl font-bold tracking-tight">{weeklyMission.theme}</h3>
        </div>
        <span className="shrink-0 rounded-full bg-gold-soft/25 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
          🔥 Trending
        </span>
      </div>

      <p className="mt-2 text-[13px] leading-5 text-muted-foreground">
        {weeklyMission.description}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-[12px] font-semibold text-primary">
          <Trophy size={13} /> +{weeklyMission.xp} XP · {weeklyMission.badge} Badge
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-[12px] font-medium text-muted-foreground">
          <Timer size={13} /> Ends in {weeklyMission.endsInDays} Days
        </span>
      </div>

      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-[11px] font-medium text-muted-foreground">
          <span>Weekly Progress</span>
          <span>
            {weeklyMission.completedCount}/{weeklyMission.totalCount} Completed
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-2 rounded-full gradient-primary transition-all duration-500"
            style={{ width: `${Math.max(progress, 4)}%` }}
          />
        </div>
      </div>

      <Link
        to="/style-mission"
        className="press mt-4 flex w-full items-center justify-center gap-2 rounded-full gradient-primary py-3 text-sm font-semibold text-primary-foreground"
      >
        <Flame size={15} /> Join Mission
      </Link>
    </div>
  );
}
