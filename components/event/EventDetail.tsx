"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import type { Place, XiventaEvent } from "@/data";
import { buildView, EventStateKey, resolveState, Row, TONES } from "@/lib/eventState";
import { categoryTone } from "@/lib/categoryTone";
import {
  AccessibilityIcon,
  ArrowLeftIcon,
  BookmarkFilledIcon,
  BookmarkIcon,
  CalendarIcon,
  CarIcon,
  ChevronRightIcon,
  FlagIcon,
  InfoIcon,
  MapPinIcon,
  ShareIcon,
  ShieldCheckIcon,
  StarIcon,
  VerifiedBadgeIcon,
  VideoIcon,
} from "@/components/icons";
import { TopNav } from "@/components/web/TopNav";
import { WebFooter } from "@/components/web/WebFooter";
import { EventCard } from "@/components/web/EventCard";
import { AgeBadge, CategoryTag } from "@/components/shared/Tags";
import { ActionRow, TicketLineIcon } from "@/components/mobile/AppParts";
import { AppPlaceRow } from "@/components/mobile/AppPlaceRow";
import { useToast } from "@/components/shared/Sheet";
import { DirectionsSheet, LeavingSheet, Notice, ReportSheet, ShareSheet } from "@/components/shared/Overlays";
import { MapPreview, slugify, TicketTierCard } from "@/components/event/EventParts";
import { GoodToKnowSheet, RefundPolicySheet, ReviewsSheet } from "@/components/tickets/TicketParts";
import { SignInSheet, type SignInReason } from "@/components/site/SitePages";
import { useSession } from "@/lib/session";
import { HowJoiningSheet, JoinSheet, YoureGoingSheet } from "@/components/event/JoinSheets";
import { isDesktop } from "@/components/auth/WebAuth";


const ROW_ICON: Record<Row["icon"], React.ReactNode> = {
  calendar: <CalendarIcon size={20} />,
  pin: <MapPinIcon size={20} />,
  ticket: <TicketLineIcon />,
  video: <VideoIcon size={20} />,
  star: <StarIcon size={20} />,
};
const GOOD_TO_KNOW_ICON = { info: <InfoIcon size={20} />, car: <CarIcon size={20} />, accessibility: <AccessibilityIcon size={20} /> };

/** Pills after the category tag. Ages use the outlined Age Badge, the rest the dotted Status Badge. */
function Pills({ event, pills }: { event: XiventaEvent; pills: ReturnType<typeof buildView>["pills"] }) {
  const tag = categoryTone(event.categoryLabel);
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <CategoryTag label={event.categoryLabel} bg={tag.bg} fg={tag.fg} />
      {pills.map((p) =>
        p.tone === "grey" && !p.dot ? (
          <AgeBadge key={p.label} label={p.label} />
        ) : (
          <span
            key={p.label}
            className="inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-full px-2 text-[12px] leading-4"
            style={{ backgroundColor: TONES[p.tone].bg, color: TONES[p.tone].fg }}
          >
            {p.dot && <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: TONES[p.tone].dot }} />}
            {p.label}
          </span>
        )
      )}
    </div>
  );
}

const DATES = [
  { day: "FRI", date: "24 Oct", status: "Selling", tone: "on" },
  { day: "FRI", date: "31 Oct", status: "Selling", tone: "" },
  { day: "FRI", date: "7 Nov", status: "Few left", tone: "few" },
  { day: "FRI", date: "14 Nov", status: "Sold out", tone: "off" },
];

