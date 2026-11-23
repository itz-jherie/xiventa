"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import type { MyTicket } from "@/data/mine";
import { totals } from "@/lib/checkout";
import { useSession } from "@/lib/session";
import { orderCode, stamp, useAfterTicket } from "@/lib/afterTicket";
import { OrderSummary } from "@/components/checkout/CheckoutParts";
import { AppTop } from "@/components/checkout/CheckoutShell";
import { ActionRow } from "@/components/mobile/AppParts";
import { AccountShell } from "@/components/web/AccountShell";
import { ValidBadge } from "@/components/shared/TicketPass";
import { useToast } from "@/components/shared/Sheet";
import { ChevronRightIcon, InfoIcon, WalletIcon } from "@/components/icons";
import { HelpSheet, Timeline, caseSteps, refundSteps, type Step } from "@/components/tickets/TicketParts";

/**
 * Order. Phone: AM38 Order detail (292:11768) and Refunded (754:53515). Web: PW18 Order
 * (315:21337) and Case open (1092:73763). The right column shows Refund status or Your case only
 * when there is one. Preview: ?state=refund | refunded | case.
 */
export function OrderDetail({ ticket }: { ticket: MyTicket }) {
  const router = useRouter();
  const params = useSearchParams();
  const session = useSession();
  const after = useAfterTicket(ticket.id);
  // ?help opens Get help straight away (Start a case in Help, AM50).
  const [help, setHelp] = useState(() => params.has("help"));
  const { show: toast, node: toastNode } = useToast();
  const preview = params.get("state");
  const e = ticket.event;
  const code = orderCode(ticket.code);
  const t = totals(e, { qty: ticket.qty ?? {} });
  const free = t.total === 0;
  const refunded = ticket.refunded || preview === "refunded";
  const refund = after.refund ?? (preview === "refund" ? { reason: "I can't make it", note: "", amount: t.subtotal, at: 0 } : undefined);
  const kase = after.case ?? (preview === "case" ? { reason: "Not let in", note: "", at: 0 } : undefined);
  const [day, time] = e.dateLabel.split(", ");
  const back = `/my-events/${ticket.id}`;

  let panel: { title: string; sub: string; steps: Step[]; label: string } | null = null;
  if (kase) panel = { title: "Your case", sub: `${kase.reason} · We reply here and by email.`, steps: caseSteps(kase.at ? stamp(kase.at) : "Sat 25 Oct, 11:40 PM", e.hostName), label: "Your case" };
  else if (refunded) panel = { title: "Refund status", sub: "Your money is back.", steps: refundSteps({ requested: "Approved by the host on Mon 22 Sep", refunded: true }), label: "Refund" };
  else if (refund) panel = { title: "Refund status", sub: `${refund.reason} · ${refund.at ? stamp(refund.at) : "Mon 27 Oct"}`, steps: refundSteps({ requested: refund.at ? stamp(refund.at).split(",")[0] : "Mon 27 Oct" }), label: "Refund" };

  const status = kase ? { label: "Case open", tone: "amber" as const } : refunded ? { label: "Refunded", tone: "grey" as const } : refund ? { label: "Refund requested", tone: "amber" as const } : { label: free ? "Free" : "Paid", tone: "green" as const };
  const summary = (when: string) => <OrderSummary event={e} t={t} when={when} note={free ? "Free event. Nothing to refund." : "Refunds follow the host’s refund policy."} />;

  return (
    <>
      {/* ---------- App (AM38) ---------- */}
      <div className="min-h-screen bg-white pb-10 pt-[env(safe-area-inset-top)] md:hidden">
        <AppTop title="Order" subtitle={code} onBack={() => router.push(back)} />
        <div className="flex flex-col px-4 pt-3">
          {summary(`${day}  ·  ${time ?? ""}  ·  ${e.venueName}`)}
          {panel && (
            <div className="pt-5">
              <Timeline label={panel.label} steps={panel.steps} />
            </div>
          )}
          <div className="flex flex-col pt-1">
            {!free && !refunded && !refund && (
              <ActionRow icon={<WalletIcon size={20} />} title="Request a refund" subtitle="Within the host’s refund policy" href={`${back}/refund${ticket.refundsUntil ? "" : "?step=closed"}`} />
            )}
            {refund && !refunded && <ActionRow icon={<WalletIcon size={20} />} title="Refund requested" subtitle={`${refund.reason} · we'll keep you posted`} href={`${back}/refund?step=sent`} />}
            <ActionRow
              icon={<InfoIcon size={20} />}
              title="Get help with this order"
              subtitle={kase ? `Case open · ${e.hostName} replies within 48 hours` : "Not let in, wrong charge or something else"}
              onClick={() => (kase ? toast("We reply here and by email") : setHelp(true))}
            />
          </div>
        </div>
      </div>

      {/* ---------- Web (PW18) ---------- */}
      <div className="hidden md:block">
        <AccountShell bare>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
            <div className="flex w-full flex-col lg:w-[520px] lg:shrink-0">
              <Link href={back} className="flex h-11 items-center justify-center self-center text-[14px] leading-[18px] text-[#C81E57]">
                Back to ticket
              </Link>
              <h1 className="pt-4 text-[28px] font-bold leading-[34px] tracking-[-0.02em] text-[#172B3A]">Order {code}</h1>
              <span className="w-fit pt-4">
                <ValidBadge {...status} />
              </span>
              <div className="pt-4">{summary(`${day}  ·  ${(time ?? "").replace(/^(\d+) (AM|PM)$/, "$1:00 $2")}`)}</div>
              <button type="button" onClick={() => toast("Receipt downloaded")} className="mt-4 flex h-[52px] w-full flex-none items-center justify-center rounded-[12px] border border-[#B4BFCA] text-[16px] tracking-[-0.01em] text-[#172B3A] hover:border-[#68788A]">
                Download receipt
              </button>
              <button type="button" onClick={() => (kase ? toast("Your case is open. We reply here and by email") : setHelp(true))} className="mt-3 flex h-11 items-center justify-center text-[14px] leading-[18px] text-[#C81E57]">
                Contact support
              </button>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-6">
              {panel && (
                <div className="flex flex-col rounded-2xl border border-[#E9EDF1] p-6">
                  <h2 className="text-[20px] font-bold leading-[26px] tracking-[-0.02em] text-[#172B3A]">{panel.title}</h2>
                  <p className="pb-4 pt-2 text-[12px] leading-4 text-[#4D5E70]">{panel.sub}</p>
                  <Timeline steps={panel.steps} />
                </div>
              )}
              <div className="flex flex-col rounded-2xl border border-[#E9EDF1] px-6 pb-2 pt-6">
                <h2 className="text-[20px] font-bold leading-[26px] tracking-[-0.02em] text-[#172B3A]">Payment</h2>
                <button type="button" onClick={() => toast(free ? "Free order. No payment taken" : "Card ending 4821")} className="flex min-h-[52px] items-center justify-between gap-3 pt-2 text-left">
                  <span className="text-[16px] leading-6 tracking-[-0.01em] text-[#172B3A]">{free ? "Free order" : "Paid with"}</span>
                  <span className="flex items-center gap-2 text-[14px] text-[#4D5E70]">
                    {ticket.paidOn ?? "Mon 20 Oct"}
                    <ChevronRightIcon size={20} />
                  </span>
                </button>
                <div className="flex min-h-[66px] items-center justify-between gap-3">
                  <span className="flex flex-col gap-0.5">
                    <span className="text-[16px] leading-6 tracking-[-0.01em] text-[#172B3A]">Buyer</span>
                    <span className="text-[12px] leading-4 text-[#68788A]">{session?.name || "Ada Okafor"} · ada@example.com</span>
                  </span>
                  <ChevronRightIcon size={20} className="text-[#4D5E70]" />
                </div>
              </div>
            </div>
          </div>
        </AccountShell>
      </div>
      <HelpSheet open={help} onClose={() => setHelp(false)} ticket={ticket} onOpened={() => toast("Case opened. We reply here and by email")} />
      {toastNode}
    </>
  );
}
