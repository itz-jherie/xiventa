"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/shared/Sheet";
import { CASES, FEEDBACK, GUEST_LIST, GUEST_REQUESTS, PLACEMENTS, PROMO_CODES, SERIES, SOURCES } from "@/data/dashboard";
import { naira, updateHost, useHost } from "@/lib/hosting";
import { QrBlock } from "@/components/host/HostEvent";
import { Card, CardTitle, DashShell, Foot, H2, Notice, PageHead, PillTabs, Stat, Status, Table, WField, btnLink, btnPrimary, btnSecondary } from "./DashParts";
import { DialogForm, evHref, phoneEv, useDashEvent } from "./DashEvent";

const crumbs = (id: string, title: string, extra?: [string, string?]) => [["Events", "/dashboard/events"], [title, evHref(id)], ...(extra ? [extra] : [])] as [string, string?][];
const Soon = ({ title, body }: { title: string; body: string }) => <Notice tone="warn" title={title} body={body} />;

/* ------------------------------------------------------------------ OW36 Series dates */

export function SeriesDates({ id }: { id: string }) {
  const e = useDashEvent(id);
  const { show, node } = useToast();
  const [rows, setRows] = useState(e.series ? SERIES : [{ date: e.date.split(",")[0], sold: `${e.sold} / ${e.capacity}`, inn: "Not yet", status: e.status, note: "", action: "Manage" }]);
  const [add, setAdd] = useState(false);
  const [date, setDate] = useState("Fri 21 Nov");
  return (
    <DashShell phone={phoneEv(id)}>
      <PageHead
        crumbs={crumbs(id, e.title)}
        title={e.title}
        sub={`${e.series ?? e.date} · ${e.venue}`}
        actions={
          <>
            {e.series && (
              <button type="button" onClick={() => show("Series ends after Fri 31 Oct. Ticket holders for later dates are told.")} className={btnSecondary}>
                End series
              </button>
            )}
            <button type="button" onClick={() => setAdd(true)} className={btnPrimary}>
              Add a date
            </button>
          </>
        }
      />
      <Table
        head={["Date", "Sold", "Checked in", "Status", "Note", ""]}
        widths={[160, 120, 130, 140, 0, 90]}
        rows={rows.map((r, i) => [
          <span key="d" className="text-[#172B3A]">{r.date}</span>,
          r.sold,
          r.inn,
          <Status key="s" label={r.status} />,
          r.note || " ",
          r.action === "Undo" ? (
            <button
              key="a"
              type="button"
              onClick={() => {
                setRows(rows.map((x, j) => (j === i ? { ...x, status: "On sale", note: "", action: "Manage" } : x)));
                show(`${r.date} is back on`);
              }}
              className={btnLink}
            >
              Undo
            </button>
          ) : (
            <Link key="a" href={evHref(id)} className={btnLink}>
              {r.action}
            </Link>
          ),
        ])}
      />
      <Card className="gap-1">
        <span className="text-[14px] font-bold text-[#172B3A]">Changes to the series</span>
        <Foot>Edits apply to one date, that date and after, or every date. Ticket holders on changed dates are told.</Foot>
      </Card>
      <DialogForm
        open={add}
        onClose={() => setAdd(false)}
        title="Add a date"
        action="Add date"
        onSubmit={() => {
          setRows([...rows, { date, sold: `0 / ${e.capacity || 100}`, inn: "Not yet", status: "On sale", note: "", action: "Manage" }]);
          setAdd(false);
          show(`${date} added`);
        }}
      >
        <WField label="Date" value={date} onChange={setDate} hint="Same time, venue and ticket types as the series." />
      </DialogForm>
      {node}
    </DashShell>
  );
}

/* ------------------------------------------------------------------ OW37 Requests and guest list */

