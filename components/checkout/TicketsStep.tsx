"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { XiventaEvent } from "@/data";
import { useSession, setReturnTo } from "@/lib/session";
import { CHECKOUT_SETTINGS, money, newCart, tiersFor, ticketsLabel, totals, useCart, writeCart } from "@/lib/checkout";
import { defaultState } from "@/lib/eventState";
import { InfoIcon } from "@/components/icons";
import { OrderSummary, Steps, TierCard } from "@/components/checkout/CheckoutParts";
import { AppBottomBar, AppTop, EventHeader, WebShell } from "@/components/checkout/CheckoutShell";
import { ChooseDateSheet, DATE_OPTIONS } from "@/components/checkout/ChooseDate";
import { passWhen } from "@/lib/orders";

/** "Sat 25 Oct, 9 PM" -> "Sat 25 Oct · 9 PM" */
const dot = (s: string) => s.replace(", ", " · ");

/**
 * Choose tickets. Phone: AM28 (272:8417, Guest 453:40213, Free 882:57092, Connect Lagos 619:46916).
 * Web: PW10 (314:19896, Free 1087:70427, Connect Lagos 1087:70805, Hybrid 1087:71324, Repeating
 * 1089:71463, Invite only 1089:71656). Continue holds the tickets for 10 minutes (admin setting).
 */
