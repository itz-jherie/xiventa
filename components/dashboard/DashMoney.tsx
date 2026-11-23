"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/shared/Sheet";
import { Sheet, sheetPrimary } from "@/components/shared/Sheet";
import { APPROVALS, AUDIENCE, PAYOUTS, REPORT_ROWS, TRANSACTIONS, WALLET_EVENTS } from "@/data/dashboard";
import { Card, DashShell, Filters, Foot, H2, LinkTabs, Notice, PageHead, Pager, PillTabs, Stat, Status, Table, WField, btnLink, btnPrimary, btnSecondary } from "./DashParts";

const WALLET_TABS: [string, string][] = [
  ["Balances", "/dashboard/wallet"],
  ["Transactions", "/dashboard/wallet/transactions"],
  ["Payouts", "/dashboard/wallet/payouts"],
];

/* ------------------------------------------------------------------ OW17 Wallet (Balances, Tier and reserve, Tier dropped) */

export function Wallet() {
  const sp = useSearchParams();
  const state = sp.get("state");
  const tier = state === "tier" || state === "dropped";
  const dropped = state === "dropped";
  const [tiers, setTiers] = useState(false);
  return (
    <DashShell phone={tier ? "/host/wallet?state=tier" : "/host/wallet"}>
      <PageHead
        title="Wallet"
        sub="Money from your events, all in naira"
        actions={
          !tier && (
            <Link href="/dashboard/settings/payout" className={btnPrimary}>
              Fix payout account
            </Link>
          )
        }
      />
      <LinkTabs items={WALLET_TABS} active="Balances" />
      {!tier && <Notice tone="alert" title="Your last payout failed" body="The bank account name does not match your verified name. Fix it and we retry the payout." action="Fix payout account" href="/dashboard/settings/payout" />}
      {dropped && <Notice tone="warn" title="You moved back to Host" body="Fusion Fest was cancelled and 14 buyers are still waiting on refunds. New sales are paid after the event until this is settled and you run 2 clean events." action="See what happened" href="/dashboard/events?tab=cancelled" />}
      {tier && (
        <Card className="gap-3">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-2">
              <span className="text-[13px] text-[#4D5E70]">Your host tier</span>
              <Status label={dropped ? "Host" : "Trusted Host"} tone={dropped ? "grey" : "pink"} />
            </div>
            <button type="button" onClick={() => setTiers(true)} className={btnLink}>
              How tiers work
            </button>
          </div>
          <p className="text-[14px] text-[#172B3A]">{dropped ? "You are paid 3 days after each event ends. Nothing is paid out early while you are on Host." : "60% of each sale is paid out as tickets sell. The rest stays in reserve until 3 days after the event ends."}</p>
          <div className="flex items-center justify-between">
            <span className="text-[14px] text-[#172B3A]">{dropped ? "Progress to Trusted Host" : "Progress to Headliner"}</span>
            <span className="text-[12px] text-[#4D5E70]">{dropped ? "1 of 2 clean events" : "2 of 5 clean events"}</span>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: dropped ? 2 : 5 }, (_, i) => (
              <span key={i} className={`h-1 flex-1 rounded-full ${i < (dropped ? 1 : 2) ? "bg-[#E22765]" : "bg-[#E9EDF1]"}`} />
            ))}
          </div>
          <Foot>{dropped ? "1 more clean event to get Trusted Host back, once the Fusion Fest refunds are settled. Sales made before the change keep their split." : "3 more clean events to Headliner. Your tier is private: buyers only see your Verified badge."}</Foot>
        </Card>
      )}
      <div className="grid grid-cols-4 gap-4">
        {tier ? (
          <>
            <Stat label="Available now" value={dropped ? "₦640,000" : "₦1,918,000"} note="Ready for the next payout, Fri 31 Oct" />
            <Stat label="Held in reserve" value="₦852,000" note="Released Tue 28 Oct, 3 days after the event" />
          </>
        ) : (
          <>
            <Stat label="Available" value="₦1,240,000" note="Ready for the next payout" />
            <Stat label="Pending" value="₦890,000" note="Released after events end" />
          </>
        )}
        <Stat label="Paid out" value="₦4,560,000" note="Since you joined" />
        <Stat label="Refunded" value="₦93,000" note="This month" />
      </div>
      <H2>By event</H2>
      {tier ? (
        <Table
          head={["Event", "Sales", "Available now", "In reserve", "Release"]}
          widths={[0, 150, 150, 150, 150]}
          rows={[
            ...WALLET_EVENTS.slice(0, 2),
            dropped ? { event: "Fusion Fest, 4 Oct", sales: "₦980,000", avail: "₦0", reserve: "₦0", release: "Refunds owed" } : WALLET_EVENTS[2],
          ].map((w) => [w.event, <span key="s" className="text-[#172B3A]">{w.sales}</span>, w.avail, w.reserve, w.release.includes(" ") && !["Paid out", "Refunds owed"].includes(w.release) ? w.release : <Status key="r" label={w.release} />])}
        />
      ) : (
        <Table head={["Event", "Sales", "Fees", "Refunds", "Status"]} widths={[0, 150, 130, 130, 170]} rows={WALLET_EVENTS.map((w) => [w.event, <span key="s" className="text-[#172B3A]">{w.sales}</span>, w.fees, w.refunds, <Status key="t" label={w.status} />])} />
      )}
      <Foot>{tier ? "Each sale follows the payout split of your tier on the day it was sold. Refunds come out of the reserve first, then from your next payouts." : "Fees shown are the amounts charged under the fee rules set by Xiventa at the time of sale."}</Foot>
      <TiersDialog open={tiers} onClose={() => setTiers(false)} current={dropped ? "Host" : "Trusted Host"} />
    </DashShell>
  );
}

