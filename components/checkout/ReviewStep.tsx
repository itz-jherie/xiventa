"use client";

import { useEffect, useState } from "react";
import { isDesktop } from "@/components/auth/WebAuth";
import type { XiventaEvent } from "@/data";
import { holdLeft, money } from "@/lib/checkout";
import { passWhen } from "@/lib/orders";
import { InfoIcon, ShieldCheckIcon } from "@/components/icons";
import { OrderSummary, Toggle, useNow } from "@/components/checkout/CheckoutParts";
import { AppBottomBar, AppTop } from "@/components/checkout/CheckoutShell";
import { useCheckout } from "@/components/checkout/useCheckout";
import { ActionRow } from "@/components/mobile/AppParts";
import { Sheet } from "@/components/shared/Sheet";

/**
 * AM30 Review order (272:8583, Connect Lagos 619:47066): hold notice with a live timer, order
 * summary, the 18+ switch (rule 8, only for age-limited events) and the refund policy. App only;
 * on the web PW11 covers this, so desktops are sent to the checkout page.
 */
export function ReviewStep({ event }: { event: XiventaEvent }) {
  const { cart, t, update, base, router } = useCheckout(event);
  const now = useNow();
  const [policy, setPolicy] = useState(false);
  useEffect(() => {
    if (isDesktop()) router.replace(`${base}/checkout`);
  }, [base, router]);
  if (!cart || !t) return null;
  const left = holdLeft(cart, now);
  if (left === null) {
    router.replace(`${base}/pay?status=timeout`);
    return null;
  }
  const needsAge = Boolean(event.ageRestriction);
  return (
    <>
      <div className="min-h-screen bg-white pb-[110px] pt-[env(safe-area-inset-top)]">
        <AppTop title="Review order" />
        <div className="flex flex-col gap-4 px-4 pt-3">
          <div className="flex items-center gap-3 rounded-2xl bg-[#E6F1FF] px-4 py-3">
            <InfoIcon size={20} className="shrink-0 text-[#0059BE]" />
            <div className="flex flex-col gap-0.5">
              <p className="text-[13px] leading-4 text-[#172B3A]">Your tickets are held for {left}</p>
              <p className="text-[12px] leading-4 text-[#4D5E70]">Finish payment before the timer runs out or they go back on sale.</p>
            </div>
          </div>
          <OrderSummary event={event} t={t} when={passWhen(event).replace(/ to .*$/, "").replace("  ·  ", "  ·  ") + `  ·  ${event.venueName === "Online" ? "Online" : event.venueName}`} />
          <div className="flex flex-col">
            {needsAge && (
              <ActionRow
                icon={<InfoIcon size={20} />}
                title="I'm 18 or older"
                subtitle="This event is 18+. The door checks ID."
                trailing={<Toggle on={cart.adult} onChange={(v) => update({ adult: v })} label="I'm 18 or older" />}
              />
            )}
            <ActionRow icon={<ShieldCheckIcon size={20} />} title="Refund policy" subtitle="Set by the host. See what happens if plans change" onClick={() => setPolicy(true)} />
          </div>
        </div>
        <AppBottomBar price={money(t.total)} action={`Pay ${money(t.total)}`} disabled={needsAge && !cart.adult} onAction={() => router.push(`${base}/pay`)} />
      </div>
      <Sheet open={policy} onClose={() => setPolicy(false)} title="Refund policy">
        <div className="flex flex-col gap-3 pb-2 text-[14px] leading-5 text-[#4D5E70]">
          <p>Set by {event.hostName}. Refunds go back to the card or account you paid with.</p>
          <p>
            <span className="text-[#172B3A]">Cancelled event:</span> full refund, automatically.
          </p>
          <p>
            <span className="text-[#172B3A]">Postponed:</span> your ticket stays valid for the new date, or ask for a refund within 7 days.
          </p>
          <p>
            <span className="text-[#172B3A]">Can&apos;t make it:</span> send your ticket to a friend from My events. Transfers are free.
          </p>
        </div>
      </Sheet>
    </>
  );
}
