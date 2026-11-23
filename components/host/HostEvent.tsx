"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { CreateShell } from "@/components/create/CreateParts";
import { ActionRow } from "@/components/mobile/AppParts";
import { Sheet, sheetPrimary, sheetSecondary, useToast } from "@/components/shared/Sheet";
import { ShareSheet } from "@/components/shared/Overlays";
import { RadioRows } from "@/components/tickets/TicketParts";
import {
  AlertIcon,
  CalendarIcon,
  CheckIcon,
  CloseIcon,
  ImageIcon,
  MapPinIcon,
  PhoneIcon,
  PlayIcon,
  PlusIcon,
  QrCodeIcon,
  RepeatIcon,
  ScanIcon,
  ShareIcon,
  SparkleIcon,
  TicketIcon,
  UploadIcon,
  UsersIcon,
  VideoIcon,
  WalletIcon,
} from "@/components/icons";
import { ATTENDEES, REQUESTS, inCount, naira, updateHost, useHost, useHosted, type Hosted } from "@/lib/hosting";
import { Area, Banner, BoostRow, Pill, Select, StatCard, type Tone } from "./HostParts";

export const evBase = (id: string) => `/host/event/${id}`;

export function useEv(id: string): Hosted | undefined {
  return useHosted().find((h) => h.id === id);
}

/** Tickets checked in on this device beyond the sample figure (shared by the overview, scanner and count). */
export function useCheckedDelta() {
  const s = useHost();
  return ATTENDEES.reduce((n, a) => n + (inCount(s, a) - a.inCount), 0);
}

/* ------------------------------------------------------------------ OM02 Event overview */

