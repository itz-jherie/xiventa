"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  getAllCategories,
  getWeekendEvents,
  getFreeEvents,
  getAllPlaces,
  getSpotlightStories,
} from "@/data";
import { TopNav } from "@/components/web/TopNav";
import { WebFooter } from "@/components/web/WebFooter";
import { EventCard } from "@/components/web/EventCard";
import { PlaceCard } from "@/components/web/PlaceCard";
import { SpotlightCard } from "@/components/web/SpotlightCard";
import { CategoryTile } from "@/components/web/CategoryTile";
import { MobileTabBar } from "@/components/mobile/MobileTabBar";
import {
  MapPinIcon,
  SearchIcon,
  FilterIcon,
  ChevronDownIcon,
  ArrowRightIcon,
} from "@/components/icons";

/**
 * PW01 Home Screen
 * 1:1 exact match with Figma screen `PW01 Home` (Node `310:16350`)
 *
 * - Canvas: 1440px wide, Background: #FFFFFF (Variable 17:91)
 * - Inner Main container: 1200px wide centered
 * - Gap between main sections: 64px
 * - Strict adherence to typography, tokens, borders, and geometry
 */
export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Dynamic datasets from data store
  const categories = getAllCategories();
  const weekendEvents = getWeekendEvents();
  const freeEvents = getFreeEvents();
  const places = getAllPlaces();
  const spotlightStories = getSpotlightStories();

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/events?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#172B3A] font-sans selection:bg-[#E22765]/15 selection:text-[#E22765]">
      {/* Top Nav (Web) - 1:1 Figma Node 310:16351 */}
      <TopNav />

      {/* Main Content Area: 1200px centered (Node 310:16386) */}
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-10 space-y-16 pb-24 md:pb-20">
        {/* 1. HERO SECTION (Node 310:16387, w: 1200, h: 296, gap: 48) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Hero Left Text (Node 310:16388, w: 752, h: 260) */}
          <div className="lg:col-span-8 space-y-5">
            {/* City Chip (Node 310:16389, w: 112, h: 32, bg: #E22765) */}
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#E22765] text-white text-[13px] font-medium shadow-xs select-none">
              <MapPinIcon size={14} className="stroke-white" />
              <span>Lagos</span>
              <ChevronDownIcon size={14} className="stroke-white ml-0.5" />
            </div>

            {/* Headline (Node 310:16402, 40px Arimo Bold, #172B3A) */}
            <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-[#172B3A] tracking-tight leading-tight">
              What&apos;s on in Lagos
            </h1>

            {/* Subhead (Node 310:16403, 16px Arimo Regular, #4D5E70) */}
            <p className="text-[16px] text-[#4D5E70] leading-relaxed max-w-2xl">
              Parties, picnics, live music, church programmes and places worth the trip. Find it, book it, go.
            </p>

            {/* Search Field & Quick Chips (Node 310:16404 & 310:16414) */}
            <div className="space-y-3 pt-1">
              {/* Search Field (w: 752, h: 48, r: 999 rounded-full, bg: #F4F6F8, border: 1px #E9EDF1, pl-4 pr-1.5) */}
              <form
                onSubmit={handleHeroSearch}
                className="flex items-center w-full max-w-[752px] h-[48px] bg-[#F4F6F8] rounded-full pl-4 pr-1.5 border border-[#E9EDF1] focus-within:border-[#E22765] focus-within:ring-2 focus-within:ring-[#E22765]/20 focus-within:bg-white transition-all shadow-2xs"
              >
                <SearchIcon size={20} className="text-[#68788A] mr-2.5 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search events, places or artists"
                  className="w-full bg-transparent text-[14px] text-[#172B3A] placeholder:text-[#68788A] focus:outline-none font-normal"
                />
                <button
                  type="submit"
                  aria-label="Filter"
                  className="w-9 h-9 rounded-full bg-[#E22765] hover:bg-[#C81E57] text-white flex items-center justify-center shrink-0 transition shadow-xs"
                >
                  <FilterIcon size={16} />
                </button>
              </form>

              {/* Quick Filter Chips (Node 310:16414: Tonight, This weekend, Free, Online; h: 32, r: 999, px-4, text: #4D5E70, border: 1px #B4BFCA) */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {["Tonight", "This weekend", "Free", "Online"].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setActiveFilter(activeFilter === chip ? null : chip)}
                    className={`h-[32px] px-4 rounded-full text-[13px] font-normal border transition-colors shrink-0 ${
                      activeFilter === chip
                        ? "bg-[#172B3A] text-white border-[#172B3A]"
                        : "bg-white text-[#4D5E70] border-[#B4BFCA] hover:border-[#172B3A]"
                    }`}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Hero Right: Authentic Mode Tiles (Node 310:16450, w: 400, h: 296, gap: 16) */}
          <div className="lg:col-span-4 flex flex-col gap-4 w-full">
            {/* Mode Tile: Events (Node 310:16451, w: 400, h: 140, cornerRadius: 12) */}
            <Link
              href="/events"
              className="group relative block w-full h-[140px] rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all active:scale-[0.99]"
            >
              <Image
                src="/images/mode-events.svg"
                alt="Events"
                fill
                priority
                className="object-cover group-hover:scale-102 transition-transform duration-300"
              />
            </Link>

            {/* Mode Tile: Places (Node 310:16463, w: 400, h: 140, cornerRadius: 12) */}
            <Link
              href="/places"
              className="group relative block w-full h-[140px] rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all active:scale-[0.99]"
            >
              <Image
                src="/images/mode-places.svg"
                alt="Places"
                fill
                priority
                className="object-cover group-hover:scale-102 transition-transform duration-300"
              />
            </Link>
          </div>
        </section>

        {/* 2. CATEGORIES SECTION (Node 310:16472, w: 1200, h: 124, gap: 20) */}
        <section className="space-y-5">
          <h2 className="text-[24px] font-bold text-[#172B3A] tracking-tight">
            Browse by category
          </h2>

          <div className="flex items-center gap-5 overflow-x-auto pb-3 pt-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map((cat) => (
              <CategoryTile key={cat.id} category={cat} />
            ))}
          </div>
        </section>

        {/* 3. THIS WEEKEND (Node 310:16582, w: 1200, h: 339, gap: 20) */}
        <section className="space-y-5">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-[24px] font-bold text-[#172B3A] tracking-tight">
                This weekend
              </h2>
              <p className="text-[14px] text-[#4D5E70] mt-0.5">
                Fri 24 to Sun 26 Oct
              </p>
            </div>

            <Link
              href="/events?date=weekend"
              className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#C81E57] hover:text-[#A61444] transition"
            >
              <span>See all</span>
              <ArrowRightIcon size={14} />
            </Link>
          </div>

          {/* 4 Cards Grid: 282px each with 24px gap = 1200px (Node 310:16595) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {weekendEvents.slice(0, 4).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>

        {/* 4. SPOTLIGHT (Node 310:16717, w: 1200, h: 503, gap: 20) */}
        <section className="space-y-5">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-[24px] font-bold text-[#172B3A] tracking-tight">
                Spotlight
              </h2>
              <p className="text-[14px] text-[#4D5E70] mt-0.5">
                Short clips from events and places this week
              </p>
            </div>

            <Link
              href="/m"
              className="text-[14px] font-medium text-[#C81E57] hover:text-[#A61444] transition"
            >
              Get the app to watch
            </Link>
          </div>

          {/* 5 Vertical Story Cards: 215px each with 24px gap = 1200px (Node 310:16728) */}
          <div className="flex items-center gap-6 overflow-x-auto pb-4 pt-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            {spotlightStories.map((story) => (
              <SpotlightCard key={story.id} story={story} />
            ))}
          </div>
        </section>

        {/* 5. PLACES TO GO (Node 310:16891, w: 1200, h: 344, gap: 20) */}
        <section className="space-y-5">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-[24px] font-bold text-[#172B3A] tracking-tight">
                Places to go
              </h2>
              <p className="text-[14px] text-[#4D5E70] mt-0.5">
                Open now near Victoria Island
              </p>
            </div>

            <Link
              href="/places"
              className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#C81E57] hover:text-[#A61444] transition"
            >
              <span>See all</span>
              <ArrowRightIcon size={14} />
            </Link>
          </div>

          {/* 3 Places Grid: 384px each with 24px gap = 1200px */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {places.slice(0, 3).map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        </section>

        {/* 6. FREE THIS WEEK (Node 310:16960, w: 1200, h: 329, gap: 20) */}
        <section className="space-y-5">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-[24px] font-bold text-[#172B3A] tracking-tight">
                Free this week
              </h2>
            </div>

            <Link
              href="/events?price=free"
              className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#C81E57] hover:text-[#A61444] transition"
            >
              <span>See all</span>
              <ArrowRightIcon size={14} />
            </Link>
          </div>

          {/* 4 Cards Grid: 282px each with 24px gap = 1200px */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {freeEvents.slice(0, 4).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>

        {/* 7. HOST BANNER (Node 310:17091, w: 1200, h: 146, pad: 40, bg: #172B3A, rounded-2xl 16px) */}
        <section className="w-full rounded-2xl bg-[#172B3A] p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2 max-w-2xl">
            <h2 className="text-[28px] font-bold text-white tracking-tight leading-tight">
              Hosting something?
            </h2>
            <p className="text-[16px] text-[#B4BFCA] leading-relaxed">
              Create the event on your phone, sell tickets, check people in and get paid. Free events are always free to list.
            </p>
          </div>

          <Link
            href="/organizers"
            className="shrink-0 h-[48px] px-6 rounded-xl bg-[#E22765] hover:bg-[#C81E57] text-white font-bold text-[15px] flex items-center justify-center transition shadow-xs active:scale-98"
          >
            For organizers
          </Link>
        </section>
      </main>

      {/* Web Footer (Node 310:17103, 1440px canvas, 389px high) */}
      <WebFooter />

      {/* Mobile Bottom Dock (hidden on md and up) */}
      <MobileTabBar />
    </div>
  );
}
