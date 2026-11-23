"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import type { MyTicket } from "@/data/mine";
import { useSession } from "@/lib/session";
import { orderCode, updateAfterTicket, useAfterTicket } from "@/lib/afterTicket";
import { TicketPass, ValidBadge, ticketBadge } from "@/components/shared/TicketPass";
import { ActionRow, TicketLineIcon } from "@/components/mobile/AppParts";
import { AccountShell, NoticeBanner } from "@/components/web/AccountShell";
import { DirectionsSheet } from "@/components/shared/Overlays";
import { useToast } from "@/components/shared/Sheet";
import { ArrowLeftIcon, BellIcon, CalendarIcon, CloseIcon, InfoIcon, MapPinIcon, NavigationIcon, ShareIcon, StarIcon, VideoIcon, WalletIcon } from "@/components/icons";
import { CalendarSheet, HelpSheet, RateSheet, SendTicketSheet, WalletSheet } from "@/components/tickets/TicketParts";

type Overlay = null | "directions" | "calendar" | "wallet" | "help" | "send" | "rate";

/**
 * Ticket. Phone: AM37 Ticket detail (276:9073) with its Checked in, Table, Online and Free
 * variants. Web: PW17 Ticket (315:21118) with Past, Online and Transfer pending.
 * Preview: ?state=checked-in | transfer.
 */
