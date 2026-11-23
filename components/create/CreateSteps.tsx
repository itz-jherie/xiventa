"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getAllPlaces, getEventBySlug } from "@/data";
import { HOSTS, fromFlyer, hostOf, stepCount, updateDraft, startDraft, type Draft, type EventKind, type Format } from "@/lib/createDraft";
import { Field } from "@/components/checkout/CheckoutParts";
import { InfoNotice, RadioRows } from "@/components/tickets/TicketParts";
import { AlertNotice } from "@/components/account/AccountParts";
import { Sheet, sheetPrimary, sheetSecondary } from "@/components/shared/Sheet";
import { ListEventCard } from "@/components/mobile/AppEventCards";
import { categoryTone } from "@/lib/categoryTone";
import {
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ClockIcon,
  CloseIcon,
  EyeOffIconFallback,
  ImageIcon,
  LiveIcon,
  MapPinIcon,
  PlusIcon,
  SearchIcon,
  ShieldCheckIcon,
  TicketIcon,
  UploadIcon,
  UsersIcon,
  VideoIcon,
} from "@/components/create/createIcons";
import { ChoiceCard, Chips, CreateShell, Hint, Label, PickerField, SwitchRow } from "@/components/create/CreateParts";

/* ------------------------------------------------------------------ EC01 Create */

const KINDS: [EventKind, string, string, React.ReactNode][] = [
  ["free", "Free", "Everyone gets in. Guests tap I'm going so you see who is coming.", <UsersIcon key="u" size={20} />],
  ["paid", "Paid, sell tickets on Xiventa", "QR tickets, check in and payouts. Needs verification.", <TicketIcon key="t" size={20} />],
  ["listing", "Paid, tickets sold elsewhere", "List it here and link your Instagram post. No setup needed.", <TicketIcon key="l" size={20} />],
];

export function CreateStart() {
  const router = useRouter();
  const params = useSearchParams();
  const [kind, setKind] = useState<EventKind>("free");
  return (
    <CreateShell
      title="Create an event"
      close
      back="/m"
      action="Continue"
      onAction={() => {
        startDraft(kind, params.get("host") === "new");
        router.push("/create/host");
      }}
    >
      <h2 className="pb-4 text-[20px] font-bold leading-[26px] tracking-[-0.02em] text-[#172B3A]">What are you planning?</h2>
      <div role="radiogroup" className="flex flex-col gap-3">
        {KINDS.map(([k, t, s, icon]) => (
          <ChoiceCard key={k} icon={icon} title={t} sub={s} on={kind === k} onClick={() => setKind(k)} />
        ))}
      </div>
      <p className="pt-4 text-[13px] leading-[18px] text-[#4D5E70]">Free events always run on Xiventa. You can switch a listing to Xiventa tickets at any time.</p>
    </CreateShell>
  );
}

/* ------------------------------------------------------------------ EC20 Who's hosting */

