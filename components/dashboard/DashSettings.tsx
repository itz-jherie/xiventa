"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Toggle } from "@/components/checkout/CheckoutParts";
import { Chips } from "@/components/create/CreateParts";
import { Sheet, sheetPrimary, useToast } from "@/components/shared/Sheet";
import { RadioRows, Stars } from "@/components/tickets/TicketParts";
import { CalendarIcon, MapPinIcon, StarIcon } from "@/components/icons";
import { DASH_EVENTS, ROLE_MATRIX, WEB_TEAM } from "@/data/dashboard";
import { PLACE_REVIEWS, VENUE_REQUESTS, updateHost, useHost } from "@/lib/hosting";
import { Card, CardTitle, DashShell, Foot, H2, ImageDrop, LinkTabs, ManageRow, Notice, PageHead, StepRow, Status, Table, WField, btnLink, btnPrimary, btnSecondary, useActingWeb } from "./DashParts";
import { DialogForm } from "./DashEvent";

function useSettingsTabs(): [string, string][] {
  const acting = useActingWeb();
  return [
    ["Profile", "/dashboard/settings"],
    ["Verification", "/dashboard/settings/verification"],
    ["Payout account", "/dashboard/settings/payout"],
    ["Team", "/dashboard/settings/team"],
    ["Notifications", "/dashboard/settings/notifications"],
    ["Place", acting.id === "skyline" ? "/dashboard/settings/place" : "/dashboard/settings/place/claim"],
  ];
}
const flyer = DASH_EVENTS.find((e) => e.id === "day-party")?.image;

/* ------------------------------------------------------------------ OW21 Host profile */

export function SettingsProfile() {
  const tabs = useSettingsTabs();
  const acting = useActingWeb();
  const { show, node } = useToast();
  const [v, setV] = useState({ name: acting.name, about: "Rooftop parties and day raves around Lagos since 2021.", area: "Victoria Island", ig: "@southcircle", web: "southcircle.ng" });
  const set = (k: keyof typeof v) => (x: string) => setV({ ...v, [k]: x });
  return (
    <DashShell phone="/host/profile">
      <PageHead
        title="Settings"
        actions={
          <>
            <Link href="/hosts/south-circle" className={btnSecondary}>
              View public page
            </Link>
            <button type="button" onClick={() => show(v.name !== acting.name ? "Saved. The name change is in review." : "Saved")} className={btnPrimary}>
              Save
            </button>
          </>
        }
      />
      <LinkTabs items={tabs} active="Profile" />
      <div className="flex items-start gap-6">
        <Card className="min-w-0 flex-1 gap-4">
          <span className="text-[13px] text-[#172B3A]">Cover photo</span>
          <ImageDrop src={flyer} hint="Square or 4:5 works best on cards." onChange={() => show("Photo picker opens here")} />
          <WField label="Host name" value={v.name} onChange={set("name")} hint="Name changes are reviewed." />
          <WField label="About" value={v.about} onChange={set("about")} area />
          <div className="grid grid-cols-2 gap-4">
            <WField label="Area" value={v.area} onChange={set("area")} />
            <WField label="Instagram" value={v.ig} onChange={set("ig")} />
          </div>
          <WField label="Website" value={v.web} onChange={set("web")} />
        </Card>
        <Card className="w-[400px] shrink-0 gap-2">
          <H2>Public profile</H2>
          <Status label="Verified organizer" tone="green" />
          <Foot>Verified on Thu 2 Oct. Your badge shows on events and your profile.</Foot>
        </Card>
      </div>
      {node}
    </DashShell>
  );
}

/* ------------------------------------------------------------------ OW22 Verification */