export function GuestRequests({ id }: { id: string }) {
  const e0 = useDashEvent(id);
  const picnic = useDashEvent("jersey-creek-picnic");
  const e = e0.join ? e0 : picnic;
  const sp = useSearchParams();
  const host = useHost();
  const { show, node } = useToast();
  const [tab, setTab] = useState<"requests" | "list">(sp.get("tab") === "list" ? "list" : "requests");
  const open = GUEST_REQUESTS.filter((r) => !host.requests[r.id]);
  const approved = GUEST_REQUESTS.filter((r) => host.requests[r.id] === "approved").map((r) => ({ name: r.name, spots: r.spots, status: "Approved today", date: r.sent }));
  const list = [...approved, ...GUEST_LIST];
  const decide = (rid: string, v: "approved" | "declined", m: string) => {
    updateHost((s) => ({ requests: { ...s.requests, [rid]: v } }));
    show(m);
  };
  return (
    <DashShell phone={phoneEv(id)}>
      <PageHead crumbs={crumbs(id, e.title)} title={e.title} sub={`${e.date} · ${e.venue} · Request to join`} actions={<button type="button" onClick={() => show("Guest list export is being prepared")} className={btnSecondary}>Export guest list</button>} />
      <PillTabs items={[["requests", `Requests ${open.length}`], ["list", `Guest list ${48 + approved.length}`]]} value={tab} onChange={setTab} />
      {tab === "requests" ? (
        <Table
          head={["Name", "Spots", "Note", "Sent", "", ""]}
          widths={[200, 80, 0, 130, 90, 90]}
          rows={open.map((r) => [
            <span key="n" className="text-[#172B3A]">{r.name}</span>,
            String(r.spots),
            r.note || " ",
            r.sent,
            <button key="d" type="button" onClick={() => decide(r.id, "declined", `${r.name} is told`)} className={btnLink}>
              Decline
            </button>,
            <button key="a" type="button" onClick={() => decide(r.id, "approved", `${r.name} gets a free ticket`)} className={btnLink}>
              Approve
            </button>,
          ])}
          empty={<span className="text-[14px] text-[#4D5E70]">No requests waiting.</span>}
        />
      ) : (
        <Table
          head={["Name", "Spots", "Status", "Date", "", ""]}
          widths={[200, 80, 0, 130, 90, 90]}
          rows={list.map((g) => [
            <span key="n" className="text-[#172B3A]">{g.name}</span>,
            String(g.spots),
            g.status,
            g.date,
            <button key="r" type="button" onClick={() => show(`${g.name} removed. Their ticket is cancelled.`)} className={btnLink}>
              Remove
            </button>,
            <button key="m" type="button" onClick={() => show("Messages to guests come later")} className={btnLink}>
              Message
            </button>,
          ])}
        />
      )}
      <Foot>Approved guests get a free ticket straight away. Requests you leave unanswered expire when the event starts.</Foot>
      {node}
    </DashShell>
  );
}

/* ------------------------------------------------------------------ OW38 Waitlist */

export function Waitlist({ id }: { id: string }) {
  const e = useDashEvent(id);
  const { show, node } = useToast();
  const [release, setRelease] = useState(false);
  const [n, setN] = useState("10");
  const [out, setOut] = useState(2);
  return (
    <DashShell phone={phoneEv(id, "tickets")}>
      <PageHead
        crumbs={crumbs(id, e.title)}
        title="Waitlist"
        sub={e.title}
        actions={
          <>
            <Link href={evHref(id, "series")} className={btnSecondary}>
              Add a date
            </Link>
            <button type="button" onClick={() => setRelease(true)} className={btnPrimary}>
              Release tickets
            </button>
          </>
        }
      />
      <div className="grid grid-cols-3 gap-4">
        <Stat label="Waiting" value="16 people" note="For 26 tickets" />
        <Stat label="Offers out" value={String(out)} note="Waiting for them to pay" />
        <Stat label="Filled from waitlist" value="9 tickets" note="Since sold out" tone="up" />
      </div>
      <Table
        head={["Ticket type", "Waiting", "Tickets wanted", "Offers out", "Status"]}
        widths={[0, 130, 160, 130, 150]}
        rows={[
          ["Early bird", "4", "6", "0", <Status key="s" label="Sold out" />],
          ["Regular", "12", "20", String(out), <Status key="s" label="Offers out" />],
        ]}
      />
      <Card className="gap-1">
        <span className="text-[14px] font-bold text-[#172B3A]">How offers work</span>
        <Foot>Released or refunded tickets go to people in order. Each offer is held for the time set by Xiventa, then passes on.</Foot>
      </Card>
      <DialogForm
        open={release}
        onClose={() => setRelease(false)}
        title="Release Regular tickets"
        action="Release"
        disabled={!Number(n)}
        onSubmit={() => {
          setOut(out + Math.min(Number(n), 10));
          setRelease(false);
          show(`${n} tickets offered to the waitlist in order`);
        }}
      >
        <WField label="How many tickets" value={n} onChange={(x) => setN(x.replace(/\D/g, ""))} hint="People waiting for Regular get them first, in order." />
      </DialogForm>
      {node}
    </DashShell>
  );
}

