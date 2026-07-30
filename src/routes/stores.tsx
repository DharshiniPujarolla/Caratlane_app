import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, MapPin, Navigation, Phone } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { stores } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/stores")({
  head: () => ({
    meta: [
      { title: "Store Locator — Luméa Jewellery" },
      { name: "description", content: "Find a Luméa boutique near you and book a personal styling appointment." },
      { property: "og:title", content: "Store Locator — Luméa Jewellery" },
      { property: "og:description", content: "Nearby boutiques, timings and appointment booking." },
    ],
  }),
  component: Stores,
});

function Stores() {
  const [active, setActive] = useState(stores[0].id);

  return (
    <div className="min-h-screen">
      <PageHeader title="Store Locator" subtitle="3 boutiques near you" />

      <div className="relative m-4 h-48 overflow-hidden rounded-3xl border border-border bg-[repeating-linear-gradient(45deg,oklch(0.96_0.01_305)_0_12px,oklch(0.98_0.005_305)_12px_24px)]">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="glass flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-medium">
            <MapPin size={13} className="text-primary" /> Map preview
          </span>
        </div>
        {[
          { top: "28%", left: "24%" },
          { top: "54%", left: "58%" },
          { top: "36%", left: "76%" },
        ].map((pos, i) => (
          <span
            key={i}
            style={pos}
            className="absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full gradient-primary text-primary-foreground shadow-float"
          >
            <MapPin size={14} />
          </span>
        ))}
      </div>

      <div className="space-y-3 px-4">
        {stores.map((s) => (
          <button
            key={s.id}
            onClick={() => setActive(s.id)}
            className={cn(
              "press w-full rounded-2xl border p-3 text-left shadow-soft",
              active === s.id ? "border-primary bg-primary-soft/50" : "border-border bg-card",
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-[13px] font-semibold">{s.name}</p>
              <span className="shrink-0 text-[11px] font-medium text-primary">{s.distance}</span>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">{s.address}</p>
            <p className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Clock size={12} /> {s.timing}
              <Phone size={12} className="ml-2" /> {s.phone}
            </p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toast.success("Appointment request sent");
                }}
                className="press flex-1 rounded-lg gradient-primary py-2 text-[12px] font-semibold text-primary-foreground"
              >
                Book Appointment
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toast.success("Opening directions");
                }}
                className="press flex items-center gap-1.5 rounded-lg border border-border px-3 text-[12px] font-semibold"
              >
                <Navigation size={13} /> Directions
              </button>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
