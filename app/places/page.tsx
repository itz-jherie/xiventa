"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { pickPlaces } from "@/data";
import { TopNav } from "@/components/web/TopNav";
import { WebFooter } from "@/components/web/WebFooter";
import { PlaceCard } from "@/components/web/PlaceCard";
import { Pagination } from "@/components/web/Pagination";
import { Chip } from "@/components/shared/Chip";

const PW03_PLACES = ["skyline-lounge", "the-garden-lagos", "lagoon-park", "play-arena", "harbour-hall", "kiln-coffee"];

/**
 * PW03 Places, 1:1 with Figma frame 312:17640.
 * Main: padding 40 / 120 / 96, gap 32. Title, filter row (100 high, chips centred),
 * 3 column grid of 384 x 270 Place Cards (gap 24), pagination, suggest link.
 */
export default function PlacesPage() {
  const [openNow, setOpenNow] = useState(true);
  const places = useMemo(() => pickPlaces(PW03_PLACES).filter((p) => !openNow || p.isOpenNow), [openNow]);

  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-clip bg-white text-[#172B3A]">
      <TopNav />

      <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-8 px-4 pb-24 pt-10 md:px-[clamp(40px,calc((100%-1200px)/2),120px)]">
        <div className="flex flex-col gap-2">
          <h1 className="text-[28px] font-bold leading-[34px] tracking-[-0.02em] text-[#172B3A]">Places in Lagos</h1>
          <p className="text-[14px] leading-5 text-[#4D5E70]">Bars, restaurants, parks and more, 132 places</p>
        </div>

        <div className="flex min-h-[100px] flex-wrap items-center gap-2">
          <Chip label="Open now" selected={openNow} onClick={() => setOpenNow((v) => !v)} />
          <Chip label="Category" dropdown />
          <Chip label="Mainland · Yaba" dropdown selected />
          <Chip label="Good for groups" dropdown />
          <div className="flex-1" />
          <Chip label="Sort: Nearest" dropdown />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {places.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>

        <Pagination summary="Showing 1 to 6 of 132" />

        <Link href="/suggest-place" className="w-fit text-[14px] leading-[18px] text-[#172B3A] hover:text-[#C81E57]">
          Can&apos;t find a place? Suggest it
        </Link>
      </main>

      <WebFooter />
    </div>
  );
}
