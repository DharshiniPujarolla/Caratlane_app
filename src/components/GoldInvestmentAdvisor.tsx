import { useEffect, useMemo, useState } from "react";
import {
  X,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Hourglass,
  BarChart3,
  Bell,
  Wallet,
  LineChart as LineChartIcon,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

const AI_TEXT =
  "Gold has been steadily rising over the last 7 days. Based on historical patterns and market momentum, today appears to be a favorable accumulation opportunity for long-term investors.";

const RANGES = ["1 Week", "1 Month", "3 Months", "1 Year"] as const;
type RangeKey = (typeof RANGES)[number];

function seriesFor(range: RangeKey): number[] {
  const counts: Record<RangeKey, number> = {
    "1 Week": 7,
    "1 Month": 15,
    "3 Months": 20,
    "1 Year": 24,
  };
  const n = counts[range];
  const seed = range.length * 7.3;
  return Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    return (
      9700 +
      t * 520 +
      Math.sin(i * 0.9 + seed) * 55 +
      Math.cos(i * 0.42 + seed) * 30
    );
  });
}

function toPath(values: number[], w: number, h: number) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  return values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / span) * (h - 8) - 4;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

function Sparkline({
  values,
  stroke,
  fill,
  id,
}: {
  values: number[];
  stroke: string;
  fill: string;
  id: string;
}) {
  const w = 320;
  const h = 96;
  const d = toPath(values, w, h);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fill} stopOpacity="0.35" />
          <stop offset="100%" stopColor={fill} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L${w},${h} L0,${h} Z`} fill={`url(#${id})`} />
      <path
        key={d}
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: 1200,
          strokeDashoffset: 1200,
          animation: "gold-draw 1.1s ease-out forwards",
        }}
      />
    </svg>
  );
}

function Ring({ value, size = 56 }: { value: number; size?: number }) {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="#EFE7FA" strokeWidth="6" fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="#6F4EFF"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
        strokeDasharray={c}
        strokeDashoffset={c - (c * value) / 100}
        style={{ transition: "stroke-dashoffset 1s ease-out" }}
      />
    </svg>
  );
}

