"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { CreateShell } from "@/components/create/CreateParts";
import { Field } from "@/components/checkout/CheckoutParts";
import { ActionRow } from "@/components/mobile/AppParts";
import { Sheet, sheetPrimary, sheetSecondary, useToast } from "@/components/shared/Sheet";
import { BuildingIcon, MoreIcon, PlusIcon, SettingsIcon, ShieldCheckIcon, UserIcon, UsersIcon, WalletIcon } from "@/components/icons";
import { PLACE_REVIEWS, PROFILES, VENUE_REQUESTS, naira, updateHost, useHost, useHosted, type Hosted, type HostedStatus } from "@/lib/hosting";
import { Area, Banner, HostCard, Initials, LineTabs, Note, Pairs, Pill, Select, StatCard } from "./HostParts";

const TABS: { value: HostedStatus; label: string }[] = [
  { value: "upcoming", label: "Upcoming" },
  { value: "draft", label: "Drafts" },
  { value: "live", label: "Live" },
  { value: "ended", label: "Ended" },
];

export function useActing() {
  const s = useHost();
  return PROFILES.find((p) => p.id === s.acting) ?? PROFILES[0];
}

/* ------------------------------------------------------------------ OM01 Hosting hub, OM20 Acting as */

export function HostHub() {
  const router = useRouter();
  const sp = useSearchParams();
  const all = useHosted();
  const s = useHost();
  const acting = useActing();
  const [tab, setTab] = useState<HostedStatus>((sp.get("tab") as HostedStatus) ?? "upcoming");
  const [switching, setSwitching] = useState(false);
  const [tools, setTools] = useState(false);
  const venueWaiting = VENUE_REQUESTS.filter((v) => !s.venueRequests[v.id]).length;
  const toReply = PLACE_REVIEWS.filter((r) => !r.reply && !s.replies[r.id]).length;

  const list =
    tab === "live"
      ? all.filter((h) => h.id === "abnormal-nightout")
      : all.filter((h) => (s.cancelled.includes(h.id) ? tab === "ended" : h.status === tab));
  const footer = (h: Hosted) =>
    tab === "live" ? `64 checked in of ${h.sold}` : s.cancelled.includes(h.id) ? "Cancelled" : h.status === "draft" ? "Draft" : h.status === "ended" ? `${h.came} came of ${h.sold}` : h.kind === "listing" ? "Listing" : `${h.sold} sold`;

  return (
    <CreateShell title="Hosting" back="/account" action="Create event" onAction={() => router.push("/create")}>
      <div className="flex items-center gap-3 rounded-2xl bg-[#F4F6F8] px-4 py-3">
        <Initials text={acting.initials} />
        <button type="button" onClick={() => setSwitching(true)} className="flex min-w-0 flex-1 flex-col gap-1 text-left">
          <span className="flex items-center gap-2">
            <span className="truncate text-[14px] leading-5 text-[#172B3A]">{acting.name}</span>
            {acting.verifiedPlace && (
              <span className="inline-flex h-6 items-center gap-1 rounded-full bg-[#E7F8EF] px-2 text-[12px] text-[#067647]">
                <ShieldCheckIcon size={14} />
                Verified place
              </span>
            )}
          </span>
          <span className="text-[12px] leading-4 text-[#4D5E70]">{acting.kind} · Switch</span>
        </button>
        <button type="button" aria-label="Host tools" onClick={() => setTools(true)} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#172B3A]">
          <MoreIcon size={20} />
        </button>
      </div>
      {acting.verifiedPlace && <ActionRow icon={<BuildingIcon size={20} />} title="Your place" subtitle={`${venueWaiting} venue requests · ${toReply} reviews to reply to`} href="/host/place" />}

      <div className="pt-4">
        <LineTabs items={TABS} value={tab} onChange={setTab} />
      </div>
      <div className="flex flex-col items-center gap-3 pt-4 md:items-start">
        {list.map((h) => (
          <HostCard key={h.id} h={tab === "live" ? { ...h, date: "Today, 9 PM · Doors open" } : h} footer={footer(h)} href={`/host/event/${h.id}${tab === "live" ? "?state=doors" : ""}`} />
        ))}
        {!list.length && (
          <p className="py-10 text-center text-[14px] leading-5 text-[#4D5E70]">
            {tab === "live" ? "Nothing is live right now. Events show here while doors are open." : tab === "draft" ? "No drafts. Anything you start and leave shows here." : "Nothing here yet."}
          </p>
        )}
      </div>

      <Sheet open={switching} onClose={() => setSwitching(false)} title="Acting as">
        <div role="radiogroup" className="flex flex-col">
          {PROFILES.map((p) => {
            const on = p.id === acting.id;
            return (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => {
                  if (p.invite) return;
                  updateHost({ acting: p.id });
                  setSwitching(false);
                }}
                className="flex min-h-[64px] w-full items-center gap-3 text-left"
              >
                <Initials text={p.initials} />
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="text-[15px] leading-5 text-[#172B3A]">{p.name}</span>
                  <span className="text-[12px] leading-4 text-[#4D5E70]">{p.kind}</span>
                </span>
                {p.invite ? <Pill label="Invite" tone="pink" /> : <span className={`h-5 w-5 shrink-0 rounded-full ${on ? "border-[6px] border-[#E22765]" : "border-[1.5px] border-[#B4BFCA]"}`} />}
              </button>
            );
          })}
          <ActionRow icon={<PlusIcon size={20} />} title="Create a host profile" href="/create/verify" />
        </div>
      </Sheet>

      <Sheet open={tools} onClose={() => setTools(false)} title={acting.name}>
        <ActionRow icon={<UserIcon size={20} />} title="Host profile" subtitle="Name, about and links" href="/host/profile" />
        <ActionRow icon={<SettingsIcon size={20} />} title="Selling tickets" subtitle="1 thing to fix" href="/host/setup" />
        <ActionRow icon={<WalletIcon size={20} />} title="Wallet" subtitle="Payouts and your host tier" href="/host/wallet" />
        <ActionRow icon={<UsersIcon size={20} />} title="Team" subtitle="Managers and finance" href="/host/team" />
      </Sheet>
    </CreateShell>
  );
}

