import { useState, useEffect } from "react";
import { Sparkles, X, Lightbulb, Shirt, ShieldCheck, Heart, Share2, ArrowRight, Flame, Gift, Trophy, CheckCircle2 } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

type SparkType = "fact" | "styling" | "outfit" | "trending" | "care";

interface SparkData {
  id: string;
  type: SparkType;
  tag: string;
  title: string;
  description: string;
  image: string;
  actionText: string;
  actionRoute: string;
  icon: React.ElementType;
}

const DAILY_SPARKS: SparkData[] = [
  {
    id: "spark-1",
    type: "styling",
    tag: "Styling Tip of the Day",
    title: "Layering Fine Chains",
    description: "Pair a 14K thin gold choker with an 18-inch pendant necklace to create effortless dimension for V-neck outfits.",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80",
    actionText: "Shop Layered Chains",
    actionRoute: "/category/gold",
    icon: Lightbulb,
  },
  {
    id: "spark-2",
    type: "outfit",
    tag: "Outfit Inspiration",
    title: "Silk Sarees & Rose Gold",
    description: "Rose gold accents contrast beautifully against pastel Kanchipuram silks for a modern heritage look.",
    image: "https://images.unsplash.com/photo-1611591475155-42621f8a846a?auto=format&fit=crop&q=80",
    actionText: "Explore Rose Gold",
    actionRoute: "/category/diamond",
    icon: Shirt,
  },
  {
    id: "spark-3",
    type: "care",
    tag: "Jewelry Care Tip",
    title: "Perfume Before Pearls",
    description: "Always apply perfume and hairspray before putting on your pearls to prevent dulling their natural luster over time.",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80",
    actionText: "View Care Guide",
    actionRoute: "/category/diamond",
    icon: ShieldCheck,
  },
  {
    id: "spark-4",
    type: "fact",
    tag: "Jewelry Secrets",
    title: "Why 18K Gold Sparkles More",
    description: "18K gold contains 75% pure gold mixed with durable metals—giving you rich color and daily durability.",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80",
    actionText: "Shop 18K Everyday Wear",
    actionRoute: "/category/gold",
    icon: Sparkles,
  },
];