/** AM21 Recurring `Other dates`: 84 x 72 date chips, selected pink, sold out greyed. */
function DateChips({ value, onChange }: { value: string; onChange: (d: string) => void }) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar" style={{ scrollbarWidth: "none" }}>
      {DATES.map((d) => {
        const on = d.date === value;
        const off = d.tone === "off";
        return (
          <button
            key={d.date}
            type="button"
            disabled={off}
            onClick={() => onChange(d.date)}
            className={`flex h-[72px] w-[84px] shrink-0 flex-col items-center gap-0.5 rounded-[12px] px-3 py-2.5 text-[12px] ${
              on ? "border-[1.5px] border-[#E22765] bg-[#FDEEF3]" : off ? "border border-[#E9EDF1] bg-[#F4F6F8]" : "border border-[#D5DCE3] bg-white"
            }`}
          >
            <span className={off ? "text-[#8C99A7]" : "text-[#4D5E70]"}>{d.day}</span>
            <span className={on ? "text-[#C81E57]" : off ? "text-[#8C99A7]" : "text-[#172B3A]"}>{d.date}</span>
            <span className={on ? "text-[#C81E57]" : off ? "text-[#8C99A7]" : d.tone === "few" ? "text-[#8F5200]" : "text-[#4D5E70]"}>{d.status}</span>
          </button>
        );
      })}
    </div>
  );
}

function SectionTitle({ title, action, href }: { title: string; action?: string; href?: string }) {
  return (
    <div className="flex h-[26px] items-center justify-between">
      <h2 className="text-[20px] font-bold leading-[26px] tracking-[-0.02em] text-[#172B3A]">{title}</h2>
      {action && (
        <Link href={href ?? "#"} className="flex items-center gap-0.5 text-[13px] leading-4 text-[#C81E57]">
          {action}
          <ChevronRightIcon size={16} />
        </Link>
      )}
    </div>
  );
}

interface Props {
  event: XiventaEvent;
  more: XiventaEvent[];
  place?: Place;
}

/**
 * Event detail. Phone: AM21 (239:2899 and its 30 states). Web (768 px and up): PW06 (313:18709 and
 * its 16 states). One state model drives both (lib/eventState.ts). `?state=sold-out` etc. previews
 * any state; the main buttons move between the states they lead to (I'm going, request, invite).
 */
