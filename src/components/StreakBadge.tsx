import { useEffect, useState } from "react";
import { Flame } from "lucide-react";

export function StreakBadge() {
  const [streak, setStreak] = useState(1);

  useEffect(() => {
    const currentStreak = localStorage.getItem("user_daily_streak") || "1";
    setStreak(parseInt(currentStreak, 10));
  }, []);

  return (
    <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-orange-500/10 to-amber-500/10 px-2.5 py-1 text-xs font-bold text-orange-600 border border-orange-200 shadow-2xs">
      <Flame className="h-3.5 w-3.5 fill-current text-orange-500 animate-pulse" />
      <span>{streak}d Streak</span>
    </div>
  );
}