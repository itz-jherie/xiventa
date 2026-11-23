"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { getEventBySlug, type XiventaEvent } from "@/data";
import { newCart, writeCart } from "@/lib/checkout";
import { saveOrder, toTicket } from "@/lib/orders";
import { InfoIcon } from "@/components/icons";
import { ListEventCard } from "@/components/mobile/AppEventCards";
import { Stepper } from "@/components/checkout/CheckoutParts";
import { AppBottomBar, AppTop } from "@/components/checkout/CheckoutShell";
import { isDesktop } from "@/components/auth/WebAuth";
import { useSession } from "@/lib/session";
import { categoryTone } from "@/lib/categoryTone";

type Step = "form" | "pending" | "approved" | "declined";
const KEY = (slug: string) => `xiventa_request_${slug}`;

export function StatusPill({ text, tone }: { text: string; tone: "amber" | "green" | "red" | "blue" | "grey" }) {
  const cls = {
    amber: "bg-[#FFF6DD] text-[#8F5200]",
    green: "bg-[#E3F8EF] text-[#067647]",
    red: "bg-[#FFECEB] text-[#C0231A]",
    blue: "bg-[#E6F1FF] text-[#0059BE]",
    grey: "bg-[#E9EDF1] text-[#33465A]",
  }[tone];
  return <span className={`inline-flex h-6 w-fit items-center rounded-full px-2 text-[12px] leading-4 ${cls}`}>{text}</span>;
}

export function SummaryRow({ k, v, sub }: { k: string; v?: string; sub?: string }) {
  return (
    <div className="flex min-h-14 items-center justify-between gap-3 py-2">
      <span className="flex flex-col gap-0.5">
        <span className="text-[16px] leading-6 tracking-[-0.01em] text-[#172B3A]">{k}</span>
        {sub && <span className="text-[12px] leading-4 text-[#68788A]">{sub}</span>}
      </span>
      {v && <span className="text-right text-[14px] leading-5 text-[#4D5E70]">{v}</span>}
    </div>
  );
}

/**
 * AM62 Request to join (300:12991), Pending (300:13100), Approved (300:13187), Declined (300:13262).
 * App screen; on desktop the PW06 card shows Request sent instead. Static: the host's answer is
 * previewed with ?step=approved or ?step=declined.
 */
