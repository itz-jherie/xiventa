"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ChevronRightIcon, SearchIcon } from "@/components/icons";
import { XiventaWordmark } from "@/components/icons/XiventaWordmark";
import { RadioRows } from "@/components/tickets/TicketParts";
import { useToast } from "@/components/shared/Sheet";
import { DialogForm } from "@/components/dashboard/DashEvent";
import { Card, CardTitle, Filters, Foot, H2, ImageDrop, LinkTabs, Notice, PageHead, Pager, Stat, Status, StepRow, Table, WField, btnLink, btnPrimary, btnSecondary } from "@/components/dashboard/DashParts";
import { DASH_EVENTS } from "@/data/dashboard";
import { ORGS, ORG_TABS, QUEUES, USERS, getOrg, type OrgTab } from "@/data/admin";
import { adminSignIn, decide, updateAdmin, useAdmin } from "@/lib/admin";
import { AdminShell, Rows } from "./AdminParts";

const flyer = DASH_EVENTS.find((e) => e.id === "day-party")?.image;

/* ------------------------------------------------------------------ AW01 Staff sign in */

export function AdminSignIn() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next")?.startsWith("/admin") ? sp.get("next")! : "/admin";
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#172B3A] px-4">
      <div className="flex w-full max-w-[440px] flex-col gap-4 rounded-2xl bg-white p-8">
        <XiventaWordmark width={140} height={32} />
        <h1 className="text-[24px] font-bold leading-[30px] tracking-[-0.02em] text-[#172B3A]">Xiventa admin</h1>
        <p className="text-[14px] leading-5 text-[#4D5E70]">Staff only. Sign in with your @xiventa.com email. Every action is recorded in the audit log.</p>
        <button
          type="button"
          onClick={() => {
            adminSignIn();
            router.replace(next);
          }}
          className={`${btnPrimary} w-full`}
        >
          Continue with your Xiventa Google account
        </button>
        <Foot>2 step sign in must be on for your company account. You are signed out after 30 minutes with no activity. Lost access? Ask a super admin.</Foot>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ AW02 Dashboard */

function Greeting() {
  const admin = useAdmin();
  const d = new Date();
  const h = d.getHours();
  return (
    <div className="flex flex-col gap-1.5">
      <h1 className="text-[28px] font-bold leading-[34px] tracking-[-0.02em]">{`Good ${h < 12 ? "morning" : h < 17 ? "afternoon" : "evening"}, ${admin?.name.split(" ")[0] ?? ""}`}</h1>
      <p className="text-[14px] text-[#4D5E70]">Lagos · {d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }).replace(",", "")}</p>
    </div>
  );
}

export function AdminHome() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const go = () => {
    const t = q.trim().toLowerCase();
    if (!t) return;
    if (/^xv\s?\w+/.test(t)) router.push(`/admin/orders/${t.replace(/\s/g, "")}`);
    else if (USERS.some((u) => u.name.toLowerCase().includes(t))) router.push(`/admin/users?q=${encodeURIComponent(q.trim())}`);
    else router.push(`/admin/events?tab=all&q=${encodeURIComponent(q.trim())}`);
  };
  return (
    <AdminShell>
      <Greeting />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          go();
        }}
        className="flex h-12 items-center gap-3 rounded-full border border-[#E9EDF1] bg-white px-4"
      >
        <SearchIcon size={20} className="text-[#4D5E70]" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search users, orders, tickets or events" className="min-w-0 flex-1 bg-transparent text-[14px] placeholder:text-[#68788A] focus:outline-none" />
      </form>
      <div className="grid grid-cols-4 gap-4">
        <Stat label="Verification pending" value="14" note="Oldest 2 days" />
        <Stat label="Events in review" value="9" note="3 reported" />
        <Stat label="Refunds pending" value="6" note="₦184,500" />
        <Stat label="Exceptions" value="2" note="Payment partner mismatch" />
      </div>
      <div className="flex items-start gap-6">
        <section className="flex min-w-0 flex-1 flex-col gap-3">
          <H2>Queues</H2>
          <Table
            head={["Queue", "Open", "Oldest", ""]}
            widths={[0, 120, 140, 100]}
            rows={QUEUES.map(([n, c, o]) => [n, String(c), o, <span key="o" className="flex items-center justify-end gap-1 text-[13px] text-[#C81E57]">Open<ChevronRightIcon size={16} /></span>])}
            onRow={(i) => router.push(QUEUES[i][3])}
          />
        </section>
        <Card className="w-[400px] shrink-0 !pb-2">
          <CardTitle>Health</CardTitle>
          {[
            ["Payments", "OK", "/admin/finance"],
            ["Payouts", "OK", "/admin/finance/settlements"],
            ["Check in sync", "Watch", "/admin/events/abnormal-nightout/check-in"],
            ["Messages", "OK", "/admin/support"],
          ].map(([k, v, h]) => (
            <Link key={k} href={h} className="flex min-h-12 items-center justify-between">
              <span className="text-[14px] text-[#172B3A]">{k}</span>
              <span className="flex items-center gap-2 text-[13px] text-[#4D5E70]">
                {v}
                <ChevronRightIcon size={16} />
              </span>
            </Link>
          ))}
        </Card>
      </div>
    </AdminShell>
  );
}

