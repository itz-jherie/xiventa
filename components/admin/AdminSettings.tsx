"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Toggle } from "@/components/checkout/CheckoutParts";
import { RadioRows } from "@/components/tickets/TicketParts";
import { useToast } from "@/components/shared/Sheet";
import { DialogForm } from "@/components/dashboard/DashEvent";
import { Card, Filters, Foot, H2, Notice, PageHead, Status, Table, WField, btnLink, btnPrimary, btnSecondary } from "@/components/dashboard/DashParts";
import { AUDIT, AUDIT_TIERS, PLATFORMS, RISK_RULES, STAFF } from "@/data/admin";
import { updateAdmin, useAdmin } from "@/lib/admin";
import { AdminShell, SETTINGS_TABS, SectionHead } from "./AdminParts";

/* ------------------------------------------------------------------ AW25 Staff roles, AW34 Invite staff */

export function StaffRoles() {
  const { show, node } = useToast();
  const [staff, setStaff] = useState(STAFF);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string | null>("Support");
  const ok = /^[^@\s]+@xiventa\.com$/i.test(email.trim());
  return (
    <AdminShell>
      <SectionHead title="Settings" tabs={SETTINGS_TABS} active="Staff roles" actions={<button type="button" onClick={() => setOpen(true)} className={btnPrimary}>Invite staff</button>} />
      <div className="flex items-start gap-6">
        <div className="min-w-0 flex-1">
          <Table
            head={["Name", "Role", "Scope", "Two step", ""]}
            widths={[0, 180, 240, 120, 80]}
            rows={staff.map((s) => [<span key="n" className="text-[#172B3A]">{s.name}</span>, s.role, s.scope, <Status key="t" label={s.twoStep} tone={s.twoStep === "On" ? "green" : "red"} />, <button key="e" type="button" onClick={() => show("Role changes need a super admin to approve")} className={btnLink}>Edit</button>])}
          />
        </div>
        <div className="w-[380px] shrink-0">
          <Notice title="Least access by default" body="Staff only see what their role needs. Money settings need a super admin to approve." />
        </div>
      </div>
      <DialogForm
        open={open}
        onClose={() => setOpen(false)}
        title="Invite staff"
        action="Send invite"
        disabled={!ok || !role}
        onSubmit={() => {
          setStaff([...staff, { name: email.split("@")[0], role: role!, scope: role === "Finance" ? "Payments, settlements and payouts" : role === "Support" ? "Cases, refunds and user lookups" : "Reports, verification and restrictions", twoStep: "Off" }]);
          setEmail("");
          setOpen(false);
          show("Invite sent");
        }}
      >
        <p className="text-[14px] text-[#4D5E70]">Staff sign in with a Xiventa work email and two step sign in.</p>
        <WField label="Email" value={email} onChange={setEmail} hint={email && !ok ? "Use an @xiventa.com email." : undefined} tone={email && !ok ? "red" : undefined} />
        <RadioRows
          options={[
            ["Support", "Cases, refunds and user lookups"],
            ["Trust and safety", "Reports, verification and restrictions"],
            ["Finance", "Payments, settlements and payouts"],
          ]}
          value={role}
          onChange={setRole}
        />
      </DialogForm>
      {node}
    </AdminShell>
  );
}

/* ------------------------------------------------------------------ AW26 Platform configuration, AW38 Host tiers and payouts */

type Item = { k: string; label: string; v?: string; hint?: string; toggle?: boolean; on?: boolean };