export function RequestFlow({ event }: { event: XiventaEvent }) {
  const router = useRouter();
  const params = useSearchParams();
  const session = useSession();
  const step = (params.get("step") as Step) ?? "form";
  const [spots, setSpots] = useState(2);
  const [note, setNote] = useState("Coming with my sister. We loved your last picnic!");
  const base = `/events/${event.slug}`;
  useEffect(() => {
    if (isDesktop()) router.replace(`${base}?state=${step === "form" ? "request" : "request-sent"}`);
  }, [base, router, step]);

  const raw = useSyncExternalStore(
    () => () => {},
    () => sessionStorage.getItem(KEY(event.slug)),
    () => null
  );
  const saved = raw ? (JSON.parse(raw) as { spots: number; note: string }) : null;
  const s = saved ?? { spots, note };
  const card = <ListEventCard event={event} hostLine showRepeatAndAge={false} categoryTag={categoryTone(event.categoryLabel)} />;

  if (step === "pending")
    return (
      <div className="min-h-screen bg-white pb-[110px] pt-[env(safe-area-inset-top)]">
        <AppTop title="Your request" subtitle={event.title} onBack={() => router.push(base)} />
        <div className="flex flex-col gap-2 px-4 pt-3">
          <StatusPill text="Pending" tone="amber" />
          <h2 className="text-[24px] font-bold leading-[30px] tracking-[-0.02em] text-[#172B3A]">Request sent</h2>
          <p className="text-[14px] leading-5 text-[#4D5E70]">The host usually replies within a day. We will let you know either way.</p>
          <div className="flex flex-col divide-y divide-[#E9EDF1] pt-2">
            <SummaryRow k="Spots" v={String(s.spots)} />
            <SummaryRow k="Your note" sub={s.note || "No note"} />
            <SummaryRow k="Event" sub={`${event.dateLabel} · ${event.venueName}`} />
          </div>
          <button
            type="button"
            onClick={() => {
              sessionStorage.removeItem(KEY(event.slug));
              router.push(`${base}?state=request`);
            }}
            className="py-4 text-[14px] text-[#C81E57]"
          >
            Cancel request
          </button>
        </div>
        <AppBottomBar action="Back to event" onAction={() => router.push(`${base}?state=request-sent`)} />
      </div>
    );

  if (step === "approved")
    return (
      <div className="min-h-screen bg-white pb-[110px] pt-[env(safe-area-inset-top)]">
        <AppTop title="Your request" subtitle={event.title} onBack={() => router.push(base)} />
        <div className="flex flex-col gap-3 px-4 pt-3">
          <StatusPill text="Approved" tone="green" />
          <h2 className="text-[24px] font-bold leading-[30px] tracking-[-0.02em] text-[#172B3A]">You&apos;re in!</h2>
          <p className="text-[14px] leading-5 text-[#4D5E70]">
            {event.hostName} approved your request for {s.spots} {s.spots === 1 ? "spot" : "spots"}. Your free {s.spots === 1 ? "ticket is" : "tickets are"} ready.
          </p>
          <div className="flex justify-center pt-2">{card}</div>
        </div>
        <AppBottomBar
          action="View ticket"
          onAction={() => {
            const cart = newCart(event, { name: session?.name ?? "Ada Okafor", email: "ada@example.com" });
            cart.qty = { [Object.keys(cart.qty)[0] ?? "free"]: s.spots };
            writeCart(cart);
            saveOrder(cart);
            router.push(`/my-events/${toTicket(event, cart).id}`);
          }}
        />
      </div>
    );

  if (step === "declined") {
    const similar = ["sunrise-yoga-by-the-water", "board-games-in-the-park"].flatMap((x) => {
      const e = getEventBySlug(x);
      return e ? [e] : [];
    });
    return (
      <div className="min-h-screen bg-white pb-[110px] pt-[env(safe-area-inset-top)]">
        <AppTop title="Your request" subtitle={event.title} onBack={() => router.push(base)} />
        <div className="flex flex-col gap-3 px-4 pt-3">
          <StatusPill text="Declined" tone="grey" />
          <h2 className="text-[24px] font-bold leading-[30px] tracking-[-0.02em] text-[#172B3A]">Not this time</h2>
          <p className="text-[14px] leading-5 text-[#4D5E70]">The host could not take more guests for this one. Here are similar events this weekend.</p>
          <div className="flex flex-col items-center gap-3 pt-2">
            {similar.map((e) => (
              <ListEventCard key={e.slug} event={e} categoryTag={categoryTone(e.categoryLabel)} />
            ))}
          </div>
        </div>
        <AppBottomBar action="See more events" onAction={() => router.push("/m/events")} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-[110px] pt-[env(safe-area-inset-top)]">
      <AppTop title="Request to join" subtitle={event.title} />
      <div className="flex flex-col gap-5 px-4 pt-2">
        <div className="flex justify-center">{card}</div>
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-bold leading-5 text-[#172B3A]">Spots for you and guests</span>
          <Stepper value={spots} max={4} onChange={(n) => setSpots(Math.max(1, n))} label="spot" />
        </div>
        <label className="flex flex-col gap-2">
          <span className="text-[13px] leading-4 text-[#172B3A]">Note to the host (optional)</span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            className="min-h-12 resize-none rounded-[12px] border border-[#D5DCE3] bg-white px-4 py-3 text-[14px] leading-5 text-[#172B3A] focus:border-[#E22765] focus:outline-none"
          />
          <span className="text-[12px] leading-4 text-[#68788A]">Only the host sees this.</span>
        </label>
        <div className="flex items-center gap-3 rounded-2xl bg-[#E6F1FF] px-4 py-3">
          <InfoIcon size={20} className="shrink-0 text-[#0059BE]" />
          <div className="flex flex-col gap-0.5">
            <p className="text-[13px] leading-4 text-[#172B3A]">The host approves each guest</p>
            <p className="text-[12px] leading-4 text-[#4D5E70]">You&apos;ll get a notification when they decide. If it&apos;s a yes, your ticket appears in My events.</p>
          </div>
        </div>
      </div>
      <AppBottomBar
        action="Send request"
        onAction={() => {
          sessionStorage.setItem(KEY(event.slug), JSON.stringify({ spots, note }));
          router.push(`${base}/request?step=pending`);
        }}
      />
    </div>
  );
}