/* ------------------------------------------------------------------ OW39 Promote, Promoters */

export function Promote({ id }: { id: string }) {
  const e = useDashEvent(id);
  const sp = useSearchParams();
  const host = useHost();
  const { show, node } = useToast();
  const [who, setWho] = useState("");
  const tab = sp.get("tab") === "promoters" ? "promoters" : "links";
  const copy = async (s: string) => {
    try {
      await navigator.clipboard.writeText(`https://xiventa.com/e/${e.slug ?? e.id}?src=${encodeURIComponent(s.toLowerCase().replace(/\s+/g, "-"))}`);
    } catch {}
    show(`${s} link copied`);
  };
  if (tab === "promoters")
    return (
      <DashShell phone={phoneEv(id, "promoters")}>
        <PageHead
          crumbs={[...crumbs(id, e.title), ["Promote", evHref(id, "promote")]]}
          title="Promoters"
          sub={`${e.title} · ${e.date.split(",")[0]}`}
          actions={
            <>
              <Link href={evHref(id, "promote")} className={btnSecondary}>
                Source links
              </Link>
              <a href="#invite" className={btnPrimary}>
                Invite a promoter
              </a>
            </>
          }
        />
        <div className="flex items-start gap-6">
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            {!host.promoters.tunde && (
              <Card className="flex-row items-center gap-4">
                <span className="flex flex-1 flex-col">
                  <span className="text-[14px] text-[#172B3A]">Tunde Bakare wants to promote this event</span>
                  <span className="text-[12px] text-[#68788A]">Verified host · Hosted 2 events on Xiventa</span>
                </span>
                <button type="button" onClick={() => updateHost((s) => ({ promoters: { ...s.promoters, tunde: "declined" } }))} className={btnSecondary}>
                  Decline
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateHost((s) => ({ promoters: { ...s.promoters, tunde: "approved" } }));
                    show("Tunde can now share his own link");
                  }}
                  className={btnPrimary}
                >
                  Approve
                </button>
              </Card>
            )}
            <H2>Sales by promoter</H2>
            <Foot>All ticket money goes to you. Settle any commission with your promoters directly.</Foot>
            <Table
              head={["Promoter", "Visits", "Tickets · Sales", ""]}
              widths={[0, 120, 200, 90]}
              rows={[
                ["Ife the Plug", "310", "42 · ₦630,000", "Remove"],
                ["Lagos Nights Crew", "144", "18 · ₦270,000", "Remove"],
                ...(host.promoters.tunde === "approved" ? [["Tunde Bakare", "0", "0 · ₦0", "Remove"]] : []),
                ["Your own links", "2,360", "120 · ₦1.8m", "View"],
              ].map(([a, b, c, d]) => [
                <span key="a" className="text-[#172B3A]">{a}</span>,
                b,
                c,
                d === "View" ? (
                  <Link key="d" href={evHref(id, "promote")} className={btnLink}>
                    View
                  </Link>
                ) : (
                  <button key="d" type="button" onClick={() => show(`${a} removed. Their link stops counting.`)} className={btnLink}>
                    Remove
                  </button>
                ),
              ])}
            />
          </div>
          <div className="flex w-[400px] shrink-0 flex-col gap-4" id="invite">
            <Card className="gap-3">
              <H2>Invite a promoter</H2>
              <Foot>Promoters must be verified hosts. They get their own link and QR, and you see every sale they make.</Foot>
              <WField label="Phone number or Xiventa name" value={who} onChange={setWho} />
              <button
                type="button"
                disabled={who.trim().length < 4}
                onClick={() => {
                  setWho("");
                  show("Invite sent");
                }}
                className={`${btnPrimary} w-full`}
              >
                Send invite
              </button>
            </Card>
            <Notice title="About commission" body="Xiventa does not pay promoter commission yet. Agree it with your promoter directly." />
          </div>
        </div>
        {node}
      </DashShell>
    );
  return (
    <DashShell phone={phoneEv(id, "share")}>
      <PageHead
        crumbs={crumbs(id, e.title)}
        title="Promote"
        sub={e.title}
        actions={
          <>
            <Link href={evHref(id, "promotion")} className={btnSecondary}>
              Boost on Xiventa
            </Link>
            <button type="button" onClick={() => show("QR code downloaded")} className={btnPrimary}>
              Download QR
            </button>
          </>
        }
      />
      <div className="flex items-start gap-6">
        <section className="flex min-w-0 flex-1 flex-col gap-3">
          <H2>Source links</H2>
          <Foot>Make a link for each place you share, then see which one sells.</Foot>
          <Table
            head={["Source", "Visits", "Tickets", ""]}
            widths={[0, 140, 140, 90]}
            rows={SOURCES.filter((s) => s.short).map((s) => [
              <span key="s" className="text-[#172B3A]">{s.short}</span>,
              s.visits,
              String(s.tickets),
              <button key="c" type="button" onClick={() => copy(s.short!)} className={btnLink}>
                Copy
              </button>,
            ])}
          />
          <Link href={`${evHref(id, "promote")}?tab=promoters`} className={`${btnLink} w-fit`}>
            Promoters
          </Link>
        </section>
        <Card className="w-[400px] shrink-0 items-center gap-3 text-center">
          <CardTitle>Print ready poster</CardTitle>
          <span className="relative h-[140px] w-full overflow-hidden rounded-[12px] bg-[#E9EDF1]">{e.image && <Image src={e.image} alt="" fill sizes="360px" className="object-cover" />}</span>
          <span className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#E22765]">Scan for tickets</span>
          <QrBlock size={120} />
          <span className="text-[16px] font-bold text-[#172B3A]">{e.title}</span>
          <span className="text-[12px] text-[#4D5E70]">
            {e.date.split(",")[0]} · {e.venue}
          </span>
        </Card>
      </div>
      {node}
    </DashShell>
  );
}