function ConfigForm({ sections, intro }: { sections: [string, string | undefined, Item[]][]; intro: React.ReactNode }) {
  const admin = useAdmin();
  const { show, node } = useToast();
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [tog, setTog] = useState<Record<string, boolean>>({});
  const dirty = Object.keys(draft).length + Object.keys(tog).length > 0;
  const val = (i: Item) => draft[i.k] ?? admin?.config[i.k] ?? i.v ?? "";
  const on = (i: Item) => tog[i.k] ?? admin?.toggles[i.k] ?? !!i.on;
  return (
    <>
      {dirty && <Notice tone="warn" title="Unsaved changes" body="Changes apply to new sales only and need a second admin to approve. Every change is written to the audit log." />}
      {intro}
      <div className="flex max-w-[860px] flex-col gap-4">
        {sections.map(([title, sub, items]) => (
          <Card key={title} className="gap-3">
            <H2>{title}</H2>
            {sub && <Foot>{sub}</Foot>}
            {items.map((i) =>
              i.toggle ? (
                <div key={i.k} className="flex min-h-14 items-center gap-3">
                  <span className="flex flex-1 flex-col">
                    <span className="text-[14px] text-[#172B3A]">{i.label}</span>
                    {i.hint && <span className="text-[12px] text-[#68788A]">{i.hint}</span>}
                  </span>
                  <Toggle on={on(i)} onChange={(b) => setTog({ ...tog, [i.k]: b })} label={i.label} />
                </div>
              ) : (
                <div key={i.k} className="grid grid-cols-[1fr_220px] items-center gap-4">
                  <span className="flex flex-col">
                    <span className="text-[14px] text-[#172B3A]">{i.label}</span>
                    {i.hint && <span className="text-[12px] text-[#68788A]">{i.hint}</span>}
                  </span>
                  <input value={val(i)} onChange={(e) => setDraft({ ...draft, [i.k]: e.target.value })} aria-label={i.label} className="h-11 rounded-[12px] border border-[#D5DCE3] bg-white px-4 text-[14px] text-[#172B3A] focus:border-[#E22765] focus:outline-none" />
                </div>
              ),
            )}
          </Card>
        ))}
      </div>
      <div className="sticky bottom-4 flex max-w-[860px] justify-end gap-3">
        <button
          type="button"
          disabled={!dirty}
          onClick={() => {
            setDraft({});
            setTog({});
          }}
          className={btnSecondary}
        >
          Discard
        </button>
        <button
          type="button"
          disabled={!dirty}
          onClick={() => {
            const n = Object.keys(draft).length + Object.keys(tog).length;
            updateAdmin((s) => ({
              config: { ...s.config, ...draft },
              toggles: { ...s.toggles, ...tog },
              audit: [["Just now", s.name, `Changed ${n} setting${n === 1 ? "" : "s"}, waiting for a second admin`, "Platform configuration"] as [string, string, string, string], ...s.audit],
            }));
            setDraft({});
            setTog({});
            show("Saved. A second admin has been asked to approve.");
          }}
          className={btnPrimary}
        >
          Save changes
        </button>
      </div>
      {node}
    </>
  );
}

export function PlatformConfig() {
  return (
    <AdminShell>
      <SectionHead title="Settings" sub="Values here feed every price, timer and policy in the apps" tabs={SETTINGS_TABS} active="Platform configuration" />
      <ConfigForm
        intro={null}
        sections={[
          [
            "Fees",
            "Example values. The apps never show fixed numbers; they read these.",
            [
              { k: "fee.pct", label: "Service fee, percentage", v: "5%" },
              { k: "fee.fixed", label: "Service fee, fixed per ticket", v: "₦100" },
              { k: "fee.cap", label: "Fee cap per ticket", v: "₦3,000" },
              { k: "withdraw.min", label: "Minimum withdrawal", v: "₦50,000", hint: "Only for hosts allowed to withdraw." },
              { k: "fee.buyer", label: "Buyer pays the fee by default", hint: "Hosts can choose to absorb it", toggle: true, on: true },
            ],
          ],
          [
            "Timers and windows",
            undefined,
            [
              { k: "hold.checkout", label: "Ticket hold at checkout", v: "10 minutes" },
              { k: "hold.waitlist", label: "Waitlist offer hold", v: "15 minutes" },
              { k: "reply.window", label: "Host reply window for requests and cases", v: "48 hours" },
              { k: "rating.window", label: "Rating window after an event", v: "7 days" },
              { k: "join.window", label: "Online join window before start", v: "15 minutes" },
            ],
          ],
          [
            "Policies",
            undefined,
            [
              { k: "policy.cancel", label: "Cancellation refunds", v: "Full refund including the service fee" },
              { k: "policy.change", label: "Material change refunds", v: "Buyer may ask within the reply window" },
              { k: "rides", label: "Ride booking", hint: "Off at launch", toggle: true, on: false },
            ],
          ],
          ["Hosts", undefined, [{ k: "hosts.checks", label: "Host profiles in checks per person", v: "2", hint: "Owned profiles waiting for verification. No limit once verified." }]],
          [
            "Instagram listings",
            undefined,
            [
              { k: "ig.age", label: "Account age to pass automatically", v: "3 months", hint: "Younger accounts go to Listing review." },
              { k: "ig.followers", label: "Followers to pass automatically", v: "500", hint: "Fewer followers go to Listing review." },
              { k: "ig.tick", label: "Instagram blue tick passes", hint: "Skip the other checks for Instagram verified accounts", toggle: true, on: true },
              { k: "ig.lookalike", label: "Lookalike name check", hint: "Flag names close to a verified host or known brand", toggle: true, on: true },
            ],
          ],
        ]}
      />
      <Link href="/admin/settings/tiers" className={`${btnLink} w-fit`}>
        Host tiers and payouts: early payout, reserve, tier rules and overrides
      </Link>
    </AdminShell>
  );
}

