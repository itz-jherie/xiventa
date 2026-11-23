"use client";

import { Suspense, useState, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import { BEEN_PLACES, PLANNED_PLACES, SAVED_PLACES } from "@/data/mine";
import { getPlaceBySlug, type Place } from "@/data";
import { answerPlan, isoDate, isPast, useVisits, type PlannedVisit } from "@/lib/visits";
import { DidYouGoSheet } from "@/components/place/PlaceFlows";
import { useToast } from "@/components/shared/Sheet";
import type { PlaceBadge } from "@/components/mobile/AppPlaceRow";
import { AppPlaceRow, PlaceBadgePill as Badge } from "@/components/mobile/AppPlaceRow";
import { useSession } from "@/lib/session";
import { MobileTabBar } from "@/components/mobile/MobileTabBar";
import { AppTitleBar, EmptyState, Segmented } from "@/components/mobile/AppParts";
import { PlaceCard } from "@/components/web/PlaceCard";
import { AccountShell } from "@/components/web/AccountShell";
import { TopNav } from "@/components/web/TopNav";
import { WebFooter } from "@/components/web/WebFooter";

type Tab = "saved" | "planned" | "been";

/** The sample plan (Skyline Lounge, Sat 29 Nov 2026, 9 PM) as a stored visit. */
const SAMPLE_PLAN: PlannedVisit = { slug: "skyline-lounge", date: "2026-11-29", time: "9 PM", label: "Sat 29 Nov, 9 PM" };
type Row = { place: Place; badge: PlaceBadge; plan?: PlannedVisit; due?: boolean };
const EMPTY: Record<Tab, string> = {
  saved: "Nothing saved yet. Tap the bookmark on any place.",
  planned: "Nothing planned yet. Use Plan a visit on any place page.",
  been: "No places yet. Tap Been here on a place you've visited.",
};
const NOTES: Record<Tab, string> = {
  saved: "Places you saved. Saved on this phone and works without data.",
  planned: "Visits you planned. We'll ask if you went the day after.",
  been: "Only you can see this. It doesn't count toward ratings.",
};

/**
 * My places. Phone: AM77 (730:53486 Saved, 730:53575 Planned, 730:53662 Been here, 793:53526
 * Guest). Web (768 px and up): PW22 (444:35255, 746:55126, 746:55144).
 */
export default function MyPlacesPage() {
  return (
    <Suspense fallback={null}>
      <MyPlaces />
    </Suspense>
  );
}

function MyPlaces() {
  const session = useSession();
  const guest = session !== undefined && session?.status !== "signed-in";
  const search = useSearchParams();
  const [tab, setTab] = useState<Tab>(() => (["saved", "planned", "been"].includes(search.get("tab") ?? "") ? (search.get("tab") as Tab) : "saved"));
  const visits = useVisits();
  const { show: toast, node: toastNode } = useToast();
  const [asking, setAsking] = useState<Row | null>(null);
  // Today on the client only (prerender has no clock). ?state=day-after previews the day after a plan.
  const todayIso = useSyncExternalStore(
    () => () => {},
    () => isoDate(new Date()),
    () => null
  );
  const dayAfter = search.get("state") === "day-after";

  const planRows: Row[] = [...visits.plans, ...(visits.answered.includes(SAMPLE_PLAN.slug) || visits.plans.some((p) => p.slug === SAMPLE_PLAN.slug) ? [] : [SAMPLE_PLAN])].flatMap((plan) => {
    const sample = PLANNED_PLACES.find((p) => p.place.slug === plan.slug)?.place;
    const place = sample ?? getPlaceBySlug(plan.slug);
    if (!place) return [];
    const due = dayAfter || (!!todayIso && isPast(plan.date, new Date(todayIso)));
    return [{ place, plan, due, badge: due ? { label: "Did you go? Tap to tell us", tone: "amber" as const } : { label: `Planned · ${plan.label}`, tone: "blue" as const } }];
  });
  const beenRows: Row[] = [
    ...visits.been.flatMap((slug) => {
      const place = getPlaceBySlug(slug);
      return place && !BEEN_PLACES.some((b) => b.place.slug === slug) ? [{ place, badge: { label: "Been here", tone: "blue" as const } }] : [];
    }),
    ...BEEN_PLACES,
  ];
  const LISTS: Record<Tab, Row[]> = { saved: SAVED_PLACES, planned: planRows, been: beenRows };
  const due = planRows.find((r) => r.due);
  const answer = (row: Row, went: boolean) => {
    answerPlan(row.place.slug, went);
    setAsking(null);
    toast(went ? `${row.place.name} moved to Been here` : "Okay. We took it off your plans", went ? "View" : undefined, went ? () => setTab("been") : undefined);
  };
  const items = [
    { value: "saved" as Tab, label: guest ? "Saved" : `Saved (${SAVED_PLACES.length})` },
    { value: "planned" as Tab, label: guest ? "Planned" : `Planned (${planRows.length})` },
    { value: "been" as Tab, label: guest ? "Been here" : `Been here (${beenRows.length})` },
  ];
  const guestEmpty = (
    <EmptyState
      title="Your places live here"
      body="Sign in to save places, plan visits and keep track of where you've been."
      action="Sign in or sign up"
      href="/welcome"
    />
  );

  return (
    <>
      {/* ---------- App (AM77) ---------- */}
      <div className="min-h-screen bg-white pb-[120px] pt-[env(safe-area-inset-top)] md:hidden">
        <AppTitleBar title="My places" />
        <div className="px-4 pt-2">
          <Segmented items={items} value={tab} onChange={setTab} />
        </div>
        {session === undefined ? null : guest ? (
          guestEmpty
        ) : (
          <>
            <p className="px-4 pt-3 text-[12px] leading-4 text-[#067647]">{NOTES[tab]}</p>
            <div className="flex flex-col items-center gap-3 px-4 pt-2">
              {LISTS[tab].length === 0 && <p className="w-full max-w-[358px] py-6 text-[14px] leading-5 text-[#4D5E70]">{EMPTY[tab]}</p>}
              {LISTS[tab].map((p) => (
                <AppPlaceRow key={p.place.slug} place={p.place} badge={p.badge} onBadge={p.due ? () => setAsking(p) : undefined} />
              ))}
            </div>
          </>
        )}
        <MobileTabBar />
      </div>

      {/* ---------- Web (PW22) ---------- */}
      <div className="hidden md:block">
        {session === undefined ? null : guest ? (
          <div className="flex min-h-screen flex-col">
            <TopNav />
            <main className="flex flex-1 justify-center px-6 pb-24 pt-10">{guestEmpty}</main>
            <WebFooter />
          </div>
        ) : (
          <AccountShell>
            <h1 className="text-[28px] font-bold leading-[34px] tracking-[-0.02em] text-[#172B3A]">My places</h1>
            {tab !== "saved" && <p className="text-[12px] leading-4 text-[#067647]">{NOTES[tab]}</p>}
            {tab === "planned" && due && (
              <div className="flex w-full max-w-[560px] flex-col gap-4 rounded-2xl border border-[#E9EDF1] p-4">
                <div className="flex flex-col gap-1">
                  <p className="text-[13px] leading-4 text-[#172B3A]">
                    Did you go to {due.place.name} on {due.plan!.label.split(",")[0]}?
                  </p>
                  <p className="text-[12px] leading-4 text-[#4D5E70]">Tell us and we move it to Been here. Only you see this.</p>
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => answer(due, true)} className="flex h-11 items-center rounded-[12px] border border-[#B4BFCA] px-4 text-[14px] text-[#172B3A] hover:border-[#68788A]">
                    Yes, I went
                  </button>
                  <button type="button" onClick={() => answer(due, false)} className="flex h-11 items-center rounded-[12px] border border-[#B4BFCA] px-4 text-[14px] text-[#172B3A] hover:border-[#68788A]">
                    Not yet
                  </button>
                </div>
              </div>
            )}
            <Segmented items={items} value={tab} onChange={setTab} itemWidth={104} className="w-fit" />
            {LISTS[tab].length === 0 && <p className="text-[14px] leading-5 text-[#4D5E70]">{EMPTY[tab]}</p>}
            <div className="flex flex-wrap gap-6">
              {LISTS[tab].map((p) => (
                <div key={p.place.slug} className="relative w-[262px]">
                  <PlaceCard place={p.badge.tone === "blue" || p.badge.tone === "amber" ? { ...p.place, isOpenNow: false } : p.place} className="w-full" />
                  {(p.badge.tone === "blue" || p.badge.tone === "amber") && (
                    <div className="pointer-events-none absolute left-[11px] top-[11px]">
                      <Badge badge={p.badge} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </AccountShell>
        )}
      </div>
      <DidYouGoSheet open={!!asking} onClose={() => setAsking(null)} name={asking?.place.name ?? ""} when={asking?.plan?.label.split(",")[0] ?? ""} onAnswer={(went) => asking && answer(asking, went)} />
      {toastNode}
    </>
  );
}