export function SettingsVerification() {
  const tabs = useSettingsTabs();
  const { show, node } = useToast();
  const [sent, setSent] = useState(false);
  const [v, setV] = useState({ name: "South Circle Entertainment Ltd", cac: "RC 1234567", director: "Yemi Ogun" });
  const set = (k: keyof typeof v) => (x: string) => setV({ ...v, [k]: x });
  return (
    <DashShell phone="/host/setup">
      <PageHead
        title="Settings"
        actions={
          <button
            type="button"
            disabled={sent}
            onClick={() => {
              setSent(true);
              show("Sent for review. We email you when it is done.");
            }}
            className={btnPrimary}
          >
            {sent ? "In review" : "Submit for review"}
          </button>
        }
      />
      <LinkTabs items={tabs} active="Verification" />
      <div className="flex items-start gap-6">
        <Card className="min-w-0 flex-1 gap-4">
          <H2>Business verification</H2>
          <p className="text-[14px] leading-5 text-[#4D5E70]">Your events show South Circle once this check passes. Until then they show you, the verified person, and you can still publish and sell.</p>
          <WField label="Registered business name" value={v.name} onChange={set("name")} />
          <WField label="CAC number" value={v.cac} onChange={set("cac")} />
          <WField label="Director full name" value={v.director} onChange={set("director")} hint="Must match their ID." />
          <span className="text-[13px] text-[#172B3A]">CAC certificate</span>
          <ImageDrop src={flyer} hint="PDF, JPG or PNG." onChange={() => show("File picker opens here")} />
        </Card>
        <div className="flex w-[400px] shrink-0 flex-col gap-4">
          <Card className="!pb-2">
            <CardTitle>Status</CardTitle>
            <StepRow done title="Host profile" sub="South Circle" />
            <StepRow done={sent} title="Documents" sub={sent ? "Sent" : "Waiting for you"} onClick={() => show("Add the CAC certificate on the left")} />
            <StepRow done={false} title="Review" sub="We email you when it is done" action={sent ? "In review" : "Add"} onClick={() => show(sent ? "We are reviewing your documents" : "Submit the form first")} />
          </Card>
          <Notice title="What this unlocks" body="Your business name on events, payouts to the business account and the Verified business badge." />
          <Notice tone="alert" title="If we reject it" body="We tell you why and you can resubmit. Nothing you have published goes offline." />
        </div>
      </div>
      {node}
    </DashShell>
  );
}

/* ------------------------------------------------------------------ OW23 Payout account */

