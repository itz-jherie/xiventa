"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { AlertIcon, CheckIcon, CloseIcon, InfoIcon, FlagIcon, GridIcon, QrCodeIcon, RepeatIcon, StarIcon, TicketIcon, TrendUpIcon, UserIcon, UsersIcon, VideoIcon } from "@/components/icons";
import { Toggle } from "@/components/checkout/CheckoutParts";
import { Sheet, sheetPrimary, sheetSecondary, useToast } from "@/components/shared/Sheet";
import { DAILY, ORDERS, SOURCES, TICKET_TYPES, WEB_ATTENDEES, WEB_STAFF, getDashEvent, getOrder, orderSlug, type DashEvent } from "@/data/dashboard";
import { HOSTED, naira, updateHost, useHost } from "@/lib/hosting";
import { Card, CardTitle, DashShell, Filters, Foot, H2, LinkTabs, ManageRow, Notice, PageHead, Pager, PillTabs, Stat, Status, Table, WField, btnLink, btnPrimary, btnSecondary } from "./DashParts";

export const evHref = (id: string, sub = "") => `/dashboard/events/${id}${sub ? `/${sub}` : ""}`;
/** The organizer app screen for the same event on phones. */
export const phoneEv = (id: string, sub = "") => (HOSTED.some((h) => h.id === id) ? `/host/event/${id}${sub ? `/${sub}` : ""}` : "/host");

export function useDashEvent(id: string): DashEvent {
  const host = useHost();
  const e = getDashEvent(id)!;
  return host.cancelled.includes(id) ? { ...e, status: "Cancelled", tab: "cancelled" } : e;
}

const TABS = ["Summary", "Details", "Tickets", "Orders", "Attendees", "Check in", "Settings"] as const;
const TAB_PATH: Record<(typeof TABS)[number], string> = { Summary: "", Details: "details", Tickets: "tickets", Orders: "orders", Attendees: "attendees", "Check in": "check-in", Settings: "settings" };

/** Event workspace header: breadcrumb, title, date · venue · status, actions and the tab row. */
export function EventHead({ e, tab, actions }: { e: DashEvent; tab: (typeof TABS)[number]; actions?: React.ReactNode }) {
  const list = e.kind === "listing" ? (["Summary", "Details", "Settings"] as const) : TABS;
  const statusWord = e.kind === "listing" ? "Listing, tickets on Instagram" : e.status;
  return (
    <>
      <PageHead crumbs={[["Events", "/dashboard/events"], [e.title]]} title={e.title} sub={`${e.series ?? e.date} · ${e.venue} · ${statusWord}`} actions={actions} />
      <LinkTabs items={list.map((t) => [t, evHref(e.id, TAB_PATH[t])])} active={tab} />
    </>
  );
}

const preview = (e: DashEvent) => (
  <Link href={e.slug ? `/events/${e.slug}` : "/events"} className={btnSecondary}>
    Preview
  </Link>
);

/* ------------------------------------------------------------------ OW05 Event summary */

