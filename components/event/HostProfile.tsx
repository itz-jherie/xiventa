"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import type { Host } from "@/data/hosts";
import { ArrowLeftIcon, CameraIcon, FlagIcon, ShareIcon, ShieldCheckIcon } from "@/components/icons";
import { TopNav } from "@/components/web/TopNav";
import { WebFooter } from "@/components/web/WebFooter";
import { EventCard } from "@/components/web/EventCard";
import { ListEventCard } from "@/components/mobile/AppEventCards";
import { ActionRow, EmptyState, Segmented } from "@/components/mobile/AppParts";
import { useToast } from "@/components/shared/Sheet";
import { ReportSheet, ShareSheet } from "@/components/shared/Overlays";
import { categoryTone } from "@/lib/categoryTone";

type Tab = "upcoming" | "past";

function VerifiedPill() {
  return (
    <span className="inline-flex h-[21px] w-fit items-center gap-1 rounded-full bg-[#E3F8EF] py-[3px] pl-1.5 pr-2 text-[12px] text-[#067647]">
      <ShieldCheckIcon size={14} />
      Verified organizer
    </span>
  );
}

const ENDED = { label: "Ended", bg: "#E9EDF1", fg: "#33465A", dot: "#68788A" };

/**
 * Organizer profile. Phone: AM25 (260:7340, No upcoming events 260:7691, Past 443:34157).
 * Web (768 px and up): PW09 (313:19987, Past 444:35499).
 */
