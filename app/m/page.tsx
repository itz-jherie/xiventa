"use client";

import { useSettings } from "@/lib/account";

import { useState } from "react";
import { initialsOf, useSession } from "@/lib/session";
import { OfflineBanner } from "@/components/pwa/OfflineBanner";
import { CityPicker } from "@/components/shared/CityPicker";
import { useToast } from "@/components/shared/Sheet";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { img, pickEvents, pickPlaces } from "@/data";
import { MobileTabBar } from "@/components/mobile/MobileTabBar";
import { FeaturedEventCard, ListEventCard } from "@/components/mobile/AppEventCards";
import { EventCard } from "@/components/web/EventCard";
import { PlaceCard } from "@/components/web/PlaceCard";
import { Chip } from "@/components/shared/Chip";
import {
  BallIcon,
  BellIcon,
  CandleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  FilterIcon,
  LaptopIcon,
  MapPinIcon,
  MusicIcon,
  PaletteIcon,
  SearchIcon,
  SparkleIcon,
  UtensilsIcon,
} from "@/components/icons";

const CHIPS = [
  { label: "All", Icon: FilterIcon },
  { label: "Nightlife", Icon: SparkleIcon },
  { label: "Tech", Icon: LaptopIcon },
  { label: "Faith", Icon: CandleIcon },
  { label: "Music", Icon: MusicIcon },
  { label: "Food & Drink", Icon: UtensilsIcon },
  { label: "Arts & Culture", Icon: PaletteIcon },
  { label: "Sports", Icon: BallIcon },
];

/** App section header (Figma `Section / …`): padding 24 / 16 / 12, 20 / 26 bold title, "See all" + chevron. */
function SectionHeader({ title, href = "#", reason, action = true }: { title: string; href?: string; reason?: string; action?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5 px-4 pb-3 pt-6">
      <div className="flex h-[26px] items-center justify-between">
        <h2 className="text-[20px] font-bold leading-[26px] tracking-[-0.02em] text-[#172B3A]">{title}</h2>
        {action && (
          <Link href={href} className="flex items-center gap-0.5 text-[13px] leading-4 text-[#C81E57]">
            See all
            <ChevronRightIcon size={16} />
          </Link>
        )}
      </div>
      {reason && <p className="text-[13px] leading-[15px] text-[#4D5E70]">{reason}</p>}
    </div>
  );
}

/** Horizontal card track: 16 px side padding, scrolls sideways like the app carousels. */
function Track({ gap, children, bottom = 0 }: { gap: number; children: React.ReactNode; bottom?: number }) {
  return (
    <div className="overflow-x-auto overflow-y-hidden no-scrollbar" style={{ paddingBottom: bottom, scrollbarWidth: "none" }}>
      <div className="flex w-max px-4" style={{ gap }}>
        {children}
      </div>
    </div>
  );
}

/**
 * AM11 Home, 1:1 with Figma frame 211:827 (390 wide, content 4265 high, floating tab bar).
 * The status bar is device chrome and is not drawn.
 */
