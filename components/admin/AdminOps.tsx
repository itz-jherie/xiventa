"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/shared/Sheet";
import { EventMini } from "@/components/dashboard/DashEvent";
import { Card, CardTitle, Filters, Foot, H2, ImageDrop, LinkTabs, Notice, PageHead, Pager, PillTabs, Stat, Status, StepRow, Table, WField, btnLink, btnPrimary, btnSecondary } from "@/components/dashboard/DashParts";
import { DASH_EVENTS } from "@/data/dashboard";
import { ADMIN_EVENTS, ADMIN_ORDERS, ADMIN_PLACES, CATEGORY_SALES, EV_TABS, EXCEPTIONS, KPIS, PAYMENTS, PLACE_CHANGES, PLACE_TABS, REFUNDS, SCANS, SETTLEMENTS, getAdminEvent, type EvTab, type PlaceTab } from "@/data/admin";
import { decide, useAdmin } from "@/lib/admin";
import { AdminShell, FINANCE_TABS, Rows, SectionHead } from "./AdminParts";
import { RestrictDialog } from "./AdminPeople";

const PAGER = (n: string, page: number, setPage: (n: number) => void) => <Pager text={n} page={page} setPage={setPage} />;

/* ------------------------------------------------------------------ AW08 Events */

const EV_TAB_LIST: [EvTab, string][] = [
  ["all", "All"],
  ["review", "In review 9"],
  ["reported", "Reported 3"],
  ["live", "Live now 12"],
  ["cancelled", "Cancelled"],
];

export function AdminEvents() {
  const router = useRouter();
  const sp = useSearchParams();
  const admin = useAdmin();
  const tab = (EV_TAB_LIST.find(([t]) => t === sp.get("tab"))?.[0] ?? "review") as EvTab;
  const [q, setQ] = useState(sp.get("q") ?? "");
  const [page, setPage] = useState(1);
  const list = EV_TABS[tab].map((id) => getAdminEvent(id)!).filter((e) => !q.trim() || `${e.title} ${e.host}`.toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <AdminShell>
      <PageHead title="Events" sub="Lagos" />
      <LinkTabs items={EV_TAB_LIST.map(([t, l]) => [l, `/admin/events?tab=${t}`])} active={EV_TAB_LIST.find(([t]) => t === tab)![1]} />
      <Filters q={q} setQ={setQ} placeholder="Search event or host" filters={["Category", "Date"]} />
      <Table
        head={["Event", "Host", "Date", "Reason", "Status", ""]}
        widths={[0, 170, 140, 220, 130, 90]}
        rows={list.map((e) => {
          const s = admin?.decisions[`event-${e.id}`] ?? e.status;
          return [<span key="t" className="text-[#172B3A]">{e.title}</span>, e.host, e.date, tab === "reported" ? (e.reported ?? e.reason) : e.reason, <Status key="s" label={s} />, <span key="o" className={btnLink}>{["In review", "Reported"].includes(s) ? "Review" : "Open"}</span>];
        })}
        onRow={(i) => router.push(`/admin/events/${list[i].id}`)}
        empty={<span className="text-[14px] text-[#4D5E70]">No events here.</span>}
      />
      {PAGER(`Showing 1 to ${list.length} of ${tab === "review" ? 9 : tab === "reported" ? 3 : tab === "live" ? 12 : list.length}`, page, setPage)}
    </AdminShell>
  );
}

/* ------------------------------------------------------------------ AW09 Event detail */