export function EventDetail({ event, more, place }: Props) {
  const params = useSearchParams();
  const router = useRouter();
  const [state, setState] = useState<EventStateKey>(() => resolveState(event, params.get("state")));
  const view = buildView(event, state);
  const [saved, setSaved] = useState(false);
  const [sheet, setSheet] = useState<null | "share" | "report" | "directions" | "leaving" | "reviews" | "good" | "refunds">(null);
  const [date, setDate] = useState("24 Oct");
  const [aboutOpen, setAboutOpen] = useState(false);
  const { show: toast, node: toastNode } = useToast();
  const [join, setJoin] = useState<null | "going" | "going-online" | "details" | "how">(null);
  const joinRef = useRef<HTMLDivElement>(null);

  const address = event.address ?? `${event.venueName}, ${event.neighborhood}`;
  const hostHref = `/hosts/${slugify(event.hostName)}`;
  const initials = event.hostInitials ?? event.hostName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const hostMeta = event.isListing ? "Instagram connected · @southcircle" : event.hostMeta ?? "Verified organizer";
  const [day] = (event.timeRangeLabel ?? event.dateLabel).split(",");

  // PW32: guests are asked to sign in first, then come back to this event.
  const session = useSession();
  const [signIn, setSignIn] = useState<SignInReason | null>(null);
  const guest = session !== undefined && session?.status !== "signed-in";
  const toggleSave = () => {
    if (guest) return setSignIn("save");
    const next = !saved;
    setSaved(next);
    if (next) toast("Saved to My events", "View", () => router.push("/my-events"));
    else toast("Removed from My events", "Undo", () => setSaved(true));
  };

  /** What the primary button does in each state. */
  const act = () => {
    if (guest && ["free-going", "request", "sold-out", "live"].includes(state)) return setSignIn(state === "live" ? "alerts" : "join");
    if (guest && state === "virtual" && event.isFree) return setSignIn("join");
    switch (state) {
      case "free-going":
        setState("im-going");
        return setJoin("going");
      case "virtual":
        if (event.isFree) {
          setState("virtual-going");
          return setJoin("going-online");
        }
        return router.push(`/events/${event.slug}/tickets`);
      case "free-ticket":
      case "free-limited":
        return router.push(`/events/${event.slug}/tickets`);
      case "request":
        if (!isDesktop()) return router.push(`/events/${event.slug}/request`);
        setState("request-sent");
        return toast("Request sent to the host");
      case "request-sent":
        setState("request");
        return toast("Request cancelled");
      case "invite":
        return router.push(`/events/${event.slug}/tickets`);
      case "im-going":
        return toast("Added to your calendar");
      case "sold-out":
        if (!isDesktop()) return router.push(`/events/${event.slug}/waitlist`);
        return toast("You're on the waitlist. We'll tell you if a ticket frees up");
      case "live":
        return toast("We'll remind you before it starts");
      case "live-now":
      case "instagram":
        return setSheet("leaving");
      case "virtual-going":
        if (!isDesktop()) return setJoin("details");
        return joinRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      case "have-ticket":
        return router.push(event.slug === "abnormal-nightout" ? "/my-events/abnormal-nightout" : "/my-events");
      case "cancelled":
        return router.push(`/category/${event.category}`);
      case "ended":
        return router.push(hostHref);
      case "hybrid":
        return setJoin("how");
      default:
        // paid, hidden-location, recurring, hybrid: AM28 / PW10 Choose tickets
        return router.push(`/events/${event.slug}/tickets`);
    }
  };

  const rowHref = (r: Row) => (r.href === "directions" ? () => setSheet("directions") : r.href === "calendar" ? () => toast("Added to your calendar") : r.href === "reviews" ? () => setSheet("reviews") : undefined);

  const joinCard = (
    <div ref={joinRef} className="flex flex-col gap-3 rounded-2xl border border-[#E9EDF1] bg-white p-4">
      <span className="inline-flex h-[23px] w-fit items-center gap-1.5 rounded-full bg-[#E6F1FF] px-2 text-[12px] text-[#0059BE]">{event.format?.label ?? "Online"}</span>
      <div className="flex flex-col gap-1 text-[12px]">
        <span className="text-[#172B3A]">{view.rows[1].title}</span>
        <span className="text-[#4D5E70]">{state === "live-now" ? "Started 3 min ago" : `Starts ${event.dateLabel} WAT`}</span>
        {view.state.startsWith("live") ? (
          <span className="flex items-center gap-2 text-[#4D5E70]">
            Passcode 482 913
            <button type="button" className="text-[#C81E57]" onClick={() => toast("Passcode copied")}>
              Copy
            </button>
          </span>
        ) : (
          <span className="text-[#4D5E70]">Join opens 15 min before</span>
        )}
      </div>
      <p className="text-[12px] text-[#68788A]">Opens in the {view.rows[1].title.replace(/^(Happens on|Live on) /, "").replace(" Live", "")} app. Xiventa does not host the session.</p>
    </div>
  );

  const blocks = {
    waitlist: (
      <div className="flex flex-col gap-2.5 rounded-2xl border border-[#E9EDF1] bg-white p-4">
        <span className="inline-flex h-6 w-fit items-center gap-1.5 rounded-full bg-[#FFECEB] px-2 text-[12px] leading-4 text-[#C0231A]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#FA443A]" />
          Sold out
        </span>
        <p className="text-[12px] text-[#172B3A]">All tickets are sold out</p>
        <p className="text-[12px] text-[#4D5E70]">Join the waitlist and we&apos;ll tell you the moment a ticket frees up.</p>
      </div>
    ),
    cancelled: <Notice tone="red" title="This event was cancelled" body="If you bought a ticket, your refund goes back to the card or account you paid with." />,
    ended: <Notice tone="blue" title="This event has ended" body={`${event.hostName} has more coming up.`} action="See events" onAction={() => router.push(hostHref)} />,
    instagram: <Notice tone="blue" title="Tickets are sold by the host" body={`Payments, refunds and entry are handled by ${event.hostName}, not Xiventa.`} />,
    join: joinCard,
    "other-dates": null,
  };

  const sheets = (
    <>
      <ShareSheet open={sheet === "share"} onClose={() => setSheet(null)} subtitle={`${event.title} · ${day}`} path={`/e/${event.slug.replace(/-/g, "")}`} toast={toast} />
      <ReportSheet open={sheet === "report"} onClose={() => setSheet(null)} toast={toast} />
      <DirectionsSheet open={sheet === "directions"} onClose={() => setSheet(null)} name={event.venueName} address={address} toast={toast} />
      <LeavingSheet open={sheet === "leaving"} onClose={() => setSheet(null)} />
      <SignInSheet reason={signIn} onClose={() => setSignIn(null)} returnTo={`/events/${event.slug}`} />
      <ReviewsSheet open={sheet === "reviews"} onClose={() => setSheet(null)} event={event} toast={toast} />
      <GoodToKnowSheet open={sheet === "good"} onClose={() => setSheet(null)} />
      <RefundPolicySheet open={sheet === "refunds"} onClose={() => setSheet(null)} event={event} />
      <YoureGoingSheet open={join === "going" || join === "going-online"} onClose={() => setJoin(null)} event={event} kind={join === "going-online" ? "online" : "in-person"} onCalendar={() => { setJoin(null); toast("Added to your calendar"); }} />
      <JoinSheet open={join === "details"} onClose={() => setJoin(null)} event={event} />
      <HowJoiningSheet open={join === "how"} onClose={() => setJoin(null)} event={event} onPick={(mode) => { setJoin(null); router.push(`/events/${event.slug}/tickets?mode=${mode}`); }} />
      {toastNode}
    </>
  );

  const primaryCls = (outline?: boolean) =>
    outline
      ? "flex h-[52px] flex-1 items-center justify-center rounded-[12px] border border-[#B4BFCA] bg-white px-5 text-[16px] leading-5 tracking-[-0.01em] text-[#172B3A]"
      : "flex h-[52px] flex-1 items-center justify-center rounded-[12px] bg-[#E22765] px-5 text-[16px] leading-5 tracking-[-0.01em] text-white hover:bg-[#C81E57]";

  return (
    <>
      {/* ================= App (AM21) ================= */}
      <div className="min-h-screen bg-white pb-[93px] md:hidden">
        <div className="relative h-[360px] w-full overflow-hidden bg-[#172B3A]">
          <Image src={event.imageUrl} alt={event.title} fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-x-0 top-0 h-[140px]" style={{ background: "linear-gradient(180deg, rgba(23,43,58,0.48) 0%, rgba(23,43,58,0) 100%)" }} />
          <div className="absolute inset-x-4 top-[calc(env(safe-area-inset-top)+8px)] flex items-center justify-between">
            <button
              type="button"
              aria-label="Back"
              onClick={() => (window.history.length > 1 ? router.back() : router.push("/m"))}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.72] text-[#172B3A]"
            >
              <ArrowLeftIcon size={20} />
            </button>
            <div className="flex gap-2">
              <button type="button" aria-label="Share" onClick={() => setSheet("share")} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.72] text-[#172B3A]">
                <ShareIcon size={20} />
              </button>
              <button type="button" aria-label={saved ? "Saved" : "Save"} aria-pressed={saved} onClick={toggleSave} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.72] text-[#172B3A]">
                {saved ? <BookmarkFilledIcon size={20} /> : <BookmarkIcon size={20} />}
              </button>
            </div>
          </div>
        </div>

        {(view.block === "cancelled" || view.block === "ended") && <div className="px-4 pt-4">{blocks[view.block]}</div>}

        <div className="flex flex-col gap-3 px-4 pb-2 pt-5">
          <Pills event={event} pills={view.pills} />
          <h1 className="text-[24px] font-bold leading-[30px] tracking-[-0.02em] text-[#172B3A]">{event.title}</h1>
          <Link href={hostHref} className="flex h-10 items-center gap-2.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F1EEFF] text-[13px] leading-4 text-[#5B3FD6]">{initials}</span>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="flex items-center gap-1 text-[14px] font-bold leading-5 text-[#172B3A]">
                {event.hostName}
                {!event.isListing && <VerifiedBadgeIcon size={14} className="text-[#E22765]" />}
              </span>
              <span className="truncate text-[12px] leading-4 text-[#4D5E70]">{hostMeta}</span>
            </span>
            <ChevronRightIcon size={20} className="shrink-0 text-[#172B3A]" />
          </Link>
        </div>

        <div className="flex flex-col px-4">
          {view.rows.map((r) => (
            <ActionRow key={r.title} icon={ROW_ICON[r.icon]} title={r.title} subtitle={r.subtitle} onClick={rowHref(r) ?? (() => {})} />
          ))}
        </div>

        {view.block && !["cancelled", "ended", "other-dates"].includes(view.block) && <div className="px-4 pt-2">{blocks[view.block]}</div>}

        {view.block === "other-dates" && (
          <section className="flex flex-col gap-3 px-4 pt-6">
            <SectionTitle title="Other dates" action="See all dates" />
            <DateChips value={date} onChange={setDate} />
          </section>
        )}

        {event.description && (
          <section className="flex flex-col gap-3 px-4 pt-6">
            <SectionTitle title="About" />
            <p className={`text-[14px] leading-5 text-[#4D5E70] ${aboutOpen ? "" : "line-clamp-3"}`}>{event.description}</p>
            {event.description.length > 140 && (
              <button type="button" onClick={() => setAboutOpen((v) => !v)} className="w-fit text-[13px] leading-4 text-[#C81E57]">
                {aboutOpen ? "Show less" : "Read more"}
              </button>
            )}
          </section>
        )}

        {!view.online && (
          <section className="px-4 pt-6">
            <ActionRow
              icon={<InfoIcon size={20} />}
              title="Good to know"
              subtitle={event.goodToKnow ? event.goodToKnow.map((g) => g.title.toLowerCase()).join(", ").replace(/^./, (c) => c.toUpperCase()) : "Dress code, parking and more"}
              onClick={() => setSheet("good")}
            />
          </section>
        )}

        {view.showVenue && (
          <section className="flex flex-col gap-3 px-4 pt-6">
            <SectionTitle title="Venue" />
            <MapPreview app name={event.venueName} address={address} onDirections={() => setSheet("directions")} />
            {place && <AppPlaceRow place={place} />}
          </section>
        )}

        {more.length > 0 && (
          <section className="flex flex-col pt-6">
            <div className="px-4">
              <SectionTitle title={`More from ${event.hostName}`} action="See all" href={hostHref} />
            </div>
            <div className="overflow-x-auto overflow-y-hidden pb-5 no-scrollbar" style={{ scrollbarWidth: "none" }}>
              <div className="flex w-max gap-3 px-4 pt-3">
                {more.map((e) => (
                  <EventCard key={e.id} event={e} variant="compact" />
                ))}
              </div>
            </div>
          </section>
        )}

        <div className="px-4 pb-6 pt-4">
          <ActionRow icon={<FlagIcon size={20} />} title="Report this event" subtitle="Tell us if something looks wrong" onClick={() => (guest ? setSignIn("report") : setSheet("report"))} />
        </div>

        {/* Bottom Action Bar: 93 high, 12 / 16 / 28 padding, price block + 52 px primary */}
        <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-4 border-t border-[#E9EDF1] bg-white px-4 pb-[max(28px,env(safe-area-inset-bottom))] pt-3">
          <div className="flex min-w-[60px] flex-col">
            {view.bar.label && <span className="text-[10px] leading-3 text-[#4D5E70]">{view.bar.label}</span>}
            <span className="whitespace-nowrap text-[16px] font-bold leading-6 tracking-[-0.01em] text-[#172B3A]">{view.bar.price}</span>
          </div>
          <button type="button" onClick={act} className={primaryCls(view.bar.tone === "outline")}>
            {view.bar.action}
          </button>
        </div>
      </div>

      {/* ================= Web (PW06) ================= */}
      <div className="hidden min-h-screen w-full flex-col overflow-x-clip bg-white text-[#172B3A] md:flex">
        <TopNav />
        <main className="mx-auto w-full max-w-[1440px] flex-1 px-6 pb-24 pt-10 lg:px-[120px]">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
            <div className="flex min-w-0 flex-col gap-8 lg:w-[768px]">
              {view.block === "cancelled" && (
                <Notice
                  tone="red"
                  title="This event was cancelled"
                  body={`${event.hostName} cancelled it on Mon 20 Oct. Everyone with a ticket is being refunded.`}
                  action="See similar events"
                  onAction={() => router.push(`/category/${event.category}`)}
                />
              )}
              {view.block === "ended" && (
                <Notice
                  tone="blue"
                  title="This event has ended"
                  body={`It ended on ${day}. ${event.hostName} has more coming up.`}
                  action={`More from ${event.hostName}`}
                  onAction={() => router.push(hostHref)}
                />
              )}
              <div className="relative aspect-[768/432] w-full overflow-hidden rounded-2xl bg-[#E9EDF1]">
                <Image src={event.heroImageUrl ?? event.imageUrl} alt={event.title} fill priority sizes="768px" className="object-cover" />
              </div>
              <Pills event={event} pills={view.pills} />
              <h1 className="text-[40px] font-bold leading-[44px] tracking-[-0.02em] text-[#172B3A]">{event.title}</h1>

              <Link href={hostHref} className="flex h-16 items-center gap-3 rounded-[12px] bg-white px-4 py-3 hover:bg-[#F4F6F8]">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F1EEFF] text-[13px] leading-4 text-[#5B3FD6]">{initials}</span>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px] text-[#172B3A]">{event.hostName}</span>
                    {!event.isListing && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#E3F8EF] py-[3px] pl-1.5 pr-2 text-[12px] text-[#067647]">
                        <ShieldCheckIcon size={14} className="text-[#067647]" />
                        Verified organizer
                      </span>
                    )}
                  </div>
                  <span className="text-[12px] text-[#4D5E70]">{hostMeta}</span>
                </div>
                <ChevronRightIcon size={20} className="shrink-0 text-[#68788A]" />
              </Link>

              <div className="flex flex-col gap-1">
                {view.rows
                  .filter((r) => r.icon !== "ticket" && r.icon !== "star")
                  .map((r) => (
                    <ActionRow
                      key={r.title}
                      icon={ROW_ICON[r.icon]}
                      title={r.icon === "calendar" ? (event.timeRangeLabel ?? event.dateLabel) + (view.online ? " WAT" : "") : r.title}
                      subtitle={r.icon === "calendar" ? "Add to calendar" : r.href === "directions" ? `${address} · Get directions` : r.subtitle}
                      onClick={rowHref(r) ?? (() => {})}
                    />
                  ))}
                <ActionRow
                  icon={<ShieldCheckIcon size={20} />}
                  title={event.ageRestriction ? "18 and over" : "All ages"}
                  subtitle={event.ageRestriction ? "ID is checked at the door" : view.online ? "Open to everyone" : "Kids welcome with an adult"}
                  trailing={<span />}
                />
                {view.ratingRow && <ActionRow icon={<StarIcon size={20} />} title={view.ratingRow.title} subtitle={view.ratingRow.subtitle} onClick={rowHref(view.ratingRow)} />}
              </div>

              {view.online && joinCard}
              {view.showVenue && !view.online && <MapPreview name={event.venueName} address={address} onDirections={() => setSheet("directions")} />}

              {event.description && (
                <section className="flex flex-col gap-2">
                  <h2 className="text-[20px] font-bold leading-[26px] tracking-[-0.02em] text-[#172B3A]">About</h2>
                  <p className="text-[16px] leading-6 tracking-[-0.01em] text-[#4D5E70]">{event.description}</p>
                </section>
              )}

              {event.goodToKnow && !view.online && (
                <section className="flex flex-col gap-1">
                  <h2 className="text-[20px] font-bold leading-[26px] tracking-[-0.02em] text-[#172B3A]">Good to know</h2>
                  {event.goodToKnow.map((row) => (
                    <ActionRow key={row.title} icon={GOOD_TO_KNOW_ICON[row.icon]} title={row.title} subtitle={row.subtitle} trailing={<span />} />
                  ))}
                </section>
              )}

              {more.length > 0 && (
                <section className="flex flex-col gap-4">
                  <SectionTitle title={`More from ${event.hostName}`} action="See all" href={hostHref} />
                  <div className="flex gap-6 overflow-x-auto overflow-y-hidden no-scrollbar" style={{ scrollbarWidth: "none" }}>
                    {more.map((e) => (
                      <EventCard key={e.id} event={e} width={240} />
                    ))}
                  </div>
                </section>
              )}

              <button type="button" onClick={() => (guest ? setSignIn("report") : setSheet("report"))} className="flex h-11 w-fit items-center rounded-[12px] px-4 text-[14px] leading-[18px] text-[#C81E57] hover:bg-[#FDEEF3]">
                Report this event
              </button>
            </div>

            <aside className="flex w-full flex-col gap-6 lg:sticky lg:top-[96px] lg:w-[384px] lg:shrink-0">
              <div className="flex flex-col gap-4 rounded-2xl border border-[#E9EDF1] bg-white p-6">
                <h2 className="text-[20px] font-bold leading-[26px] tracking-[-0.02em] text-[#172B3A]">{view.web.title}</h2>
                {view.web.tiers === "dated" && (
                  <p className="text-[14px] leading-5 text-[#4D5E70]">
                    Fri {date} ·{" "}
                    <button type="button" className="text-[#C81E57]" onClick={() => toast("Pick a date from Other dates in the app, or below")}>
                      Change date
                    </button>
                  </p>
                )}
                {view.web.tiers ? (
                  (event.tiers ?? [{ name: "REGULAR", price: event.displayPrice, description: "General admission." }]).map((t) => (
                    <TicketTierCard key={t.name} tier={t} height={t.description.length > 52 ? 126 : 110} soldOut={view.web.tiers === "sold-out"} />
                  ))
                ) : (
                  <>
                    {view.web.price && <p className="text-[24px] font-bold leading-[30px] tracking-[-0.02em] text-[#172B3A]">{view.web.price}</p>}
                    {view.web.body && <p className="text-[14px] leading-5 text-[#4D5E70]">{view.web.body}</p>}
                  </>
                )}
                <button type="button" onClick={act} className={`${primaryCls(view.web.secondary)} w-full flex-none`}>
                  {view.web.action}
                </button>
                <p className="text-[12px] leading-4 text-[#4D5E70]">
                  {view.web.note}
                  {/refund policy/i.test(view.web.note ?? "") && (
                    <>
                      {" "}
                      <button type="button" onClick={() => setSheet("refunds")} className="text-[#C81E57] hover:underline">
                        See policy
                      </button>
                    </>
                  )}
                </p>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setSheet("share")} className="flex h-11 flex-1 items-center justify-center rounded-[12px] border border-[#B4BFCA] bg-white px-4 text-[14px] leading-[18px] text-[#172B3A] hover:border-[#68788A]">
                  Share
                </button>
                <button type="button" onClick={toggleSave} aria-pressed={saved} className="flex h-11 flex-1 items-center justify-center rounded-[12px] border border-[#B4BFCA] bg-white px-4 text-[14px] leading-[18px] text-[#172B3A] hover:border-[#68788A]">
                  {saved ? "Saved" : "Save"}
                </button>
              </div>

              <div className="flex flex-col gap-2 rounded-2xl bg-[#FDEEF3] p-5">
                <h3 className="text-[17px] leading-[22px] tracking-[-0.01em] text-[#172B3A]">Your ticket, even offline</h3>
                <p className="text-[14px] leading-5 text-[#4D5E70]">Get the Xiventa app to keep tickets on your phone and get reminders.</p>
              </div>
            </aside>
          </div>
        </main>
        <WebFooter />
      </div>

      {sheets}
    </>
  );
}
