"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { CreateShell, Chips } from "@/components/create/CreateParts";
import { Field, Toggle } from "@/components/checkout/CheckoutParts";
import { ActionRow, Segmented } from "@/components/mobile/AppParts";
import { Sheet, sheetPrimary, useToast } from "@/components/shared/Sheet";
import { RadioRows, Stars } from "@/components/tickets/TicketParts";
import { BuildingIcon, CalendarIcon, CameraIcon, ClockIcon, ImageIcon, MapPinIcon, PhoneIcon, PlusIcon, SearchIcon, StarIcon, UsersIcon } from "@/components/icons";
import { PLACE_REVIEWS, VENUE_REQUESTS, updateHost, useHost } from "@/lib/hosting";
import { Area, Banner, CheckRow, Initials, Note, PairButtons, Pill, Select } from "./HostParts";

const WEEK: [string, string][] = [
  ["Monday", "Closed"],
  ["Tuesday", "4 PM to 12 AM"],
  ["Wednesday", "4 PM to 12 AM"],
  ["Thursday", "4 PM to 2 AM"],
  ["Friday", "4 PM to 3 AM"],
  ["Saturday", "4 PM to 3 AM"],
  ["Sunday", "2 PM to 12 AM"],
];
const SPECIAL = [
  { date: "Thu 25 Dec", hours: "Closed", note: "Christmas Day" },
  { date: "Wed 31 Dec", hours: "4 PM to 4 AM", note: "New Year's Eve" },
];

const section = (t: string) => <span className="pb-1 pt-5 text-[14px] font-bold leading-5 text-[#172B3A]">{t}</span>;

/* ------------------------------------------------------------------ OM24 Your place, OM28 Place in review */