/* ------------------------------------------------------------------ OM13 Host profile */

export function HostProfile() {
  const router = useRouter();
  const { show, node } = useToast();
  const [v, setV] = useState({ name: "South Circle", about: "Rooftop parties and day raves around Lagos since 2021.", area: "Victoria Island", ig: "@southcircle", web: "southcircle.ng" });
  const set = (k: keyof typeof v) => (x: string) => setV({ ...v, [k]: x });
  return (
    <CreateShell title="Host profile" subtitle="South Circle" back="/host" action="Save" onAction={() => show("Profile saved. The name change is in review.")} secondary={
      <button type="button" onClick={() => router.push("/hosts/south-circle")} className="flex h-11 items-center justify-center text-[15px] text-[#E22765]">
        View public page
      </button>
    }>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-[13px] text-[#172B3A]">Cover photo</span>
          <button type="button" onClick={() => show("Photo picker opens here")} className="flex h-[140px] items-center justify-center rounded-2xl border border-dashed border-[#B4BFCA] bg-[#F4F6F8] text-[14px] text-[#4D5E70]">
            Change cover photo
          </button>
          <span className="text-[12px] text-[#68788A]">Square or 4:5 works best on cards.</span>
        </div>
        <Field label="Host name" value={v.name} onChange={set("name")} hint="Name, address and category changes are reviewed." />
        <Area label="About" value={v.about} onChange={set("about")} />
        <Field label="Area" value={v.area} onChange={set("area")} />
        <Field label="Instagram" value={v.ig} onChange={set("ig")} />
        <Field label="Website" value={v.web} onChange={set("web")} />
      </div>
      {node}
    </CreateShell>
  );
}

/* ------------------------------------------------------------------ OM14 Setup status, Change payout account */

export function SetupStatus() {
  const router = useRouter();
  return (
    <CreateShell title="Selling tickets" subtitle="South Circle" back="/host" action="Fix payout account" onAction={() => router.push("/host/payout")} secondary={
      <button type="button" onClick={() => router.push("/dashboard")} className="flex h-11 items-center justify-center text-[15px] text-[#E22765]">
        Open web dashboard
      </button>
    }>
      <Pill label="1 thing to fix" tone="amber" dot />
      <h2 className="pt-3 text-[24px] font-bold leading-[30px] tracking-[-0.02em] text-[#172B3A]">Almost there</h2>
      <p className="pt-1 text-[14px] leading-5 text-[#4D5E70]">Finish these to sell tickets and get paid. Free events are not affected.</p>
      <div className="flex flex-col gap-2 pt-4">
        {[
          ["Host profile", "South Circle, Business", true],
          ["Verification", "Approved Thu 2 Oct", true],
          ["Payout account", "Payout failed: the account name does not match your CAC name", false],
        ].map(([t, sub, ok]) => (
          <div key={t as string} className="flex items-center gap-3 rounded-2xl border border-[#E9EDF1] px-4 py-3">
            <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${ok ? "bg-[#067647]" : "bg-[#C0231A]"}`} />
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="text-[15px] text-[#172B3A]">{t}</span>
              <span className={`text-[12px] leading-4 ${ok ? "text-[#4D5E70]" : "text-[#C0231A]"}`}>{sub}</span>
            </span>
            {!ok && (
              <button type="button" onClick={() => router.push("/host/payout")} className="text-[13px] text-[#E22765]">
                Fix
              </button>
            )}
          </div>
        ))}
      </div>
    </CreateShell>
  );
}

export function ChangePayout() {
  const router = useRouter();
  const [bank, setBank] = useState("Kuda");
  const [acct, setAcct] = useState("2034567811");
  const ok = acct.replace(/\D/g, "").length === 10;
  return (
    <CreateShell title="Change payout account" back="/host/setup" action="Continue to selfie" disabled={!ok} onAction={() => router.push("/create/selfie")}>
      <p className="pb-4 text-[14px] leading-5 text-[#4D5E70]">The new account name must match your verified name.</p>
      <div className="flex flex-col gap-4">
        <Select label="Bank" value={bank} onChange={setBank} options={["Kuda", "GTBank", "Access Bank", "Zenith Bank", "Opay", "Moniepoint"]} />
        <Field label="Account number" value={acct} onChange={(x) => setAcct(x.replace(/\D/g, "").slice(0, 10))} inputMode="tel" />
        {ok && (
          <div className="flex flex-col gap-1">
            <span className="text-[13px] text-[#172B3A]">Account name</span>
            <span className="rounded-[12px] bg-[#F4F6F8] px-4 py-3 text-[14px] text-[#172B3A]">ADA OKAFOR</span>
            <span className="text-[12px] text-[#067647]">Filled in by your bank. Matches your verified name.</span>
          </div>
        )}
        <Banner title="Payouts pause for 7 days" body="For your safety we ask for a quick selfie, and we let you know on your old and new contact details." />
      </div>
    </CreateShell>
  );
}

/* ------------------------------------------------------------------ OM17 Wallet, Tier, Early payouts, OM23 Host tiers */

export function Wallet() {
  const router = useRouter();
  const sp = useSearchParams();
  const tier = sp.get("state") === "tier";
  const [tiers, setTiers] = useState(false);
  return (
    <CreateShell title="Wallet" subtitle="South Circle" back="/host" action="Open web wallet" onAction={() => router.push("/dashboard")}>
      <div className="grid grid-cols-2 gap-3">
        {tier ? (
          <>
            <StatCard label="Available now" value={naira(1918000)} note="Next payout Fri 31 Oct" />
            <StatCard label="In reserve" value={naira(852000)} note="Released Tue 28 Oct" />
          </>
        ) : (
          <>
            <StatCard label="Available" value={naira(1240000)} note="Ready for payout" />
            <StatCard label="On hold" value={naira(890000)} note="Released after events end" />
          </>
        )}
      </div>
      <div className="pt-3">
        {tier ? (
          <div className="flex flex-col gap-3 rounded-2xl border border-[#D5DCE3] p-5">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-2">
                <span className="text-[13px] text-[#4D5E70]">Your host tier</span>
                <Pill label="Trusted Host" tone="pink" dot />
              </div>
              <button type="button" onClick={() => setTiers(true)} className="text-[13px] text-[#E22765]">
                How tiers work
              </button>
            </div>
            <p className="text-[14px] leading-5 text-[#172B3A]">60% of each sale is paid out as tickets sell. The rest stays in reserve until 3 days after the event.</p>
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-[#172B3A]">Progress to Headliner</span>
              <span className="text-[12px] text-[#4D5E70]">2 of 5 clean events</span>
            </div>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <span key={i} className={`h-1 flex-1 rounded-full ${i < 2 ? "bg-[#E22765]" : "bg-[#E9EDF1]"}`} />
              ))}
            </div>
            <p className="text-[12px] text-[#4D5E70]">3 more clean events to Headliner. Only you see your tier.</p>
          </div>
        ) : (
          <Banner tone="red" title="Your last payout failed" body="The bank account name does not match. Fix it to get paid." action="Fix it" onAction={() => router.push("/host/payout")} />
        )}
      </div>
      <div className="flex items-center justify-between py-4">
        <span className="text-[16px] text-[#172B3A]">Next payout</span>
        <span className="text-[15px] text-[#4D5E70]">Fri 31 Oct</span>
      </div>
      <ActionRow icon={<SettingsIcon size={20} />} title="Transactions and statements" subtitle="On the web dashboard" href="/dashboard" />
      {!tier && <ActionRow icon={<WalletIcon size={20} />} title="Get paid early" subtitle="You are now a Trusted Host" href="/host/wallet-early" />}
      <TiersSheet open={tiers} onClose={() => setTiers(false)} />
    </CreateShell>
  );
}

export function TiersSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Sheet open={open} onClose={onClose} title="How host tiers work">
      {[
        ["Host", "Paid 3 days after each event ends", false],
        ["Trusted Host · You", "60% as tickets sell. After 1 clean event or team approval", true],
        ["Headliner", "85% as tickets sell. After 5 clean events", false],
      ].map(([t, sub, on]) => (
        <div key={t as string} className={`mb-2 flex flex-col gap-1 rounded-2xl border px-4 py-3 ${on ? "border-[#E22765] bg-[#FDEEF3]" : "border-[#E9EDF1]"}`}>
          <span className="text-[15px] font-bold text-[#172B3A]">{t}</span>
          <span className="text-[13px] text-[#4D5E70]">{sub}</span>
        </div>
      ))}
    </Sheet>
  );
}

export function EarlyPayouts() {
  const router = useRouter();
  return (
    <CreateShell title="Get paid early" back="/host/wallet" action="Verify my face" onAction={() => router.push("/create/selfie")} secondary={
      <button type="button" onClick={() => router.push("/host/wallet")} className="flex h-11 items-center justify-center text-[15px] text-[#E22765]">
        Not now
      </button>
    }>
      <Pill label="Trusted Host" tone="pink" dot />
      <h2 className="pt-3 text-[24px] font-bold leading-[30px] tracking-[-0.02em] text-[#172B3A]">You are now a Trusted Host</h2>
      <p className="pt-1 text-[14px] leading-5 text-[#4D5E70]">Your last event went smoothly. You can now get part of your ticket money as tickets sell.</p>
      <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-[#D5DCE3] p-5">
        <span className="text-[14px] font-bold text-[#172B3A]">How your ticket money is paid</span>
        <div className="flex h-3 overflow-hidden rounded-full">
          <span className="w-[60%] bg-[#E22765]" />
          <span className="flex-1 bg-[#E9EDF1]" />
        </div>
        <Pairs
          rows={[
            ["Paid as tickets sell", "60%"],
            ["Held until after the event", "40%"],
          ]}
        />
        <p className="text-[12px] text-[#4D5E70]">Held money covers buyer refunds and is released 3 days after the event ends.</p>
      </div>
      <div className="pt-3">
        <Banner tone="blue" title="One quick step" body="Verify your face once to turn this on. It takes about a minute." />
      </div>
    </CreateShell>
  );
}

/* ------------------------------------------------------------------ OM18 Team */

const ROLES = ["Manager · events and staff", "Finance · money and payouts"];

export function Team() {
  const s = useHost();
  const { show, node } = useToast();
  const [invite, setInvite] = useState(false);
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState(ROLES[0]);
  const ok = phone.replace(/\D/g, "").length >= 10;
  const people: [string, string, string, "pink" | "grey"][] = [
    ["YO", "Yemi Ogun", "Owner · everything", "pink"],
    ["KB", "Kemi Bala", "Manager · events and staff", "grey"],
    ["TA", "Tolu Ade", "Finance · money and payouts", "grey"],
  ];
  return (
    <CreateShell title="Team" subtitle="South Circle" back="/host" action="Invite someone" onAction={() => setInvite(true)}>
      {people.map(([i, n, r, t], k) => (
        <div key={n} className="flex min-h-[72px] items-center gap-3 py-2">
          <Initials text={i} />
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="text-[14px] text-[#172B3A]">{n}</span>
            <span className="text-[12px] text-[#4D5E70]">{r}</span>
          </span>
          <Pill label={k === 0 ? "Owner" : k === 1 ? "Manager" : "Invite sent"} tone={t} />
        </div>
      ))}
      {s.team.map((m) => (
        <div key={m.phone} className="flex min-h-[72px] items-center gap-3 py-2">
          <Initials text="NT" />
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="text-[14px] text-[#172B3A]">{m.phone}</span>
            <span className="text-[12px] text-[#4D5E70]">{m.role}</span>
          </span>
          <Pill label="Invite sent" />
        </div>
      ))}
      <Note>Managers run events. Finance sees money. Only the owner can change payout details. Check in staff are added per event.</Note>
      <Sheet
        open={invite}
        onClose={() => setInvite(false)}
        title="Invite to your team"
        footer={
          <>
            <button type="button" onClick={() => setInvite(false)} className={sheetSecondary}>
              Cancel
            </button>
            <button
              type="button"
              disabled={!ok}
              onClick={() => {
                updateHost((st) => ({ team: [...st.team, { phone, role }] }));
                setInvite(false);
                setPhone("");
                show("Invite sent");
              }}
              className={sheetPrimary}
            >
              Send invite
            </button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Field label="Phone number" value={phone} onChange={setPhone} inputMode="tel" placeholder="0803 000 0004" hint="We send them a link to join South Circle." />
          <Select label="Role" value={role} onChange={setRole} options={ROLES} />
        </div>
      </Sheet>
      {node}
    </CreateShell>
  );
}
