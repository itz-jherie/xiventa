"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { MyTicket } from "@/data/mine";
import { money, totals } from "@/lib/checkout";
import { orderCode, updateAfterTicket, useAfterTicket } from "@/lib/afterTicket";
import { Field, Stepper, Toggle } from "@/components/checkout/CheckoutParts";
import { AppBottomBar, AppTop } from "@/components/checkout/CheckoutShell";
import { StatusPill, SummaryRow } from "@/components/checkout/RequestFlow";
import { isDesktop } from "@/components/auth/WebAuth";
import { InfoNotice, NoteField, RadioRows, Stars } from "@/components/tickets/TicketParts";

const page = "min-h-screen bg-white pb-[120px] pt-[env(safe-area-inset-top)]";
const h2 = "text-[24px] font-bold leading-[30px] tracking-[-0.02em] text-[#172B3A]";
const body = "text-[14px] leading-5 text-[#4D5E70]";
const section = "text-[10px] uppercase leading-3 tracking-[0.04em] text-[#4D5E70]";

/** These are phone screens; on desktop the same actions live on the ticket and order pages. */
function useDesktopRedirect(path: string) {
  const router = useRouter();
  useEffect(() => {
    if (isDesktop()) router.replace(path);
  }, [path, router]);
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const clock = (mins: number) => {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return `${h % 12 || 12}${m ? `:${String(m).padStart(2, "0")}` : ""} ${h < 12 ? "AM" : "PM"}`;
};

/**
 * Reminder times worked out from the event's own label ("Sat 25 Oct, 9 PM"), so the weekday always
 * matches what the event page shows.
 */
function reminderTimes(label: string) {
  const m = label.match(/^(\w{3}) (\d+) (\w+), (\d+)(?::(\d+))? (AM|PM)/);
  if (!m) return { dayBefore: "The evening before", threeBefore: "3 hours before", doors: "30 minutes before" };
  const [, wd, d, mon, hh, mm, ap] = m;
  const start = ((+hh % 12) + (ap === "PM" ? 12 : 0)) * 60 + (mm ? +mm : 0);
  const day = `${wd} ${d} ${mon}`;
  const prevDay = +d > 1 ? `${DAYS[(DAYS.indexOf(wd) + 6) % 7]} ${+d - 1} ${mon}` : "The day before";
  const at = (mins: number) => (mins < 0 ? `${prevDay}, ${clock(mins + 1440)}` : `${day}, ${clock(mins)}`);
  return { dayBefore: `${prevDay}, 6 PM`, threeBefore: at(start - 180), doors: at(start - 30) };
}

/* ------------------------------------------------------------------ AM39 Reminders */

export function RemindersPage({ ticket }: { ticket: MyTicket }) {
  const router = useRouter();
  const back = `/my-events/${ticket.id}`;
  useDesktopRedirect(back);
  const after = useAfterTicket(ticket.id);
  const times = reminderTimes(ticket.event.dateLabel);
  const rows: [string, string][] = [
    ["The day before", times.dayBefore],
    ["3 hours before", times.threeBefore],
    ["When doors open", times.doors],
    ["Time to leave", "Based on traffic from your area"],
  ];
  // Saved choices load after hydration, so the draft starts empty and falls back to them.
  const [draft, setOn] = useState<string[] | null>(null);
  const on = draft ?? after.reminders ?? ["The day before", "3 hours before"];
  return (
    <div className={page}>
      <AppTop title="Reminders" subtitle={ticket.event.title} onBack={() => router.push(back)} />
      <div className="flex flex-col px-4 pt-3">
        <span className={section}>Remind me</span>
        {rows.map(([title, sub]) => (
          <div key={title} className="flex min-h-[66px] items-center gap-4 py-2">
            <span className="flex flex-1 flex-col gap-0.5">
              <span className="text-[16px] leading-6 tracking-[-0.01em] text-[#172B3A]">{title}</span>
              <span className="text-[12px] leading-4 text-[#68788A]">{sub}</span>
            </span>
            <Toggle on={on.includes(title)} onChange={(v) => setOn(v ? [...on, title] : on.filter((x) => x !== title))} label={title} />
          </div>
        ))}
        <p className="pt-4 text-[12px] leading-4 text-[#4D5E70]">Changes to the date, time or venue always reach you, even with reminders off.</p>
      </div>
      <AppBottomBar
        action="Save"
        onAction={() => {
          updateAfterTicket(ticket.id, { reminders: rows.map(([t]) => t).filter((t) => on.includes(t)) });
          router.push(back);
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ AM52 Send ticket */

export function SendPage({ ticket }: { ticket: MyTicket }) {
  const router = useRouter();
  const params = useSearchParams();
  const back = `/my-events/${ticket.id}`;
  useDesktopRedirect(back);
  const after = useAfterTicket(ticket.id);
  const [qty, setQty] = useState(1);
  const [to, setTo] = useState("");
  const transfer = after.transfer;
  const pending = params.get("step") === "pending";
  const seats = ticket.table?.seats;
  const total = seats ?? ticket.count;
  const noun = seats ? "seat" : "ticket";

  if (pending) {
    const sent = transfer?.qty ?? 1;
    const label = ticket.tier.split(" · ")[0];
    return (
      <div className={page}>
        <AppTop title="Send to a friend" subtitle={ticket.event.title} onBack={() => router.push(back)} />
        <div className="flex flex-col gap-2 px-4 pt-3">
          <StatusPill text="Pending" tone="amber" />
          <h2 className={h2}>Waiting for them to accept</h2>
          <p className={body}>We sent a claim link to {transfer?.to ?? "0803 000 0001"}. You keep the ticket until they accept.</p>
          <div className="flex flex-col divide-y divide-[#E9EDF1] pt-3">
            <SummaryRow k="Sent" v={`${sent} ${label}`} />
            <SummaryRow k="Still yours" v={`${Math.max(total - sent, 0)} ${label}`} />
          </div>
          <button
            type="button"
            onClick={() => {
              updateAfterTicket(ticket.id, { transfer: undefined });
              router.push(back);
            }}
            className="mt-4 flex h-[52px] items-center justify-center rounded-[12px] border border-[#B4BFCA] text-[16px] tracking-[-0.01em] text-[#172B3A]"
          >
            Cancel transfer
          </button>
        </div>
        <AppBottomBar action={`Back to ${noun}`} onAction={() => router.push(back)} />
      </div>
    );
  }

  const ok = to.replace(/\s/g, "").length >= 6;
  return (
    <div className={page}>
      <AppTop title={seats ? "Send seats" : "Send to a friend"} subtitle={ticket.event.title} onBack={() => router.push(back)} />
      <div className="flex flex-col px-4 pt-3">
        <span className={section}>Your {noun}s</span>
        <div className="flex min-h-14 items-center justify-between">
          <span className="text-[16px] leading-6 tracking-[-0.01em] text-[#172B3A]">{ticket.tier.split(" · ")[0]}</span>
          <span className="text-[14px] text-[#4D5E70]">
            {total} {noun}
            {total > 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex min-h-14 items-center justify-between">
          <span className="text-[14px] font-bold leading-5 text-[#172B3A]">How many to send</span>
          <Stepper value={qty} max={seats ? seats - 1 : total} onChange={(n) => setQty(Math.max(1, n))} label={noun} />
        </div>
        <div className="pt-3">
          <Field label="Their phone number or email" value={to} onChange={setTo} placeholder="0803 000 0001" inputMode="tel" hint={`They get a link to claim the ${noun} in Xiventa.`} />
        </div>
        <div className="pt-5">
          <InfoNotice title={`Your ${noun} stops working once they accept`} body="You can cancel any time before then. Transfers are free." />
        </div>
      </div>
      <AppBottomBar
        action={`Send ${noun}${qty > 1 ? "s" : ""}`}
        disabled={!ok}
        onAction={() => {
          updateAfterTicket(ticket.id, { transfer: { to, qty, sentAt: Date.now() } });
          router.push(`${back}/send?step=pending`);
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ AM55 Request a refund */

const REFUND_REASONS: [string, string?][] = [["I can't make it"], ["The event changed", "New date, time or venue"], ["I was charged wrongly", "Double charge or wrong amount"], ["Something else"]];

export function RefundPage({ ticket }: { ticket: MyTicket }) {
  const router = useRouter();
  const params = useSearchParams();
  const back = `/my-events/${ticket.id}`;
  useDesktopRedirect(`${back}/order`);
  const after = useAfterTicket(ticket.id);
  const [reason, setReason] = useState<string | null>("I can't make it");
  const [note, setNote] = useState("");
  const code = orderCode(ticket.code);
  const amount = totals(ticket.event, { qty: ticket.qty ?? {} }).subtotal;
  const step = params.get("step") ?? (!ticket.refundsUntil ? "closed" : after.refund ? "sent" : "form");

  if (step === "closed")
    return (
      <div className={page}>
        <AppTop title="Request a refund" subtitle={`Order ${code}`} onBack={() => router.push(`${back}/order`)} />
        <div className="flex flex-col gap-2 px-4 pt-3">
          <StatusPill text="Not eligible" tone="grey" />
          <h2 className={h2}>Refunds have closed for this event</h2>
          <p className={body}>
            The host&apos;s refund window ended{ticket.refundsUntil ? ` on ${ticket.refundsUntil}` : ""}. You can still send your ticket to a friend.
          </p>
          <button type="button" onClick={() => router.push(`${back}/order`)} className="py-6 text-[16px] tracking-[-0.01em] text-[#C81E57]">
            Something went wrong? Get help
          </button>
        </div>
        <AppBottomBar action="Send to a friend" onAction={() => router.push(`${back}/send`)} />
      </div>
    );

  if (step === "sent") {
    const r = after.refund ?? { reason: "I can't make it", amount, note: "" };
    return (
      <div className={page}>
        <AppTop title="Request a refund" subtitle={`Order ${code}`} onBack={() => router.push(`${back}/order`)} />
        <div className="flex flex-col gap-2 px-4 pt-3">
          <StatusPill text="Requested" tone="amber" />
          <h2 className={h2}>Request sent</h2>
          <p className={body}>The host has time to reply. If they don&apos;t, Xiventa reviews it and decides. We&apos;ll keep you posted.</p>
          <div className="flex flex-col divide-y divide-[#E9EDF1] pt-3">
            <SummaryRow k="Amount asked" v={money(r.amount)} />
            <SummaryRow k="Reason" sub={r.reason} />
          </div>
        </div>
        <AppBottomBar action="View case" onAction={() => router.push(`${back}/order`)} />
      </div>
    );
  }

  return (
    <div className={page}>
      <AppTop title="Request a refund" subtitle={`Order ${code}`} onBack={() => router.push(`${back}/order`)} />
      <div className="flex flex-col px-4 pt-3">
        <span className={section}>Why?</span>
        <RadioRows options={REFUND_REASONS} value={reason} onChange={setReason} />
        <div className="pt-3">
          <NoteField label="Tell the host more (optional)" value={note} onChange={setNote} placeholder="Travelling for work that weekend." />
        </div>
        <div className="pt-5">
          <InfoNotice title="This host's refund policy" body={`Refunds are open until ${ticket.refundsUntil}. The service fee may not come back, as set by Xiventa.`} />
        </div>
      </div>
      <AppBottomBar
        action="Send request"
        disabled={!reason}
        onAction={() => {
          updateAfterTicket(ticket.id, { refund: { reason: reason!, note, amount, at: Date.now() } });
          router.push(`${back}/refund?step=sent`);
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ AM60 How was it */

export function ReviewPage({ ticket }: { ticket: MyTicket }) {
  const router = useRouter();
  const params = useSearchParams();
  const back = `/my-events/${ticket.id}`;
  useDesktopRedirect(back);
  const after = useAfterTicket(ticket.id);
  const [starsDraft, setStars] = useState<number | null>(null);
  const [textDraft, setText] = useState<string | null>(null);
  const stars = starsDraft ?? after.review?.stars ?? 4;
  const text = textDraft ?? after.review?.text ?? "";
  const e = ticket.event;

  if (params.get("step") === "sent")
    return (
      <div className={page}>
        <AppTop title="Rate your night" onBack={() => router.push(back)} />
        <div className="flex flex-col gap-2 px-4 pt-3">
          <StatusPill text="Sent" tone="green" />
          <h2 className={h2}>Thanks for telling them</h2>
          <p className={body}>Your rating helps {e.hostName} plan the next one.</p>
        </div>
        <AppBottomBar action="Back to past events" onAction={() => router.push("/my-events?tab=past")} />
      </div>
    );

  return (
    <div className={page}>
      <AppTop title="Rate your night" onBack={() => router.push(back)} />
      <div className="flex flex-col px-4 pt-5">
        <h2 className={h2}>How was {e.title}?</h2>
        <p className={`${body} pt-2`}>Your rating shows on the event with your first name once it has 5 ratings. {e.hostName} can reply.</p>
        <div className="pt-6">
          <Stars value={stars} onChange={setStars} />
        </div>
        <div className="pt-5">
          <NoteField label="Anything to add? (optional)" value={text} onChange={setText} placeholder="Great sound. The queue at the gate was long." />
        </div>
        <button type="button" onClick={() => router.push("/my-events?tab=past")} className="py-6 text-[16px] tracking-[-0.01em] text-[#C81E57]">
          Not now
        </button>
      </div>
      <AppBottomBar
        action="Send"
        disabled={!stars}
        onAction={() => {
          updateAfterTicket(ticket.id, { review: { stars, text } });
          router.push(`${back}/review?step=sent`);
        }}
      />
    </div>
  );
}