export function YourPlace() {
  const router = useRouter();
  const sp = useSearchParams();
  const s = useHost();
  const { show, node } = useToast();
  const review = sp.get("state") === "review" || s.place?.status === "review";
  const name = review ? (s.place?.name ?? "Kiln Coffee Ikoyi") : "Skyline Lounge";
  const amen = !!s.amenities?.length;
  const menu = false;
  const waiting = VENUE_REQUESTS.filter((v) => !s.venueRequests[v.id]).length;
  const toReply = PLACE_REVIEWS.filter((r) => !r.reply && !s.replies[r.id]).length;
  const hoursSet = review ? !!s.hours : true;
  const done = (review ? 1 : 2) + (hoursSet && review ? 1 : 0) + (amen ? 1 : 0) + (menu ? 1 : 0) + 2;

  if (review)
    return (
      <CreateShell title="Your place" subtitle={name} back="/host" action="Go to Your place" onAction={() => router.push("/host")}>
        <Pill label="In review · Not public yet" tone="amber" dot />
        <div className="pt-3">
          <Banner tone="blue" title="We're checking your place" body="We'll let you know once it's checked. In the meantime you can add hours, a menu and amenities, so it's ready when it goes live." />
        </div>
        <div className="mt-4 flex flex-col rounded-2xl border border-[#E9EDF1] px-4 pt-3">
          <span className="text-[14px] font-bold text-[#172B3A]">Finish your listing</span>
          <CheckRow done title="Photos" sub="1 photo" />
          <CheckRow done={hoursSet} title="Opening hours" sub={hoursSet ? "Saved" : "Add your weekly hours"} onAdd={() => router.push("/host/place/hours")} />
          <CheckRow done={menu} title="Menu" sub="Add a menu link or photos" onAdd={() => router.push("/host/place/contact")} />
          <CheckRow done={amen} title="Amenities" sub={amen ? `${s.amenities!.length} picked` : "Parking, payments and more"} onAdd={() => router.push("/host/place/amenities")} />
        </div>
      </CreateShell>
    );

  return (
    <CreateShell title="Your place" subtitle={name} back="/host">
      <span className="inline-flex h-7 w-fit items-center gap-2 rounded-full bg-[#067647] px-3 text-[12px] font-bold text-white">
        <span className="h-1.5 w-1.5 rounded-full bg-white" />
        {s.closedForNow ? "Closed for now · Verified place" : "Live · Verified place"}
      </span>
      {(!amen || !menu) && (
        <div className="mt-4 flex flex-col rounded-2xl border border-[#E9EDF1] px-4 pt-4">
          <span className="text-[14px] font-bold text-[#172B3A]">Finish your listing</span>
          <span className="pt-2 text-[12px] leading-4 text-[#4D5E70]">{Math.min(done, 6)} of 6 done. Places with hours and photos get saved more.</span>
          <CheckRow done title="Photos" sub="12 photos" />
          <CheckRow done title="Opening hours" sub="Every day, 4 PM to 2 AM" />
          <CheckRow done={menu} title="Menu" sub="Add a menu link or photos" onAdd={() => router.push("/host/place/contact")} />
          <CheckRow done={amen} title="Amenities" sub={amen ? `${s.amenities!.length} picked` : "Parking, payments and more"} onAdd={() => router.push("/host/place/amenities")} />
        </div>
      )}
      {section("Your place")}
      <ActionRow icon={<BuildingIcon size={20} />} title="Details" subtitle="Name, category and address" onClick={() => show("Name, category and address changes are reviewed")} />
      <ActionRow icon={<ImageIcon size={20} />} title="Photos" subtitle="12 photos" onClick={() => show("Photo manager opens here")} />
      <ActionRow icon={<ClockIcon size={20} />} title="Opening hours" subtitle={s.closedForNow ? "Closed for now" : "Every day, 4 PM to 2 AM"} href="/host/place/hours" />
      <ActionRow icon={<CalendarIcon size={20} />} title="Special days" subtitle="Closed Thu 25 Dec, Christmas Day" href="/host/place/hours#special" />
      <ActionRow icon={<PhoneIcon size={20} />} title="Menu and contact" subtitle="Phone, WhatsApp, Instagram, website" href="/host/place/contact" />
      <ActionRow icon={<StarIcon size={20} />} title="Amenities" subtitle={amen ? `${s.amenities!.length} picked` : "Not set yet"} href="/host/place/amenities" />
      {section("People and events")}
      <ActionRow icon={<CalendarIcon size={20} />} title="Venue requests" subtitle={waiting ? `${waiting} events waiting for you` : "Nothing waiting"} href="/host/place/requests" />
      <ActionRow icon={<UsersIcon size={20} />} title="Reviews" subtitle={`4.6 from 38${toReply ? ` · ${toReply} waiting for a reply` : ""}`} href="/host/place/reviews" />
      <ActionRow icon={<PlusIcon size={20} />} title="Add another place" subtitle="Or claim one already on Xiventa" href="/host/place/add" />
      {node}
    </CreateShell>
  );
}

/* ------------------------------------------------------------------ OM25 Add or claim, OM26 Add a new place, OM27 Show it is yours */

const FOUND = [
  { name: "Kiln Coffee", line: "Herbert Macaulay Way, Yaba · Not claimed", claim: true },
  { name: "Kiln and Co", line: "Admiralty Way, Lekki · Managed by its owner", claim: false },
];