export function AdminEvent({ id }: { id: string }) {
  const e = getAdminEvent(id) ?? ADMIN_EVENTS[1];
  const router = useRouter();
  const admin = useAdmin();
  const sp = useSearchParams();
  const [restrict, setRestrict] = useState(false);
  const [reason, setReason] = useState("The poster shows a brand you may not have rights to.");
  const status = admin?.decisions[`event-${e.id}`] ?? e.status;
  const pending = status === "In review" || status === "Reported";
  const tab = sp.get("tab") ?? "overview";
  const tabs: [string, string][] = ["Overview", "Orders", "Check in", "Reports", "History"].map((t) => [t, t === "Check in" ? `/admin/events/${e.id}/check-in` : `/admin/events/${e.id}${t === "Overview" ? "" : `?tab=${t.toLowerCase()}`}`]);
  const active = tabs.find(([t]) => t.toLowerCase() === tab)?.[0] ?? "Overview";
  const dash = DASH_EVENTS.find((d) => d.id === e.id) ?? DASH_EVENTS.find((d) => d.id === "day-party")!;
  return (
    <AdminShell>
      <PageHead
        crumbs={[["Events", "/admin/events"], [pending ? "In review" : status]]}
        title={e.title}
        sub={`${e.host} · ${e.date} · ${dash.venue}`}
        actions={
          pending ? (
            <>
              <button type="button" onClick={() => setRestrict(true)} className={btnSecondary}>
                Restrict or remove
              </button>
              <button
                type="button"
                onClick={() => {
                  decide(`event-${e.id}`, "Published", "Approved event", `Event: ${e.title}`);
                  setTimeout(() => router.push("/admin/events"), 500);
                }}
                className={btnPrimary}
              >
                Approve
              </button>
            </>
          ) : (
            <>
              <Status label={status} />
              {status !== "Cancelled" && (
                <button type="button" onClick={() => setRestrict(true)} className={btnSecondary}>
                  Restrict or remove
                </button>
              )}
            </>
          )
        }
      />
      <LinkTabs items={tabs} active={active} />
      {active === "Orders" ? (
        <Table head={["Order", "Buyer", "Total", "Status"]} widths={[120, 0, 140, 160]} rows={ADMIN_ORDERS.map((o) => [o.code, o.buyer, o.total, <Status key="s" label={o.status} />])} onRow={(i) => router.push(`/admin/orders/${ADMIN_ORDERS[i].code.replace(" ", "").toLowerCase()}`)} />
      ) : active === "Reports" ? (
        <Table head={["Reason", "Reports", "From"]} widths={[0, 120, 200]} rows={e.status === "Reported" ? [[e.reported ?? e.reason, "4", "Guests"]] : [["No reports", "0", "—"]]} />
      ) : active === "History" ? (
        <Table head={["Time", "Change", "By"]} widths={[200, 0, 180]} rows={[["Sun 19 Oct, 2:10 PM", "Submitted for review", e.host], ...(admin?.decisions[`event-${e.id}`] ? [["Just now", admin.decisions[`event-${e.id}`], admin.name]] : [])]} />
      ) : (
        <div className="flex items-start gap-6">
          <Card className="min-w-0 flex-1 gap-3">
            <H2>What guests will see</H2>
            <EventMini e={{ ...dash, title: e.title, date: e.date }} price="₦12,000" />
            <p className="text-[14px] leading-5 text-[#4D5E70]">A beach day party with three DJs, food stalls and a sunset set. 18 and over.</p>
          </Card>
          <div className="flex w-[400px] shrink-0 flex-col gap-4">
            <Card className="!pb-2">
              <CardTitle>Review</CardTitle>
              <StepRow done={false} title="Host" sub={`${e.host === "Sun Club" ? "Bisi Ade · selfie check in review. Shows as Bisi Ade until Sun Club passes its check" : e.host}`} href={e.host === "Sun Club" ? "/admin/organizers/review/sun-club" : "/admin/organizers"} action="Open" />
              <StepRow done title="Content rules" sub="Pass" />
              <StepRow done title="Venue" sub="Known place" />
              <StepRow done title="Tickets" sub="3 types, ₦12,000 to ₦60,000" />
            </Card>
            {pending && <WField label="Reason (sent to the host if restricted)" value={reason} onChange={setReason} />}
          </div>
        </div>
      )}
      <RestrictDialog open={restrict} onClose={() => setRestrict(false)} id={`event-${e.id}`} record={`Event: ${e.title}`} what="event" />
    </AdminShell>
  );
}