/* ------------------------------------------------------------------ AW03 Users, AW04 User detail, AW33 Restrict */

export function AdminUsers() {
  const router = useRouter();
  const sp = useSearchParams();
  const admin = useAdmin();
  const { show, node } = useToast();
  const [q, setQ] = useState(sp.get("q") ?? "");
  const [page, setPage] = useState(1);
  const list = USERS.filter((u) => !q.trim() || `${u.name} ${u.phone} ${u.email}`.toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <AdminShell>
      <PageHead title="Users" sub="148,220 people" actions={<button type="button" onClick={() => show("Export is being prepared. It is logged in the audit log.")} className={btnSecondary}>Export</button>} />
      <Filters q={q} setQ={setQ} placeholder="Search name, phone or email" filters={["Status", "City"]} />
      <Table
        head={["Name", "Phone", "Joined", "Orders", "Status", ""]}
        widths={[0, 160, 130, 100, 140, 80]}
        rows={list.map((u) => [<span key="n" className="text-[#172B3A]">{u.name}</span>, u.phone, u.joined, String(u.orders), <Status key="s" label={admin?.decisions[`user-${u.id}`] ?? u.status} />, <span key="o" className={btnLink}>Open</span>])}
        onRow={(i) => router.push(`/admin/users/${list[i].id}`)}
        empty={<span className="text-[14px] text-[#4D5E70]">No one matches that.</span>}
      />
      <Pager text="Showing 1 to 4 of 148,220" page={page} setPage={setPage} />
      {node}
    </AdminShell>
  );
}

export function RestrictDialog({ open, onClose, id, record, what = "account" }: { open: boolean; onClose: () => void; id: string; record: string; what?: string }) {
  const [level, setLevel] = useState<string | null>("Pause selling");
  const [reason, setReason] = useState("");
  return (
    <DialogForm
      open={open}
      onClose={onClose}
      title={`Restrict this ${what}`}
      action="Restrict"
      disabled={!level || reason.trim().length < 4}
      onSubmit={() => {
        decide(id, "Restricted", `Restricted ${what}: ${level}`, record);
        setReason("");
        onClose();
      }}
    >
      <p className="text-[14px] text-[#4D5E70]">They can still see their tickets. What else they lose depends on the level you pick.</p>
      <RadioRows
        options={[
          ["Pause selling", "Live events stay up. No new events or ticket types."],
          ["Hide everything", "Events and profile leave Home and search"],
          ["Remove", "Ends the account. Buyers with tickets get refunds."],
        ]}
        value={level}
        onChange={setLevel}
      />
      <WField label="Reason for the audit log" value={reason} onChange={setReason} hint="Everyone with admin access can read this." />
    </DialogForm>
  );
}

