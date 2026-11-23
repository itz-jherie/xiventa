"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import type { Place, XiventaEvent } from "@/data";
import type { PlaceDetails } from "@/data/placeDetails";
import {
  AccessibilityIcon,
  ArrowLeftIcon,
  BagIcon,
  BookmarkFilledIcon,
  BookmarkIcon,
  CalendarIcon,
  CameraIcon,
  CarIcon,
  CheckIcon,
  ChevronRightIcon,
  ClockIcon,
  FlagIcon,
  HangerIcon,
  MapPinIcon,
  NavigationIcon,
  PhoneIcon,
  ShareIcon,
  ShieldCheckIcon,
  StarFilledIcon,
  StarIcon,
  UtensilsIcon,
  VerifiedBadgeIcon,
} from "@/components/icons";
import { TopNav } from "@/components/web/TopNav";
import { WebFooter } from "@/components/web/WebFooter";
import { EventCard } from "@/components/web/EventCard";
import { PlaceCard } from "@/components/web/PlaceCard";
import { CategoryTag } from "@/components/shared/Tags";
import { ActionRow } from "@/components/mobile/AppParts";
import { ListEventCard } from "@/components/mobile/AppEventCards";
import { Sheet, sheetPrimary, sheetSecondary, useToast } from "@/components/shared/Sheet";
import { DirectionsSheet, ReportSheet, ShareSheet } from "@/components/shared/Overlays";
import { MapPreview } from "@/components/event/EventParts";
import { HoursSheet, PlaceReviewsSheet, PlanVisitSheet, WriteReviewSheet } from "@/components/place/PlaceFlows";
import { setBeen as storeBeen, useVisits } from "@/lib/visits";
import { useSession } from "@/lib/session";
import { SignInSheet, type SignInReason } from "@/components/site/SitePages";
import { isDesktop } from "@/components/auth/WebAuth";

type PlaceState = "open" | "closed" | "been-here" | "special-day";

function Stars({ n, size = 16 }: { n: number; size?: number }) {
  return (
    <span className="flex gap-0.5 text-[#F5A300]">
      {[1, 2, 3, 4, 5].map((i) => (i <= Math.round(n) ? <StarFilledIcon key={i} size={size} /> : <StarIcon key={i} size={size} className="text-[#B4BFCA]" />))}
    </span>
  );
}

function ReviewCard({ r, place, photos = false }: { r: PlaceDetails["reviews"][number]; place: Place; photos?: boolean }) {
  return (
    <article className="flex flex-col gap-2.5 rounded-2xl border border-[#E9EDF1] bg-white p-4">
      <div className="flex items-center gap-2.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F1EEFF] text-[10px] leading-3 text-[#5B3FD6]">{r.initials}</span>
        <div className="flex flex-col gap-0.5">
          <span className="text-[13px] font-bold leading-4 text-[#172B3A]">{r.name}</span>
          <span className="text-[12px] leading-4 text-[#4D5E70]">{r.when}</span>
        </div>
      </div>
      <Stars n={r.stars} />
      <p className="text-[14px] leading-5 text-[#172B3A]">{r.text}</p>
      {photos && r.reply && (
        <div className="flex gap-2">
          {[place.imageUrl, place.imageUrl].map((src, i) => (
            <span key={i} className="relative h-[72px] w-[72px] overflow-hidden rounded-[8px] bg-[#E9EDF1]">
              <Image src={src} alt="" fill sizes="72px" className="object-cover" />
            </span>
          ))}
        </div>
      )}
      {r.reply && (
        <div className="flex flex-col gap-1 rounded-[12px] bg-[#F4F6F8] p-3">
          <span className="text-[12px] font-bold leading-4 text-[#172B3A]">Reply from {place.name}</span>
          <span className="text-[12px] leading-4 text-[#4D5E70]">{r.reply}</span>
        </div>
      )}
      <button type="button" className="w-fit text-[12px] leading-4 text-[#68788A]">
        Report
      </button>
    </article>
  );
}

