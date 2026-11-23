"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { getAllCategories, pickEvents } from "@/data";
import { addRecent, clearRecent, getRecent, search } from "@/lib/search";
import { ArrowLeftIcon, ChevronDownIcon, ChevronRightIcon, FilterIcon, GridIcon, SearchIcon } from "@/components/icons";
import { TopNav } from "@/components/web/TopNav";
import { WebFooter } from "@/components/web/WebFooter";
import { EventCard } from "@/components/web/EventCard";
import { PlaceCard } from "@/components/web/PlaceCard";
import { CategoryTile } from "@/components/web/CategoryTile";
import { MobileTabBar } from "@/components/mobile/MobileTabBar";
import { ListEventCard } from "@/components/mobile/AppEventCards";
import { AppPlaceRow } from "@/components/mobile/AppPlaceRow";
import { Segmented } from "@/components/mobile/AppParts";
import { useToast } from "@/components/shared/Sheet";
import { DatesSheet, FilterSheet, type DateValue } from "@/components/search/Filters";
import { categoryTone } from "@/lib/categoryTone";

type Tab = "events" | "places";

const chip = (on: boolean) =>
  `flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 text-[13px] leading-4 ${on ? "bg-[#E22765] text-white" : "border border-[#B4BFCA] bg-white text-[#4D5E70] hover:border-[#68788A]"}`;

/** `Illustration / Search` from PW05 No results (112 x 90) on a 144 x 120 mint tile. */
export function NoResultsArt() {
  return (
    <div className="flex h-[120px] w-[144px] items-center justify-center rounded-[24px] bg-[#E0FBF5]">
      <svg width="112" height="90" viewBox="0 0 112 90" fill="none" aria-hidden="true">
        <path fill="#00E0B6" d="M78.4 35.47C84.58 35.47 89.6 30.45 89.6 24.27C89.6 18.08 84.58 13.07 78.4 13.07C72.21 13.07 67.2 18.08 67.2 24.27C67.2 30.45 72.21 35.47 78.4 35.47Z" />
        <path fill="#3D0016" d="M68.95 61.97C66.77 59.78 63.22 59.78 61.03 61.97C58.85 64.15 58.85 67.7 61.03 69.89L72.91 81.77C75.1 83.95 78.65 83.95 80.83 81.77C83.02 79.58 83.02 76.03 80.83 73.85L68.95 61.97Z" />
        <path fill="#E22765" fillRule="evenodd" clipRule="evenodd" d="M46.67 13.07C54.09 13.07 61.21 16.02 66.47 21.27C71.72 26.52 74.67 33.64 74.67 41.07C74.67 48.49 71.72 55.61 66.47 60.87C61.21 66.12 54.09 69.07 46.67 69.07C39.24 69.07 32.12 66.12 26.87 60.87C21.62 55.61 18.67 48.49 18.67 41.07C18.67 33.64 21.62 26.52 26.87 21.27C32.12 16.02 39.24 13.07 46.67 13.07ZM46.67 24.27C44.46 24.27 42.28 24.7 40.24 25.55C38.2 26.39 36.35 27.63 34.79 29.19C33.23 30.75 31.99 32.6 31.14 34.64C30.3 36.68 29.87 38.86 29.87 41.07C29.87 43.27 30.3 45.46 31.14 47.5C31.99 49.53 33.23 51.39 34.79 52.95C36.35 54.51 38.2 55.74 40.24 56.59C42.28 57.43 44.46 57.87 46.67 57.87C51.12 57.87 55.39 56.1 58.55 52.95C61.7 49.8 63.47 45.52 63.47 41.07C63.47 36.61 61.7 32.34 58.55 29.19C55.39 26.04 51.12 24.27 46.67 24.27Z" />
        <path fill="#FD703C" d="M28.93 67.2H19.6C18.05 67.2 16.8 68.45 16.8 70C16.8 71.55 18.05 72.8 19.6 72.8H28.93C30.48 72.8 31.73 71.55 31.73 70C31.73 68.45 30.48 67.2 28.93 67.2Z" />
      </svg>
    </div>
  );
}

const noop = () => () => {};