export function AddPlace() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const hits = q.trim().length >= 2 ? FOUND.filter((f) => f.name.toLowerCase().includes(q.trim().toLowerCase())) : [];
  return (
    <CreateShell title="Add your place" back="/host/place">
      <p className="pb-4 text-[14px] leading-5 text-[#4D5E70]">Search first. If your place is already on Xiventa, claim it so you can manage it.</p>
      <label className="flex h-12 items-center gap-3 rounded-full border border-[#D5DCE3] bg-white px-4 focus-within:border-[#E22765]">
        <SearchIcon size={20} className="text-[#4D5E70]" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name of your place" className="min-w-0 flex-1 bg-transparent text-[14px] text-[#172B3A] placeholder:text-[#68788A] focus:outline-none" />
      </label>
      {hits.length > 0 && <span className="pb-1 pt-5 text-[11px] uppercase tracking-[0.06em] text-[#4D5E70]">On Xiventa</span>}
      {hits.map((f) => (
        <ActionRow key={f.name} icon={<MapPinIcon size={20} />} title={f.name} subtitle={f.line} onClick={f.claim ? () => router.push("/host/place/proof?claim=1") : undefined} trailing={f.claim ? undefined : <Pill label="Managed" />} />
      ))}
      <span className="pb-1 pt-5 text-[11px] uppercase tracking-[0.06em] text-[#4D5E70]">Not listed?</span>
      <ActionRow icon={<PlusIcon size={20} />} title="Add a new place" subtitle="We check it is yours before it goes live" href="/host/place/new" />
    </CreateShell>
  );
}

const CATS = ["Restaurants", "Cafés & Bakeries", "Bars & Lounges", "Clubs", "Beaches", "Hotels & Pools", "More"] as const;

export function NewPlace() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [cat, setCat] = useState<(typeof CATS)[number] | null>(null);
  const [addr, setAddr] = useState("");
  const [photo, setPhoto] = useState(false);
  const ok = name.trim() && cat && addr.trim() && photo;
  return (
    <CreateShell
      title="Add a new place"
      back="/host/place/add"
      step={{ label: "Your place", n: 1, of: 2 }}
      action="Next"
      disabled={!ok}
      onAction={() => {
        updateHost({ place: { name: name.trim(), status: "review" } });
        router.push("/host/place/proof");
      }}
    >
      <div className="flex flex-col gap-4">
        <Field label="Name" value={name} onChange={setName} placeholder="Kiln Coffee Ikoyi" />
        <div className="flex flex-col gap-2">
          <span className="text-[13px] text-[#172B3A]">Category</span>
          <Chips options={CATS} value={cat ? [cat] : []} onChange={setCat} />
        </div>
        <Field label="Street address" value={addr} onChange={setAddr} placeholder="14 Bourdillon Road, Ikoyi" hint="Move the pin to the entrance so people find it." />
        {addr.trim() && (
          <div className="relative flex h-[140px] items-center justify-center overflow-hidden rounded-2xl bg-[#E9EDF1]">
            <MapPinIcon size={32} className="text-[#E22765]" />
            <span className="absolute bottom-3 left-3 rounded-full bg-white px-3 py-1 text-[12px] text-[#172B3A]">{addr}</span>
          </div>
        )}
        <div className="flex flex-col gap-2">
          <span className="text-[13px] text-[#172B3A]">A photo of the place</span>
          <button type="button" onClick={() => setPhoto(true)} className={`flex h-[120px] flex-col items-center justify-center gap-1 rounded-2xl border border-dashed ${photo ? "border-[#067647] bg-[#E7F8EF]" : "border-[#B4BFCA] bg-[#F4F6F8]"} text-[14px] text-[#172B3A]`}>
            <ImageIcon size={24} />
            {photo ? "Photo added" : "Choose image"}
            <span className="text-[12px] text-[#68788A]">JPG or PNG, at least 1080 px wide</span>
          </button>
          <span className="text-[12px] text-[#68788A]">One is enough for now. You can add more later.</span>
        </div>
        <Note>Hours, menu and amenities come later. You can add them once your place is checked.</Note>
      </div>
    </CreateShell>
  );
}

