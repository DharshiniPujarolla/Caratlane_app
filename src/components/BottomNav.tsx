import { Link, useRouterState } from "@tanstack/react-router";
import { Home, LayoutGrid, Package, Sparkles, Store, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/lumiai", label: "LumiAI", icon: Sparkles },
  { to: "/categories", label: "Categories", icon: LayoutGrid },
  { to: "/treasure-chest", label: "Treasure Chest", icon: Package },
  { to: "/stores", label: "Find Store", icon: Store },
  { to: "/profile", label: "You", icon: User },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[480px] px-2 pb-2">
      <div className="glass mx-1 flex items-center justify-between rounded-3xl border border-[#F0E6DF] bg-white/95 px-2 py-2 shadow-float">
        {items.map(({ to, label, icon: Icon }) => {
          const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
          const showRewardBadge = to === "/profile";

          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "press relative flex min-h-14 flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[10px] font-medium transition-colors",
                active ? "text-[#C026D3]" : "text-muted-foreground"
              )}
            >
              <span
                className={cn(
                  "relative flex h-10 w-10 items-center justify-center rounded-full transition-all",
                  active && "bg-[#FDF4FF]"
                )}
              >
                <Icon size={19} strokeWidth={active ? 2.4 : 1.8} />

                {showRewardBadge && (
                  <span className="absolute -bottom-1 -right-1 flex h-4 items-center justify-center rounded-full bg-[#D946EF] px-1.5 text-[9px] font-bold text-white shadow-xs">
                    ₹500
                  </span>
                )}
              </span>
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}