export function HostProfile({ host }: { host: Host }) {
  const router = useRouter();
  const params = useSearchParams();
  const noUpcoming = params.has("empty") || host.upcoming.length === 0;
  const upcoming = noUpcoming ? [] : host.upcoming;
  const [tab, setTab] = useState<Tab>(params.get("tab") === "past" ? "past" : "upcoming");
  const [sheet, setSheet] = useState<null | "share" | "report">(null);
  const { show: toast, node: toastNode } = useToast();
  const tabs = [
    { value: "upcoming" as Tab, label: upcoming.length ? `Upcoming (${upcoming.length})` : "Upcoming" },
    { value: "past" as Tab, label: "Past" },
  ];
  const webTabs = [
    { value: "upcoming" as Tab, label: `Upcoming ${upcoming.length}` },
    { value: "past" as Tab, label: `Past ${Math.max(host.past.length, host.hosted - upcoming.length)}` },
  ];
  const empty = (
    <EmptyState
      title="No upcoming events yet"
      body={`${host.name} hasn't announced their next event. Check their past events or see what's on across Lagos.`}
      action="See past events"
      href="?tab=past"
    />
  );
  const links = (
    <div className="flex gap-2">
      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex h-8 items-center gap-1.5 rounded-full border border-[#B4BFCA] bg-white px-4 text-[13px] leading-4 text-[#4D5E70]">
        <CameraIcon size={16} />
        Instagram
      </a>
      <a href="#" className="flex h-8 items-center rounded-full border border-[#B4BFCA] bg-white px-4 text-[13px] leading-4 text-[#4D5E70]">
        Website
      </a>
    </div>
  );

  return (
    <>
      {/* ================= App (AM25) ================= */}
      <div className="min-h-screen bg-white pb-10 md:hidden">
        <div className="relative h-[200px] w-full overflow-hidden bg-[#172B3A]">
          <Image src={host.cover} alt="" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-x-0 top-0 h-[140px]" style={{ background: "linear-gradient(180deg, rgba(23,43,58,0.48) 0%, rgba(23,43,58,0) 100%)" }} />
          <div className="absolute inset-x-4 top-[calc(env(safe-area-inset-top)+8px)] flex items-center justify-between">
            <button
              type="button"
              aria-label="Back"
              onClick={() => (window.history.length > 1 ? router.back() : router.push("/m"))}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.72] text-[#172B3A]"
            >
              <ArrowLeftIcon size={20} />
            </button>
            <button type="button" aria-label="Share" onClick={() => setSheet("share")} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.72] text-[#172B3A]">
              <ShareIcon size={20} />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2 px-4">
          <div className="relative h-10">
            <span className="absolute -top-8 left-0 flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-white bg-[#F1EEFF] text-[20px] font-bold leading-[26px] tracking-[-0.02em] text-[#5B3FD6]">
              {host.initials}
            </span>
          </div>
          <h1 className="text-[24px] font-bold leading-[30px] tracking-[-0.02em] text-[#172B3A]">{host.name}</h1>
          {host.verified && <VerifiedPill />}
          <p className="text-[12px] leading-4 text-[#4D5E70]">{host.kind}</p>
          <p className="text-[14px] leading-5 text-[#4D5E70]">{host.bio}</p>
          <div className="flex gap-6 pt-1">
            {[
              [String(host.hosted), "events hosted"],
              [String(upcoming.length), "coming up"],
              [`★ ${host.rating}`, `from ${host.ratings} ratings`],
            ].map(([v, l]) => (
              <div key={l} className="flex flex-col">
                <span className="text-[17px] font-bold leading-[22px] tracking-[-0.01em] text-[#172B3A]">{v}</span>
                <span className="text-[12px] leading-4 text-[#4D5E70]">{l}</span>
              </div>
            ))}
          </div>
          <div className="pt-1">{links}</div>
        </div>

        <div className="px-4 pb-3 pt-6">
          <Segmented items={tabs} value={tab} onChange={setTab} />
        </div>

        <div className="flex flex-col items-center gap-3 px-4">
          {tab === "upcoming" ? (
            upcoming.length === 0 ? (
              <div className="-mt-12 w-full">{empty}</div>
            ) : (
              upcoming.map((e) => <ListEventCard key={e.slug} event={e} categoryTag={categoryTone(e.categoryLabel)} />)
            )
          ) : (
            host.past.concat(host.past.length ? [] : host.upcoming.slice(0, 2)).map((e) => <ListEventCard key={e.slug} event={e} badge={ENDED} categoryTag={categoryTone(e.categoryLabel)} />)
          )}
        </div>

        <div className="px-4 pt-4">
          <ActionRow icon={<FlagIcon size={20} />} title="Report this host" subtitle="Fake events, impersonation or something else" onClick={() => setSheet("report")} />
        </div>
      </div>

      {/* ================= Web (PW09) ================= */}
      <div className="hidden min-h-screen flex-col bg-white md:flex">
        <TopNav />
        <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-8 px-6 pb-24 pt-10 lg:px-[120px]">
          <div className="relative h-[240px] w-full overflow-hidden rounded-[24px] bg-[#E9EDF1]">
            <Image src={host.webCover} alt="" fill priority sizes="1200px" className="object-cover" />
          </div>
          <div className="flex gap-6">
            <span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-[#F1EEFF] text-[28px] font-bold leading-[34px] text-[#5B3FD6]">{host.initials}</span>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-[40px] font-bold leading-[44px] tracking-[-0.02em] text-[#172B3A]">{host.name}</h1>
                {host.verified && <VerifiedPill />}
              </div>
              <p className="text-[14px] leading-5 text-[#4D5E70]">{host.webKind}</p>
              <p className="text-[16px] leading-6 tracking-[-0.01em] text-[#172B3A]">{host.webBio}</p>
              <div className="flex flex-wrap gap-6 text-[17px] leading-[22px] tracking-[-0.01em] text-[#172B3A]">
                <span>{host.hosted} events hosted</span>
                <span>{upcoming.length} coming up</span>
                <span>
                  ★ {host.rating} from {host.ratings} ratings across 14 events
                </span>
              </div>
              {links}
            </div>
            <button type="button" onClick={() => setSheet("share")} className="flex h-11 shrink-0 items-center rounded-[12px] border border-[#B4BFCA] bg-white px-4 text-[14px] leading-[18px] text-[#172B3A]">
              Share
            </button>
          </div>
          <Segmented items={webTabs} value={tab} onChange={setTab} itemWidth={156} className="w-fit" />
          {tab === "upcoming" && upcoming.length === 0 ? (
            <div className="flex justify-start">{empty}</div>
          ) : (
            <div className="flex flex-wrap gap-6">
              {(tab === "upcoming" ? upcoming : host.past.length ? host.past : host.upcoming.slice(0, 2)).map((e) => (
                <EventCard key={e.slug} event={e} footer={tab === "past" ? "Ended" : undefined} />
              ))}
            </div>
          )}
          <button type="button" onClick={() => setSheet("report")} className="flex h-11 w-fit items-center rounded-[12px] px-4 text-[14px] leading-[18px] text-[#C81E57] hover:bg-[#FDEEF3]">
            Report this host
          </button>
        </main>
        <WebFooter />
      </div>

      <ShareSheet open={sheet === "share"} onClose={() => setSheet(null)} title="Share host" subtitle={`${host.name} on Xiventa`} path={`/h/${host.slug}`} toast={toast} />
      <ReportSheet open={sheet === "report"} onClose={() => setSheet(null)} what="host" toast={toast} />
      {toastNode}
    </>
  );
}
