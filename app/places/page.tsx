"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { TopNav } from "@/components/web/TopNav";
import { WebFooter } from "@/components/web/WebFooter";
import { PlaceCard } from "@/components/web/PlaceCard";
import { PLACES } from "@/data/places";
import { CATEGORIES } from "@/data/categories";
import { SearchIcon, ChevronDownIcon, CheckIcon } from "@/components/icons";

const NEIGHBORHOODS = [
  "All locations",
  "Victoria Island",
  "Ikoyi",
  "Lekki",
  "Yaba",
  "Ikeja",
];

const CATEGORY_FILTERS = [
  "All categories",
  "FOOD & DRINK",
  "NIGHTLIFE",
  "OUTDOORS",
  "FUN & GAMES",
  "COMMUNITY",
];

export default function PlacesPage() {
  const [selectedLocation, setSelectedLocation] = useState("All locations");
  const [selectedCategory, setSelectedCategory] = useState("All categories");
  const [openNowOnly, setOpenNowOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"nearest" | "rating">("nearest");

  const filteredPlaces = useMemo(() => {
    return PLACES.filter((place) => {
      if (openNowOnly && !place.isOpenNow) return false;
      if (selectedLocation !== "All locations" && place.neighborhood !== selectedLocation) {
        return false;
      }
      if (selectedCategory !== "All categories" && place.categoryLabel !== selectedCategory) {
        return false;
      }
      if (
        searchQuery &&
        !place.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !place.metaLabel.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "rating") {
        return b.rating - a.rating;
      }
      return 0; // default order
    });
  }, [openNowOnly, selectedLocation, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-[#FBFBFC] flex flex-col font-sans">
      <TopNav />

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-6 py-8 md:py-10">
        {/* Title Section (Node 312:17640) */}
        <div className="mb-8">
          <h1 className="text-[28px] md:text-[32px] font-bold text-[#172B3A] tracking-tight">
            Places in Lagos
          </h1>
          <p className="text-[14px] text-[#4D5E70] mt-1">
            Bars, restaurants, parks and more, {PLACES.length} places
          </p>
        </div>

        {/* Filters bar */}
        <div className="flex flex-wrap items-center gap-3 pb-6 border-b border-[#E2E8F0] mb-8">
          {/* Open Now toggle */}
          <button
            type="button"
            onClick={() => setOpenNowOnly(!openNowOnly)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-[13px] font-medium border transition-colors ${
              openNowOnly
                ? "bg-[#E22765] text-white border-[#E22765]"
                : "bg-white text-[#172B3A] border-[#B4BFCA] hover:border-[#172B3A]"
            }`}
          >
            {openNowOnly && <CheckIcon size={14} className="stroke-white" />}
            Open now
          </button>

          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none bg-white border border-[#B4BFCA] text-[#172B3A] text-[13px] font-medium rounded-full pl-3.5 pr-8 py-2 cursor-pointer focus:outline-none focus:border-[#E22765]"
            >
              {CATEGORY_FILTERS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "All categories" ? "Category" : cat}
                </option>
              ))}
            </select>
            <ChevronDownIcon
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#68788A]"
            />
          </div>

          {/* Neighborhood Dropdown */}
          <div className="relative">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="appearance-none bg-white border border-[#B4BFCA] text-[#172B3A] text-[13px] font-medium rounded-full pl-3.5 pr-8 py-2 cursor-pointer focus:outline-none focus:border-[#E22765]"
            >
              {NEIGHBORHOODS.map((nh) => (
                <option key={nh} value={nh}>
                  {nh === "All locations" ? "Location" : nh}
                </option>
              ))}
            </select>
            <ChevronDownIcon
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#68788A]"
            />
          </div>

          {/* Sort By */}
          <div className="relative ml-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "nearest" | "rating")}
              className="appearance-none bg-white border border-[#B4BFCA] text-[#172B3A] text-[13px] font-medium rounded-full pl-3.5 pr-8 py-2 cursor-pointer focus:outline-none focus:border-[#E22765]"
            >
              <option value="nearest">Sort: Nearest</option>
              <option value="rating">Sort: Top rated</option>
            </select>
            <ChevronDownIcon
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#68788A]"
            />
          </div>
        </div>

        {/* Results Grid */}
        {filteredPlaces.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlaces.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center max-w-lg mx-auto my-12">
            <div className="w-12 h-12 rounded-full bg-[#FFF1F5] flex items-center justify-center mx-auto mb-4">
              <SearchIcon size={22} className="text-[#E22765]" />
            </div>
            <h3 className="text-[18px] font-semibold text-[#172B3A] mb-1">
              No places found
            </h3>
            <p className="text-[14px] text-[#68788A] mb-6">
              Try adjusting your category or location filters to see more places.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedLocation("All locations");
                setSelectedCategory("All categories");
                setOpenNowOnly(false);
                setSearchQuery("");
              }}
              className="px-5 py-2.5 rounded-full bg-[#172B3A] text-white text-[13px] font-medium hover:bg-black transition-colors"
            >
              Reset all filters
            </button>
          </div>
        )}

        {/* Suggest a place link (from Figma Node 312:17640) */}
        <div className="mt-16 pt-8 border-t border-[#E2E8F0] text-center">
          <p className="text-[14px] text-[#4D5E70]">
            Can&apos;t find a place?{" "}
            <Link
              href="/suggest-place"
              className="text-[#E22765] font-medium underline underline-offset-4 hover:text-[#C81E57]"
            >
              Suggest it
            </Link>
          </p>
        </div>
      </main>

      <WebFooter />
    </div>
  );
}