export function TicketDetail({ ticket: base }: { ticket: MyTicket }) {
  const router = useRouter();
  const params = useSearchParams();
  const session = useSession();
  const after = useAfterTicket(base.id);
  const [overlay, setOverlay] = useState<Overlay>(null);
  const { show: toast, node: toastNode } = useToast();
  const preview = params.get("state");
  const ticket: MyTicket = preview === "checked-in" ? { ...base, status: "checked-in", checkedIn: base.checkedIn ?? "10:42 PM" } : base;
  const transfer = after.transfer ?? (preview === "transfer" ? { to: "0809 555 0123", name: "Tunde Okafor", qty: 1, sentAt: 0 } : undefined);
  const holder = session?.name || "Ada Okafor";
  const e = ticket.event;
  const past = ticket.status === "checked-in" && !!base.checkedIn;
  const refunded = ticket.status === "refunded";
  const free = ticket.paid === "Free";
  const code = ticket.code ? orderCode(ticket.code) : "";
  const base_ = `/my-events/${ticket.id}`;
  const firstName = transfer?.name?.split(" ")[0] ?? transfer?.to ?? "";
  const dateShort = e.dateLabel;
  const close = () => setOverlay(null);
  const sub = ticket.table ? `${e.title} · Seat 1 of ${ticket.table.seats}` : ticket.count > 1 ? `${e.title} · 1 of ${ticket.count}` : e.title;
  const orderSub = `Order ${code} · ${free ? "Free" : refunded ? "Refunded" : "Paid"}`;
  const join = () => toast(`Opening ${ticket.online?.platform ?? "the meeting"}`);
  const cancelTransfer = () => {
    updateAfterTicket(ticket.id, { transfer: undefined });
    if (preview === "transfer") router.replace(base_);
    toast("Transfer cancelled. The ticket is still yours");
  };
  const help = (
    <ActionRow
      icon={<InfoIcon size={20} />}
      title={free ? "Get help" : "Get help with this order"}
      subtitle={after.case ? "Case open · we reply here and by email" : free ? "Not let in or something else" : "Not let in, wrong charge or something else"}
      onClick={() => (after.case ? router.push(`${base_}/order`) : setOverlay("help"))}
    />
  );

  /* ---------------- app rows (AM37) ---------------- */
  const appRows = past || refunded ? (
    <>
      {past && (
        <ActionRow
          icon={<StarIcon size={20} />}
          title={after.review ? `You rated it ${after.review.stars} of 5` : "Rate your night"}
          subtitle={after.review ? "Thanks for telling the host" : `Tell ${e.hostName} how it went`}
          href={after.review ? undefined : `${base_}/review`}
        />
      )}
      <ActionRow icon={<TicketLineIcon />} title="Order details" subtitle={orderSub} href={`${base_}/order${refunded ? "?state=refunded" : ""}`} />
      {help}
    </>
  ) : (
    <>
      {!ticket.online && <ActionRow icon={<NavigationIcon size={20} />} title="Get directions" subtitle={ticket.where} onClick={() => setOverlay("directions")} />}
      <ActionRow icon={<CalendarIcon size={20} />} title="Add to calendar" subtitle={dateShort} onClick={() => setOverlay("calendar")} />
      <ActionRow
        icon={<BellIcon size={20} />}
        title={after.reminders && !after.reminders.length ? "Reminders off" : "Reminders on"}
        subtitle={after.reminders ? (after.reminders.length ? after.reminders.join(", ") : "Changes still reach you") : "1 day and 2 hours before"}
        href={`${base_}/reminders`}
      />
      {transfer ? (
        <ActionRow icon={<ShareIcon size={20} />} title="Transfer pending" subtitle={`Waiting for ${firstName} to accept`} href={`${base_}/send?step=pending`} />
      ) : (
        <ActionRow
          icon={<ShareIcon size={20} />}
          title={ticket.table ? "Send seats to your guests" : "Send to a friend"}
          subtitle={ticket.table ? `${ticket.table.seats - 1} seats left to send. Each guest gets their own QR.` : "Transfer one or more tickets"}
          href={`${base_}/send`}
        />
      )}
      <ActionRow icon={<WalletIcon size={20} />} title="Add to wallet" subtitle="Apple or Google Wallet" onClick={() => setOverlay("wallet")} />
      <ActionRow icon={<TicketLineIcon />} title="Order details" subtitle={orderSub} href={`${base_}/order`} />
      {help}
    </>
  );

  /* ---------------- web rows (PW17) ---------------- */
  const webBadge = transfer ? { label: `Waiting for ${firstName}`, tone: "green" as const } : ticketBadge(ticket);
  const webSub = past
    ? `Checked in ${dateShort.split(",")[0]}, ${ticket.checkedIn}`
    : ticket.online
    ? `${ticket.tier} · Online`
    : `Ticket ${transfer ? ticket.count : 1} of ${ticket.count} · ${ticket.tier}`;
  const webRows = past || refunded ? (
    <>
      <ActionRow icon={<TicketLineIcon />} title="Order details" subtitle={`${code} · ${refunded ? "Refunded" : `Paid ${ticket.paid}`}`} href={`${base_}/order${refunded ? "?state=refunded" : ""}`} />
      {help}
    </>
  ) : (
    <>
      {ticket.online ? (
        <>
          <ActionRow icon={<VideoIcon size={20} />} title={`Join on ${ticket.online.platform}`} subtitle={`Opens at ${ticket.online.opens}`} onClick={join} />
          <ActionRow
            icon={<InfoIcon size={20} />}
            title="Passcode"
            subtitle={ticket.online.passcode}
            onClick={() => toast("Passcode copied")}
            trailing={<span className="text-[14px] text-[#C81E57]">Copy</span>}
          />
        </>
      ) : (
        <>
          <ActionRow icon={<TicketLineIcon />} title="See event page" subtitle={`${e.title} · ${e.hostName}`} href={`/events/${e.slug}`} />
          <ActionRow icon={<MapPinIcon size={20} />} title="Get directions" subtitle={ticket.where} onClick={() => setOverlay("directions")} />
        </>
      )}
      <ActionRow icon={<CalendarIcon size={20} />} title="Add to calendar" subtitle={dateShort} onClick={() => setOverlay("calendar")} />
      <ActionRow icon={<TicketLineIcon />} title="Order details" subtitle={`${code} · ${free ? "Free" : `Paid ${ticket.paid}`}`} href={`${base_}/order`} />
      {transfer ? (
        <ActionRow icon={<CloseIcon size={20} />} title="Cancel transfer" subtitle={`${firstName} has until Fri 24 Oct to accept. You keep the ticket until then.`} onClick={cancelTransfer} />
      ) : (
        <ActionRow icon={<ShareIcon size={20} />} title="Send to a friend" subtitle="Transfers are free" onClick={() => setOverlay("send")} />
      )}
      {help}
    </>
  );

  return (
    <>
      {/* ---------- App (AM37) ---------- */}
      <div className="min-h-screen bg-white pb-10 pt-[env(safe-area-inset-top)] md:hidden">
        <div className="flex h-14 items-center gap-3 px-4">
          <button
            type="button"
            onClick={() => (window.history.length > 1 ? router.back() : router.push("/my-events"))}
            aria-label="Back"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F4F6F8] text-[#172B3A]"
          >
            <ArrowLeftIcon size={20} />
          </button>
          <div className="flex min-w-0 flex-col">
            <h1 className="text-[17px] font-bold leading-[22px] tracking-[-0.01em] text-[#172B3A]">Your ticket</h1>
            <p className="truncate text-[12px] leading-4 text-[#68788A]">{sub}</p>
          </div>
        </div>
        <div className="flex justify-center px-6 pt-2">
          <TicketPass ticket={ticket} holder={holder} />
        </div>
        {ticket.online && !past && (
          <div className="flex justify-center pt-4">
            <button type="button" onClick={join} className="flex h-[52px] items-center justify-center rounded-[12px] bg-[#E22765] px-5 text-[16px] tracking-[-0.01em] text-white">
              Join on {ticket.online.platform}
            </button>
          </div>
        )}
        <div className="flex flex-col px-4 pt-4">{appRows}</div>
      </div>

      {/* ---------- Web (PW17) ---------- */}
      <div className="hidden md:block">
        <AccountShell bare>
          <div className="flex flex-col gap-12 lg:flex-row">
            <div className="w-[342px] shrink-0">
              <TicketPass ticket={ticket} holder={holder} web />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-4">
              <div className="flex flex-col gap-3">
                <span className="w-fit">
                  <ValidBadge {...webBadge} />
                </span>
                <h1 className="text-[28px] font-bold leading-[34px] tracking-[-0.02em] text-[#172B3A]">{e.title}</h1>
                <p className="text-[14px] leading-5 text-[#4D5E70]">{webSub}</p>
              </div>
              {past && (
                <button type="button" onClick={() => !after.review && setOverlay("rate")} className="text-left">
                  <NoticeBanner
                    title={after.review ? `You rated it ${after.review.stars} of 5` : "How was it?"}
                    body={after.review ? `Thanks for telling ${e.hostName}.` : `Rate ${e.title}. Your stars show on the event once it has 5 ratings.`}
                  />
                </button>
              )}
              <div className="mt-2 flex flex-col rounded-2xl border border-[#E9EDF1] px-4 py-4">{webRows}</div>
              {!past && !refunded && (
                <NoticeBanner title="Other ticket states" body="Checked in, used, refunded, cancelled and expired tickets show a matching badge here and on the pass." />
              )}
              <Link href={past || refunded ? "/my-events?tab=past" : "/my-events"} className="text-[14px] leading-[18px] text-[#C81E57]">
                Back to My events
              </Link>
            </div>
          </div>
        </AccountShell>
      </div>

      <DirectionsSheet open={overlay === "directions"} onClose={close} name={e.venueName} address={ticket.where} toast={toast} />
      <CalendarSheet open={overlay === "calendar"} onClose={close} toast={toast} />
      <WalletSheet open={overlay === "wallet"} onClose={close} toast={toast} />
      <HelpSheet open={overlay === "help"} onClose={close} ticket={ticket} onOpened={() => toast("Case opened. We reply here and by email", "View", () => router.push(`${base_}/order`))} />
      <SendTicketSheet open={overlay === "send"} onClose={close} ticket={ticket} onSent={() => toast("Ticket sent. It stays yours until they accept")} />
      <RateSheet open={overlay === "rate"} onClose={close} ticket={ticket} />
      {toastNode}
    </>
  );
}