/* ------------------------------------------------------------------ OW18 Transactions, OW19 Payouts, OW20 Withdrawal */

export function Transactions() {
  const { show, node } = useToast();
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const list = TRANSACTIONS.filter((t) => !q.trim() || `${t.event} ${t.ref}`.toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <DashShell phone="/host/wallet">
      <PageHead title="Wallet" actions={<button type="button" onClick={() => show("Statement export is being prepared. We email it to you.")} className={btnSecondary}>Export</button>} />
      <LinkTabs items={WALLET_TABS} active="Transactions" />
      <Filters q={q} setQ={setQ} placeholder="Search order or event" filters={["Type", "Date"]} />
      <Table head={["Date", "Type", "Event", "Order", "Amount", "Status"]} widths={[130, 110, 0, 120, 140, 140]} rows={list.map((t) => [t.date, t.type, t.event, t.ref, <span key="a" className="text-[#172B3A]">{t.amount}</span>, <Status key="s" label={t.status} />])} empty={<span className="text-[14px] text-[#4D5E70]">No transactions match that.</span>} />
      <Pager text="Showing 1 to 5 of 342 transactions" page={page} setPage={setPage} />
      {node}
    </DashShell>
  );
}

export function Payouts() {
  return (
    <DashShell phone="/host/wallet">
      <PageHead title="Wallet" />
      <LinkTabs items={WALLET_TABS} active="Payouts" />
      <div className="flex items-start gap-6">
        <section className="flex min-w-0 flex-1 flex-col gap-3">
          <H2>Payout history</H2>
          <Table head={["Payout", "Date", "To", "Amount", "Status"]} widths={[110, 130, 0, 140, 130]} rows={PAYOUTS.map((p) => [p.id, p.date, "GTBank ending 4821", <span key="a" className="text-[#172B3A]">{p.amount}</span>, <Status key="s" label={p.status} />])} />
        </section>
        <Card className="w-[400px] shrink-0 gap-1">
          <H2>Schedule</H2>
          {[
            ["Payout day", "Weekly"],
            ["Eligible after", "Your event ends and the hold period passes"],
            ["Hold period", "Set by Xiventa, shown on each sale"],
            ["Account", "GTBank ending 4821"],
          ].map(([k, v]) => (
            <div key={k} className="flex min-h-12 flex-col justify-center border-b border-[#E9EDF1] py-2">
              <span className="text-[14px] text-[#172B3A]">{k}</span>
              <span className="text-[12px] text-[#68788A]">{v}</span>
            </div>
          ))}
          <Link href="/dashboard/wallet/withdraw" className={`${btnLink} pt-3`}>
            Request a withdrawal
          </Link>
        </Card>
      </div>
    </DashShell>
  );
}

