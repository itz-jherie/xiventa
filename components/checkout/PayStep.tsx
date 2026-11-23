"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { XiventaEvent } from "@/data";
import { holdLeft, money, writeCart } from "@/lib/checkout";
import { MethodList, TransferSheet, UssdSheet, useNow } from "@/components/checkout/CheckoutParts";
import { AppBottomBar, AppTop, TicketsIllustration, WebShell } from "@/components/checkout/CheckoutShell";
import { useCheckout } from "@/components/checkout/useCheckout";
import { isDesktop } from "@/components/auth/WebAuth";

type Status = "choose" | "pending" | "failed" | "timeout";

/**
 * Payment. Phone: AM31 Payment (275:8618), AM32 Payment pending (275:8675), AM33 Payment failed
 * (275:8736). Web: PW12 Payment / Confirming (1086:69764), Payment failed (314:20347) and Time's up
 * (1086:69869). Payments are simulated: they confirm after a moment, unless the email contains
 * "decline", which shows Payment failed.
 */
export function PayStep({ event }: { event: XiventaEvent }) {
  const params = useSearchParams();
  const status = (params.get("status") as Status) ?? "choose";
  const { cart, t, update, base, settle, router } = useCheckout(event);
  const now = useNow();
  const [sheet, setSheet] = useState<null | "transfer" | "ussd">(null);

  // The web has no separate payment step (PW11 covers it), so desktops go back to checkout.
  useEffect(() => {
    if (status === "choose" && isDesktop()) router.replace(`${base}/checkout`);
  }, [status, base, router]);

  // AM32 / PW12 Confirming: the bank "replies" after 2.5 s.
  // Waits for the cart to load from storage (it is empty on the first render).
  const cartCode = cart?.code;
  useEffect(() => {
    if (status !== "pending" || !cartCode) return;
    const id = setTimeout(settle, 2500);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, cartCode]);

  if (!cart || !t) return null;
  const left = holdLeft(cart, now);
  const timedOut = status === "timeout" || (left === null && status !== "pending");
  const heldUntil = (() => {
    if (!cart.heldUntil) return "";
    const d = new Date(cart.heldUntil);
    const h = d.getHours();
    return `${h % 12 || 12}:${String(d.getMinutes()).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
  })();
  const pay = () => {
    if (cart.method === "transfer") return setSheet("transfer");
    if (cart.method === "ussd") return setSheet("ussd");
    router.replace(`${base}/pay?status=pending`);
  };
  const restart = () => {
    writeCart({ ...cart, heldUntil: undefined });
    router.push(`${base}/tickets`);
  };

  const art = (
    <div className="flex h-[120px] w-[144px] items-center justify-center rounded-[24px] bg-[#FDEEF3]">
      <TicketsIllustration />
    </div>
  );
  const appState =
    timedOut
      ? { title: "Your hold ran out", body: "We kept your tickets for 10 minutes. They went back on sale, but you can pick them again if some are left.", action: "Choose tickets again", onAction: restart }
      : status === "pending"
        ? { title: "Confirming your payment", body: "This can take a minute. Keep this screen open and we will update it as soon as your bank replies.", action: "Check status", onAction: settle }
        : status === "failed"
          ? { title: "Payment didn't go through", body: `You weren't charged. Your tickets are still held for ${left}, so you can try again.`, action: "Change payment method", onAction: () => router.replace(`${base}/pay`) }
          : null;

  const pill = (text: string, tone: "grey" | "red" | "amber") => (
    <span
      className={`inline-flex h-6 w-fit items-center gap-1.5 rounded-full px-2 text-[12px] leading-4 ${
        tone === "red" ? "bg-[#FFECEB] text-[#C0231A]" : tone === "amber" ? "bg-[#FFF6DD] text-[#8F5200]" : "bg-[#E6F1FF] text-[#0059BE]"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${tone === "red" ? "bg-[#FA443A]" : tone === "amber" ? "bg-[#F5A300]" : "bg-[#0278FB]"}`} />
      {text}
    </span>
  );
  const webPrimary = "flex h-[52px] w-full items-center justify-center rounded-[12px] bg-[#E22765] text-[16px] tracking-[-0.01em] text-white hover:bg-[#C81E57]";
  const webOutline = "flex h-[52px] w-full items-center justify-center rounded-[12px] border border-[#B4BFCA] bg-white text-[16px] tracking-[-0.01em] text-[#172B3A]";

  return (
    <>
      {/* ================= App (AM31 / AM32 / AM33) ================= */}
      <div className="min-h-screen bg-white pb-[110px] pt-[env(safe-area-inset-top)] md:hidden">
        {appState ? (
          <>
            <AppTop title="Payment" back={status !== "pending"} onBack={() => router.replace(`${base}/pay`)} />
            <div className="flex flex-col items-center gap-3 px-6 pt-[104px] text-center">
              {art}
              <h2 className="pt-1 text-[20px] font-bold leading-[26px] tracking-[-0.02em] text-[#172B3A]">{appState.title}</h2>
              <p className="text-[14px] leading-5 text-[#4D5E70]">{appState.body}</p>
              <button type="button" onClick={appState.onAction} className="flex h-11 items-center rounded-[12px] border border-[#B4BFCA] bg-white px-4 text-[14px] text-[#172B3A]">
                {appState.action}
              </button>
            </div>
            {status === "failed" && !timedOut && <AppBottomBar action="Try again" onAction={() => router.replace(`${base}/pay?status=pending`)} />}
          </>
        ) : (
          <>
            <AppTop title="Payment" subtitle={`${event.title} · ${money(t.total)}`} />
            <div className="flex flex-col gap-4 px-4 pt-2">
              <MethodList value={cart.method} onChange={(m) => update({ method: m })} />
              <p className="text-[12px] leading-4 text-[#4D5E70]">Payments are handled by our payment partner. Xiventa never sees your card details.</p>
            </div>
            <AppBottomBar price={money(t.total)} action={`Pay ${money(t.total)}`} onAction={pay} />
          </>
        )}
      </div>

      {/* ================= Web (PW12) ================= */}
      <WebShell>
        <div className="flex justify-center">
          <div className="flex w-full max-w-[520px] flex-col gap-5 rounded-2xl border border-[#E9EDF1] bg-white p-8">
            {timedOut ? (
              <>
                {pill("Hold ended", "amber")}
                <h1 className="text-[24px] font-bold leading-[30px] tracking-[-0.02em] text-[#172B3A]">Your hold ran out</h1>
                <p className="text-[14px] leading-5 text-[#4D5E70]">We kept your tickets for 10 minutes. They went back on sale, but you can pick them again if some are left.</p>
                <button type="button" onClick={restart} className={webPrimary}>
                  Choose tickets again
                </button>
              </>
            ) : status === "failed" ? (
              <>
                {pill("Payment failed", "red")}
                <h1 className="text-[24px] font-bold leading-[30px] tracking-[-0.02em] text-[#172B3A]">Your bank declined the payment</h1>
                <p className="text-[14px] leading-5 text-[#4D5E70]">No money was taken. Your tickets are still held until {heldUntil}, so you can try again or use another method.</p>
                <button type="button" onClick={() => router.replace(`${base}/pay?status=pending`)} className={webPrimary}>
                  Try again
                </button>
                <Link href={`${base}/checkout`} className={webOutline}>
                  Use another method
                </Link>
                <p className="text-[12px] leading-4 text-[#4D5E70]">Still stuck? Contact support with the code {cart.code}.</p>
              </>
            ) : (
              <>
                {pill("Processing", "grey")}
                <h1 className="text-[24px] font-bold leading-[30px] tracking-[-0.02em] text-[#172B3A]">Confirming your payment</h1>
                <p className="text-[14px] leading-5 text-[#4D5E70]">This can take a minute. Keep this page open and we update it as soon as your bank replies.</p>
                <button type="button" onClick={settle} className={webPrimary}>
                  Check status
                </button>
                <button type="button" onClick={() => router.replace(`${base}/pay?status=failed`)} className="text-[14px] text-[#C81E57]">
                  My bank declined it
                </button>
              </>
            )}
          </div>
        </div>
      </WebShell>

      <TransferSheet open={sheet === "transfer"} onClose={() => setSheet(null)} total={t.total} onSent={() => router.replace(`${base}/pay?status=pending`)} />
      <UssdSheet open={sheet === "ussd"} onClose={() => setSheet(null)} total={t.total} onSent={() => router.replace(`${base}/pay?status=pending`)} />
    </>
  );
}
