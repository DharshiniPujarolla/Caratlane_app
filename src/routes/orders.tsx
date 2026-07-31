import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { inr, ordersData } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "My Orders — LumiAura Jewellery" },
      { name: "description", content: "Track active orders, review past purchases and manage cancellations." },
      { property: "og:title", content: "My Orders — LumiAura Jewellery" },
      { property: "og:description", content: "Track and manage your LumiAura orders." },
    ],
  }),
  component: Orders,
});

const tabs = ["Active", "Completed", "Cancelled"] as const;
const stages = ["Placed", "Crafted", "Shipped", "Out for delivery", "Delivered"];

function Orders() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Active");
  const list = ordersData.filter((o) => o.status === tab);

  return (
    <div className="min-h-screen">
      <PageHeader title="My Orders" />
      <div className="flex gap-2 px-4 py-3">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "press flex-1 rounded-full py-2 text-[12px] font-semibold transition-colors",
              tab === t ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-3 px-4">
        {list.length === 0 && (
          <p className="py-20 text-center text-sm text-muted-foreground">
            No {tab.toLowerCase()} orders yet.
          </p>
        )}
        {list.map((o) => (
          <div key={o.id} className="animate-fade-up rounded-2xl bg-card p-3 shadow-soft">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-semibold">{o.id}</p>
              <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-semibold text-primary">
                {o.status}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Placed {o.placed} · {o.eta}
            </p>

            <div className="mt-3 space-y-2">
              {o.items.map((p) => (
                <Link
                  key={p.id}
                  to="/product/$id"
                  params={{ id: p.id }}
                  className="flex items-center gap-3"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="h-14 w-14 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium">{p.name}</p>
                    <p className="text-[11px] text-muted-foreground">{inr(p.price)}</p>
                  </div>
                </Link>
              ))}
            </div>

            {o.status !== "Cancelled" && (
              <div className="mt-4">
                <div className="flex items-center">
                  {stages.map((s, i) => (
                    <div key={s} className="flex flex-1 items-center last:flex-none">
                      <span
                        className={cn(
                          "h-2.5 w-2.5 rounded-full",
                          i <= o.stage ? "bg-primary" : "bg-border",
                        )}
                      />
                      {i < stages.length - 1 && (
                        <span
                          className={cn(
                            "h-0.5 flex-1",
                            i < o.stage ? "bg-primary" : "bg-border",
                          )}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <p className="mt-1.5 text-[11px] font-medium text-primary">
                  {stages[o.stage]}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
