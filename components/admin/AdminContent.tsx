"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Toggle } from "@/components/checkout/CheckoutParts";
import { RadioRows } from "@/components/tickets/TicketParts";
import { useToast } from "@/components/shared/Sheet";
import { DialogForm } from "@/components/dashboard/DashEvent";
import { Card, CardTitle, Filters, Foot, H2, ImageDrop, Notice, PageHead, Status, StepRow, Table, WField, btnLink, btnPrimary, btnSecondary } from "@/components/dashboard/DashParts";
import { DASH_EVENTS } from "@/data/dashboard";
import { AREAS, CATEGORIES, CLIPS, COLLECTIONS, FRAUD, GUEST_PHOTOS, LISTINGS, PLACE_CLAIMS, REPORTED_REVIEWS, REPORTS, SUGGESTIONS, SUPPORT_CASES, VENUE_DECLINES } from "@/data/admin";
import { decide, useAdmin } from "@/lib/admin";
import { AdminShell, CONTENT_TABS, Rows, SUPPORT_TABS, SectionHead } from "./AdminParts";

const img = (id: string) => DASH_EVENTS.find((e) => e.id === id)?.image;

/** Queue layout: table on the left, the selected item on the right. */
function Queue({ head, widths, rows, sel, setSel, children }: { head: string[]; widths: number[]; rows: React.ReactNode[][]; sel: number; setSel: (i: number) => void; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-6">
      <div className="min-w-0 flex-1">
        <Table head={head} widths={widths} rows={rows.map((r, i) => (i === sel ? r.map((c, j) => (j === 0 ? <span key="s" className="font-bold text-[#172B3A]">{c}</span> : c)) : r))} onRow={setSel} />
      </div>
      <div className="flex w-[420px] shrink-0 flex-col gap-3">{children}</div>
    </div>
  );
}

function Decide({ id, record, options, done }: { id: string; record: string; options: [string, string, "primary" | "secondary"][]; done?: string }) {
  if (done) return <Status label={done} />;
  return (
    <div className="flex gap-2">
      {options.map(([label, result, kind]) => (
        <button key={label} type="button" onClick={() => decide(id, result, `${label}: ${record}`, record)} className={`${kind === "primary" ? btnPrimary : btnSecondary} flex-1`}>
          {label}
        </button>
      ))}
    </div>
  );
}

/** Vertical clip / listing preview (AW30, AW35). */
function PhonePreview({ image, label, title, date, cta }: { image?: string; label: string; title: string; date: string; cta: string }) {
  return (
    <div className="relative mx-auto aspect-[9/16] w-[260px] overflow-hidden rounded-[20px] bg-[#172B3A]">
      {image && <Image src={image} alt="" fill sizes="260px" className="object-cover opacity-80" />}
      <span className="absolute left-3 top-3 rounded-full bg-black/40 px-2 py-1 text-[11px] text-white">{label}</span>
      <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2 rounded-[12px] bg-white p-3">
        <span className="flex min-w-0 flex-col">
          <span className="text-[10px] font-bold uppercase text-[#C81E57]">{date}</span>
          <span className="truncate text-[13px] text-[#172B3A]">{title}</span>
        </span>
        <span className="shrink-0 rounded-full bg-[#E22765] px-3 py-1.5 text-[12px] text-white">{cta}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ AW18 Categories, AW19 Collections, AW20 Cities */

export function Categories() {
  const { show, node } = useToast();
  const [rows, setRows] = useState(CATEGORIES);
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= rows.length) return;
    const next = [...rows];
    [next[i], next[j]] = [next[j], next[i]];
    setRows(next);
  };
  return (
    <AdminShell>
      <SectionHead title="Content" tabs={CONTENT_TABS} active="Categories" actions={<button type="button" onClick={() => show("Order saved")} className={btnPrimary}>Save</button>} />
      <Table
        head={["Order", "Category", "Type", "Sub categories", "Items", ""]}
        widths={[90, 0, 150, 260, 90, 110]}
        rows={rows.map((r, i) => [
          String(i + 1),
          <span key="n" className="text-[#172B3A]">{r[0]}</span>,
          r[1],
          r[2],
          r[3],
          <span key="m" className="flex gap-3">
            <button type="button" aria-label={`Move ${r[0]} up`} onClick={() => move(i, -1)} className={btnLink}>
              Up
            </button>
            <button type="button" aria-label={`Move ${r[0]} down`} onClick={() => move(i, 1)} className={btnLink}>
              Down
            </button>
          </span>,
        ])}
      />
      <Foot>Faith and spirituality is treated as sensitive: it is never used for ads or shared with hosts.</Foot>
      {node}
    </AdminShell>
  );
}

