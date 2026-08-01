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
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[rgba(10,8,19,0.55)] px-4 backdrop-blur-sm">
      <div className="w-full max-w-sm overflow-hidden rounded-[24px] border border-[rgba(212,175,55,0.3)] bg-white shadow-[0_20px_50px_-10px_rgba(123,74,226,0.18)]">
        <div className="border-b border-[#F1EBFA] p-5">
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F7F2FF] text-[#7B4AE2] shadow-sm">
              <Sparkles size={18} />
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full border border-[#F1EBFA] bg-white p-2 text-[#1A0B2E] transition-all hover:bg-[#FAF8FF]"
            >
              <X size={16} />
            </button>
          </div>

          <h2 className="mt-4 font-serif text-[1.4rem] font-semibold tracking-[0.01em] text-[#1A0B2E]">
            Complete Today&apos;s Quest
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#5F4E72]">
            Maintain your daily streak to earn XP and unlock exclusive luxury experiences.
          </p>
        </div>

        <div className="p-5">
          <div className="rounded-[20px] border border-[#EDE7F6] bg-[#FAF8FF] p-4">
            <div className="flex items-center justify-between text-sm text-[#5F4E72]">
              <div className="flex items-center gap-2">
                <Flame size={16} className="text-[#D4AF37]" />
                <span>{journey.streakCount}/7 Days</span>
              </div>
              <span className="font-semibold text-[#7B4AE2]">Next: {nextLabel}</span>
            </div>
            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#7B4AE2] to-[#D4AF37] transition-all duration-500"
                style={{ width: `${Math.min(100, (journey.streakCount / 7) * 100)}%` }}
              />
            </div>
          </div>

          <div className="mt-4 rounded-[20px] border border-[#EDE7F6] bg-[#FAF8FF] p-4 text-center">
            <div className={cn("mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F7F2FF] text-2xl transition-all", celebrating && "scale-110") }>
              <Sparkles className="text-[#D4AF37]" />
            </div>
            <p className="mt-3 font-serif text-[1.05rem] font-semibold text-[#1A0B2E]">Tap to complete your ritual</p>
            <p className="mt-1 text-sm leading-6 text-[#5F4E72]">+50 XP for the daily quest and a fresh step on your journey.</p>
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
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-[16px] bg-gradient-to-r from-[#7B4AE2] via-[#6E39D6] to-[#4A129B] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(123,74,226,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_28px_rgba(123,74,226,0.24)]"
          >
            <Trophy size={16} /> Tap to Complete Quest (+50 XP)
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