export function AdminUser({ id }: { id: string }) {
  const u = USERS.find((x) => x.id === id) ?? USERS[0];
  const router = useRouter();
  const sp = useSearchParams();
  const admin = useAdmin();
  const [restrict, setRestrict] = useState(false);
  const tab = sp.get("tab") ?? "overview";
  const status = admin?.decisions[`user-${u.id}`] ?? u.status;
  const tabs: [string, string][] = ["Overview", "Orders", "Tickets", "Reports", "History"].map((t) => [t, `/admin/users/${u.id}${t === "Overview" ? "" : `?tab=${t.toLowerCase()}`}`]);
  const active = tabs.find(([t]) => t.toLowerCase() === tab)?.[0] ?? "Overview";
  const orders = [
    ["XV 7TGT", "The Abnormal Nightout", "₦31,500", "Paid"],
    ["XV 3HJK", "Friday Rush", "₦8,400", "Refunded"],
  ];
  return (
    <AdminShell>
      <PageHead
        crumbs={[["Users", "/admin/users"], [u.name]]}
        title={u.name}
        sub={`${u.phone} · ${u.email} · Joined ${u.joined}`}
        actions={
          <>
            <Link href={`/admin/users/${u.id}?tab=history`} className={btnSecondary}>
              View history
            </Link>
            {status === "Restricted" ? (
              <button type="button" onClick={() => decide(`user-${u.id}`, "Active", "Restored account", `User: ${u.name}`)} className={btnPrimary}>
                Restore account
              </button>
            ) : (
              <button type="button" onClick={() => setRestrict(true)} className={btnPrimary}>
                Restrict account
              </button>
            )}
          </>
        }
      />
      <LinkTabs items={tabs} active={active} />
      <div className="flex items-start gap-6">
        <section className="flex min-w-0 flex-1 flex-col gap-3">
          {active === "History" ? (
            <>
              <H2>History</H2>
              <Table head={["Time", "Change", "By"]} widths={[200, 0, 200]} rows={[["Mon 20 Oct, 7:42 PM", "Bought 2 tickets, XV 7TGT", "User"], ["Sun 12 Oct, 3:10 PM", "Refund on XV 3HJK", "Host"], ["Jun 2026", "Joined with phone", "User"]]} />
            </>
          ) : active === "Reports" ? (
            <Card className="items-center py-10 text-[14px] text-[#4D5E70]">No reports against this account.</Card>
          ) : active === "Tickets" ? (
            <Table head={["Ticket", "Event", "Check in"]} widths={[200, 0, 160]} rows={[["Regular · XV 7TGT 01", "The Abnormal Nightout", "Not yet"], ["Regular · XV 7TGT 02", "The Abnormal Nightout", "Not yet"]]} />
          ) : (
            <>
              <H2>Recent orders</H2>
              <Table head={["Order", "Event", "Total", "Status"]} widths={[120, 0, 130, 140]} rows={orders.map(([a, b, c, d]) => [a, b, c, <Status key="s" label={d} />])} onRow={(i) => router.push(`/admin/orders/${orders[i][0].replace(" ", "").toLowerCase()}`)} />
            </>
          )}
        </section>
        <div className="flex w-[400px] shrink-0 flex-col gap-4">
          <Card className="!pb-2">
            <CardTitle>Account</CardTitle>
            <Rows rows={[["Status", <Status key="s" label={status} />], ["Reports against", "0"], ["Open cases", "1"], ["Host profiles", "None"]]} />
          </Card>
          <Notice title="Restricting an account" body="They can still see tickets they paid for. They cannot buy, host or post until restored. The reason is sent to them." />
        </div>
      </div>
      <RestrictDialog open={restrict} onClose={() => setRestrict(false)} id={`user-${u.id}`} record={`User: ${u.name}`} />
    </AdminShell>
  );
}

/* ------------------------------------------------------------------ AW05 Organizers */

const ORG_TAB_LIST: [OrgTab, string][] = [
  ["all", "All"],
  ["pending", "Verification pending 14"],
  ["verified", "Verified"],
  ["restricted", "Restricted"],
  ["tiers", "Tiers"],
];