export function TicketsStep({ event }: { event: XiventaEvent }) {
  const router = useRouter();
  const session = useSession();
  const signedIn = session?.status === "signed-in";
  const stored = useCart(event.slug);
  const [local, setLocal] = useState(() => newCart(event));
  const cart = stored ?? local;
  const [dateOpen, setDateOpen] = useState(false);
  const tiers = tiersFor(event);
  const t = totals(event, cart);
  const free = event.isFree;
  const state = defaultState(event);
  const recurring = state === "recurring";
  const invite = state === "invite";
  const online = event.format?.kind === "online";
  const hybrid = event.format?.kind === "hybrid";
  const date = cart.date ?? DATE_OPTIONS[0].label;

  const set = (patch: Partial<typeof cart>) => {
    const next = { ...cart, ...patch };
    if (stored) writeCart(next);
    else setLocal(next);
  };
  const setQty = (id: string, n: number) => set({ qty: { ...cart.qty, [id]: n } });

  const title = free ? "Get free tickets" : invite ? "Your invite" : "Choose tickets";
  const meta = `${dot(event.dateLabel)} · ${online ? `On ${event.format?.label.split(" · ")[1] ?? "Zoom"}` : event.venueName}`;
  const urgency = free
    ? { text: "38 spots left", tone: "green" as const }
    : event.tiers?.[0]?.description.includes("Goes up")
      ? { text: `${tiers.find((x) => !x.soldOut)?.label ?? "Regular"} goes up to ₦20,000 at 1 AM`, tone: "amber" as const }
      : online
        ? { text: "Workshop pass has 30 spots", tone: "amber" as const }
        : undefined;
  const note = free
    ? `Up to ${CHECKOUT_SETTINGS.maxFreePerPerson} per person. Each ticket has its own QR code for the gate.`
    : `Up to ${CHECKOUT_SETTINGS.maxPerTier} tickets each. Your price is locked once your tickets are held.`;
  const action = free ? (t.count ? `Get ${t.count} free ${t.count === 1 ? "ticket" : "tickets"}` : "Get free tickets") : "Continue";

  const go = (web: boolean) => {
    const held = { ...cart, heldUntil: Date.now() + CHECKOUT_SETTINGS.holdMinutes * 60_000, date: recurring ? date : undefined };
    writeCart(held);
    const next = `/events/${event.slug}/checkout`;
    // Rule 1 + 5: app checkout needs an account; web allows guests (email only).
    if (!web && !signedIn) {
      setReturnTo(next);
      router.push("/welcome");
      return;
    }
    router.push(next);
  };

  const webNote = free
    ? { title: "Each ticket has its own QR code for the gate.", body: "We save your tickets to My events and email them to you." }
    : online
      ? { title: "Online ticket", body: "Join opens 15 minutes before the start. Xiventa does not host the session." }
      : hybrid
        ? { title: "In person and online", body: "Each ticket type has its own spots. Online tickets get the Zoom link." }
        : recurring
          ? { title: "Tickets are for one date", body: "Each date sells on its own. Change the date above to buy for another week." }
          : invite
            ? { title: "4 seats left", body: "The exact address is in your ticket. Only people with the invite can buy." }
            : { title: `Sales close ${event.dateLabel.split(",")[0]}, 6 PM`, body: "Tickets are held for you for a short time once you continue." };

  return (
    <>
      {/* ================= App (AM28) ================= */}
      <div className="min-h-screen bg-white pb-[110px] pt-[env(safe-area-inset-top)] md:hidden">
        <AppTop title={title} subtitle={event.title} />
        <EventHeader event={event} meta={meta} pill={urgency?.text} tone={urgency?.tone} />
        {recurring && (
          <button type="button" onClick={() => setDateOpen(true)} className="px-4 pb-1 text-left text-[13px] text-[#4D5E70]">
            {date} · <span className="text-[#C81E57]">Change date</span>
          </button>
        )}
        <p className="px-4 pb-3 pt-3 text-[12px] leading-4 text-[#4D5E70]">{note}</p>
        <div className="flex flex-col gap-3 px-4">
          {tiers.map((tier) => (
            <TierCard key={tier.id} tier={tier} qty={cart.qty[tier.id] ?? 0} onChange={(n) => setQty(tier.id, n)} />
          ))}
        </div>
        <AppBottomBar
          label={t.count ? `${t.count} ${t.count === 1 ? "ticket" : "tickets"}` : undefined}
          price={t.count ? money(t.total - t.fee) : undefined}
          action={action}
          disabled={t.count === 0}
          onAction={() => go(false)}
        />
      </div>

      {/* ================= Web (PW10) ================= */}
      <WebShell>
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
          <div className="flex min-w-0 flex-1 flex-col gap-6 lg:max-w-[768px]">
            <Steps current={1} free={free} />
            <h1 className="pt-2 text-[28px] font-bold leading-[34px] tracking-[-0.02em] text-[#172B3A]">{title}</h1>
            <p className="pb-2 text-[14px] leading-5 text-[#4D5E70]">
              {event.title} · {event.dateLabel}
              {online ? " WAT · Online on Zoom" : hybrid ? ` · ${event.venueName} and Zoom` : ` · ${invite ? event.neighborhood : event.venueName}`}
            </p>
            {recurring && (
              <p className="-mt-3 text-[14px] text-[#172B3A]">
                {date} ·{" "}
                <button type="button" className="text-[#C81E57]" onClick={() => setDateOpen(true)}>
                  Change date
                </button>
              </p>
            )}
            <div className="flex flex-col gap-3">
              {tiers.map((tier) => (
                <TierCard key={tier.id} tier={tier} qty={cart.qty[tier.id] ?? 0} onChange={(n) => setQty(tier.id, n)} />
              ))}
            </div>
            <div className="mt-6 flex items-center gap-3 rounded-2xl bg-[#E6F1FF] px-4 py-3">
              <InfoIcon size={20} className="shrink-0 text-[#0059BE]" />
              <div className="flex flex-col gap-0.5">
                <p className="text-[13px] leading-4 text-[#172B3A]">{webNote.title}</p>
                <p className="text-[12px] leading-4 text-[#4D5E70]">{webNote.body}</p>
              </div>
            </div>
          </div>
          <aside className="flex w-full flex-col gap-4 rounded-2xl border border-[#E9EDF1] bg-white p-6 lg:sticky lg:top-[96px] lg:mt-[48px] lg:w-[384px] lg:shrink-0">
            <OrderSummary event={event} t={t} when={passWhen(event).replace(/ to .*$/, "")} compact />
            <button
              type="button"
              disabled={t.count === 0}
              onClick={() => go(true)}
              className="flex h-[52px] w-full items-center justify-center rounded-[12px] bg-[#E22765] text-[16px] tracking-[-0.01em] text-white hover:bg-[#C81E57] disabled:bg-[#F5A3BF]"
            >
              {action}
            </button>
            {t.count > 0 && <p className="text-center text-[12px] leading-4 text-[#68788A]">{ticketsLabel(t)}</p>}
          </aside>
        </div>
      </WebShell>

      <ChooseDateSheet open={dateOpen} onClose={() => setDateOpen(false)} value={date} onChange={(d) => set({ date: d })} />
    </>
  );
}