export function Collections() {
  const { show, node } = useToast();
  const [rows, setRows] = useState(COLLECTIONS);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  return (
    <AdminShell>
      <SectionHead title="Content" tabs={CONTENT_TABS} active="Collections" actions={<button type="button" onClick={() => setOpen(true)} className={btnPrimary}>New collection</button>} />
      <Table
        head={["Collection", "City", "Items", "Runs", "Status", ""]}
        widths={[0, 100, 90, 240, 130, 80]}
        rows={rows.map((r) => [<span key="n" className="text-[#172B3A]">{r[0]}</span>, r[1], r[2], r[3], <Status key="s" label={r[4]} />, <button key="e" type="button" onClick={() => show("Collection editor opens here")} className={btnLink}>Edit</button>])}
      />
      <Foot>Collections show on Home in the order they are scheduled. Sponsored items are always labelled.</Foot>
      <DialogForm
        open={open}
        onClose={() => setOpen(false)}
        title="New collection"
        action="Create draft"
        disabled={!name.trim()}
        onSubmit={() => {
          setRows([[name.trim(), "Lagos", "0", "Not scheduled", "Draft"], ...rows]);
          setName("");
          setOpen(false);
        }}
      >
        <WField label="Name" value={name} onChange={setName} hint="Add events and places after it is created." />
      </DialogForm>
      {node}
    </AdminShell>
  );
}

export function Cities() {
  const { show, node } = useToast();
  const [on, setOn] = useState(AREAS.map((a) => a[4]));
  return (
    <AdminShell>
      <SectionHead title="Content" tabs={CONTENT_TABS} active="Cities and areas" actions={<button type="button" onClick={() => show("Areas saved")} className={btnPrimary}>Save</button>} />
      <div className="flex items-start gap-6">
        <div className="min-w-0 flex-1">
          <Table
            head={["Area", "Side", "Events", "Places", "Status"]}
            widths={[0, 130, 110, 110, 150]}
            rows={AREAS.map((a, i) => [
              <span key="n" className="text-[#172B3A]">{a[0]}</span>,
              a[1],
              String(a[2]),
              String(a[3]),
              <span key="t" className="flex items-center gap-2">
                <Toggle on={on[i]} onChange={(b) => setOn(on.map((x, j) => (j === i ? b : x)))} label={`${a[0]} on`} />
                {on[i] ? "On" : "Off"}
              </span>,
            ])}
          />
        </div>
        <div className="flex w-[380px] shrink-0 flex-col gap-4">
          <Card className="!pb-2">
            <CardTitle>Cities</CardTitle>
            <Rows rows={[["Lagos", <Status key="l" label="Live" />], ["Abuja", "Coming soon · 1,820 people waiting"]]} />
            <button type="button" onClick={() => show("New cities are set up with the team first")} className={`${btnLink} py-3 text-left`}>
              Add a city
            </button>
          </Card>
          <Notice title="Turning an area off" body="Its events and places stay public but it disappears from the area picker and Home rows." />
        </div>
      </div>
      {node}
    </AdminShell>
  );
}

/* ------------------------------------------------------------------ AW30 Spotlight queue */