export function EventSummary({ id }: { id: string }) {
  const e = useDashEvent(id);
  const router = useRouter();
  const sp = useSearchParams();
  const ended = e.status === "Ended" || sp.get("state") === "ended";
  const cancelled = e.status === "Cancelled";
  const listing = e.kind === "listing";
  const action = ended || cancelled ? (
    <Link href={evHref(id, "duplicate")} className={btnPrimary}>
      Run it again
    </Link>
  ) : (
    <Link href={evHref(id, "details")} className={btnPrimary}>
      Edit event
    </Link>
  );
  const typeStatus = (s: string) => (cancelled ? "Cancelled" : ended ? (s === "Sold out" ? s : "Closed") : s);

  const manage: [React.ReactNode, string, string, string][] = [];
  if (!listing && !cancelled) manage.push([<UsersIcon key="i" size={18} />, "Waitlist", ended ? "Closed when the event ended" : "12 waiting for Regular", evHref(id, "waitlist")]);
  if (!listing && !cancelled) manage.push([<UserIcon key="i" size={18} />, "Requests and guest list", e.join ? "3 requests waiting" : "No requests yet", evHref(id, "guests")]);
  if (!ended && !cancelled) manage.push([<QrCodeIcon key="i" size={18} />, "Promote", "Poster, QR and source links", evHref(id, "promote")]);
  if (!listing) manage.push([<FlagIcon key="i" size={18} />, "Cases", "1 case waiting on you", evHref(id, "cases")]);
  if (!ended && !cancelled) manage.push([<VideoIcon key="i" size={18} />, "Spotlight clip", "In review", evHref(id, "clip")]);
  if (!ended && !cancelled) manage.push([<RepeatIcon key="i" size={18} />, "Series dates", e.series ? "Every Friday · 5 dates" : "One date", evHref(id, "series")]);
  if (!cancelled) manage.push([<StarIcon key="i" size={18} />, "Feedback", "Opens after the event", evHref(id, "feedback")]);
  if (!listing && !ended && !cancelled) manage.push([<TicketIcon key="i" size={18} />, "Promo codes", "Coming later", evHref(id, "promo-codes")]);
  manage.push([<GridIcon key="i" size={18} />, "Duplicate event", "Start a new draft from this one", evHref(id, "duplicate")]);
  if (!ended && !cancelled) manage.push([<CloseIcon key="i" size={18} />, "Cancel event", "Tells everyone with a ticket", evHref(id, "cancel")]);

  return (
    <DashShell phone={phoneEv(id)}>
      <EventHead e={{ ...e, status: ended ? "Ended" : e.status }} tab="Summary" actions={<>{preview(e)}{action}</>} />
      <div className="grid grid-cols-3 gap-4">
        {listing ? (
          <>
            <Stat label="Page views" value="3,240" note="Up 18% vs last week" tone="up" />
            <Stat label="Instagram taps" value="618" note="19% of people who viewed" />
            <Stat label="Saves" value="412" note="Reminded the day before" />
          </>
        ) : cancelled ? (
          <>
            <Stat label="Refunded" value={naira(e.revenue || 2130000)} note={`138 of ${e.sold} refunds done`} tone="up" />
            <Stat label="Ticket holders told" value={String(e.sold)} note="By app, SMS and email" />
            <Stat label="Refunds still processing" value="4" note="Bank delays, usually 1 to 3 days" />
          </>
        ) : (
          <>
            <Stat label="Ticket sales" value={naira(e.revenue)} note={ended ? "Paid out Tue 28 Oct, after refunds" : "Up 18% vs last week"} tone="up" />
            <Stat label="Tickets sold" value={`${e.sold} of ${e.capacity}`} note={ended ? "Sales closed" : "12 people on the waitlist"} />
            <Stat label="Checked in" value={ended ? String(Math.round(e.sold * 0.92)) : "0"} note={ended ? `Of ${e.sold} · ${e.sold - Math.round(e.sold * 0.92)} did not show` : "Doors open 8:30 PM"} />
          </>
        )}
      </div>
      <div className="flex items-start gap-6">
        <section className="flex min-w-0 flex-1 flex-col gap-3">
          {listing ? (
            <Notice
              tone="info"
              title="This event is a listing"
              body="Tickets are sold on your Instagram post. Switch to Xiventa tickets for sales, orders, check in and payouts in one place."
              action="Sell on Xiventa"
              href="/dashboard/events/new"
            />
          ) : (
            <>
              <H2>Sales by ticket type</H2>
              <Table
                head={["Type", "Price", "Sold", "Status"]}
                widths={[0, 160, 140, 140]}
                rows={TICKET_TYPES.map((t) => [t.name, t.short ?? t.price, `${t.sold} / ${t.qty}`, <Status key="s" label={typeStatus(t.status)} />])}
                onRow={ended || cancelled ? undefined : (i) => router.push(evHref(id, `tickets/${TICKET_TYPES[i].id}`))}
              />
              {!ended && !cancelled && (
                <Link href={evHref(id, "analytics")} className={`${btnLink} flex w-fit items-center gap-1`}>
                  <TrendUpIcon size={16} />
                  See analytics
                </Link>
              )}
            </>
          )}
        </section>
        <Card className="w-[400px] shrink-0 !pb-2">
          <CardTitle>Manage</CardTitle>
          {manage.map(([icon, t, s, h]) => (
            <ManageRow key={t} icon={icon} title={t} sub={s} href={h} />
          ))}
        </Card>
      </div>
    </DashShell>
  );
}

/* ------------------------------------------------------------------ OW06 Event details */

export function EventDetails({ id }: { id: string }) {
  const e = useDashEvent(id);
  const { show, node } = useToast();
  const [v, setV] = useState({ name: e.title, cat: "Nightlife and parties", date: "Sat 25 Oct 2026", time: "9 PM to 3 AM", venue: `${e.venue}, Victoria Island`, about: "South Circle takes over the Skyline Lounge rooftop for a night of Afrobeats and amapiano." });
  const [join, setJoin] = useState<"open" | "request" | "invite">(e.join ?? "open");
  const set = (k: keyof typeof v) => (x: string) => setV({ ...v, [k]: x });
  return (
    <DashShell phone={phoneEv(id, "edit")}>
      <EventHead e={e} tab="Details" actions={<>{preview(e)}<button type="button" onClick={() => show(e.sold ? `Saved. ${e.sold} ticket holders are told about big changes.` : "Saved")} className={btnPrimary}>Save changes</button></>} />
      <div className="flex items-start gap-6">
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          {e.sold > 0 && <Notice tone="warn" title={`${e.sold} people have tickets`} body="Changing the date, time or venue tells every ticket holder. They can keep their ticket or ask for a refund." />}
          <Card className="gap-4">
            <H2>Event details</H2>
            <WField label="Event name" value={v.name} onChange={set("name")} />
            <WField label="Category" value={v.cat} onChange={set("cat")} />
            <div className="grid grid-cols-2 gap-4">
              <WField label="Date" value={v.date} onChange={set("date")} />
              <WField label="Starts and ends" value={v.time} onChange={set("time")} />
            </div>
            <WField label="Venue" value={v.venue} onChange={set("venue")} hint="From the place catalogue." />
            <WField label="About" value={v.about} onChange={set("about")} area />
          </Card>
          <Card className="gap-2">
            <H2>Who can join</H2>
            {(
              [
                ["open", "Open to all", "Anyone can get tickets"],
                ["request", "Request to join", "You approve each guest"],
                ["invite", "Invite only", "Only people with your link"],
              ] as const
            ).map(([k, t, s]) => (
              <button key={k} type="button" role="radio" aria-checked={join === k} onClick={() => setJoin(k)} className="flex min-h-14 items-center gap-3 text-left">
                <span className="flex flex-1 flex-col">
                  <span className="text-[14px] text-[#172B3A]">{t}</span>
                  <span className="text-[12px] text-[#68788A]">{s}</span>
                </span>
                <span className={`h-5 w-5 rounded-full ${join === k ? "border-[6px] border-[#E22765]" : "border-[1.5px] border-[#B4BFCA]"}`} />
              </button>
            ))}
          </Card>
        </div>
        <Card className="w-[400px] shrink-0">
          <CardTitle>How it looks</CardTitle>
          <EventMini e={{ ...e, title: v.name }} />
        </Card>
      </div>
      {node}
    </DashShell>
  );
}