export function Withdraw() {
  const router = useRouter();
  const { show, node } = useToast();
  const [amount, setAmount] = useState("500000");
  const n = Number(amount.replace(/\D/g, "")) || 0;
  const ok = n > 0 && n <= 1240000;
  return (
    <DashShell phone="/host/wallet">
      <PageHead
        crumbs={[["Wallet", "/dashboard/wallet"], ["Payouts", "/dashboard/wallet/payouts"]]}
        title="Request a withdrawal"
        sub="Where your plan allows it, get available money before payout day"
        actions={
          <>
            <Link href="/dashboard/wallet/payouts" className={btnSecondary}>
              Cancel
            </Link>
            <button
              type="button"
              disabled={!ok}
              onClick={() => {
                show(`Withdrawal of ₦${n.toLocaleString("en-NG")} requested`);
                setTimeout(() => router.push("/dashboard/wallet/payouts"), 800);
              }}
              className={btnPrimary}
            >
              Request withdrawal
            </button>
          </>
        }
      />
      <div className="flex max-w-[640px] flex-col gap-4">
        <Stat label="Available now" value="₦1,240,000" />
        <Card className="gap-4">
          <WField label="Amount" value={`₦${n.toLocaleString("en-NG")}`} onChange={(x) => setAmount(x.replace(/\D/g, ""))} hint={ok ? "The minimum and any fee are set by Xiventa and shown before you confirm." : "Enter an amount up to ₦1,240,000."} tone={ok ? undefined : "red"} />
          <div className="flex min-h-12 items-center justify-between">
            <span className="text-[14px] text-[#172B3A]">To</span>
            <span className="text-[14px] text-[#4D5E70]">GTBank ending 4821</span>
          </div>
        </Card>
        <Notice tone="warn" title="Not available on every account" body="Withdrawals open once your account has a few paid out events with no disputes." />
      </div>
      {node}
    </DashShell>
  );
}

/* ------------------------------------------------------------------ OW28 Audience, OW29 Reports, OW31 Approvals */

export function Audience() {
  const { show, node } = useToast();
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const list = AUDIENCE.filter((a) => !q.trim() || a.name.toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <DashShell phone="/host">
      <PageHead title="Audience" sub="People who came to your events" actions={<button type="button" onClick={() => show("Audience export is being prepared")} className={btnSecondary}>Export</button>} />
      <div className="grid grid-cols-3 gap-4">
        <Stat label="People" value="1,284" note="Across 24 events" />
        <Stat label="Came back" value="31%" note="Went to 2 or more" />
        <Stat label="Followers" value="2,040" note="Up 112 this month" tone="up" />
      </div>
      <Filters q={q} setQ={setQ} placeholder="Search name" filters={["Event", "Ticket type"]} />
      <Table
        head={["Name", "Events", "Last event", "Tickets", ""]}
        widths={[0, 110, 260, 110, 80]}
        rows={list.map((a) => [<span key="n" className="text-[#172B3A]">{a.name}</span>, String(a.events), a.last, String(a.tickets), <button key="v" type="button" onClick={() => show(`${a.name}: ${a.events} events, ${a.tickets} tickets`)} className={btnLink}>View</button>])}
        empty={<span className="text-[14px] text-[#4D5E70]">No one matches that.</span>}
      />
      <Foot>You see names and ticket history only. Contact details stay private unless people opt in to hear from you.</Foot>
      <Pager text="Showing 1 to 4 of 1,284 people" page={page} setPage={setPage} />
      {node}
    </DashShell>
  );
}

