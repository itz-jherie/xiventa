"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ArrowLeftIcon, ChevronRightIcon } from "@/components/icons";
import { MobileTabBar } from "@/components/mobile/MobileTabBar";
import { isDesktop } from "@/components/auth/WebAuth";
import Link from "next/link";

/**
 * App list screens (AM12 Events hub, AM13 Places hub, AM15 Collection): 56 px top bar with a 36 px
 * grey back button, 17 / 22 bold title and a 12 / 16 subtitle; tab bar below. These are app-only
 * screens, so desktops are sent to `webHref`.
 */
export function HubShell({ title, subtitle, webHref, children, tabBar = true }: { title: string; subtitle?: string; webHref?: string; children: React.ReactNode; tabBar?: boolean }) {
  const router = useRouter();
  useEffect(() => {
    if (webHref && isDesktop()) router.replace(webHref);
  }, [webHref, router]);
  return (
    <div className="min-h-screen bg-white pb-[120px] pt-[env(safe-area-inset-top)]">
      <div className="flex h-14 items-center gap-3 px-4">
        <button
          type="button"
          aria-label="Back"
          onClick={() => (window.history.length > 1 ? router.back() : router.push("/m"))}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F4F6F8] text-[#172B3A]"
        >
          <ArrowLeftIcon size={20} />
        </button>
        <div className="flex min-w-0 flex-col">
          <h1 className="truncate text-[17px] font-bold leading-[22px] tracking-[-0.01em] text-[#172B3A]">{title}</h1>
          {subtitle && <p className="truncate text-[12px] leading-4 text-[#68788A]">{subtitle}</p>}
        </div>
      </div>
      {children}
      {tabBar && <MobileTabBar />}
    </div>
  );
}

export function HubSection({ title, href }: { title: string; href?: string }) {
  return (
    <div className="flex h-[26px] items-center justify-between px-4 pb-3 pt-6 box-content">
      <h2 className="text-[20px] font-bold leading-[26px] tracking-[-0.02em] text-[#172B3A]">{title}</h2>
      {href && (
        <Link href={href} className="flex items-center gap-0.5 text-[13px] leading-4 text-[#C81E57]">
          See all
          <ChevronRightIcon size={16} />
        </Link>
      )}
    </div>
  );
}