export function AdminOrganizers() {
  const router = useRouter();
  const sp = useSearchParams();
  const admin = useAdmin();
  const tab = (ORG_TAB_LIST.find(([t]) => t === sp.get("tab"))?.[0] ?? "all") as OrgTab;
  const [q, setQ] = useState("");
  const list = ORG_TABS[tab].map((id) => getOrg(id)!).filter((o) => !q.trim() || o.name.toLowerCase().includes(q.trim().toLowerCase()));
  const status = (o: (typeof ORGS)[number]) => admin?.decisions[`org-${o.id}`] ?? o.status;
  return (
    <AdminShell>
      <PageHead title="Organizers" sub="3,410 host profiles" />
      <LinkTabs items={ORG_TAB_LIST.map(([t, l]) => [l, `/admin/organizers?tab=${t}`])} active={ORG_TAB_LIST.find(([t]) => t === tab)![1]} />
      <Filters q={q} setQ={setQ} placeholder="Search host name or CAC number" filters={["Type"]} />
      <Table
        head={["Host", "Type", "Events", tab === "tiers" ? "Tier" : "Payout", "Status", ""]}
        widths={[0, 140, 100, 200, 160, 90]}
        rows={list.map((o) => {
          const s = status(o);
          const review = s === "Pending review";
          return [
            <span key="n" className="text-[#172B3A]">{o.name}</span>,
            o.type,
            String(o.events),
            tab === "tiers" ? <Status key="t" label={admin?.decisions[`tier-${o.id}`] ?? o.tier} tone="pink" /> : o.payout === "None" || o.payout === "Verifying" ? o.payout : <Status key="p" label={o.payout} />,
            <Status key="s" label={s} />,
            <span key="o" className={btnLink}>{review ? "Review" : "Open"}</span>,
          ];
        })}
        onRow={(i) => router.push(status(list[i]) === "Pending review" ? `/admin/organizers/review/${list[i].id}` : `/admin/organizers/${list[i].id}${tab === "tiers" ? "?tab=tier" : ""}`)}
        empty={<span className="text-[14px] text-[#4D5E70]">No host profiles here.</span>}
      />
      <Link href="/admin/organizers/review/ada-okafor" className={`${btnLink} w-fit`}>
        Selfie checks (1)
      </Link>
    </AdminShell>
  );
}

/* ------------------------------------------------------------------ AW06 Verification review, Selfie check */