/* ------------------------------------------------------------------ AW23 Check in investigation */

export function CheckInInvestigation({ id }: { id: string }) {
  const e = getAdminEvent(id) ?? ADMIN_EVENTS[4];
  const { show, node } = useToast();
  return (
    <AdminShell>
      <PageHead crumbs={[["Events", "/admin/events"], [e.title, `/admin/events/${e.id}`], ["Check in"]]} title="Check in records" sub={`${e.title} · Ticket XV 7TGT 01`} actions={<button type="button" onClick={() => show("Scan records exported")} className={btnSecondary}>Export</button>} />
      <Notice tone="warn" title="Duplicate scan found" body="This ticket was scanned twice, 3 minutes apart, at two gates." />
      <Table head={["Time", "Gate", "Staff", "Device", "Sync", "Result"]} widths={[110, 100, 150, 160, 0, 150]} rows={SCANS.map((r) => [...r.slice(0, 5), <Status key="s" label={r[5]} tone={r[5] === "Valid" ? "green" : "red"} />])} />
      <Foot>Scans saved offline are checked again when they sync. The first valid scan wins.</Foot>
      {node}
    </AdminShell>
  );
}

/* ------------------------------------------------------------------ AW10 Places, AW11 Place editor */

const PLACE_TAB_LIST: [PlaceTab, string][] = [
  ["all", "All"],
  ["unclaimed", "Unclaimed"],
  ["owner", "Owner managed"],
  ["changes", "Changes in review 5"],
];

export function AdminPlaces() {
  const router = useRouter();
  const sp = useSearchParams();
  const admin = useAdmin();
  const tab = (PLACE_TAB_LIST.find(([t]) => t === sp.get("tab"))?.[0] ?? "all") as PlaceTab;
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const list = PLACE_TABS[tab].map((id) => ADMIN_PLACES.find((p) => p.id === id)!).filter((p) => !q.trim() || `${p.name} ${p.area}`.toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <AdminShell>
      <PageHead title="Places" sub="1,204 places in Lagos" actions={<Link href="/admin/places/new" className={btnPrimary}>Add place</Link>} />
      <LinkTabs items={PLACE_TAB_LIST.map(([t, l]) => [l, `/admin/places?tab=${t}`])} active={PLACE_TAB_LIST.find(([t]) => t === tab)![1]} />
      <Filters q={q} setQ={setQ} placeholder="Search place or area" filters={["Category", "Area"]} />
      {tab === "changes" ? (
        <Table
          head={["Place", "Area", "Change", "Managed by", "Status", ""]}
          widths={[0, 150, 260, 120, 130, 90]}
          rows={PLACE_CHANGES.map((c) => {
            const d = admin?.decisions[`change-${c.id}`];
            return [
              <span key="n" className="text-[#172B3A]">{c.name}</span>,
              c.area,
              c.change,
              c.by,
              <Status key="s" label={d ?? "In review"} />,
              d ? (
                " "
              ) : (
                <button key="r" type="button" onClick={() => decide(`change-${c.id}`, "Approved", `Approved place change: ${c.change}`, `Place: ${c.name}`)} className={btnLink}>
                  Approve
                </button>
              ),
            ];
          })}
        />
      ) : (
        <Table
          head={["Place", "Area", "Category", "Managed by", "Status", ""]}
          widths={[0, 150, 170, 120, 130, 80]}
          rows={list.map((p) => [<span key="n" className="text-[#172B3A]">{p.name}</span>, p.area, p.cat, p.by, <Status key="s" label={admin?.decisions[`place-${p.id}`] ?? p.status} />, <span key="e" className={btnLink}>Edit</span>])}
          onRow={(i) => router.push(`/admin/places/${list[i].id}`)}
          empty={<span className="text-[14px] text-[#4D5E70]">No places here.</span>}
        />
      )}
      {PAGER("Showing 1 to 4 of 1,204", page, setPage)}
    </AdminShell>
  );
}

