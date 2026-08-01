import { Link } from "@tanstack/react-router";
import { Flame, Sparkles, Timer, Trophy } from "lucide-react";
import { weeklyMission } from "@/lib/styleMissions";
import minimalMondayHero from "@/assets/minimal_monday.png";

export function StyleMissionCard() {
  const progress = (weeklyMission.completedCount / weeklyMission.totalCount) * 100;

  return (
    <Link
      to="/style-mission"
      className="press group block overflow-hidden rounded-[40px] bg-gradient-to-br from-slate-900 via-violet-700 to-fuchsia-500 p-6 shadow-[0_40px_120px_rgba(88,28,135,0.22)] transition duration-300 hover:-translate-y-1"
    >
      <div className="relative grid gap-4 overflow-hidden rounded-[32px] bg-[radial-gradient(circle_at_top_left,_rgba(196,181,253,0.16),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(244,114,182,0.14),_transparent_35%),linear-gradient(135deg,#1e1b3a,#7c3aed_50%,#db2777)] p-6 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] sm:grid-cols-[0.9fr_1.1fr] lg:p-8">
        <div className="flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-violet-100 backdrop-blur">
                <Sparkles size={13} /> This Week's Style Mission
              </span>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold text-amber-100 backdrop-blur">
                🔥 Trending
              </span>
            </div>

            <h2 className="text-3xl font-black leading-tight tracking-[-0.04em] text-white sm:text-4xl">
              {weeklyMission.theme}
            </h2>
            <p className="max-w-lg text-sm leading-6 text-white/85 sm:text-base">
              {weeklyMission.description}
            </p>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[12px] font-semibold text-amber-100 backdrop-blur">
                <Trophy size={13} /> +{weeklyMission.xp} XP · {weeklyMission.badge} Badge
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[12px] font-medium text-white/80 backdrop-blur">
                <Timer size={13} /> Ends in {weeklyMission.endsInDays} Days
              </span>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between text-[11px] font-medium text-white/70">
                <span>Weekly Progress</span>
                <span>
                  {weeklyMission.completedCount}/{weeklyMission.totalCount} Completed
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-amber-300 to-amber-100 transition-all duration-500"
                  style={{ width: `${Math.max(progress, 4)}%` }}
                />
              </div>
            </div>

            <div className="mt-1 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-300 via-amber-200 to-white/90 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_14px_45px_rgba(249,207,37,0.28)] transition duration-300 group-hover:brightness-110">
              <Flame size={15} /> Join Mission
            </div>
          </div>
        </div>

        <div className="relative mt-6 flex items-center justify-center sm:mt-0">
          <div className="absolute inset-4 rounded-full bg-violet-300/20 blur-3xl" />
          <div className="relative h-[300px] w-full max-w-[280px] overflow-hidden rounded-[28px] border border-white/15 bg-white/10 shadow-[0_24px_60px_rgba(15,23,42,0.2)] backdrop-blur-xl sm:h-[380px] sm:max-w-[320px]">
            <img
              src={minimalMondayHero}
              alt="Minimal Monday — try on jewellery and see AI-powered reviews"
              className="h-full w-full object-contain"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}