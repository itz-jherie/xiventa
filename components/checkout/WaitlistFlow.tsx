"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { XiventaEvent } from "@/data";
import { CHECKOUT_SETTINGS, money, newCart, tiersFor, writeCart } from "@/lib/checkout";
import { useSession } from "@/lib/session";
import { ChevronRightIcon, InfoIcon } from "@/components/icons";
import { ListEventCard } from "@/components/mobile/AppEventCards";
import { Stepper, Toggle, useNow } from "@/components/checkout/CheckoutParts";
import { AppBottomBar, AppTop } from "@/components/checkout/CheckoutShell";
import { StatusPill, SummaryRow } from "@/components/checkout/RequestFlow";
import { isDesktop } from "@/components/auth/WebAuth";
import { categoryTone } from "@/lib/categoryTone";

type Step = "join" | "joined" | "offer" | "expired";
/** Rule 0: offer hold time is an admin setting (AM63 shows 15 minutes). */
const OFFER_MINUTES = 15;

/**
 * AM63 Waitlist: Join (300:12384), Joined (300:12490), Offer open (300:12586), Offer expired
 * (300:12674). Claim goes straight to Review order with the held tickets. The offer is previewed
 * with ?step=offer (a 15 minute countdown) and ?step=expired.
 */
export function WaitlistFlow({ event }: { event: XiventaEvent }) {
  const router = useRouter();
  const params = useSearchParams();
  const session = useSession();
  const step = (params.get("step") as Step) ?? "join";
  const base = `/events/${event.slug}`;
  const allTiers = tiersFor(event);
  // AM63 lists the main tiers people wait for (Regular, VIP); events with fewer tiers show them all.
  const tiers = allTiers.length > 2 ? allTiers.slice(1, 3) : allTiers;
  const [tier, setTier] = useState(tiers[0]?.id ?? "regular");
  const [qty, setQty] = useState(2);
  const [sms, setSms] = useState(true);
  const now = useNow();
  const [offerEnds] = useState(() => Date.now() + OFFER_MINUTES * 60_000);
  useEffect(() => {
    if (isDesktop()) router.replace(`${base}?state=sold-out`);
  }, [base, router]);
  const picked = tiers.find((t) => t.id === tier) ?? tiers[0];
  const card = <ListEventCard event={event} hostLine categoryTag={categoryTone(event.categoryLabel)} />;
  const ahead = [12, 4];

  if (step === "joined" || step === "expired") {
    const expired = step === "expired";
    return (
      <div className="min-h-screen bg-white pb-[110px] pt-[env(safe-area-inset-top)]">
        <AppTop title={expired ? "Your offer" : "Waitlist"} subtitle={event.title} onBack={() => router.push(base)} />
        <div className="flex flex-col gap-2 px-4 pt-3">
          <StatusPill text={expired ? "Expired" : "Waiting"} tone={expired ? "grey" : "blue"} />
          <h2 className="text-[24px] font-bold leading-[30px] tracking-[-0.02em] text-[#172B3A]">{expired ? "This offer has ended" : "You're on the waitlist"}</h2>
          <p className="text-[14px] leading-5 text-[#4D5E70]">
            {expired
              ? "The time ran out, so the tickets went to the next person. You're still on the waitlist for the next ones."
              : "We'll tell you the moment tickets free up. Keep notifications on so you don't miss the offer."}
          </p>
          <div className="flex flex-col divide-y divide-[#E9EDF1] pt-2">
            <SummaryRow k="Your place" v={expired ? "About 3rd" : "About 12th"} />
            {!expired && <SummaryRow k="Ticket" v={`${picked?.label ?? "Regular"} × ${qty}`} />}
            {!expired && <SummaryRow k="Event" sub={`${event.dateLabel} · ${event.venueName}`} />}
          </div>
          {!expired && (
            <button type="button" onClick={() => router.push(`${base}?state=sold-out`)} className="py-4 text-[14px] text-[#C81E57]">
              Leave waitlist
            </button>
          )}
        </div>
        <AppBottomBar label="From" price={event.displayPrice} action="Back to event" onAction={() => router.push(`${base}?state=sold-out`)} />
      </div>
    );
  }

  if (step === "offer") {
    const ms = Math.max(0, offerEnds - now);
    const left = `${Math.floor(ms / 60000)}:${String(Math.floor((ms % 60000) / 1000)).padStart(2, "0")}`;
    const until = new Date(offerEnds);
    const h = until.getHours();
    const untilLabel = `${h % 12 || 12}:${String(until.getMinutes()).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
    const price = (picked?.price ?? 15000) * qty;
    if (ms === 0) router.replace(`${base}/waitlist?step=expired`);
    return (
      <div className="min-h-screen bg-white pb-[110px] pt-[env(safe-area-inset-top)]">
        <AppTop title="Your offer" subtitle={event.title} onBack={() => router.push(base)} />
        <div className="flex flex-col gap-2 px-4 pt-3">
          <StatusPill text="Offer open" tone="green" />
          <h2 className="text-[24px] font-bold leading-[30px] tracking-[-0.02em] text-[#172B3A]">Tickets are yours to claim</h2>
          <p className="text-[14px] leading-5 text-[#4D5E70]">
            {qty} {picked?.label ?? "Regular"} tickets freed up and you are next. Pay before the timer ends or they go to the next person.
          </p>
          <p className="pt-4 text-[28px] font-bold leading-[34px] tracking-[-0.02em] text-[#C81E57]" aria-live="polite">
            {left}
          </p>
          <p className="text-[12px] leading-4 text-[#4D5E70]">Held for you until {untilLabel} today</p>
          <div className="flex flex-col divide-y divide-[#E9EDF1] pt-3">
            <div className="flex min-h-14 items-center justify-between">
              <span className="text-[16px] tracking-[-0.01em] text-[#172B3A]">Ticket</span>
              <span className="flex items-center gap-2 text-[14px] text-[#4D5E70]">
                × {qty}
                <ChevronRightIcon size={20} />
              </span>
            </div>
            <div className="flex min-h-14 items-center justify-between py-2">
              <span className="flex flex-col gap-0.5">
                <span className="text-[16px] tracking-[-0.01em] text-[#172B3A]">Event</span>
                <span className="text-[12px] text-[#68788A]">
                  {event.dateLabel} · {event.venueName}
                </span>
              </span>
              <ChevronRightIcon size={20} className="text-[#4D5E70]" />
            </div>
          </div>
          <button type="button" onClick={() => router.push(`${base}/waitlist?step=joined`)} className="py-6 text-[14px] text-[#C81E57]">
            Pass it on
          </button>
        </div>
        <AppBottomBar
          price={money(price)}
          action="Claim tickets"
          onAction={() => {
            // Claim goes straight to Review order with the held tickets.
            writeCart(
              newCart(event, {
                qty: { [picked?.id ?? "regular"]: qty },
                name: session?.name ?? "",
                heldUntil: Math.min(offerEnds, Date.now() + CHECKOUT_SETTINGS.holdMinutes * 60_000 * 1.5),
              })
            );
            router.push(`${base}/review`);
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-[110px] pt-[env(safe-area-inset-top)]">
      <AppTop title="Join the waitlist" subtitle={event.title} />
      <div className="flex flex-col gap-3 px-4 pt-2">
        <div className="flex justify-center">{card}</div>
        <span className="pt-2 text-[11px] uppercase leading-4 tracking-[0.04em] text-[#4D5E70]">Which ticket?</span>
        <div role="radiogroup" className="-mt-1 flex flex-col">
          {tiers.map((t, i) => (
            <button key={t.id} type="button" role="radio" aria-checked={tier === t.id} onClick={() => setTier(t.id)} className="flex min-h-16 items-center gap-3 px-1 text-left">
              <span className="flex flex-1 flex-col gap-0.5">
                <span className="text-[13px] text-[#172B3A]">{t.label}</span>
                <span className="text-[13px] text-[#4D5E70]">Sold out · about {ahead[i] ?? 6} people ahead of you</span>
              </span>
              <span className={`h-5 w-5 rounded-full ${tier === t.id ? "border-[6px] border-[#E22765]" : "border-[1.5px] border-[#B4BFCA]"}`} />
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-[14px] font-bold leading-5 text-[#172B3A]">How many tickets</span>
          <Stepper value={qty} max={CHECKOUT_SETTINGS.maxPerTier} onChange={(n) => setQty(Math.max(1, n))} label="ticket" />
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-[#E6F1FF] px-4 py-3">
          <InfoIcon size={20} className="shrink-0 text-[#0059BE]" />
          <div className="flex flex-col gap-0.5">
            <p className="text-[13px] leading-4 text-[#172B3A]">How the waitlist works</p>
            <p className="text-[12px] leading-4 text-[#4D5E70]">If tickets free up, we offer them in order. You get a set time to pay, then the offer passes to the next person.</p>
          </div>
        </div>
        <div className="flex items-center gap-4 py-3">
          <span className="flex flex-1 flex-col gap-0.5">
            <span className="text-[16px] leading-6 tracking-[-0.01em] text-[#172B3A]">Text me too</span>
            <span className="text-[12px] leading-4 text-[#68788A]">We always send a push notification</span>
          </span>
          <Toggle on={sms} onChange={setSms} label="Text me too" />
        </div>
      </div>
      <AppBottomBar action="Join waitlist" onAction={() => router.push(`${base}/waitlist?step=joined`)} />
    </div>
  );
}