export function Reports() {
  const { show, node } = useToast();
  const [range, setRange] = useState<"month" | "3m" | "year">("month");
  return (
    <DashShell phone="/host">
      <PageHead crumbs={[["Events", "/dashboard/events"]]} title="Reports" sub="All events, compared" actions={<button type="button" onClick={() => show("Report export comes after launch")} className={btnSecondary}>Export</button>} />
      <Notice tone="warn" title="Coming after launch" body="Richer reports are planned for a later release." />
      <PillTabs items={[["month", "This month"], ["3m", "Last 3 months"], ["year", "This year"]]} value={range} onChange={setRange} />
      <div className="grid grid-cols-3 gap-4">
        <Stat label="Revenue" value="₦3,370,000" note="Up 22% vs last month" tone="up" />
        <Stat label="Average ticket" value="₦14,900" note="Up ₦600" tone="up" />
        <Stat label="Sell through" value="61%" note="Down 4 points" tone="down" />
      </div>
      <Table head={["Event", "Sold", "Sell through", "Checked in", "Revenue"]} widths={[0, 110, 150, 150, 160]} rows={REPORT_ROWS.map((r) => [r.event, String(r.sold), r.through, r.inn, <span key="r" className="text-[#172B3A]">{r.revenue}</span>])} />
      {node}
    </DashShell>
  );
}

export function Approvals() {
  const { show, node } = useToast();
  const [rows, setRows] = useState(APPROVALS);
  return (
    <DashShell phone="/host/team">
      <PageHead crumbs={[["Settings", "/dashboard/settings"], ["Team", "/dashboard/settings/team"]]} title="Approvals" sub="Changes that need the owner to approve" />
      <Notice tone="warn" title="Planned for later" body="Team approval chains are on the roadmap. Owners approve changes made by managers before they go live." />
      <Table
        head={["Change", "By", "Event", "Status", ""]}
        widths={[0, 160, 220, 140, 90]}
        rows={rows.map((a, i) => [
          <span key="c" className="text-[#172B3A]">{a.change}</span>,
          a.by,
          a.event,
          <Status key="s" label={a.status} />,
          a.status === "Waiting" ? (
            <button
              key="r"
              type="button"
              onClick={() => {
                setRows(rows.map((x, j) => (j === i ? { ...x, status: "Approved" } : x)));
                show("Approved. The change is live.");
              }}
              className={btnLink}
            >
              Review
            </button>
          ) : (
            <span key="r" className={btnLink}>
              View
            </span>
          ),
        ])}
      />
      {node}
    </DashShell>
  );
}

/** OW Host tiers (overlay). */
function TiersDialog({ open, onClose, current }: { open: boolean; onClose: () => void; current: string }) {
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="How host tiers work"
      width={640}
      footer={
        <button type="button" onClick={onClose} className={sheetPrimary}>
          Got it
        </button>
      }
    >
      <div className="flex flex-col gap-4">
        <p className="text-[14px] leading-5 text-[#4D5E70]">Your tier decides how fast you are paid. It is private: buyers only ever see your Verified badge.</p>
        <Table
          head={["Tier", "How you get there", "How you are paid"]}
          widths={[200, 0, 170]}
          rows={[
            ["Host", "Verified, no events yet", "After the event ends"],
            ["Trusted Host", "1 clean event or team approval", "60% as tickets sell"],
            ["Headliner", "5 clean events", "85% as tickets sell"],
          ].map(([t, a, b]) => [t === current ? <Status key="t" label={`${t} · You`} tone="pink" /> : <span key="t" className="text-[#172B3A]">{t}</span>, a, b])}
        />
        <Foot>A clean event ends with no cancellation left unrefunded, few refund complaints and no chargeback disputes. If any of these happen you can move back a tier. Every tier keeps a reserve so buyers can be refunded if an event is cancelled or moved.</Foot>
      </div>
    </Sheet>
  );
}
