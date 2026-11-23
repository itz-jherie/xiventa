"use client";

import Image from "next/image";
import Link from "next/link";
import { ticketPathH } from "@/components/shared/ticket";
import { CheckIcon, ChevronRightIcon, InfoIcon, RepeatIcon } from "@/components/icons";
import type { Hosted } from "@/lib/hosting";

/** Pill tones used across the organizer app (status chips on rows and cards). */
const TONES = {
  grey: "bg-[#E9EDF1] text-[#4D5E70]",
  green: "bg-[#E7F8EF] text-[#067647]",
  amber: "bg-[#FEF3DC] text-[#93500B]",
  red: "bg-[#FDECEB] text-[#C0231A]",
  pink: "bg-[#FDEEF3] text-[#C81E57]",
  blue: "bg-[#EAF2FF] text-[#1D4ED8]",
} as const;
export type Tone = keyof typeof TONES;

export function Pill({ label, tone = "grey", dot = false }: { label: string; tone?: Tone; dot?: boolean }) {
  return (
    <span className={`inline-flex h-6 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2 text-[12px] leading-4 ${TONES[tone]}`}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {label}
    </span>
  );
}

export function Initials({ text, size = 40 }: { text: string; size?: number }) {
  return (
    <span style={{ width: size, height: size }} className="flex shrink-0 items-center justify-center rounded-full bg-[#F0EDFF] text-[14px] leading-5 text-[#6A4FD9]">
      {text}
    </span>
  );
}

/** OM01 hosted event card: list card shape with the host's figure on the right ("186 sold"). */
export function HostCard({ h, footer, href }: { h: Hosted; footer: string; href: string }) {
  const w = 358;
  const ht = 108;
  const nx = 112.5;
  return (
    <Link href={href} className="relative block shrink-0 select-none" style={{ width: w, height: ht }}>
      <div className="flex h-full bg-[#FDFFF0]" style={{ clipPath: `path('${ticketPathH(w, ht, nx)}')` }}>
        <span className="relative block w-[112px] shrink-0 bg-[#E9EDF1]">{h.image && <Image src={h.image} alt="" fill sizes="112px" className="object-cover" />}</span>
        <span className="flex min-w-0 flex-1 flex-col gap-1.5 pb-3 pl-[13px] pr-4 pt-5">
          <span className="truncate text-[12px] leading-4 text-[#C81E57]">{h.date}</span>
          <span className="truncate text-[14px] font-bold leading-5 text-[#172B3A]">{h.title}</span>
          <span className="mt-auto flex items-end justify-between gap-2">
            {h.recurring && h.status !== "ended" ? (
              <span className="inline-flex h-6 items-center gap-1 rounded-full bg-[#E9EDF1] px-2 text-[12px] leading-4 text-[#4D5E70]">
                <RepeatIcon size={12} />
                {h.recurring}
              </span>
            ) : (
              <span />
            )}
            <span className="truncate text-[14px] font-bold leading-5 text-[#172B3A]">{footer}</span>
          </span>
        </span>
      </div>
      <svg className="pointer-events-none absolute inset-0" width={w} height={ht} viewBox={`0 0 ${w} ${ht}`} fill="none" aria-hidden="true">
        <path d={ticketPathH(w, ht, nx, 0.5)} stroke="#B4BFCA" strokeOpacity="0.5" />
      </svg>
    </Link>
  );
}