const AMENITY_ICON = [<CarIcon key="c" size={20} />, <HangerIcon key="h" size={20} />, <AccessibilityIcon key="a" size={20} />, <ShieldCheckIcon key="s" size={20} />, <BagIcon key="b" size={20} />, <CalendarIcon key="k" size={20} />];

function SectionTitle({ title, action, href = "#", onClick }: { title: string; action?: string; href?: string; onClick?: () => void }) {
  const cls = "flex items-center gap-0.5 text-[13px] leading-4 text-[#C81E57]";
  return (
    <div className="flex h-[26px] items-center justify-between">
      <h2 className="text-[20px] font-bold leading-[26px] tracking-[-0.02em] text-[#172B3A]">{title}</h2>
      {action &&
        (onClick ? (
          <button type="button" onClick={onClick} className={cls}>
            {action}
            <ChevronRightIcon size={16} />
          </button>
        ) : (
          <Link href={href} className={cls}>
            {action}
            <ChevronRightIcon size={16} />
          </Link>
        ))}
    </div>
  );
}

/** AM24 Claim this place sheet. */
function ClaimSheet({ open, onClose, toast }: { open: boolean; onClose: () => void; toast: (m: string) => void }) {
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Is this your place?"
      footer={
        <>
          <button type="button" onClick={onClose} className={`${sheetSecondary} w-[104px]`}>
            Not now
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              toast("We emailed you the link");
            }}
            className={sheetPrimary}
          >
            Email me the link
          </button>
        </>
      }
    >
      <p className="pb-2 text-[14px] leading-5 text-[#4D5E70]">Owners keep hours, photos and menus up to date and get the Verified place badge.</p>
      <ActionRow icon={<ShieldCheckIcon size={20} />} title="Claim on the web" subtitle="Sign in at xiventa.com/business. You need a business profile." trailing={<span />} />
      <ActionRow icon={<CheckIcon size={20} />} title="How we check" subtitle="A code to the listed phone or email, a CAC document or an on site photo" trailing={<span />} />
    </Sheet>
  );
}

interface Props {
  place: Place;
  details: PlaceDetails;
  upcoming: XiventaEvent[];
  tables?: XiventaEvent;
  nearby: Place[];
}

/**
 * Place page. Phone: AM24 (259:7009, Closed now 259:9014, Been here 730:53899, Special day 976:66512,
 * Guest 793:53460). Web (768 px and up): PW08 (313:19517, Been here 1096:72668, Special day 1096:73216).
 * `?state=closed | been-here | special-day` previews the other states.
 */
