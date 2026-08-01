import { useEffect, useState } from "react";
import { Sparkles, X, Flame, ArrowRight, Trophy } from "lucide-react";
import { actions, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function LumiAuraQuestModal() {
  const journey = useStore((s) => s.lumiAuraJourney);
  const [open, setOpen] = useState(false);
  const [celebrating, setCelebrating] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("lumiaura-quest-session-seen");
    if (!seen) {
      const timer = window.setTimeout(() => setOpen(true), 700);
      return () => window.clearTimeout(timer);
    }
  }, []);

  if (!open) return null;

  const nextLevel = Math.max(1, journey.level + 1);
  const nextLabel = nextLevel <= 3 ? `Level ${nextLevel} — Personalized Style Insights` : `Level ${nextLevel} — Premium Prestige`;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[rgba(10,8,19,0.68)] px-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-[30px] border border-[rgba(212,175,55,0.3)] bg-white shadow-[0_24px_60px_-12px_rgba(123,74,226,0.28)]">
        <div className="border-b border-[#F1EBFA] bg-gradient-to-br from-[#fcf8ff] to-[#f7f3ff] p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex h-13 w-13 items-center justify-center rounded-full bg-gradient-to-br from-[#7B4AE2] to-[#D4AF37] text-white shadow-[0_10px_30px_-10px_rgba(168,85,247,0.4)]">
              <Sparkles size={20} />
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full border border-[#F1EBFA] bg-white p-2 text-[#1A0B2E] transition-all hover:bg-[#FAF8FF]"
            >
              <X size={16} />
            </button>
          </div>

          <h2 className="mt-5 text-2xl font-bold leading-tight text-[#1A0B2E]">
            Complete Today&apos;s Quest
          </h2>
          <p className="mt-2 text-base leading-7 text-[#5F4E72]">
            Maintain your daily streak to earn XP and unlock exclusive luxury experiences.
          </p>
        </div>

        <div className="p-6">
          <div className="rounded-[22px] border border-[#EDE7F6] bg-gradient-to-br from-[#FAF8FF] to-[#f5ebff] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
            <div className="flex items-center justify-between gap-3 text-sm text-[#5F4E72] sm:text-base">
              <div className="flex items-center gap-2">
                <Flame size={16} className="text-[#D4AF37]" />
                <span>{journey.streakCount}/7 Days</span>
              </div>
              <span className="font-semibold text-[#7B4AE2]">Next: {nextLabel}</span>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/80">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#7B4AE2] via-[#8b5cf6] to-[#D4AF37] transition-all duration-500"
                style={{ width: `${Math.min(100, (journey.streakCount / 7) * 100)}%` }}
              />
            </div>
          </div>

          <div className="mt-4 rounded-[22px] border border-[#EDE7F6] bg-gradient-to-br from-[#FAF8FF] to-[#f7f3ff] p-4 text-center shadow-[0_10px_30px_-10px_rgba(123,74,226,0.16)]">
            <div className={cn("mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#F7F2FF] to-[#fff8e8] text-2xl transition-all duration-300", celebrating && "scale-110") }>
              <Sparkles className="text-[#D4AF37]" />
            </div>
            <p className="mt-3 text-lg font-semibold text-[#1A0B2E]">Tap to complete your ritual</p>
            <p className="mt-2 text-sm leading-7 text-[#5F4E72] sm:text-base">+50 XP for the daily quest and a fresh step on your journey.</p>
          </div>

          <button
            onClick={() => {
              setCelebrating(true);
              actions.completeDailyMission();
              sessionStorage.setItem("lumiaura-quest-session-seen", "true");
              window.setTimeout(() => {
                setCelebrating(false);
                setOpen(false);
              }, 800);
            }}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-[18px] bg-gradient-to-r from-[#7B4AE2] via-[#8b5cf6] to-[#6d28d9] px-5 py-3.5 text-base font-semibold text-white shadow-[0_14px_28px_rgba(123,74,226,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_34px_rgba(123,74,226,0.3)]"
          >
            <Trophy size={16} /> Tap to Complete Quest (+50 XP)
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
