"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { MobileTabBar } from "@/components/mobile/MobileTabBar";
import { EventCard } from "@/components/web/EventCard";
import { PlaceCard } from "@/components/web/PlaceCard";
import { getAllEvents, getAllPlaces } from "@/data";
import {
  MapPinIcon,
  SearchIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  BellIcon,
  FilterIcon,
  SparkleIcon,
  LaptopIcon,
  BuildingIcon,
  MusicIcon,
  UtensilsIcon,
  PaletteIcon,
} from "@/components/icons";

/**
 * Mobile Web Home Page
 * 1:1 match with Figma `AM11 Home` (Node `211:827`)
 *
 * Viewport: 390px x 844px mobile canvas
 * Structure:
 *  - App Header: Location ("Mainland") + Bell & User avatar (AO)
 *  - Weekend Banner: Real photo background, "THIS WEEKEND IN LAGOS / Game nights, picnics and rooftops"
 *  - Search: Full rounded pill, "Search events, places and hosts"
 *  - Filter Chips: Active pink "#All" filter + Nightlife, Tech, Faith, Music, Food
 *  - Mode Tiles: Events (#FFEEE7) & Places (#F1EEFF)
 *  - Featured events: Horizontal carousel of ticket cards
 *  - Nightlife and parties: Horizontal carousel
 *  - MobileTabBar fixed at bottom
 */