export function VerificationReview({ id }: { id: string }) {
  const router = useRouter();
  const admin = useAdmin();
  const selfie = id === "ada-okafor";
  const o = getOrg(id);
  const name = selfie ? "Ada Okafor" : (o?.name ?? "Sun Club");
  const [reason, setReason] = useState(selfie ? "Please retake your selfie facing a light, without a cap." : "Please upload a clearer CAC certificate.");
  const done = admin?.decisions[`verify-${id}`];
  const act = (label: string, action: string) => {
    decide(`verify-${id}`, label, action, `Host: ${name}`);
    if (label === "Verified") updateAdmin((st) => ({ decisions: { ...st.decisions, [`org-${id}`]: "Verified" } }));
    setTimeout(() => router.push("/admin/organizers?tab=pending"), 600);
  };
  return (
    <AdminShell>
      <PageHead
        crumbs={selfie ? [["Organizers", "/admin/organizers"], ["Verification"], ["Selfie checks"]] : [["Organizers", "/admin/organizers"], ["Verification"]]}
        title={`Review ${name}`}
        sub={selfie ? "Individual · Selfie did not match after 3 tries · Sun 11 Oct" : "Business · Submitted Sun 4 Oct"}
        actions={
          done ? (
            <Status label={done} />
          ) : (
            <>
              <button type="button" disabled={reason.trim().length < 4} onClick={() => act("Rejected", "Rejected verification")} className={btnSecondary}>
                Reject or ask for more
              </button>
              <button type="button" onClick={() => act("Verified", "Approved verification")} className={btnPrimary}>
                Approve
              </button>
            </>
          )
        }
      />
      <div className="flex items-start gap-6">
        <Card className="min-w-0 flex-1 gap-3">
          <H2>{selfie ? "Selfie check" : "Submitted details"}</H2>
          {selfie ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                {["Selfie · Taken today in the app", "BVN photo · From the bank record, 2015"].map((l) => (
                  <div key={l} className="flex flex-col gap-2">
                    <div className="flex aspect-square items-center justify-center rounded-[12px] bg-[#E9EDF1] text-[13px] text-[#68788A]">Photo</div>
                    <span className="text-[12px] text-[#68788A]">{l}</span>
                  </div>
                ))}
              </div>
              <Rows rows={[["Account name", "ADA OKAFOR · matches BVN"], ["Bank account", "GTBank ·· 6789"], ["Face match score", "71 (needs 90)"], ["Why we asked", "Code to BVN phone not received"]]} />
            </>
          ) : (
            <>
              <Rows rows={[["Registered name", "Sun Club Events Ltd"], ["CAC number", "Matches registry"], ["Director", "ID checked"], ["Bank account name", "Matches"]]} />
              <span className="text-[13px] text-[#172B3A]">CAC certificate</span>
              <ImageDrop src={flyer} hint="Uploaded by the host." />
            </>
          )}
        </Card>
        <div className="flex w-[400px] shrink-0 flex-col gap-4">
          <Card className="!pb-2">
            <CardTitle>Checks</CardTitle>
            {selfie ? (
              <>
                <StepRow done title="Liveness" sub="Real person on camera" />
                <StepRow done title="Account name matches BVN" sub="ADA OKAFOR" />
                <StepRow done={false} title="Past reports" sub="None found" action="View" href="/admin/users/ada-okafor?tab=reports" />
                <StepRow done={false} title="Linked accounts" sub="None on this phone" action="View" href="/admin/users/ada-okafor" />
              </>
            ) : (
              <>
                <StepRow done title="Name matches CAC" sub=" " />
                <StepRow done title="Director ID" sub="Verified by partner" />
                <StepRow done={false} title="Past reports" sub="None found" href="/admin/support/reports" />
                <StepRow done={false} title="Linked accounts" sub="1 other profile on this phone" href="/admin/organizers?tab=all" />
              </>
            )}
          </Card>
          <WField label="Reason (sent to the host if rejected)" value={reason} onChange={setReason} />
        </div>
      </div>
    </AdminShell>
  );
}

/* ------------------------------------------------------------------ AW07 Organizer detail (+ Team), AW36 Tier, AW37, AW39 */

