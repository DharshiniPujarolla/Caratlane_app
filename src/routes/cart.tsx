import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Gift, Minus, Plus, ShoppingBag, Tag, Trash2, Truck } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { findProduct, inr, offers } from "@/lib/data";
import { actions, useStore } from "@/lib/store";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Bag — Luméa Jewellery" },
      { name: "description", content: "Review your jewellery selections, apply coupons and checkout securely." },
      { property: "og:title", content: "Your Bag — Luméa Jewellery" },
      { property: "og:description", content: "Review your selections and checkout securely." },
    ],
  }),
  component: Cart,
});

export function useCartTotals() {
  const lines = useStore((s) => s.cart);
  const coupon = useStore((s) => s.coupon);
  const giftWrap = useStore((s) => s.giftWrap);
  const items = lines
    .map((l) => ({ line: l, product: findProduct(l.id) }))
    .filter((x) => x.product);
  const mrp = items.reduce((a, x) => a + (x.product?.mrp ?? 0) * x.line.qty, 0);
  const subtotal = items.reduce((a, x) => a + (x.product?.price ?? 0) * x.line.qty, 0);
  const couponOff = coupon ? Math.round(subtotal * 0.05) : 0;
  const wrap = giftWrap ? 199 : 0;
  const total = subtotal - couponOff + wrap;
  return { items, mrp, subtotal, couponOff, wrap, total, coupon, giftWrap };
}

function Cart() {
  const navigate = useNavigate();
  const t = useCartTotals();
  const [code, setCode] = useState("");

  if (t.items.length === 0) {
    return (
      <div className="min-h-screen">
        <PageHeader title="Your Bag" />
        <div className="flex flex-col items-center justify-center px-8 py-28 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft text-primary">
            <ShoppingBag size={26} />
          </span>
          <p className="mt-4 text-sm font-semibold">Your bag is empty</p>
          <p className="mt-1 text-xs text-muted-foreground">Add a piece you love to get started.</p>
          <Link
            to="/categories"
            className="press mt-5 rounded-xl gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
          >
            Browse jewellery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28">
      <PageHeader title="Your Bag" subtitle={`${t.items.length} items`} />

      <div className="space-y-3 p-4">
        {t.items.map(({ line, product }) =>
          product ? (
            <div key={line.id} className="animate-fade-up flex gap-3 rounded-2xl bg-card p-3 shadow-soft">
              <Link to="/product/$id" params={{ id: product.id }}>
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="h-24 w-24 rounded-xl object-cover"
                />
              </Link>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium">{product.name}</p>
                <p className="text-[11px] text-muted-foreground">
                  {product.purity} {product.metal}
                  {line.size ? ` · Size ${line.size}` : ""}
                </p>
                <p className="mt-1 text-[13px] font-semibold">{inr(product.price)}</p>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-3 rounded-full border border-border px-2 py-1">
                    <button
                      onClick={() => actions.setQty(line.id, line.qty - 1)}
                      aria-label="Decrease"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="text-[12px] font-semibold">{line.qty}</span>
                    <button
                      onClick={() => actions.setQty(line.id, line.qty + 1)}
                      aria-label="Increase"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                  <button
                    onClick={() => actions.removeFromCart(line.id)}
                    aria-label="Remove"
                    className="press flex h-8 w-8 items-center justify-center rounded-lg border border-border"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ) : null,
        )}

        <div className="rounded-2xl border border-border bg-card p-3">
          <p className="flex items-center gap-2 text-[12px]">
            <Truck size={15} className="text-primary" /> Free delivery by{" "}
            <b className="font-semibold">06 Aug 2026</b>
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-3">
          <p className="mb-2 flex items-center gap-2 text-[13px] font-semibold">
            <Tag size={15} className="text-primary" /> Apply coupon
          </p>
          <div className="flex gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Enter code"
              className="flex-1 rounded-xl border border-border px-3 py-2.5 text-[13px] outline-none focus:border-primary"
            />
            <button
              onClick={() => {
                if (offers.some((o) => o.code === code)) {
                  actions.applyCoupon(code);
                  toast.success(`${code} applied`);
                } else toast.error("Invalid coupon code");
              }}
              className="press rounded-xl gradient-primary px-4 text-[13px] font-semibold text-primary-foreground"
            >
              Apply
            </button>
          </div>
          <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto">
            {offers.map((o) => (
              <button
                key={o.code}
                onClick={() => {
                  setCode(o.code);
                  actions.applyCoupon(o.code);
                  toast.success(`${o.code} applied`);
                }}
                className="press shrink-0 rounded-full border border-dashed border-primary/40 bg-primary-soft px-3 py-1 text-[11px] font-semibold text-primary"
              >
                {o.code}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center justify-between rounded-2xl border border-border bg-card p-3">
          <span className="flex items-center gap-2 text-[13px] font-medium">
            <Gift size={15} className="text-primary" /> Add gift wrapping (₹199)
          </span>
          <input
            type="checkbox"
            checked={t.giftWrap}
            onChange={(e) => actions.setGiftWrap(e.target.checked)}
            className="h-4 w-4 accent-[oklch(0.42_0.18_305)]"
          />
        </label>

        <div className="space-y-2 rounded-2xl border border-border bg-card p-3 text-[13px]">
          <p className="font-semibold">Price summary</p>
          <Row label="Total MRP" value={inr(t.mrp)} />
          <Row label="Discount" value={`- ${inr(t.mrp - t.subtotal)}`} accent />
          {t.couponOff > 0 && <Row label={`Coupon (${t.coupon})`} value={`- ${inr(t.couponOff)}`} accent />}
          {t.wrap > 0 && <Row label="Gift wrap" value={inr(t.wrap)} />}
          <Row label="Delivery" value="FREE" accent />
          <div className="mt-1 flex justify-between border-t border-border pt-2 text-[15px] font-semibold">
            <span>Total</span>
            <span>{inr(t.total)}</span>
          </div>
        </div>
      </div>

      <div className="glass fixed inset-x-0 bottom-0 z-40 mx-auto flex max-w-[480px] items-center gap-3 border-t border-border/60 px-4 py-3 pb-4">
        <div>
          <p className="text-[15px] font-semibold">{inr(t.total)}</p>
          <p className="text-[11px] text-muted-foreground">incl. taxes</p>
        </div>
        <button
          onClick={() => navigate({ to: "/checkout" })}
          className="press h-11 flex-1 rounded-xl gradient-primary text-sm font-semibold text-primary-foreground"
        >
          Checkout
        </button>
      </div>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={accent ? "font-medium text-[color:var(--success)]" : "font-medium"}>
        {value}
      </span>
    </div>
  );
}