export function CreateHost({ draft }: { draft: Draft }) {
  const router = useRouter();
  const [limit, setLimit] = useState(false);
  const hosts = draft.newHost ? [hostOf(draft)] : HOSTS;
  const next = draft.kind === "listing" ? "/create/instagram" : "/create/flyer";
  const meta = (h: (typeof HOSTS)[number]) =>
    h.id === "self"
      ? `${h.name} · ${h.verified ? "Verified" : "Not verified yet"}`
      : `${h.kind} · ${h.role}${h.verifiedPlace ? "" : h.verified ? " · Verified" : " · Shows as you until checked"}`;
  return (
    <CreateShell title="Who's hosting?" subtitle="Pick who this event is under" back="/create" action="Continue" onAction={() => router.push(next)}>
      <p className="text-[12px] leading-4 text-[#4D5E70]">
        {draft.kind === "listing"
          ? "Listings only need your Instagram connected. Selling tickets on Xiventa needs the one time verification."
          : "Every host is verified once, for free or paid events. A group's name shows once its checks pass."}
      </p>
      <div role="radiogroup" className="flex flex-col gap-1 pt-4">
        {hosts.map((h) => {
          const on = draft.hostId === h.id;
          return (
            <button key={h.id} type="button" role="radio" aria-checked={on} onClick={() => updateDraft({ hostId: h.id })} className={`flex min-h-[76px] items-center gap-3 rounded-2xl px-3 text-left ${on ? "bg-[#F4F6F8]" : ""}`}>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F1EEFF] text-[13px] text-[#5B3FD6]">{h.initials}</span>
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="flex items-center gap-2 text-[12px] leading-4 text-[#172B3A]">
                  {h.id === "self" ? "Hosting as yourself" : h.name}
                  {h.verifiedPlace && (
                    <span className="inline-flex h-5 items-center gap-1 rounded-full bg-[#E3F8EF] px-1.5 text-[12px] text-[#067647]">
                      <ShieldCheckIcon size={12} />
                      Verified place
                    </span>
                  )}
                </span>
                <span className="text-[12px] leading-4 text-[#4D5E70]">{meta(h)}</span>
              </span>
              <span className={`h-5 w-5 shrink-0 rounded-full ${on ? "border-[6px] border-[#E22765]" : "border-[1.5px] border-[#B4BFCA]"}`} />
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={() => (!draft.newHost && HOSTS.some((h) => !h.verified) ? setLimit(true) : router.push("/create/verify"))}
        className="w-fit px-4 pt-5 text-[14px] text-[#C81E57]"
      >
        Add a host profile
      </button>
      {/* EC27 Host profile limit */}
      <Sheet
        open={limit}
        onClose={() => setLimit(false)}
        title="Verify one first"
        footer={
          <>
            <button type="button" onClick={() => setLimit(false)} className={`${sheetSecondary} w-[140px]`}>
              Not now
            </button>
            <button
              type="button"
              onClick={() => {
                updateDraft({ hostId: "grace" });
                router.push("/create/group-check");
              }}
              className={sheetPrimary}
            >
              Verify a profile
            </button>
          </>
        }
      >
        <p className="text-[14px] leading-5 text-[#4D5E70]">
          You already have the most host profiles allowed while they wait for verification. Verify one of them to add another. Verified profiles have no limit.
        </p>
      </Sheet>
    </CreateShell>
  );
}

/* ------------------------------------------------------------------ EC24 Start with your flyer */

/**
 * EC24 Start with your flyer: upload, then "Read my flyer" ticks off what it found and fills in
 * the next steps. A flyer named like an event already on Xiventa (try one with "friday" in the
 * file name) shows Already on Xiventa, or You already posted this when hosting as Skyline Lounge.
 * Preview with ?state=duplicate | mine.
 */
export function CreateFlyer({ draft }: { draft: Draft }) {
  const router = useRouter();
  const params = useSearchParams();
  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<{ url: string; name: string } | null>(draft.flyerUrl ? { url: draft.flyerUrl, name: "flyer" } : null);
  const [reading, setReading] = useState<number | null>(null);
  const [dupe, setDupe] = useState<"other" | "mine" | null>(params.get("state") === "duplicate" ? "other" : params.get("state") === "mine" ? "mine" : null);
  const n = stepCount(draft);
  const found = fromFlyer(draft.kind);

  useEffect(() => {
    if (reading === null) return;
    if (reading >= 3) {
      const t = setTimeout(() => {
        updateDraft({ ...found, flyer: "read" });
        router.push("/create/basics");
      }, 500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setReading(reading + 1), 800);
    return () => clearTimeout(t);
  }, [reading, found, router]);

  const pick = (f?: File) => {
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = String(reader.result);
      setFile({ url, name: f.name });
      updateDraft({ flyerUrl: url, flyer: "uploaded" });
    };
    reader.readAsDataURL(f);
  };
  const read = () => {
    if (file && /friday|rush/i.test(file.name)) return setDupe(draft.hostId === "skyline" ? "mine" : "other");
    setReading(0);
  };

  if (dupe) return <DuplicateFlyer draft={draft} mine={dupe === "mine"} onDifferent={() => (setDupe(null), setFile(null))} />;

  const checks: [string, string][] = [
    ["Name and date", `${found.name}, ${found.date}`],
    ["Time and place", `${found.start} at ${(found.venue ?? "").split(",")[0]}`],
    ["Category and age", `${(found.categories ?? []).join(", ")}${found.age ? ` · ${found.age}+` : " · All ages"}`],
  ];

  return (
    <CreateShell
      title="New event"
      subtitle={`Hosting as ${hostOf(draft).name}`}
      onChangeHost={() => router.push("/create/host")}
      step={{ label: "Your flyer", n: 1, of: n }}
      back="/create/host"
      action={reading !== null ? "Reading…" : "Read my flyer"}
      disabled={!file || reading !== null}
      onAction={read}
    >
      <h2 className="text-[20px] font-bold leading-[26px] tracking-[-0.02em] text-[#172B3A]">{reading !== null ? "Reading your flyer…" : "Start with your flyer"}</h2>
      <p className="pt-3 text-[14px] leading-5 text-[#4D5E70]">
        {reading !== null ? "This takes a few seconds. You can change anything we fill in." : "We read it and fill in the details for you. You check everything before it goes live."}
      </p>
      <Label className="pt-5">Flyer or poster</Label>
      <input ref={input} type="file" accept="image/*,application/pdf" hidden onChange={(e) => pick(e.target.files?.[0])} />
      {file ? (
        <div className="relative h-[180px] overflow-hidden rounded-2xl bg-[#E9EDF1]">
          <Image src={file.url} alt="Your flyer" fill unoptimized sizes="400px" className="object-cover" />
          {reading === null && (
            <div className="absolute right-3 top-3 flex gap-2">
              <button type="button" aria-label="Replace flyer" onClick={() => input.current?.click()} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.8] text-[#172B3A]">
                <UploadIcon size={18} />
              </button>
              <button
                type="button"
                aria-label="Remove flyer"
                onClick={() => {
                  setFile(null);
                  updateDraft({ flyerUrl: undefined, flyer: "none" });
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.8] text-[#172B3A]"
              >
                <CloseIcon size={18} />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex h-[180px] flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-[#B4BFCA] bg-[#F4F6F8]">
          <ImageIcon size={24} className="text-[#68788A]" />
          <span className="pt-1 text-[14px] text-[#172B3A]">Upload your flyer</span>
          <span className="text-[12px] text-[#68788A]">JPG, PNG or PDF</span>
          <button type="button" onClick={() => input.current?.click()} className="mt-2 flex h-9 items-center rounded-[8px] border border-[#B4BFCA] bg-white px-4 text-[13px] text-[#172B3A]">
            Choose image
          </button>
        </div>
      )}
      <Hint>{file ? "It also becomes your event poster." : "Square or portrait works best. It also becomes your event poster."}</Hint>
      {reading === null ? (
        <>
          <p className="pt-4 text-[12px] leading-4 text-[#4D5E70]">We look for the name, date, time, venue, prices, age limit and Instagram handle.</p>
          <button
            type="button"
            onClick={() => {
              updateDraft({ flyer: "by-hand" });
              router.push("/create/basics");
            }}
            className="w-fit px-4 pt-6 text-[14px] text-[#C81E57]"
          >
            Fill in by hand instead
          </button>
        </>
      ) : (
        <div className="flex flex-col pt-4">
          {checks.map(([t, s], i) => {
            const done = reading > i;
            return (
              <div key={t} className="flex min-h-[66px] items-center gap-3">
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${done ? "bg-[#E3F8EF] text-[#067647]" : "bg-[#E6F1FF] text-[#0059BE]"}`}>
                  {done ? <CheckIcon size={18} /> : <ClockIcon size={18} />}
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="text-[14px] leading-5 text-[#172B3A]">{t}</span>
                  <span className="text-[12px] leading-4 text-[#68788A]">{done ? s : "Still reading…"}</span>
                </span>
              </div>
            );
          })}
        </div>
      )}
    </CreateShell>
  );
}

/** EC24 Flyer / Already on Xiventa and You already posted this. */
function DuplicateFlyer({ draft, mine, onDifferent }: { draft: Draft; mine: boolean; onDifferent: () => void }) {
  const router = useRouter();
  const event = getEventBySlug("friday-rush")!;
  return (
    <CreateShell
      title="New event"
      subtitle={`Hosting as ${hostOf(draft).name}`}
      back="/create/host"
      action={mine ? "Open my event" : "Ask for a promoter link"}
      onAction={() => router.push(mine ? "/events/friday-rush" : "/create/promoter-sent")}
    >
      <h2 className="text-[20px] font-bold leading-[26px] tracking-[-0.02em] text-[#172B3A]">{mine ? "You already posted this event" : "This event is already on Xiventa"}</h2>
      <p className="pt-3 text-[14px] leading-5 text-[#4D5E70]">
        {mine
          ? "Friday Rush is already live. Open it to make changes, or add a new date if it repeats."
          : "Your flyer matches an event hosted by Skyline Lounge. To stop fake tickets, each event is listed only once."}
      </p>
      <div className="flex justify-center pt-5">
        <ListEventCard event={event} hostLine categoryTag={categoryTone(event.categoryLabel)} />
      </div>
      {!mine && (
        <div className="pt-5">
          <InfoNotice title="Selling tickets for them?" body="Ask Skyline Lounge for a promoter link. Every sale you make is tracked under your name." />
        </div>
      )}
      <button type="button" onClick={() => router.push(mine ? "/events/friday-rush?state=recurring" : "/create/claim")} className="pt-8 text-[16px] tracking-[-0.01em] text-[#C81E57]">
        {mine ? "Add a new date" : "This is my event"}
      </button>
      <button type="button" onClick={onDifferent} className="pt-8 text-[16px] tracking-[-0.01em] text-[#C81E57]">
        {mine ? "It’s a different event" : "Use a different flyer"}
      </button>
    </CreateShell>
  );
}

/** EC24 This is my event / Send proof. */
export function CreateClaim() {
  const router = useRouter();
  const [proof, setProof] = useState<string | null>("A post on my connected Instagram");
  const [file, setFile] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  return (
    <CreateShell title="This is my event" subtitle="Friday Rush" action="Send for review" disabled={!file} onAction={() => router.push("/create/promoter-sent?claim")}>
      <p className="text-[13px] leading-[18px] text-[#4D5E70]">Show us this event is yours. Our team checks it, usually within 24 hours. If the other listing is fake, we remove it and refund its buyers.</p>
      <div className="pt-4">
        <RadioRows
          options={[
            ["A post on my connected Instagram", "The event flyer posted from your own page"],
            ["Venue booking or contract", "A receipt or letter from the venue"],
            ["Something else", "Tell us in the note"],
          ]}
          value={proof}
          onChange={setProof}
        />
      </div>
      <Label className="pt-4">Proof</Label>
      <input ref={input} type="file" accept="image/*,application/pdf" hidden onChange={(e) => setFile(e.target.files?.[0]?.name ?? null)} />
      <div className="flex h-[150px] flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-[#B4BFCA] bg-[#F4F6F8] px-4 text-center">
        <span className="text-[14px] text-[#172B3A]">{file ?? "Add a screenshot or document"}</span>
        <span className="text-[12px] text-[#68788A]">JPG, PNG or PDF</span>
        <button type="button" onClick={() => input.current?.click()} className="mt-2 flex h-9 items-center rounded-[8px] border border-[#B4BFCA] bg-white px-4 text-[13px] text-[#172B3A]">
          {file ? "Change" : "Choose image"}
        </button>
      </div>
      <Hint>Only our team sees this.</Hint>
    </CreateShell>
  );
}

/** EC24 Promoter request sent (and the claim sent for review). */
export function CreatePromoterSent() {
  const router = useRouter();
  const claim = useSearchParams().has("claim");
  return (
    <CreateShell bare action="Back to Hosting" onAction={() => router.push("/host")}>
      <div className="flex min-h-[60vh] flex-col justify-center gap-3">
        <h1 className="text-[24px] font-bold leading-[30px] tracking-[-0.02em] text-[#172B3A]">{claim ? "Sent for review" : "Request sent to Skyline Lounge"}</h1>
        <p className="text-[14px] leading-5 text-[#4D5E70]">
          {claim
            ? "Our team checks your proof, usually within 24 hours. We tell you as soon as it's done."
            : "We will tell you when they reply. If they say yes, you get your own link and QR to sell Friday Rush."}
        </p>
      </div>
    </CreateShell>
  );
}

/* ------------------------------------------------------------------ EC23 Instagram post (listing) */

const POSTS = ["afro-night-market", "abnormal-nightout", "friday-rush", "jersey-creek-picnic", "connect-lagos", "sunday-sundowner"];

/**
 * EC23 Instagram post (listing): Connect, pick a post or paste a link. A link that is not an
 * Instagram post shows Wrong link. Preview ?state=in-use for Account already in use.
 */
export function CreateInstagram({ draft }: { draft: Draft }) {
  const router = useRouter();
  const params = useSearchParams();
  const inUse = params.get("state") === "in-use";
  const [connected, setConnected] = useState(draft.listing.ig === "connected");
  const [picked, setPicked] = useState(0);
  const [paste, setPaste] = useState(false);
  const [link, setLink] = useState("");
  const wrong = paste && link.length > 6 && !/instagram\.com\/(p|reel)\//i.test(link);
  const next = () => {
    updateDraft({ ...fromFlyer("listing"), flyer: "read", listing: { ig: "connected", post: "Afro Night Market · posted 2 days ago", low: 10000, high: 50000 } });
    router.push("/create/basics");
  };
  const handle = draft.hostId === "loc" ? "@lagosoutdoorclub" : "@" + hostOf(draft).name.toLowerCase().replace(/\s+/g, "");
  const notice = <InfoNotice title="You sell the tickets" body="Payments, refunds and entry are handled by you. Xiventa shows your event and sends people to your post. Sell on Xiventa to get check in, payouts and a Verified badge. You can switch later." />;
  return (
    <CreateShell
      title="New listing"
      subtitle={`Hosting as ${hostOf(draft).name}`}
      onChangeHost={() => router.push("/create/host")}
      step={{ label: "Instagram post", n: 1, of: 3 }}
      back="/create/host"
      action={connected || paste ? "Next" : undefined}
      disabled={paste ? !link || wrong : false}
      onAction={next}
    >
      {!connected && !paste ? (
        <>
          <p className="text-[14px] leading-5 text-[#4D5E70]">Connect the Instagram account where you sell tickets. Then pick your event post and we fill in the rest from its flyer and caption.</p>
          {inUse && (
            <div className="pt-4">
              <AlertNotice title="@southcircle is already connected to another Xiventa account" body="Each Instagram account can list from one Xiventa account only. If this page is yours, contact support and we will help." />
            </div>
          )}
          <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-[#E9EDF1] p-4">
            <span className="text-[13px] leading-4 text-[#172B3A]">Connect Instagram</span>
            {["Pick your event post from your grid", "Your listing shows “Instagram connected”", "Only posts from your own account are accepted"].map((t) => (
              <span key={t} className="flex items-center gap-2 text-[14px] leading-5 text-[#4D5E70]">
                <CheckIcon size={16} className="text-[#067647]" />
                {t}
              </span>
            ))}
            <button type="button" onClick={() => setConnected(true)} className="mt-2 flex h-[52px] items-center justify-center rounded-[12px] bg-[#E22765] text-[16px] tracking-[-0.01em] text-white">
              Connect Instagram
            </button>
            <span className="text-[12px] leading-4 text-[#4D5E70]">Works with business and creator accounts. Switching a personal account is free in Instagram settings.</span>
          </div>
          <div className="pt-4">{notice}</div>
        </>
      ) : paste ? (
        <>
          <p className="text-[14px] leading-5 text-[#4D5E70]">Paste the link to the Instagram post or reel with your flyer. We read the flyer and fill in your event. Guests who want tickets are sent to this post.</p>
          <div className="pt-4">
            <Field label="Instagram post or reel" value={link} onChange={setLink} placeholder="instagram.com/p/…" error={wrong ? `This link is not from ${handle}. Use a post or reel from your connected account. Links to ticket sites are not allowed.` : undefined} />
          </div>
          <div className="pt-4">{notice}</div>
        </>
      ) : (
        <>
          <p className="text-[14px] leading-5 text-[#4D5E70]">Connected as {handle} · Instagram connected. Pick the post for this event.</p>
          <div className="grid grid-cols-3 gap-1 pt-4">
            {POSTS.map((slug, i) => {
              const e = getEventBySlug(slug);
              return (
                <button key={slug} type="button" aria-pressed={picked === i} onClick={() => setPicked(i)} className={`relative aspect-square overflow-hidden bg-[#E9EDF1] ${picked === i ? "ring-4 ring-inset ring-[#E22765]" : ""}`}>
                  {e && <Image src={e.imageUrl} alt="" fill sizes="130px" className="object-cover" />}
                </button>
              );
            })}
          </div>
          <div className="pt-4">
            <InfoNotice title="Afro Night Market · posted 2 days ago" body="We read the flyer and caption from this post. Guests who want tickets are sent here." />
          </div>
          <button type="button" onClick={() => setPaste(true)} className="pt-5 text-[14px] text-[#C81E57]">
            Paste a link to one of your posts
          </button>
        </>
      )}
    </CreateShell>
  );
}

/* ------------------------------------------------------------------ EC03 Event basics */

const FORMATS: Format[] = ["in-person", "virtual", "live", "hybrid"];
const FORMAT_LABEL: Record<Format, string> = { "in-person": "In person", virtual: "Virtual", live: "Live", hybrid: "Hybrid" };
const FORMAT_HINT: Record<Format, string> = {
  "in-person": "At a venue or address. Virtual and Live ask for the link next.",
  virtual: "On Google Meet or Zoom. You add the link next.",
  live: "On Instagram, TikTok or YouTube Live. Public, so there are no tickets.",
  hybrid: "At a venue, and online for people who can't make it.",
};
const ALL_CATEGORIES = ["Nightlife & Parties", "Music", "Food & Drink", "Outdoors & Travel", "Family & Kids", "Arts & Culture", "Tech & Business", "Comedy", "Sports & Fitness", "Faith & Spirituality", "Learning & Workshops", "Community & Causes"];
const SUGGESTED: Record<string, string[]> = {
  free: ["Outdoors & Travel", "Food & Drink", "Family & Kids"],
  paid: ["Nightlife & Parties", "Music", "Comedy"],
  listing: ["Food & Drink", "Music", "Arts & Culture"],
};
const TIMES = ["9 AM", "10 AM", "12 PM", "1 PM", "2 PM", "4 PM", "6 PM", "7 PM", "8 PM", "9 PM", "10 PM", "11 PM"];

export function CreateBasics({ draft }: { draft: Draft }) {
  const router = useRouter();
  const [more, setMore] = useState(false);
  const [sheet, setSheet] = useState<null | "date" | "start" | "end" | "age">(null);
  const n = stepCount(draft);
  const fromFlyer = draft.flyer === "read";
  const listing = draft.kind === "listing";
  const cats = more ? ALL_CATEGORIES : [...new Set([...SUGGESTED[draft.kind], ...draft.categories])];
  const ok = draft.name.trim().length > 2 && !!draft.date && !!draft.start && draft.categories.length > 0;
  const from = (s: string) => (fromFlyer ? <Hint>{s}</Hint> : null);
  return (
    <CreateShell
      title={listing ? "New listing" : "New event"}
      subtitle={`Hosting as ${hostOf(draft).name}`}
      onChangeHost={() => router.push("/create/host")}
      step={{ label: "Event basics", n: 2, of: n }}
      back={listing ? "/create/instagram" : "/create/flyer"}
      action="Next"
      disabled={!ok}
      onAction={() => router.push("/create/location")}
    >
      {fromFlyer && (
        <div className="pb-5">
          <InfoNotice title={listing ? "Filled in from your post" : "Filled in from your flyer"} body="Check each field. Anything we could not read is left empty." />
        </div>
      )}
      <Field label="Event name" value={draft.name} onChange={(v) => updateDraft({ name: v })} placeholder="What is it called?" hint={fromFlyer ? (listing ? "From your post" : "From your flyer") : undefined} />
      {!listing && (
        <>
          <Label className="pt-5">How will people attend?</Label>
          <div className="grid grid-cols-2 gap-2">
            {FORMATS.map((f) => {
              const on = draft.format === f;
              const icon = f === "in-person" ? <MapPinIcon size={16} /> : f === "virtual" ? <VideoIcon size={16} /> : f === "live" ? <LiveIcon size={16} /> : <UsersIcon size={16} />;
              return (
                <button key={f} type="button" aria-pressed={on} onClick={() => updateDraft({ format: f })} className={`flex h-8 items-center justify-center gap-1.5 rounded-full text-[13px] ${on ? "bg-[#E22765] text-white" : "border border-[#B4BFCA] text-[#4D5E70]"}`}>
                  {icon}
                  {FORMAT_LABEL[f]}
                </button>
              );
            })}
          </div>
          <Hint tone="body">{FORMAT_HINT[draft.format]}</Hint>
        </>
      )}
      <Label className="pt-5">Category, up to 2</Label>
      <Chips
        options={cats}
        value={draft.categories}
        onChange={(c) =>
          updateDraft((d) => ({ categories: d.categories.includes(c) ? d.categories.filter((x) => x !== c) : d.categories.length >= 2 ? [d.categories[1], c] : [...d.categories, c] }))
        }
        after={
          !more && (
            <button type="button" onClick={() => setMore(true)} className="flex h-8 items-center gap-1 rounded-full border border-[#B4BFCA] px-4 text-[13px] text-[#4D5E70]">
              More
              <ChevronDownIcon size={16} />
            </button>
          )
        }
      />
      {fromFlyer && <Hint tone="body">Suggested from your flyer</Hint>}
      <div className="flex flex-col pt-5">
        <PickerField label="Date" icon={<CalendarIcon size={20} />} value={draft.date} placeholder="Pick a date" onClick={() => setSheet("date")} />
        {from("From your flyer")}
      </div>
      <div className="flex flex-col pt-5">
        <PickerField label="Starts" icon={<ClockIcon size={20} />} value={draft.start} placeholder="Pick a time" onClick={() => setSheet("start")} />
        {fromFlyer && !draft.end && <Hint>From your flyer. We could not find an end time.</Hint>}
      </div>
      {draft.end ? (
        <div className="flex flex-col pt-5">
          <PickerField label="Ends" icon={<ClockIcon size={20} />} value={draft.end} onClick={() => setSheet("end")} />
        </div>
      ) : (
        <button type="button" onClick={() => setSheet("end")} className="flex h-10 w-fit items-center gap-1.5 px-3 pt-2 text-[13px] text-[#C81E57]">
          <PlusIcon size={16} />
          Add end time
        </button>
      )}
      {!listing && (
        <button type="button" onClick={() => router.push("/create/repeat")} className="flex min-h-[66px] items-center gap-3 pt-3 text-left">
          <span className="flex flex-1 flex-col gap-0.5">
            <span className="text-[16px] leading-6 tracking-[-0.01em] text-[#172B3A]">Repeats</span>
            <span className="text-[12px] leading-4 text-[#68788A]">{draft.repeat === "Does not repeat" ? "For services, weekly nights or yearly events" : draft.repeat}</span>
          </span>
          <ChevronRightIcon size={20} className="text-[#4D5E70]" />
        </button>
      )}
      <Label className="pt-4">Age limit</Label>
      <div className="flex gap-2">
        <button type="button" aria-pressed={draft.age === null} onClick={() => updateDraft({ age: null })} className={`flex h-8 items-center rounded-full px-4 text-[13px] ${draft.age === null ? "bg-[#E22765] text-white" : "border border-[#B4BFCA] text-[#4D5E70]"}`}>
          All ages
        </button>
        <button type="button" aria-pressed={draft.age !== null} onClick={() => setSheet("age")} className={`flex h-8 items-center rounded-full px-4 text-[13px] ${draft.age !== null ? "bg-[#E22765] text-white" : "border border-[#B4BFCA] text-[#4D5E70]"}`}>
          {draft.age !== null ? `${draft.age}+` : "Minimum age"}
        </button>
      </div>
      <DateTimeSheet open={sheet === "date" || sheet === "start" || sheet === "end"} kind={sheet === "date" ? "date" : "time"} title={sheet === "date" ? "Date" : sheet === "start" ? "Starts" : "Ends"} onClose={() => setSheet(null)} onPick={(v) => updateDraft(sheet === "date" ? { date: v } : sheet === "start" ? { start: v } : { end: v })} />
      <AgeSheet open={sheet === "age"} value={draft.age ?? 18} onClose={() => setSheet(null)} onSave={(a) => updateDraft({ age: a })} />
    </CreateShell>
  );
}

/** Date or time list. Dates are the next 4 weeks from today, built only while open (no clock on the server). */
function DateTimeSheet({ open, kind, title, onClose, onPick }: { open: boolean; kind: "date" | "time"; title: string; onClose: () => void; onPick: (v: string) => void }) {
  return (
    <Sheet open={open} onClose={onClose} title={title}>
      {open && (
        <div className="grid grid-cols-3 gap-2 pb-2">
          {(kind === "time"
            ? TIMES
            : Array.from({ length: 28 }, (_, i) => {
                const d = new Date();
                d.setDate(d.getDate() + i + 1);
                return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }).replace(",", "");
              })
          ).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => {
                onPick(v);
                onClose();
              }}
              className="flex h-10 items-center justify-center rounded-[12px] border border-[#D5DCE3] text-[13px] text-[#172B3A] hover:border-[#E22765]"
            >
              {v}
            </button>
          ))}
        </div>
      )}
    </Sheet>
  );
}

/** EC26 Minimum age. */
function AgeSheet({ open, value, onClose, onSave }: { open: boolean; value: number; onClose: () => void; onSave: (a: number) => void }) {
  const [age, setAge] = useState(value);
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Minimum age"
      footer={
        <>
          <button type="button" onClick={onClose} className={`${sheetSecondary} w-[140px]`}>
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onSave(age);
              onClose();
            }}
            className={sheetPrimary}
          >
            Save
          </button>
        </>
      }
    >
      <p className="text-[14px] leading-5 text-[#4D5E70]">Guests must be at least this old.</p>
      <p className="py-4 text-center text-[17px] font-bold text-[#172B3A]">{age}</p>
      <div className="flex justify-between gap-2">
        {[13, 16, 18, 21, 25].map((a) => (
          <button key={a} type="button" aria-pressed={age === a} onClick={() => setAge(a)} className={`flex h-8 flex-1 items-center justify-center rounded-full text-[13px] ${age === a ? "bg-[#E22765] text-white" : "border border-[#B4BFCA] text-[#4D5E70]"}`}>
            {a}+
          </button>
        ))}
      </div>
      <p className="pt-4 text-[12px] leading-4 text-[#4D5E70]">Shown on your event as {age}+. We remind guests to bring ID; the door checks it.</p>
    </Sheet>
  );
}

/* ------------------------------------------------------------------ EC21 Repeat settings */

export function CreateRepeat({ draft }: { draft: Draft }) {
  const router = useRouter();
  const day = (draft.date || "Sun").split(" ")[0];
  const DAYS: Record<string, string> = { Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday", Sun: "Sunday" };
  const full = DAYS[day] ?? "Sunday";
  const [d, m] = (draft.date || "Sun 12 Oct").split(" ").slice(1);
  const options: [string, string?][] = [
    ["Does not repeat"],
    ["Weekly", `Every ${full}`],
    ["Every 2 weeks", `Every other ${full}`],
    ["Monthly", `First ${full} of the month`],
    ["Yearly", `Every ${d} ${m === "Oct" ? "October" : m}`],
    ["Custom", "Pick days and how often"],
  ];
  return (
    <CreateShell title="Repeat" subtitle={draft.name} back="/create/basics" action="Done" onAction={() => router.push("/create/basics")}>
      <span className="text-[12px] leading-4 text-[#172B3A]">Repeat</span>
      <span className="pt-1 text-[12px] leading-4 text-[#4D5E70]">
        First date: {draft.date || "not set"}
        {draft.start ? `, ${draft.start}` : ""}
        {draft.end ? ` to ${draft.end}` : ""}
      </span>
      <div className="pt-2">
        <RadioRows options={options} value={options.find(([o]) => draft.repeat.startsWith(o))?.[0] ?? "Does not repeat"} onChange={(v) => updateDraft({ repeat: v === "Does not repeat" ? v : `${v} · ${options.find(([o]) => o === v)?.[1] ?? ""}` })} />
      </div>
      {draft.repeat !== "Does not repeat" && (
        <>
          <span className="pb-2 pt-4 text-[12px] leading-4 text-[#172B3A]">Ends</span>
          <Chips options={["No end date", "On a date", "After a number of dates"] as const} value={[draft.repeatEnds as "No end date"]} onChange={(v) => updateDraft({ repeatEnds: v })} />
          <Hint>We keep the next 12 dates open and add more as time passes.</Hint>
        </>
      )}
    </CreateShell>
  );
}

/* ------------------------------------------------------------------ EC04 / EC19 Location and guests */

export function CreateLocation({ draft }: { draft: Draft }) {
  const router = useRouter();
  const n = stepCount(draft);
  const paid = draft.kind === "paid";
  const listing = draft.kind === "listing";
  const online = draft.format === "virtual" || draft.format === "hybrid";
  const live = draft.format === "live";
  const venueNeeded = draft.format === "in-person" || draft.format === "hybrid";
  const label = listing ? "Location and prices" : live ? "Live access" : paid ? (online ? "Location and online access" : "Location") : draft.format === "virtual" ? "Online access and guests" : draft.format === "hybrid" ? "Location, online access and guests" : "Location and guests";
  const ok = (!venueNeeded || !!draft.venue) && (!online || draft.online.link.length > 4) && (!live || draft.live.handle.length > 1) && (!listing || draft.listing.low > 0);
  return (
    <CreateShell
      title={listing ? "New listing" : "New event"}
      subtitle={draft.name}
      step={{ label, n: 3, of: n }}
      back="/create/basics"
      action={paid ? "Next" : "Review"}
      disabled={!ok}
      onAction={() => router.push(paid ? "/create/tickets" : "/create/review")}
    >
      {venueNeeded && (
        <>
          <PickerField label="Venue or address" icon={<MapPinIcon size={20} />} value={draft.venue} placeholder="Search places or type an address" hint="Pick a place from Xiventa or type an address." onClick={() => router.push("/create/venue")} />
          {!listing && (
            <SwitchRow
              icon={<EyeOffIconFallback size={20} />}
              title="Hide the exact address"
              sub={paid ? "Only ticket holders see it, before the event" : "Only people going see it, before the event"}
              on={draft.hideAddress}
              onChange={(v) => updateDraft({ hideAddress: v })}
            />
          )}
        </>
      )}
      {online && <OnlineAccess draft={draft} />}
      {live && <LiveAccess draft={draft} />}

      {listing ? (
        <>
          <Label className="pt-5">Prices</Label>
          <Field label="Lowest ticket price" value={draft.listing.low ? String(draft.listing.low) : ""} onChange={(v) => updateDraft((d) => ({ listing: { ...d.listing, low: Number(v.replace(/\D/g, "")) || 0 } }))} inputMode="tel" hint="From the flyer" />
          <div className="pt-4">
            <Field label="Highest ticket price (optional)" value={draft.listing.high ? String(draft.listing.high) : ""} onChange={(v) => updateDraft((d) => ({ listing: { ...d.listing, high: Number(v.replace(/\D/g, "")) || 0 } }))} inputMode="tel" hint={`Shown on your event as From ₦${draft.listing.low.toLocaleString("en-NG")}.`} />
          </div>
          <div className="pt-4">
            <InfoNotice title="You sell the tickets" body="Payments, refunds and entry are handled by you. Xiventa shows your event and sends people to your post." />
          </div>
        </>
      ) : paid ? (
        <>
          <Label className="pt-5">Who can buy tickets?</Label>
          <RadioRows
            options={[
              ["Anyone", "Shows in feeds and search."],
              ["Only people with your link", "Never in feeds or search."],
            ]}
            value={draft.join === "invite" ? "Only people with your link" : "Anyone"}
            onChange={(v) => updateDraft({ join: v === "Anyone" ? "open" : "invite" })}
          />
        </>
      ) : live ? null : (
        <>
          <Label className="pt-5">Who can join?</Label>
          <RadioRows
            options={[
              ["Open", "Anyone can come. Shows in feeds and search."],
              ["Request to join", "You approve each person first."],
              ["Invite only", "Only people with your link. Never in feeds."],
            ]}
            value={draft.join === "open" ? "Open" : draft.join === "request" ? "Request to join" : "Invite only"}
            onChange={(v) => updateDraft({ join: v === "Open" ? "open" : v === "Request to join" ? "request" : "invite" })}
          />
          <Label className="pt-5">Guests</Label>
          {draft.format !== "virtual" && (
            <SwitchRow
              icon={<UsersIcon size={20} />}
              title="Free tickets for entry"
              sub={draft.freeTickets ? "Guests register and get a QR code the door scans" : "Off: guests tap I'm going and anyone can walk in"}
              on={draft.freeTickets}
              onChange={(v) => updateDraft({ freeTickets: v, limit: v ? draft.limit : false })}
            />
          )}
          {(draft.freeTickets || draft.format === "virtual") && (
            <SwitchRow
              icon={<UsersIcon size={20} />}
              title="Limit spots"
              sub={draft.format === "virtual" && !draft.limit ? "Off: no limit. Your meeting room may have a size limit." : "Free tickets close at this number"}
              on={draft.limit}
              onChange={(v) => updateDraft({ limit: v })}
            />
          )}
          {draft.limit && (
            <Field label="How many spots" value={String(draft.spots)} onChange={(v) => updateDraft({ spots: Number(v.replace(/\D/g, "")) || 0 })} inputMode="tel" hint="We stop giving out free tickets at this number." />
          )}
          <SwitchRow
            icon={<TicketIcon size={20} />}
            title="Add paid tickets instead"
            sub="Needs verification and a payout account"
            on={false}
            onChange={() => {
              updateDraft({ kind: "paid", join: draft.join === "invite" ? "invite" : "open" });
            }}
          />
        </>
      )}
    </CreateShell>
  );
}

function OnlineAccess({ draft }: { draft: Draft }) {
  const zoom = draft.online.platform === "Zoom";
  const set = (patch: Partial<Draft["online"]>) => updateDraft((d) => ({ online: { ...d.online, ...patch } }));
  return (
    <>
      <span className="pb-2 pt-4 text-[12px] leading-4 text-[#172B3A]">Where is it happening online?</span>
      <div role="radiogroup" className="flex flex-col gap-2">
        {(
          [
            ["Google Meet", "G", "Virtual · paste your meeting link"],
            ["Zoom", "Z", "Virtual · meeting link and passcode"],
          ] as const
        ).map(([p, l, s]) => {
          const on = draft.online.platform === p;
          return (
            <button key={p} type="button" role="radio" aria-checked={on} onClick={() => set({ platform: p })} className={`flex min-h-[66px] items-center gap-3 rounded-2xl border px-4 text-left ${on ? "border-[#E22765] bg-[#FDEEF3]" : "border-[#E9EDF1]"}`}>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[12px] text-[#4D5E70]">{l}</span>
              <span className="flex flex-1 flex-col gap-0.5">
                <span className="text-[12px] text-[#172B3A]">{p}</span>
                <span className="text-[12px] text-[#4D5E70]">{s}</span>
              </span>
              <span className={`h-5 w-5 rounded-full ${on ? "border-[6px] border-[#E22765]" : "border-[1.5px] border-[#B4BFCA]"}`} />
            </button>
          );
        })}
      </div>
      <div className="pt-4">
        <Field label={`${draft.online.platform} meeting link`} value={draft.online.link} onChange={(v) => set({ link: v })} placeholder={zoom ? "zoom.us/j/834 2290 1176" : "meet.google.com/abc-defg-hij"} hint="Only people going see the link and passcode." />
      </div>
      {zoom && (
        <div className="pt-4">
          <Field label="Passcode" value={draft.online.passcode} onChange={(v) => set({ passcode: v })} placeholder="LAGOS24" />
        </div>
      )}
    </>
  );
}

function LiveAccess({ draft }: { draft: Draft }) {
  const set = (patch: Partial<Draft["live"]>) => updateDraft((d) => ({ live: { ...d.live, ...patch } }));
  return (
    <>
      <span className="pb-2 text-[12px] leading-4 text-[#172B3A]">Where are you going live?</span>
      <div role="radiogroup" className="flex flex-col gap-2">
        {(
          [
            ["Instagram Live", "I", "Live · your Instagram handle"],
            ["TikTok Live", "T", "Live · your TikTok handle"],
            ["YouTube Live", "Y", "Live · your YouTube channel handle"],
          ] as const
        ).map(([p, l, s]) => {
          const on = draft.live.platform === p;
          return (
            <button key={p} type="button" role="radio" aria-checked={on} onClick={() => set({ platform: p })} className={`flex min-h-[66px] items-center gap-3 rounded-2xl border px-4 text-left ${on ? "border-[#E22765] bg-[#FDEEF3]" : "border-[#E9EDF1]"}`}>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[12px] text-[#4D5E70]">{l}</span>
              <span className="flex flex-1 flex-col gap-0.5">
                <span className="text-[12px] text-[#172B3A]">{p}</span>
                <span className="text-[12px] text-[#4D5E70]">{s}</span>
              </span>
              <span className={`h-5 w-5 rounded-full ${on ? "border-[6px] border-[#E22765]" : "border-[1.5px] border-[#B4BFCA]"}`} />
            </button>
          );
        })}
      </div>
      <div className="pt-4">
        <Field label={`${draft.live.platform.split(" ")[0]} handle`} value={draft.live.handle} onChange={(v) => set({ handle: v })} placeholder="@kolademusic" hint="We send people to this page when you go live." />
      </div>
      <p className="pt-3 text-[12px] leading-4 text-[#4D5E70]">Live events are public, so there are no tickets. People tap Remind me and we tell them when you go live.</p>
    </>
  );
}

/* ------------------------------------------------------------------ EC05 Venue search */

export function CreateVenue() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [typing, setTyping] = useState(false);
  const [address, setAddress] = useState("");
  const places = getAllPlaces().filter((p) => q.trim().length > 1 && p.name.toLowerCase().includes(q.trim().toLowerCase()));
  const pick = (v: string) => {
    updateDraft({ venue: v });
    router.push("/create/location");
  };
  return (
    <CreateShell title="Find the venue" back="/create/location" action={typing ? "Use this address" : undefined} disabled={address.trim().length < 6} onAction={() => pick(address.trim())}>
      {typing ? (
        <Field label="Address" value={address} onChange={setAddress} placeholder="12 Admiralty Way, Lekki Phase 1" hint="We check it on the map before you publish." />
      ) : (
        <>
          <label className="flex h-12 items-center gap-2 rounded-full bg-[#F4F6F8] px-4">
            <SearchIcon size={20} className="text-[#68788A]" />
            <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search places on Xiventa" className="h-full flex-1 bg-transparent text-[14px] text-[#172B3A] placeholder:text-[#68788A] focus:outline-none" />
          </label>
          {q.trim().length > 1 && places.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-4 pt-16 text-center">
              <h2 className="text-[20px] font-bold leading-[26px] tracking-[-0.02em] text-[#172B3A]">No place called {q.trim()} yet</h2>
              <p className="text-[14px] leading-5 text-[#4D5E70]">Type the address instead. New venues are added to Xiventa after a quick check.</p>
              <button type="button" onClick={() => setTyping(true)} className="mt-3 flex h-11 items-center rounded-[12px] border border-[#B4BFCA] px-4 text-[14px] text-[#172B3A]">
                Enter the address yourself
              </button>
            </div>
          ) : (
            <>
              {places.length > 0 && (
                <>
                  <span className="pb-1 pt-5 text-[10px] uppercase tracking-[0.04em] text-[#4D5E70]">Places on Xiventa</span>
                  {places.slice(0, 6).map((p) => (
                    <button key={p.slug} type="button" onClick={() => pick(`${p.name}, ${p.neighborhood}`)} className="flex min-h-[66px] items-center gap-3 text-left">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F4F6F8] text-[#172B3A]">
                        <MapPinIcon size={20} />
                      </span>
                      <span className="flex flex-col gap-0.5">
                        <span className="text-[16px] leading-6 tracking-[-0.01em] text-[#172B3A]">{p.name}</span>
                        <span className="text-[12px] leading-4 text-[#68788A]">{p.neighborhood}</span>
                      </span>
                    </button>
                  ))}
                </>
              )}
              <span className="pb-1 pt-5 text-[10px] uppercase tracking-[0.04em] text-[#4D5E70]">Can&apos;t find it?</span>
              <button type="button" onClick={() => setTyping(true)} className="flex min-h-[66px] items-center gap-3 text-left">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F4F6F8] text-[#172B3A]">
                  <PlusIcon size={20} />
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="text-[16px] leading-6 tracking-[-0.01em] text-[#172B3A]">Enter the address yourself</span>
                  <span className="text-[12px] leading-4 text-[#68788A]">We check it on the map before you publish</span>
                </span>
              </button>
            </>
          )}
        </>
      )}
    </CreateShell>
  );
}