export function SpotlightQueue() {
  const admin = useAdmin();
  const [sel, setSel] = useState(0);
  const [reason, setReason] = useState("Shows a drinks brand logo you may not have rights to.");
  const c = CLIPS[sel];
  const st = (i: number) => admin?.decisions[`clip-${CLIPS[i].id}`] ?? CLIPS[i].state;
  return (
    <AdminShell>
      <SectionHead title="Content" tabs={CONTENT_TABS} active="Spotlight queue" />
      <Queue head={["Clip", "Host", "Waiting", "State"]} widths={[0, 160, 120, 130]} rows={CLIPS.map((x, i) => [x.clip, x.host, x.waiting, <Status key="s" label={st(i)} />])} sel={sel} setSel={setSel}>
        <PhonePreview image={img(["abnormal-nightout", "day-party", "friday-rush", "hangover-friday"][sel])} label="Spotlight" title={c.clip} date="Sat 25 Oct · 9 PM" cta="Get tickets" />
        <Decide
          id={`clip-${c.id}`}
          record={`Clip: ${c.clip}`}
          done={["Pending"].includes(st(sel)) ? undefined : st(sel)}
          options={[
            ["Reject", "Rejected", "secondary"],
            ["Pin", "Pinned", "secondary"],
            ["Approve", "Live", "primary"],
          ]}
        />
        {st(sel) === "Pending" && <WField label="Reason if rejected (sent to the host)" value={reason} onChange={setReason} />}
      </Queue>
    </AdminShell>
  );
}

/* ------------------------------------------------------------------ AW35 Listing review, Event claim */

export function ListingReview() {
  const sp = useSearchParams();
  const admin = useAdmin();
  const [sel, setSel] = useState(0);
  const [reason, setReason] = useState("This page looks like a copy of another promoter. Connect the account that first posted this event.");
  if (sp.get("tab") === "claims") return <EventClaim />;
  const l = LISTINGS[sel];
  const st = (i: number) => admin?.decisions[`listing-${LISTINGS[i].id}`] ?? (LISTINGS[i].flag === "Rejected" ? "Rejected" : undefined);
  return (
    <AdminShell>
      <SectionHead title="Listing review" tabs={CONTENT_TABS} active="Listing review" actions={<Link href="/admin/content/listings?tab=claims" className={btnSecondary}>Event claims (1)</Link>} />
      <Queue head={["Listing", "Instagram", "Waiting", "Flag"]} widths={[0, 200, 110, 150]} rows={LISTINGS.map((x, i) => [x.title, x.ig, x.waiting, <Status key="s" label={st(i) ?? x.flag} tone={st(i) ? undefined : "amber"} />])} sel={sel} setSel={setSel}>
        <PhonePreview image={img("afro-night-market")} label="Listing" title={l.title} date="Fri 31 Oct · 6 PM" cta="See on Instagram" />
        <p className="text-[13px] leading-[18px] text-[#4D5E70]">{l.info}</p>
        <Decide
          id={`listing-${l.id}`}
          record={`Listing: ${l.title}`}
          done={st(sel)}
          options={[
            ["Reject", "Rejected", "secondary"],
            ["Ask for more", "Asked for more", "secondary"],
            ["Approve", "Approved", "primary"],
          ]}
        />
        {!st(sel) && <WField label="Reason if rejected (sent to the host)" value={reason} onChange={setReason} />}
      </Queue>
    </AdminShell>
  );
}