export function SettingsPayout() {
  const tabs = useSettingsTabs();
  const router = useRouter();
  const [bank, setBank] = useState("GTBank");
  const [acct, setAcct] = useState("0123 456 789");
  const [replacing, setReplacing] = useState(false);
  const digits = acct.replace(/\D/g, "");
  const name = replacing ? (digits.length === 10 ? "SOUTH CIRCLE ENTERTAINMENT LTD" : "") : "S. Circle Ventures";
  const matches = name === "SOUTH CIRCLE ENTERTAINMENT LTD";
  return (
    <DashShell phone="/host/payout">
      <PageHead
        title="Settings"
        actions={
          <>
            <button
              type="button"
              onClick={() => {
                setReplacing(true);
                setAcct("");
              }}
              className={btnSecondary}
            >
              Replace account
            </button>
            <button type="button" disabled={!matches} onClick={() => router.push("/create/selfie")} className={btnPrimary}>
              Save account
            </button>
          </>
        }
      />
      <LinkTabs items={tabs} active="Payout account" />
      <div className="flex max-w-[760px] flex-col gap-4">
        {!matches && !replacing && <Notice tone="alert" title="Account name does not match" body="The bank says this account belongs to S. Circle Ventures. It must match your CAC name: South Circle Entertainment Ltd." />}
        <Card className="gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-[13px] text-[#172B3A]">Bank</span>
            <select value={bank} onChange={(e) => setBank(e.target.value)} className="h-12 rounded-[12px] border border-[#D5DCE3] bg-white px-4 text-[14px] text-[#172B3A]">
              {["GTBank", "Access Bank", "Zenith Bank", "Kuda", "Moniepoint", "Opay"].map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </label>
          <WField label="Account number" value={acct} onChange={(x) => setAcct(x.replace(/[^\d ]/g, "").slice(0, 12))} />
          <div className="flex flex-col gap-2">
            <span className="text-[13px] text-[#172B3A]">Account name</span>
            <span className="flex h-12 items-center justify-between rounded-[12px] bg-[#F4F6F8] px-4 text-[14px] text-[#172B3A]">
              {name || "Fills in after 10 digits"}
              {name && <Status label={matches ? "Matches" : "Failed"} tone={matches ? "green" : "red"} />}
            </span>
            <span className={`text-[12px] ${matches ? "text-[#067647]" : "text-[#C0231A]"}`}>Filled in by the bank. It must match your business name.</span>
          </div>
        </Card>
        {matches && <Notice tone="warn" title="Payouts pause for 7 days" body="For your safety we ask for a quick selfie, and we let you know on your old and new contact details." />}
      </div>
    </DashShell>
  );
}

/* ------------------------------------------------------------------ OW24 Team, OW41 Invite, OW25 Roles */

const INVITE_ROLES: [string, string][] = [
  ["Check in staff", "Can scan tickets on event day only"],
  ["Manager", "Can edit events and see sales"],
  ["Finance", "Can see the wallet and request payouts"],
];

export function SettingsTeam() {
  const tabs = useSettingsTabs();
  const { show, node } = useToast();
  const [team, setTeam] = useState(WEB_TEAM);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string | null>("Manager");
  return (
    <DashShell phone="/host/team">
      <PageHead
        title="Settings"
        actions={
          <>
            <Link href="/dashboard/settings/roles" className={btnSecondary}>
              Roles and access
            </Link>
            <button type="button" onClick={() => setOpen(true)} className={btnPrimary}>
              Invite someone
            </button>
          </>
        }
      />
      <LinkTabs items={tabs} active="Team" />
      <Table
        head={["Name", "Email or phone", "Role", "Status", ""]}
        widths={[0, 240, 160, 160, 90]}
        rows={team.map((m, i) => [
          <span key="n" className="text-[#172B3A]">{m.name}</span>,
          m.contact,
          m.role,
          <Status key="s" label={m.status} tone={m.status === "Active" ? "green" : "grey"} />,
          m.action ? (
            <button
              key="a"
              type="button"
              onClick={() => {
                if (m.action === "Remove") setTeam(team.filter((_, j) => j !== i));
                show(m.action === "Remove" ? `${m.name} removed` : m.action === "Resend" ? "Invite sent again" : "Role editing opens here");
              }}
              className={btnLink}
            >
              {m.action}
            </button>
          ) : (
            " "
          ),
        ])}
      />
      <Foot>Check in staff are added per event from the event Check in tab. Only the owner can change payout details.</Foot>
      <Link href="/dashboard/approvals" className={`${btnLink} w-fit`}>
        Approvals
      </Link>
      <DialogForm
        open={open}
        onClose={() => setOpen(false)}
        title="Invite someone"
        action="Send invite"
        disabled={!/^\S+@\S+\.\S+$/.test(email) || !role}
        onSubmit={() => {
          setTeam([...team, { name: email.split("@")[0], contact: email, role: role!, status: "Invite sent", action: "Resend" }]);
          setOpen(false);
          setEmail("");
          show("Invite sent");
        }}
      >
        <p className="text-[14px] text-[#4D5E70]">They get an email with a link. The invite ends if it is not used in time.</p>
        <WField label="Email" value={email} onChange={setEmail} />
        <RadioRows options={INVITE_ROLES} value={role} onChange={setRole} />
      </DialogForm>
      {node}
    </DashShell>
  );
}

export function SettingsRoles() {
  const { show, node } = useToast();
  const yes = (b: boolean, k: number) => <Status key={k} label={b ? "Yes" : "No"} tone={b ? "green" : "grey"} />;
  return (
    <DashShell phone="/host/team">
      <PageHead crumbs={[["Settings", "/dashboard/settings"], ["Team", "/dashboard/settings/team"]]} title="Roles and access" sub="What each role can do" actions={<button type="button" onClick={() => show("Saved")} className={btnPrimary}>Save</button>} />
      <Table head={["Can", "Owner", "Manager", "Finance", "Check in staff"]} widths={[0, 130, 130, 130, 150]} rows={ROLE_MATRIX.map(([c, ...r]) => [<span key="c" className="text-[#172B3A]">{c}</span>, ...r.map((b, i) => yes(b, i))])} />
      <Notice title="Custom roles are coming later" body="For now every team member gets one of these four roles." />
      {node}
    </DashShell>
  );
}

/* ------------------------------------------------------------------ OW26 Notifications */

export function SettingsNotifications() {
  const tabs = useSettingsTabs();
  const { show, node } = useToast();
  const [on, setOn] = useState<Record<string, boolean>>({ "Every sale": false, "Daily sales summary": true, "Refund requests and cases": true, Payouts: true, "Verification updates": true, "Tips for hosts": false });
  const subs: Record<string, string> = { "Every sale": "One email per order", "Daily sales summary": "Every evening at 8 PM", "Refund requests and cases": "On", Payouts: "On", "Verification updates": "On", "Tips for hosts": "Once a month" };
  return (
    <DashShell phone="/account/notifications">
      <PageHead title="Settings" actions={<button type="button" onClick={() => show("Saved")} className={btnPrimary}>Save</button>} />
      <LinkTabs items={tabs} active="Notifications" />
      <Card className="max-w-[760px] gap-1">
        <H2>Email me about</H2>
        {Object.keys(on).map((k) => (
          <div key={k} className="flex min-h-14 items-center gap-3 border-b border-[#E9EDF1] last:border-0">
            <span className="flex flex-1 flex-col">
              <span className="text-[14px] text-[#172B3A]">{k}</span>
              <span className="text-[12px] text-[#68788A]">{subs[k] === "On" ? (on[k] ? "On" : "Off") : subs[k]}</span>
            </span>
            <Toggle on={on[k]} onChange={(b) => setOn({ ...on, [k]: b })} label={k} />
          </div>
        ))}
      </Card>
      {node}
    </DashShell>
  );
}

/* ------------------------------------------------------------------ OW33 Place listing */

const HOURS: [string, string][] = [
  ["Monday", "Closed"],
  ["Tuesday to Wednesday", "4 PM to 12 AM"],
  ["Thursday", "4 PM to 2 AM"],
  ["Friday to Saturday", "4 PM to 3 AM"],
  ["Sunday", "2 PM to 12 AM"],
];
const AMEN: [string, string[]][] = [
  ["Getting there", ["No parking", "Street parking", "Parking on site", "Valet", "Step free entry"]],
  ["Comfort", ["Air conditioning", "Power backup", "WiFi", "Outdoor seating", "Smoking area"]],
  ["Paying", ["Card", "Transfer", "Cash"]],
  ["Who it is for", ["Good for groups", "Kid friendly", "All ages", "18+ from 9 PM"]],
  ["Booking", ["Walk ins welcome", "Reservations"]],
];
const AMEN_ON = ["Valet", "Step free entry", "Air conditioning", "Power backup", "Outdoor seating", "Card", "Transfer", "Cash", "Good for groups", "18+ from 9 PM", "Walk ins welcome", "Reservations"];

export function PlaceListing() {
  const tabs = useSettingsTabs();
  const host = useHost();
  const { show, node } = useToast();
  const [v, setV] = useState({ about: "A rooftop bar with lagoon views, small plates and a long cocktail list.", phone: "0803 000 0100", wa: "0803 000 0100", menu: "skylinelounge.ng/menu", ig: "@skylinelounge", web: "skylinelounge.ng", dress: "Smart casual" });
  const [amen, setAmen] = useState<string[] | null>(null);
  const [closed, setClosed] = useState<boolean | null>(null);
  const [special, setSpecial] = useState(false);
  const [sd, setSd] = useState({ date: "Fri 26 Dec", hours: "Closed", note: "Boxing Day" });
  const a = amen ?? host.amenities ?? AMEN_ON;
  const c = closed ?? host.closedForNow;
  const set = (k: keyof typeof v) => (x: string) => setV({ ...v, [k]: x });
  const waiting = VENUE_REQUESTS.filter((r) => !host.venueRequests[r.id]).length;
  const toReply = PLACE_REVIEWS.filter((r) => !r.reply && !host.replies[r.id]).length;
  return (
    <DashShell phone="/host/place">
      <PageHead
        crumbs={[["Settings", "/dashboard/settings"], ["Place"]]}
        title="Skyline Lounge"
        sub="Your place on Xiventa · Owner managed"
        actions={
          <>
            <Link href="/places/skyline-lounge" className={btnSecondary}>
              View public page
            </Link>
            <button
              type="button"
              onClick={() => {
                updateHost({ amenities: a, closedForNow: c });
                show("Saved. Changes are live.");
              }}
              className={btnPrimary}
            >
              Save
            </button>
          </>
        }
      />
      <LinkTabs items={tabs} active="Place" />
      <div className="flex items-start gap-6">
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <Card className="gap-4">
            <H2>Goes live straight away</H2>
            <span className="text-[13px] text-[#172B3A]">Photos</span>
            <ImageDrop src={flyer} hint="Square or 4:5 works best on cards." onChange={() => show("Photo manager opens here")} />
            <WField label="About" value={v.about} onChange={set("about")} />
            <div className="grid grid-cols-2 gap-4">
              <WField label="Phone" value={v.phone} onChange={set("phone")} />
              <WField label="WhatsApp" value={v.wa} onChange={set("wa")} />
              <WField label="Menu link" value={v.menu} onChange={set("menu")} />
              <WField label="Instagram" value={v.ig} onChange={set("ig")} />
            </div>
            <WField label="Website (optional)" value={v.web} onChange={set("web")} />
          </Card>
          <Card className="gap-1">
            <H2>Opening hours</H2>
            {(host.hours ? host.hours : HOURS).map(([d, h]) => (
              <Link key={d} href="/host/place/hours" className="flex min-h-12 items-center justify-between border-b border-[#E9EDF1]">
                <span className="text-[14px] text-[#172B3A]">{d}</span>
                <span className="text-[13px] text-[#4D5E70]">{h}</span>
              </Link>
            ))}
            <span className="pt-4 text-[16px] font-bold text-[#172B3A]">Special days</span>
            {[{ date: "Thu 25 Dec", hours: "Closed", note: "" }, { date: "Wed 31 Dec", hours: "4 PM to 4 AM", note: "" }, ...host.specialDays].map((d) => (
              <div key={d.date + d.note} className="flex min-h-12 items-center justify-between border-b border-[#E9EDF1]">
                <span className="text-[14px] text-[#172B3A]">{d.date}</span>
                <span className="text-[13px] text-[#4D5E70]">
                  {d.hours}
                  {d.note && ` · ${d.note}`}
                </span>
              </div>
            ))}
            <button type="button" onClick={() => setSpecial(true)} className={`${btnLink} py-3 text-left`}>
              Add a special day
            </button>
            <div className="flex min-h-14 items-center gap-3">
              <span className="flex flex-1 flex-col">
                <span className="text-[14px] text-[#172B3A]">Temporarily closed</span>
                <span className="text-[12px] text-[#68788A]">Hides your hours and shows when you reopen</span>
              </span>
              <Toggle on={c} onChange={setClosed} label="Temporarily closed" />
            </div>
          </Card>
          <Card className="gap-3">
            <H2>Amenities</H2>
            <Foot>Tick what applies. Anything you skip stays hidden on your place page.</Foot>
            {AMEN.map(([g, opts]) => (
              <div key={g} className="flex flex-col gap-2">
                <span className="text-[13px] font-bold text-[#172B3A]">{g}</span>
                <Chips options={opts} value={a} onChange={(x) => setAmen(a.includes(x) ? a.filter((y) => y !== x) : [...a, x])} />
              </div>
            ))}
            <WField label="Dress code (optional)" value={v.dress} onChange={set("dress")} />
          </Card>
        </div>
        <div className="flex w-[380px] shrink-0 flex-col gap-4">
          <Card className="!pb-2">
            <CardTitle>Needs review</CardTitle>
            <Foot>Name, address and category changes are checked first.</Foot>
            {[
              ["Name", "Skyline Lounge"],
              ["Address", "Ozumba Mbadiwe Avenue, Victoria Island"],
              ["Category", "Bars and lounges"],
            ].map(([k, s]) => (
              <ManageRow key={k} icon={<MapPinIcon size={18} />} title={k} sub={s} onClick={() => show(`${k} changes are checked by Xiventa before they show`)} />
            ))}
          </Card>
          <Notice title="Change in review" body="You asked to rename it to Skyline Lounge and Grill on Tue 21 Oct." />
          <Card className="!py-2">
            <ManageRow icon={<CalendarIcon size={18} />} title="Venue requests" sub={waiting ? `${waiting} events waiting for you` : "Nothing waiting"} href="/dashboard/settings/place/requests" />
            <ManageRow icon={<StarIcon size={18} />} title="Reviews" sub={`4.6 from 38${toReply ? ` · ${toReply} to reply to` : ""}`} href="/dashboard/settings/place/reviews" />
          </Card>
        </div>
      </div>
      <DialogForm
        open={special}
        onClose={() => setSpecial(false)}
        title="Add a special day"
        action="Save special day"
        onSubmit={() => {
          updateHost((s) => ({ specialDays: [...s.specialDays, sd] }));
          setSpecial(false);
          show("Special day added");
        }}
      >
        <WField label="Date" value={sd.date} onChange={(x) => setSd({ ...sd, date: x })} />
        <WField label="Hours" value={sd.hours} onChange={(x) => setSd({ ...sd, hours: x })} hint='Type "Closed" or the hours, e.g. 4 PM to 12 AM' />
        <WField label="Note (optional)" value={sd.note} onChange={(x) => setSd({ ...sd, note: x })} />
      </DialogForm>
      {node}
    </DashShell>
  );
}

/* ------------------------------------------------------------------ OW34 Claim a place, OW43 Add a new place */

export function ClaimPlace() {
  const router = useRouter();
  const { show, node } = useToast();
  const [q, setQ] = useState("Skyline Lounge");
  const [sel, setSel] = useState<string | null>("Skyline Lounge");
  const [how, setHow] = useState<string | null>("Code to the listed phone or email");
  const hits = [
    { name: "Skyline Lounge", line: "Ozumba Mbadiwe Avenue, Victoria Island · Not claimed" },
    { name: "Skyline Rooftop Bar", line: "Admiralty Way, Lekki Phase 1 · Owner managed" },
  ].filter((h) => h.name.toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <DashShell phone="/host/place/add">
      <PageHead
        crumbs={[["Settings", "/dashboard/settings"]]}
        title="We are a place"
        sub="Claim your listing or add a new one"
        actions={
          <>
            <Link href="/dashboard/settings/place/new" className={btnSecondary}>
              Add a new place
            </Link>
            <button
              type="button"
              disabled={!sel || !how}
              onClick={() => {
                show(how?.startsWith("Code") ? "Code sent to 0803 000 0100" : "Claim sent. Our team checks it.");
                if (how?.startsWith("Code")) setTimeout(() => router.push("/dashboard/settings/place"), 900);
              }}
              className={btnPrimary}
            >
              Submit claim
            </button>
          </>
        }
      />
      <div className="flex items-start gap-6">
        <Card className="min-w-0 flex-1 gap-3">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search for your place" className="h-12 rounded-[12px] border border-[#D5DCE3] px-4 text-[14px] text-[#172B3A] focus:border-[#E22765] focus:outline-none" />
          {hits.map((h) => {
            const managed = h.line.includes("Owner managed");
            return (
              <button key={h.name} type="button" disabled={managed} onClick={() => setSel(h.name)} className={`flex items-center gap-3 rounded-[12px] border px-4 py-3 text-left ${sel === h.name ? "border-[#E22765] bg-[#FDEEF3]" : "border-[#E9EDF1]"}`}>
                <MapPinIcon size={20} className="text-[#E22765]" />
                <span className="flex flex-1 flex-col">
                  <span className="text-[14px] text-[#172B3A]">{h.name}</span>
                  <span className="text-[12px] text-[#68788A]">{h.line}</span>
                </span>
                {sel === h.name && <Status label="Selected" tone="pink" />}
              </button>
            );
          })}
          <span className="pt-3 text-[16px] font-bold text-[#172B3A]">How should we check it is yours?</span>
          <RadioRows
            options={[
              ["Code to the listed phone or email", "Fastest. We send a code to 0803 000 0100"],
              ["CAC document", "Business name must match"],
              ["Photo taken at the place", "Shows the sign and today’s date on your phone"],
            ]}
            value={how}
            onChange={setHow}
          />
        </Card>
        <Notice title="Already owned?" body="If someone else manages this place, they are told and a Xiventa admin decides. Nothing changes hands until then." />
      </div>
      {node}
    </DashShell>
  );
}

const CATS = ["Restaurants", "Cafés & Bakeries", "Bars & Lounges", "Clubs", "Beaches", "Parks & Nature", "Hotels & Pools", "More"] as const;

export function NewPlaceWeb() {
  const router = useRouter();
  const [v, setV] = useState({ name: "", addr: "", cac: "" });
  const [cat, setCat] = useState<(typeof CATS)[number] | null>(null);
  const [photo, setPhoto] = useState(false);
  const [proof, setProof] = useState<string | null>("CAC document");
  const set = (k: keyof typeof v) => (x: string) => setV({ ...v, [k]: x });
  const ok = v.name.trim() && cat && v.addr.trim() && photo && proof && (proof !== "CAC document" || v.cac.trim());
  return (
    <DashShell phone="/host/place/new">
      <PageHead
        crumbs={[["Settings", "/dashboard/settings"], ["Place", "/dashboard/settings/place/claim"], ["Add a new place"]]}
        title="Add a new place"
        sub="We check it is yours before it goes live"
        actions={
          <button
            type="button"
            disabled={!ok}
            onClick={() => {
              updateHost({ place: { name: v.name.trim(), status: "review" } });
              router.push("/host/place?state=review");
            }}
            className={btnPrimary}
          >
            Send for review
          </button>
        }
      />
      <div className="flex max-w-[860px] flex-col gap-4">
        <Card className="gap-4">
          <H2>About the place</H2>
          <WField label="Name" value={v.name} onChange={set("name")} />
          <div className="flex flex-col gap-2">
            <span className="text-[13px] text-[#172B3A]">Category</span>
            <Chips options={CATS} value={cat ? [cat] : []} onChange={setCat} />
          </div>
          <WField label="Street address" value={v.addr} onChange={set("addr")} />
          {v.addr.trim() && (
            <div className="flex h-[160px] items-center justify-center rounded-[12px] bg-[#E9EDF1]">
              <MapPinIcon size={32} className="text-[#E22765]" />
            </div>
          )}
          <span className="text-[13px] text-[#172B3A]">A photo of the place</span>
          <button type="button" onClick={() => setPhoto(true)} className={`flex h-[120px] items-center justify-center rounded-[12px] border border-dashed text-[14px] ${photo ? "border-[#067647] bg-[#E3F8EF] text-[#067647]" : "border-[#B4BFCA] bg-[#F4F6F8] text-[#4D5E70]"}`}>
            {photo ? "Photo added" : "Choose image · one is enough for now"}
          </button>
          <Foot>Hours, menu and amenities come later, once your place is checked.</Foot>
        </Card>
        <Card className="gap-3">
          <H2>Show it is yours</H2>
          <RadioRows
            options={[
              ["CAC document", "The business name must match the place"],
              ["Photo taken at the place", "Use the Xiventa app at the entrance"],
              ["Code to the listed phone", "Only for places already on Xiventa"],
            ]}
            value={proof}
            onChange={setProof}
          />
          {proof === "CAC document" && <WField label="CAC certificate" value={v.cac} onChange={set("cac")} hint="Business name and RC number, e.g. Kiln Ventures Ltd · RC 1234567" />}
        </Card>
      </div>
    </DashShell>
  );
}

/* ------------------------------------------------------------------ OW44 Venue requests, OW45 Reviews */

export function VenueRequestsWeb() {
  const host = useHost();
  const { show, node } = useToast();
  const [always, setAlways] = useState(false);
  const [decline, setDecline] = useState<string | null>(null);
  const [reason, setReason] = useState<string | null>(null);
  const list = VENUE_REQUESTS.filter((v) => !host.venueRequests[v.id]);
  const d = VENUE_REQUESTS.find((v) => v.id === decline);
  return (
    <DashShell phone="/host/place/requests">
      <PageHead crumbs={[["Settings", "/dashboard/settings"], ["Place", "/dashboard/settings/place"], ["Venue requests"]]} title="Venue requests" sub="Events hosts listed at Skyline Lounge" />
      <div className="flex items-start gap-6">
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <H2>Waiting for you ({list.length})</H2>
          {list.map((v) => (
            <Card key={v.id} className="flex-row items-center gap-4">
              <span className="relative h-[96px] w-[80px] shrink-0 overflow-hidden rounded-[12px] bg-[#E9EDF1]">{v.image && <Image src={v.image} alt="" fill sizes="80px" className="object-cover" />}</span>
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="text-[12px] text-[#C81E57]">{v.date}</span>
                <span className="text-[16px] font-bold text-[#172B3A]">{v.title}</span>
                <span className="text-[12px] text-[#4D5E70]">
                  From {v.host} · Verified organizer · {v.sent}
                </span>
                <span className="text-[14px] font-bold text-[#172B3A]">{v.price === "Free" ? "Free" : `From ${v.price}`}</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  setReason(null);
                  setDecline(v.id);
                }}
                className={btnSecondary}
              >
                Decline
              </button>
              <button
                type="button"
                onClick={() => {
                  updateHost((s) => ({ venueRequests: { ...s.venueRequests, [v.id]: "accepted" } }));
                  show(`${v.title} now shows on your page`);
                }}
                className={btnPrimary}
              >
                Accept
              </button>
            </Card>
          ))}
          {!list.length && <Card className="items-center py-10 text-[14px] text-[#4D5E70]">Nothing waiting for you.</Card>}
        </div>
        <div className="flex w-[380px] shrink-0 flex-col gap-4">
          <Card className="gap-2">
            <H2>How venue requests work</H2>
            <Foot>Events only show under &quot;Upcoming at Skyline Lounge&quot; once you accept.</Foot>
            <Foot>Hosts can still sell tickets while they wait.</Foot>
            <Foot>If you decline, the host is told and Xiventa looks into it.</Foot>
          </Card>
          <Card className="flex-row items-center gap-3">
            <span className="flex flex-1 flex-col">
              <span className="text-[14px] text-[#172B3A]">Always accept from South Circle</span>
              <span className="text-[12px] text-[#68788A]">Their new events show straight away</span>
            </span>
            <Toggle on={always} onChange={setAlways} label="Always accept from South Circle" />
          </Card>
        </div>
      </div>
      <Sheet
        open={!!d}
        onClose={() => setDecline(null)}
        title={`Decline ${d?.title ?? ""}?`}
        footer={
          <button
            type="button"
            disabled={!reason}
            onClick={() => {
              if (d) updateHost((s) => ({ venueRequests: { ...s.venueRequests, [d.id]: "declined" } }));
              setDecline(null);
              show(`Declined. ${d?.host} is told.`);
            }}
            className={sheetPrimary}
          >
            Decline
          </button>
        }
      >
        <p className="pb-2 text-[14px] text-[#4D5E70]">Tell us why. Xiventa looks into it and {d?.host} is told now.</p>
        <RadioRows options={[["Not happening here"], ["We didn't agree to this"], ["Wrong date"], ["Something else"]]} value={reason} onChange={setReason} />
      </Sheet>
      {node}
    </DashShell>
  );
}

