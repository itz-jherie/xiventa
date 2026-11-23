"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { EventCategory, Place, XiventaEvent } from "@/data";
import type { CategoryCopy } from "@/data/categoryCopy";
import { ArrowLeftIcon, ChevronDownIcon, FilterIcon } from "@/components/icons";
import { TopNav } from "@/components/web/TopNav";
import { WebFooter } from "@/components/web/WebFooter";
import { EventCard } from "@/components/web/EventCard";
import { PlaceCard } from "@/components/web/PlaceCard";
import { CategoryTile } from "@/components/web/CategoryTile";
import { MobileTabBar } from "@/components/mobile/MobileTabBar";
import { ListEventCard } from "@/components/mobile/AppEventCards";
import { AppPlaceRow } from "@/components/mobile/AppPlaceRow";
import { EmptyState, Segmented } from "@/components/mobile/AppParts";
import { useToast } from "@/components/shared/Sheet";
import { ShareSheet } from "@/components/shared/Overlays";
import { FilterSheet, DatesSheet, type DateValue } from "@/components/search/Filters";
import { categoryTone } from "@/lib/categoryTone";

type Tab = "events" | "places";

const chip = (on: boolean) =>
  `flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 text-[13px] leading-4 ${on ? "bg-[#E22765] text-white" : "border border-[#B4BFCA] bg-white text-[#4D5E70]"}`;

/**
 * Category. Phone: AM14 (263:8093 Events, 443:34581 Places). Web (768 px and up): PW04 (312:17912,
 * Places 444:36018). Filters and Any date open the AM19 / PW33 filter sheet and AM20 / PW35 dates.
 */
export function CategoryPage({ category, copy, events, places }: { category: EventCategory; copy: CategoryCopy; events: XiventaEvent[]; places: Place[] }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("events");
  const [sub, setSub] = useState<string | null>(null);
  const [sheet, setSheet] = useState<null | "filters" | "dates" | "share">(null);
  const [date, setDate] = useState<DateValue>({ label: "Any date" });
  const { show: toast, node: toastNode } = useToast();
  const tone = { bg: category.tileBg, fg: category.iconColor };
  const items = [
    { value: "events" as Tab, label: `Events (${events.length})` },
    { value: "places" as Tab, label: `Places (${places.length})` },
  ];
  const webItems = [
    { value: "events" as Tab, label: `Events ${events.length}` },
    { value: "places" as Tab, label: `Places ${places.length}` },
  ];
  const nothing = <EmptyState title="Nothing here yet" body={`No ${tab} in ${category.name.toLowerCase()} match right now. Try another date or clear your filters.`} />;

  return (
    <>
      {/* ================= App (AM14) ================= */}
      <div className="min-h-screen bg-white pb-[120px] pt-[env(safe-area-inset-top)] md:hidden">
        <div className="flex h-14 items-center gap-3 px-4">
          <button
            type="button"
            aria-label="Back"
            onClick={() => (window.history.length > 1 ? router.back() : router.push("/m"))}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F4F6F8] text-[#172B3A]"
          >
            <ArrowLeftIcon size={20} />
          </button>
          <h1 className="text-[17px] font-bold leading-[22px] tracking-[-0.01em] text-[#172B3A]">{category.name}</h1>
        </div>
        <div className="flex flex-col gap-1 p-4" style={{ backgroundColor: tone.bg }}>
          <span className="text-[10px] uppercase leading-3 tracking-[0.04em]" style={{ color: tone.fg }}>
            {copy.kicker}
          </span>
          <p className="text-[13px] leading-[18px] text-[#4D5E70]">{copy.appBody}</p>
        </div>
        <div className="px-4 pt-4">
          <Segmented items={items} value={tab} onChange={setTab} />
        </div>
        <div className="overflow-x-auto no-scrollbar" style={{ scrollbarWidth: "none" }}>
          <div className="flex w-max gap-2 px-4 pb-1 pt-3">
            <button type="button" onClick={() => setSheet("filters")} className={chip(false)}>
              <FilterIcon size={16} />
              Filters
            </button>
            <button type="button" onClick={() => setSheet("dates")} className={chip(true)}>
              {date.label}
              <ChevronDownIcon size={16} />
            </button>
            {copy.subs.slice(0, 3).map((s) => (
              <button key={s} type="button" onClick={() => setSub(sub === s ? null : s)} className={chip(sub === s)}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center gap-3 px-4 pt-3">
          {tab === "events"
            ? events.length
              ? events.map((e) => <ListEventCard key={e.slug} event={e} categoryTag={categoryTone(e.categoryLabel)} />)
              : nothing
            : places.length
              ? places.map((p) => <AppPlaceRow key={p.slug} place={p} />)
              : nothing}
        </div>
        <MobileTabBar />
      </div>

      {/* ================= Web (PW04) ================= */}
      <div className="hidden min-h-screen flex-col bg-white md:flex">
        <TopNav />
        <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-8 px-6 pb-24 pt-10 lg:px-[120px]">
          <section className="flex flex-col gap-3 rounded-[24px] p-10" style={{ backgroundColor: tone.bg }}>
            <div className="pointer-events-none w-fit">
              <CategoryTile category={category} />
            </div>
            <h1 className="text-[40px] font-bold leading-[44px] tracking-[-0.02em] text-[#172B3A]">{copy.title}</h1>
            <p className="text-[16px] leading-6 tracking-[-0.01em] text-[#4D5E70]">{copy.webBody}</p>
            <div className="flex flex-wrap gap-2">
              {copy.subs.slice(-4).map((s) => (
                <button key={s} type="button" onClick={() => setSub(sub === s ? null : s)} className={chip(sub === s)}>
                  {s}
                </button>
              ))}
            </div>
          </section>
          <div className="flex h-[100px] items-center gap-4">
            <Segmented items={webItems} value={tab} onChange={setTab} itemWidth={156} />
            <button type="button" onClick={() => setSheet("filters")} className={chip(false)}>
              <FilterIcon size={16} />
              Filters
            </button>
            <button type="button" onClick={() => setSheet("dates")} className={chip(date.label !== "Any date")}>
              {date.label}
              <ChevronDownIcon size={16} />
            </button>
            <span className="flex-1" />
            <button type="button" onClick={() => setSheet("share")} className="flex h-11 items-center rounded-[12px] border border-[#B4BFCA] bg-white px-4 text-[14px] leading-[18px] text-[#172B3A]">
              Share
            </button>
          </div>
          <div className="flex flex-wrap gap-6">
            {tab === "events"
              ? events.length
                ? events.map((e) => <EventCard key={e.slug} event={e} />)
                : nothing
              : places.length
                ? places.map((p) => (
                    <div key={p.slug} className="w-[384px] max-w-full">
                      <PlaceCard place={p} className="w-full" />
                    </div>
                  ))
                : nothing}
          </div>
        </main>
        <WebFooter />
      </div>

      <FilterSheet open={sheet === "filters"} onClose={() => setSheet(null)} kind={tab} count={tab === "events" ? events.length : places.length} onApply={() => toast("Filters applied")} />
      <DatesSheet open={sheet === "dates"} onClose={() => setSheet(null)} value={date} onChange={setDate} />
      <ShareSheet open={sheet === "share"} onClose={() => setSheet(null)} title="Share category" subtitle={`${copy.title} on Xiventa`} path={`/c/${category.slug}`} toast={toast} />
      {toastNode}
    </>
  );
}
