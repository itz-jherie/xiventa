"use client";

import { useState } from "react";
import type { XiventaEvent } from "@/data";
import type { MyTicket } from "@/data/mine";
import { CheckIcon, WalletIcon } from "@/components/icons";
import { Sheet, sheetPrimary, sheetSecondary } from "@/components/shared/Sheet";
import { Field } from "@/components/checkout/CheckoutParts";
import { orderCode, updateAfterTicket } from "@/lib/afterTicket";

type Toast = (message: string, action?: string, onAction?: () => void) => void;

/* ---------------------------------------------------------------- building blocks */

/** Radio rows used by AM55 Request a refund, AM53 Add to calendar and PW44 Get help. 12 / 16 copy. */
export function RadioRows({ options, value, onChange }: { options: [string, string?][]; value: string | null; onChange: (v: string) => void }) {
  return (
    <div role="radiogroup" className="flex flex-col">
      {options.map(([label, hint]) => {
        const on = value === label;
        return (
          <button
            key={label}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(label)}
            className={`flex items-center gap-3 px-1 py-3 text-left ${hint ? "min-h-16" : "min-h-12"}`}
          >
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="text-[12px] leading-4 text-[#172B3A]">{label}</span>
              {hint && <span className="text-[12px] leading-4 text-[#4D5E70]">{hint}</span>}
            </span>
            <span className={`h-5 w-5 shrink-0 rounded-full ${on ? "border-[6px] border-[#E22765]" : "border-[1.5px] border-[#B4BFCA]"}`} />
          </button>
        );
      })}
    </div>
  );
}

/** Figma `Input` used as a one line note ("Tell the host more", "What happened?"). */
export function NoteField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <Field label={label} value={value} onChange={onChange} placeholder={placeholder} />;
}

