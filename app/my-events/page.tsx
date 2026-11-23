"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "@/lib/session";
import { MobileTabBar } from "@/components/mobile/MobileTabBar";
import { ListEventCard } from "@/components/mobile/AppEventCards";
import { ActionRow, AppTitleBar, EmptyState, Segmented } from "@/components/mobile/AppParts";
import { EventCard } from "@/components/web/EventCard";
import { AccountShell, NoticeBanner } from "@/components/web/AccountShell";
import { TopNav } from "@/components/web/TopNav";
import { WebFooter } from "@/components/web/WebFooter";
import { RepeatIcon } from "@/components/icons";
import { PAST_EVENTS, SAVED_EVENTS, appUpcoming, webUpcoming } from "@/data/mine";
import { useOrders } from "@/lib/orders";

type Tab = "upcoming" | "saved" | "past";

const NOTES: Record<Tab, string> = {
  upcoming: "Saved on this phone. Works without data.",
  saved: "Events you saved. Saved on this phone and works without data.",
  past: "Events you went to stay here. Open one to rate it or get your receipt.",
};

/** AM36 "Remind me before each Friday Rush" toggle (44 x 26, pink when on). */
function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={`flex h-[26px] w-11 shrink-0 items-center rounded-full px-[3px] transition ${on ? "justify-end bg-[#E22765]" : "justify-start bg-[#D5DCE3]"}`}
    >
      <span className="h-5 w-5 rounded-full bg-white shadow-[0_1px_2px_rgba(23,43,58,0.2)]" />
    </button>
  );
}

/**
 * My events. Phone: AM36 (276:8825 Upcoming, 730:53182 Saved, 443:34018 Past, 276:8992 Nothing
 * coming up, 453:40426 Guest). Web (768 px and up): PW16 (315:20891, 315:21683, 444:35070,
 * 1092:73039). Tapping a ticket opens AM37 / PW17 at /my-events/<id> (rule 15).
 */
export default function MyEventsPage() {
  return (
    <Suspense fallback={null}>
      <MyEvents />
    </Suspense>
  );
}

function MyEvents() {
  const session = useSession();
  const guest = session !== undefined && session?.status !== "signed-in";
  const search = useSearchParams();
  const [tab, setTab] = useState<Tab>(() => (["upcoming", "saved", "past"].includes(search.get("tab") ?? "") ? (search.get("tab") as Tab) : "upcoming"));
  const [remind, setRemind] = useState(true);
  // Testing aid: /my-events?empty shows the "Nothing coming up" state.
  const empty = search.has("empty");

  // Orders placed in checkout (this browser) come first, then the sample tickets.
  const orders = useOrders();
  const app = empty ? [] : [...orders, ...appUpcoming()];
  const web = empty ? [] : [...orders, ...webUpcoming()];

  const appTabs = guest
    ? [
        { value: "upcoming" as Tab, label: "Upcoming" },
        { value: "saved" as Tab, label: "Saved" },
        { value: "past" as Tab, label: "Past" },
      ]
    : [
        { value: "upcoming" as Tab, label: app.length ? `Upcoming (${app.length})` : "Upcoming" },
        { value: "saved" as Tab, label: tab === "saved" ? `Saved (${SAVED_EVENTS.length})` : "Saved" },
        { value: "past" as Tab, label: "Past" },
      ];
  const webTabs = [
    { value: "upcoming" as Tab, label: web.length ? `Upcoming (${web.length})` : "Upcoming" },
    { value: "saved" as Tab, label: `Saved (${SAVED_EVENTS.length})` },
    { value: "past" as Tab, label: "Past" },
  ];

  const guestEmpty = (
    <EmptyState
      title="Your events live here"
      body="Sign in to get tickets, tap I'm going or save events. Everything shows up here and works without data."
      action="Sign in or sign up"
      href="/welcome"
    />
  );
  const nothing = (
    <EmptyState
      title="Nothing coming up"
      body="Tickets you get and events you're going to show up here, ready for the door."
      action="Find something to do"
      href="/m"
    />
  );

  return (
    <>
      {/* ---------- App (AM36) ---------- */}
      <div className="min-h-screen bg-white pb-[120px] pt-[env(safe-area-inset-top)] md:hidden">
        <AppTitleBar title="My events" />
        <div className="px-4 pt-2">
          <Segmented items={appTabs} value={tab} onChange={setTab} />
        </div>

        {session === undefined ? null : guest ? (
          guestEmpty
        ) : (
          <>
            {!(tab === "upcoming" && app.length === 0) && <p className="px-4 pt-3 text-[12px] leading-4 text-[#067647]">{NOTES[tab]}</p>}
            <div className="flex flex-col items-center gap-3 px-4 pt-2">
              {tab === "upcoming" &&
                (app.length === 0
                  ? nothing
                  : app.map((t) => <ListEventCard key={t.id} event={t.event} footer={t.appLabel} href={`/my-events/${t.id}`} showSave={false} />))}
              {tab === "saved" && SAVED_EVENTS.map((s) => <ListEventCard key={s.event.slug} event={s.event} badge={s.badge} />)}
              {tab === "past" && PAST_EVENTS.map((p) => <ListEventCard key={p.event.slug} event={p.event} footer={p.label} showSave={false} href={`/my-events/${p.event.slug}`} />)}
            </div>
            {tab === "saved" && (
              <div className="px-4 pt-3">
                <ActionRow
                  icon={<RepeatIcon size={20} />}
                  title="Remind me before each Friday Rush"
                  subtitle="One reminder before every date"
                  trailing={<Toggle on={remind} onChange={setRemind} />}
                />
              </div>
            )}
          </>
        )}
        <MobileTabBar />
      </div>

      {/* ---------- Web (PW16) ---------- */}
      <div className="hidden md:block">
        {session === undefined ? null : guest ? (
          <div className="flex min-h-screen flex-col">
            <TopNav />
            <main className="flex flex-1 justify-center px-6 pb-24 pt-10">{guestEmpty}</main>
            <WebFooter />
          </div>
        ) : (
          <AccountShell>
            <h1 className="text-[28px] font-bold leading-[34px] tracking-[-0.02em] text-[#172B3A]">My events</h1>
            <Segmented items={webTabs} value={tab} onChange={setTab} itemWidth={104} className="w-fit" />
            {tab === "upcoming" && web.length === 0 ? (
              <div className="flex justify-start">{nothing}</div>
            ) : (
              <div className="flex flex-wrap gap-6">
                {tab === "upcoming" &&
                  web.map((t) => <EventCard key={t.id} event={t.event} footer={t.webLabel} href={`/my-events/${t.id}`} />)}
                {tab === "saved" && SAVED_EVENTS.map((s) => <EventCard key={s.event.slug} event={s.event} />)}
                {tab === "past" && PAST_EVENTS.map((p) => <EventCard key={p.event.slug} event={p.event} footer={p.label} href={`/my-events/${p.event.slug}`} />)}
              </div>
            )}
            {tab === "upcoming" && <NoticeBanner title="Event day is easier in the app" body="Tickets saved in the app work without data." />}
          </AccountShell>
        )}
      </div>
    </>
  );
}