function EventClaim() {
  const admin = useAdmin();
  const [reason, setReason] = useState("Your claim needs a venue booking or contract for this date.");
  const done = admin?.decisions["claim-friday-rush"];
  const card = (host: string, line: string) => (
    <div className="flex flex-1 flex-col gap-1 rounded-[12px] border border-[#E9EDF1] bg-[#FDFFF0] p-4">
      <span className="text-[12px] text-[#C81E57]">Fri 24 Oct, 10 PM</span>
      <span className="text-[15px] font-bold text-[#172B3A]">Friday Rush</span>
      <span className="text-[12px] text-[#4D5E70]">{host}</span>
      <span className="text-[14px] font-bold text-[#172B3A]">From ₦15,000</span>
      <span className="text-[12px] text-[#68788A]">{line}</span>
    </div>
  );
  return (
    <AdminShell>
      <PageHead
        crumbs={[["Content", "/admin/content"], ["Listing review", "/admin/content/listings"], ["Event claims"]]}
        title="Review claim: Friday Rush"
        sub="Skyline Lounge says this event is theirs · Sun 11 Oct"
        actions={
          done ? (
            <Status label={done} />
          ) : (
            <>
              <button type="button" onClick={() => decide("claim-friday-rush", "Rejected", "Rejected event claim", "Event: Friday Rush")} className={btnSecondary}>
                Reject or ask for more
              </button>
              <button type="button" onClick={() => decide("claim-friday-rush", "Approved", "Approved event claim, live listing removed", "Event: Friday Rush")} className={btnPrimary}>
                Approve claim
              </button>
            </>
          )
        }
      />
      <div className="flex items-start gap-6">
        <Card className="min-w-0 flex-1 gap-4">
          <H2>The two listings</H2>
          <div className="flex gap-4">
            <div className="flex flex-1 flex-col gap-2">
              <span className="text-[12px] uppercase tracking-[0.04em] text-[#68788A]">Live listing</span>
              {card("Ife Events", "Verified 10 Oct · 38 tickets sold")}
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <span className="text-[12px] uppercase tracking-[0.04em] text-[#68788A]">Claim</span>
              {card("Skyline Lounge", "Verified business")}
            </div>
          </div>
          <Rows rows={[["Proof", "Post on connected @skylinelounge, 9 Oct"], ["Venue booking", "Skyline Lounge is the venue"], ["Live listing posted", "10 Oct, a day after the claimant’s post"], ["If approved", "Live listing removed, 38 buyers refunded"]]} />
        </Card>
        <div className="flex w-[400px] shrink-0 flex-col gap-4">
          <Card className="!pb-2">
            <CardTitle>Checks</CardTitle>
            <StepRow done title="Poster match" sub="96% same flyer" />
            <StepRow done title="Same name, date and venue" sub="Friday Rush · 24 Oct · Skyline Lounge" />
            <StepRow done={false} title="Live listing host" sub="Verified 10 Oct, no past events" action="View" href="/admin/organizers" />
            <StepRow done={false} title="Reports on live listing" sub="2 buyer reports" action="View" href="/admin/support/reports" />
          </Card>
          <WField label="Reason (sent to the host if rejected)" value={reason} onChange={setReason} />
        </div>
      </div>
    </AdminShell>
  );
}

/* ------------------------------------------------------------------ AW32 Place claims, AW40 to AW43 */

export function PlaceClaims() {
  const admin = useAdmin();
  const [sel, setSel] = useState(1);
  const c = PLACE_CLAIMS[sel];
  const st = (i: number) => admin?.decisions[`pclaim-${PLACE_CLAIMS[i].id}`] ?? PLACE_CLAIMS[i].state;
  const open = ["Pending", "Disputed"].includes(st(sel));
  return (
    <AdminShell>
      <SectionHead title="Content" tabs={CONTENT_TABS} active="Place claims" />
      <Queue head={["Place", "Claimed by", "Proof", "State"]} widths={[0, 170, 140, 130]} rows={PLACE_CLAIMS.map((x, i) => [x.place, x.by, x.proof, <Status key="s" label={st(i)} />])} sel={sel} setSel={setSel}>
        <Card className="gap-3">
          <H2>{c.place}</H2>
          <span className="text-[13px] text-[#4D5E70]">
            Claimed by {c.by} · {c.proof}
          </span>
          {c.proof !== "Phone code" && <ImageDrop src={img("day-party")} hint="Proof uploaded with the claim." />}
          <Rows rows={[["Name match", "Check"], ["Location", <Status key="l" label="OK" />]]} />
          {open ? (
            <Decide
              id={`pclaim-${c.id}`}
              record={`Place claim: ${c.place}`}
              options={[
                ["Ask for more", "Asked for more", "secondary"],
                ["Reject", "Rejected", "secondary"],
                ["Approve", "Approved", "primary"],
              ]}
            />
          ) : (
            <Status label={st(sel)} />
          )}
          <Foot>Address documents are not accepted as proof at launch.</Foot>
        </Card>
      </Queue>
    </AdminShell>
  );
}