export function DailySparkModal() {
  const navigate = useNavigate();
  const [spark, setSpark] = useState<SparkData | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [streak, setStreak] = useState(1);
  const [liked, setLiked] = useState(false);
  const [showRewardTab, setShowRewardTab] = useState(false);

  useEffect(() => {
    // sessionStorage tracks if modal was shown in THIS specific tab session
    const sessionSeen = sessionStorage.getItem("daily_spark_session_seen");
    const currentStreak = parseInt(localStorage.getItem("user_daily_streak") || "1", 10);

    setStreak(currentStreak);

    const todayIndex = new Date().getDate() % DAILY_SPARKS.length;
    setSpark(DAILY_SPARKS[todayIndex]);

    // Shows ONCE whenever you open the link in a fresh tab or session
    if (!sessionSeen) {
      const timer = setTimeout(() => setIsOpen(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleReveal = () => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const lastStreakDate = localStorage.getItem("last_streak_date");

    if (lastStreakDate !== todayStr) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem("user_daily_streak", newStreak.toString());
      localStorage.setItem("last_streak_date", todayStr);
    }

    sessionStorage.setItem("daily_spark_session_seen", "true");
    setIsRevealed(true);
  };

  const handleClose = () => {
    // Mark as seen for this session so internal route switches don't re-trigger it
    sessionStorage.setItem("daily_spark_session_seen", "true");
    setIsOpen(false);
  };

  if (!isOpen || !spark) return null;

  const IconComponent = spark.icon;

  const getNextGoal = (currStreak: number) => {
    if (currStreak < 7) return { target: 7, gift: "10% Secret Discount" };
    if (currStreak < 30) return { target: 30, gift: "Silver Care Kit" };
    if (currStreak < 100) return { target: 100, gift: "Branded Water Bottle" };
    if (currStreak < 200) return { target: 200, gift: "Silver Gift Box (₹2,000)" };
    return { target: 365, gift: "22K Gold Coin + VIP Pass" };
  };

  const nextGoal = getNextGoal(streak);
  const progressPercent = Math.min(100, Math.round((streak / nextGoal.target) * 100));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 transition-all">
      <div className="relative w-full max-w-sm overflow-hidden rounded-[36px] bg-gradient-to-br from-[#F5D889] via-[#059669] to-[#1D4ED8] p-[2.5px] shadow-2xl">
        <div className="relative overflow-hidden rounded-[34px] bg-[#07131E]">
          
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 z-30 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white/80 border border-white/10 hover:bg-black/60 transition-all active:scale-95"
          >
            <X className="h-4 w-4" />
          </button>

          {!isRevealed ? (
            <div className="relative flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#0B2238] via-[#092B20] to-[#05161A] text-white min-h-[410px]">
              <div className="relative z-10 mb-4 inline-flex items-center gap-1.5 rounded-full bg-[#E7B83F]/10 px-4 py-1.5 text-xs font-bold text-[#F5D889] border border-[#E7B83F]/30">
                <Flame className="h-4 w-4 fill-current text-[#E7B83F] animate-bounce" />
                <span>Current Streak: {streak} Days</span>
              </div>

              <div 
                onClick={handleReveal}
                className="group cursor-pointer relative z-10 my-3 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-[#F5D889] via-[#10B981] to-[#3B82F6] p-[2.5px] shadow-[0_0_35px_rgba(231,184,63,0.5)] transition-transform hover:scale-110 active:scale-95"
              >
                <div className="flex h-full w-full items-center justify-center rounded-full bg-[#081826]">
                  <Sparkles className="h-9 w-9 text-[#F5D889]" />
                </div>
              </div>

              <h2 className="relative z-10 font-serif text-2xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-[#D1FAE5] to-[#F5D889]">
                Complete Today's Quest ✦
              </h2>
              <p className="relative z-10 mt-2 text-xs text-[#A7F3D0]/90 max-w-[250px] leading-relaxed">
                Unlock daily jewelry secrets & maintain your streak to claim physical brand gifts!
              </p>

              <div className="relative z-10 mt-5 w-full rounded-2xl bg-white/10 p-3.5 border border-white/10 text-left">
                <div className="flex justify-between text-[11px] font-bold text-[#F5D889]">
                  <span>Next: {nextGoal.gift}</span>
                  <span>{streak}/{nextGoal.target} Days</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-black/50">
                  <div 
                    className="h-full bg-gradient-to-r from-[#10B981] via-[#3B82F6] to-[#F5D889] transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <button
                onClick={handleReveal}
                className="relative z-10 mt-6 w-full rounded-full bg-gradient-to-r from-[#F5D889] via-[#E7B83F] to-[#D4A328] py-3.5 text-xs font-bold text-[#07131E] shadow-lg hover:brightness-110 active:scale-95 transition-all"
              >
                Tap to Unlock Quest (+1 Day)
              </button>
            </div>
          ) : (
            <div className="animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between px-5 pt-4 pb-3 bg-[#07131E] border-b border-white/10">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#F5D889]">
                  <Flame className="h-4 w-4 fill-current text-[#E7B83F] animate-pulse" />
                  <span>{streak} Day Streak Maintained!</span>
                </div>
                <button
                  onClick={() => setShowRewardTab(!showRewardTab)}
                  className="flex items-center gap-1 text-[11px] font-bold text-[#07131E] bg-gradient-to-r from-[#F5D889] to-[#E7B83F] px-3 py-1 rounded-full shadow-xs"
                >
                  <Trophy className="h-3 w-3" />
                  <span>Rewards</span>
                </button>
              </div>

              {showRewardTab ? (
                <div className="p-5 space-y-3 bg-[#07131E] min-h-[300px] text-white">
                  <h3 className="font-serif text-lg font-bold text-[#F5D889]">Streak Level Rewards</h3>
                  <p className="text-xs text-[#A7F3D0]">Maintain your daily streak to claim free physical brand gifts!</p>

                  <div className="space-y-2 mt-3">
                    {[
                      { days: 7, gift: "10% Secret Coupon", icon: Sparkles },
                      { days: 30, gift: "Silver Cleaning Kit", icon: ShieldCheck },
                      { days: 100, gift: "LumiAura Stainless Water Bottle", icon: Gift },
                      { days: 200, gift: "Silver Gift Box (Worth ₹2,000)", icon: Trophy },
                      { days: 365, gift: "22K Fine Gold Coin + VIP Pass", icon: Sparkles },
                    ].map((tier) => (
                      <div 
                        key={tier.days} 
                        className={`flex items-center justify-between p-3 rounded-2xl border text-xs ${
                          streak >= tier.days 
                            ? "bg-[#092B20] border-[#10B981] text-white" 
                            : "bg-white/5 border-white/10 text-emerald-100/60"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {streak >= tier.days ? (
                            <CheckCircle2 className="h-4 w-4 text-[#34D399]" />
                          ) : (
                            <Gift className="h-4 w-4 text-[#F5D889]" />
                          )}
                          <div>
                            <p className="font-bold text-white">{tier.gift}</p>
                            <p className="text-[10px] opacity-70">{tier.days} Days Required</p>
                          </div>
                        </div>
                        <span className="font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10">
                          {streak >= tier.days ? "Unlocked" : `${tier.days - streak}d left`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="relative h-48 w-full overflow-hidden">
                    <img src={spark.image} alt={spark.title} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#07131E] via-black/20 to-transparent" />
                    <div className="absolute top-3.5 left-3.5 inline-flex items-center gap-1.5 rounded-full bg-[#07131E]/90 px-3 py-1 text-[10px] font-bold text-[#F5D889] border border-[#E7B83F]/30">
                      <IconComponent className="h-3 w-3" />
                      {spark.tag}
                    </div>
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <h3 className="font-serif text-lg font-bold leading-tight">{spark.title}</h3>
                    </div>
                  </div>

                  <div className="p-5 space-y-4 bg-[#07131E] text-white">
                    <p className="text-xs text-[#D1FAE5] leading-relaxed font-medium">{spark.description}</p>

                    <button
                      onClick={() => {
                        handleClose();
                        navigate({ to: spark.actionRoute as any });
                      }}
                      className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#F5D889] via-[#E7B83F] to-[#D4A328] py-3.5 px-4 text-xs font-bold text-[#07131E] shadow-md hover:brightness-110 transition-all"
                    >
                      <span>{spark.actionText}</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>

                    <div className="flex items-center justify-between border-t border-white/10 pt-3 text-xs">
                      <span className="text-[10px] text-emerald-200/60">Completed today ✨</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setLiked(!liked)}
                          className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                            liked ? "bg-[#F5D889] text-[#07131E]" : "bg-white/10 text-white border border-white/20"
                          }`}
                        >
                          <Heart className={`h-3.5 w-3.5 ${liked ? "fill-current" : ""}`} />
                          {liked ? "Saved" : "Save"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}