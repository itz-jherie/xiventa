"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import type { XiventaEvent } from "@/data";
import { getEventBySlug } from "@/data";
import { hostOf, lowestPrice, naira, needsGroupCheck, needsVerification, previewState, publishDraft, updateDraft, type Draft } from "@/lib/createDraft";
import { Field } from "@/components/checkout/CheckoutParts";
import { EventDetail } from "@/components/event/EventDetail";
import { ShareSheet } from "@/components/shared/Overlays";
import { useToast } from "@/components/shared/Sheet";
import { CheckIcon, ChevronRightIcon, ImageIcon, PlusIcon, ShieldCheckIcon, UploadIcon } from "@/components/create/createIcons";
import { CameraIcon, MoreIcon, PhoneIcon, QrCodeIcon, ShareIcon } from "@/components/icons";
import { CreateShell, Label, SwitchRow } from "@/components/create/CreateParts";

/* ------------------------------------------------------------------ EC14 Ready to publish */

type Row = { title: string; sub: string; state: "done" | "todo" | "optional"; action?: string; href?: string };

function Rows({ rows }: { rows: Row[] }) {
  const router = useRouter();
  return (
    <div className="flex flex-col">
      {rows.map((r) => (
        <button key={r.title} type="button" disabled={!r.href} onClick={() => r.href && router.push(r.href)} className="flex min-h-[62px] items-center gap-3 text-left disabled:cursor-default">
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${r.state === "done" ? "bg-[#E3F8EF] text-[#067647]" : r.state === "todo" ? "bg-[#E6F1FF] text-[#0059BE]" : "bg-[#F4F6F8] text-[#172B3A]"}`}
          >
            {r.state === "done" ? <CheckIcon size={18} /> : r.state === "todo" ? <ShieldCheckIcon size={18} /> : <PlusIcon size={18} />}
          </span>
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className={`text-[14px] leading-5 text-[#172B3A] ${r.state === "optional" ? "text-[16px] leading-6" : ""}`}>{r.title}</span>
            <span className="text-[12px] leading-4 text-[#68788A]">{r.sub}</span>
          </span>
          {r.action && <span className="text-[13px] text-[#C81E57]">{r.action}</span>}
          {r.href && r.state !== "done" && <ChevronRightIcon size={20} className="shrink-0 text-[#4D5E70]" />}
        </button>
      ))}
    </div>
  );
}

const FORMAT_WORD = { "in-person": "In person", virtual: "Online", live: "Live", hybrid: "Hybrid" } as const;

export function CreateReview({ draft }: { draft: Draft }) {
  const router = useRouter();
  const host = hostOf(draft);
  const paid = draft.kind === "paid";
  const listing = draft.kind === "listing";
  const verify = needsVerification(draft);
  const group = needsGroupCheck(draft);
  const when = `${draft.date}${draft.start ? `, ${draft.start}` : ""}`;
  const basics = [FORMAT_WORD[draft.format], draft.categories.join(", "), when, draft.age ? `${draft.age}+` : listing ? "All ages" : ""].filter(Boolean).join(" · ");
  const joinWord = draft.join === "open" ? "Open to anyone" : draft.join === "request" ? "Request to join" : paid ? "Only people with your link" : "Invite only";
  const from = lowestPrice(draft);

  const rows: Row[] = [];
  rows.push(
    listing
      ? { title: "Instagram post", sub: "Flyer read from instagram.com/p/C8xK2aLmQ1", state: "done", href: "/create/instagram" }
      : { title: "Flyer", sub: draft.flyer === "by-hand" ? "No flyer yet. A plain poster is made for you" : "Used as your poster", state: "done", href: "/create/flyer" }
  );
  rows.push({ title: "Event basics", sub: basics, state: "done", href: "/create/basics" });
  if (draft.format === "live") rows.push({ title: "Live access", sub: `${draft.live.platform} · ${draft.live.handle}`, state: "done", href: "/create/location" });
  else if (draft.format === "virtual") rows.push({ title: "Online access", sub: `${draft.online.platform} · Link added · ${joinWord}`, state: "done", href: "/create/location" });
  else rows.push({ title: listing ? "Location" : paid ? "Location" : "Location and guests", sub: `${draft.venue.split(",").slice(0, paid || listing ? 2 : 1).join(",")}${listing ? "" : ` · ${joinWord}`}`, state: "done", href: "/create/location" });
  if (listing) rows.push({ title: "Prices", sub: `From ${naira(draft.listing.low)} · sold on your Instagram`, state: "done", href: "/create/location" });
  else if (paid) rows.push({ title: "Tickets", sub: `${draft.tickets.map((t) => t.name).join(", ").replace(/, ([^,]*)$/, " and $1")} · from ${from === Infinity ? "Free" : naira(from)}`, state: "done", href: "/create/tickets" });
  else
    rows.push({
      title: "Guests",
      sub: draft.format === "live" ? "Remind me button · No tickets" : draft.freeTickets ? `Free tickets · ${draft.limit ? `${draft.spots} spots` : "No limit"}` : draft.join === "request" ? "You approve each person" : `I'm going button · ${draft.limit ? `${draft.spots} spots` : "No limit"}`,
      state: "done",
      href: "/create/location",
    });
  if (paid) {
    if (verify) rows.push({ title: "Verify who is selling the tickets", sub: "Yourself, a business or a group", state: "todo", action: "Start", href: "/create/verify" });
    else if (group) {
      rows.push({ title: `Post as ${host.name}`, sub: "Until it's checked, your events show your name", state: "todo", action: "Add", href: "/create/group-check" });
      rows.push({ title: "Payout account", sub: "Your wallet · GTBank ·· 6789, Ada Okafor", state: "done" });
    } else if (draft.groupCheck === "pending") rows.push({ title: `${host.name} check`, sub: "In review · goes live under your name for now", state: "done", href: "/create/group-pending" });
    else rows.push({ title: "Host and payouts", sub: `${host.name} · Verified · paid to your bank account`, state: "done" });
  }
  rows.push({ title: draft.clip ? "Spotlight clip added" : "Add a Spotlight clip", sub: draft.clip ? "Shows in Spotlight once checked" : "Events with a clip get seen in Spotlight", state: draft.clip ? "done" : "todo", action: draft.clip ? undefined : "Add", href: "/create/clip" });
  if (draft.format !== "virtual" && draft.format !== "live") rows.push({ title: "More details (optional)", sub: "Dress code, parking, lineup, gallery and links", state: "optional", href: "/create/details" });
  rows.push({ title: "Preview your event page", sub: "See it the way guests will", state: "optional", href: `/create/preview?state=${previewState(draft)}` });

  const note = listing
    ? "Listings go live straight away. We show your event and send people to your Instagram post."
    : !paid
      ? "Free events publish straight away. You can edit details later; guests are told about big changes."
      : verify
        ? "Verify to publish. It takes about a minute: your bank account and a code. Your event is saved as a draft."
        : group || draft.groupCheck === "pending"
          ? `You’re verified, so tickets go on sale as soon as you publish. It shows your name until ${host.name} is checked.`
          : "Tickets go on sale as soon as you publish. You can edit details later; ticket holders are told about big changes.";

  return (
    <CreateShell
      title="Ready to publish"
      subtitle={draft.name}
      back={paid ? "/create/tickets" : "/create/location"}
      action="Publish"
      disabled={verify}
      onAction={() => {
        publishDraft();
        router.push("/create/published");
      }}
    >
      <Rows rows={rows} />
      <p className="pt-3 text-[13px] leading-[18px] text-[#4D5E70]">{note}</p>
      {listing && (
        <button
          type="button"
          onClick={() => {
            updateDraft({ kind: "paid", tickets: [] });
            router.push("/create/tickets");
          }}
          className="w-fit pt-3 text-[13px] text-[#C81E57]"
        >
          Want QR tickets and check in? Sell on Xiventa
        </button>
      )}
    </CreateShell>
  );
}

/* ------------------------------------------------------------------ EC22 More details */

const ACCESS = ["Step free entry", "Accessible toilet", "Seating available"];

export function CreateDetails({ draft }: { draft: Draft }) {
  const router = useRouter();
  const [d, setD] = useState(draft.details);
  const set = (patch: Partial<Draft["details"]>) => setD((x) => ({ ...x, ...patch }));
  return (
    <CreateShell
      title="More details"
      subtitle="Optional. Only shown if you add something"
      back="/create/review"
      action="Save"
      onAction={() => {
        updateDraft({ details: d });
        router.push("/create/review");
      }}
    >
      <p className="text-[14px] leading-5 text-[#4D5E70]">Answer what guests always ask. Skip anything that does not apply.</p>
      <div className="flex flex-col gap-4 pt-4">
        <Field label="Dress code" value={d.dress} onChange={(v) => set({ dress: v })} placeholder="All white, smart casual" />
        <Field label="Parking" value={d.parking} onChange={(v) => set({ parking: v })} placeholder="Paid parking at Gate 2, street parking after 10 PM" />
        <Field label="Security" value={d.security} onChange={(v) => set({ security: v })} placeholder="Bag search at the door. No sharp objects." />
        <Field label="What to bring" value={d.bring} onChange={(v) => set({ bring: v })} placeholder="A valid ID for the 18+ check" hint="Shows on tickets too." />
      </div>
      <span className="pt-5 text-[10px] uppercase leading-3 tracking-[0.04em] text-[#4D5E70]">Accessibility</span>
      {ACCESS.map((a) => (
        <SwitchRow key={a} title={a} on={d.access.includes(a)} onChange={(v) => set({ access: v ? [...d.access, a] : d.access.filter((x) => x !== a) })} />
      ))}
    </CreateShell>
  );
}

/* ------------------------------------------------------------------ EC18 Spotlight clip */

/** Rule 0: the clip length limit is an admin setting; 60 seconds here. */
const MAX_CLIP_SECONDS = 60;

export function CreateClip() {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<"empty" | "checking" | "ok" | "long">("empty");
  const [preview, setPreview] = useState<{ url: string; video: boolean } | null>(null);
  const pick = (f?: File) => {
    if (!f) return;
    const url = URL.createObjectURL(f);
    const video = f.type.startsWith("video");
    setPreview({ url, video });
    if (!video) return setState("ok");
    setState("checking");
    const v = document.createElement("video");
    v.preload = "metadata";
    v.onloadedmetadata = () => setState(v.duration > MAX_CLIP_SECONDS ? "long" : "ok");
    v.onerror = () => setState("ok");
    v.src = url;
  };
  return (
    <CreateShell
      title="Spotlight clip"
      back="/create/review"
      action={state === "long" ? "Try another clip" : "Use this clip"}
      disabled={state === "empty" || state === "checking"}
      onAction={() => {
        if (state === "long") return input.current?.click();
        updateDraft({ clip: true });
        router.push("/create/review");
      }}
    >
      <p className="text-[14px] leading-5 text-[#4D5E70]">One short vertical clip or photo that sells the night. It plays in Spotlight and on your event page.</p>
      <Label className="pt-4">Clip</Label>
      <input ref={input} type="file" accept="video/*,image/*" hidden onChange={(e) => pick(e.target.files?.[0])} />
      <div className="relative flex h-[190px] flex-col items-center justify-center gap-1 overflow-hidden rounded-2xl border border-dashed border-[#B4BFCA] bg-[#F4F6F8] px-6 text-center">
        {preview && state !== "long" ? (
          preview.video ? (
            <video src={preview.url} muted playsInline autoPlay loop className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <Image src={preview.url} alt="" fill unoptimized sizes="400px" className="object-cover" />
          )
        ) : state === "long" ? (
          <>
            <span className="text-[14px] text-[#172B3A]">This clip is too long</span>
            <span className="text-[12px] text-[#68788A]">Trim it to the length in the tips below and try again.</span>
            <button type="button" onClick={() => input.current?.click()} className="mt-2 flex h-9 items-center rounded-[8px] border border-[#B4BFCA] bg-white px-4 text-[13px] text-[#172B3A]">
              Choose another
            </button>
          </>
        ) : (
          <>
            <ImageIcon size={24} className="text-[#68788A]" />
            <span className="text-[14px] text-[#172B3A]">Add a clip or photo</span>
            <button type="button" onClick={() => input.current?.click()} className="mt-2 flex h-9 items-center gap-1.5 rounded-[8px] border border-[#B4BFCA] bg-white px-4 text-[13px] text-[#172B3A]">
              <UploadIcon size={16} />
              Choose file
            </button>
          </>
        )}
      </div>
      <span className={`pt-2 text-[12px] leading-4 ${state === "long" ? "text-[#C0231A]" : "text-[#68788A]"}`}>{state === "long" ? "MP4, MOV, JPG or PNG. Vertical works best." : "Vertical 9:16 works best in Spotlight."}</span>
      <span className="pt-5 text-[10px] uppercase leading-3 tracking-[0.04em] text-[#4D5E70]">Tips</span>
      {[
        ["Keep it short", `Up to ${MAX_CLIP_SECONDS} seconds, set by Xiventa`],
        ["Vertical works best", "Full screen on phones"],
        ["Only music and logos you have rights to", ""],
      ].map(([t, s]) => (
        <div key={t} className="flex min-h-[52px] flex-col justify-center gap-0.5">
          <span className="text-[16px] leading-6 tracking-[-0.01em] text-[#172B3A]">{t}</span>
          {s && <span className="text-[12px] leading-4 text-[#68788A]">{s}</span>}
        </div>
      ))}
      <p className="pt-2 text-[12px] leading-4 text-[#4D5E70]">Clips from verified hosts go live after a quick automatic check. Others are reviewed first.</p>
    </CreateShell>
  );
}

/* ------------------------------------------------------------------ EC15 Preview */

/** The draft as an event, built on the sample event that matches its kind (so the page has its sections). */
export function draftEvent(d: Draft): XiventaEvent {
  const base = getEventBySlug(d.kind === "paid" ? "abnormal-nightout" : d.format === "virtual" || d.format === "live" ? "connect-lagos" : d.format === "hybrid" ? "emerging-leaders-forum" : "jersey-creek-picnic")!;
  const host = hostOf(d);
  const [venueName, ...rest] = d.venue.split(",");
  const from = d.kind === "listing" ? d.listing.low : lowestPrice(d);
  return {
    ...base,
    title: d.name || base.title,
    dateLabel: `${d.date || base.dateLabel.split(",")[0]}, ${d.start || "9 PM"}`,
    timeRangeLabel: `${d.date || base.dateLabel.split(",")[0]}, ${d.start || "9 PM"}${d.end ? ` to ${d.end}` : ""}`,
    venueName: venueName?.trim() || base.venueName,
    venueLabel: d.venue ? `${venueName.trim()}${rest.length ? ` · ${rest.join(",").trim()}` : ""}` : base.venueLabel,
    hostName: host.name,
    imageUrl: d.flyerUrl ?? base.imageUrl,
    heroImageUrl: d.flyerUrl ?? base.heroImageUrl,
    ageRestriction: d.age ? `${d.age}+` : undefined,
    isFree: d.kind === "free",
    displayPrice: d.kind === "free" ? "Free" : from === Infinity || !from ? base.displayPrice : naira(from),
    priceValue: d.kind === "free" ? 0 : from === Infinity ? base.priceValue : from,
  } as XiventaEvent;
}

/**
 * EC15 Preview: the real event page for the draft, with buttons turned off and a Back to edit bar.
 * ?published shows it without the preview banner (See your event, after publishing).
 */
export function CreatePreview({ draft }: { draft: Draft }) {
  const router = useRouter();
  const published = useSearchParams().has("published");
  const event = draftEvent(draft);
  return (
    <div className="relative">
      {!published && (
        <div className="fixed left-1/2 top-[max(12px,env(safe-area-inset-top))] z-[60] flex w-[calc(100%-32px)] max-w-[420px] -translate-x-1/2 items-center gap-3 rounded-2xl bg-[#E6F1FF] px-4 py-3 shadow-[0_12px_32px_rgba(23,43,58,0.16)]">
          <ShieldCheckIcon size={20} className="shrink-0 text-[#0059BE]" />
          <div className="flex flex-col gap-0.5">
            <p className="text-[13px] leading-4 text-[#172B3A]">Preview</p>
            <p className="text-[12px] leading-4 text-[#4D5E70]">This is how guests see your event. Buttons are turned off here.</p>
          </div>
        </div>
      )}
      <div inert={!published || undefined}>
        <EventDetail event={event} more={[]} />
      </div>
      <div className="fixed inset-x-0 bottom-0 z-[60] flex justify-center border-t border-[#E9EDF1] bg-white px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-3">
        <button type="button" onClick={() => router.push(published ? "/host" : "/create/review")} className="flex h-[52px] w-full max-w-[400px] items-center justify-center rounded-[12px] bg-[#E22765] text-[16px] tracking-[-0.01em] text-white">
          {published ? "Back to Hosting" : "Back to edit"}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ EC16 Published */

export function CreatePublished({ draft }: { draft: Draft }) {
  const router = useRouter();
  const [share, setShare] = useState(false);
  const { show: toast, node: toastNode } = useToast();
  const event = draftEvent(draft);
  const host = hostOf(draft);
  const invite = draft.join === "invite";
  const listing = draft.kind === "listing";
  const place = draft.format === "virtual" ? `On ${draft.online.platform}` : draft.format === "live" ? draft.live.platform : event.venueName;
  const pill = invite ? "Private · Not in feeds" : "Live in Lagos feeds";
  const [l1, l2] =
    invite
      ? ["You're set.", "Now send your invite."]
      : listing
        ? ["Your listing is live.", "Send people your way."]
        : draft.format === "live"
          ? ["Your Live is listed.", "Get people tuned in."]
          : draft.kind === "paid"
            ? ["Tickets are on sale.", "Go get your people."]
            : ["You're live.", "Go get your people."];
  const note = invite
    ? "Only people with your link can see it or join."
    : listing
      ? "Buyers who tap See on Instagram go straight to your post."
      : draft.format === "virtual"
        ? `The ${draft.online.platform} link shows once people tap I'm going.`
        : draft.format === "live"
          ? "People tap Remind me and we tell them when you go live."
          : draft.join === "request"
            ? "Requests land in your guest list. You approve each person."
            : draft.limit
              ? "Free tickets close when your spots run out."
              : draft.kind === "paid" && !host.verified
                ? `It shows as Ada Okafor until ${host.name}'s check passes. Then the name switches over.`
                : "Most people find events through friends. Share it before you leave this screen.";
  const link = `xiventa.com/e/${(draft.name || "event").toLowerCase().replace(/[^a-z0-9]+/g, "")}`;
  const actions: [string, React.ReactNode, () => void][] = invite
    ? [
        ["WhatsApp", <PhoneIcon key="p" size={20} />, () => toast("Opening WhatsApp")],
        ["Copy invite", <ShareIcon key="s" size={20} />, () => toast("Invite link copied")],
        ["More", <MoreIcon key="m" size={20} />, () => setShare(true)],
      ]
    : [
        ["WhatsApp", <PhoneIcon key="p" size={20} />, () => toast("Opening WhatsApp")],
        ["Story", <CameraIcon key="c" size={20} />, () => toast("Story poster saved to your photos")],
        ["Copy link", <ShareIcon key="s" size={20} />, () => toast("Link copied")],
        ["Poster QR", <QrCodeIcon key="q" size={20} />, () => setShare(true)],
      ];
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#172B3A] text-white">
      <div className="absolute inset-0">
        <Image src={event.heroImageUrl ?? event.imageUrl} alt="" fill unoptimized={!!draft.flyerUrl} sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(23,43,58,0.2)] via-[rgba(23,43,58,0.75)] to-[#172B3A]" />
      </div>
      <div className="relative mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-6 pb-[max(28px,env(safe-area-inset-bottom))] pt-[max(16px,env(safe-area-inset-top))]">
        <button type="button" aria-label="Close" onClick={() => router.push("/m")} className="flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
        </button>
        <div className="mt-auto flex flex-col gap-3">
          <span className={`flex h-7 w-fit items-center gap-1.5 rounded-full px-3 text-[12px] font-bold ${invite ? "bg-white/20" : "bg-[#067647]"}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            {pill}
          </span>
          <h1 className="text-[34px] font-bold leading-[40px] tracking-[-0.02em]">
            {l1}
            <br />
            {l2}
          </h1>
          <p className="text-[14px] leading-5 text-white/90">
            {draft.name} · {draft.date}
            {draft.start ? `, ${draft.start}` : ""} · {place}
          </p>
          <div className={`grid gap-2 pt-6 ${invite ? "grid-cols-3" : "grid-cols-4"}`}>
            {actions.map(([label, icon, fn]) => (
              <button key={label} type="button" onClick={fn} className="flex flex-col items-center gap-2 text-[12px]">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.16]">{icon}</span>
                {label}
              </button>
            ))}
          </div>
          <p className="pt-2 text-center text-[13px] leading-[18px] text-white/90">{note}</p>
          <button type="button" onClick={() => router.push(`/create/preview?state=${previewState(draft)}&published`)} className="mt-4 flex h-[52px] items-center justify-center rounded-[12px] bg-[#E22765] text-[16px] tracking-[-0.01em]">
            {listing && draft.listing.ig === "none" ? "See your listing" : "See your event"}
          </button>
          <button type="button" onClick={() => router.push("/host")} className="flex h-11 items-center justify-center text-[15px] font-bold">
            Back to Hosting
          </button>
        </div>
      </div>
      <ShareSheet open={share} onClose={() => setShare(false)} subtitle={`${draft.name} · ${draft.date}`} path={`/${link.split("/").slice(1).join("/")}`} toast={toast} />
      {toastNode}
    </div>
  );
}