export function Suggestions() {
  const admin = useAdmin();
  const [sel, setSel] = useState(0);
  const s = SUGGESTIONS[sel];
  const st = (i: number) => admin?.decisions[`sugg-${SUGGESTIONS[i].id}`] ?? SUGGESTIONS[i].state;
  return (
    <AdminShell>
      <SectionHead title="Content" tabs={CONTENT_TABS} active="Suggestions" />
      <Queue head={["Place", "Suggested by", "Area", "State"]} widths={[0, 170, 130, 170]} rows={SUGGESTIONS.map((x, i) => [x.place, x.by, x.area, <Status key="s" label={st(i)} />])} sel={sel} setSel={setSel}>
        <Card className="gap-3">
          <H2>{s.place}</H2>
          <span className="text-[13px] text-[#4D5E70]">{s.line}</span>
          <ImageDrop src={img("jersey-creek-picnic")} hint="Guest photo · 1 of 2" />
          <Rows rows={[["Duplicate check", s.dup], ["Location", "Pin set"]]} />
          {st(sel) === "Published" ? (
            <Status label="Published" />
          ) : (
            <div className="flex gap-2">
              <button type="button" onClick={() => decide(`sugg-${s.id}`, "Rejected", "Rejected place suggestion", `Place: ${s.place}`)} className={`${btnSecondary} flex-1`}>
                Reject
              </button>
              <Link href="/admin/places/new" className={`${btnSecondary} flex-1`}>
                Edit details
              </Link>
              <button type="button" onClick={() => decide(`sugg-${s.id}`, "Published", "Published place suggestion", `Place: ${s.place}`)} className={`${btnPrimary} flex-1`}>
                Publish
              </button>
            </div>
          )}
          <Foot>The guest is told when it goes live. Their name never shows on the place.</Foot>
        </Card>
      </Queue>
    </AdminShell>
  );
}

export function GuestPhotos() {
  const admin = useAdmin();
  const [sel, setSel] = useState(0);
  const [n, setN] = useState(0);
  const p = GUEST_PHOTOS[sel];
  const st = (i: number) => admin?.decisions[`photo-${GUEST_PHOTOS[i].id}`] ?? GUEST_PHOTOS[i].state;
  const pics = ["friday-rush", "abnormal-nightout", "halloween-rooftop"];
  return (
    <AdminShell>
      <SectionHead title="Content" tabs={CONTENT_TABS} active="Photos" />
      <Queue
        head={["Place", "From", "Photos", "State"]}
        widths={[0, 150, 100, 130]}
        rows={GUEST_PHOTOS.map((x, i) => [x.place, x.from, String(x.photos), <Status key="s" label={st(i)} />])}
        sel={sel}
        setSel={(i) => {
          setSel(i);
          setN(0);
        }}
      >
        <Card className="gap-3">
          <H2>
            {p.place} · {p.photos} photos
          </H2>
          <span className="text-[13px] text-[#4D5E70]">From {p.from} · Added today</span>
          <ImageDrop src={img(pics[n % pics.length])} hint={`Photo ${n + 1} of ${p.photos}`} onChange={() => setN((n + 1) % p.photos)} />
          <Rows rows={[["Faces close up", "None"], ["Flyers or screenshots", "None"]]} />
          <Decide
            id={`photo-${p.id}`}
            record={`Photos: ${p.place}`}
            done={st(sel) === "Pending" ? undefined : st(sel)}
            options={[
              ["Remove", "Removed", "secondary"],
              ["Approve all", "Approved", "primary"],
            ]}
          />
          <Foot>Approved photos show after the owner&apos;s photos.</Foot>
        </Card>
      </Queue>
    </AdminShell>
  );
}

export function ReportedReviews() {
  const admin = useAdmin();
  const [sel, setSel] = useState(0);
  const r = REPORTED_REVIEWS[sel];
  const st = (i: number) => admin?.decisions[`review-${REPORTED_REVIEWS[i].id}`] ?? REPORTED_REVIEWS[i].state;
  return (
    <AdminShell>
      <SectionHead title="Content" tabs={CONTENT_TABS} active="Reviews" />
      <Queue head={["Place or event", "Review by", "Reason", "State"]} widths={[0, 130, 180, 110]} rows={REPORTED_REVIEWS.map((x, i) => [x.on, x.by, x.reason, <Status key="s" label={st(i)} />])} sel={sel} setSel={setSel}>
        <Card className="gap-3">
          <H2>Review of {r.on}</H2>
          <span className="text-[13px] text-[#4D5E70]">{r.line}</span>
          <p className="rounded-[12px] bg-[#F4F6F8] px-4 py-3 text-[14px] text-[#172B3A]">{r.text}</p>
          <Rows rows={[["Reports", "1"], ["Reviewer's other reviews", "4"]]} />
          <Decide
            id={`review-${r.id}`}
            record={`Review by ${r.by} on ${r.on}`}
            done={st(sel) === "Open" ? undefined : st(sel)}
            options={[
              ["Keep", "Kept", "secondary"],
              ["Remove review", "Removed", "primary"],
            ]}
          />
          <Foot>Reviews stay up while we look. Owners can&apos;t remove reviews themselves.</Foot>
        </Card>
      </Queue>
    </AdminShell>
  );
}

