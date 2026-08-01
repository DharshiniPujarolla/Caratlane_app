import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, CreditCard, MapPin, Wallet } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { inr, offers } from "@/lib/data";
import { actions } from "@/lib/store";
import { useCartTotals } from "./cart";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Secure Checkout — LumiAura Jewellery" },
      { name: "description", content: "Confirm your address, choose a payment method and place your LumiAura order." },
      { property: "og:title", content: "Secure Checkout — LumiAura" },
      { property: "og:description", content: "Address, payment and order summary in one step." },
    ],
  }),
  component: Checkout,
});

const addresses = [
  {
    id: "a1",
    label: "Home",
    name: "Aditi Rao",
    line: "402, Palm Grove Residency, 12th Main, Indiranagar, Bengaluru 560038",
    phone: "+91 98450 12345",
  },
  {
    id: "a2",
    label: "Work",
    name: "Aditi Rao",
    line: "Level 6, Prestige Tech Park, Marathahalli, Bengaluru 560103",
    phone: "+91 98450 12345",
  },
];

const payments = [
  { id: "upi", label: "UPI · GPay, PhonePe", icon: Wallet },
  { id: "card", label: "Credit / Debit Card", icon: CreditCard },
  { id: "emi", label: "EMI from ₹4,999/mo", icon: CreditCard },
  { id: "cod", label: "Cash on Delivery", icon: Wallet },
];

function Checkout() {
  const navigate = useNavigate();
  const t = useCartTotals();
  const [addr, setAddr] = useState("a1");
  const [pay, setPay] = useState("upi");
  const [placed, setPlaced] = useState(false);

  if (placed) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-8 text-center">
        <span className="animate-fade-up flex h-20 w-20 items-center justify-center rounded-full gradient-primary text-primary-foreground">
          <Check size={34} />
        </span>
        <h1 className="mt-5 text-lg font-semibold">Order placed</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Order LM-90312 · Arriving by 06 Aug 2026
        </p>
        <button
          onClick={() => navigate({ to: "/orders" })}
          className="press mt-6 w-full rounded-xl gradient-primary py-3 text-sm font-semibold text-primary-foreground"
        >
          Track order
        </button>
        <button
          onClick={() => navigate({ to: "/" })}
          className="press mt-2 w-full py-3 text-sm font-semibold text-primary"
        >
          Continue shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28">
      <PageHeader title="Checkout" subtitle="Address · Payment · Review" />

      <div className="space-y-4 p-4">
        <section>
          <p className="mb-2 flex items-center gap-2 text-[13px] font-semibold">
            <MapPin size={15} className="text-primary" /> Delivery address
          </p>
          <div className="space-y-2">
            {addresses.map((a) => (
              <button
                key={a.id}
                onClick={() => setAddr(a.id)}
                className={cn(
                  "press w-full rounded-2xl border p-3 text-left",
                  addr === a.id ? "border-primary bg-primary-soft/60" : "border-border bg-card",
                )}
              >
                <p className="text-[13px] font-semibold">
                  {a.label} · {a.name}
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{a.line}</p>
                <p className="text-[11px] text-muted-foreground">{a.phone}</p>
              </button>
            ))}
            <button className="press w-full rounded-2xl border border-dashed border-border py-2.5 text-[12px] font-semibold text-primary">
              + Add new address
            </button>
          </div>
        </section>

        <section>
          <p className="mb-2 text-[13px] font-semibold">Payment method</p>
          <div className="space-y-2">
            {payments.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setPay(id)}
                className={cn(
                  "press flex w-full items-center gap-3 rounded-2xl border p-3 text-left",
                  pay === id ? "border-primary bg-primary-soft/60" : "border-border bg-card",
                )}
              >
                <Icon size={17} className="text-primary" />
                <span className="text-[13px] font-medium">{label}</span>
              </button>
            ))}
          </div>
        </section>

        <section>
          <p className="mb-2 text-[13px] font-semibold">Available offers</p>
          <div className="space-y-2">
            {offers.slice(0, 2).map((o) => (
              <div
                key={o.code}
                className="flex items-center justify-between rounded-2xl border border-dashed border-primary/30 bg-primary-soft/50 px-3 py-2.5"
              >
                <div>
                  <p className="text-[12px] font-semibold">{o.title}</p>
                  <p className="text-[11px] text-muted-foreground">{o.desc}</p>
                </div>
                <button
                  onClick={() => {
                    actions.applyCoupon(o.code);
                    toast.success(`${o.code} applied`);
                  }}
                  className="text-[11px] font-semibold text-primary"
                >
                  APPLY
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-2 rounded-2xl border border-border bg-card p-3 text-[13px]">
          <p className="font-semibold">Order summary</p>
          {t.items.map(
            ({ line, product }) =>
              product && (
                <div key={line.id} className="flex justify-between text-[12px]">
                  <span className="mr-3 truncate text-muted-foreground">
                    {product.name} × {line.qty}
                  </span>
                  <span className="font-medium">{inr(product.price * line.qty)}</span>
                </div>
              ),
          )}
          <div className="mt-1 flex justify-between border-t border-border pt-2 text-[15px] font-semibold">
            <span>Payable</span>
            <span>{inr(t.total)}</span>
          </div>
        </section>
      </div>

      <div className="glass fixed inset-x-0 bottom-0 z-40 mx-auto flex max-w-[480px] items-center gap-3 border-t border-border/60 px-4 py-3 pb-4">
        <div>
          <p className="text-[15px] font-semibold">{inr(t.total)}</p>
          <p className="text-[11px] text-muted-foreground">{t.items.length} items</p>
        </div>
        <button
          onClick={() => {
            if (t.items.length === 0) return toast.error("Your bag is empty");
            actions.purchaseJewellery();
            actions.clearCart();
            setPlaced(true);
          }}
          className="press h-11 flex-1 rounded-xl gradient-primary text-sm font-semibold text-primary-foreground"
        >
          Place Order
        </button>
      </div>
    </div>
  );
}