/**
 * Search. Phone: AM17 Search (213:2047) with no query, AM18 Search results (213:2302, Places
 * 443:34321) with one. Web (768 px and up): PW05 Search results (312:18289, Places 444:35728,
 * No results 312:18590). Filters open AM19 / PW33 / PW34, dates AM20 / PW35.
 */
export function SearchPage() {
  const router = useRouter();
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const [draft, setDraft] = useState(q);
  const [tab, setTab] = useState<Tab>(params.get("tab") === "places" ? "places" : "events");
  const [sheet, setSheet] = useState<null | "filters" | "dates">(null);
  const [date, setDate] = useState<DateValue>({ label: q ? "This weekend" : "Any date" });
  const [format, setFormat] = useState("Any format");
  const [version, setVersion] = useState(0);
  const recent = useSyncExternalStore(noop, () => JSON.stringify(getRecent()), () => "[]");
  const recentList = useMemo(() => JSON.parse(recent) as string[], [recent, version]); // eslint-disable-line react-hooks/exhaustive-deps
  const { show: toast, node: toastNode } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const r = useMemo(() => (q ? search(q) : null), [q]);
  const popular = useMemo(() => pickEvents(["abnormal-nightout", "jersey-creek-picnic", "afrobeats-live-session", "lekki-food-market"]), []);

  useEffect(() => {
    if (!q) inputRef.current?.focus();
  }, [q]);

  const go = (term: string, t: Tab = tab) => {
    const v = term.trim();
    if (!v) return;
    addRecent(v);
    setDraft(v);
    router.push(`/search?q=${encodeURIComponent(v)}${t === "places" ? "&tab=places" : ""}`);
  };

  const tabs = [
    { value: "events" as Tab, label: r ? `Events (${r.events.length})` : "Events" },
    { value: "places" as Tab, label: r ? `Places (${r.places.length})` : "Places" },
  ];
  const webTabs = [
    { value: "events" as Tab, label: `Events ${r?.events.length ?? 0}` },
    { value: "places" as Tab, label: `Places ${r?.places.length ?? 0}` },
  ];
  const empty = r && r.events.length === 0 && r.places.length === 0;
  const cats = getAllCategories().slice(0, 9);

  const field = (app: boolean) => (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        go(draft);
      }}
      className={`flex h-12 shrink-0 items-center gap-2 rounded-full pl-4 pr-1.5 ${app ? "min-w-0 flex-1" : "w-full"} ${
        !q && app ? "border-2 border-[#E22765] bg-white" : "border border-[#E9EDF1] bg-[#F4F6F8] focus-within:border-[#E22765]"
      }`}
    >
      <SearchIcon size={20} className="shrink-0 text-[#68788A]" />
      <input
        ref={app ? inputRef : undefined}
        type="search"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Search events, places and hosts"
        aria-label="Search events, places and hosts"
        enterKeyHint="search"
        className="h-5 w-full min-w-0 bg-transparent text-[14px] leading-5 text-[#172B3A] placeholder:text-[#68788A] focus:outline-none"
      />
      {app && (
        <button type="button" aria-label="Filters" onClick={() => setSheet("filters")} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E22765] text-white">
          <FilterIcon size={20} />
        </button>
      )}
    </form>
  );

  return (
    <>
      {/* ================= App: AM17 / AM18 ================= */}
      <div className="min-h-screen bg-white pb-[120px] pt-[env(safe-area-inset-top)] md:hidden">
        {!r ? (
          <>
            <div className="flex items-center gap-2 pb-2 pl-2 pr-4 pt-4">
              <button
                type="button"
                aria-label="Back"
                onClick={() => (window.history.length > 1 ? router.back() : router.push("/m"))}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#D5DCE3] bg-white text-[#172B3A]"
              >
                <ArrowLeftIcon size={24} />
              </button>
              {field(true)}
            </div>
            {recentList.length > 0 && (
              <>
                <div className="flex h-[26px] items-center justify-between px-4 pt-6 box-content pb-3">
                  <h2 className="text-[20px] font-bold leading-[26px] tracking-[-0.02em] text-[#172B3A]">Recent searches</h2>
                  <button
                    type="button"
                    onClick={() => {
                      clearRecent();
                      setVersion((v) => v + 1);
                      router.refresh();
                    }}
                    className="flex items-center gap-0.5 text-[13px] leading-4 text-[#C81E57]"
                  >
                    Clear
                    <ChevronRightIcon size={16} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 px-4">
                  {recentList.map((s) => (
                    <button key={s} type="button" onClick={() => go(s)} className={chip(false)}>
                      {s}
                    </button>
                  ))}
                </div>
              </>
            )}
            <h2 className="px-4 pb-3 pt-6 text-[20px] font-bold leading-[26px] tracking-[-0.02em] text-[#172B3A]">Online and hybrid</h2>
            <div className="flex gap-2 px-4">
              {["In person", "Online", "Hybrid"].map((s) => (
                <button key={s} type="button" onClick={() => go(s === "In person" ? "Lagos" : s)} className={chip(false)}>
                  {s}
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between px-4 pb-3 pt-6">
              <h2 className="text-[20px] font-bold leading-[26px] tracking-[-0.02em] text-[#172B3A]">Browse categories</h2>
              <Link href="/m/events" className="flex items-center gap-0.5 text-[13px] leading-4 text-[#C81E57]">
                See all
                <ChevronRightIcon size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-5 justify-items-center gap-y-4 px-2">
              {cats.map((c) => (
                <CategoryTile key={c.id} category={c} />
              ))}
              <Link href="/m/events" className="flex w-16 flex-col items-center gap-1.5">
                <span className="flex h-[52px] w-[52px] items-center justify-center rounded-[12px] bg-[#F4F6F8] text-[#68788A]">
                  <GridIcon size={24} />
                </span>
                <span className="text-[12px] leading-4 text-[#4D5E70]">More</span>
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-3 px-4 pb-2 pt-4">
              {field(true)}
              <Segmented items={tabs} value={tab} onChange={setTab} />
            </div>
            <div className="overflow-x-auto no-scrollbar" style={{ scrollbarWidth: "none" }}>
              <div className="flex w-max gap-2 px-4 pb-2 pt-1">
                <button type="button" onClick={() => setSheet("filters")} className={chip(false)}>
                  <FilterIcon size={16} />
                  Filters
                </button>
                <button type="button" onClick={() => setSheet("dates")} className={chip(date.label !== "Any date")}>
                  {date.label}
                  <ChevronDownIcon size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setFormat((f) => (f === "Any format" ? "In person" : f === "In person" ? "Online" : f === "Online" ? "Hybrid" : "Any format"))}
                  className={chip(format !== "Any format")}
                >
                  {format}
                  <ChevronDownIcon size={16} />
                </button>
              </div>
            </div>
            <p className="px-4 pb-2 pt-2 text-[13px] leading-[18px] text-[#4D5E70]">
              {tab === "events" ? `${r.events.length} ${r.events.length === 1 ? "event" : "events"}` : `${r.places.length} ${r.places.length === 1 ? "place" : "places"}`} in Lagos
            </p>
            <div className="flex flex-col items-center gap-3 px-4">
              {tab === "events" && r.events.map((e) => <ListEventCard key={e.slug} event={e} categoryTag={categoryTone(e.categoryLabel)} />)}
              {tab === "places" && r.places.map((p) => <AppPlaceRow key={p.slug} place={p} />)}
              {((tab === "events" && r.events.length === 0) || (tab === "places" && r.places.length === 0)) && (
                <div className="flex flex-col items-center gap-3 pt-10 text-center">
                  <NoResultsArt />
                  <h2 className="text-[20px] font-bold leading-[26px] tracking-[-0.02em] text-[#172B3A]">No results for {q}</h2>
                  <p className="text-[14px] leading-5 text-[#4D5E70]">Try a nearby area, a wider date or remove a filter.</p>
                </div>
              )}
            </div>
          </>
        )}
        <MobileTabBar />
      </div>

      {/* ================= Web: PW05 ================= */}
      <div className="hidden min-h-screen flex-col bg-white md:flex">
        <TopNav />
        <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-8 px-6 pb-24 pt-10 lg:px-[120px]">
          {field(false)}
          {!r ? (
            <div className="flex flex-col gap-4">
              <h1 className="text-[28px] font-bold leading-[34px] tracking-[-0.02em] text-[#172B3A]">Search Xiventa</h1>
              <div className="flex flex-wrap gap-2">
                {recentList.map((s) => (
                  <button key={s} type="button" onClick={() => go(s)} className={chip(false)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : empty ? (
            <>
              <div className="flex flex-col items-center gap-3 py-16 text-center">
                <NoResultsArt />
                <h1 className="pt-2 text-[20px] font-bold leading-[26px] tracking-[-0.02em] text-[#172B3A]">No results for {q}</h1>
                <p className="text-[14px] leading-5 text-[#4D5E70]">Try a nearby area, a wider date or remove a filter.</p>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
                  <button type="button" onClick={() => go(words0(q) + " in Lagos")} className={chip(false)}>
                    {cap(words0(q))} anywhere in Lagos
                  </button>
                  <button type="button" onClick={() => go("Classes")} className={chip(false)}>
                    Dance classes
                  </button>
                  <button type="button" onClick={() => setSheet("filters")} className={chip(false)}>
                    Clear filters
                  </button>
                  <button type="button" onClick={() => router.push("/suggest-place")} className="flex h-8 items-center px-2 text-[14px] text-[#172B3A]">
                    Suggest a place
                  </button>
                </div>
              </div>
              <section className="flex flex-col gap-4">
                <h2 className="text-[24px] font-bold leading-[30px] tracking-[-0.02em] text-[#172B3A]">Popular this weekend</h2>
                <div className="flex flex-wrap gap-6">
                  {popular.map((e) => (
                    <EventCard key={e.slug} event={e} />
                  ))}
                </div>
              </section>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-2">
                <h1 className="text-[28px] font-bold leading-[34px] tracking-[-0.02em] text-[#172B3A]">Results for &quot;{q}&quot;</h1>
                <p className="text-[14px] leading-5 text-[#4D5E70]">
                  {r.events.length} {r.events.length === 1 ? "event" : "events"} and {r.places.length} {r.places.length === 1 ? "place" : "places"} in Lagos
                </p>
              </div>
              <div className="flex h-[100px] items-center gap-4">
                <Segmented items={webTabs} value={tab} onChange={setTab} itemWidth={156} />
                <span className="flex-1" />
                <button type="button" onClick={() => setSheet("dates")} className={chip(date.label !== "Any date" && date.label !== "This weekend")}>
                  {date.label === "This weekend" ? "Any date" : date.label}
                  <ChevronDownIcon size={16} />
                </button>
                <button type="button" onClick={() => setSheet("filters")} className={chip(false)}>
                  Price
                  <ChevronDownIcon size={16} />
                </button>
              </div>
              {tab === "events" ? (
                <>
                  <div className="flex flex-wrap gap-6">
                    {r.events.map((e) => (
                      <EventCard key={e.slug} event={e} />
                    ))}
                  </div>
                  {r.places.length > 0 && (
                    <section className="flex flex-col gap-5">
                      <h2 className="text-[24px] font-bold leading-[30px] tracking-[-0.02em] text-[#172B3A]">Places</h2>
                      <div className="flex flex-wrap gap-6">
                        {r.places.map((p) => (
                          <div key={p.slug} className="w-[384px] max-w-full">
                            <PlaceCard place={p} className="w-full" />
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </>
              ) : (
                <div className="flex flex-wrap gap-6">
                  {r.places.map((p) => (
                    <div key={p.slug} className="w-[384px] max-w-full">
                      <PlaceCard place={p} className="w-full" />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
        <WebFooter />
      </div>

      <FilterSheet
        open={sheet === "filters"}
        onClose={() => setSheet(null)}
        kind={tab}
        count={tab === "events" ? (r?.events.length ?? 0) : (r?.places.length ?? 0)}
        onApply={() => toast("Filters applied")}
        onPickDates={() => setSheet("dates")}
      />
      <DatesSheet open={sheet === "dates"} onClose={() => setSheet(null)} value={date} onChange={setDate} />
      {toastNode}
    </>
  );
}

const words0 = (q: string) => q.split(/\s+in\s+/i)[0];
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