export function VenueDeclines() {
  const admin = useAdmin();
  const [sel, setSel] = useState(0);
  const v = VENUE_DECLINES[sel];
  const st = (i: number) => admin?.decisions[`decline-${VENUE_DECLINES[i].id}`] ?? VENUE_DECLINES[i].state;
  return (
    <AdminShell>
      <SectionHead title="Content" tabs={CONTENT_TABS} active="Venue declines" />
      <Queue head={["Event", "Host", "Venue", "State"]} widths={[0, 150, 170, 120]} rows={VENUE_DECLINES.map((x, i) => [x.event, x.host, x.venue, <Status key="s" label={st(i)} />])} sel={sel} setSel={setSel}>
        <Card className="gap-3">
          <H2>
            {v.event} · {v.date}
          </H2>
          <p className="text-[13px] leading-[18px] text-[#4D5E70]">
            {v.host} listed it at {v.venue}. The owner declined: {v.said} The host has been told.
          </p>
          <Rows rows={[["Host tier", v.tier], ["Tickets sold", String(v.sold)]]} />
          <Decide
            id={`decline-${v.id}`}
            record={`Venue decline: ${v.event} at ${v.venue}`}
            done={st(sel) === "Open" ? undefined : st(sel)}
            options={[
              ["Ask the host", "Asked the host", "secondary"],
              ["Unpublish", "Unpublished", "secondary"],
              ["Show anyway", "Shown", "primary"],
            ]}
          />
          <Foot>Show anyway puts it on the venue page over the owner. Every override is written to the audit log.</Foot>
        </Card>
      </Queue>
    </AdminShell>
  );
}

/* ------------------------------------------------------------------ AW21 Support cases, AW22 Reports and appeals, AW28 Fraud review */

export function SupportCases() {
  const admin = useAdmin();
  const { show, node } = useToast();
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(1);
  const [reply, setReply] = useState(SUPPORT_CASES[1].reply);
  const list = SUPPORT_CASES.filter((c) => !q.trim() || `${c.id} ${c.from} ${c.order}`.toLowerCase().includes(q.trim().toLowerCase()));
  const c = list[sel] ?? list[0];
  const st = (x: (typeof SUPPORT_CASES)[number]) => admin?.decisions[`case-${x.id}`] ?? x.state;
  return (
    <AdminShell>
      <SectionHead title="Support" tabs={SUPPORT_TABS} active="Cases" />
      <Filters q={q} setQ={setQ} placeholder="Search case, order or name" filters={["Status", "Assignee"]} />
      {c ? (
        <Queue
          head={["Case", "From", "About", "State"]}
          widths={[100, 0, 160, 140]}
          rows={list.map((x) => [x.id, x.from, x.about, <Status key="s" label={st(x)} />])}
          sel={sel}
          setSel={(i) => {
            setSel(i);
            setReply(list[i].reply);
          }}
        >
          <Card className="gap-3">
            <Status label={st(c)} />
            <H2>{c.title}</H2>
            <span className="text-[13px] text-[#4D5E70]">
              {c.from} · Order {c.order} · Assigned to you
            </span>
            <Rows
              rows={[
                ["Order", c.order === "None" ? "None" : <Link key="o" href={`/admin/orders/${c.order.replace(" ", "").toLowerCase()}`} className={btnLink}>{c.order}</Link>],
                ["User", <Link key="u" href="/admin/users" className={btnLink}>{c.from}</Link>],
                ["Payments", <Link key="p" href="/admin/finance" className={btnLink}>Check</Link>],
              ]}
            />
            {st(c) !== "Resolved" ? (
              <>
                <WField label={`Reply to ${c.from.split(" ")[0]}`} value={reply} onChange={setReply} area />
                <div className="flex gap-2">
                  <button type="button" onClick={() => show("Assigned to Seun Bakare")} className={`${btnSecondary} flex-1`}>
                    Assign
                  </button>
                  <button type="button" disabled={!reply.trim()} onClick={() => decide(`case-${c.id}`, "Resolved", "Resolved case", `Case ${c.id}`)} className={`${btnPrimary} flex-1`}>
                    Resolve
                  </button>
                </div>
              </>
            ) : (
              <Foot>This case is resolved.</Foot>
            )}
          </Card>
        </Queue>
      ) : (
        <Card className="items-center py-10 text-[14px] text-[#4D5E70]">No cases match that.</Card>
      )}
      {node}
    </AdminShell>
  );
}

