"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  getAllEvents,
  getAllCategories,
  EventCategorySlug,
} from "@/data";
import { TopNav } from "@/components/web/TopNav";
import { WebFooter } from "@/components/web/WebFooter";
import { EventCard } from "@/components/web/EventCard";
import { MobileTabBar } from "@/components/mobile/MobileTabBar";
import { SearchIcon, FilterIcon, CalendarIcon } from "@/components/icons";

/**
 * PW02 Events Listing & Catalog Screen
 * 1:1 match with Figma screen `PW02 Events` (Node `312:17106`)
 *
 * Dimensions: 1440px canvas, 1200px main content grid
 * Fully dynamic filtering by Category, Price, and Date
 */
function EventsCatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") as EventCategorySlug | null;
  const initialPrice = searchParams.get("price");

  const [selectedCategory, setSelectedCategory] = useState<EventCategorySlug | "all">(
    initialCategory || "all"
  );
  const [dateFilter, setDateFilter] = useState<"all" | "tonight" | "weekend" | "free">(
    initialPrice === "free" ? "free" : "all"
  );
  const [searchQuery, setSearchQuery] = useState("");

  const allEvents = getAllEvents();
  const categories = getAllCategories();

  // Dynamic filter pipeline
  const filteredEvents = useMemo(() => {
    return allEvents.filter((event) => {
      // Category filter
      if (selectedCategory !== "all" && event.category !== selectedCategory) {
        return false;
      }

      // Date & Price filter
      if (dateFilter === "weekend" && !event.isWeekend) return false;
      if (dateFilter === "tonight" && !event.isTonight) return false;
      if (dateFilter === "free" && !event.isFree) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = event.title.toLowerCase().includes(q);
        const matchesHost = event.hostName.toLowerCase().includes(q);
        const matchesVenue = event.venueName.toLowerCase().includes(q);
        const matchesArea = event.neighborhood.toLowerCase().includes(q);
        if (!matchesTitle && !matchesHost && !matchesVenue && !matchesArea) {
          return false;
        }
      }

      return true;
    });
  }, [allEvents, selectedCategory, dateFilter, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#172b3a]">
      <TopNav onSearch={(q) => setSearchQuery(q)} />

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-8 md:py-10 space-y-8 pb-24 md:pb-16">
        {/* Title Header (w=1200, h=62 in Figma) */}
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172b3a] tracking-tight">
            Events in Lagos
          </h1>
          <p className="text-[14px] sm:text-[15px] text-[#4d5e70]">
            Find upcoming parties, festivals, live music, conferences and gatherings.
          </p>
        </div>

        {/* Filters Bar (w=1200, h=100 in Figma) */}
        <div className="space-y-4 pt-2">
          {/* Quick Date Tabs & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[13px]">
              {[
                { id: "all", label: "All events" },
                { id: "tonight", label: "Tonight" },
                { id: "weekend", label: "This weekend" },
                { id: "free", label: "Free admission" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setDateFilter(tab.id as any)}
                  className={`px-4 py-2 rounded-full font-medium transition-all shrink-0 ${
                    dateFilter === tab.id
                      ? "bg-[#172b3a] text-white shadow-xs"
                      : "bg-[#f4f6f8] text-[#4d5e70] hover:bg-slate-200/80 hover:text-[#172b3a]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Quick Search */}
            <div className="relative w-full sm:w-72">
              <SearchIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#68788a]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by name or venue"
                className="w-full h-10 pl-9 pr-3.5 rounded-full bg-[#f4f6f8] text-[13px] text-[#172b3a] placeholder:text-[#68788a] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:bg-white border border-slate-200/60"
              />
            </div>
          </div>

          {/* Category Chips Carousel */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-[12px] -mx-4 px-4 sm:mx-0 sm:px-0">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-full font-medium transition-all shrink-0 ${
                selectedCategory === "all"
                  ? "bg-brand-500 text-white font-semibold shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All Categories
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3 py-1.5 rounded-full font-medium transition-all shrink-0 ${
                  selectedCategory === cat.slug
                    ? "bg-brand-500 text-white font-semibold shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat.name} ({cat.count})
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between text-[13px] text-[#4d5e70] border-b border-slate-100 pb-3">
          <span>
            Showing <strong className="text-[#172b3a]">{filteredEvents.length}</strong> events
            {selectedCategory !== "all" && ` in ${selectedCategory}`}
          </span>

          {(selectedCategory !== "all" || dateFilter !== "all" || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory("all");
                setDateFilter("all");
                setSearchQuery("");
              }}
              className="text-brand-600 hover:text-brand-700 font-semibold"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* Results Grid (w=1200, 4 columns) */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredEvents.map((evt) => (
              <EventCard key={evt.id} event={evt} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center space-y-4 max-w-sm mx-auto">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <CalendarIcon size={32} />
            </div>
            <h3 className="text-lg font-bold text-[#172b3a]">No events match your filter</h3>
            <p className="text-sm text-[#4d5e70]">
              Try choosing another date or clearing your category filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setDateFilter("all");
                setSearchQuery("");
              }}
              className="px-5 py-2 rounded-full bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition"
            >
              Clear all filters
            </button>
          </div>
        )}
      </main>

      <WebFooter />
      <MobileTabBar />
    </div>
  );
}

export default function EventsCatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FBFBFC] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#E22765] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <EventsCatalogContent />
    </Suspense>
  );
}