export function PlaceProof() {
  const router = useRouter();
  const sp = useSearchParams();
  const claim = sp.get("claim") === "1";
  const opts: [string, string][] = claim
    ? [
        ["Code to the listed phone", "We send a code to 0803 *** 0300"],
        ["CAC document", "The business name must match the place"],
        ["Photo taken at the place", "Your location must match the address"],
      ]
    : [
        ["Photo taken at the place", "At the entrance, with the sign in view"],
        ["CAC document", "The business name must match the place"],
        ["Code to the listed phone", "Only for places already on Xiventa"],
      ];
  const [pick, setPick] = useState<string | null>(opts[0][0]);
  const [shot, setShot] = useState(false);
  const [codeOpen, setCodeOpen] = useState(false);
  const [code, setCode] = useState("");
  const isCode = pick === "Code to the listed phone";
  return (
    <CreateShell
      title={claim ? "Claim Kiln Coffee" : "Show it is yours"}
      back={claim ? "/host/place/add" : "/host/place/new"}
      step={claim ? undefined : { label: "Proof", n: 2, of: 2 }}
      action={isCode ? "Send code" : "Send for review"}
      disabled={!claim && isCode}
      onAction={() => {
        if (isCode) {
          setCodeOpen(true);
          return;
        }
        updateHost((s) => ({ place: { name: s.place?.name ?? "Kiln Coffee", status: "review" } }));
        router.push("/host/place?state=review");
      }}
    >
      <p className="pb-3 text-[14px] leading-5 text-[#4D5E70]">{claim ? "Pick one. A code to the listed phone is the quickest and needs no review." : "Pick one. Our team checks it before your place goes live."}</p>
      <RadioRows options={opts} value={pick} onChange={setPick} />
      {pick === "Photo taken at the place" && (
        <div className="flex flex-col gap-2 pt-4">
          <span className="text-[13px] text-[#172B3A]">Your photo</span>
          <button type="button" onClick={() => setShot(true)} className="flex h-[120px] flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-[#B4BFCA] bg-[#F4F6F8] text-[14px] text-[#172B3A]">
            <CameraIcon size={24} />
            {shot ? "Photo at the entrance" : "Take a photo"}
          </button>
          {shot && <span className="text-[12px] text-[#067647]">Taken just now at 14 Bourdillon Road, Ikoyi</span>}
        </div>
      )}
      <Sheet
        open={codeOpen}
        onClose={() => setCodeOpen(false)}
        title="Enter the code"
        footer={
          <button
            type="button"
            disabled={code.length !== 6}
            onClick={() => {
              updateHost({ place: { name: "Kiln Coffee", status: "live" } });
              router.push("/host/place");
            }}
            className={sheetPrimary}
          >
            Confirm
          </button>
        }
      >
        <Field label="6 digit code" value={code} onChange={(x) => setCode(x.replace(/\D/g, "").slice(0, 6))} inputMode="tel" hint="Sent to 0803 *** 0300. Any 6 digits work in this preview." />
      </Sheet>
    </CreateShell>
  );
}

/* ------------------------------------------------------------------ OM29 Opening hours, Special day */

const TIMES = ["Closed", "10 AM to 10 PM", "2 PM to 12 AM", "4 PM to 12 AM", "4 PM to 2 AM", "4 PM to 3 AM", "Open 24 hours"];