export default function AppHomePage() {
  const router = useRouter();
  const session = useSession();
  const isGuest = session === null || session?.status === "guest";
  const settings = useSettings();
  const side = session?.side ?? "Mainland";
  // AM11 Home / Guest (453:40092) shows "All of Lagos" and a Sign in button (rule 1: guests can browse).
  const unread = !isGuest && settings.ready && !settings.notificationsSeen;
  const areaLabel = isGuest && !session?.side ? "All of Lagos" : side;
  const [cityOpen, setCityOpen] = useState(false);
  const { show: toast, node: toastNode } = useToast();
  const [chip, setChip] = useState("All");
  const [query, setQuery] = useState("");

  const featured = pickEvents(["the-backyard-party", "picnic-in-the-park", "games-night"]);
  const nightlife = pickEvents(["saturn-saturday", "abnormal-nightout", "hangover-friday", "friday-rush"]);
  const tech = pickEvents(["connect-lagos", "emerging-leaders-forum", "define-your-brand"]);
  const faith = pickEvents(["encounter-night", "sunday-worship-experience", "kingdom-conference"]);
  const tonight = pickEvents(["friday-rush"]);
  const weekend = pickEvents(["movie-night-under-the-stars", "sporty-sunday-viewing-party"]);
  const free = pickEvents(["jersey-creek-picnic", "kids-wonderland-day", "ultimate-game-night"]);
  const online = pickEvents(["album-listening-live", "midweek-prayer-online"]);

  const placesYoullLike = pickPlaces([["pulse-club", {}], ["cove-bar", {}], ["skyline-lounge", { imageUrl: img("92c79913") }]]);
  const yourKind = pickPlaces(["art-twenty-one", "bogobiri-house", "hans-and-rene"]);
  const placesToGo = pickPlaces(["azure-pool-club", "sandbar-beach-club", "terrace-21"]);
  const nearYou = pickPlaces([
    ["the-garden-lagos", { imageUrl: img("943ae751") }],
    ["play-arena", { imageUrl: img("14177d62"), metaLabel: "Arcade · Lekki", distanceKm: 5, distanceLabel: "5 km away" }],
    "strike-lanes",
    "azure-pool-club",
  ]);

  return (
    <div className="mx-auto min-h-screen w-full max-w-[390px] overflow-x-hidden bg-white pb-[108px] text-[#172B3A]">
      {/* Header */}
      <header className="flex h-[68px] items-center justify-between p-4">
        <button type="button" onClick={() => setCityOpen(true)} className="flex items-center gap-1.5">
          <MapPinIcon size={20} className="text-[#E22765]" />
          <span className="text-[17px] font-bold leading-[22px] tracking-[-0.01em]">{areaLabel}</span>
          <ChevronDownIcon size={18} className="text-[#172B3A]" />
        </button>
        <div className="flex items-center gap-2">
          <Link href={isGuest ? "/welcome" : "/notifications"} aria-label={unread ? "Notifications, 1 unread" : "Notifications"} className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#D5DCE3] bg-white">
            <BellIcon size={20} className="text-[#172B3A]" />
            {unread && <span className="absolute left-[25px] top-0.5 h-[9px] w-[9px] rounded-full border-[1.5px] border-white bg-[#E22765]" />}
          </Link>
          {isGuest ? (
            <Link href="/welcome" className="flex h-8 items-center rounded-[8px] bg-[#E22765] px-3 text-[13px] leading-4 text-white">
              Sign in
            </Link>
          ) : (
            <Link href="/account" aria-label="Profile" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F1EEFF] text-[13px] leading-4 text-[#5B3FD6]">
              {session ? initialsOf(session.name) : ""}
            </Link>
          )}
        </div>
      </header>

      <OfflineBanner />

      {/* Promo banner */}
      <div className="px-4 pb-3">
        <Link href="/events?date=weekend" className="relative flex h-[72px] flex-col justify-center gap-0.5 overflow-hidden rounded-[12px] px-4 py-3">
          <Image src={img("6b030ea9")} alt="" fill sizes="358px" className="object-cover" />
          <span className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(10,15,31,0.85) 0%, rgba(10,15,31,0) 75%)" }} />
          <span className="relative text-[10px] uppercase leading-3 tracking-[0.04em] text-[#B4BFCA]">This weekend in Lagos</span>
          <span className="relative text-[16px] font-bold leading-6 tracking-[-0.01em] text-white">Game nights, picnics and rooftops</span>
        </Link>
      </div>

      {/* Search */}
      <form
        className="px-4 py-3"
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          router.push(query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : "/search");
        }}
      >
        <div className="flex h-12 items-center gap-2 rounded-full border border-[#E9EDF1] bg-[#F4F6F8] pl-4 pr-1.5">
          <SearchIcon size={20} className="shrink-0 text-[#68788A]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => router.push("/search")}
            placeholder="Search events, places and hosts"
            aria-label="Search events, places and hosts"
            className="h-5 w-full bg-transparent text-[14px] leading-5 placeholder:text-[#68788A] focus:outline-none"
          />
        </div>
      </form>

      {/* Chips */}
      <div className="overflow-x-auto overflow-y-hidden no-scrollbar" style={{ scrollbarWidth: "none" }}>
        <div className="flex w-max gap-2 p-4">
          {CHIPS.map(({ label, Icon }) => (
            <Chip
              key={label}
              label={label}
              selected={chip === label}
              onClick={() => setChip(label)}
              leadingIcon={<Icon size={16} className={chip === label ? "text-white" : "text-[#68788A]"} />}
            />
          ))}
        </div>
      </div>

      {/* Mode tiles */}
      <div className="flex gap-3.5 px-4">
        <Link href="/m/events" className="relative h-[72px] w-[172px] overflow-hidden rounded-[12px]">
          <Image src="/images/mode-events-mobile.svg" alt="" fill className="object-fill" />
          <span className="absolute left-[17px] top-[27px] text-[14px] leading-[18px] text-[#172B3A]">Events</span>
        </Link>
        <Link href="/m/places" className="relative h-[72px] w-[172px] overflow-hidden rounded-[12px]">
          <Image src="/images/mode-places-mobile.svg" alt="" fill className="object-fill" />
          <span className="absolute left-[19px] top-[27px] text-[14px] leading-[18px] text-[#172B3A]">Places</span>
        </Link>
      </div>

      <SectionHeader title="Featured events" action={false} />
      <Track gap={14}>
        {featured.map((e) => (
          <FeaturedEventCard key={e.id} event={e} showVenue={e.slug === "games-night"} />
        ))}
      </Track>

      <p className="px-4 pt-7 text-[10px] uppercase leading-3 tracking-[0.04em] text-[#4D5E70]">Picked for your interests</p>

      <SectionHeader title="Nightlife and parties" />
      <Track gap={12} bottom={20}>
        {nightlife.map((e) => <EventCard key={e.id} event={e} variant="compact" />)}
      </Track>

      <SectionHeader title="Places you'll like" />
      <Track gap={12}>
        {placesYoullLike.map((p) => <PlaceCard key={p.id} place={p} variant="compact" />)}
      </Track>

      <SectionHeader title="Tech and business" />
      <Track gap={12} bottom={20}>
        {tech.map((e) => <EventCard key={e.id} event={e} variant="compact" />)}
      </Track>

      <SectionHeader title="Faith and spirituality" />
      <Track gap={12} bottom={20}>
        {faith.map((e) => <EventCard key={e.id} event={e} variant="compact" />)}
      </Track>

      <div className="pl-2 pt-2">
        <Link href="/interests" className="inline-flex h-8 items-center gap-2 rounded-[8px] px-3 text-[13px] leading-4 text-[#C81E57]">
          Edit your interests
          <ChevronRightIcon size={16} />
        </Link>
      </div>

      <SectionHeader title="Your kind of place" action={false} reason="Because you went to Nok by Alara. Only you see this." />
      <Track gap={12}>
        {yourKind.map((p) => <PlaceCard key={p.id} place={p} variant="compact" />)}
      </Track>

      <SectionHeader title={isGuest && !session?.side ? "Tonight in Lagos" : `Tonight on the ${side}`} />
      <div className="flex flex-col gap-3 px-4">
        {tonight.map((e) => <ListEventCard key={e.id} event={e} />)}
      </div>

      <SectionHeader title="Places to go" />
      <Track gap={12}>
        {placesToGo.map((p) => <PlaceCard key={p.id} place={p} variant="featured" />)}
      </Track>

      <SectionHeader title={isGuest && !session?.side ? "This weekend in Lagos" : `This weekend on the ${side}`} />
      <div className="flex flex-col gap-3 px-4">
        {weekend.map((e) => <ListEventCard key={e.id} event={e} showRepeatAndAge={false} />)}
      </div>

      <SectionHeader title="Free this week" />
      <Track gap={12} bottom={20}>
        {free.map((e) => <EventCard key={e.id} event={e} variant="compact" />)}
      </Track>

      <SectionHeader title="Online and hybrid" />
      <Track gap={12} bottom={20}>
        {online.map((e) => <EventCard key={e.id} event={e} variant="compact" />)}
      </Track>

      <SectionHeader title="Places near you" />
      <Track gap={12}>
        {nearYou.map((p) => <PlaceCard key={p.id} place={p} variant="compact" />)}
      </Track>

      <MobileTabBar />
      <CityPicker open={cityOpen} onClose={() => setCityOpen(false)} toast={toast} />
      {toastNode}
    </div>
  );
}