export function PlaceEditor({ id }: { id: string }) {
  const p = ADMIN_PLACES.find((x) => x.id === id);
  const fresh = !p;
  const admin = useAdmin();
  const { show, node } = useToast();
  const [v, setV] = useState({
    name: p?.name ?? "",
    cat: p?.cat ?? "",
    addr: p ? (p.id === "kiln-coffee" ? "Herbert Macaulay Way, Yaba" : `${p.area}, Lagos`) : "",
    area: p?.area ?? "",
    phone: p ? "0803 000 0300" : "",
    about: p?.id === "kiln-coffee" ? "Small batch coffee, pastries and quiet tables for work." : "",
  });
  const set = (k: keyof typeof v) => (x: string) => setV({ ...v, [k]: x });
  const key = `place-${p?.id ?? "new"}`;
  const status = admin?.decisions[key] ?? p?.status ?? "Draft";
  return (
    <AdminShell>
      <PageHead
        crumbs={[["Places", "/admin/places"], [v.name || "New place"]]}
        title={v.name || "New place"}
        sub={`${status} · Managed by ${p?.by ?? "Xiventa"}`}
        actions={
          <>
            {status === "Published" && (
              <button type="button" onClick={() => decide(key, "Draft", "Unpublished place", `Place: ${v.name}`)} className={btnSecondary}>
                Unpublish
              </button>
            )}
            <button
              type="button"
              disabled={!v.name.trim() || !v.addr.trim()}
              onClick={() => {
                decide(key, "Published", fresh ? "Added place" : "Published place", `Place: ${v.name}`);
                show("Published");
              }}
              className={btnPrimary}
            >
              {status === "Published" ? "Save" : "Publish"}
            </button>
          </>
        }
      />
      <div className="flex items-start gap-6">
        <Card className="min-w-0 flex-1 gap-4">
          <div className="grid grid-cols-2 gap-4">
            <WField label="Name" value={v.name} onChange={set("name")} />
            <WField label="Category" value={v.cat} onChange={set("cat")} />
            <WField label="Address" value={v.addr} onChange={set("addr")} hint="Pin is checked on the map." />
            <WField label="Area" value={v.area} onChange={set("area")} />
          </div>
          <WField label="Phone" value={v.phone} onChange={set("phone")} />
          <WField label="About" value={v.about} onChange={set("about")} area />
          <span className="text-[13px] text-[#172B3A]">Photos</span>
          <ImageDrop hint="JPG or PNG, at least 1080 px wide. Square or 4:5 works best on cards." onChange={() => show("Photo picker opens here")} />
        </Card>
        <div className="flex w-[380px] shrink-0 flex-col gap-4">
          <Card className="!pb-2">
            <CardTitle>Opening hours</CardTitle>
            <Rows rows={[["Monday to Friday", "7 AM to 7 PM"], ["Saturday", "8 AM to 6 PM"], ["Sunday", "Closed"]]} />
          </Card>
          {p?.by !== "Owner" && <Notice title="Unclaimed" body="Owners can claim this place from the host dashboard. Claims arrive in the place claims queue." />}
        </div>
      </div>
      {node}
    </AdminShell>
  );
}

/* ------------------------------------------------------------------ AW12 Orders, AW13 Order detail */

