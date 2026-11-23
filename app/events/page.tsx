"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { img, pickEvents } from "@/data";
import { TopNav } from "@/components/web/TopNav";
import { WebFooter } from "@/components/web/WebFooter";
import { EventCard } from "@/components/web/EventCard";
import { Pagination } from "@/components/web/Pagination";
import { Chip } from "@/components/shared/Chip";

/** The twelve cards on PW02, in Figma order (Sunday Praise uses different flyer art on this frame). */
const PW02_EVENTS = [
  "abnormal-nightout",
  "jersey-creek-picnic",
  "afrobeats-live-session",
  "lekki-food-market",
  "connect-lagos",
  "friday-rush",
  "board-games-in-the-park",
  ["sunday-praise-gathering", img("c33706bb")],
  "comedy-night-out",
  "sunrise-yoga-by-the-water",
  "kids-craft-saturday",
  "design-talks-lagos",
] as (string | [string, string])[];

/**
 * PW02 Events, 1:1 with Figma frame 312:17106.
 * Main: padding 40 / 120 / 96, gap 32. Title (28 / 34 bold + 14 / 20 count), filter row 100 high
 * with chips centred, grid of 282 cards (gap 24): 4 columns at 1440 as in Figma, fewer when the
 * window is narrower (cards are fixed width, so the grid adds only the columns that fit).
 */
function EventsContent() {
  const params = useSearchParams();
  const category = params.get("category");
  const price = params.get("price");
  const date = params.get("date");
  const format = params.get("format");
  const q = params.get("q")?.toLowerCase().trim();

  const events = useMemo(() => {
    return pickEvents(PW02_EVENTS).filter((e) => {
      if (category && e.category !== category) return false;
      if (price === "free" && !e.isFree) return false;
      if (date === "weekend" && !e.isWeekend) return false;
      if (date === "tonight" && !e.isTonight) return false;
      if (format === "online" && !e.format) return false;
      if (q && ![e.title, e.hostName, e.venueLabel].some((s) => s.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [category, price, date, format, q]);

  const filtered = Boolean(category || price || date || format || q);

  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-clip bg-white text-[#172B3A]">
      <TopNav />

      <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-8 px-4 pb-24 pt-10 md:px-[clamp(40px,calc((100%-1200px)/2),120px)]">
        <div className="flex flex-col gap-2">
          <h1 className="text-[28px] font-bold leading-[34px] tracking-[-0.02em] text-[#172B3A]">Events in Lagos</h1>
          <p className="text-[14px] leading-5 text-[#4D5E70]">
            {filtered ? `${events.length} events match` : "248 events coming up"}
          </p>
        </div>

        <div className="flex min-h-[100px] flex-wrap items-center gap-2">
          <Chip label="Any date" dropdown />
          <Chip label="Category" dropdown />
          <Chip label="Price" dropdown />
          <Chip label="Format" dropdown />
          <Chip label="Mainland · Yaba" dropdown selected />
          <div className="flex-1" />
          <Chip label="Sort: Soonest" dropdown />
        </div>

        {events.length > 0 ? (
          <div className="grid justify-center gap-6 [grid-template-columns:repeat(auto-fill,282px)] md:justify-start">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <p className="py-16 text-center text-[14px] leading-5 text-[#4D5E70]">No events match these filters yet.</p>
        )}

        <Pagination summary={filtered ? `Showing ${events.length} of ${events.length}` : "Showing 1 to 12 of 248"} />
      </main>

      <WebFooter />
    </div>
  );
}

export default function EventsPage() {
  return (
    <Suspense fallback={null}>
      <EventsContent />
    </Suspense>
  );
}