export function Hours() {
  const router = useRouter();
  const s = useHost();
  const { show, node } = useToast();
  const [week, setWeek] = useState<[string, string][] | null>(null);
  const [closed, setClosed] = useState<boolean | null>(null);
  const [edit, setEdit] = useState<string | null>(null);
  const [special, setSpecial] = useState(false);
  const [sd, setSd] = useState({ date: "Thu 25 Dec", mode: "Closed all day", note: "Christmas Day", hours: "4 PM to 12 AM" });
  const w = week ?? s.hours ?? WEEK;
  const c = closed ?? s.closedForNow;
  const days = [...SPECIAL, ...s.specialDays];
  return (
    <CreateShell
      title="Opening hours"
      subtitle="Skyline Lounge"
      back="/host/place"
      action="Save"
      onAction={() => {
        updateHost({ hours: w, closedForNow: c });
        show("Hours saved");
        setTimeout(() => router.push("/host/place"), 700);
      }}
    >
      {section("Every week")}
      {w.map(([d, h]) => (
        <button key={d} type="button" onClick={() => setEdit(d)} className="flex min-h-12 items-center justify-between border-b border-[#E9EDF1] text-left">
          <span className="text-[15px] text-[#172B3A]">{d}</span>
          <span className={`text-[14px] ${h === "Closed" ? "text-[#68788A]" : "text-[#172B3A]"}`}>{h}</span>
        </button>
      ))}
      <span id="special" />
      {section("Special days")}
      <span className="text-[12px] leading-4 text-[#4D5E70]">Holidays and one off changes. They show on your place page on the day.</span>
      {days.map((d) => (
        <div key={d.date + d.note} className="flex min-h-12 items-center justify-between border-b border-[#E9EDF1]">
          <span className="text-[15px] text-[#172B3A]">{d.date}</span>
          <span className="text-[13px] text-[#4D5E70]">
            {d.hours}
            {d.note && ` · ${d.note}`}
          </span>
        </div>
      ))}
      <ActionRow icon={<PlusIcon size={20} />} title="Add a special day" onClick={() => setSpecial(true)} />
      {section("Temporarily closed")}
      <div className="flex items-center gap-3 py-2">
        <span className="flex flex-1 flex-col">
          <span className="text-[15px] text-[#172B3A]">Closed for now</span>
          <span className="text-[12px] text-[#68788A]">Hides opening hours and shows when you reopen</span>
        </span>
        <Toggle on={c} onChange={setClosed} label="Closed for now" />
      </div>

      <Sheet
        open={!!edit}
        onClose={() => setEdit(null)}
        title={edit ?? "Day"}
        footer={
          <button type="button" onClick={() => setEdit(null)} className={sheetPrimary}>
            Done
          </button>
        }
      >
        {edit && <RadioRows options={TIMES.map((t) => [t])} value={w.find(([d]) => d === edit)?.[1] ?? null} onChange={(v) => setWeek(w.map(([d, h]) => [d, d === edit ? v : h]))} />}
      </Sheet>
      <Sheet
        open={special}
        onClose={() => setSpecial(false)}
        title="Add a special day"
        footer={
          <button
            type="button"
            onClick={() => {
              updateHost((st) => ({ specialDays: [...st.specialDays, { date: sd.date, hours: sd.mode === "Closed all day" ? "Closed" : sd.hours, note: sd.note }] }));
              setSpecial(false);
              show("Special day added");
            }}
            className={sheetPrimary}
          >
            Save special day
          </button>
        }
      >
        <div className="flex flex-col gap-4">
          <Select label="Date" value={sd.date} onChange={(v) => setSd({ ...sd, date: v })} options={["Thu 25 Dec", "Fri 26 Dec", "Wed 31 Dec", "Thu 1 Jan"]} />
          <Segmented
            value={sd.mode}
            onChange={(v) => setSd({ ...sd, mode: v })}
            items={[
              { value: "Closed all day", label: "Closed all day" },
              { value: "Different hours", label: "Different hours" },
            ]}
          />
          {sd.mode === "Different hours" && <Select label="Hours" value={sd.hours} onChange={(v) => setSd({ ...sd, hours: v })} options={TIMES.slice(1)} />}
          <Field label="Note (optional)" value={sd.note} onChange={(v) => setSd({ ...sd, note: v })} hint={'Shows next to your hours, e.g. "Closed today, Christmas Day"'} />
        </div>
      </Sheet>
      {node}
    </CreateShell>
  );
}

/* ------------------------------------------------------------------ OM30 Amenities */