export function AdminOrders() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const list = ADMIN_ORDERS.filter((o) => !q.trim() || `${o.code} ${o.buyer} ${o.event}`.toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <AdminShell>
      <PageHead title="Tickets and orders" />
      <Filters q={q} setQ={setQ} placeholder="Search order, ticket code, phone or email" filters={["Status", "Date"]} />
      <Table
        head={["Order", "Buyer", "Event", "Total", "Date", "Status", ""]}
        widths={[110, 170, 0, 120, 130, 150, 80]}
        rows={list.map((o) => [<span key="c" className="text-[#172B3A]">{o.code}</span>, o.buyer, o.event, o.total, o.date, <Status key="s" label={o.status} />, <span key="o" className={btnLink}>Open</span>])}
        onRow={(i) => router.push(`/admin/orders/${list[i].code.replace(" ", "").toLowerCase()}`)}
        empty={<span className="text-[14px] text-[#4D5E70]">No orders match that.</span>}
      />
      {PAGER("Showing 1 to 4 of 52,118", page, setPage)}
    </AdminShell>
  );
}

export function AdminOrder({ code }: { code: string }) {
  const o = ADMIN_ORDERS.find((x) => x.code.replace(" ", "").toLowerCase() === code) ?? ADMIN_ORDERS[0];
  const admin = useAdmin();
  const { show, node } = useToast();
  const d = admin?.decisions[`order-${o.code}`];
  const sp = useSearchParams();
  const tab = sp.get("tab") ?? "overview";
  const tabs: [string, string][] = ["Overview", "Payment", "Check in", "History"].map((t) => [t, `/admin/orders/${code}${t === "Overview" ? "" : `?tab=${t.toLowerCase().replace(" ", "-")}`}`]);
  const active = tabs.find(([t]) => t.toLowerCase().replace(" ", "-") === tab)?.[0] ?? "Overview";
  return (
    <AdminShell>
      <PageHead
        crumbs={[["Tickets and orders", "/admin/orders"], [o.code]]}
        title={`Order ${o.code}`}
        sub={`${o.buyer} · ${o.event} · ${o.date}, 7:42 PM`}
        actions={
          d ? (
            <Status label={d} />
          ) : (
            <>
              <button type="button" onClick={() => decide(`order-${o.code}`, "Cancelled", "Cancelled tickets", `Order ${o.code}`)} className={btnSecondary}>
                Cancel tickets
              </button>
              <button
                type="button"
                onClick={() => {
                  decide(`order-${o.code}`, "Refunded", `Refunded ${o.total}`, `Order ${o.code}`);
                  show(`${o.total} refunded to ${o.buyer.split(" ")[0]}`);
                }}
                className={btnPrimary}
              >
                Refund
              </button>
            </>
          )
        }
      />
      <LinkTabs items={tabs} active={active} />
      <div className="flex items-start gap-6">
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          {active === "History" ? (
            <Table head={["Time", "Change", "By"]} widths={[200, 0, 180]} rows={[["Mon 20 Oct, 7:42 PM", "Paid by card", o.buyer], ["Mon 20 Oct, 7:42 PM", "2 tickets sent", "System"], ...(d ? [["Just now", d, admin!.name]] : [])]} />
          ) : (
            <>
              {(active === "Overview" || active === "Payment") && (
                <Card className="gap-2">
                  <span className="text-[14px] text-[#172B3A]">{o.event}</span>
                  <span className="text-[12px] text-[#4D5E70]">Sat 25 Oct · 9:00 PM</span>
                  <Rows rows={[["Regular × 2", "₦30,000"], ["Service fee", "₦1,500"], ["Total", <b key="t" className="text-[#172B3A]">{o.total}</b>]]} />
                  <Foot>Refunds follow the host’s refund policy.</Foot>
                </Card>
              )}
              {(active === "Overview" || active === "Check in") && (
                <>
                  <H2>Tickets</H2>
                  <Table head={["Ticket", "Holder", "Check in"]} widths={[0, 200, 160]} rows={[["Regular · XV 7TGT 01", o.buyer, "Not yet"], ["Regular · XV 7TGT 02", "Tunde Okafor", "Not yet"]]} />
                  <Link href="/admin/events/abnormal-nightout/check-in" className={`${btnLink} w-fit`}>
                    Scan records
                  </Link>
                </>
              )}
            </>
          )}
        </div>
        <div className="flex w-[400px] shrink-0 flex-col gap-4">
          <Card className="!pb-2">
            <CardTitle>Payment</CardTitle>
            <Rows rows={[["Partner state", <Status key="s" label={d === "Refunded" ? "Refunded" : "Succeeded"} />], ["Reference", "PSK 99812 34"], ["Card", "Ending 4821"]]} />
          </Card>
          <Notice tone="warn" title="Open case C 1042" body="Not let in with a valid ticket. Waiting on the host." action="Open case" href="/admin/support" />
        </div>
      </div>
      {node}
    </AdminShell>
  );
}