export function OrganizerDetail({ id }: { id: string }) {
  const o = getOrg(id) ?? ORGS[0];
  const sp = useSearchParams();
  const admin = useAdmin();
  const { show, node } = useToast();
  const [restrict, setRestrict] = useState(false);
  const [tierOpen, setTierOpen] = useState(false);
  const [override, setOverride] = useState(false);
  const tab = sp.get("tab") ?? "overview";
  const status = admin?.decisions[`org-${o.id}`] ?? o.status;
  const tier = admin?.decisions[`tier-${o.id}`] ?? o.tier.replace(", by hand", "");
  const tabs: [string, string][] = ["Overview", "Events", "Payouts", "Team", "Tier", "History"].map((t) => [t, `/admin/organizers/${o.id}${t === "Overview" ? "" : `?tab=${t.toLowerCase()}`}`]);
  const active = tabs.find(([t]) => t.toLowerCase() === tab)?.[0] ?? "Overview";
  return (
    <AdminShell>
      <PageHead
        crumbs={[["Organizers", "/admin/organizers"], [o.name]]}
        title={o.name}
        sub={`${o.type} · ${o.verified ? `Verified ${o.verified}` : status} · Owner ${o.owner}`}
        actions={
          active === "Tier" ? (
            <>
              <button type="button" onClick={() => setOverride(true)} className={btnSecondary}>
                Set payout override
              </button>
              <button type="button" onClick={() => setTierOpen(true)} className={btnPrimary}>
                Change tier
              </button>
            </>
          ) : (
            <>
              <Link href={`/admin/organizers/${o.id}?tab=payouts`} className={btnSecondary}>
                View payouts
              </Link>
              {status === "Restricted" ? (
                <button type="button" onClick={() => decide(`org-${o.id}`, "Verified", "Lifted restriction", `Host: ${o.name}`)} className={btnPrimary}>
                  Lift restriction
                </button>
              ) : (
                <button type="button" onClick={() => setRestrict(true)} className={btnPrimary}>
                  Restrict host
                </button>
              )}
            </>
          )
        }
      />
      <LinkTabs items={tabs} active={active} />
      {active === "Tier" ? (
        <>
          <div className="grid grid-cols-4 gap-4">
            <Stat label="Tier" value={tier} note={o.tier.includes("by hand") ? "Given by hand, Tue 7 Oct" : "Earned"} />
            <Stat label="Clean events" value={String(Math.min(o.events, 2))} note="Counted 14 days after each event" />
            <Stat label="Issues, last 90 days" value="0" note="No complaints or disputes" />
            <Stat label="Payout split" value={tier === "Headliner" ? "85% early" : tier === "Host" ? "After event" : "60% early"} note="Tier default, no override" />
          </div>
          <Table
            head={["Time", "Change", "By", "Reason"]}
            widths={[180, 0, 160, 0]}
            rows={[
              ["Tue 7 Oct, 10:12 AM", "Host to Trusted Host, by hand", "Kemi Adebayo", "Ran 12 paid events before joining. References checked."],
              ["Mon 6 Oct, 4:05 PM", "Payout account added", "Owner", "GTBank, name matches CAC"],
              ["Mon 6 Oct, 3:58 PM", "Verified as Business", "Chidi Eze", "CAC and director ID matched"],
              ["Mon 6 Oct, 3:40 PM", "Started on Host", "System", "New verified host"],
            ]}
          />
        </>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4">
            <Stat label="Events" value={String(o.events)} note="3 upcoming" />
            <Stat label="Sales to date" value="₦8,240,000" note="Since Jun 2026" />
            <Stat label="Reports" value="1" note="In the last 90 days" />
          </div>
          <div className="flex items-start gap-6">
            <section className="flex min-w-0 flex-1 flex-col gap-3">
              {active === "Team" ? (
                <>
                  <H2>Team</H2>
                  <Table
                    head={["Member", "Status", ""]}
                    widths={[0, 160, 90]}
                    rows={[
                      ["Yemi Ogun · Owner", "Active"],
                      ["Kemi Bala · Manager", "Active"],
                      ["Tolu Ade · Finance", "Invite sent"],
                    ].map(([m, s]) => [m, <Status key="s" label={s} tone={s === "Active" ? "green" : "grey"} />, <span key="v" className={btnLink}>View</span>])}
                  />
                </>
              ) : active === "Payouts" ? (
                <>
                  <H2>Payouts</H2>
                  <Table head={["Payout", "Date", "Amount", "Status"]} widths={[120, 140, 0, 140]} rows={[["PO 0043", "Fri 31 Oct", "₦1,240,000", "Failed"], ["PO 0042", "Fri 17 Oct", "₦890,000", "Paid"], ["PO 0040", "Fri 10 Oct", "₦420,000", "Paid"]].map(([a, b, c, d]) => [a, b, c, <Status key="s" label={d} />])} />
                </>
              ) : active === "History" ? (
                <>
                  <H2>History</H2>
                  <Table head={["Time", "Change", "By"]} widths={[200, 0, 180]} rows={[["Thu 2 Oct", "Verified as Business", "Kemi Adebayo"], ["Mon 6 Oct", "Tier dropped to Host", "System"]]} />
                </>
              ) : (
                <>
                  <H2>Upcoming events</H2>
                  <Table
                    head={["Event", "Date", "Status", ""]}
                    widths={[0, 140, 140, 80]}
                    rows={[
                      ["The Abnormal Nightout", "Sat 25 Oct", "On sale", "abnormal-nightout"],
                      ["Halloween Rooftop", "Fri 31 Oct", "On sale", "abnormal-nightout"],
                      ["Sunday Sundowner", "Sun 16 Nov", "In review", "sunday-sundowner"],
                    ].map(([a, b, c, d]) => [a, b, <Status key="s" label={c} />, <Link key="o" href={`/admin/events/${d}`} className={btnLink}>Open</Link>])}
                  />
                </>
              )}
            </section>
            <div className="flex w-[400px] shrink-0 flex-col gap-4">
              <Card className="!pb-2">
                <CardTitle>Payout state</CardTitle>
                <Rows rows={[["Account", <Status key="s" label={o.payout === "None" ? "None" : o.payout} />], ["Held", "₦890,000"], ["Last payout", "Fri 17 Oct, ₦890,000"]]} />
              </Card>
              {o.payout === "Failed" && <Notice tone="alert" title="Payout failed" body="Account name does not match the CAC name. The host has been told." />}
            </div>
          </div>
        </>
      )}
      <RestrictDialog open={restrict} onClose={() => setRestrict(false)} id={`org-${o.id}`} record={`Host: ${o.name}`} what="host" />
      <ChangeTier open={tierOpen} onClose={() => setTierOpen(false)} id={o.id} name={o.name} current={tier} onDone={show} />
      <PayoutOverride open={override} onClose={() => setOverride(false)} name={o.name} onDone={show} />
      {node}
    </AdminShell>
  );
}

