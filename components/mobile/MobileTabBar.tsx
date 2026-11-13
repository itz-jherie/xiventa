"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  NavigationIcon,
  SearchIcon,
  BookmarkIcon,
  TicketIcon,
  UserIcon,
} from "@/components/icons";

/**
 * Mobile Bottom Tab Bar
 * 1:1 match with Figma `Tab Bar` in `AM11 Home` (Node `211:827`)
 *
 * Dimensions: 390px wide, 68px high (fixed bottom for mobile viewports)
 */
export function MobileTabBar() {
  const pathname = usePathname();

  const tabs = [
    { label: "Explore", href: "/", icon: NavigationIcon },
    { label: "Search", href: "/events", icon: SearchIcon },
    { label: "Saved", href: "/saved", icon: BookmarkIcon },
    { label: "Tickets", href: "/tickets", icon: TicketIcon },
    { label: "Profile", href: "/profile", icon: UserIcon },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 h-[68px] bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-4 flex items-center justify-around shadow-lg">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-col items-center justify-center gap-1 w-12 py-1 transition-colors select-none ${
              isActive ? "text-brand-600 font-bold" : "text-[#4d5e70] hover:text-[#172b3a]"
            }`}
          >
            <Icon size={20} className={isActive ? "text-brand-600 stroke-[2.5]" : "text-[#4d5e70]"} />
            <span className="text-[10px] tracking-tight">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