/* ------------------------------------------------------------------ AW14 to AW17 Finance */

export function Payments() {
  const { show, node } = useToast();
  const [q, setQ] = useState("");
  const list = PAYMENTS.filter((p) => !q.trim() || `${p.ref} ${p.order}`.toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <AdminShell>
      <SectionHead title="Finance" tabs={FINANCE_TABS} active="Payments" actions={<button type="button" onClick={() => show("Payments export is being prepared")} className={btnSecondary}>Export</button>} />
      <Filters q={q} setQ={setQ} placeholder="Search reference or order" filters={["State", "Date"]} />
      <Table
        head={["Reference", "Order", "Amount", "Method", "Time", "State", ""]}
        widths={[150, 110, 120, 110, 0, 130, 80]}
        rows={list.map((p) => [<span key="r" className="text-[#172B3A]">{p.ref}</span>, p.order, p.amount, p.method, p.time, <Status key="s" label={p.state} />, <Link key="o" href={`/admin/orders/${p.order.replace(" ", "").toLowerCase()}?tab=payment`} className={btnLink}>Open</Link>])}
      />
      {node}
    </AdminShell>
  );
}

export function Refunds() {
  const admin = useAdmin();
  const [sel, setSel] = useState(0);
  const r = REFUNDS[sel];
  const state = (i: number) => admin?.decisions[`refund-${REFUNDS[i].id}`] ?? REFUNDS[i].state;
  return (
    <AdminShell>
      <SectionHead title="Finance" tabs={FINANCE_TABS} active="Refunds" />
      <div className="flex items-start gap-6">
        <div className="min-w-0 flex-1">
          <Table head={["Order", "Buyer", "Amount", "Reason", "State"]} widths={[110, 0, 120, 150, 130]} rows={REFUNDS.map((x, i) => [x.order, x.buyer, x.amount, x.reason, <Status key="s" label={state(i)} />])} onRow={setSel} />
        </div>
        <Card className="w-[400px] shrink-0 gap-3">
          <H2>Refund for {r.order}</H2>
          <Rows rows={[["Amount", r.amount], ["Service fee", r.fee], ["Source", r.source], ["Note", r.note]]} />
          {["Pending", "Failed"].includes(state(sel)) ? (
            <div className="flex gap-3">
              <button type="button" onClick={() => decide(`refund-${r.id}`, "Rejected", `Rejected refund ${r.amount}`, `Order ${r.order}`)} className={`${btnSecondary} flex-1`}>
                Reject
              </button>
              <button type="button" onClick={() => decide(`refund-${r.id}`, "Processed", `Processed refund ${r.amount}`, `Order ${r.order}`)} className={`${btnPrimary} flex-1`}>
                {state(sel) === "Failed" ? "Retry" : "Approve and process"}
              </button>
            </div>
          ) : (
            <Status label={state(sel)} />
          )}
        </Card>
      </div>
    </AdminShell>
  );
}