export function EventOverview({ id }: { id: string }) {
  const h = useEv(id)!;
  const router = useRouter();
  const sp = useSearchParams();
  const host = useHost();
  const delta = useCheckedDelta();
  const { show, node } = useToast();
  const [share, setShare] = useState(false);
  const [dup, setDup] = useState(false);
  const base = evBase(id);
  const cancelled = host.cancelled.includes(id);
  const ended = h.status === "ended" || sp.get("state") === "ended";
  const listing = h.kind === "listing";
  const state = sp.get("state") ?? (listing ? "listing" : ended ? "ended" : "");
  const doors = state === "doors";
  const done = sp.get("done");
  const openRequests = REQUESTS.filter((r) => !host.requests[r.id]);
  const requestsSub = openRequests.length ? openRequests.map((r) => `1 ${r.kind.toLowerCase()}`).join(" and ") + " need" + (openRequests.length === 1 ? "s" : "") + " you" : "Nothing waiting";
  const checked = (doors ? 64 : 0) + delta;
  const sold = h.sold || 0;

  const when = cancelled
    ? `${h.date.split(",")[0]} · Cancelled`
    : listing
      ? state === "listing-review"
        ? `${h.date} · Listing in review`
        : state === "listing-hidden"
          ? `${h.date} · Listing hidden`
          : h.when
      : ended
        ? `${h.date.split(",")[0]} · Ended`
        : doors
          ? `Today, ${h.date.split(", ")[1] ?? ""} · Doors open`
          : `${h.date} · On sale`;

  const action = cancelled
    ? undefined
    : listing
      ? state === "listing-review"
        ? "Edit listing"
        : state === "listing-hidden"
          ? "Reconnect Instagram"
          : "Share event"
      : ended
        ? "Run it again"
        : "Scan tickets";
  const onAction = () => {
    if (action === "Scan tickets") router.push(`${base}/scan`);
    else if (action === "Run it again") setDup(true);
    else if (action === "Share event") setShare(true);
    else if (action === "Edit listing") router.push(`${base}/edit`);
    else show("Instagram reconnected");
  };

  const rows: { icon: React.ReactNode; title: string; sub: string; href?: string; onClick?: () => void }[] = [];
  if (!listing && !ended && !cancelled) {
    rows.push({ icon: <ScanIcon size={20} />, title: "Scan tickets", sub: doors ? "Tolu at Door A, Kemi at Gate C" : "Doors open at 8:30 PM", href: `${base}/scan` });
    rows.push({ icon: <UsersIcon size={20} />, title: "Attendees", sub: `${sold} guests and 4 tables`, href: `${base}/attendees` });
  }
  if (!listing && ended) rows.push({ icon: <UsersIcon size={20} />, title: "Guest list", sub: `${h.came ?? 131} came · export from the web dashboard`, href: `${base}/attendees` });
  if (!listing && !cancelled) rows.push({ icon: <RepeatIcon size={20} />, title: "Requests", sub: ended ? "Open for 7 days after the event" : requestsSub, href: `${base}/requests` });
  if (!listing && !ended && !cancelled) {
    rows.push({ icon: <TicketIcon size={20} />, title: "Tickets", sub: "3 types · Early bird sold out", href: `${base}/tickets` });
    rows.push({ icon: <ScanIcon size={20} />, title: "Check in staff", sub: "Tolu and Kemi at the door", href: `${base}/staff` });
  }
  if (!listing) rows.push({ icon: <UsersIcon size={20} />, title: "Team", sub: "Managers and finance", href: "/host/team" });
  if (!listing && !ended && !cancelled) rows.push({ icon: <SparkleIcon size={20} />, title: "Promoters", sub: "Links for people who sell for you", href: `${base}/promoters` });
  rows.push({ icon: <QrCodeIcon size={20} />, title: "Share and poster QR", sub: "Links and print ready QR", href: `${base}/share` });
  if (!ended && !cancelled && state !== "listing-review") rows.push({ icon: <VideoIcon size={20} />, title: "Spotlight clip", sub: host.clipRemoved.includes(id) ? "No clip yet" : "In review", href: `${base}/clip` });
  if (!ended && !cancelled) rows.push({ icon: <CalendarIcon size={20} />, title: "Edit event", sub: "Guests are told about big changes", href: `${base}/edit` });
  rows.push({ icon: <PlusIcon size={20} />, title: "Duplicate event", sub: "Start a new draft from this one", onClick: () => setDup(true) });
  if (!ended && !cancelled) rows.push({ icon: <CloseIcon size={20} />, title: "Cancel event", sub: "Tells everyone with a ticket", href: `${base}/cancel` });
  if (!listing) rows.push({ icon: <WalletIcon size={20} />, title: "Money and refunds", sub: "On the web dashboard", href: "/dashboard" });

  return (
    <CreateShell title={h.title} subtitle={when} back="/host" action={action} onAction={onAction}>
      <div className="flex flex-col gap-3">
        {done && <Banner tone="green" title={done} body="Everyone affected has been told." />}
        {cancelled && <Banner tone="red" title="Event cancelled" body={`${sold} ticket holders were told. Refunds have started.`} />}
        {state === "venue-wait" && <Banner title={`Waiting for ${h.venue}`} body="Your event is live and selling. It shows on their page once they accept." />}
        {state === "venue-declined" && (
          <Banner tone="red" title={`${h.venue} declined this event`} body="They said: We didn't agree to this. Xiventa will be in touch. Your event stays live while we look." action="Contact support" onAction={() => router.push("/help/hosting")} />
        )}
        {state === "listing-hidden" && (
          <Banner tone="red" title="Your listing is hidden" body="We can’t find your Instagram post. It may have been deleted, or Instagram was disconnected. Guests can’t see this event until you fix it." />
        )}
        {listing ? (
          <div className="grid grid-cols-2 gap-3">
            {state === "listing-review" ? (
              <>
                <StatCard label="Views" value="0" note="Counts start once it’s live" />
                <StatCard label="Instagram taps" value="0" note="People sent to your post" />
                <StatCard label="Saves" value="0" note="Nothing yet" wide />
              </>
            ) : (
              <>
                <StatCard label="Views" value="3,240" note="Up 18% this week" />
                <StatCard label="Instagram taps" value="618" note="People sent to your post" />
                <StatCard label="Saves" value="412" note="Reminded the day before" good wide />
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Tickets sold" value={String(sold)} note={`Of ${h.capacity}`} />
            {ended ? (
              <StatCard label="Came" value={String(h.came ?? 131)} note={`Of ${sold} · ${sold - (h.came ?? 131)} did not show`} />
            ) : (
              <StatCard label="Checked in" value={String(checked)} note={doors || checked ? `Of ${sold} · ${sold - checked} still to come` : "Doors open 8:30 PM"} />
            )}
            <StatCard
              label="Ticket sales"
              value={naira(h.revenue)}
              note={ended ? "Paid out Tue 28 Oct, after refunds" : doors ? "Sales close at 1 AM" : "Up 18% since Monday"}
              good
              wide
            />
          </div>
        )}
        {state === "listing-review" && <Banner tone="blue" title="Your listing is in review" body="We’re checking your Instagram page. We’ll tell you the moment it’s live." />}
      </div>

      {listing && state === "listing" && (
        <div className="pt-2">
          <BoostRow icon={<TicketIcon size={20} />} title="Sell tickets on Xiventa" sub="QR tickets, check in, payouts and a Verified badge" href="/create" />
        </div>
      )}
      {listing && state === "listing-hidden" && (
        <div className="pt-2">
          <BoostRow icon={<ImageIcon size={20} />} title="Pick another post" sub="Choose a new post for this event from your grid" onClick={() => show("Post updated, your listing is back")} />
        </div>
      )}

      {!listing && !ended && !doors && !cancelled && (
        <>
          <span className="pb-1 pt-5 text-[11px] font-bold uppercase leading-4 tracking-[0.06em] text-[#4D5E70]">Make it go further</span>
          <BoostRow icon={<PhoneIcon size={20} />} title="Share on WhatsApp" sub="Send it to your groups and Status" onClick={() => setShare(true)} />
          <BoostRow icon={<PlayIcon size={20} />} title="Add a Spotlight clip" sub="Events with a clip get seen more" href={`${base}/clip`} />
          <BoostRow icon={<QrCodeIcon size={20} />} title="Print your poster QR" sub="Put it up where your people hang out" href={`${base}/share`} />
        </>
      )}

      <div className="flex flex-col pt-4">
        {rows.map((r) => (
          <ActionRow key={r.title} icon={r.icon} title={r.title} subtitle={r.sub} href={r.href} onClick={r.onClick} />
        ))}
      </div>

      <ShareSheet open={share} onClose={() => setShare(false)} subtitle={h.title} path={`/e/${h.slug ?? h.id}`} toast={show} />
      <DuplicateSheet open={dup} onClose={() => setDup(false)} />
      {node}
    </CreateShell>
  );
}

/** OM12 Duplicate event: pick what to copy, then the create flow opens with a fresh draft. */
export function DuplicateSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const opts = ["Details and media", "Ticket types and prices", "Location and access", "Check in staff"];
  const [on, setOn] = useState<string[]>(opts);
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Duplicate event"
      footer={
        <>
          <button type="button" onClick={onClose} className={sheetSecondary}>
            Cancel
          </button>
          <button type="button" onClick={() => router.push("/create")} className={sheetPrimary}>
            Duplicate
          </button>
        </>
      }
    >
      <p className="pb-2 text-[14px] leading-5 text-[#4D5E70]">We copy the event into a new draft. Dates and sales start fresh.</p>
      {opts.map((o) => {
        const c = on.includes(o);
        return (
          <button key={o} type="button" role="checkbox" aria-checked={c} onClick={() => setOn(c ? on.filter((x) => x !== o) : [...on, o])} className="flex min-h-12 w-full items-center gap-3 text-left">
            <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] ${c ? "bg-[#E22765] text-white" : "border-[1.5px] border-[#B4BFCA]"}`}>{c && <CheckIcon size={14} />}</span>
            <span className="text-[15px] leading-5 text-[#172B3A]">{o}</span>
          </button>
        );
      })}
    </Sheet>
  );
}

/* ------------------------------------------------------------------ OM03 Edit event, Review changes, OM21 Edit scope */

const DATES = ["Sat 25 Oct", "Sat 1 Nov", "Sat 8 Nov", "Fri 31 Oct"];
const DOORS = ["8:30 PM", "9 PM", "9:30 PM", "10 PM"];

export function EditEvent({ id }: { id: string }) {
  const h = useEv(id)!;
  const router = useRouter();
  const { show, node } = useToast();
  const [basics, setBasics] = useState(false);
  const [date, setDate] = useState(h.date.split(",")[0]);
  const [doorsAt, setDoorsAt] = useState("8:30 PM");
  const base = evBase(id);
  const later = () => show("Opens the same step as Post an event");
  return (
    <CreateShell title="Edit event" subtitle={h.title} back={base} action="Review changes" onAction={() => router.push(`${base}/edit-review?date=${encodeURIComponent(date)}&doors=${encodeURIComponent(doorsAt)}`)}>
      {h.sold > 0 && <Banner title={`${h.sold} people have tickets`} body="Changing the date, time or venue tells every ticket holder. They can keep their ticket or ask for a refund." />}
      <span className="pb-1 pt-5 text-[11px] font-bold uppercase leading-4 tracking-[0.06em] text-[#4D5E70]">What to edit</span>
      <BoostRow icon={<UploadIcon size={20} />} title="Update from a new flyer" sub="We spot what changed and show it before you save" onClick={later} />
      <ActionRow icon={<CalendarIcon size={20} />} title="Event basics" subtitle="Name, category, date and time" onClick={() => setBasics(true)} />
      <ActionRow icon={<MapPinIcon size={20} />} title="Location and access" subtitle={`${h.venue}, open to all`} onClick={later} />
      <ActionRow icon={<AlertIcon size={20} />} title="More details (optional)" subtitle="Dress code, parking, security" onClick={later} />
      <ActionRow icon={<ImageIcon size={20} />} title="Flyer and Spotlight clip" subtitle="Poster and one clip" href={`${base}/clip`} />
      {h.kind !== "listing" && <ActionRow icon={<TicketIcon size={20} />} title="Tickets" subtitle={`4 types, ${h.sold} sold`} href={`${base}/tickets`} />}
      <Sheet
        open={basics}
        onClose={() => setBasics(false)}
        title="Date and time"
        footer={
          <button type="button" onClick={() => setBasics(false)} className={sheetPrimary}>
            Done
          </button>
        }
      >
        <div className="flex flex-col gap-4">
          <Select label="Date" value={date} onChange={setDate} options={DATES.includes(date) ? DATES : [date, ...DATES]} />
          <Select label="Doors open" value={doorsAt} onChange={setDoorsAt} options={DOORS} />
        </div>
      </Sheet>
      {node}
    </CreateShell>
  );
}

export function EditReview({ id }: { id: string }) {
  const h = useEv(id)!;
  const router = useRouter();
  const sp = useSearchParams();
  const base = evBase(id);
  const was = h.date.split(",")[0];
  const date = sp.get("date") ?? "Sat 1 Nov";
  const doorsAt = sp.get("doors") ?? "9 PM";
  const changes: [string, string][] = [];
  if (date !== was) changes.push(["Date", `Was ${was}, now ${date}`]);
  if (doorsAt !== "8:30 PM") changes.push(["Doors open", `Was 8:30 PM, now ${doorsAt}`]);
  const [msg, setMsg] = useState("Same party, one week later. See you there!");
  const [scope, setScope] = useState(false);
  const [pick, setPick] = useState<string | null>("Only Fri 23 Oct");
  const save = () => router.push(`${base}?done=${encodeURIComponent(changes.length ? "Changes saved" : "No changes to save")}`);
  return (
    <CreateShell title="Review changes" subtitle={h.title} back={`${base}/edit`} action="Save and notify" onAction={() => (h.recurring ? setScope(true) : save())}>
      <span className="pb-1 text-[11px] font-bold uppercase leading-4 tracking-[0.06em] text-[#4D5E70]">You changed</span>
      {changes.length ? (
        changes.map(([k, v]) => (
          <div key={k} className="flex flex-col gap-0.5 border-b border-[#E9EDF1] py-3">
            <span className="text-[15px] leading-5 text-[#172B3A]">{k}</span>
            <span className="text-[13px] leading-4 text-[#4D5E70]">{v}</span>
          </div>
        ))
      ) : (
        <p className="py-3 text-[14px] leading-5 text-[#4D5E70]">Nothing yet. Go back to make a change.</p>
      )}
      {changes.length > 0 && h.sold > 0 && (
        <div className="flex flex-col gap-4 pt-4">
          <Banner title={`${h.sold} ticket holders will be told`} body="They can keep their ticket for the new date or ask for a refund within the time Xiventa sets." />
          <Area label="Message to ticket holders (optional)" value={msg} onChange={setMsg} hint="Sent with the update." />
        </div>
      )}
      <Sheet
        open={scope}
        onClose={() => setScope(false)}
        title="Apply changes to"
        footer={
          <>
            <button type="button" onClick={() => setScope(false)} className={sheetSecondary}>
              Cancel
            </button>
            <button type="button" onClick={save} className={sheetPrimary}>
              Apply
            </button>
          </>
        }
      >
        <p className="pb-2 text-[14px] leading-5 text-[#4D5E70]">{h.title} repeats {h.recurring?.toLowerCase()}. Which dates should this change apply to?</p>
        <RadioRows options={[["Only Fri 23 Oct"], ["Fri 23 Oct and after", "Fri 30 Oct, 6 Nov and later"], ["All dates"]]} value={pick} onChange={setPick} />
        <div className="pt-3">
          <Banner title="3 of these dates have tickets sold" body="Ticket holders for those dates are told and can ask for a refund." />
        </div>
      </Sheet>
    </CreateShell>
  );
}

/* ------------------------------------------------------------------ OM04 Tickets */

const TYPES: { name: string; line: string; status: [string, Tone] }[] = [
  { name: "Early bird", line: "₦10,000 · 40 of 40 sold", status: ["Sold out", "grey"] },
  { name: "Regular", line: "₦15,000 now, ₦20,000 from 1 AM · 98 of 150 sold", status: ["On sale", "green"] },
  { name: "VIP", line: "₦45,000 · 4 of 20 sold", status: ["Paused", "amber"] },
  { name: "Table for 6", line: "₦150,000 · 0 of 5 sold", status: ["On sale", "green"] },
];

export function HostTickets({ id }: { id: string }) {
  const h = useEv(id)!;
  const { show, node } = useToast();
  const [paused, setPaused] = useState<Record<string, boolean>>({ VIP: true });
  const [open, setOpen] = useState<string | null>(null);
  const [add, setAdd] = useState(false);
  const [more, setMore] = useState("20");
  const t = TYPES.find((x) => x.name === open);
  return (
    <CreateShell title="Tickets" subtitle={h.title} back={evBase(id)}>
      <Banner tone="blue" side title="12 people are waiting for Regular" body="Add more Regular tickets and we offer them to the waitlist first." action="Add tickets" onAction={() => setAdd(true)} />
      <span className="pb-1 pt-5 text-[11px] uppercase leading-4 tracking-[0.06em] text-[#4D5E70]">Ticket types</span>
      {TYPES.map((x) => {
        const status: [string, Tone] = x.status[0] === "Sold out" ? x.status : paused[x.name] ? ["Paused", "amber"] : ["On sale", "green"];
        return (
          <button key={x.name} type="button" onClick={() => setOpen(x.name)} className="flex min-h-[62px] w-full items-center gap-3 py-2 text-left">
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="text-[15px] font-bold leading-5 text-[#172B3A]">{x.name}</span>
              <span className="text-[12px] leading-4 text-[#4D5E70]">{x.line}</span>
            </span>
            <Pill label={status[0]} tone={status[1]} />
          </button>
        );
      })}
      <button type="button" onClick={() => show("Opens the ticket editor from Post an event")} className="mt-4 flex h-[52px] w-full items-center justify-center rounded-[12px] border border-[#B4BFCA] text-[16px] text-[#172B3A]">
        Add a ticket type
      </button>
      <p className="pt-3 text-[12px] leading-4 text-[#4D5E70]">Tap a type to edit, pause or hide it. Types with sales cannot be deleted.</p>

      <Sheet open={!!t} onClose={() => setOpen(null)} title={t?.name ?? "Ticket"}>
        {t && (
          <div className="flex flex-col">
            <p className="pb-2 text-[14px] leading-5 text-[#4D5E70]">{t.line}</p>
            {t.status[0] !== "Sold out" && (
              <ActionRow
                icon={<PlayIcon size={20} />}
                title={paused[t.name] ? "Resume sales" : "Pause sales"}
                subtitle={paused[t.name] ? "Buyers can pick it again" : "Hidden from buyers until you resume"}
                onClick={() => {
                  setPaused({ ...paused, [t.name]: !paused[t.name] });
                  setOpen(null);
                  show(paused[t.name] ? `${t.name} is on sale` : `${t.name} is paused`);
                }}
              />
            )}
            <ActionRow icon={<TicketIcon size={20} />} title="Edit price and quantity" subtitle="Buyers who paid keep their price" onClick={() => show("Opens the ticket editor from Post an event")} />
          </div>
        )}
      </Sheet>
      <Sheet
        open={add}
        onClose={() => setAdd(false)}
        title="Add Regular tickets"
        footer={
          <button
            type="button"
            onClick={() => {
              setAdd(false);
              show(`${more} tickets added. The waitlist hears first.`);
            }}
            className={sheetPrimary}
          >
            Add tickets
          </button>
        }
      >
        <Select label="How many more" value={more} onChange={setMore} options={["10", "20", "50", "100"]} />
        <p className="pt-2 text-[12px] leading-4 text-[#68788A]">The 12 people waiting get the first chance to buy, for 2 hours each.</p>
      </Sheet>
      {node}
    </CreateShell>
  );
}

/* ------------------------------------------------------------------ OM11 Cancel event */

export function CancelEvent({ id }: { id: string }) {
  const h = useEv(id)!;
  const router = useRouter();
  const sp = useSearchParams();
  const host = useHost();
  const [msg, setMsg] = useState("So sorry, the venue flooded. A new date is coming soon.");
  const base = evBase(id);
  if (sp.get("step") === "done" || host.cancelled.includes(id))
    return (
      <CreateShell title="Event cancelled" subtitle={h.title} back="/host" action="Back to hosting" onAction={() => router.push("/host")}>
        <div className="flex flex-col items-center gap-3 pt-8 text-center">
          <Pill label="Cancelled" tone="red" dot />
          <h2 className="text-[24px] font-bold leading-[30px] tracking-[-0.02em] text-[#172B3A]">Event cancelled</h2>
          <p className="max-w-[320px] text-[14px] leading-5 text-[#4D5E70]">{h.sold} ticket holders were told. Refunds have started and usually reach them within the time set by the payment partner.</p>
        </div>
        <div className="pt-8">
          <div className="flex items-center justify-between border-b border-[#E9EDF1] py-3">
            <span className="text-[15px] text-[#172B3A]">Refunds started</span>
            <span className="text-[15px] font-bold text-[#172B3A]">{h.sold}</span>
          </div>
          <ActionRow icon={<WalletIcon size={20} />} title="Track refunds" subtitle="On the web dashboard" href="/dashboard" />
        </div>
      </CreateShell>
    );
  return (
    <CreateShell
      title="Cancel event"
      subtitle={h.title}
      back={base}
      action="Cancel event"
      onAction={() => {
        updateHost((s) => ({ cancelled: [...s.cancelled, id] }));
        router.push(`${base}/cancel?step=done`);
      }}
      secondary={
        <button type="button" onClick={() => router.push(base)} className="flex h-11 items-center justify-center text-[15px] text-[#C0231A]">
          Keep event
        </button>
      }
    >
      <div className="flex items-start gap-3">
        <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[12px] bg-[#E9EDF1]">{h.image && <Image src={h.image} alt="" fill sizes="64px" className="object-cover" />}</span>
        <div className="flex flex-col gap-1">
          {h.sold > 0 && <Pill label="Has sales" tone="amber" />}
          <h2 className="text-[20px] font-bold leading-[26px] tracking-[-0.02em] text-[#172B3A]">Cancel {h.title}?</h2>
        </div>
      </div>
      <p className="pt-2 text-[14px] leading-5 text-[#4D5E70]">This cannot be undone. Everyone with a ticket is told straight away.</p>
      <span className="pb-1 pt-5 text-[11px] uppercase leading-4 tracking-[0.06em] text-[#4D5E70]">What happens</span>
      {[
        ["Ticket holders told", String(h.sold)],
        ["Refunds", naira(h.revenue)],
        ["Waitlist", "12"],
      ].map(([k, v]) => (
        <div key={k} className="flex items-center justify-between border-b border-[#E9EDF1] py-3">
          <span className="text-[15px] text-[#172B3A]">{k}</span>
          <span className="text-[15px] font-bold text-[#172B3A]">{v}</span>
        </div>
      ))}
      <div className="pt-4">
        <Area label="Message to guests" value={msg} onChange={setMsg} hint="Sent with the cancellation." />
      </div>
    </CreateShell>
  );
}

/* ------------------------------------------------------------------ OM19 Spotlight clip */

export function HostClip({ id }: { id: string }) {
  const h = useEv(id)!;
  const router = useRouter();
  const sp = useSearchParams();
  const host = useHost();
  const { show, node } = useToast();
  const rejected = sp.get("state") === "rejected";
  const removed = host.clipRemoved.includes(id);
  const base = evBase(id);
  return (
    <CreateShell
      title="Spotlight clip"
      subtitle={h.title}
      back={base}
      action={removed ? "Add a clip" : "Replace clip"}
      onAction={() => {
        updateHost((s) => ({ clipRemoved: s.clipRemoved.filter((x) => x !== id) }));
        show(removed ? "Clip added, it is in review" : "New clip sent for review");
        if (rejected) router.replace(`${base}/clip`);
      }}
      secondary={
        !removed && (
          <button
            type="button"
            onClick={() => {
              updateHost((s) => ({ clipRemoved: [...s.clipRemoved, id] }));
              show("Clip removed");
            }}
            className="flex h-11 items-center justify-center text-[15px] text-[#C0231A]"
          >
            Remove clip
          </button>
        )
      }
    >
      {removed ? (
        <Banner tone="blue" title="No clip yet" body="Add a short vertical video. Events with a clip get seen more in Spotlight." />
      ) : rejected ? (
        <Banner tone="red" title="Your clip was not approved" body="It shows a drinks brand logo you may not have the rights to. Replace it to get back into Spotlight." />
      ) : (
        <Banner title="Your clip is in review" body="We check clips from new hosts before they go live. It usually takes a few hours." />
      )}
      {!removed && (
        <div className="relative mx-auto mt-4 aspect-[9/16] w-full max-w-[260px] overflow-hidden rounded-[20px] bg-[#172B3A]">
          {h.image && <Image src={h.image} alt="" fill sizes="260px" className="object-cover opacity-80" />}
          <span className="absolute left-3 top-3 rounded-full bg-black/40 px-2 py-1 text-[11px] text-white">Spotlight</span>
          <span className="absolute right-3 top-3">
            <Pill label={rejected ? "Rejected" : "In review"} tone={rejected ? "red" : "amber"} />
          </span>
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-gradient-to-t from-black/80 to-transparent p-4 pt-10 text-white">
            <span className="text-[11px] font-bold uppercase tracking-[0.04em] text-[#F5A3BF]">{h.date}</span>
            <span className="text-[16px] font-bold leading-5">{h.title}</span>
            <span className="mt-2 flex h-9 w-fit items-center rounded-full bg-[#E22765] px-4 text-[13px]">Get tickets</span>
          </div>
        </div>
      )}
      {node}
    </CreateShell>
  );
}

/* ------------------------------------------------------------------ OM23 Share and poster */

export function HostShare({ id }: { id: string }) {
  const h = useEv(id)!;
  const { show, node } = useToast();
  const [dark, setDark] = useState(false);
  const [share, setShare] = useState(false);
  const link = `xiventa.com/e/${(h.slug ?? h.id).replace(/-/g, "")}`;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`https://${link}`);
    } catch {}
    show("Link copied");
  };
  return (
    <CreateShell title="Share your event" subtitle={h.title} back={evBase(id)} action="Share" onAction={() => setShare(true)}>
      <div className="flex h-11 items-center rounded-full bg-[#E9EDF1] p-1">
        {["Light poster", "Dark poster"].map((l, i) => (
          <button key={l} type="button" onClick={() => setDark(i === 1)} className={`flex h-9 flex-1 items-center justify-center rounded-full text-[14px] ${dark === (i === 1) ? "bg-white text-[#172B3A] shadow-[0_1px_2px_rgba(23,43,58,0.06)]" : "text-[#4D5E70]"}`}>
            {l}
          </button>
        ))}
      </div>
      <Poster h={h} dark={dark} />
      <div className="flex flex-col pt-3">
        <ActionRow icon={<ShareIcon size={20} />} title="Copy link" subtitle={link} onClick={copy} trailing={<span />} />
        <ActionRow icon={<ImageIcon size={20} />} title="Download poster" subtitle="PNG, ready for WhatsApp and Instagram" onClick={() => show("Poster saved to your phone")} />
        <ActionRow icon={<QrCodeIcon size={20} />} title="Download QR code only" subtitle="For flyers and table cards" onClick={() => show("QR code saved to your phone")} />
      </div>
      <ShareSheet open={share} onClose={() => setShare(false)} subtitle={h.title} path={`/e/${h.slug ?? h.id}`} toast={show} />
      {node}
    </CreateShell>
  );
}

/** OM23 / OM25 poster: flyer, pink "Scan for tickets", a QR block, title and date line. */
export function Poster({ h, dark = false }: { h: Hosted; dark?: boolean }) {
  return (
    <div className={`mx-auto mt-4 flex w-full max-w-[280px] flex-col items-center gap-3 rounded-[20px] p-5 text-center ${dark ? "bg-[#172B3A]" : "border border-[#E9EDF1] bg-white"}`}>
      <span className="relative h-[120px] w-full overflow-hidden rounded-[12px] bg-[#E9EDF1]">{h.image && <Image src={h.image} alt="" fill sizes="280px" className="object-cover" />}</span>
      <span className={`text-[12px] font-bold uppercase tracking-[0.06em] ${dark ? "text-white" : "text-[#E22765]"}`}>Scan for tickets</span>
      <span className="rounded-[12px] bg-white p-2">
        <QrBlock />
      </span>
      <span className={`text-[16px] font-bold leading-5 ${dark ? "text-white" : "text-[#172B3A]"}`}>{h.title}</span>
      <span className={`text-[12px] leading-4 ${dark ? "text-[#B4BFCA]" : "text-[#4D5E70]"}`}>
        {h.date.split(",")[0]} · {h.venue}
      </span>
    </div>
  );
}

/** A stand-in QR pattern (the real code is drawn by the backend with the event link). */
export function QrBlock({ size = 112 }: { size?: number }) {
  const n = 21;
  const cells: [number, number][] = [];
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      const finder = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
      if (finder) {
        const fx = x > 13 ? x - 14 : x;
        const fy = y > 13 ? y - 14 : y;
        if (fx === 0 || fx === 6 || fy === 0 || fy === 6 || (fx > 1 && fx < 5 && fy > 1 && fy < 5)) cells.push([x, y]);
      } else if ((x * 7 + y * 13 + x * y) % 3 === 0) cells.push([x, y]);
    }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${n} ${n}`} aria-label="QR code" role="img" shapeRendering="crispEdges">
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#172B3A" />
      ))}
    </svg>
  );
}