export function ReportsAppeals() {
  const admin = useAdmin();
  const [sel, setSel] = useState(0);
  const [pick, setPick] = useState<string | null>(null);
  const r = REPORTS[sel];
  const st = (i: number) => admin?.decisions[`report-${REPORTS[i].id}`] ?? REPORTS[i].state;
  const open = ["Open", "Appealed"].includes(st(sel));
  return (
    <AdminShell>
      <SectionHead title="Support" tabs={SUPPORT_TABS} active="Reports and appeals" />
      <Queue
        head={["Item", "Type", "Reason", "Reports", "State"]}
        widths={[0, 100, 130, 90, 120]}
        rows={REPORTS.map((x, i) => [x.item, x.type, x.reason, String(x.reports), <Status key="s" label={st(i)} />])}
        sel={sel}
        setSel={(i) => {
          setSel(i);
          setPick(null);
        }}
      >
        <Card className="gap-3">
          <H2>{r.item}</H2>
          <span className="text-[13px] text-[#4D5E70]">{r.line}</span>
          {open ? (
            <>
              <RadioRows
                options={[
                  ["Remove the event", "Host is told why and can appeal"],
                  ["Restrict the host", "No new events until reviewed"],
                  ["Dismiss", "Nothing breaks the content rules"],
                  ["Escalate", "Send to a super admin"],
                ]}
                value={pick}
                onChange={setPick}
              />
              <button
                type="button"
                disabled={!pick}
                onClick={() => decide(`report-${r.id}`, pick === "Dismiss" ? "Dismissed" : pick === "Escalate" ? "Escalated" : pick === "Restrict the host" ? "Restricted" : "Removed", pick!, `${r.type}: ${r.item}`)}
                className={`${btnPrimary} w-full`}
              >
                Decide
              </button>
            </>
          ) : (
            <Status label={st(sel)} />
          )}
        </Card>
      </Queue>
    </AdminShell>
  );
}

export function FraudReview() {
  const admin = useAdmin();
  const [sel, setSel] = useState(0);
  const [pick, setPick] = useState<string | null>(null);
  const f = FRAUD[sel];
  const st = (i: number) => admin?.decisions[`fraud-${FRAUD[i].id}`] ?? FRAUD[i].state;
  return (
    <AdminShell>
      <SectionHead title="Support" tabs={SUPPORT_TABS} active="Fraud review" />
      <Queue
        head={["Signal", "Type", "Score", "State"]}
        widths={[0, 110, 110, 120]}
        rows={FRAUD.map((x, i) => [x.signal, x.type, <Status key="c" label={x.score} />, <Status key="s" label={st(i)} />])}
        sel={sel}
        setSel={(i) => {
          setSel(i);
          setPick(null);
        }}
      >
        <Card className="gap-3">
          <H2>{f.signal}</H2>
          <Rows rows={[[f.type, f.detail], ["Account", f.account], ["Payment partner", f.partner]]} />
          {st(sel) === "Open" ? (
            <>
              <RadioRows
                options={[
                  ["Cancel orders and restrict", "Refunds go back to each card"],
                  ["Clear", "Looks legitimate"],
                  ["Escalate", "Send to a super admin"],
                ]}
                value={pick}
                onChange={setPick}
              />
              <button type="button" disabled={!pick} onClick={() => decide(`fraud-${f.id}`, pick === "Clear" ? "Cleared" : pick === "Escalate" ? "Escalated" : "Restricted", pick!, `Fraud signal: ${f.signal}`)} className={`${btnPrimary} w-full`}>
                Decide
              </button>
            </>
          ) : (
            <Status label={st(sel)} />
          )}
        </Card>
      </Queue>
    </AdminShell>
  );
}