/* ------------------------------------------------------------------ OW40 Cases */

export function Cases({ id }: { id: string }) {
  const e = useDashEvent(id);
  const host = useHost();
  const { show, node } = useToast();
  const [sel, setSel] = useState(0);
  const [reply, setReply] = useState("So sorry about this. We will refund you in full.");
  const status = (i: number) => (host.requests[`case-${CASES[i].id}`] === "approved" ? "Closed" : CASES[i].status);
  const c = CASES[sel];
  const st = status(sel);
  return (
    <DashShell phone={phoneEv(id, "requests")}>
      <PageHead crumbs={crumbs(id, e.title)} title="Cases" sub={e.title} />
      <div className="flex items-start gap-6">
        <div className="min-w-0 flex-1">
          <Table head={["Case", "From", "About", "Status"]} widths={[110, 0, 160, 170]} rows={CASES.map((x, i) => [x.id, x.from, x.about, <Status key="s" label={status(i)} />])} onRow={setSel} />
        </div>
        <Card className="w-[460px] shrink-0 gap-3">
          <Status label={st} />
          <H2>{c.title}</H2>
          <span className="text-[13px] text-[#4D5E70]">{c.line}</span>
          <p className="text-[16px] leading-6 text-[#172B3A]">&quot;{c.quote}&quot;</p>
          {st === "Waiting on you" ? (
            <>
              <WField label="Your reply" value={reply} onChange={setReply} />
              <div className="flex gap-3">
                <button type="button" onClick={() => show("Asked for details")} className={`${btnSecondary} flex-1`}>
                  Ask for details
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateHost((s) => ({ requests: { ...s.requests, [`case-${c.id}`]: "approved" } }));
                    show(`${naira(c.amount)} refunded. The case is closed.`);
                  }}
                  className={`${btnPrimary} flex-1`}
                >
                  Refund {naira(c.amount)}
                </button>
              </div>
              <Foot>If you do not reply in time, Xiventa reviews the case and decides.</Foot>
            </>
          ) : (
            <Foot>{st === "Closed" ? "This case is closed." : "Xiventa is looking into this. We tell you both what we decide."}</Foot>
          )}
        </Card>
      </div>
      {node}
    </DashShell>
  );
}

