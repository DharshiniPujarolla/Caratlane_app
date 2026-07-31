import { useEffect, useRef, useState } from "react";
import { Headset, Phone, Video, Store, Home, MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

const options = [
  { label: "Talk to Our Experts", icon: Phone },
  { label: "Live Video Consultation", icon: Video },
  { label: "Book a Store Visit", icon: Store },
  { label: "Book a Try at Home", icon: Home },
  { label: "Chat on WhatsApp", icon: MessageCircle },
] as const;

export function ConciergeFab() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <div ref={ref} className="fixed bottom-28 right-4 z-[60] flex flex-col items-end gap-2">
      {options.map(({ label, icon: Icon }, i) => (
        <button
          key={label}
          type="button"
          onClick={() => setOpen(false)}
          style={{ transitionDelay: `${open ? i * 45 : (options.length - i) * 25}ms` }}
          className={cn(
            "press flex items-center gap-2.5 rounded-2xl border border-border bg-card py-2.5 pl-3 pr-4 shadow-card transition-all duration-300 hover:bg-primary-soft hover:shadow-float",
            open
              ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
              : "pointer-events-none translate-y-3 scale-95 opacity-0",
          )}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <Icon size={16} />
          </span>
          <span className="whitespace-nowrap text-[13px] font-medium">{label}</span>
        </button>
      ))}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Concierge support"
        className="press flex h-14 w-14 items-center justify-center rounded-full gradient-primary text-primary-foreground shadow-float transition-transform duration-300"
      >
        <span className={cn("transition-transform duration-300", open && "rotate-90")}>
          {open ? <X size={22} /> : <Headset size={22} />}
        </span>
      </button>
    </div>
  );
}
