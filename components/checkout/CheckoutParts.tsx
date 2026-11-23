"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { XiventaEvent } from "@/data";
import { ticketPathH } from "@/components/shared/ticket";
import { MinusIcon, PlusIcon } from "@/components/icons";
import { Sheet, sheetPrimary } from "@/components/shared/Sheet";
import { CHECKOUT_SETTINGS, type CheckoutTier, money, type Totals } from "@/lib/checkout";

/** Width and height of an element, for drawing ticket outlines that follow the card's real size. */
export function useSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const r = entry.target.getBoundingClientRect();
      setSize((s) => (s && Math.round(s.w) === Math.round(r.width) && Math.round(s.h) === Math.round(r.height) ? s : { w: r.width, h: r.height }));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, size };
}

/** A clock that ticks every second (hold timers). */
export function useNow() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

/** Figma `Stepper`: 32 px minus (white, #D5DCE3), 17 / 22 bold count, 32 px pink plus. */
export function Stepper({ value, max, onChange, label }: { value: number; max: number; onChange: (n: number) => void; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        aria-label={`One less ${label}`}
        disabled={value === 0}
        onClick={() => onChange(Math.max(0, value - 1))}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-[#D5DCE3] bg-white text-[#172B3A] disabled:opacity-40"
      >
        <MinusIcon size={18} />
      </button>
      <span className="w-6 text-center text-[17px] font-bold leading-[22px] tracking-[-0.01em] text-[#172B3A]" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        aria-label={`One more ${label}`}
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E22765] text-white disabled:bg-[#F5A3BF]"
      >
        <PlusIcon size={18} />
      </button>
    </div>
  );
}

/**
 * Figma `Tier` (AM28 358 wide, PW10 768 wide): ticket outline with notches on the perforation.
 * Selected: #FDEEF3 fill, 1.5 px #E22765 border and perforation, 140 px stub with a stepper.
 * Not selected: cream, #B4BFCA, 96 px stub with a 32 px pink add. Sold out: grey, "Sold out".
 */
export function TierCard({ tier, qty, onChange }: { tier: CheckoutTier; qty: number; onChange: (n: number) => void }) {
  const { ref, size } = useSize<HTMLDivElement>();
  const on = qty > 0;
  const stub = on ? 140 : 96;
  const fill = tier.soldOut ? "#F4F6F8" : on ? "#FDEEF3" : "#FDFFF0";
  const stroke = on ? "#E22765" : "#B4BFCA";
  const w = size?.w ?? 0;
  const h = size?.h ?? 0;
  const nx = w - stub + 0.5;
  return (
    <div ref={ref} className="relative w-full">
      <div
        className="flex min-h-[110px] w-full"
        style={{ backgroundColor: fill, clipPath: size ? `path('${ticketPathH(w, h, nx)}')` : undefined, borderRadius: size ? undefined : 16 }}
      >
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 p-4">
          <span className="text-[10px] uppercase leading-3 tracking-[0.04em] text-[#4D5E70]">{tier.name}</span>
          <span className={`text-[20px] font-bold leading-[26px] tracking-[-0.02em] ${tier.soldOut ? "text-[#8C99A7]" : "text-[#172B3A]"}`}>{money(tier.price)}</span>
          <span className="text-[12px] leading-4 text-[#4D5E70]">{tier.description}</span>
        </div>
        <div className="flex shrink-0 items-center justify-center" style={{ width: stub }}>
          {tier.soldOut ? (
            <span className="text-[12px] leading-4 text-[#68788A]">Sold out</span>
          ) : on ? (
            <Stepper value={qty} max={tier.max} onChange={onChange} label={tier.label} />
          ) : (
            <button type="button" aria-label={`Add ${tier.label}`} onClick={() => onChange(1)} className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E22765] text-white hover:bg-[#C81E57]">
              <PlusIcon size={18} />
            </button>
          )}
        </div>
      </div>
      {size && (
        <svg className="pointer-events-none absolute inset-0" width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" aria-hidden="true">
          <path d={ticketPathH(w, h, nx, on ? 0.75 : 0.5)} stroke={stroke} strokeWidth={on ? 1.5 : 1} />
          <line x1={nx} y1="8" x2={nx} y2={h - 8} stroke={stroke} strokeDasharray="4 4" />
        </svg>
      )}
    </div>
  );
}

/**
 * Figma `Order Summary` (AM30 358 wide, PW10 / PW11 334 wide): event row, lines, dashed perforation
 * with side notches, 17 / 22 bold total and the refund note.
 */
export function OrderSummary({ event, t, when, compact = false, note }: { event: XiventaEvent; t: Totals; when: string; compact?: boolean; note?: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#D5DCE3] bg-white">
      <div className={`flex items-center gap-3 ${compact ? "p-3" : "p-4"}`}>
        <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[8px] bg-[#E9EDF1]">
          <Image src={event.imageUrl} alt="" fill sizes="48px" className="object-cover" />
        </span>
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate text-[14px] leading-[18px] text-[#172B3A]">{event.title}</span>
          <span className="truncate whitespace-pre text-[12px] leading-4 text-[#68788A]">{when}</span>
        </span>
      </div>
      <div className="h-px bg-[#E9EDF1]" />
      <div className="flex flex-col gap-2 p-4">
        {t.lines.map((l) => (
          <div key={l.tier.id} className="flex items-center justify-between text-[14px] leading-5">
            <span className="text-[#4D5E70]">
              {l.label} × {l.qty}
            </span>
            <span className="text-[#172B3A]">{money(l.amount)}</span>
          </div>
        ))}
        {t.subtotal > 0 && (
          <div className="flex items-center justify-between text-[14px] leading-5">
            <span className="text-[#4D5E70]">Service fee</span>
            <span className="text-[#172B3A]">{money(t.fee)}</span>
          </div>
        )}
      </div>
      <div className="relative h-px">
        <div className="mx-4 border-t border-dashed border-[#B4BFCA]" />
        <span className="absolute -left-2 -top-2 h-4 w-4 rounded-full border border-[#D5DCE3] bg-white" />
        <span className="absolute -right-2 -top-2 h-4 w-4 rounded-full border border-[#D5DCE3] bg-white" />
      </div>
      <div className="flex flex-col gap-1 p-4">
        <div className="flex items-center justify-between text-[17px] font-bold leading-[22px] tracking-[-0.01em] text-[#172B3A]">
          <span>Total</span>
          <span>{money(t.total)}</span>
        </div>
        <span className="text-[12px] leading-4 text-[#68788A]">{note ?? `Refunds follow the host’s refund policy${compact ? "." : " below."}`}</span>
      </div>
    </div>
  );
}

/** Figma `Input` with label and helper (AM29 / PW11). */
export function Field({
  label,
  hint,
  value,
  onChange,
  type = "text",
  placeholder,
  error,
  inputMode,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  error?: string;
  inputMode?: "tel" | "email" | "text";
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[13px] leading-4 text-[#172B3A]">{label}</span>
      <input
        type={type}
        value={value}
        inputMode={inputMode}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`h-12 rounded-[12px] border bg-white px-4 text-[14px] leading-5 text-[#172B3A] placeholder:text-[#68788A] focus:outline-none ${
          error ? "border-[#FA443A]" : "border-[#D5DCE3] focus:border-[#E22765]"
        }`}
      />
      {(error || hint) && <span className={`text-[12px] leading-4 ${error ? "text-[#C0231A]" : "text-[#68788A]"}`}>{error ?? hint}</span>}
    </label>
  );
}

const METHODS = [
  { id: "card" as const, title: "Card", sub: "Visa, Mastercard or Verve" },
  { id: "transfer" as const, title: "Bank transfer", sub: "Pay from any Nigerian bank app" },
  { id: "ussd" as const, title: "USSD", sub: "Dial a code from your phone" },
];

/** AM31 / PW11 "Pay with": three radio rows. */
export function MethodList({ value, onChange }: { value: "card" | "transfer" | "ussd"; onChange: (v: "card" | "transfer" | "ussd") => void }) {
  return (
    <div role="radiogroup" className="flex flex-col">
      {METHODS.map((m) => {
        const on = value === m.id;
        return (
          <button key={m.id} type="button" role="radio" aria-checked={on} onClick={() => onChange(m.id)} className="flex min-h-14 items-center gap-3 px-1 py-2 text-left">
            <span className="flex flex-1 flex-col gap-0.5">
              <span className="text-[12px] text-[#172B3A]">{m.title}</span>
              <span className="text-[12px] text-[#4D5E70]">{m.sub}</span>
            </span>
            <span className={`h-5 w-5 shrink-0 rounded-full ${on ? "border-[6px] border-[#E22765]" : "border-[1.5px] border-[#B4BFCA]"}`} />
          </button>
        );
      })}
    </div>
  );
}

export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={`flex h-[26px] w-11 shrink-0 items-center rounded-full px-[3px] transition ${on ? "justify-end bg-[#E22765]" : "justify-start bg-[#D5DCE3]"}`}
    >
      <span className="h-5 w-5 rounded-full bg-white shadow-[0_1px_2px_rgba(23,43,58,0.2)]" />
    </button>
  );
}

const detail = (k: string, v: string, big = false) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-[12px] leading-4 text-[#4D5E70]">{k}</span>
    <span className={`font-bold text-[#172B3A] ${big ? "text-[24px] leading-[30px] tracking-[-0.02em]" : "text-[15px] leading-5"}`}>{v}</span>
  </div>
);

/** PW40 Pay by transfer: a one-off account for this order. */
export function TransferSheet({ open, onClose, total, onSent }: { open: boolean; onClose: () => void; total: number; onSent: () => void }) {
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Pay by bank transfer"
      footer={
        <div className="flex w-full justify-end gap-2">
          <button type="button" onClick={onClose} className="flex h-11 items-center rounded-[12px] bg-[#172B3A] px-4 text-[14px] text-white">
            Cancel
          </button>
          <button type="button" onClick={onSent} className="flex h-11 items-center rounded-[12px] bg-[#E22765] px-4 text-[14px] text-white">
            I&apos;ve sent the money
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-3">
        <p className="text-[14px] leading-5 text-[#4D5E70]">Send exactly {money(total)} from any Nigerian bank app. This account is only for this order.</p>
        <div className="flex flex-col gap-3 rounded-2xl bg-[#F4F6F8] p-4">
          {detail("Bank", "Wema Bank")}
          {detail("Account number", "7821 0045 63", true)}
          {detail("Account name", "Xiventa Checkout")}
          {detail("Amount", money(total))}
        </div>
        <p className="text-[14px] leading-5 text-[#4D5E70]">This account expires in {CHECKOUT_SETTINGS.transferMinutes}:00. Your tickets stay held until then.</p>
      </div>
    </Sheet>
  );
}

/** PW41 Pay with USSD. */
export function UssdSheet({ open, onClose, total, onSent }: { open: boolean; onClose: () => void; total: number; onSent: () => void }) {
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Pay with USSD"
      footer={
        <div className="flex w-full justify-end gap-2">
          <button type="button" onClick={onClose} className="flex h-11 items-center rounded-[12px] bg-[#172B3A] px-4 text-[14px] text-white">
            Cancel
          </button>
          <button type="button" onClick={onSent} className="flex h-11 items-center rounded-[12px] bg-[#E22765] px-4 text-[14px] text-white">
            I&apos;ve dialled it
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-3">
        <p className="text-[14px] leading-5 text-[#4D5E70]">Dial this code from the phone linked to your bank account, then follow the steps.</p>
        <div className="flex flex-col gap-3 rounded-2xl bg-[#F4F6F8] p-4">
          {detail("Bank", "GTBank · Change")}
          {detail("Dial", `*737*000*${total}#`, true)}
          {detail("Amount", money(total))}
        </div>
        <p className="text-[14px] leading-5 text-[#4D5E70]">The code works for the next 10 minutes.</p>
      </div>
    </Sheet>
  );
}

/** Web checkout steps: "1 Tickets  2 Your details  3 Pay", current step pink. */
export function Steps({ current, free = false }: { current: 1 | 2 | 3; free?: boolean }) {
  const steps = free ? ["Tickets", "Your details"] : ["Tickets", "Your details", "Pay"];
  return (
    <ol className="flex gap-6 text-[13px] leading-4">
      {steps.map((s, i) => (
        <li key={s} className={i + 1 === current ? "text-[#C81E57]" : "text-[#4D5E70]"}>
          {i + 1}&nbsp;&nbsp;{s}
        </li>
      ))}
    </ol>
  );
}

export { sheetPrimary };