export function GoldInvestmentAdvisor({ onClose }: { onClose: () => void }) {
  const [range, setRange] = useState<RangeKey>("1 Week");
  const [typed, setTyped] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [price, setPrice] = useState(10245);
  const [pulse, setPulse] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  const [score, setScore] = useState(0);

  const values = useMemo(() => seriesFor(range), [range]);

  useEffect(() => {
    let i = 0;
    const t = window.setInterval(() => {
      i += 2;
      setTyped(AI_TEXT.slice(0, i));
      if (i >= AI_TEXT.length) window.clearInterval(t);
    }, 16);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => setScore(89), 250);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const t = window.setInterval(() => {
      setPrice((p) => Math.round((p + (Math.random() * 6 - 2.5)) * 100) / 100);
      setPulse(true);
      window.setTimeout(() => setPulse(false), 700);
    }, 4000);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const refresh = () => {
    setRefreshing(true);
    window.setTimeout(() => {
      setPrice((p) => Math.round((p + (Math.random() * 20 - 8)) * 100) / 100);
      setRefreshing(false);
    }, 900);
  };

  const card = "rounded-[22px] border border-[#EFE7FA] bg-white/85 shadow-[0_14px_40px_-24px_rgba(111,78,255,0.5)]";
  const seq = (i: number) => ({
    animation: "gold-fade-up 0.5s ease-out both",
    animationDelay: `${0.06 * i}s`,
  });

  return (
    <div
      className="fixed inset-0 z-[140] flex items-end justify-center bg-[rgba(18,12,32,0.55)] backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <style>{`
        @keyframes gold-slide-up { from { transform: translateY(40px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
        @keyframes gold-fade-up { from { transform: translateY(12px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
        @keyframes gold-draw { to { stroke-dashoffset: 0 } }
        @keyframes gold-pulse { 0%,100% { transform: scale(1) } 50% { transform: scale(1.04) } }
      `}</style>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "gold-slide-up 0.42s cubic-bezier(0.22,1,0.36,1) both" }}
        className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-[28px] border border-[rgba(212,175,55,0.45)] bg-gradient-to-b from-white via-[#FBF9FF] to-white shadow-[0_-10px_60px_rgba(212,175,55,0.25),0_30px_80px_-20px_rgba(111,78,255,0.35)] sm:rounded-[28px]"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-[#F1EBFA] bg-white/90 px-5 py-4 backdrop-blur-xl">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-bold text-[#1A0B2E]">
                💎 Gold Investment Advisor
              </h2>
              <p className="mt-1 text-xs text-[#6C5B85]">
                Powered by AI &amp; Live Gold Market Analysis
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={refresh}
                aria-label="Refresh market data"
                className="rounded-full border border-[#EFE7FA] bg-white p-2 text-[#6F4EFF] transition hover:bg-[#F7F3FF] active:scale-95"
              >
                <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
              </button>
              <button
                onClick={onClose}
                aria-label="Close"
                className="rounded-full border border-[#EFE7FA] bg-white p-2 text-[#1A0B2E] transition hover:bg-[#F7F3FF] active:scale-95"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4 p-5">
          {showAlert && (
            <div
              style={seq(0)}
              className="flex items-start gap-3 rounded-[20px] border border-[rgba(212,175,55,0.5)] bg-gradient-to-r from-[#FFF9E8] to-[#FFF4F0] p-3.5 shadow-[0_10px_30px_-18px_rgba(212,175,55,0.9)]"
            >
              <Bell size={16} className="mt-0.5 shrink-0 text-[#D4AF37]" />
              <p className="text-[13px] leading-6 text-[#4A3B22]">
                <span className="font-semibold">AI Alert:</span> Gold prices dropped 1.8% today.
                Based on historical trends, this may be a favorable buying opportunity.
              </p>
              <button
                onClick={() => setShowAlert(false)}
                aria-label="Dismiss alert"
                className="ml-auto shrink-0 text-[#A08A4B] hover:text-[#6b5a2c]"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Hero */}
          <div
            style={seq(1)}
            className="overflow-hidden rounded-[24px] border border-[rgba(212,175,55,0.35)] bg-gradient-to-br from-[#F7F3FF] via-white to-[#FFFBEF] p-5 shadow-[0_18px_50px_-28px_rgba(111,78,255,0.6)]"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8A78A8]">
              📈 Today&apos;s Gold Price
            </p>
            <div className="mt-2 flex flex-wrap items-end gap-3">
              <span
                className={cn("text-[34px] font-black leading-none text-[#1A0B2E]")}
                style={pulse ? { animation: "gold-pulse 0.7s ease-out" } : undefined}
              >
                ₹{price.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                <span className="ml-1 text-sm font-semibold text-[#6C5B85]">/ gram</span>
              </span>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                +1.42%
              </span>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Rising Today
              </span>
            </div>
            <div className="mt-4 h-24">
              <Sparkline values={seriesFor("1 Week")} stroke="#D4AF37" fill="#D4AF37" id="heroGrad" />
            </div>
          </div>

          {/* AI insight */}
          <div
            style={seq(2)}
            className="rounded-[22px] border border-[#E4D9FF] bg-gradient-to-br from-[#F6F1FF] to-[#FFFDF6] p-4 shadow-[0_16px_40px_-28px_rgba(111,78,255,0.8)]"
          >
            <p className="flex items-center gap-2 text-sm font-bold text-[#3B1E7A]">
              <Sparkles size={16} className="text-[#D4AF37]" /> 🤖 AI Recommendation
            </p>
            <p className="mt-2 min-h-[72px] text-[13px] leading-7 text-[#4A3B60]">
              {typed}
              <span className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 animate-pulse bg-[#6F4EFF]" />
            </p>
          </div>

          {/* Trend carousel */}
          <div style={seq(3)}>
            <h3 className="mb-2 text-sm font-bold text-[#1A0B2E]">Market Trend Analysis</h3>
            <div className="no-scrollbar -mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-1">
              <div className={cn(card, "w-[210px] shrink-0 snap-start p-4")}>
                <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#8A78A8]">
                  <TrendingUp size={14} className="text-emerald-600" /> Trend
                </p>
                <p className="mt-2 flex items-center gap-2 text-xl font-bold text-[#1A0B2E]">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Bullish
                </p>
                <p className="mt-2 text-xs leading-6 text-[#6C5B85]">
                  Prices have increased continuously for the past week.
                </p>
              </div>
              <div className={cn(card, "w-[210px] shrink-0 snap-start p-4")}>
                <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#8A78A8]">
                  <Hourglass size={14} className="text-[#D4AF37]" /> Best Time to Buy
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <div>
                    <p className="text-xl font-bold text-[#1A0B2E]">Today</p>
                    <p className="text-xs text-[#6C5B85]">Confidence 92%</p>
                  </div>
                  <div className="relative">
                    <Ring value={92} />
                    <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-[#6F4EFF]">
                      92%
                    </span>
                  </div>
                </div>
              </div>
              <div className={cn(card, "w-[210px] shrink-0 snap-start p-4")}>
                <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#8A78A8]">
                  <BarChart3 size={14} className="text-[#6F4EFF]" /> 30-Day Forecast
                </p>
                <p className="mt-2 text-xs text-[#6C5B85]">Expected Range</p>
                <p className="text-lg font-bold text-[#1A0B2E]">₹10,350 – ₹10,520</p>
              </div>
            </div>
          </div>

          {/* EMI vs Full */}
          <div style={seq(4)}>
            <h3 className="mb-2 text-sm font-bold text-[#1A0B2E]">EMI vs Full Payment</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className={cn(card, "p-4")}>
                <p className="text-sm font-bold text-[#6F4EFF]">EMI Purchase</p>
                <ul className="mt-2 space-y-1.5 text-xs leading-6 text-[#4A3B60]">
                  <li>✔ Lower upfront payment</li>
                  <li>✔ Flexible monthly installments</li>
                  <li>✔ Suitable for regular investors</li>
                </ul>
                <p className="mt-3 text-[11px] uppercase tracking-wider text-[#8A78A8]">
                  Estimated EMI
                </p>
                <p className="text-xl font-bold text-[#1A0B2E]">₹2,150/month</p>
              </div>
              <div className={cn(card, "border-[rgba(212,175,55,0.45)] p-4")}>
                <p className="text-sm font-bold text-[#B08D1E]">Full Payment</p>
                <ul className="mt-2 space-y-1.5 text-xs leading-6 text-[#4A3B60]">
                  <li>✔ Maximum savings</li>
                  <li>✔ No financing cost</li>
                  <li>✔ Better investment value</li>
                </ul>
                <p className="mt-3 text-[11px] uppercase tracking-wider text-[#8A78A8]">
                  Estimated Total
                </p>
                <p className="text-xl font-bold text-[#1A0B2E]">₹1,02,450</p>
              </div>
            </div>
          </div>

          {/* Historical */}
          <div style={seq(5)} className={cn(card, "p-4")}>
            <h3 className="text-sm font-bold text-[#1A0B2E]">Historical Performance</h3>
            <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
              {RANGES.map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={cn(
                    "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition active:scale-95",
                    range === r
                      ? "bg-gradient-to-r from-[#6F4EFF] to-[#9B7BFF] text-white shadow-[0_10px_20px_-12px_rgba(111,78,255,0.9)]"
                      : "border border-[#EFE7FA] bg-white text-[#6C5B85] hover:bg-[#F7F3FF]",
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
            <div className="mt-3 h-28">
              <Sparkline values={values} stroke="#6F4EFF" fill="#6F4EFF" id="histGrad" />
            </div>
          </div>

          {/* Score */}
          <div
            style={seq(6)}
            className="flex items-center gap-4 rounded-[22px] border border-[rgba(212,175,55,0.4)] bg-gradient-to-br from-[#F7F3FF] to-[#FFFBEF] p-4"
          >
            <div className="relative shrink-0">
              <svg width="96" height="96" className="-rotate-90">
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#6F4EFF" />
                    <stop offset="100%" stopColor="#D4AF37" />
                  </linearGradient>
                </defs>
                <circle cx="48" cy="48" r="40" stroke="#EFE7FA" strokeWidth="9" fill="none" />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="url(#scoreGrad)"
                  strokeWidth="9"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 40}
                  strokeDashoffset={2 * Math.PI * 40 * (1 - score / 100)}
                  style={{ transition: "stroke-dashoffset 1.2s ease-out" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black text-[#1A0B2E]">{score}</span>
                <span className="text-[10px] text-[#8A78A8]">/ 100</span>
              </div>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8A78A8]">
                Investment Opportunity
              </p>
              <p className="mt-1 text-lg font-bold text-[#1A0B2E]">Excellent</p>
              <p className="mt-1 text-xs leading-6 text-[#6C5B85]">
                Excellent time for long-term investment.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div style={seq(7)} className="space-y-2.5">
            <button className="flex w-full items-center justify-center gap-2 rounded-[18px] bg-gradient-to-r from-[#6F4EFF] to-[#9B7BFF] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_16px_30px_-14px_rgba(111,78,255,0.9)] transition duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]">
              <Wallet size={16} /> Start DigiGold Investment
            </button>
            <button className="flex w-full items-center justify-center gap-2 rounded-[18px] border border-[rgba(212,175,55,0.6)] bg-[#FFFBEF] px-5 py-3.5 text-sm font-semibold text-[#7A5F12] transition duration-300 hover:-translate-y-0.5 hover:bg-[#FFF6DF] active:translate-y-0 active:scale-[0.98]">
              <LineChartIcon size={16} /> View Historical Trends
            </button>
            <button className="flex w-full items-center justify-center gap-2 rounded-[18px] border border-[#EFE7FA] bg-white px-5 py-3.5 text-sm font-semibold text-[#1A0B2E] transition duration-300 hover:-translate-y-0.5 hover:bg-[#F7F3FF] active:translate-y-0 active:scale-[0.98]">
              <Star size={16} className="text-[#D4AF37]" /> Save Market Alert
            </button>
          </div>

          <p className="pb-1 text-[11px] leading-5 text-[#9A93A8]">
            Market analysis is AI-generated using live gold prices and historical trends. This is
            for informational purposes and should not be considered financial advice.
          </p>
        </div>
      </div>
    </div>
  );
}