export function EventMini({ e, price = "₦15,000" }: { e: DashEvent; price?: string }) {
  return (
    <div className="flex gap-3 rounded-[12px] border border-[#E9EDF1] bg-[#FDFFF0] p-3">
      <span className="relative h-[88px] w-[88px] shrink-0 overflow-hidden rounded-[8px] bg-[#E9EDF1]">{e.image && <Image src={e.image} alt="" fill sizes="88px" className="object-cover" />}</span>
      <span className="flex min-w-0 flex-col gap-1">
        <span className="text-[12px] text-[#C81E57]">{e.date}</span>
        <span className="truncate text-[14px] font-bold text-[#172B3A]">{e.title}</span>
        <span className="text-[12px] text-[#4D5E70]">South Circle</span>
        <span className="text-[14px] font-bold text-[#172B3A]">{price}</span>
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ OW07 Tickets, OW08 Ticket type */

export function EventTickets({ id }: { id: string }) {
  const e = useDashEvent(id);
  const router = useRouter();
  return (
    <DashShell phone={phoneEv(id, "tickets")}>
      <EventHead e={e} tab="Tickets" actions={<Link href={evHref(id, "tickets/new")} className={btnPrimary}>Add ticket type</Link>} />
      <Notice title="12 people are waiting for Regular" body="Add more Regular tickets and we offer them to the waitlist first." action="Open waitlist" href={evHref(id, "waitlist")} />
      <Table
        head={["Type", "Price", "Sold", "Left", "Sales window", "Status", ""]}
        widths={[160, 0, 80, 80, 200, 120, 80]}
        rows={TICKET_TYPES.map((t) => [
          <span key="n" className="text-[#172B3A]">{t.name}</span>,
          t.price,
          String(t.sold),
          String(t.qty - t.sold),
          t.window,
          <Status key="s" label={t.status} />,
          <span key="e" className={btnLink}>Edit</span>,
        ])}
        onRow={(i) => router.push(evHref(id, `tickets/${TICKET_TYPES[i].id}`))}
      />
      <Foot>Drag to reorder how types show to buyers. Types with sales can be paused or hidden, not deleted.</Foot>
    </DashShell>
  );
}

export function TicketType({ id, type }: { id: string; type: string }) {
  const e = useDashEvent(id);
  const router = useRouter();
  const { show, node } = useToast();
  const t = TICKET_TYPES.find((x) => x.id === type);
  const isNew = !t;
  const [kind, setKind] = useState<"Standard" | "Table">(type === "table" ? "Table" : "Standard");
  const [v, setV] = useState({ name: t?.name ?? "", qty: String(t?.qty ?? ""), start: "Mon 6 Oct, 10 AM", end: "Sun 26 Oct, 4 AM", max: "6", desc: t ? "General access to the rooftop" : "" });
  const [names, setNames] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [fee, setFee] = useState<"buyer" | "host">("buyer");
  const set = (k: keyof typeof v) => (x: string) => setV({ ...v, [k]: x });
  const back = evHref(id, "tickets");
  return (
    <DashShell phone={phoneEv(id, "tickets")}>
      <PageHead
        crumbs={[["Events", "/dashboard/events"], [e.title, evHref(id)], ["Tickets", back]]}
        title={isNew ? "New ticket type" : `Edit ${t.name}`}
        sub={e.title}
        actions={
          <>
            <Link href={back} className={btnSecondary}>
              Cancel
            </Link>
            <button
              type="button"
              disabled={!v.name.trim()}
              onClick={() => {
                show("Ticket type saved");
                setTimeout(() => router.push(back), 600);
              }}
              className={btnPrimary}
            >
              Save
            </button>
          </>
        }
      />
      <div className="flex max-w-[760px] flex-col gap-4">
        {t && t.sold > 0 && <Notice tone="warn" title={`${t.sold} sold`} body="Prices already paid stay as they are. You can add a price phase, end one early or lower an upcoming price." />}
        <Card className="gap-4">
          <H2>Ticket type</H2>
          <PillTabs items={[["Standard", "Standard"], ["Table", "Table"]]} value={kind} onChange={setKind} />
          <WField label="Name" value={v.name} onChange={set("name")} />
        </Card>
        <Card className="gap-3">
          <H2>Price</H2>
          {(t?.id === "regular"
            ? [
                ["Early bird", "Ended", "Ended Thu 23 Oct · 100 sold", "₦10,000"],
                ["Regular", "Selling now", "Until Sun 26 Oct, 1 AM · 98 sold", "₦15,000"],
                ["Late", "Next", "From 1 AM until sales close", "₦20,000"],
              ]
            : [[t?.name ?? "Price", t ? "Selling now" : "Set a price", t?.window ?? "Until sales close", t?.short ?? t?.price ?? "₦0"]]
          ).map(([n, s, l, p]) => (
            <div key={n} className="flex items-center gap-3 rounded-[12px] border border-[#E9EDF1] px-4 py-3">
              <span className="flex flex-1 flex-col gap-0.5">
                <span className="flex items-center gap-2 text-[14px] text-[#172B3A]">
                  {n}
                  <Status label={s} tone={s === "Selling now" ? "pink" : "grey"} />
                </span>
                <span className="text-[12px] text-[#68788A]">{l}</span>
              </span>
              <span className="text-[16px] font-bold text-[#172B3A]">{p}</span>
            </div>
          ))}
          <button type="button" onClick={() => show("New price phase added")} className={`${btnLink} w-fit`}>
            Add a price phase
          </button>
          <Foot>Each phase ends on a date and time or after a number sold, whichever comes first. Buyers see today&apos;s price and when it goes up.</Foot>
        </Card>
        <Card className="gap-4">
          <div className="grid grid-cols-2 gap-4">
            <WField label="Quantity" value={v.qty} onChange={set("qty")} />
            <WField label="Max per order" value={v.max} onChange={set("max")} />
            <WField label="Sales start" value={v.start} onChange={set("start")} />
            <WField label="Sales end" value={v.end} onChange={set("end")} />
          </div>
          <WField label="Description" value={v.desc} onChange={set("desc")} />
        </Card>
        <Card className="gap-2">
          <H2>Options</H2>
          {(
            [
              ["Guest names", "Ask for a name on each ticket", names, setNames],
              ["Hide from buyers", "Keep it for links only", hidden, setHidden],
            ] as const
          ).map(([ti, s, on, f]) => (
            <div key={ti} className="flex min-h-14 items-center gap-3">
              <span className="flex flex-1 flex-col">
                <span className="text-[14px] text-[#172B3A]">{ti}</span>
                <span className="text-[12px] text-[#68788A]">{s}</span>
              </span>
              <Toggle on={on} onChange={f} label={ti} />
            </div>
          ))}
          <span className="pt-2 text-[14px] font-bold text-[#172B3A]">Service fee</span>
          {(
            [
              ["buyer", "Buyer pays", "Added at checkout"],
              ["host", "You absorb it", "Taken from your payout"],
            ] as const
          ).map(([k, ti, s]) => (
            <button key={k} type="button" role="radio" aria-checked={fee === k} onClick={() => setFee(k)} className="flex min-h-14 items-center gap-3 text-left">
              <span className="flex flex-1 flex-col">
                <span className="text-[14px] text-[#172B3A]">{ti}</span>
                <span className="text-[12px] text-[#68788A]">{s}</span>
              </span>
              <span className={`h-5 w-5 rounded-full ${fee === k ? "border-[6px] border-[#E22765]" : "border-[1.5px] border-[#B4BFCA]"}`} />
            </button>
          ))}
          <Foot>The fee amount is set by Xiventa and shown before you publish.</Foot>
        </Card>
      </div>
      {node}
    </DashShell>
  );
}

/* ------------------------------------------------------------------ OW09 Orders, OW10 Order detail */

export function EventOrders({ id }: { id: string }) {
  const e = useDashEvent(id);
  const router = useRouter();
  const { show, node } = useToast();
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const host = useHost();
  const list = ORDERS.map((o) => (host.requests[`web-${o.code}`] === "approved" ? { ...o, status: "Refunded" } : o)).filter((o) => !q.trim() || `${o.code} ${o.buyer}`.toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <DashShell phone={phoneEv(id, "attendees")}>
      <EventHead e={e} tab="Orders" actions={<button type="button" onClick={() => show("Orders export is being prepared. We email it to you.")} className={btnSecondary}>Export</button>} />
      <Filters q={q} setQ={setQ} placeholder="Search name, email or order" filters={["Status", "Ticket type"]} />
      <Table
        head={["Order", "Buyer", "Tickets", "Total", "Date", "Status", ""]}
        widths={[120, 0, 160, 120, 130, 150, 80]}
        rows={list.map((o) => [<span key="c" className="text-[#172B3A]">{o.code}</span>, o.buyer, o.tickets, naira(o.total), o.date, <Status key="s" label={o.status} />, <span key="v" className={btnLink}>View</span>])}
        onRow={(i) => router.push(evHref(id, `orders/${orderSlug(list[i].code)}`))}
        empty={<span className="text-[14px] text-[#4D5E70]">No orders match that.</span>}
      />
      <Pager text="Showing 1 to 6 of 118 orders" page={page} setPage={setPage} />
      {node}
    </DashShell>
  );
}

export function OrderDetail({ id, code }: { id: string; code: string }) {
  const e = useDashEvent(id);
  const o = getOrder(code) ?? ORDERS[0];
  const { show, node } = useToast();
  const host = useHost();
  const [part, setPart] = useState(false);
  const [amount, setAmount] = useState("15000");
  const [reason, setReason] = useState("Not let in with a valid ticket");
  const key = `web-${o.code}`;
  const refunded = o.status === "Refunded" || host.requests[key] === "approved";
  const first = o.buyer.split(" ")[0];
  const sum = part ? Number(amount.replace(/\D/g, "")) || 0 : o.total;
  const qty = Number(o.tickets.split("× ")[1] ?? 1);
  const unit: Record<string, number> = { Regular: 15000, VIP: 45000, "Early bird": 10000 };
  const subtotal = (unit[o.tickets.split(" ×")[0]] ?? o.total) * qty;
  const refund = () => {
    updateHost((s) => ({ requests: { ...s.requests, [key]: "approved" } }));
    show(`${naira(sum)} refunded to ${first}`);
  };
  return (
    <DashShell phone={phoneEv(id, "requests")}>
      <PageHead
        crumbs={[["Events", "/dashboard/events"], [e.title, evHref(id)], ["Orders", evHref(id, "orders")]]}
        title={`Order ${o.code}`}
        sub={`${o.buyer} · ${o.date}, 7:42 PM`}
        actions={!refunded && <button type="button" onClick={refund} className={btnPrimary}>Refund</button>}
      />
      <div className="flex items-start gap-6">
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <Card className="gap-3">
            <div className="flex items-center gap-3">
              <span className="relative h-12 w-12 overflow-hidden rounded-[8px] bg-[#E9EDF1]">{e.image && <Image src={e.image} alt="" fill sizes="48px" className="object-cover" />}</span>
              <span className="flex flex-col">
                <span className="text-[14px] text-[#172B3A]">{e.title}</span>
                <span className="text-[12px] text-[#4D5E70]">{e.date}</span>
              </span>
            </div>
            <div className="flex justify-between border-t border-[#E9EDF1] pt-3 text-[14px] text-[#4D5E70]">
              <span>{o.tickets}</span>
              <span>{naira(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[14px] text-[#4D5E70]">
              <span>Service fee</span>
              <span>{naira(o.total - subtotal)}</span>
            </div>
            <div className="flex justify-between border-t border-dashed border-[#B4BFCA] pt-3 text-[16px] font-bold text-[#172B3A]">
              <span>Total</span>
              <span>{naira(o.total)}</span>
            </div>
            <Foot>Refunds follow the host’s refund policy.</Foot>
          </Card>
          <section className="flex flex-col gap-3">
            <H2>Tickets</H2>
            <Table
              head={["Ticket", "Holder", "Status"]}
              widths={[0, 220, 160]}
              rows={Array.from({ length: Math.max(1, qty) }, (_, i) => [`${o.tickets.split(" ×")[0]} · ${i + 1} of ${qty}`, i === 0 ? o.buyer : `${["Tunde", "Kemi", "Ife"][i - 1] ?? "Guest"} ${o.buyer.split(" ")[1]}`, <Status key="s" label={refunded ? "Refunded" : "Valid"} tone={refunded ? "grey" : "green"} />])}
            />
          </section>
          <Card className="gap-1">
            <H2>Payment</H2>
            {[
              ["Status", refunded ? "Refunded" : o.status],
              ["Method", "Card ending 4821"],
              ["Partner reference", "PSK 99812 34"],
            ].map(([k, v]) => (
              <div key={k} className="flex min-h-12 items-center justify-between border-b border-[#E9EDF1] last:border-0">
                <span className="text-[14px] text-[#172B3A]">{k}</span>
                <span className="text-[14px] text-[#4D5E70]">{v}</span>
              </div>
            ))}
          </Card>
        </div>
        <div className="flex w-[400px] shrink-0 flex-col gap-4">
          <Card className="gap-3">
            <H2>Refund</H2>
            {refunded ? (
              <Notice tone="good" title="Refunded" body={`${first} is told and gets the money back through the payment partner.`} />
            ) : (
              <>
                {(
                  [
                    [false, "Full refund", `${naira(o.total)} back to ${first}`],
                    [true, "Part refund", "Choose an amount"],
                  ] as const
                ).map(([k, t, s]) => (
                  <button key={t} type="button" role="radio" aria-checked={part === k} onClick={() => setPart(k)} className="flex min-h-12 items-center gap-3 text-left">
                    <span className="flex flex-1 flex-col">
                      <span className="text-[13px] text-[#172B3A]">{t}</span>
                      <span className="text-[12px] text-[#4D5E70]">{s}</span>
                    </span>
                    <span className={`h-5 w-5 rounded-full ${part === k ? "border-[6px] border-[#E22765]" : "border-[1.5px] border-[#B4BFCA]"}`} />
                  </button>
                ))}
                {part && <WField label="Amount (₦)" value={amount} onChange={setAmount} />}
                <WField label={`Reason (${first} sees this)`} value={reason} onChange={setReason} hint="Comes out of your next payout." />
                <button type="button" disabled={sum <= 0 || sum > o.total} onClick={refund} className={`${btnPrimary} h-[52px] w-full`}>
                  Refund {naira(sum)}
                </button>
              </>
            )}
          </Card>
          <Notice title="Within your refund policy" body="Refunds follow the policy you set. Xiventa may step in on open cases." />
        </div>
      </div>
      {node}
    </DashShell>
  );
}

/* ------------------------------------------------------------------ OW11 Attendees, OW12 Check in */

export function EventAttendees({ id }: { id: string }) {
  const e = useDashEvent(id);
  const router = useRouter();
  const { show, node } = useToast();
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const list = WEB_ATTENDEES.filter((a) => !q.trim() || `${a.name} ${a.order}`.toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <DashShell phone={phoneEv(id, "attendees")}>
      <EventHead e={e} tab="Attendees" actions={<button type="button" onClick={() => show("Guest list export is being prepared")} className={btnSecondary}>Export list</button>} />
      <Filters q={q} setQ={setQ} placeholder="Search name or order" filters={["Ticket type", "Check in"]} />
      <Table
        head={["Name", "Ticket", "Order", "Check in", ""]}
        widths={[0, 180, 140, 180, 90]}
        rows={list.map((a) => [<span key="n" className="text-[#172B3A]">{a.name}</span>, a.ticket, a.order, <Status key="s" label={a.status} />, <span key="o" className={btnLink}>Order</span>])}
        onRow={(i) => router.push(evHref(id, `orders/${orderSlug(list[i].order)}`))}
        empty={<span className="text-[14px] text-[#4D5E70]">No one matches that.</span>}
      />
      <Foot>Exports include names, ticket types and check in status only. Phone numbers and emails stay private.</Foot>
      <Pager text="Showing 1 to 5 of 142 attendees" page={page} setPage={setPage} />
      {node}
    </DashShell>
  );
}

export function EventCheckIn({ id }: { id: string }) {
  const e = useDashEvent(id);
  const { show, node } = useToast();
  const [staff, setStaff] = useState(WEB_STAFF);
  const [invite, setInvite] = useState(false);
  const [phone, setPhone] = useState("");
  const [gate, setGate] = useState("");
  return (
    <DashShell phone={phoneEv(id, "staff")}>
      <EventHead e={e} tab="Check in" actions={<button type="button" onClick={() => setInvite(true)} className={btnPrimary}>Invite staff</button>} />
      <div className="grid grid-cols-3 gap-4">
        <Stat label="Checked in" value="64" note={`Of ${e.sold} tickets`} />
        <Stat label="Gate A" value="38" note="Dayo Ade" />
        <Stat label="Gate B" value="26" note="Seyi Martins" />
      </div>
      <div className="flex items-start gap-6">
        <section className="flex min-w-0 flex-1 flex-col gap-3">
          <H2>Check in staff</H2>
          <Table
            head={["Name", "Phone", "Gate", "Status", ""]}
            widths={[0, 160, 110, 140, 90]}
            rows={staff.map((s, i) => [
              <span key="n" className="text-[#172B3A]">{s.name}</span>,
              s.phone,
              s.gate,
              <Status key="s" label={s.status} tone={s.status === "Active" ? "green" : "grey"} />,
              <button
                key="a"
                type="button"
                onClick={() => {
                  if (s.status === "Active") {
                    setStaff(staff.filter((_, j) => j !== i));
                    show(`${s.name} removed`);
                  } else show("Invite sent again");
                }}
                className={btnLink}
              >
                {s.status === "Active" ? "Remove" : "Resend"}
              </button>,
            ])}
          />
        </section>
        <Card className="w-[400px] shrink-0 gap-3">
          <CardTitle>How check in works</CardTitle>
          {[
            ["Staff use the Xiventa app", "They accept the invite and open the scanner"],
            ["Works offline", "Scans save and sync when the network is back"],
            ["Staff never see money", "Only names and ticket types"],
          ].map(([t, s]) => (
            <div key={t} className="flex flex-col gap-0.5">
              <span className="text-[14px] text-[#172B3A]">{t}</span>
              <span className="text-[12px] text-[#68788A]">{s}</span>
            </div>
          ))}
        </Card>
      </div>
      <DialogForm
        open={invite}
        onClose={() => setInvite(false)}
        title="Invite staff"
        action="Send invite"
        disabled={phone.replace(/\D/g, "").length < 10}
        onSubmit={() => {
          setStaff([...staff, { name: "New staff", phone, gate: gate || "Any gate", status: "Invite sent" }]);
          setInvite(false);
          setPhone("");
          setGate("");
          show("Invite sent");
        }}
      >
        <WField label="Phone number" value={phone} onChange={setPhone} hint="We send them a link to join as staff." />
        <WField label="Gate or note (optional)" value={gate} onChange={setGate} />
      </DialogForm>
      {node}
    </DashShell>
  );
}

/* ------------------------------------------------------------------ OW Event settings */

export function EventSettings({ id }: { id: string }) {
  const e = useDashEvent(id);
  const { show, node } = useToast();
  const [join, setJoin] = useState<"open" | "request" | "invite">(e.join ?? "open");
  const [link, setLink] = useState(`xiventa.com/e/${(e.slug ?? e.id).replace(/-/g, "")}`);
  const [hidden, setHidden] = useState(true);
  const live = e.status !== "Cancelled" && e.status !== "Ended";
  return (
    <DashShell phone={phoneEv(id)}>
      <EventHead e={e} tab="Settings" actions={<>{preview(e)}<Link href={evHref(id, "details")} className={btnPrimary}>Edit event</Link></>} />
      <Card className="gap-1">
        <H2>Who can join</H2>
        {(
          [
            ["open", "Open to all", "Anyone can get tickets"],
            ["request", "Request to join", "You approve each guest"],
            ["invite", "Invite only", "Only people with your link"],
          ] as const
        ).map(([k, t, s]) => (
          <button
            key={k}
            type="button"
            role="radio"
            aria-checked={join === k}
            onClick={() => {
              setJoin(k);
              show(`Saved: ${t.toLowerCase()}`);
            }}
            className="flex min-h-14 items-center gap-3 text-left"
          >
            <span className="flex flex-1 flex-col">
              <span className="text-[13px] text-[#172B3A]">{t}</span>
              <span className="text-[12px] text-[#68788A]">{s}</span>
            </span>
            <span className={`h-5 w-5 rounded-full ${join === k ? "border-[6px] border-[#E22765]" : "border-[1.5px] border-[#B4BFCA]"}`} />
          </button>
        ))}
      </Card>
      <Card className="gap-3">
        <H2>Visibility</H2>
        <WField label="Event link" value={link} onChange={setLink} hint="Changing the link breaks links you already shared." />
        <div className="flex min-h-14 items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F4F6F8]">
            <InfoIcon size={18} />
          </span>
          <span className="flex flex-1 flex-col">
            <span className="text-[14px] text-[#172B3A]">Hide from search and Home</span>
            <span className="text-[12px] text-[#68788A]">Only people with the link can find it</span>
          </span>
          <Toggle on={hidden} onChange={setHidden} label="Hide from search and Home" />
        </div>
      </Card>
      <Card className="!pb-2">
        <CardTitle>More actions</CardTitle>
        <ManageRow icon={<GridIcon size={18} />} title="Duplicate event" sub="Start a new draft from this one" href={evHref(id, "duplicate")} />
        {live && <ManageRow icon={<InfoIcon size={18} />} title="Unpublish" sub="Hide it while you make changes. Only possible before any sales." onClick={() => show(e.sold ? "This event has sales, so it can't be unpublished. Cancel it instead." : "Unpublished. Only you can see it.")} />}
        {live && <ManageRow icon={<AlertIcon size={18} />} title="Cancel event" sub="Tells everyone with a ticket and starts refunds" href={evHref(id, "cancel")} />}
      </Card>
      {node}
    </DashShell>
  );
}

/* ------------------------------------------------------------------ OW13 Analytics */

export function EventAnalytics({ id }: { id: string }) {
  const e = useDashEvent(id);
  const { show, node } = useToast();
  const [range, setRange] = useState<"7" | "30" | "all">("30");
  const days = range === "7" ? DAILY.slice(-7) : DAILY;
  const max = Math.max(...days);
  return (
    <DashShell phone={phoneEv(id)}>
      <PageHead crumbs={[["Events", "/dashboard/events"], [e.title, evHref(id)]]} title={`Analytics: ${e.title}`} sub={`${e.date} · ${e.venue} · ${e.status}`} actions={<button type="button" onClick={() => show("Report export is being prepared")} className={btnSecondary}>Export</button>} />
      <PillTabs items={[["7", "Last 7 days"], ["30", "Last 30 days"], ["all", "All time"]]} value={range} onChange={setRange} />
      <div className="grid grid-cols-3 gap-4">
        <Stat label="Tickets sold" value={String(e.sold)} note="Up 24 this week" tone="up" />
        <Stat label="Page views" value="3,410" note="Up 12%" tone="up" />
        <Stat label="View to buy" value="4.2%" note="Down 0.3 points" tone="down" />
      </div>
      <Card className="gap-4">
        <H2>Tickets sold per day</H2>
        <div className="flex h-[180px] items-end gap-3" role="img" aria-label={`Tickets sold per day, ${days.length} days, highest ${max}`}>
          {days.map((d, i) => (
            <span key={i} title={`${d} tickets`} className="flex-1 rounded-t-[6px] bg-[#E22765]" style={{ height: `${(d / max) * 100}%` }} />
          ))}
        </div>
        <div className="flex justify-between text-[12px] text-[#4D5E70]">
          <span>{range === "7" ? "Mon 13 Oct" : "Mon 6 Oct"}</span>
          <span>Sun 19 Oct</span>
        </div>
      </Card>
      <H2>Where buyers came from</H2>
      <Table head={["Source", "Visits", "Tickets", "Sales"]} widths={[0, 160, 160, 160]} rows={SOURCES.map((s) => [s.source, s.visits, String(s.tickets), <span key="v" className="text-[#172B3A]">{s.sales}</span>])} />
      {node}
    </DashShell>
  );
}

/* ------------------------------------------------------------------ OW15 Cancel, OW16 Duplicate */

export function CancelEventWeb({ id }: { id: string }) {
  const e = useDashEvent(id);
  const router = useRouter();
  const [msg, setMsg] = useState("So sorry, the venue flooded. A new date is coming soon.");
  return (
    <DashShell phone={phoneEv(id, "cancel")}>
      <PageHead
        crumbs={[["Events", "/dashboard/events"], [e.title, evHref(id)]]}
        title={`Cancel ${e.title}?`}
        sub="This cannot be undone. Everyone with a ticket is told straight away."
        actions={
          <>
            <Link href={evHref(id)} className={btnSecondary}>
              Keep event
            </Link>
            <button
              type="button"
              onClick={() => {
                updateHost((s) => ({ cancelled: [...new Set([...s.cancelled, id])] }));
                router.push(evHref(id));
              }}
              className={btnPrimary}
            >
              Cancel event
            </button>
          </>
        }
      />
      <div className="flex max-w-[760px] flex-col gap-4">
        <Card className="gap-1">
          <H2>What happens</H2>
          {[
            ["Ticket holders told", String(e.sold)],
            ["Refunds", naira(e.revenue)],
            ["From your balance", naira(e.revenue)],
            ["Waitlist told", "12"],
          ].map(([k, v]) => (
            <div key={k} className="flex min-h-12 items-center justify-between border-b border-[#E9EDF1] last:border-0">
              <span className="text-[14px] text-[#172B3A]">{k}</span>
              <span className="text-[14px] font-bold text-[#172B3A]">{v}</span>
            </div>
          ))}
        </Card>
        <Card>
          <WField label="Message to guests" value={msg} onChange={setMsg} area hint="Sent with the cancellation email and push." />
        </Card>
        <Notice tone="warn" title="A payout was already made" body="₦890,000 was paid out on Fri 17 Oct. Refunds above your held balance are taken from your next payouts." />
      </div>
    </DashShell>
  );
}

export function DuplicateWeb({ id }: { id: string }) {
  const e = useDashEvent(id);
  const router = useRouter();
  const opts: [string, string][] = [
    ["Details and media", "Name, about, poster, Spotlight clip"],
    ["Ticket types and prices", "Quantities reset"],
    ["Location and access", `${e.venue}, open to all`],
    ["Good to know", "Dress code, parking, security"],
    ["Check in staff", "Invites go out again"],
  ];
  const [on, setOn] = useState(opts.map((o) => o[0]));
  return (
    <DashShell phone={phoneEv(id)}>
      <PageHead
        crumbs={[["Events", "/dashboard/events"], [e.title, evHref(id)]]}
        title={`Duplicate ${e.title}`}
        sub="We copy it into a new draft. Dates and sales start fresh."
        actions={
          <>
            <Link href={evHref(id)} className={btnSecondary}>
              Cancel
            </Link>
            <button type="button" onClick={() => router.push("/dashboard/events/new")} className={btnPrimary}>
              Duplicate
            </button>
          </>
        }
      />
      <Card className="max-w-[760px] gap-1">
        <H2>What to copy</H2>
        {opts.map(([t, s]) => {
          const c = on.includes(t);
          return (
            <div key={t} className="flex min-h-14 items-center gap-3">
              <span className="flex flex-1 flex-col">
                <span className="text-[14px] text-[#172B3A]">{t}</span>
                <span className="text-[12px] text-[#68788A]">{s}</span>
              </span>
              <Toggle on={c} onChange={() => setOn(c ? on.filter((x) => x !== t) : [...on, t])} label={t} />
            </div>
          );
        })}
      </Card>
    </DashShell>
  );
}

/* ------------------------------------------------------------------ OW14 Publish */

export function PublishWeb({ id }: { id: string }) {
  const e = useDashEvent(id);
  const router = useRouter();
  return (
    <DashShell phone="/create/review">
      <PageHead
        crumbs={[["Events", "/dashboard/events"], [e.title]]}
        title="Ready to publish?"
        sub={e.title}
        actions={
          <>
            {preview(e)}
            <button type="button" onClick={() => router.push("/create/published")} className={btnPrimary}>
              Publish
            </button>
          </>
        }
      />
      <div className="flex items-start gap-6">
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <Card className="!pb-2">
            <CardTitle>Checklist</CardTitle>
            {(
              [
                [true, "Event basics", "Sat 1 Nov, 3 PM to 11 PM", ""],
                [true, "Location and access", "Harbour Beach, Lekki · Open to all", ""],
                [true, "Media", "Poster added", ""],
                [false, "Payout account", "Payout account name does not match", "/dashboard/settings/payout"],
                [true, "Tickets", "3 types", ""],
                [false, "Spotlight clip", "Events with a clip get seen in Spotlight", "/create/clip"],
              ] as const
            ).map(([d, t, s, h]) => (
              <div key={t} className="flex min-h-[56px] items-center gap-3">
                <span className={`flex h-8 w-8 items-center justify-center rounded-full ${d ? "bg-[#E3F8EF] text-[#067647]" : t === "Payout account" ? "bg-[#FFECEB] text-[#C0231A]" : "bg-[#E6F1FF] text-[#0059BE]"}`}>{d ? <CheckIcon size={16} /> : t === "Payout account" ? <AlertIcon size={16} /> : <InfoIcon size={16} />}</span>
                <span className="flex flex-1 flex-col">
                  <span className="text-[14px] text-[#172B3A]">{t}</span>
                  <span className={`text-[12px] ${t === "Payout account" ? "text-[#C0231A]" : "text-[#68788A]"}`}>{s}</span>
                </span>
                {h && (
                  <Link href={h} className={btnLink}>
                    {t === "Payout account" ? "Fix" : "Add"}
                  </Link>
                )}
              </div>
            ))}
          </Card>
          <Notice tone="alert" title="1 thing to fix for payouts" body="You can still publish. Ticket money waits in your wallet until the account name matches." action="Fix payout account" href="/dashboard/settings/payout" />
        </div>
        <Card className="w-[400px] shrink-0">
          <CardTitle>Preview</CardTitle>
          <EventMini e={e} price="₦12,000" />
        </Card>
      </div>
    </DashShell>
  );
}

/* ------------------------------------------------------------------ dialog with a form */


export function DialogForm({ open, onClose, title, action, onSubmit, disabled, children }: { open: boolean; onClose: () => void; title: string; action: string; onSubmit: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <button type="button" onClick={onClose} className={sheetSecondary}>
            Cancel
          </button>
          <button type="button" disabled={disabled} onClick={onSubmit} className={sheetPrimary}>
            {action}
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-4">{children}</div>
    </Sheet>
  );
}