/** Blue info notice (AM52, AM55): #E6F1FF, radius 16, 13 / 12 copy. */
export function InfoNotice({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-[#E6F1FF] px-4 py-3">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="shrink-0">
        <circle cx="10" cy="10" r="7.5" stroke="#0059BE" strokeWidth="1.5" />
        <path d="M10 9V13.5M10 6.5V6.6" stroke="#0059BE" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
      <div className="flex flex-col gap-0.5">
        <p className="text-[13px] leading-4 text-[#172B3A]">{title}</p>
        <p className="text-[12px] leading-4 text-[#4D5E70]">{body}</p>
      </div>
    </div>
  );
}

export type Step = { title: string; sub: string; state: "done" | "current" | "todo" };

/**
 * Status steps (AM38 Refunded "REFUND", PW18 Refund status / Your case): 20 px circles, pink check
 * when done, pink ring when current, grey ring to come, joined by a 2 px line.
 */
export function Timeline({ steps, label }: { steps: Step[]; label?: string }) {
  return (
    <div className="flex flex-col">
      {label && <span className="pb-2 text-[10px] uppercase leading-3 tracking-[0.04em] text-[#68788A]">{label}</span>}
      {steps.map((s, i) => (
        <div key={s.title} className="flex gap-3">
          <div className="flex w-5 shrink-0 flex-col items-center">
            {s.state === "done" ? (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E22765] text-white">
                <CheckIcon size={12} />
              </span>
            ) : s.state === "current" ? (
              <span className="flex h-5 w-5 items-center justify-center rounded-full border-[1.5px] border-[#E22765]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#E22765]" />
              </span>
            ) : (
              <span className="h-5 w-5 rounded-full border-[1.5px] border-[#D5DCE3]" />
            )}
            {i < steps.length - 1 && <span className={`min-h-6 w-0.5 flex-1 ${s.state === "done" ? "bg-[#E22765]" : "bg-[#D5DCE3]"}`} />}
          </div>
          <div className="flex flex-col gap-0.5 pb-5">
            <span className={`text-[12px] leading-4 ${s.state === "todo" ? "text-[#68788A]" : "text-[#172B3A]"}`}>{s.title}</span>
            <span className="text-[12px] leading-4 text-[#4D5E70]">{s.sub}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function refundSteps(opts: { requested: string; refunded?: boolean; card?: string }): Step[] {
  const card = opts.card ?? "4821";
  return opts.refunded
    ? [
        { title: "Requested", sub: opts.requested, state: "done" },
        { title: "Processing", sub: "Our payment partner is sending it back", state: "done" },
        { title: "Refunded", sub: `To your card ending ${card}. Your bank decides how long it takes to show.`, state: "done" },
      ]
    : [
        { title: "Requested", sub: opts.requested, state: "done" },
        { title: "Processing", sub: "Our payment partner is sending it back", state: "current" },
        { title: "Refunded", sub: `To your card ending ${card}. Your bank decides how long it takes.`, state: "todo" },
      ];
}

export function caseSteps(opened: string, host: string): Step[] {
  return [
    { title: "Case opened", sub: opened, state: "done" },
    { title: `${host} replies`, sub: "They have 48 hours to reply", state: "current" },
    { title: "Xiventa reviews", sub: "Only if it is not sorted by then", state: "todo" },
  ];
}

const STAR = "M12 2.8l2.85 5.78 6.38.93-4.62 4.5 1.09 6.35L12 17.36l-5.7 3 1.09-6.35-4.62-4.5 6.38-.93L12 2.8z";

/** One star: filled pink, or a 1.5 px pink outline. */
function StarGlyph({ filled, size }: { filled: boolean; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d={STAR} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" />
    </svg>
  );
}

/** Five 32 px stars (AM60 / PW42). Read only when `onChange` is missing. */
export function Stars({ value, onChange, size = 32 }: { value: number; onChange?: (n: number) => void; size?: number }) {
  return (
    <div className="flex items-center gap-3" role={onChange ? "radiogroup" : "img"} aria-label={`${value} of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => {
        return onChange ? (
          <button key={n} type="button" role="radio" aria-checked={value === n} aria-label={`${n} star${n > 1 ? "s" : ""}`} onClick={() => onChange(n)} className="text-[#E22765]">
            <StarGlyph filled={n <= value} size={size} />
          </button>
        ) : (
          <span key={n} className="text-[#E22765]">
            <StarGlyph filled={n <= value} size={size} />
          </span>
        );
      })}
    </div>
  );
}

/** Key / value rows (AM73 Good to know, AM68 Refund policy, AM52 Pending). */
export function KeyRows({ rows }: { rows: [string, string][] }) {
  return (
    <div className="flex flex-col divide-y divide-[#E9EDF1]">
      {rows.map(([k, v]) => (
        <div key={k} className="flex min-h-[52px] items-center justify-between gap-4 py-3">
          <span className="text-[16px] leading-6 tracking-[-0.01em] text-[#172B3A]">{k}</span>
          <span className="text-right text-[14px] leading-5 text-[#4D5E70]">{v}</span>
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- overlays */

/** AM53 Add to calendar. */
export function CalendarSheet({ open, onClose, toast }: { open: boolean; onClose: () => void; toast: Toast }) {
  const [pick, setPick] = useState<string | null>("Phone calendar");
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Add to calendar"
      footer={
        <>
          <button type="button" onClick={onClose} className={`${sheetSecondary} w-[136px]`}>
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              toast(pick === "Google Calendar" ? "Opening Google Calendar" : "Added to your calendar");
            }}
            className={sheetPrimary}
          >
            Add
          </button>
        </>
      }
    >
      <RadioRows
        options={[
          ["Phone calendar", "Saves name, time, address and a link back"],
          ["Google Calendar", "Opens Google Calendar"],
        ]}
        value={pick}
        onChange={setPick}
      />
    </Sheet>
  );
}

/** AM54 Add to wallet. */
export function WalletSheet({ open, onClose, toast }: { open: boolean; onClose: () => void; toast: Toast }) {
  const row = (title: string, sub?: string) => (
    <button
      type="button"
      onClick={() => {
        onClose();
        toast(`Opening ${title.replace("Add to ", "")}`);
      }}
      className="flex min-h-[66px] items-center gap-3 py-3 text-left"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F4F6F8] text-[#172B3A]">
        <WalletIcon size={20} />
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="text-[16px] leading-6 tracking-[-0.01em] text-[#172B3A]">{title}</span>
        {sub && <span className="text-[12px] leading-4 text-[#68788A]">{sub}</span>}
      </span>
    </button>
  );
  return (
    <Sheet open={open} onClose={onClose} title="Add to wallet">
      <div className="flex flex-col">
        {row("Add to Apple Wallet", "Shows on your lock screen near the venue")}
        {row("Add to Google Wallet")}
        <p className="pt-3 text-[12px] leading-4 text-[#4D5E70]">Your ticket also works offline in Xiventa, with or without the wallet.</p>
      </div>
    </Sheet>
  );
}

/** AM73 Good to know. */
export function GoodToKnowSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Sheet open={open} onClose={onClose} title="Good to know">
      <KeyRows
        rows={[
          ["Dress code", "All black"],
          ["Parking", "Free, on site"],
          ["Accessibility", "Step free entry"],
          ["Security", "Bag checks at the door"],
          ["What to bring", "Valid ID"],
        ]}
      />
    </Sheet>
  );
}

/** AM68 (phone rows) / PW39 (web, label over bold value) Refund policy. */
export function RefundPolicySheet({ open, onClose, event, until = "Thu 23 Oct, 9 PM" }: { open: boolean; onClose: () => void; event: XiventaEvent; until?: string }) {
  const rows: [string, string, string][] = [
    ["Refunds open until", until || "Closed", until || "Closed"],
    ["If the host cancels", "Full refund", "Full refund"],
    ["If the date or venue changes", "Your choice", "Your choice: keep your ticket or get a refund"],
  ];
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Refund policy"
      footer={
        <button type="button" onClick={onClose} className={`${sheetPrimary} hidden md:ml-auto md:flex md:h-10 md:flex-none md:px-4 md:text-[14px]`}>
          Close
        </button>
      }
    >
      <p className="text-[14px] leading-5 text-[#172B3A] md:text-[#4D5E70]">The host sets this policy for {event.title}. Xiventa makes sure it is followed.</p>
      <div className="pt-4 md:hidden">
        <KeyRows rows={rows.map(([k, v]) => [k, v])} />
        <div className="pt-4">
          <InfoNotice title="About the service fee" body="Whether the service fee comes back depends on Xiventa settings at the time of your refund." />
        </div>
      </div>
      <div className="hidden flex-col gap-3 rounded-2xl bg-[#F4F6F8] p-4 md:mt-5 md:flex">
        {[...rows.map(([k, , w]) => [k, w]), ["About the service fee", "Whether it comes back depends on Xiventa settings at the time of your refund"]].map(([k, v]) => (
          <div key={k} className="flex flex-col gap-1">
            <span className="text-[12px] leading-4 text-[#4D5E70]">{k}</span>
            <span className="text-[15px] font-bold leading-5 text-[#172B3A]">{v}</span>
          </div>
        ))}
      </div>
    </Sheet>
  );
}

const HELP_REASONS: [string, string][] = [
  ["Not let in", "The door turned me away"],
  ["Event cancelled or changed", "Date, venue or line up changed"],
  ["Charged wrongly", "Wrong amount or charged twice"],
  ["Something else", "Refund not received or another problem"],
];

/** PW44 Get help with this order (also the phone's bottom sheet). Opening a case shows on the order. */
export function HelpSheet({ open, onClose, ticket, onOpened }: { open: boolean; onClose: () => void; ticket: MyTicket; onOpened: () => void }) {
  const [reason, setReason] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const e = ticket.event;
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Get help with this order"
      footer={
        <>
          <button type="button" onClick={onClose} className={`${sheetSecondary} w-[92px]`}>
            Cancel
          </button>
          <button
            type="button"
            disabled={!reason}
            onClick={() => {
              updateAfterTicket(ticket.id, { case: { reason: reason!, note, at: Date.now() } });
              onClose();
              onOpened();
            }}
            className={sheetPrimary}
          >
            Open a case
          </button>
        </>
      }
    >
      <p className="text-[14px] leading-5 text-[#4D5E70]">
        {ticket.code ? `Order ${orderCode(ticket.code)} · ` : ""}
        {e.title}. Tell us what happened.
      </p>
      <div className="pt-3">
        <RadioRows options={HELP_REASONS} value={reason} onChange={setReason} />
      </div>
      <div className="pt-3">
        <NoteField label="What happened?" value={note} onChange={setNote} placeholder="I had my QR but the scanner said used." />
      </div>
      <p className="pt-4 text-[14px] leading-5 text-[#4D5E70]">{e.hostName} replies first. If it is not sorted in 48 hours, Xiventa reviews it.</p>
    </Sheet>
  );
}

/** PW43 Send a ticket (web dialog). Phones use the AM52 page. */
export function SendTicketSheet({ open, onClose, ticket, onSent }: { open: boolean; onClose: () => void; ticket: MyTicket; onSent: () => void }) {
  const [name, setName] = useState("");
  const [to, setTo] = useState("");
  const ok = to.replace(/\s/g, "").length >= 6;
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Send a ticket"
      footer={
        <>
          <button type="button" onClick={onClose} className={`${sheetSecondary} w-[92px]`}>
            Cancel
          </button>
          <button
            type="button"
            disabled={!ok}
            onClick={() => {
              updateAfterTicket(ticket.id, { transfer: { to, name: name.trim() || undefined, qty: 1, sentAt: Date.now() } });
              onClose();
              onSent();
            }}
            className={sheetPrimary}
          >
            Send ticket
          </button>
        </>
      }
    >
      <p className="text-[14px] leading-5 text-[#4D5E70]">
        Ticket {ticket.count} of {ticket.count} · {ticket.tier} · {ticket.event.title}
      </p>
      <div className="flex flex-col gap-4 pt-4">
        <Field label="Their name" value={name} onChange={setName} placeholder="Tunde Okafor" />
        <Field label="Their phone number or email" value={to} onChange={setTo} placeholder="0809 555 0123" inputMode="tel" />
      </div>
      <p className="pt-4 text-[14px] leading-5 text-[#4D5E70]">Transfers are free. You keep the ticket until they accept, and you can cancel before then.</p>
    </Sheet>
  );
}

/** PW42 How was it / Thanks for rating (web dialog). Phones use the AM60 page. */
export function RateSheet({ open, onClose, ticket }: { open: boolean; onClose: () => void; ticket: MyTicket }) {
  const [stars, setStars] = useState(4);
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);
  const e = ticket.event;
  const close = () => {
    onClose();
    setTimeout(() => setSent(false), 300);
  };
  return (
    <Sheet
      open={open}
      onClose={close}
      title={sent ? "Thanks for rating" : "How was it?"}
      footer={
        sent ? (
          <button type="button" onClick={close} className={`${sheetPrimary} md:ml-auto md:flex-none md:px-8`}>
            Done
          </button>
        ) : (
          <>
            <button type="button" onClick={close} className={`${sheetSecondary} w-[104px]`}>
              Not now
            </button>
            <button
              type="button"
              disabled={!stars}
              onClick={() => {
                updateAfterTicket(ticket.id, { review: { stars, text } });
                setSent(true);
              }}
              className={sheetPrimary}
            >
              Send rating
            </button>
          </>
        )
      }
    >
      {sent ? (
        <p className="text-[14px] leading-5 text-[#4D5E70]">Your review helps people pick their next night out. {e.hostName} can reply to it.</p>
      ) : (
        <>
          <p className="text-[14px] leading-5 text-[#4D5E70]">
            {e.title} · {e.dateLabel.split(",")[0]} · You checked in
          </p>
          <div className="pt-4">
            <Stars value={stars} onChange={setStars} size={36} />
          </div>
          <div className="pt-4">
            <NoteField label="Tell others about it (optional)" value={text} onChange={setText} placeholder="Great sound and a friendly crowd." />
          </div>
          <p className="pt-4 text-[14px] leading-5 text-[#4D5E70]">Your first name shows with your review. Stars show on the event once it has 5 ratings.</p>
        </>
      )}
    </Sheet>
  );
}

const REVIEWS = [
  { name: "Tolu A.", initials: "TA", date: "Sun 26 Oct", stars: 5, text: "Best rooftop party this year. Great DJs and the terrace view was worth it.", reply: "Thank you Tolu, see you on the 31st!" },
  { name: "Chidi O.", initials: "CO", date: "Sun 26 Oct", stars: 4, text: "Fun night but the queue at the door was long. Come early." },
  { name: "Amaka E.", initials: "AE", date: "Mon 27 Oct", stars: 5, text: "Good music, good crowd, felt safe all night." },
];

/** PW38 Event reviews: average, count and guest reviews with host replies. */
export function ReviewsSheet({ open, onClose, event, toast }: { open: boolean; onClose: () => void; event: XiventaEvent; toast: Toast }) {
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Reviews"
      footer={
        <button type="button" onClick={onClose} className={`${sheetPrimary} hidden md:ml-auto md:flex md:h-10 md:flex-none md:px-4 md:text-[14px]`}>
          Close
        </button>
      }
    >
      <p className="text-[14px] leading-5 text-[#4D5E70]">{event.title} · from guests who checked in</p>
      <div className="flex items-center gap-3 pt-4">
        <span className="text-[24px] font-bold leading-[30px] text-[#172B3A]">4.5</span>
        <span className="flex flex-col gap-0.5">
          <Stars value={4} size={14} />
          <span className="text-[12px] leading-4 text-[#4D5E70]">86 ratings</span>
        </span>
      </div>
      <div className="flex flex-col gap-3 pt-4">
        {REVIEWS.map((r) => (
          <div key={r.name} className="flex flex-col gap-3 rounded-2xl border border-[#E9EDF1] p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F0ECFF] text-[10px] font-bold text-[#5B3FD6]">{r.initials}</span>
              <span className="flex flex-1 flex-col gap-0.5">
                <span className="text-[13px] font-bold leading-4 text-[#172B3A]">{r.name}</span>
                <span className="text-[12px] leading-4 text-[#4D5E70]">{r.date}</span>
              </span>
              <Stars value={r.stars} size={12} />
            </div>
            <p className="text-[14px] leading-5 text-[#172B3A]">{r.text}</p>
            {r.reply && (
              <div className="flex flex-col gap-1 rounded-[12px] bg-[#F4F6F8] px-3 py-2.5">
                <span className="text-[12px] font-bold leading-4 text-[#172B3A]">Reply from {event.hostName}</span>
                <span className="text-[12px] leading-4 text-[#4D5E70]">{r.reply}</span>
              </div>
            )}
            <button type="button" onClick={() => toast("Review reported. Thanks for telling us")} className="w-fit text-[12px] leading-4 text-[#68788A]">
              Report
            </button>
          </div>
        ))}
      </div>
    </Sheet>
  );
}
