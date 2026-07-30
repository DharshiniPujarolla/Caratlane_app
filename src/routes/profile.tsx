import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  ChevronRight,
  CreditCard,
  Gem,
  Heart,
  LogOut,
  MapPin,
  Package,
  Settings,
  Store,
  User,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { actions, useStore } from "@/lib/store";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Account — Luméa Jewellery" },
      { name: "description", content: "Manage your profile, addresses, saved cards, rewards and notifications." },
      { property: "og:title", content: "My Account — Luméa Jewellery" },
      { property: "og:description", content: "Profile, addresses, rewards and settings." },
    ],
  }),
  component: Profile,
});

const rows = [
  { label: "Personal Information", icon: User, to: "/profile" },
  { label: "Saved Addresses", icon: MapPin, to: "/profile" },
  { label: "My Orders", icon: Package, to: "/orders" },
  { label: "Wishlist", icon: Heart, to: "/wishlist" },
  { label: "Saved Cards", icon: CreditCard, to: "/profile" },
  { label: "Store Locator", icon: Store, to: "/stores" },
  { label: "Notifications", icon: Bell, to: "/profile" },
  { label: "Settings", icon: Settings, to: "/profile" },
] as const;

function Profile() {
  const user = useStore((s) => s.user);
  const wish = useStore((s) => s.wishlist.length);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <PageHeader title="My Account" />

      <div className="gradient-primary mx-4 mt-4 rounded-3xl p-4 text-primary-foreground shadow-card">
        <div className="flex items-center gap-3">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-lg font-semibold">
            {(user?.name ?? "G")[0]}
          </span>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold">{user?.name ?? "Guest User"}</p>
            <p className="truncate text-[11px] opacity-85">
              {user?.email ?? "Sign in for rewards & faster checkout"}
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          {[
            ["Orders", String(3)],
            ["Wishlist", String(wish)],
            ["Rewards", "1,250"],
          ].map(([k, v]) => (
            <div key={k} className="rounded-2xl bg-white/10 py-2">
              <p className="text-sm font-semibold">{v}</p>
              <p className="text-[10px] opacity-85">{k}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-4 mt-4 flex items-center gap-3 rounded-2xl border border-gold/40 bg-gold-soft/60 p-3">
        <Gem size={18} className="text-[color:var(--gold)]" />
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold">Luméa Rewards · Gold tier</p>
          <p className="text-[11px] text-muted-foreground">
            1,250 points · ₹1,250 off your next order
          </p>
        </div>
      </div>

      <div className="mx-4 mt-4 divide-y divide-border overflow-hidden rounded-2xl bg-card shadow-soft">
        {rows.map(({ label, icon: Icon, to }) => (
          <Link key={label} to={to} className="press flex items-center gap-3 px-4 py-3.5">
            <Icon size={17} className="text-primary" />
            <span className="flex-1 text-[13px] font-medium">{label}</span>
            <ChevronRight size={16} className="text-muted-foreground" />
          </Link>
        ))}
      </div>

      <button
        onClick={() => {
          actions.signOut();
          navigate({ to: "/auth" });
        }}
        className="press mx-4 mt-4 flex w-[calc(100%-2rem)] items-center justify-center gap-2 rounded-2xl border border-border py-3 text-[13px] font-semibold text-destructive"
      >
        <LogOut size={16} /> {user ? "Log out" : "Sign in"}
      </button>

      <p className="mt-4 text-center text-[11px] text-muted-foreground">Luméa · v1.0.0</p>
    </div>
  );
}