export function TierSettings() {
  return (
    <AdminShell>
      <PageHead crumbs={[["Settings", "/admin/settings"], ["Platform configuration", "/admin/settings/config"]]} title="Host tiers and payouts" sub="Tier rules and payout values for every host. The host Wallet and payouts read these." />
      <ConfigForm
        intro={<Notice title="How changes apply" body="New sales only. Payouts already in progress keep their terms. Every change needs a second admin and is written to the change log. Only Finance admin and Super admin can edit." />}
        sections={[
          [
            "Payout by tier",
            "Each sale keeps the split of the host's tier on the day it was sold. Whatever is not paid early stays in reserve.",
            [
              { k: "tier.host", label: "Host: paid as tickets sell", v: "0%", hint: "Reserve 100%, released after the event" },
              { k: "tier.trusted", label: "Trusted Host: paid as tickets sell", v: "60%", hint: "Reserve 40%" },
              { k: "tier.headliner", label: "Headliner: paid as tickets sell", v: "85%", hint: "Reserve 15%" },
              { k: "tier.release", label: "Reserve released after an event ends", v: "3 days", hint: "All tiers. A per host override can change it." },
              { k: "tier.cap", label: "Early payout cap per event", v: "₦5,000,000", hint: "Optional. Sales above this wait for the reserve release." },
            ],
          ],
          [
            "Reaching a tier",
            undefined,
            [
              { k: "reach.trusted", label: "Clean events for Trusted Host", v: "1" },
              { k: "reach.headliner", label: "Clean events for Headliner", v: "5" },
              { k: "reach.back", label: "Clean events to win a tier back after a drop", v: "2" },
              { k: "reach.min", label: "Paid tickets for an event to count", v: "20", hint: "Smaller events do not count toward a tier." },
              { k: "reach.manual.trusted", label: "Manual approval for Trusted Host", hint: "For known organisers with an offline track record", toggle: true, on: true },
              { k: "reach.manual.headliner", label: "Manual approval for Headliner", hint: "Off: Headliner is earned through clean events only", toggle: true, on: false },
            ],
          ],
          [
            "What counts as an issue",
            undefined,
            [
              { k: "issue.complaints", label: "Refund complaints", v: "2% of orders" },
              { k: "issue.chargebacks", label: "Chargeback disputes per event", v: "1" },
              { k: "issue.wait", label: "Wait before an event counts as clean", v: "14 days", hint: "Gives buyers time to complain or dispute a charge." },
              { k: "issue.cancel", label: "Cancelled without full refunds", hint: "Always an issue", toggle: true, on: true },
              { k: "issue.unanswered", label: "Complaints unanswered after the reply window", hint: "Counts as an issue", toggle: true, on: true },
            ],
          ],
          [
            "Payout account changes",
            undefined,
            [
              { k: "payout.cooling", label: "Cooling off period", v: "7 days", hint: "Payouts pause until it ends. A new ID and selfie check is always required." },
              { k: "payout.notify", label: "Tell the owner by SMS and email", hint: "Sent to the old and new contact details", toggle: true, on: true },
            ],
          ],
          [
            "Per host overrides",
            "Lagos Outdoor Club: reserve 50% until Sat 31 Jan · set by Kemi Adebayo. Grace Hall: paid as tickets sell 90% until Wed 31 Dec · set by Chidi Eze.",
            [
              { k: "override.max", label: "Longest an override can last", v: "90 days" },
              { k: "override.second", label: "Overrides need a second admin", hint: "Same as every money setting", toggle: true, on: true },
            ],
          ],
          [
            "Access and history",
            undefined,
            [
              { k: "access.edit", label: "Who can edit these settings", v: "Finance admin, Super admin" },
              { k: "access.tier", label: "Who can change a host's tier", v: "Finance admin, Operations admin" },
            ],
          ],
        ]}
      />
      <Link href="/admin/settings/audit?tab=tiers" className={`${btnLink} w-fit`}>
        Change log: every change with old and new values
      </Link>
    </AdminShell>
  );
}

