"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { MobileTabBar } from "@/components/mobile/MobileTabBar";
import { getAllEvents, getAllPlaces, getAllCategories } from "@/data";
import {
  MapPinIcon,
  SearchIcon,
  ChevronDownIcon,
  StarFilledIcon,
  BookmarkIcon,
  SparkleIcon,
} from "@/components/icons";

export default function MobileHomePage() {
  const [activeTab, setActiveTab] = useState<"events" | "places">("events");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [userNeighborhood, setUserNeighborhood] = useState("Victoria Island");
  const [userInitials, setUserInitials] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const events = getAllEvents();
  const places = getAllPlaces();
  const categories = getAllCategories();

  useEffect(() => {
    try {
      const storedNeighborhood = sessionStorage.getItem("xiventa_user_neighborhood");
      if (storedNeighborhood) setUserNeighborhood(storedNeighborhood);
      const storedInitials = sessionStorage.getItem("xiventa_user_initials");
      if (storedInitials) setUserInitials(storedInitials);
    } catch {
      // safe fallback
    }
  }, []);

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

  const filteredPlaces = places.filter((plc) => {
    if (
      searchQuery &&
      !plc.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !plc.metaLabel.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FBFBFC] flex flex-col items-center pb-24 font-sans selection:bg-[#E22765] selection:text-white">
      {/* 390px Mobile Frame Shell */}
      <div className="w-full max-w-[420px] min-h-screen bg-white shadow-sm flex flex-col">
        {/* Top Status & Header (AM11 Home Node 211:827) */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 pt-3 pb-3">
          <div className="flex items-center justify-between">
            {/* Location selector */}
            <Link
              href="/side-of-lagos"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F4F6F8] hover:bg-slate-200/70 transition"
            >
              <MapPinIcon size={14} className="text-[#E22765]" />
              <span className="text-[14px] font-bold text-[#172B3A]">
                {userNeighborhood}
              </span>
              <ChevronDownIcon size={14} className="text-[#68788A]" />
            </Link>

            {/* Profile / Sign in */}
            {userInitials ? (
              <div className="w-8 h-8 rounded-full bg-[#FFF1F5] border border-[#E22765] flex items-center justify-center text-[#E22765] font-bold text-[12px]">
                {userInitials}
              </div>
            ) : (
              <Link
                href="/welcome"
                className="text-[13px] font-bold text-[#E22765] hover:text-[#C81E57]"
              >
                Sign in
              </Link>
            )}
          </div>
        </header>

        {/* Scrollable Feed */}
        <main className="flex-1 px-4 py-4 space-y-6">
          {/* Overline weekend banner (from Figma AM11) */}
          <div className="rounded-2xl bg-gradient-to-r from-[#172B3A] to-[#25455E] p-4 text-white relative overflow-hidden shadow-sm">
            <div className="relative z-10">
              <span className="inline-block text-[10px] font-bold tracking-wider text-[#FFB6CE] uppercase mb-1">
                THIS WEEKEND IN LAGOS
              </span>
              <h2 className="text-[16px] font-bold leading-tight">
                Game nights, picnics and rooftops
              </h2>
            </div>
            <div className="absolute -right-3 -bottom-3 w-20 h-20 bg-white/10 rounded-full blur-xl pointer-events-none" />
          </div>

          {/* Search Bar */}
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
              className="w-full h-11 pl-10 pr-4 bg-[#F4F6F8] rounded-xl text-[14px] text-[#172B3A] placeholder:text-[#68788A] focus:outline-none focus:ring-2 focus:ring-[#E22765]/20 focus:bg-white border border-transparent focus:border-[#E22765] transition"
            />
          </div>

          {/* Category Chips (Horizontal Scroll) */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
            <button
              type="button"
              onClick={() => setSelectedCategory("All")}
              className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors ${
                selectedCategory === "All"
                  ? "bg-[#172B3A] text-white"
                  : "bg-[#F4F6F8] text-[#4D5E70] hover:bg-slate-200/70"
              }`}
            >
              All
            </button>
            {categories.slice(0, 8).map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat.name
                    ? "bg-[#172B3A] text-white"
                    : "bg-[#F4F6F8] text-[#4D5E70] hover:bg-slate-200/70"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Events vs Places Segmented Toggle */}
          <div className="flex bg-[#F4F6F8] p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab("events")}
              className={`flex-1 py-1.5 text-center text-[13px] font-semibold rounded-lg transition ${
                activeTab === "events"
                  ? "bg-white text-[#172B3A] shadow-xs"
                  : "text-[#68788A] hover:text-[#172B3A]"
              }`}
            >
              Events ({filteredEvents.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("places")}
              className={`flex-1 py-1.5 text-center text-[13px] font-semibold rounded-lg transition ${
                activeTab === "places"
                  ? "bg-white text-[#172B3A] shadow-xs"
                  : "text-[#68788A] hover:text-[#172B3A]"
              }`}
            >
              Places ({filteredPlaces.length})
            </button>
          </div>

          {/* Content Feed */}
          {activeTab === "events" ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[17px] font-bold text-[#172B3A]">
                  Featured events
                </h3>
                <Link
                  href="/events"
                  className="text-[13px] font-semibold text-[#E22765] hover:text-[#C81E57]"
                >
                  See all
                </Link>
              </div>

              {filteredEvents.map((evt) => (
                <Link
                  key={evt.id}
                  href={`/events/${evt.slug}`}
                  className="block bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition group active:scale-[0.99]"
                >
                  {/* Event Flyer */}
                  <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                    <Image
                      src={evt.imageUrl}
                      alt={evt.title}
                      fill
                      sizes="390px"
                      className="object-cover group-hover:scale-102 transition duration-300"
                    />
                    <div className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#172B3A]">
                      <BookmarkIcon size={16} />
                    </div>
                    {evt.isSoldOut && (
                      <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-rose-500 text-white text-[10px] font-bold uppercase tracking-wider">
                        SOLD OUT
                      </div>
                    )}
                  </div>

                  {/* Event Details */}
                  <div className="p-3.5 space-y-1.5">
                    <p className="text-[12px] font-bold text-[#E22765]">
                      {evt.dateLabel}
                    </p>
                    <h4 className="text-[15px] font-bold text-[#172B3A] leading-snug line-clamp-1">
                      {evt.title}
                    </h4>
                    <p className="text-[12px] text-[#68788A] truncate">
                      {evt.venueName} · By {evt.hostName}
                    </p>
                    <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                      <span className="text-[11px] text-[#68788A]">{evt.priceLabel}</span>
                      <span className="text-[15px] font-extrabold text-[#172B3A]">
                        {evt.displayPrice}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[17px] font-bold text-[#172B3A]">
                  Places to go
                </h3>
                <Link
                  href="/places"
                  className="text-[13px] font-semibold text-[#E22765] hover:text-[#C81E57]"
                >
                  See all
                </Link>
              </div>

              {filteredPlaces.map((plc) => (
                <div
                  key={plc.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition"
                >
                  <div className="relative h-40 w-full bg-slate-100">
                    <Image
                      src={plc.imageUrl}
                      alt={plc.name}
                      fill
                      sizes="390px"
                      className="object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold">
                      {plc.isOpenNow ? "OPEN NOW" : "CLOSED"}
                    </div>
                  </div>
                  <div className="p-3.5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[15px] font-bold text-[#172B3A]">
                        {plc.name}
                      </h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${plc.tagBg} ${plc.tagColor}`}>
                        {plc.categoryLabel}
                      </span>
                    </div>
                    <p className="text-[12px] text-[#68788A]">{plc.metaLabel}</p>
                    <div className="pt-2 flex items-center justify-between text-[12px] text-[#68788A] border-t border-slate-100">
                      <span className="flex items-center gap-1 text-[#172B3A] font-semibold">
                        <StarFilledIcon size={13} className="text-amber-500" />
                        {plc.rating}
                      </span>
                      <span>{plc.distanceLabel}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* 68px Floating Bottom Tab Bar */}
        <MobileTabBar />
      </div>
    </div>
  );
}