const GROUPS: [string, string[]][] = [
  ["Getting there", ["No parking", "Street parking", "Parking on site", "Valet", "Step free entry"]],
  ["Comfort", ["Air conditioning", "Power backup", "WiFi", "Outdoor seating", "Smoking area"]],
  ["Paying", ["Card", "Transfer", "Cash"]],
  ["Who it is for", ["Good for groups", "Kid friendly", "All ages", "18+ from a set time"]],
  ["Booking", ["Walk ins welcome", "Reservations"]],
];
const START = ["Valet", "Step free entry", "Air conditioning", "Power backup", "Outdoor seating", "Card", "Transfer", "Cash", "Good for groups", "18+ from a set time", "Walk ins welcome", "Reservations"];

export function Amenities() {
  const router = useRouter();
  const s = useHost();
  const [picked, setPicked] = useState<string[] | null>(null);
  const [from, setFrom] = useState("9 PM");
  const [dress, setDress] = useState("Smart casual");
  const p = picked ?? s.amenities ?? START;
  const flip = (v: string) => setPicked(p.includes(v) ? p.filter((x) => x !== v) : [...p, v]);
  return (
    <CreateShell
      title="Amenities"
      subtitle="Skyline Lounge"
      back="/host/place"
      action="Save"
      onAction={() => {
        updateHost({ amenities: p });
        router.push("/host/place");
      }}
    >
      <p className="text-[14px] leading-5 text-[#4D5E70]">Tick what applies. Anything you skip stays hidden on your place page.</p>
      {GROUPS.map(([g, opts]) => (
        <div key={g} className="flex flex-col gap-2 pt-5">
          <span className="text-[14px] font-bold text-[#172B3A]">{g}</span>
          <Chips options={opts} value={p} onChange={flip} />
          {g === "Who it is for" && p.includes("18+ from a set time") && (
            <div className="pt-2">
              <Select label="18+ from" value={from} onChange={setFrom} options={["7 PM", "8 PM", "9 PM", "10 PM"]} />
            </div>
          )}
          {g === "Who it is for" && (
            <div className="pt-2">
              <Field label="Dress code (optional)" value={dress} onChange={setDress} />
            </div>
          )}
        </div>
      ))}
    </CreateShell>
  );
}

/* ------------------------------------------------------------------ OM31 Venue requests */

const REASONS: [string][] = [["Not happening here"], ["We didn't agree to this"], ["Wrong date"], ["Something else"]];

