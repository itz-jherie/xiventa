"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getAllCategories, getSpotlightStories, img, pickEvents, pickPlaces } from "@/data";
import { TopNav } from "@/components/web/TopNav";
import { WebFooter } from "@/components/web/WebFooter";
import { EventCard } from "@/components/web/EventCard";
import { PlaceCard } from "@/components/web/PlaceCard";
import { SpotlightCard } from "@/components/web/SpotlightCard";
import { CityPicker } from "@/components/shared/CityPicker";
import { useToast } from "@/components/shared/Sheet";
import { CategoryTile } from "@/components/web/CategoryTile";
import { SectionHeader } from "@/components/web/SectionHeader";
import { Chip } from "@/components/shared/Chip";
import { MapPinIcon, SearchIcon } from "@/components/icons";

const QUICK_FILTERS = [
  { label: "Tonight", href: "/events?date=tonight" },
  { label: "This weekend", href: "/events?date=weekend" },
  { label: "Free", href: "/events?price=free" },
  { label: "Online", href: "/events?format=online" },
];

/**
 * PW01 Home, 1:1 with Figma frame 310:16350 (1440 wide).
 * Main: padding 40 / 120 / 96, sections 56 apart, 1200 content width.
 */
export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [cityOpen, setCityOpen] = useState(false);
  const { show: toast, node: toastNode } = useToast();

  const categories = getAllCategories();
  const spotlightStories = getSpotlightStories();
  const weekendEvents = pickEvents(["abnormal-nightout", "jersey-creek-picnic", "afrobeats-live-session", "lekki-food-market"]);
  const freeEvents = pickEvents(["jersey-creek-picnic", "define-your-brand", "sunday-praise-gathering", "sunrise-yoga-by-the-water"]);
  const places = pickPlaces([
    ["skyline-lounge", { imageUrl: img("dcd2cb3c") }],
    ["the-garden-lagos", { imageUrl: img("77336b6d") }],
    ["lagoon-park", { imageUrl: img("9fd92999") }],
  ]);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-clip bg-white text-[#172B3A]">
      <TopNav />

      <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-14 px-4 pb-24 pt-10 md:px-[clamp(40px,calc((100%-1200px)/2),120px)]">
        {/* Hero: text 752 + mode tiles 400, gap 48, centred vertically */}
        <section className="flex flex-col gap-12 lg:flex-row lg:items-center">
          <div className="flex min-w-0 flex-1 flex-col gap-5">
            <button
              type="button"
              onClick={() => setCityOpen(true)}
              className="inline-flex h-8 w-fit items-center gap-1.5 rounded-full bg-[#E22765] px-4 text-[13px] leading-4 text-white"
            >
              <MapPinIcon size={16} className="text-white" />
              Lagos
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <h1 className="text-[40px] font-bold leading-[44px] tracking-[-0.02em] text-[#172B3A]">What&apos;s on in Lagos</h1>
            <p className="text-[16px] leading-6 tracking-[-0.01em] text-[#4D5E70]">
              Parties, picnics, live music, church programmes and places worth the trip. Find it, book it, go.
            </p>

            <form
              onSubmit={handleHeroSearch}
              role="search"
              className="flex h-12 w-full max-w-[752px] items-center gap-2 rounded-full border border-[#E9EDF1] bg-[#F4F6F8] pl-4 pr-1.5 focus-within:border-[#E22765]"
            >
              <SearchIcon size={20} className="shrink-0 text-[#68788A]" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events, places or artists"
                aria-label="Search events, places or artists"
                className="h-5 w-full bg-transparent text-[14px] leading-5 text-[#172B3A] placeholder:text-[#68788A] focus:outline-none"
              />
            </form>

            <div className="flex flex-wrap items-center gap-2">
              {QUICK_FILTERS.map((f) => (
                <Chip key={f.label} label={f.label} onClick={() => router.push(f.href)} />
              ))}
            </div>
          </div>

          <div className="flex w-full shrink-0 flex-col gap-4 lg:w-[400px]">
            <Link href="/events" className="relative block h-[140px] overflow-hidden rounded-[12px]" aria-label="Events">
              <Image src="/images/mode-events.svg" alt="" fill priority className="object-fill" />
            </Link>
            <Link href="/places" className="relative block h-[140px] overflow-hidden rounded-[12px]" aria-label="Places">
              <Image src="/images/mode-places.svg" alt="" fill priority className="object-fill" />
            </Link>
          </div>
        </section>

        <section className="flex flex-col gap-5">
          <SectionHeader title="Browse by category" />
          <div className="-mx-4 flex items-center gap-5 overflow-x-auto overflow-y-hidden no-scrollbar px-4 md:mx-0 md:px-0" style={{ scrollbarWidth: "none" }}>
            {categories.map((cat) => (
              <CategoryTile key={cat.id} category={cat} />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-5">
          <SectionHeader title="This weekend" subtitle="Fri 24 to Sun 26 Oct" action={{ label: "See all", href: "/events?date=weekend" }} />
          <div className="flex gap-6 overflow-x-auto overflow-y-hidden no-scrollbar" style={{ scrollbarWidth: "none" }}>
            {weekendEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-5">
          <SectionHeader
            title="Spotlight"
            subtitle="Short clips from events and places this week"
            installAction="Get the app to watch"
          />
          <div className="flex gap-6 overflow-x-auto overflow-y-hidden no-scrollbar" style={{ scrollbarWidth: "none" }}>
            {spotlightStories.map((story) => (
              <SpotlightCard key={story.id} story={story} />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-5">
          <SectionHeader title="Places to go" subtitle="Open now near Victoria Island" action={{ label: "See all", href: "/places" }} />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {places.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-5">
          <SectionHeader title="Free this week" action={{ label: "See all", href: "/events?price=free" }} />
          <div className="flex gap-6 overflow-x-auto overflow-y-hidden no-scrollbar" style={{ scrollbarWidth: "none" }}>
            {freeEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-8 rounded-3xl bg-[#172B3A] p-10 md:flex-row md:items-center">
          <div className="flex flex-1 flex-col gap-2">
            <h2 className="text-[28px] font-bold leading-[34px] tracking-[-0.02em] text-white">Hosting something?</h2>
            <p className="text-[16px] leading-6 tracking-[-0.01em] text-[#B4BFCA]">
              Create the event on your phone, sell tickets, check people in and get paid. Free events are always free to list.
            </p>
          </div>
          <Link
            href="/organizers"
            className="flex h-[52px] shrink-0 items-center justify-center rounded-[12px] bg-[#E22765] px-5 text-[16px] leading-5 tracking-[-0.01em] text-white hover:bg-[#C81E57]"
          >
            For organizers
          </Link>
        </section>
      </main>

      <WebFooter />
      <CityPicker open={cityOpen} onClose={() => setCityOpen(false)} toast={toast} />
      {toastNode}
    </div>
  );
}