export default function MobileHomePage() {
  const [userNeighborhood, setUserNeighborhood] = useState("Mainland");
  const [userInitials, setUserInitials] = useState<string | null>("AO");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const events = getAllEvents();
  const places = getAllPlaces();

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("xiventa_user_neighborhood");
      if (stored) setUserNeighborhood(stored);
      const storedInitials = sessionStorage.getItem("xiventa_user_initials");
      if (storedInitials) setUserInitials(storedInitials);
    } catch {}
  }, []);

  const categoryChips = [
    { label: "Nightlife", icon: SparkleIcon },
    { label: "Tech", icon: LaptopIcon },
    { label: "Faith", icon: BuildingIcon },
    { label: "Music", icon: MusicIcon },
    { label: "Food", icon: UtensilsIcon },
    { label: "Art", icon: PaletteIcon },
  ];

  const filteredEvents = events.filter((evt) => {
    if (selectedCategory !== "All" && evt.category !== selectedCategory.toLowerCase()) {
      return false;
    }
    if (
      searchQuery &&
      !evt.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !evt.venueName.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const nightlifeEvents = events.filter(
    (e) => e.category === "nightlife" || e.category === "music"
  );

  return (
    <div className="min-h-screen bg-[#FBFBFC] flex flex-col items-center pb-24 font-sans selection:bg-[#E22765] selection:text-white overflow-x-hidden">
      {/* 390px Mobile Frame Shell */}
      <div className="w-full max-w-[430px] min-h-screen bg-white shadow-sm flex flex-col overflow-x-hidden">
        {/* 1. App Header (Node 211:827; App Header) */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 pt-3 pb-2.5 border-b border-slate-100 flex items-center justify-between">
          {/* Location Selector */}
          <Link
            href="/side-of-lagos"
            className="flex items-center gap-1.5 hover:opacity-80 transition"
          >
            <MapPinIcon size={18} className="text-[#E22765]" />
            <span className="text-[16px] font-bold text-[#172B3A]">
              {userNeighborhood}
            </span>
            <ChevronDownIcon size={16} className="text-[#68788A]" />
          </Link>

          {/* Right: Notifications & User Avatar */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Notifications"
              className="relative w-9 h-9 rounded-full bg-[#F4F6F8] hover:bg-slate-200/70 flex items-center justify-center text-[#172B3A] transition"
            >
              <BellIcon size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E22765] ring-2 ring-white" />
            </button>

            <Link
              href="/welcome"
              className="w-9 h-9 rounded-full bg-[#EDE9FE] text-[#6D28D9] font-bold text-[13px] flex items-center justify-center shadow-xs"
            >
              {userInitials || "AO"}
            </Link>
          </div>
        </header>

        {/* Scrollable Feed */}
        <main className="flex-1 px-4 py-3 space-y-4">
          {/* 2. Weekend Banner (Node 211:827; Banner, h: 84px) */}
          <div className="relative h-[84px] rounded-2xl overflow-hidden shadow-sm flex flex-col justify-end p-3.5">
            <Image
              src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80"
              alt="Weekend in Lagos"
              fill
              sizes="390px"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30 pointer-events-none" />

            <div className="relative z-10 text-white">
              <span className="block text-[10px] font-bold tracking-wider text-[#FFB6CE] uppercase mb-0.5">
                THIS WEEKEND IN LAGOS
              </span>
              <h2 className="text-[15.5px] font-bold leading-tight drop-shadow-sm">
                Game nights, picnics and rooftops
              </h2>
            </div>
          </div>

          {/* 3. Search Bar (Node 211:827; Search) */}
          <div className="relative">
            <SearchIcon
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#68788A]"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events, places and hosts"
              className="w-full h-11 pl-10 pr-4 bg-[#F4F6F8] rounded-full text-[14px] text-[#172B3A] placeholder:text-[#68788A] focus:outline-none focus:ring-2 focus:ring-[#E22765]/20 focus:bg-white border border-transparent focus:border-[#E22765] transition"
            />
          </div>

          {/* 4. Filter Chips (Node 211:827; Chips) */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 select-none">
            {/* Active All chip with Filter Icon */}
            <button
              type="button"
              onClick={() => setSelectedCategory("All")}
              className={`px-3.5 py-1.5 rounded-full text-[13px] font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 shadow-xs ${
                selectedCategory === "All"
                  ? "bg-[#E22765] text-white"
                  : "bg-white border border-[#E9EDF1] text-[#4D5E70] hover:bg-slate-50"
              }`}
            >
              <FilterIcon size={14} className={selectedCategory === "All" ? "text-white" : "text-[#68788A]"} />
              <span>All</span>
            </button>

            {categoryChips.map((chip) => {
              const Icon = chip.icon;
              const isActive = selectedCategory === chip.label;
              return (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => setSelectedCategory(chip.label)}
                  className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? "bg-[#E22765] text-white font-bold shadow-xs"
                      : "bg-white border border-[#E9EDF1] text-[#4D5E70] hover:bg-slate-50"
                  }`}
                >
                  <Icon size={14} className={isActive ? "text-white" : "text-[#68788A]"} />
                  <span>{chip.label}</span>
                </button>
              );
            })}
          </div>

          {/* 5. Mode Tiles (Node 211:827; Mode tiles, h: 72px) */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            {/* Events Tile */}
            <Link
              href="/events"
              className="h-[72px] rounded-2xl bg-[#FFEEE7] p-3 flex items-center justify-between relative overflow-hidden shadow-xs hover:opacity-95 transition"
            >
              <span className="text-[15px] font-bold text-[#172B3A]">
                Events
              </span>
              <div className="relative w-12 h-12 shrink-0">
                <Image
                  src="/images/mode-events.svg"
                  alt="Events illustration"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>

            {/* Places Tile */}
            <Link
              href="/places"
              className="h-[72px] rounded-2xl bg-[#F1EEFF] p-3 flex items-center justify-between relative overflow-hidden shadow-xs hover:opacity-95 transition"
            >
              <span className="text-[15px] font-bold text-[#172B3A]">
                Places
              </span>
              <div className="relative w-12 h-12 shrink-0">
                <Image
                  src="/images/mode-places.svg"
                  alt="Places illustration"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
          </div>

          {/* 6. Section: Featured Events (Node 211:827; Section / Featured events & Featured carousel) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-[18px] font-bold text-[#172B3A]">
                Featured events
              </h3>
              <Link
                href="/events"
                className="text-[13px] font-semibold text-[#E22765] hover:text-[#C81E57]"
              >
                See all
              </Link>
            </div>

            {/* Horizontal Ticket Carousel */}
            <div className="flex items-center gap-3.5 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 select-none">
              {filteredEvents.map((evt) => (
                <EventCard
                  key={evt.id}
                  event={evt}
                  className="w-[282px] shrink-0"
                />
              ))}
            </div>
          </div>

          {/* 7. Section: Nightlife and parties (Node 211:827; Section / Nightlife and parties) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-[18px] font-bold text-[#172B3A]">
                Nightlife and parties
              </h3>
              <Link
                href="/events"
                className="text-[#E22765] hover:opacity-80 transition"
              >
                <ChevronRightIcon size={18} />
              </Link>
            </div>

            {/* Horizontal Places/Events Carousel */}
            <div className="flex items-center gap-3.5 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 select-none">
              {places.slice(0, 4).map((plc) => (
                <PlaceCard
                  key={plc.id}
                  place={plc}
                  className="w-[282px] shrink-0"
                />
              ))}
            </div>
          </div>
        </main>

        {/* 8. Fixed Bottom Tab Bar (Node 211:827; Tab Bar) */}
        <MobileTabBar />
      </div>
    </div>
  );
}