/* ------------------------------------------------------------------ AW27 Audit log (+ Tiers and payouts), AW29 Risk rules, AW31 Platforms */

export function AuditLog() {
  const sp = useSearchParams();
  const admin = useAdmin();
  const { show, node } = useToast();
  const [q, setQ] = useState("");
  const tiers = sp.get("tab") === "tiers";
  const rows = (tiers ? AUDIT_TIERS : [...(admin?.audit ?? []), ...AUDIT]).filter((r) => !q.trim() || r.join(" ").toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <AdminShell>
      <SectionHead title="Settings" tabs={SETTINGS_TABS} active="Audit log" actions={<button type="button" onClick={() => show("Audit log exported. The export itself is logged.")} className={btnSecondary}>Export</button>} />
      <div className="flex items-center gap-3">
        <Filters q={q} setQ={setQ} placeholder="Search actor, record or action" />
        <Link href={tiers ? "/admin/settings/audit" : "/admin/settings/audit?tab=tiers"} className={`flex h-11 items-center rounded-[12px] px-4 text-[14px] ${tiers ? "bg-[#E22765] text-white" : "border border-[#D5DCE3] bg-white text-[#4D5E70]"}`}>
          Tiers and payouts
        </Link>
      </div>
      <Table head={["Time", "Actor", "Action", "Record", ""]} widths={[190, 240, 0, 220, 80]} rows={rows.map((r) => [...r, <span key="o" className={btnLink}>Open</span>])} empty={<span className="text-[14px] text-[#4D5E70]">Nothing matches that.</span>} />
      {node}
    </AdminShell>
  );
}

export function RiskRules() {
  const { show, node } = useToast();
  const [on, setOn] = useState(RISK_RULES.map((r) => r[3]));
  return (
    <AdminShell>
      <SectionHead title="Settings" tabs={SETTINGS_TABS} active="Risk rules" actions={<button type="button" onClick={() => show("Automated rules come after launch")} className={btnPrimary}>New rule</button>} />
      <Notice tone="warn" title="Coming after launch" body="Automated rules are planned for a later release. At launch, signals go to the fraud review queue." />
      <Table
        head={["Rule", "Sends to", "Matches this week", "Status"]}
        widths={[0, 160, 180, 140]}
        rows={RISK_RULES.map((r, i) => [
          <span key="r" className="text-[#172B3A]">{r[0]}</span>,
          r[1],
          r[2],
          <span key="t" className="flex items-center gap-2">
            <Toggle on={on[i]} onChange={(b) => setOn(on.map((x, j) => (j === i ? b : x)))} label={r[0]} />
            {on[i] ? "On" : "Off"}
          </span>,
        ])}
      />
      {node}
    </AdminShell>
  );
}

export function Platforms() {
  const { show, node } = useToast();
  const [rows, setRows] = useState(PLATFORMS);
  return (
    <AdminShell>
      <SectionHead title="Settings" tabs={SETTINGS_TABS} active="Platforms" actions={<button type="button" onClick={() => show("New platforms are added with a link pattern check")} className={btnPrimary}>Add platform</button>} />
      <div className="flex items-start gap-6">
        <div className="min-w-0 flex-1">
          <Table
            head={["Order", "Platform", "Type", "Link pattern", "In use", "Status"]}
            widths={[80, 0, 130, 200, 90, 150]}
            rows={rows.map((r, i) => [
              String(i + 1),
              <span key="n" className="text-[#172B3A]">{r[0]}</span>,
              r[1],
              r[2],
              r[3],
              <span key="t" className="flex items-center gap-2">
                <Toggle on={r[4]} onChange={(b) => setRows(rows.map((x, j) => (j === i ? [x[0], x[1], x[2], x[3], b] : x)))} label={r[0]} />
                {r[4] ? "Active" : "Disabled"}
              </span>,
            ])}
          />
        </div>
        <div className="w-[340px] shrink-0">
          <Notice title="Disabling a platform" body="Upcoming events that use it keep working. New events cannot pick it." />
        </div>
      </div>
      {node}
    </AdminShell>
  );
}
