import { Link, useRouterState } from "@tanstack/react-router";
import { Home, LayoutGrid, Heart, ShoppingBag, User } from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/categories", label: "Categories", icon: LayoutGrid },
  { to: "/wishlist", label: "Wishlist", icon: Heart },
  { to: "/cart", label: "Cart", icon: ShoppingBag },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const cartCount = useStore((s) => s.cart.reduce((a, l) => a + l.qty, 0));
  const wishCount = useStore((s) => s.wishlist.length);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-[480px]">
      <div className="glass mx-3 mb-3 flex items-center justify-between rounded-3xl px-2 py-2 shadow-float">
        {items.map(({ to, label, icon: Icon }) => {
          const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
          const badge = to === "/cart" ? cartCount : to === "/wishlist" ? wishCount : 0;
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "press relative flex flex-1 flex-col items-center gap-1 rounded-2xl py-2 text-[10px] font-medium transition-colors",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "relative flex h-8 w-12 items-center justify-center rounded-full transition-all",
                  active && "bg-primary-soft",
                )}
              >
                <Icon size={19} strokeWidth={active ? 2.4 : 1.8} />
                {badge > 0 && (
                  <span className="absolute -top-0.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-semibold text-primary-foreground">
                    {badge}
                  </span>
                )}
              </span>
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