/** OM02 stat card: 13 / 16 label, 24 bold figure, 12 / 16 note (green when `good`). */
export function StatCard({ label, value, note, good = false, wide = false }: { label: string; value: string; note: string; good?: boolean; wide?: boolean }) {
  return (
    <div className={`flex flex-col gap-2 rounded-2xl border border-[#D5DCE3] bg-white p-5 ${wide ? "col-span-2" : ""}`}>
      <span className="text-[13px] leading-4 text-[#4D5E70]">{label}</span>
      <span className="text-[24px] font-bold leading-[30px] tracking-[-0.02em] text-[#172B3A]">{value}</span>
      <span className={`flex items-center gap-1 text-[12px] leading-4 ${good ? "text-[#067647]" : "text-[#68788A]"}`}>
        {good && (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M1.5 10L5 6.5L7.5 9L12.5 4M12.5 4H9M12.5 4V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {note}
      </span>
    </div>
  );
}

/** OM02 "Make it go further" row: pink tile, bold title, hint, chevron. */
export function BoostRow({ icon, title, sub, onClick, href }: { icon: React.ReactNode; title: string; sub: string; onClick?: () => void; href?: string }) {
  const inner = (
    <>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-[#FDEEF3] text-[#E22765]">{icon}</span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5 text-left">
        <span className="truncate text-[15px] font-bold leading-5 text-[#172B3A]">{title}</span>
        <span className="truncate text-[13px] leading-4 text-[#4D5E70]">{sub}</span>
      </span>
      <ChevronRightIcon size={20} className="shrink-0 text-[#4D5E70]" />
    </>
  );
  const cls = "flex min-h-[72px] w-full items-center gap-3 py-3";
  return href ? (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}

/** Tinted notice with an optional action (amber waiting, red declined / hidden, blue info, green done). */
export function Banner({ tone = "amber", title, body, action, onAction, side = false }: { tone?: "amber" | "red" | "blue" | "green"; title: string; body: string; action?: string; onAction?: () => void; side?: boolean }) {
  const bg = { amber: "bg-[#FEF3DC]", red: "bg-[#FDECEB]", blue: "bg-[#EAF2FF]", green: "bg-[#E7F8EF]" }[tone];
  const fg = { amber: "text-[#93500B]", red: "text-[#C0231A]", blue: "text-[#1D4ED8]", green: "text-[#067647]" }[tone];
  return (
    <div className={`flex gap-3 rounded-2xl px-4 py-3 ${side ? "items-center" : ""} ${bg}`}>
      <InfoIcon size={20} className={`mt-0.5 shrink-0 ${fg}`} />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className={`text-[14px] leading-5 text-[#172B3A] ${side ? "" : "font-bold"}`}>{title}</p>
        <p className="text-[13px] leading-[18px] text-[#4D5E70]">{body}</p>
        {action && !side && (
          <button type="button" onClick={onAction} className={`w-fit pt-1 text-[13px] leading-4 underline-offset-2 hover:underline ${fg}`}>
            {action}
          </button>
        )}
      </div>
      {action && side && (
        <button type="button" onClick={onAction} className="shrink-0 px-2 text-[14px] leading-5 text-[#E22765]">
          {action}
        </button>
      )}
    </div>
  );
}

/** Underlined tabs (OM01 Upcoming / Drafts / Live / Ended). */
export function LineTabs<T extends string>({ items, value, onChange }: { items: { value: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div role="tablist" className="flex gap-3 border-b border-[#E9EDF1]">
      {items.map((it) => (
        <button
          key={it.value}
          type="button"
          role="tab"
          aria-selected={it.value === value}
          onClick={() => onChange(it.value)}
          className={`-mb-px h-10 border-b-2 px-1 text-[14px] leading-5 ${it.value === value ? "border-[#E22765] text-[#172B3A]" : "border-transparent text-[#68788A]"}`}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}

/** OM24 / OM28 checklist row: green tick when done, blue info with a pink Add when not. */
export function CheckRow({ done, title, sub, onAdd }: { done: boolean; title: string; sub: string; onAdd?: () => void }) {
  return (
    <button type="button" onClick={done ? undefined : onAdd} className="flex min-h-[72px] w-full items-center gap-3 py-2 text-left" disabled={done}>
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${done ? "bg-[#E7F8EF] text-[#067647]" : "bg-[#EAF2FF] text-[#1D4ED8]"}`}>
        {done ? <CheckIcon size={16} /> : <InfoIcon size={16} />}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-[15px] leading-5 text-[#172B3A]">{title}</span>
        <span className="text-[12px] leading-4 text-[#68788A]">{sub}</span>
      </span>
      {!done && (
        <span className="flex items-center gap-1 text-[13px] leading-4 text-[#E22765]">
          Add
          <ChevronRightIcon size={16} />
        </span>
      )}
    </button>
  );
}

/** Two buttons side by side inside a card (Decline / Refund ₦31,500). */
export function PairButtons({ left, right, onLeft, onRight }: { left: string; right: string; onLeft: () => void; onRight: () => void }) {
  return (
    <div className="flex gap-2">
      <button type="button" onClick={onLeft} className="flex h-10 flex-1 items-center justify-center rounded-[8px] border border-[#B4BFCA] bg-white text-[14px] text-[#172B3A]">
        {left}
      </button>
      <button type="button" onClick={onRight} className="flex h-10 flex-1 items-center justify-center rounded-[8px] bg-[#E22765] text-[14px] text-white hover:bg-[#C81E57]">
        {right}
      </button>
    </div>
  );
}

/** Label / value rows for a sheet (Ticket × 2, Order XV 7TGT). */
export function Pairs({ rows }: { rows: [string, React.ReactNode][] }) {
  return (
    <div className="flex flex-col">
      {rows.map(([k, v]) => (
        <div key={k} className="flex min-h-11 items-center justify-between gap-4 border-b border-[#E9EDF1] py-2 last:border-0">
          <span className="text-[14px] leading-5 text-[#4D5E70]">{k}</span>
          <span className="text-right text-[14px] leading-5 text-[#172B3A]">{v}</span>
        </div>
      ))}
    </div>
  );
}

/** A note in 12 / 16 grey under a list. */
export const Note = ({ children }: { children: React.ReactNode }) => <p className="pt-3 text-[12px] leading-4 text-[#4D5E70]">{children}</p>;

/** Textarea in the field style. */
export function Area({ label, value, onChange, hint, placeholder }: { label: string; value: string; onChange: (v: string) => void; hint?: string; placeholder?: string }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[13px] leading-4 text-[#172B3A]">{label}</span>
      <textarea
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="resize-none rounded-[12px] border border-[#D5DCE3] bg-white px-4 py-3 text-[14px] leading-5 text-[#172B3A] placeholder:text-[#68788A] focus:border-[#E22765] focus:outline-none"
      />
      {hint && <span className="text-[12px] leading-4 text-[#68788A]">{hint}</span>}
    </label>
  );
}

/** Select in the field style. */
export function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[13px] leading-4 text-[#172B3A]">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="h-12 rounded-[12px] border border-[#D5DCE3] bg-white px-4 text-[14px] leading-5 text-[#172B3A] focus:border-[#E22765] focus:outline-none">
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}