export function Settlements() {
  const admin = useAdmin();
  const { show, node } = useToast();
  const state = (s: (typeof SETTLEMENTS)[number]) => admin?.decisions[`settle-${s.id}`] ?? s.state;
  return (
    <AdminShell>
      <SectionHead title="Finance" tabs={FINANCE_TABS} active="Settlements" actions={<button type="button" onClick={() => show("Payout run sent to a second admin to approve")} className={btnPrimary}>Run payouts</button>} />
      <div className="grid grid-cols-3 gap-4">
        <Stat label="Due Friday" value="₦48,200,000" note="312 hosts" />
        <Stat label="Held" value="₦12,900,000" note="Events not ended" />
        <Stat label="Failed last run" value="4" note="₦2,140,000" />
      </div>
      <Table
        head={["Host", "Amount", "Account", "State", "", ""]}
        widths={[0, 150, 200, 140, 90, 80]}
        rows={SETTLEMENTS.map((s) => {
          const st = state(s);
          const held = st === "On hold";
          return [
            <span key="h" className="text-[#172B3A]">{s.host}</span>,
            s.amount,
            s.account,
            <Status key="s" label={st} />,
            <button key="a" type="button" onClick={() => decide(`settle-${s.id}`, held ? "Scheduled" : "On hold", held ? "Released payout" : "Held payout", `Host: ${s.host}`)} className={btnLink}>
              {held ? "Release" : "Hold"}
            </button>,
            <Link key="o" href={s.host === "South Circle" ? "/admin/organizers/south-circle?tab=payouts" : "/admin/organizers"} className={btnLink}>
              Open
            </Link>,
          ];
        })}
      />
      {node}
    </AdminShell>
  );
}

export function Exceptions() {
  const admin = useAdmin();
  const [sel, setSel] = useState(0);
  const [note, setNote] = useState(EXCEPTIONS[0].note);
  const x = EXCEPTIONS[sel];
  const state = (i: number) => admin?.decisions[`exc-${EXCEPTIONS[i].id}`] ?? EXCEPTIONS[i].state;
  return (
    <AdminShell>
      <SectionHead title="Finance" tabs={FINANCE_TABS} active="Exceptions" />
      <div className="flex items-start gap-6">
        <div className="min-w-0 flex-1">
          <Table
            head={["Reference", "Issue", "Amount", "State"]}
            widths={[150, 0, 120, 130]}
            rows={EXCEPTIONS.map((e, i) => [e.ref, e.issue, e.amount, <Status key="s" label={state(i)} />])}
            onRow={(i) => {
              setSel(i);
              setNote(EXCEPTIONS[i].note);
            }}
          />
        </div>
        <Card className="w-[400px] shrink-0 gap-3">
          <H2>{x.ref}</H2>
          <Rows rows={[["Partner", x.partner], ["Ledger", x.ledger], ["Order", x.order]]} />
          <WField label="Note" value={note} onChange={setNote} />
          {state(sel) === "Open" ? (
            <button type="button" onClick={() => decide(`exc-${x.id}`, "Resolved", `Resolved exception: ${note}`, x.ref)} className={`${btnPrimary} w-full`}>
              Mark resolved
            </button>
          ) : (
            <Status label={state(sel)} />
          )}
        </Card>
      </div>
    </AdminShell>
  );
}

/* ------------------------------------------------------------------ AW24 Reporting */

export function AdminAnalytics() {
  const { show, node } = useToast();
  const [range, setRange] = useState<"7" | "30" | "year">("30");
  return (
    <AdminShell>
      <PageHead title="Analytics" sub="Lagos" actions={<button type="button" onClick={() => show("Report exported")} className={btnSecondary}>Export</button>} />
      <PillTabs items={[["7", "Last 7 days"], ["30", "Last 30 days"], ["year", "This year"]]} value={range} onChange={setRange} />
      <div className="grid grid-cols-4 gap-4">
        {KPIS.map(([l, v, n, t]) => (
          <Stat key={l} label={l} value={v} note={n} tone={t} />
        ))}
      </div>
      <Table head={["Category", "Events", "Tickets", "Sales"]} widths={[0, 140, 140, 200]} rows={CATEGORY_SALES.map((r) => r.map((c, i) => (i === 3 ? <span key="s" className="text-[#172B3A]">{c}</span> : c)))} />
      {node}
    </AdminShell>
  );
}