export function VenueRequests() {
  const s = useHost();
  const { show, node } = useToast();
  const [tab, setTab] = useState<"waiting" | "accepted" | "declined">("waiting");
  const [decline, setDecline] = useState<string | null>(null);
  const [reason, setReason] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [always, setAlways] = useState(false);
  const list = VENUE_REQUESTS.filter((v) => (tab === "waiting" ? !s.venueRequests[v.id] : s.venueRequests[v.id] === tab));
  const waiting = VENUE_REQUESTS.filter((v) => !s.venueRequests[v.id]).length;
  const d = VENUE_REQUESTS.find((v) => v.id === decline);
  return (
    <CreateShell title="Venue requests" subtitle="Skyline Lounge" back="/host/place">
      <Segmented
        value={tab}
        onChange={setTab}
        items={[
          { value: "waiting", label: `Waiting (${waiting})` },
          { value: "accepted", label: "Accepted" },
          { value: "declined", label: "Declined" },
        ]}
      />
      <p className="pt-3 text-[12px] leading-4 text-[#4D5E70]">Events only show under &quot;Upcoming at Skyline Lounge&quot; once you accept. Hosts can still sell tickets while they wait.</p>
      <div className="flex flex-col gap-3 pt-3">
        {list.map((v) => (
          <div key={v.id} className="flex flex-col gap-3 rounded-2xl border border-[#E9EDF1] p-3">
            <div className="flex gap-3">
              <span className="relative h-[84px] w-[72px] shrink-0 overflow-hidden rounded-[12px] bg-[#E9EDF1]">{v.image && <Image src={v.image} alt="" fill sizes="72px" className="object-cover" />}</span>
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="text-[12px] text-[#C81E57]">{v.date}</span>
                <span className="text-[15px] font-bold text-[#172B3A]">{v.title}</span>
                <span className="text-[12px] text-[#4D5E70]">{v.host}</span>
                <span className="flex items-center justify-between">
                  <Pill label="NIGHTLIFE" tone="pink" />
                  <span className="text-[14px] font-bold text-[#172B3A]">{v.price === "Free" ? "Free" : `From ${v.price}`}</span>
                </span>
              </span>
            </div>
            <span className="text-[12px] text-[#4D5E70]">
              From {v.host} · Verified organizer · {v.sent}
            </span>
            {tab === "waiting" ? (
              <PairButtons
                left="Decline"
                right="Accept"
                onLeft={() => {
                  setReason(null);
                  setDecline(v.id);
                }}
                onRight={() => {
                  updateHost((st) => ({ venueRequests: { ...st.venueRequests, [v.id]: "accepted" } }));
                  show(`${v.title} now shows on your page`);
                }}
              />
            ) : (
              <Pill label={tab === "accepted" ? "Accepted" : "Declined"} tone={tab === "accepted" ? "green" : "grey"} />
            )}
          </div>
        ))}
        {!list.length && <p className="py-6 text-center text-[14px] text-[#4D5E70]">{tab === "waiting" ? "Nothing waiting for you." : "Nothing here yet."}</p>}
      </div>
      <div className="mt-3 flex items-center gap-3 rounded-2xl bg-[#F4F6F8] px-4 py-3">
        <span className="flex flex-1 flex-col">
          <span className="text-[14px] text-[#172B3A]">Always accept from South Circle</span>
          <span className="text-[12px] text-[#4D5E70]">Their new events show on your page straight away</span>
        </span>
        <Toggle on={always} onChange={setAlways} label="Always accept from South Circle" />
      </div>
      <Sheet
        open={!!d}
        onClose={() => setDecline(null)}
        title={`Decline ${d?.title ?? "event"}?`}
        footer={
          <button
            type="button"
            disabled={!reason}
            onClick={() => {
              if (d) updateHost((st) => ({ venueRequests: { ...st.venueRequests, [d.id]: "declined" } }));
              setDecline(null);
              show(`Declined. ${d?.host} is told.`);
            }}
            className={sheetPrimary}
          >
            Decline
          </button>
        }
      >
        <p className="pb-2 text-[14px] leading-5 text-[#4D5E70]">Tell us why. Xiventa looks into it and {d?.host} is told now.</p>
        <RadioRows options={REASONS} value={reason} onChange={setReason} />
        <div className="pt-3">
          <Area label="Note for Xiventa (optional)" value={note} onChange={setNote} placeholder="We have our own event that night" />
        </div>
      </Sheet>
      {node}
    </CreateShell>
  );
}

/* ------------------------------------------------------------------ OM32 Reviews */

