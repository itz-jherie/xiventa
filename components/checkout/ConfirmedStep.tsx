"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { XiventaEvent } from "@/data";
import { ticketsLabel } from "@/lib/checkout";
import { toTicket } from "@/lib/orders";
import { BellIcon, CalendarIcon, NavigationIcon, ShareIcon, VideoIcon } from "@/components/icons";
import { TicketPass } from "@/components/shared/TicketPass";
import { ActionRow } from "@/components/mobile/AppParts";
import { AppBottomBar, WebShell } from "@/components/checkout/CheckoutShell";
import { useCheckout } from "@/components/checkout/useCheckout";
import { useToast } from "@/components/shared/Sheet";

const CONFETTI: [number, number, number, number, string][] = [
  [24, 62, 6, 6, "#F3FDB8"],
  [352, 64, 10, 4, "#00E0B6"],
  [300, 58, 6, 6, "#EF7AA2"],
  [372, 150, 8, 8, "#977BFF"],
  [6, 210, 12, 4, "#FD703C"],
  [362, 250, 8, 8, "#F8FCE3"],
  [200, 49, 10, 4, "#E84E84"],
];

/**
 * You're in. Phone: AM34 Confirmation (905:397, Connect Lagos 916:61757): 343 px #040B11 celebration
 * header with the pattern and confetti, quick actions, the ticket pass and reminders. Web: PW13 Order
 * confirmed (314:20448, Signed in 1086:70314, Free 1087:70662, Online 1087:71175).
 */
export function ConfirmedStep({ event }: { event: XiventaEvent }) {
  const router = useRouter();
  const { cart, t, session } = useCheckout(event);
  const { show: toast, node: toastNode } = useToast();
  if (!cart || !t) return null;
  const ticket = toTicket(event, cart);
  const holder = cart.name;
  const online = event.format?.kind === "online";
  const free = t.total === 0;
  const signedIn = session?.status === "signed-in";
  const label = ticketsLabel(t);
  const ticketHref = `/my-events/${ticket.id}`;

  return (
    <>
      {/* ================= App (AM34) ================= */}
      <div className="relative min-h-screen bg-white pb-[110px] md:hidden">
        <div className="absolute inset-x-0 top-0 h-[343px] overflow-hidden bg-[#040B11]" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/celebration.svg" alt="" className="absolute left-[-54px] top-[-46px] h-[497px] w-[469px] max-w-none" />
          {CONFETTI.map(([x, y, w, h, c], i) => (
            <span key={i} className="absolute rounded-[2px]" style={{ left: `${(x / 390) * 100}%`, top: y, width: w, height: h, backgroundColor: c }} />
          ))}
        </div>
        <div className="relative flex flex-col gap-1.5 px-4 pt-[calc(env(safe-area-inset-top)+64px)]">
          <h1 className="text-[32px] font-bold leading-[30px] tracking-[-0.02em] text-white">You&apos;re in</h1>
          <p className="text-[14px] leading-5 text-white">
            {label.replace(/^./, (c) => c.toUpperCase())} for {event.title}. We also sent them to {cart.email}.
          </p>
        </div>
        <div className="relative flex gap-2 px-4 pb-4 pt-3">
          {[
            { icon: <CalendarIcon size={16} />, label: "Calendar", on: () => toast("Added to your calendar") },
            online
              ? { icon: <VideoIcon size={16} />, label: "Join info", on: () => router.push(ticketHref) }
              : { icon: <NavigationIcon size={16} />, label: "Directions", on: () => toast("Opening your maps app") },
            { icon: <ShareIcon size={16} />, label: "Send", on: () => toast("Send tickets from My events") },
          ].map((a) => (
            <button key={a.label} type="button" onClick={a.on} className="flex h-8 items-center gap-1.5 rounded-full bg-white/[0.14] px-3 text-[13px] text-white">
              {a.icon}
              {a.label}
            </button>
          ))}
        </div>
        <div className="relative flex justify-center px-6">
          <div className="w-full max-w-[342px] rounded-[24px] ring-1 ring-[#E22765]/50">
            <TicketPass ticket={ticket} holder={holder} web />
          </div>
        </div>
        <div className="flex flex-col px-4 pt-4">
          <ActionRow icon={<CalendarIcon size={20} />} title="Add to calendar" subtitle={event.dateLabel} onClick={() => toast("Added to your calendar")} />
          <ActionRow icon={<BellIcon size={20} />} title="Remind me" subtitle="1 day and 2 hours before" onClick={() => toast("Reminders on")} />
        </div>
        <AppBottomBar action="Go to My events" onAction={() => router.push("/my-events")} />
      </div>

      {/* ================= Web (PW13) ================= */}
      <WebShell>
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
          <div className="flex min-w-0 flex-1 flex-col gap-8 lg:max-w-[732px]">
            <span className="inline-flex h-6 w-fit items-center gap-1.5 rounded-full bg-[#E3F8EF] px-2 text-[12px] leading-4 text-[#067647]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#067647]" />
              {free ? "Free" : "Paid"}
            </span>
            <h1 className="text-[40px] font-bold leading-[44px] tracking-[-0.02em] text-[#172B3A]">You&apos;re in!</h1>
            <p className="text-[16px] leading-6 tracking-[-0.01em] text-[#4D5E70]">
              {online
                ? `We sent your ${t.lines[0]?.label ?? "ticket"} to ${cart.email}. The Join button opens 15 minutes before ${event.dateLabel.split(", ")[1] ?? "the start"} on ${event.dateLabel.split(",")[0]}.`
                : free
                  ? `Your ${label} for ${event.title} are in My events and your email. Show the QR code at the gate.`
                  : signedIn
                    ? "Your tickets are in My events and in your email. Show the QR code at the door."
                    : `We sent your tickets to ${cart.email}. Show the QR code at the door, from your email or the Xiventa app.`}
            </p>
            <div className="flex gap-3">
              <Link href="/my-events" className="flex h-[52px] items-center rounded-[12px] bg-[#E22765] px-5 text-[16px] tracking-[-0.01em] text-white hover:bg-[#C81E57]">
                Go to My events
              </Link>
              <button type="button" onClick={() => toast("Calendar file downloaded")} className="flex h-[52px] items-center rounded-[12px] border border-[#B4BFCA] bg-white px-5 text-[16px] tracking-[-0.01em] text-[#172B3A]">
                Add to calendar
              </button>
            </div>
            {!signedIn && (
              <section className="flex flex-col gap-3 rounded-2xl border border-[#E9EDF1] bg-white p-6">
                <h2 className="text-[20px] font-bold leading-[26px] tracking-[-0.02em] text-[#172B3A]">Keep your tickets in one place</h2>
                <p className="text-[14px] leading-5 text-[#4D5E70]">Create an account with {cart.email} to see these tickets later and get reminders.</p>
                <Link href="/welcome" className="flex h-11 w-fit items-center rounded-[12px] border border-[#B4BFCA] bg-white px-4 text-[14px] text-[#172B3A]">
                  Create account
                </Link>
              </section>
            )}
            <section className="flex flex-col gap-2 rounded-2xl bg-[#FDEEF3] p-6">
              <h2 className="text-[20px] font-bold leading-[26px] tracking-[-0.02em] text-[#172B3A]">Get the app for event day</h2>
              <p className="text-[14px] leading-5 text-[#4D5E70]">Tickets work offline, reminders arrive on time and directions are one tap away.</p>
            </section>
          </div>
          <div className="w-[342px] shrink-0 lg:ml-auto">
            <TicketPass ticket={ticket} holder={holder} web />
          </div>
        </div>
      </WebShell>
      {toastNode}
    </>
  );
}