/* ------------------------------------------------------------------ OW32 Spotlight clip */

export function ClipWeb({ id }: { id: string }) {
  const e = useDashEvent(id);
  const host = useHost();
  const { show, node } = useToast();
  const removed = host.clipRemoved.includes(id);
  return (
    <DashShell phone={phoneEv(id, "clip")}>
      <PageHead
        crumbs={crumbs(id, e.title)}
        title="Spotlight clip"
        sub={e.title}
        actions={
          <>
            {!removed && (
              <button
                type="button"
                onClick={() => {
                  updateHost((s) => ({ clipRemoved: [...s.clipRemoved, id] }));
                  show("Clip removed");
                }}
                className={btnSecondary}
              >
                Remove
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                updateHost((s) => ({ clipRemoved: s.clipRemoved.filter((x) => x !== id) }));
                show("New clip sent for review");
              }}
              className={btnPrimary}
            >
              {removed ? "Add a clip" : "Replace clip"}
            </button>
          </>
        }
      />
      <div className="flex items-start gap-6">
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <Card className="gap-3">
            {removed ? (
              <>
                <H2>No clip yet</H2>
                <Foot>Add a short vertical video. Events with a clip get seen more in Spotlight.</Foot>
              </>
            ) : (
              <>
                <Status label="In review" />
                <H2>We are checking your clip</H2>
                <Foot>Clips from new hosts are checked before they go live. You get an email when it is live or if we need changes.</Foot>
                {[
                  ["Uploaded", "Mon 20 Oct, 4:12 PM"],
                  ["Length", "Within the Spotlight limit"],
                  ["Shows on", "Spotlight, your event page and the web Home strip"],
                ].map(([k, v]) => (
                  <div key={k} className="flex min-h-11 items-center justify-between border-b border-[#E9EDF1] last:border-0">
                    <span className="text-[14px] text-[#172B3A]">{k}</span>
                    <span className="text-[14px] text-[#4D5E70]">{v}</span>
                  </div>
                ))}
              </>
            )}
          </Card>
          <Notice title="Rejected clips" body="If a clip breaks the content rules, we tell you why and you can upload another. Your event stays live." />
        </div>
        {!removed && (
          <div className="relative aspect-[9/16] w-[300px] shrink-0 overflow-hidden rounded-[20px] bg-[#172B3A]">
            {e.image && <Image src={e.image} alt="" fill sizes="300px" className="object-cover opacity-80" />}
            <span className="absolute left-3 top-3 rounded-full bg-black/40 px-2 py-1 text-[11px] text-white">Spotlight</span>
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-gradient-to-t from-black/80 to-transparent p-4 pt-10 text-white">
              <span className="text-[11px] font-bold uppercase text-[#F5A3BF]">{e.date}</span>
              <span className="text-[16px] font-bold">{e.title}</span>
              <span className="mt-2 flex h-9 w-fit items-center rounded-full bg-[#E22765] px-4 text-[13px]">Get tickets</span>
            </div>
          </div>
        )}
      </div>
      {node}
    </DashShell>
  );
}

/* ------------------------------------------------------------------ OW35 Feedback, OW27 Promo codes, OW30 Promotion */