export function PlaceReviewsWeb() {
  const host = useHost();
  const { show, node } = useToast();
  const [replying, setReplying] = useState<string | null>(null);
  const [text, setText] = useState("");
  const replyOf = (r: (typeof PLACE_REVIEWS)[number]) => host.replies[r.id] ?? r.reply;
  const waiting = PLACE_REVIEWS.filter((r) => !replyOf(r));
  const r = PLACE_REVIEWS.find((x) => x.id === replying);
  return (
    <DashShell phone="/host/place/reviews">
      <PageHead crumbs={[["Settings", "/dashboard/settings"], ["Place", "/dashboard/settings/place"], ["Reviews"]]} title="Reviews" sub="What guests say about Skyline Lounge" />
      <div className="flex items-start gap-6">
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <H2>Waiting for a reply ({waiting.length})</H2>
          {PLACE_REVIEWS.map((x) => (
            <Card key={x.id} className="gap-2">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F1EEFF] text-[12px] text-[#5B3FD6]">{x.initials}</span>
                <span className="flex flex-1 flex-col">
                  <span className="text-[14px] text-[#172B3A]">{x.name}</span>
                  <span className="text-[12px] text-[#68788A]">{x.when}</span>
                </span>
                <Stars value={x.stars} size={14} />
              </div>
              <p className="text-[14px] leading-5 text-[#172B3A]">{x.text}</p>
              {replyOf(x) ? (
                <div className="rounded-[12px] bg-[#F4F6F8] px-3 py-2">
                  <span className="text-[12px] font-bold text-[#172B3A]">Your reply</span>
                  <p className="text-[13px] text-[#4D5E70]">{replyOf(x)}</p>
                </div>
              ) : (
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => show("Reported. Our team takes a look.")} className={btnSecondary}>
                    Report
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setText("");
                      setReplying(x.id);
                    }}
                    className={btnPrimary}
                  >
                    Reply
                  </button>
                </div>
              )}
            </Card>
          ))}
        </div>
        <div className="flex w-[380px] shrink-0 flex-col gap-4">
          <Card className="items-start gap-1">
            <span className="text-[40px] font-bold leading-[48px] text-[#172B3A]">4.6</span>
            <Stars value={5} size={16} />
            <span className="text-[13px] text-[#4D5E70]">38 reviews</span>
            <Foot>Ratings show on your place page once you have 5 reviews.</Foot>
          </Card>
          <Notice title="You can reply to each review once, and edit your reply later." />
          <Notice tone="warn" title="You can't remove reviews. Report one if it breaks the rules." />
        </div>
      </div>
      <DialogForm
        open={!!r}
        onClose={() => setReplying(null)}
        title={`Reply to ${r?.name.split(" ")[0] ?? ""}`}
        action="Post reply"
        disabled={!text.trim()}
        onSubmit={() => {
          if (r) updateHost((s) => ({ replies: { ...s.replies, [r.id]: text.trim() } }));
          setReplying(null);
          show("Reply posted");
        }}
      >
        {r && <p className="text-[14px] italic text-[#4D5E70]">&quot;{r.text}&quot;</p>}
        <WField label="Your reply" value={text} onChange={setText} area hint="Shows under the review. You can edit it later." />
      </DialogForm>
      {node}
    </DashShell>
  );
}
