"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
import { SplashScreen } from "@/components/shared/SplashScreen";
import {
  MapPinIcon,
  SearchIcon,
  ArrowRightIcon,
  SparkleIcon,
  TicketIcon,
} from "@/components/icons";

export default function HomePage() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Dynamic datasets from data store
  const categories = getAllCategories();
  const weekendEvents = getWeekendEvents();
  const freeEvents = getFreeEvents();
  const places = getAllPlaces();
  const spotlightStories = getSpotlightStories();

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#172b3a] selection:bg-brand-100 selection:text-brand-900">
      {/* Launch Splash Screen (AM01) - displays on first visit or query ?splash=true */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      {/* Top Nav (Web) - 1:1 Figma match */}
      <TopNav />

      {/* Main Content Area (Max width 1200px centered) */}
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-14 md:space-y-16 pb-24 md:pb-16">
        {/* 1. HERO SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Hero Left Text (752px wide in Figma) */}
          <div className="lg:col-span-8 space-y-5">
            {/* City Badge / Chip */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-600 border border-brand-200/50 text-[12px] font-bold tracking-wide">
              <MapPinIcon size={14} className="text-brand-500" />
              <span>Lagos</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#172b3a] tracking-tight leading-tight">
              What&apos;s on in Lagos
            </h1>

            {/* Subhead */}
            <p className="text-base sm:text-lg text-[#4d5e70] max-w-2xl leading-relaxed">
              Parties, picnics, live music, church programmes and places worth the trip. Find it, book it, go.
            </p>

            {/* Hero Quick Search & Filters */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center w-full max-w-xl h-12 bg-[#f4f6f8] rounded-2xl px-4 border border-slate-200/80 focus-within:border-brand-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-500/20 transition-all shadow-2xs">
                <SearchIcon size={20} className="text-[#68788a] mr-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Search events, places or artists"
                  className="w-full bg-transparent text-[15px] text-[#172b3a] placeholder:text-[#68788a] focus:outline-none"
                />
              </div>

              {/* Quick Filter Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[13px]">
                {["Tonight", "This weekend", "Free", "Online"].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => setActiveFilter(activeFilter === chip ? null : chip)}
                    className={`px-3.5 py-1.5 rounded-full font-medium transition-all ${
                      activeFilter === chip
                        ? "bg-[#172b3a] text-white shadow-xs"
                        : "bg-[#f4f6f8] text-[#4d5e70] hover:bg-slate-200/80 hover:text-[#172b3a]"
                    }`}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Hero Right Mode Tiles (400px wide in Figma) */}
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4">
            {/* Mode: Events */}
            <Link
              href="/events"
              className="group relative flex-1 h-[140px] rounded-2xl bg-[#ffeee7] hover:bg-[#ffd9cb] p-6 flex items-center justify-between overflow-hidden transition-all duration-300 shadow-2xs hover:shadow-md border border-orange-200/40"
            >
              <div className="space-y-1 z-10">
                <span className="text-[20px] font-bold text-[#c2410c] tracking-tight group-hover:text-orange-950 transition-colors flex items-center gap-2">
                  <span>Events</span>
                  <ArrowRightIcon size={18} className="transform group-hover:translate-x-1 transition-transform" />
                </span>
                <p className="text-[12px] text-orange-900/70 font-medium">
                  {weekendEvents.length + freeEvents.length}+ upcoming listings
                </p>
              </div>
              <div className="w-20 h-20 rounded-full bg-orange-300/30 flex items-center justify-center text-orange-600 shrink-0 transform group-hover:scale-110 transition-transform">
                <TicketIcon size={40} />
              </div>
            </Link>

            {/* Mode: Places */}
            <Link
              href="/places"
              className="group relative flex-1 h-[140px] rounded-2xl bg-[#f1eeff] hover:bg-[#e4ddff] p-6 flex items-center justify-between overflow-hidden transition-all duration-300 shadow-2xs hover:shadow-md border border-purple-200/40"
            >
              <div className="space-y-1 z-10">
                <span className="text-[20px] font-bold text-[#5b3fd6] tracking-tight group-hover:text-purple-950 transition-colors flex items-center gap-2">
                  <span>Places</span>
                  <ArrowRightIcon size={18} className="transform group-hover:translate-x-1 transition-transform" />
                </span>
                <p className="text-[12px] text-purple-900/70 font-medium">
                  {places.length} verified venues near you
                </p>
              </div>
              <div className="w-20 h-20 rounded-full bg-purple-300/30 flex items-center justify-center text-purple-600 shrink-0 transform group-hover:scale-110 transition-transform">
                <MapPinIcon size={38} />
              </div>
            </Link>
          </div>
        </section>

        {/* 2. CATEGORIES SECTION */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] sm:text-[20px] font-bold text-[#172b3a] tracking-tight">
              Browse by category
            </h2>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-3 pt-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map((cat) => (
              <CategoryTile key={cat.id} category={cat} />
            ))}
          </div>
        </section>

        {/* 3. THIS WEEKEND SECTION */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-[22px] sm:text-[24px] font-extrabold text-[#172b3a] tracking-tight">
                This weekend
              </h2>
              <p className="text-[13px] text-[#4d5e70]">Fri 24 to Sun 26 Oct</p>
            </div>

            <Link
              href="/events"
              className="text-[13px] font-bold text-brand-600 hover:text-brand-700 transition flex items-center gap-1 group"
            >
              <span>See all</span>
              <ArrowRightIcon size={14} className="transform group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Cards Grid / Carousel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {weekendEvents.slice(0, 4).map((evt) => (
              <EventCard key={evt.id} event={evt} />
            ))}
          </div>
        </section>

        {/* 4. SPOTLIGHT REELS SECTION */}
        <section className="space-y-5 pt-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <SparkleIcon size={18} className="text-brand-500 fill-brand-500" />
                <h2 className="text-[22px] sm:text-[24px] font-extrabold text-[#172b3a] tracking-tight">
                  Spotlight
                </h2>
              </div>
              <p className="text-[13px] text-[#4d5e70]">
                Short clips from events and places this week
              </p>
            </div>

            <Link
              href="/splash"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200 text-[13px] font-semibold text-[#172b3a] hover:bg-slate-50 transition"
            >
              Get the app to watch
            </Link>
          </div>

          {/* Horizontal Reel Scroll Strip */}
          <div className="flex items-center gap-5 overflow-x-auto pb-4 pt-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            {spotlightStories.map((story) => (
              <SpotlightCard key={story.id} story={story} />
            ))}
          </div>
        </section>

        {/* 5. PLACES TO GO SECTION */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-[22px] sm:text-[24px] font-extrabold text-[#172b3a] tracking-tight">
                Places to go
              </h2>
              <p className="text-[13px] text-[#4d5e70]">Open now near Victoria Island</p>
            </div>

            <Link
              href="/places"
              className="text-[13px] font-bold text-brand-600 hover:text-brand-700 transition flex items-center gap-1 group"
            >
              <span>See all</span>
              <ArrowRightIcon size={14} className="transform group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {places.slice(0, 3).map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        </section>

        {/* 6. FREE THIS WEEK SECTION */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[22px] sm:text-[24px] font-extrabold text-[#172b3a] tracking-tight">
              Free this week
            </h2>

            <Link
              href="/events?price=free"
              className="text-[13px] font-bold text-brand-600 hover:text-brand-700 transition flex items-center gap-1 group"
            >
              <span>See all</span>
              <ArrowRightIcon size={14} className="transform group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {freeEvents.slice(0, 4).map((evt) => (
              <EventCard key={evt.id} event={evt} />
            ))}
          </div>
        </section>

        {/* 7. HOST BANNER SECTION (Dark Navy #172B3A) */}
        <section className="w-full rounded-3xl bg-[#172b3a] text-white p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-2xl">
            <h2 className="text-2xl sm:text-[28px] font-bold tracking-tight text-white">
              Hosting something?
            </h2>
            <p className="text-sm sm:text-base text-[#b4bfca] leading-relaxed">
              Create the event on your phone, sell tickets, check people in and get paid. Free events are always free to list.
            </p>
          </div>

          <Link
            href="/organizers"
            className="inline-flex items-center justify-center h-12 px-7 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-bold text-[14px] shrink-0 shadow-lg shadow-brand-500/20 transition active:scale-95"
          >
            For organizers
          </Link>
        </section>
      </main>

      {/* Web Footer - 1:1 Figma match */}
      <WebFooter />

      {/* Mobile Tab Bar (visible on mobile viewports only) */}
      <MobileTabBar />
    </div>
  );
}
