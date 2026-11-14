"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  PlayIcon,
  PlusIcon,
  MapPinIcon,
  TicketIcon,
} from "@/components/icons";

/**
 * Mobile Bottom Tab Bar
 * 1:1 match with Figma `Tab Bar` in `AM11 Home` (Node `211:827`)
 *
 * Dimensions: 390px wide, 68px high (fixed bottom for mobile viewports)
 * Tabs:
 *  1. Tab / Home (Node I211:827;... Home) -> /m
 *  2. Tab / Spotlight (Node I211:827;... Spotlight) -> /spotlight
 *  3. Create (Node I211:827;... Create: 52px floating #E22765 circle with PlusIcon) -> /dashboard
 *  4. Tab / My places (Node I211:827;... My places) -> /places
 *  5. Tab / My events (Node I211:827;... My events) -> /events
 */
export function MobileTabBar() {
  const pathname = usePathname();

  const isHome = pathname === "/m" || pathname === "/";
  const isSpotlight = pathname === "/spotlight";
  const isPlaces = pathname === "/places";
  const isEvents = pathname === "/events" || pathname.startsWith("/events/");

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto z-50 h-[68px] bg-white/95 backdrop-blur-md border-t border-slate-100 px-3 flex items-center justify-around shadow-[0_-4px_16px_rgba(0,0,0,0.04)] select-none">
      {/* 1. Home */}
      <Link
        href="/m"
        className={`flex flex-col items-center justify-center gap-1 w-14 py-1 transition-colors ${
          isHome ? "text-[#E22765] font-bold" : "text-[#68788A] hover:text-[#172B3A]"
        }`}
      >
        <HomeIcon size={20} className={isHome ? "text-[#E22765] stroke-[2.2]" : "text-[#68788A]"} />
        <span className="text-[10px] tracking-tight">Home</span>
      </Link>

      {/* 2. Spotlight */}
      <Link
        href="/spotlight"
        className={`flex flex-col items-center justify-center gap-1 w-14 py-1 transition-colors ${
          isSpotlight ? "text-[#E22765] font-bold" : "text-[#68788A] hover:text-[#172B3A]"
        }`}
      >
        <div className="w-5 h-5 rounded-full border-[1.8px] border-current flex items-center justify-center">
          <PlayIcon size={10} className="ml-0.5 fill-current" />
        </div>
        <span className="text-[10px] tracking-tight">Spotlight</span>
      </Link>

      {/* 3. Create Action (+) */}
      <Link
        href="/dashboard"
        aria-label="Create event"
        className="relative -top-4 w-[52px] h-[52px] rounded-full bg-[#E22765] hover:bg-[#C81E57] text-white flex items-center justify-center shadow-lg shadow-[#E22765]/25 transition active:scale-95"
      >
        <PlusIcon size={24} className="stroke-[2.5]" />
      </Link>

      {/* 4. My places */}
      <Link
        href="/places"
        className={`flex flex-col items-center justify-center gap-1 w-14 py-1 transition-colors ${
          isPlaces ? "text-[#E22765] font-bold" : "text-[#68788A] hover:text-[#172B3A]"
        }`}
      >
        <MapPinIcon size={20} className={isPlaces ? "text-[#E22765] stroke-[2.2]" : "text-[#68788A]"} />
        <span className="text-[10px] tracking-tight">My places</span>
      </Link>

      {/* 5. My events */}
      <Link
        href="/events"
        className={`flex flex-col items-center justify-center gap-1 w-14 py-1 transition-colors ${
          isEvents ? "text-[#E22765] font-bold" : "text-[#68788A] hover:text-[#172B3A]"
        }`}
      >
        <TicketIcon size={20} className={isEvents ? "text-[#E22765] stroke-[2.2]" : "text-[#68788A]"} />
        <span className="text-[10px] tracking-tight">My events</span>
      </Link>
    </nav>
  );
}
