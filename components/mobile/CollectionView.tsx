"use client";

import type { Collection } from "@/data/collections";
import type { XiventaEvent } from "@/data";
import { TopNav } from "@/components/web/TopNav";
import { WebFooter } from "@/components/web/WebFooter";
import { EventCard } from "@/components/web/EventCard";
import { ListEventCard } from "@/components/mobile/AppEventCards";
import { EmptyState } from "@/components/mobile/AppParts";
import { HubShell } from "@/components/mobile/HubShell";
import { useToast } from "@/components/shared/Sheet";
import { categoryTone } from "@/lib/categoryTone";

/**
 * Collection. Phone: AM15 (301:13918) and Ended (301:14088). There is no web frame, so desktops get
 * the same content in the PW02 grid: title, intro, 282 px event cards.
 */
export function CollectionView({ c, weekend }: { c: Collection; weekend: XiventaEvent[] }) {
  const { show: toast, node } = useToast();
  const ended = (
    <>
      <EmptyState title="This collection has ended" body="The events in it have passed. Here's what's on this weekend instead." />
      <div className="-mt-3 flex justify-center pb-4">
        <button type="button" onClick={() => toast("We'll tell you when a new collection drops")} className="flex h-11 items-center rounded-[12px] border border-[#B4BFCA] bg-white px-4 text-[14px] text-[#172B3A]">
          Turn on alerts
        </button>
      </div>
    </>
  );
  return (
    <>
      <div className="md:hidden">
        <HubShell title={c.title} subtitle={c.ended ? undefined : `${c.by} · ${c.events.length} events`} tabBar={false}>
          {c.ended ? (
            <>
              {ended}
              <div className="flex flex-col items-center gap-3 px-4">
                {weekend.map((e) => (
                  <ListEventCard key={e.slug} event={e} hostLine categoryTag={categoryTone(e.categoryLabel)} />
                ))}
              </div>
            </>
          ) : (
            <>
              <p className="px-4 pb-3 pt-1 text-[14px] leading-5 text-[#4D5E70]">{c.intro}</p>
              <div className="flex flex-col items-center gap-3 px-4">
                {c.events.map((e) => (
                  <ListEventCard key={e.slug} event={e} hostLine showRepeatAndAge={false} categoryTag={categoryTone(e.categoryLabel)} />
                ))}
              </div>
            </>
          )}
        </HubShell>
      </div>
      <div className="hidden min-h-screen flex-col bg-white md:flex">
        <TopNav />
        <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-8 px-6 pb-24 pt-10 lg:px-[120px]">
          <div className="flex flex-col gap-2">
            <h1 className="text-[28px] font-bold leading-[34px] tracking-[-0.02em] text-[#172B3A]">{c.title}</h1>
            <p className="text-[14px] leading-5 text-[#4D5E70]">{c.ended ? "This collection has ended." : `${c.by} · ${c.events.length} events. ${c.intro}`}</p>
          </div>
          {c.ended && <div className="flex justify-start">{ended}</div>}
          <div className="flex flex-wrap gap-6">
            {(c.ended ? weekend : c.events).map((e) => (
              <EventCard key={e.slug} event={e} />
            ))}
          </div>
        </main>
        <WebFooter />
      </div>
      {node}
    </>
  );
}