export function PlaceReviews() {
  const s = useHost();
  const { show, node } = useToast();
  const [tab, setTab] = useState<"reply" | "all">("reply");
  const [replying, setReplying] = useState<string | null>(null);
  const [text, setText] = useState("");
  const replyOf = (r: (typeof PLACE_REVIEWS)[number]) => s.replies[r.id] ?? r.reply;
  const list = PLACE_REVIEWS.filter((r) => (tab === "reply" ? !replyOf(r) : true));
  const r = PLACE_REVIEWS.find((x) => x.id === replying);
  const first = (n: string) => n.split(" ")[0];
  return (
    <CreateShell title="Reviews" subtitle="Skyline Lounge" back="/host/place">
      <div className="flex items-center gap-3 pb-4">
        <span className="text-[32px] font-bold leading-10 text-[#172B3A]">4.6</span>
        <span className="flex flex-col gap-1">
          <Stars value={5} size={16} />
          <span className="text-[12px] text-[#4D5E70]">38 reviews</span>
        </span>
      </div>
      <Segmented
        value={tab}
        onChange={setTab}
        items={[
          { value: "reply", label: `To reply (${PLACE_REVIEWS.filter((x) => !replyOf(x)).length})` },
          { value: "all", label: "All" },
        ]}
      />
      {list.map((x) => (
        <div key={x.id} className="flex flex-col gap-2 border-b border-[#E9EDF1] py-4">
          <div className="flex items-center gap-3">
            <Initials text={x.initials} size={36} />
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
              <p className="text-[13px] leading-[18px] text-[#4D5E70]">{replyOf(x)}</p>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <button type="button" onClick={() => show("Reported. Our team takes a look.")} className="text-[13px] text-[#68788A]">
                Report
              </button>
              <button
                type="button"
                onClick={() => {
                  setText("");
                  setReplying(x.id);
                }}
                className="flex h-9 items-center rounded-full border border-[#B4BFCA] px-4 text-[13px] text-[#172B3A]"
              >
                Reply to {first(x.name)}
              </button>
            </div>
          )}
        </div>
      ))}
      {!list.length && <p className="py-6 text-center text-[14px] text-[#4D5E70]">All caught up.</p>}
      <Note>You can&apos;t remove reviews. If one breaks the rules, report it and our team takes a look.</Note>
      <Sheet
        open={!!r}
        onClose={() => setReplying(null)}
        title={`Reply to ${r ? first(r.name) : ""}`}
        footer={
          <button
            type="button"
            disabled={!text.trim()}
            onClick={() => {
              if (r) updateHost((st) => ({ replies: { ...st.replies, [r.id]: text.trim() } }));
              setReplying(null);
              show("Reply posted");
            }}
            className={sheetPrimary}
          >
            Post reply
          </button>
        }
      >
        {r && <p className="pb-3 text-[14px] italic leading-5 text-[#4D5E70]">&quot;{r.text}&quot;</p>}
        <Area label="Your reply" value={text} onChange={setText} placeholder="Thanks Bisi. Valet runs from 6 PM on weekends, so there is always a spot." hint="Shows under the review. You can edit it later." />
      </Sheet>
      {node}
    </CreateShell>
  );
}

/* ------------------------------------------------------------------ OM33 Menu and contact */

export function MenuContact() {
  const router = useRouter();
  const { show, node } = useToast();
  const [v, setV] = useState({ menu: "skylinelounge.ng/menu", phone: "0803 000 0100", wa: "0803 000 0100", ig: "@skylinelounge", web: "skylinelounge.ng" });
  const set = (k: keyof typeof v) => (x: string) => setV({ ...v, [k]: x });
  return (
    <CreateShell
      title="Menu and contact"
      subtitle="Skyline Lounge"
      back="/host/place"
      action="Save"
      onAction={() => {
        show("Saved");
        setTimeout(() => router.push("/host/place"), 700);
      }}
    >
      <div className="flex flex-col gap-4">
        <Field label="Menu link" value={v.menu} onChange={set("menu")} hint="Or add photos of your menu below" />
        <div className="flex flex-col gap-2">
          <span className="text-[13px] text-[#172B3A]">Menu photos (optional)</span>
          <button type="button" onClick={() => show("Photo picker opens here")} className="flex h-[88px] flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-[#B4BFCA] bg-[#F4F6F8] text-[14px] text-[#172B3A]">
            <ImageIcon size={20} />
            Add menu photos
            <span className="text-[12px] text-[#68788A]">Up to 10</span>
          </button>
        </div>
        <Field label="Phone" value={v.phone} onChange={set("phone")} inputMode="tel" />
        <Field label="WhatsApp" value={v.wa} onChange={set("wa")} inputMode="tel" hint="People can message you from your place page" />
        <Field label="Instagram" value={v.ig} onChange={set("ig")} />
        <Field label="Website (optional)" value={v.web} onChange={set("web")} />
      </div>
      {node}
    </CreateShell>
  );
}