function ChangeTier({ open, onClose, id, name, current, onDone }: { open: boolean; onClose: () => void; id: string; name: string; current: string; onDone: (m: string) => void }) {
  const [tier, setTier] = useState<string | null>(current);
  const [reason, setReason] = useState("");
  const [check, setCheck] = useState("Sat 31 Jan");
  return (
    <DialogForm
      open={open}
      onClose={onClose}
      title={`Change tier for ${name}`}
      action="Save tier"
      disabled={!tier || reason.trim().length < 4}
      onSubmit={() => {
        if (tier === "Headliner") onDone("Sent to a second admin to approve");
        else {
          decide(`tier-${id}`, tier!, `Tier changed by hand: ${current} to ${tier}`, `Host: ${name}`);
          onDone("Tier saved");
        }
        setReason("");
        onClose();
      }}
    >
      <p className="text-[14px] text-[#4D5E70]">Saved to the audit log with your name and the time. Headliner also needs a second admin.</p>
      <RadioRows
        options={[
          ["Host", "Paid after the event ends"],
          ["Trusted Host", "60% as tickets sell"],
          ["Headliner", "85% as tickets sell. Needs a second admin"],
        ]}
        value={tier}
        onChange={setTier}
      />
      <WField label="Reason for the audit log" value={reason} onChange={setReason} hint="Required. The host does not see this." />
      <WField label="Check again on" value={check} onChange={setCheck} hint="Tiers given by hand are reviewed on this date." />
    </DialogForm>
  );
}

function PayoutOverride({ open, onClose, name, onDone }: { open: boolean; onClose: () => void; name: string; onDone: (m: string) => void }) {
  const [v, setV] = useState({ pct: "90%", days: "3 days", ends: "Wed 31 Dec", reason: "" });
  const set = (k: keyof typeof v) => (x: string) => setV({ ...v, [k]: x });
  return (
    <DialogForm
      open={open}
      onClose={onClose}
      title={`Payout override for ${name}`}
      action="Send for approval"
      disabled={v.reason.trim().length < 4}
      onSubmit={() => {
        onDone("Sent to a second admin to approve");
        onClose();
      }}
    >
      <p className="text-[14px] text-[#4D5E70]">Replaces the tier default for new sales only. It ends on its own date and needs a second admin.</p>
      <WField label="Paid as tickets sell" value={v.pct} onChange={set("pct")} hint="Headliner default is 85%. Reserve becomes 10%." />
      <WField label="Reserve released after the event" value={v.days} onChange={set("days")} hint="Same as the default" />
      <WField label="Override ends" value={v.ends} onChange={set("ends")} hint="Longest allowed is 90 days" />
      <WField label="Reason for the audit log" value={v.reason} onChange={set("reason")} hint="Required" />
    </DialogForm>
  );
}