export function Feedback({ id }: { id: string }) {
  const e0 = useDashEvent(id);
  const sample = useDashEvent("sunday-sundowner-12");
  const e = e0.status === "Ended" ? e0 : sample;
  const { show, node } = useToast();
  return (
    <DashShell phone={phoneEv(id)}>
      <PageHead crumbs={crumbs(id, e0.title)} title="Feedback" sub={`${e.title}, ${e.date.split(",")[0]}`} actions={<button type="button" onClick={() => show("Export comes with ratings")} className={btnSecondary}>Export</button>} />
      <Soon title="Coming after launch" body="Ratings are planned for a later release. Only you see them." />
      <div className="grid grid-cols-3 gap-4">
        <Stat label="Average" value="4.3 of 5" note="From 46 people" />
        <Stat label="Responses" value="46" note="38% of people who came" />
        <Stat label="Window" value="Closed" note="Collected for the set time after the event" />
      </div>
      <Table head={["Rating", "Note", "Date"]} widths={[100, 0, 160]} rows={FEEDBACK.map((f) => [`${f.rating} ★`, f.note, f.date])} />
      {node}
    </DashShell>
  );
}

export function PromoCodes({ id }: { id: string }) {
  const e = useDashEvent(id);
  const { show, node } = useToast();
  const [open, setOpen] = useState(false);
  const [codes, setCodes] = useState(PROMO_CODES);
  const [v, setV] = useState({ code: "EARLYBIRD", discount: "10% off Regular", uses: "50", ends: "Fri 24 Oct, 11:59 PM" });
  const set = (k: keyof typeof v) => (x: string) => setV({ ...v, [k]: x });
  return (
    <DashShell phone={phoneEv(id)}>
      <PageHead crumbs={crumbs(id, e.title)} title="Promo codes" sub={e.title} actions={<button type="button" onClick={() => setOpen(true)} className={btnPrimary}>Create code</button>} />
      <Soon title="Coming after launch" body="Promo codes are planned for a later release. This is how they will work." />
      <Table
        head={["Code", "Discount", "Tickets", "Used", "Ends", "Status"]}
        widths={[150, 140, 140, 110, 0, 150]}
        rows={codes.map((c) => [<span key="c" className="font-bold text-[#172B3A]">{c.code}</span>, c.discount, c.tickets, c.used, c.ends, <Status key="s" label={c.status} />])}
      />
      <DialogForm
        open={open}
        onClose={() => setOpen(false)}
        title="New promo code"
        action="Create code"
        disabled={!v.code.trim()}
        onSubmit={() => {
          setCodes([{ code: v.code.toUpperCase(), discount: v.discount.split(" ").slice(0, 2).join(" "), tickets: v.discount.split(" off ")[1] ?? "All", used: `0 / ${v.uses}`, ends: v.ends.split(",")[0], status: "Active" }, ...codes]);
          setOpen(false);
          show("Code created");
        }}
      >
        <WField label="Code" value={v.code} onChange={set("code")} />
        <WField label="Discount" value={v.discount} onChange={set("discount")} hint="The highest discount you can give is set by Xiventa." />
        <WField label="How many people can use it" value={v.uses} onChange={set("uses")} />
        <WField label="Ends" value={v.ends} onChange={set("ends")} />
      </DialogForm>
      {node}
    </DashShell>
  );
}

export function Promotion({ id }: { id: string }) {
  const e = useDashEvent(id);
  const { show, node } = useToast();
  return (
    <DashShell phone={phoneEv(id)}>
      <PageHead crumbs={crumbs(id, e.title)} title="Promote on Xiventa" sub="Paid placements, always labelled Sponsored" actions={<button type="button" onClick={() => show("Paid placements open after launch")} className={btnPrimary}>Create placement</button>} />
      <Soon title="Coming after launch" body="Paid placements are planned for a later release. Prices will be shown before you pay." />
      <Table head={["Placement", "Where", "Dates", "Views", "Status"]} widths={[200, 0, 200, 110, 150]} rows={PLACEMENTS.map((p) => [<span key="n" className="text-[#172B3A]">{p.name}</span>, p.where, p.dates, p.views, <Status key="s" label={p.status} />])} />
      {node}
    </DashShell>
  );
}