export function PlaceDetail({ place, details: d, upcoming, tables, nearby }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const initial = (params.get("state") as PlaceState) ?? (place.isOpenNow ? "open" : "closed");
  const [state] = useState<PlaceState>(["open", "closed", "been-here", "special-day"].includes(initial) ? initial : "open");
  const visits = useVisits();
  const session = useSession();
  const [beenDraft, setBeen] = useState<boolean | null>(null);
  const been = beenDraft ?? (state === "been-here" || visits.been.includes(place.slug));
  const planned = visits.plans.find((p) => p.slug === place.slug);
  const photoInput = useRef<HTMLInputElement>(null);
  const [saved, setSaved] = useState(false);
  const [sheet, setSheet] = useState<null | "share" | "report" | "directions" | "claim" | "plan" | "hours" | "reviews" | "write">(() =>
    // /places/<slug>?plan opens PW47 straight away (AM65 sends desktop visitors here).
    params.has("plan") ? "plan" : null
  );
  const [aboutOpen, setAboutOpen] = useState(false);
  const { show: toast, node: toastNode } = useToast();

  const address = `${d.street}, ${place.neighborhood}`;
  const status =
    state === "special-day"
      ? { tag: "Closed today", tone: "closed", title: "Closed today · Christmas Day", sub: `Back tomorrow, ${d.todayHours}`, web: "Closed today for Christmas Day" }
      : state === "closed"
        ? { tag: "Closed now", tone: "closed", title: "Closed now · Opens 4 PM today", sub: `Every day, ${d.todayHours}`, web: `Opens today at 4 PM` }
        : { tag: "Open now", tone: "open", title: `Open now · Closes ${d.closesAt}`, sub: `Every day, ${d.todayHours}`, web: `Open today, ${d.todayHours}` };
  const tagTone = place.tagBg && place.tagColor ? { bg: place.tagBg, fg: place.tagColor } : { bg: "#FFEDFD", fg: "#A8189E" };
  const initials = place.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  // PW32: guests are asked to sign in first, then come back to this place.
  const [signIn, setSignIn] = useState<SignInReason | null>(null);
  const guest = session !== undefined && session?.status !== "signed-in";
  const toggleSave = () => {
    if (guest) return setSignIn("save");
    const next = !saved;
    setSaved(next);
    if (next) toast("Saved to My places", "View", () => router.push("/my-places"));
    else toast("Removed from My places", "Undo", () => setSaved(true));
  };
  const toggleBeen = () => {
    const next = !been;
    setBeen(next);
    storeBeen(place.slug, next);
    toast(next ? "Marked as Been here. Only you can see this" : "Removed from Been here");
  };
  const special = state === "special-day";
  const plan = () => (isDesktop() ? setSheet("plan") : router.push(`/places/${place.slug}/plan${special ? "?state=special-day" : ""}`));
  const write = () => (guest ? setSignIn("review") : setSheet("write"));

  const statusPill = (
    <span className={`inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-full px-2 text-[12px] leading-4 ${status.tone === "open" ? "bg-[#E3F8EF] text-[#067647]" : "bg-[#E9EDF1] text-[#33465A]"}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${status.tone === "open" ? "bg-[#067647]" : "bg-[#68788A]"}`} />
      {status.tag}
    </span>
  );
  const beenPill = been && (
    <span className="inline-flex h-6 items-center whitespace-nowrap rounded-full bg-[#E6F1FF] px-2 text-[12px] leading-4 text-[#0059BE]">Been here</span>
  );

  return (
    <>
      {/* ================= App (AM24) ================= */}
      <div className="min-h-screen bg-white pb-[93px] md:hidden">
        <div className="relative h-[360px] w-full overflow-hidden bg-[#172B3A]">
          <Image src={d.hero} alt={place.name} fill priority sizes="100vw" className="object-cover" />
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
              <button
                type="button"
                aria-pressed={been}
                onClick={toggleBeen}
                className={`flex h-9 items-center gap-1.5 rounded-full pl-3 pr-3.5 text-[13px] font-bold ${been ? "bg-[#E22765] text-white" : "bg-white/[0.72] text-[#172B3A]"}`}
              >
                <CheckIcon size={16} />
                Been here
              </button>
              <button type="button" aria-label={saved ? "Saved" : "Save"} aria-pressed={saved} onClick={toggleSave} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.72] text-[#172B3A]">
                {saved ? <BookmarkFilledIcon size={20} /> : <BookmarkIcon size={20} />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 px-4 pb-2 pt-5">
          <div className="flex flex-wrap items-center gap-1.5">
            <CategoryTag label={place.categoryLabel} bg={tagTone.bg} fg={tagTone.fg} />
            {statusPill}
            {beenPill}
          </div>
          <h1 className="text-[24px] font-bold leading-[30px] tracking-[-0.02em] text-[#172B3A]">{place.name}</h1>
          <div className="flex h-10 items-center gap-2.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F1EEFF] text-[13px] leading-4 text-[#5B3FD6]">{initials}</span>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="flex items-center gap-1 text-[14px] font-bold leading-5 text-[#172B3A]">
                {d.team}
                <VerifiedBadgeIcon size={14} className="text-[#E22765]" />
              </span>
              <span className="truncate text-[12px] leading-4 text-[#4D5E70]">{d.teamMeta}</span>
            </span>
            <ChevronRightIcon size={20} className="shrink-0 text-[#172B3A]" />
          </div>
        </div>

        <div className="flex flex-col px-4">
          <ActionRow icon={<ClockIcon size={20} />} title={status.title} subtitle={status.sub} onClick={() => setSheet("hours")} />
          <ActionRow icon={<MapPinIcon size={20} />} title={d.street} subtitle={`${place.neighborhood}, ${place.side} · ${place.distanceLabel.replace(" away", "")} · Get directions`} onClick={() => setSheet("directions")} />
          <MapPreview app name={place.name} address={address} onDirections={() => setSheet("directions")} />
          <ActionRow icon={<UtensilsIcon size={20} />} title="See the menu" subtitle={d.menuUpdated} href={`/places/${place.slug}/menu`} />
          <ActionRow icon={<PhoneIcon size={20} />} title={`Call ${place.name}`} subtitle={d.phone} href={`tel:${d.phone.replace(/\s/g, "")}`} />
          <ActionRow icon={<CalendarIcon size={20} />} title={planned ? "Visit planned" : "Plan a visit"} subtitle={planned ? `${planned.label} · tap to change` : "Pick a day and add it to your calendar"} onClick={plan} />
        </div>

        <section className="flex flex-col gap-3 px-4 pt-6">
          <SectionTitle title="About" />
          <p className={`text-[14px] leading-5 text-[#4D5E70] ${aboutOpen ? "" : "line-clamp-3"}`}>{d.about}</p>
          {d.about.length > 140 && (
            <button type="button" onClick={() => setAboutOpen((v) => !v)} className="w-fit text-[13px] leading-4 text-[#C81E57]">
              {aboutOpen ? "Show less" : "Read more"}
            </button>
          )}
        </section>

        <section className="flex flex-col gap-3 px-4 pt-6">
          <SectionTitle title="Amenities" />
          <div className="flex flex-col">
            {d.amenities.map(([k, v], i) => (
              <div key={k} className="flex min-h-[60px] items-center gap-3 py-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F4F6F8] text-[#172B3A]">{AMENITY_ICON[i % AMENITY_ICON.length]}</span>
                <span className="shrink-0 text-[16px] leading-6 tracking-[-0.01em] text-[#172B3A]">{k}</span>
                <span className="min-w-0 flex-1 text-right text-[14px] leading-5 text-[#4D5E70]">{v}</span>
              </div>
            ))}
          </div>
        </section>

        {tables && (
          <section className="flex flex-col gap-3 px-4 pt-6">
            <SectionTitle title="Book a table" />
            <p className="text-[13px] leading-[18px] text-[#4D5E70]">Tables are sold for nights at this place. Pick a night to see table packages.</p>
            <ListEventCard event={tables} />
          </section>
        )}

        <section className="flex flex-col gap-4 px-4 pt-6">
          <SectionTitle title="Reviews" action={`See all ${d.reviewCount}`} onClick={() => setSheet("reviews")} />
          <div className="flex items-center gap-3">
            <span className="text-[24px] font-bold leading-[30px] tracking-[-0.02em] text-[#172B3A]">{d.rating}</span>
            <span className="flex flex-col gap-1">
              <Stars n={d.rating} />
              <span className="text-[12px] leading-4 text-[#4D5E70]">{d.reviewCount} reviews</span>
            </span>
          </div>
          {d.reviews.slice(0, 2).map((r) => (
            <ReviewCard key={r.name} r={r} place={place} />
          ))}
          <button type="button" onClick={write} className="flex h-11 items-center justify-center rounded-[12px] border border-[#B4BFCA] text-[14px] leading-[18px] text-[#172B3A]">
            Write a review
          </button>
        </section>

        {upcoming.length > 0 && (
          <section className="flex flex-col pt-6">
            <div className="px-4">
              <SectionTitle title={`Upcoming at ${place.name}`} action="See all" />
            </div>
            <div className="overflow-x-auto overflow-y-hidden pb-5 no-scrollbar" style={{ scrollbarWidth: "none" }}>
              <div className="flex w-max gap-3 px-4 pt-3">
                {upcoming.map((e) => (
                  <EventCard key={e.id} event={e} variant="compact" />
                ))}
              </div>
            </div>
          </section>
        )}

        {nearby.length > 0 && (
          <section className="flex flex-col pt-2">
            <div className="px-4">
              <SectionTitle title="Places nearby" action="See all" href="/places" />
            </div>
            <div className="overflow-x-auto overflow-y-hidden no-scrollbar" style={{ scrollbarWidth: "none" }}>
              <div className="flex w-max gap-3 px-4 pt-3">
                {nearby.map((p) => (
                  <PlaceCard key={p.slug} place={p} variant="compact" />
                ))}
              </div>
            </div>
          </section>
        )}

        <div className="flex flex-col px-4 pb-6 pt-4">
          <ActionRow icon={<CameraIcon size={20} />} title="Add photos" subtitle="Been here? Show people what it looks like" onClick={() => photoInput.current?.click()} />
          <ActionRow icon={<ShieldCheckIcon size={20} />} title="Is this your place?" subtitle="Claim it to update hours, photos and menu" onClick={() => setSheet("claim")} />
          <ActionRow icon={<FlagIcon size={20} />} title="Report this place" subtitle="Wrong details, closed for good or something else" onClick={() => (guest ? setSignIn("report") : setSheet("report"))} />
        </div>

        <div className="fixed inset-x-0 bottom-0 z-40 flex items-center border-t border-[#E9EDF1] bg-white px-4 pb-[max(28px,env(safe-area-inset-bottom))] pt-3">
          <button type="button" onClick={() => setSheet("directions")} className="flex h-[52px] flex-1 items-center justify-center gap-2 rounded-[12px] bg-[#E22765] px-5 text-[16px] leading-5 tracking-[-0.01em] text-white">
            <NavigationIcon size={20} />
            Get directions
          </button>
        </div>
      </div>

      {/* ================= Web (PW08) ================= */}
      <div className="hidden min-h-screen w-full flex-col overflow-x-clip bg-white md:flex">
        <TopNav />
        <main className="mx-auto w-full max-w-[1440px] flex-1 px-6 pb-24 pt-10 lg:px-[120px]">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
            <div className="flex min-w-0 flex-col gap-8 lg:w-[768px]">
              <div className="relative aspect-[768/432] w-full overflow-hidden rounded-2xl bg-[#E9EDF1]">
                <Image src={d.hero} alt={place.name} fill priority sizes="768px" className="object-cover" />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {statusPill}
                <CategoryTag label={place.categoryLabel} bg={tagTone.bg} fg={tagTone.fg} />
                {beenPill}
              </div>
              <h1 className="text-[40px] font-bold leading-[44px] tracking-[-0.02em] text-[#172B3A]">{place.name}</h1>
              <div className="flex h-16 items-center gap-3 rounded-[12px] bg-white px-4 py-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F1EEFF] text-[13px] leading-4 text-[#5B3FD6]">{initials}</span>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px] text-[#172B3A]">{d.team}</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#E3F8EF] py-[3px] pl-1.5 pr-2 text-[12px] text-[#067647]">
                      <ShieldCheckIcon size={14} />
                      Verified place
                    </span>
                  </div>
                  <span className="text-[12px] text-[#4D5E70]">{d.webTeamMeta}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <ActionRow icon={<ClockIcon size={20} />} title={status.web} subtitle="See all hours" onClick={() => document.getElementById("hours")?.scrollIntoView({ behavior: "smooth" })} />
                <ActionRow icon={<MapPinIcon size={20} />} title={address} subtitle="Get directions" onClick={() => setSheet("directions")} />
                <ActionRow icon={<UtensilsIcon size={20} />} title="Menu" subtitle={d.menuUpdated} href={`/places/${place.slug}/menu`} />
                <ActionRow icon={<PhoneIcon size={20} />} title={d.phone} subtitle="Call or WhatsApp" href={`tel:${d.phone.replace(/\s/g, "")}`} />
              </div>
              <MapPreview name={place.name} address={address} onDirections={() => setSheet("directions")} />
              <section className="flex flex-col gap-2">
                <h2 className="text-[20px] font-bold leading-[26px] tracking-[-0.02em] text-[#172B3A]">About</h2>
                <p className="text-[16px] leading-6 tracking-[-0.01em] text-[#4D5E70]">{d.about}</p>
              </section>
              <section className="flex flex-col gap-3">
                <h2 className="text-[20px] font-bold leading-[26px] tracking-[-0.02em] text-[#172B3A]">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {d.chips.map((c) => (
                    <span key={c} className="flex h-8 items-center rounded-full border border-[#B4BFCA] bg-white px-4 text-[13px] leading-4 text-[#4D5E70]">
                      {c}
                    </span>
                  ))}
                </div>
              </section>
              <section className="flex flex-col gap-4">
                <h2 className="text-[20px] font-bold leading-[26px] tracking-[-0.02em] text-[#172B3A]">Reviews</h2>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-[24px] font-bold leading-[30px] tracking-[-0.02em] text-[#172B3A]">{d.rating}</span>
                    <span className="flex flex-col gap-1">
                      <Stars n={d.rating} />
                      <span className="text-[12px] leading-4 text-[#4D5E70]">{d.reviewCount} reviews</span>
                    </span>
                  </div>
                  <button type="button" onClick={write} className="flex h-11 items-center rounded-[12px] border border-[#B4BFCA] px-4 text-[14px] leading-[18px] text-[#172B3A]">
                    Write a review
                  </button>
                </div>
                <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-2">
                  {d.reviews.slice(0, 2).map((r) => (
                    <ReviewCard key={r.name} r={r} place={place} photos />
                  ))}
                </div>
                <button type="button" onClick={() => setSheet("reviews")} className="flex h-11 w-fit items-center rounded-[12px] px-4 text-[14px] leading-[18px] text-[#C81E57] hover:bg-[#FDEEF3]">
                  See all {d.reviewCount} reviews
                </button>
              </section>
              {upcoming.length > 0 && (
                <section className="flex flex-col gap-4">
                  <SectionTitle title={`Upcoming at ${place.name}`} action="See all" />
                  <div className="flex gap-6 overflow-x-auto overflow-y-hidden no-scrollbar" style={{ scrollbarWidth: "none" }}>
                    {upcoming.map((e) => (
                      <EventCard key={e.id} event={e} width={240} />
                    ))}
                  </div>
                </section>
              )}
              {nearby.length > 0 && (
                <section className="flex flex-col gap-4">
                  <SectionTitle title="Places nearby" action="See all" href="/places" />
                  <div className="flex gap-6 overflow-x-auto overflow-y-hidden no-scrollbar" style={{ scrollbarWidth: "none" }}>
                    {nearby.map((p) => (
                      <div key={p.slug} className="w-[262px] shrink-0">
                        <PlaceCard place={p} className="w-full" />
                      </div>
                    ))}
                  </div>
                </section>
              )}
              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={() => setSheet("claim")} className="flex h-11 items-center rounded-[12px] px-4 text-[14px] leading-[18px] text-[#C81E57] hover:bg-[#FDEEF3]">
                  Is this your place? Claim it
                </button>
                <button type="button" onClick={() => (guest ? setSignIn("report") : setSheet("report"))} className="flex h-11 items-center rounded-[12px] px-4 text-[14px] leading-[18px] text-[#C81E57] hover:bg-[#FDEEF3]">
                  Report this place
                </button>
              </div>
            </div>

            <aside id="hours" className="flex w-full flex-col gap-6 lg:sticky lg:top-[96px] lg:w-[384px] lg:shrink-0">
              <div className="flex flex-col gap-1 rounded-2xl border border-[#E9EDF1] bg-white p-6">
                <h2 className="pb-1 text-[20px] font-bold leading-[26px] tracking-[-0.02em] text-[#172B3A]">Plan your visit</h2>
                {state === "special-day" && <p className="pb-2 text-[13px] leading-[18px] text-[#C0231A]">Closed today for Christmas Day. Back tomorrow.</p>}
                {d.hours.map(([day, h]) => (
                  <div key={day} className="flex h-12 items-center gap-3">
                    <span className="flex-1 text-[16px] leading-6 tracking-[-0.01em] text-[#172B3A]">{day}</span>
                    <span className="text-[14px] leading-5 text-[#4D5E70]">{h}</span>
                  </div>
                ))}
                <button type="button" onClick={() => setSheet("directions")} className="mt-1 flex h-[52px] items-center justify-center rounded-[12px] bg-[#E22765] text-[16px] leading-5 tracking-[-0.01em] text-white hover:bg-[#C81E57]">
                  Get directions
                </button>
                <button type="button" onClick={plan} className="flex h-[52px] items-center justify-center rounded-[12px] border border-[#B4BFCA] bg-white text-[16px] leading-5 tracking-[-0.01em] text-[#172B3A]">
                  {planned ? `Planned · ${planned.label}` : "Plan a visit"}
                </button>
                <div className="flex gap-2 pt-0">
                  <button type="button" onClick={() => setSheet("share")} className="flex h-11 flex-1 items-center justify-center rounded-[12px] border border-[#B4BFCA] text-[14px] text-[#172B3A]">
                    Share
                  </button>
                  <button type="button" onClick={toggleSave} aria-pressed={saved} className="flex h-11 flex-1 items-center justify-center gap-2 rounded-[12px] border border-[#B4BFCA] text-[14px] text-[#172B3A]">
                    {saved ? <BookmarkFilledIcon size={20} /> : <BookmarkIcon size={20} />}
                    {saved ? "Saved" : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={toggleBeen}
                    aria-pressed={been}
                    className={`flex h-11 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-[12px] border text-[14px] ${been ? "border-[#E22765] bg-[#FDEEF3] text-[#C81E57]" : "border-[#B4BFCA] text-[#172B3A]"}`}
                  >
                    <CheckIcon size={20} />
                    Been here
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </main>
        <WebFooter />
      </div>

      <ShareSheet open={sheet === "share"} onClose={() => setSheet(null)} title="Share place" subtitle={`${place.name} · ${place.neighborhood}`} path={`/p/${place.slug}`} toast={toast} />
      <ReportSheet open={sheet === "report"} onClose={() => setSheet(null)} what="place" toast={toast} />
      <DirectionsSheet open={sheet === "directions"} onClose={() => setSheet(null)} name={place.name} address={address} toast={toast} />
      <ClaimSheet open={sheet === "claim"} onClose={() => setSheet(null)} toast={toast} />
      <PlanVisitSheet open={sheet === "plan"} onClose={() => setSheet(null)} place={place} details={d} special={special} toast={toast} />
      <SignInSheet reason={signIn} onClose={() => setSignIn(null)} returnTo={`/places/${place.slug}`} />
      <HoursSheet open={sheet === "hours"} onClose={() => setSheet(null)} details={d} />
      <PlaceReviewsSheet open={sheet === "reviews"} onClose={() => setSheet(null)} place={place} details={d} toast={toast} onWrite={write} />
      <WriteReviewSheet open={sheet === "write"} onClose={() => setSheet(null)} place={place} />
      <input
        ref={photoInput}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => e.target.files?.length && toast(`${e.target.files.length > 1 ? `${e.target.files.length} photos` : "Photo"} added. It shows once our team checks it`)}
      />
      {toastNode}
    </>
  );
}
