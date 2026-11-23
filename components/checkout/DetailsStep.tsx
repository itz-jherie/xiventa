"use client";

import Link from "next/link";
import { useState } from "react";
import type { XiventaEvent } from "@/data";
import { holdLeft, money, ticketsLabel } from "@/lib/checkout";
import { passWhen } from "@/lib/orders";
import { AlertIcon, InfoIcon } from "@/components/icons";
import { Field, MethodList, OrderSummary, Steps, Toggle, TransferSheet, UssdSheet, useNow } from "@/components/checkout/CheckoutParts";
import { AppBottomBar, AppTop, WebShell } from "@/components/checkout/CheckoutShell";
import { useCheckout } from "@/components/checkout/useCheckout";

const ORDINAL = ["Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eighth"];

/**
 * Your details. Phone: AM29 (272:8523, Connect Lagos 619:47006). Web: PW11 Checkout (314:20117,
 * Signed in 1086:70121, Online 1087:70988): details, Pay with and the 18+ switch on one page, order
 * summary with the hold timer on the right. Free events skip payment.
 */
export function DetailsStep({ event }: { event: XiventaEvent }) {
  const { cart, t, update, base, confirmFree, session, router } = useCheckout(event);
  const now = useNow();
  const [sheet, setSheet] = useState<null | "transfer" | "ussd">(null);
  const [tried, setTried] = useState(false);
  if (!cart || !t) return null;
  const signedIn = session?.status === "signed-in";
  const free = t.total === 0;
  const left = holdLeft(cart, now);
  const extra = Math.max(0, t.count - 1);
  const emailOk = /\S+@\S+\.\S+/.test(cart.email);
  const ready = cart.name.trim().length > 1 && emailOk && (!event.ageRestriction || cart.adult);

  if (left === null && !free) {
    router.replace(`${base}/pay?status=timeout`);
    return null;
  }

  const guest = (i: number) => (
    <Field
      key={i}
      label={`${ORDINAL[i]} guest name (optional)`}
      value={cart.guests[i] ?? ""}
      onChange={(v) => {
        const g = [...cart.guests];
        g[i] = v;
        update({ guests: g });
      }}
      placeholder="Add a name for the door"
      hint={i === extra - 1 ? "You can add or change this later in My events." : undefined}
    />
  );

  const pay = () => {
    setTried(true);
    if (!ready) return;
    if (free) return confirmFree();
    if (cart.method === "transfer") return setSheet("transfer");
    if (cart.method === "ussd") return setSheet("ussd");
    router.push(`${base}/pay?status=pending`);
  };

  return (
    <>
      {/* ================= App (AM29) ================= */}
      <div className="min-h-screen bg-white pb-[110px] pt-[env(safe-area-inset-top)] md:hidden">
        <AppTop title="Your details" subtitle={ticketsLabel(t).replace(/^./, (c) => c.toUpperCase())} />
        <div className="flex flex-col gap-4 px-4 pt-2">
          <Field label="Full name" value={cart.name} onChange={(v) => update({ name: v })} hint={signedIn ? "From your account. Change it here for this order only." : "Shows on your tickets."} error={tried && cart.name.trim().length < 2 ? "Add your full name" : undefined} />
          <Field label="Phone number" value={cart.phone} inputMode="tel" onChange={(v) => update({ phone: v })} hint="For your ticket and event updates." />
          <Field label="Email" type="email" inputMode="email" value={cart.email} onChange={(v) => update({ email: v })} hint="We'll send your tickets here too." error={tried && !emailOk ? "Check your email address" : undefined} />
          {extra > 0 && (
            <>
              <p className="pt-1 text-[13px] leading-4 text-[#172B3A]">{extra === 1 ? "Second ticket" : "Other tickets"}</p>
              {Array.from({ length: extra }, (_, i) => guest(i))}
            </>
          )}
        </div>
        <AppBottomBar
          price={money(t.total - t.fee)}
          action={free ? `Get ${t.count} free ${t.count === 1 ? "ticket" : "tickets"}` : "Continue"}
          onAction={() => {
            setTried(true);
            if (cart.name.trim().length < 2 || !emailOk) return;
            if (free) confirmFree();
            else router.push(`${base}/review`);
          }}
        />
      </div>

      {/* ================= Web (PW11) ================= */}
      <WebShell>
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
          <div className="flex min-w-0 flex-1 flex-col gap-8 lg:max-w-[768px]">
            <Steps current={free ? 2 : 3} free={free} />
            <h1 className="text-[28px] font-bold leading-[34px] tracking-[-0.02em] text-[#172B3A]">{free ? "Your details" : "Checkout"}</h1>
            {!signedIn && (
              <div className="flex items-center gap-3 rounded-2xl bg-[#E6F1FF] px-4 py-3">
                <InfoIcon size={20} className="shrink-0 text-[#0059BE]" />
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <p className="text-[13px] leading-4 text-[#172B3A]">Have an account?</p>
                  <p className="text-[12px] leading-4 text-[#4D5E70]">Sign in to save these tickets to your account and phone.</p>
                </div>
                <Link href="/welcome" className="shrink-0 rounded-[8px] px-3 py-2 text-[13px] text-[#C81E57] hover:bg-white/60">
                  Sign in
                </Link>
              </div>
            )}
            <section className="flex flex-col gap-4 rounded-2xl border border-[#E9EDF1] bg-white p-6">
              <h2 className="text-[20px] font-bold leading-[26px] tracking-[-0.02em] text-[#172B3A]">Your details</h2>
              <Field label="Full name" value={cart.name} onChange={(v) => update({ name: v })} hint={signedIn ? "From your account. Change it here for this order only." : "Shows on your tickets."} error={tried && cart.name.trim().length < 2 ? "Add your full name" : undefined} />
              <Field label="Email" type="email" value={cart.email} onChange={(v) => update({ email: v })} hint="We send your tickets here." error={tried && !emailOk ? "Check your email address" : undefined} />
              <Field label="Phone number" inputMode="tel" value={cart.phone} onChange={(v) => update({ phone: v })} hint="For event day updates only." />
              {Array.from({ length: extra }, (_, i) => guest(i))}
            </section>
            {!free && (
              <section className="flex flex-col gap-2 rounded-2xl border border-[#E9EDF1] bg-white p-6">
                <h2 className="pb-2 text-[20px] font-bold leading-[26px] tracking-[-0.02em] text-[#172B3A]">Pay with</h2>
                <MethodList value={cart.method} onChange={(m) => update({ method: m })} />
              </section>
            )}
            {event.ageRestriction && (
              <div className="flex items-center gap-4">
                <div className="flex flex-1 flex-col gap-0.5">
                  <span className="text-[16px] leading-6 tracking-[-0.01em] text-[#172B3A]">I am 18 or older</span>
                  <span className={`text-[12px] leading-4 ${tried && !cart.adult ? "text-[#C0231A]" : "text-[#68788A]"}`}>
                    {tried && !cart.adult ? "Confirm your age to continue. The door checks ID." : "This event checks ID at the door"}
                  </span>
                </div>
                <Toggle on={cart.adult} onChange={(v) => update({ adult: v })} label="I am 18 or older" />
              </div>
            )}
          </div>
          <aside className="flex w-full flex-col gap-6 lg:sticky lg:top-[96px] lg:mt-[48px] lg:w-[384px] lg:shrink-0">
            {!free && (
              <div className="flex items-center gap-3 rounded-2xl bg-[#FFECEB] px-4 py-3">
                <AlertIcon size={20} className="shrink-0 text-[#C0231A]" />
                <div className="flex flex-col gap-0.5">
                  <p className="text-[13px] leading-4 text-[#172B3A]">Tickets held for {left}</p>
                  <p className="text-[12px] leading-4 text-[#4D5E70]">Finish paying before the timer ends or the tickets go back on sale.</p>
                </div>
              </div>
            )}
            <div className="flex flex-col gap-4 rounded-2xl border border-[#E9EDF1] bg-white p-6">
              <OrderSummary event={event} t={t} when={passWhen(event).replace(/ to .*$/, "")} compact />
              <button type="button" onClick={pay} className="flex h-[52px] w-full items-center justify-center rounded-[12px] bg-[#E22765] text-[16px] tracking-[-0.01em] text-white hover:bg-[#C81E57]">
                {free ? `Get ${t.count} free ${t.count === 1 ? "ticket" : "tickets"}` : `Pay ${money(t.total)}`}
              </button>
              {!free && <p className="text-[12px] leading-4 text-[#4D5E70]">Payments are handled by our payment partner. By paying you accept the Terms and the host’s refund policy.</p>}
              <Link href={`${base}/tickets`} className="py-2 text-center text-[14px] text-[#C81E57]">
                Edit tickets
              </Link>
            </div>
          </aside>
        </div>
      </WebShell>

      <TransferSheet open={sheet === "transfer"} onClose={() => setSheet(null)} total={t.total} onSent={() => router.push(`${base}/pay?status=pending`)} />
      <UssdSheet open={sheet === "ussd"} onClose={() => setSheet(null)} total={t.total} onSent={() => router.push(`${base}/pay?status=pending`)} />
    </>
  );
}
