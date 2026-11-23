"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { getSpotlightStories, SpotlightStory } from "@/data";
import { BookmarkFilledIcon, BookmarkIcon, ShareIcon } from "@/components/icons";
import { MobileTabBar } from "@/components/mobile/MobileTabBar";
import { TopNav } from "@/components/web/TopNav";
import { WebFooter } from "@/components/web/WebFooter";
import { SpotlightCard } from "@/components/web/SpotlightCard";
import { GetAppButton } from "@/components/pwa/GetAppButton";

const PlayLine = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M6.667 4.584V15.417L15.417 10.001L6.667 4.584Z" stroke="#172B3A" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * One full-screen clip, 1:1 with AM58 Spotlight / Event (279:9121) and / Place (279:9207):
 * image fills the screen above #172B3A, bottom scrim from 340 px, 44 px white-72 % Save / Share
 * buttons on the right, poster line, 14 / 20 caption and a white linked card (radius 16, pink
 * 32 px action, radius 8). The info block ends 168 px above the bottom, clear of the tab bar.
 */
function Clip({ story }: { story: SpotlightStory }) {
  const [saved, setSaved] = useState(false);
  const isPlace = story.actionType === "directions";
  return (
    <section className="relative h-[100dvh] w-full shrink-0 snap-start snap-always overflow-hidden bg-[#172B3A]">
      <div className="absolute inset-x-0 top-0 bottom-16">
        <Image src={story.imageUrl} alt="" fill sizes="100vw" className="object-cover" priority={false} />
      </div>
      <div
        className="absolute inset-x-0 bottom-16 h-[440px] max-h-[56%]"
        style={{ background: "linear-gradient(180deg, rgba(23,43,58,0) 0%, rgba(23,43,58,0.72) 100%)" }}
      />

      <div className="absolute right-4 bottom-[278px] flex w-11 flex-col items-center gap-4">
        {[
          { label: "Save", icon: saved ? <BookmarkFilledIcon size={24} /> : <BookmarkIcon size={24} />, onClick: () => setSaved((v) => !v) },
          {
            label: "Share",
            icon: <ShareIcon size={24} />,
            onClick: () => navigator.share?.({ title: story.posterName, text: story.caption, url: window.location.href }).catch(() => {}),
          },
        ].map((a) => (
          <button key={a.label} type="button" onClick={a.onClick} className="flex flex-col items-center gap-1" aria-pressed={a.label === "Save" ? saved : undefined}>
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.72] text-[#172B3A]">{a.icon}</span>
            <span className="text-[10px] leading-3 text-white">{a.label}</span>
          </button>
        ))}
      </div>

      <div className="absolute inset-x-4 bottom-[168px] flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F1EEFF] text-[10px] leading-3 text-[#5B3FD6]">{story.posterInitials}</span>
          <span className="text-[13px] leading-4 text-white">{story.posterName}</span>
        </div>
        <p className="max-w-[290px] text-[14px] leading-5 text-white">{story.caption}</p>
        <div className="flex h-[58px] items-center gap-3 rounded-2xl bg-white p-3">
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="truncate text-[10px] uppercase leading-3 tracking-[0.04em]" style={{ color: isPlace ? "#067647" : "#C81E57" }}>
              {story.meta}
            </span>
            <span className="truncate text-[14px] leading-5 text-[#172B3A]">{story.posterName}</span>
          </div>
          <Link href={isPlace ? "/places" : "/events"} className="flex h-8 shrink-0 items-center rounded-[8px] bg-[#E22765] px-3 text-[13px] leading-4 text-white">
            {story.actionLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}

/**
 * Spotlight. Phone: AM58 full-screen clips that snap one per swipe. Web: rule 19, Spotlight is an
 * app feature, so the web page shows the clips as previews and hands off to Get the app.
 */
export default function SpotlightPage() {
  const stories = getSpotlightStories();
  const [index, setIndex] = useState(0);
  const tone = stories[index]?.headerTone === "dark" ? "#172B3A" : "#FFFFFF";

  return (
    <>
      {/* ---------- App (AM58) ---------- */}
      <div className="fixed inset-0 bg-[#172B3A] md:hidden">
        <div
          className="no-scrollbar h-full snap-y snap-mandatory overflow-y-auto overscroll-contain"
          style={{ scrollbarWidth: "none" }}
          onScroll={(e) => {
            const el = e.currentTarget;
            const i = Math.round(el.scrollTop / el.clientHeight);
            if (i !== index) setIndex(i);
          }}
        >
          {stories.map((s) => (
            <Clip key={s.id} story={s} />
          ))}
        </div>
        <div className="pointer-events-none absolute inset-x-4 top-[calc(env(safe-area-inset-top)+9px)] flex h-10 items-center justify-between">
          <h1 className="text-[20px] font-bold leading-[26px] tracking-[-0.02em] transition-colors" style={{ color: tone }}>
            Spotlight
          </h1>
          <span className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.72]" aria-hidden="true">
            <PlayLine />
          </span>
        </div>
        <MobileTabBar />
      </div>

      {/* ---------- Web: hand-off to the app (rule 19) ---------- */}
      <div className="hidden min-h-screen flex-col md:flex">
        <TopNav />
        <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-8 px-6 pb-24 pt-10 lg:px-[120px]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="flex max-w-[560px] flex-col gap-2">
              <h1 className="text-[28px] font-bold leading-[34px] tracking-[-0.02em] text-[#172B3A]">Spotlight</h1>
              <p className="text-[14px] leading-5 text-[#4D5E70]">
                Short clips from events and places around Lagos. Swipe through them full screen, save the ones you like and get tickets in a tap, in the Xiventa app.
              </p>
            </div>
            <GetAppButton className="flex h-11 items-center rounded-[12px] bg-[#E22765] px-4 text-[14px] leading-[18px] text-white hover:bg-[#C81E57]">
              Watch in the app
            </GetAppButton>
          </div>
          <div className="no-scrollbar flex gap-6 overflow-x-auto overflow-y-hidden pb-2" style={{ scrollbarWidth: "none" }}>
            {stories.map((s) => (
              <SpotlightCard key={s.id} story={s} />
            ))}
          </div>
        </main>
        <WebFooter />
      </div>
    </>
  );
}
