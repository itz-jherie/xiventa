"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { CloseIcon } from "@/components/icons";
import { requestInstall, useInstall } from "@/lib/pwa";

const SNOOZE_KEY = "xiventa_install_snoozed_until";
const SNOOZE_DAYS = 7; // same as the App Banner close rule (rule 19)
const SHOW_AFTER_MS = 2500;

/** Never on sign in or checkout: nothing pulls a buyer away (rule 19). */
const HIDDEN_ON = [/^\/checkout/, /^\/pay/, /^\/events\/[^/]+\/(tickets|checkout|review|pay|confirmed|request|waitlist)/, /^\/welcome/, /^\/login/, /^\/code/, /^\/name/, /^\/location/, /^\/side-of-lagos/, /^\/interests/, /^\/launch/, /^\/offline/, /^\/dashboard/, /^\/splash/, /^\/signout/, /^\/t\//, /^\/my-events\/[^/]+\/(reminders|send|refund|review)/, /^\/suggest-place/, /^\/places\/[^/]+\/(plan|menu)/, /^\/account\//, /^\/help\/case/, /^\/create/, /^\/host/, /^\/admin/];

function snoozed() {
  try {
    return Number(localStorage.getItem(SNOOZE_KEY) ?? 0) > Date.now();
  } catch {
    return false;
  }
}

function snooze() {
  try {
    localStorage.setItem(SNOOZE_KEY, String(Date.now() + SNOOZE_DAYS * 86400000));
  } catch {}
}

/**
 * Install prompt toast, styled as the Figma `Toast` (Tone=Info, 43:131): #172B3A, radius 12.
 * Shows on phones (and anywhere the browser offers one tap install) a moment after the page loads.
 * Install: system "Add to Home screen" dialog where available, otherwise the step by step sheet.
 * Not now: hidden for 7 days. Never shown inside the installed app.
 * Add ?install=1 to a URL to show it straight away for testing.
 */
export function InstallToast() {
  const pathname = usePathname();
  const { standalone, canPrompt, installed, platform } = useInstall();
  const [ready, setReady] = useState(false);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    const forced = new URLSearchParams(location.search).has("install");
    if (snoozed() && !forced) return;
    const t = setTimeout(() => setReady(true), forced ? 300 : SHOW_AFTER_MS);
    return () => clearTimeout(t);
  }, []);

  const relevant = canPrompt || platform !== "desktop";
  if (!ready || closed || standalone || installed || !relevant) return null;
  if (HIDDEN_ON.some((re) => re.test(pathname))) return null;

  const notNow = () => {
    snooze();
    setClosed(true);
  };

  const install = async () => {
    const result = await requestInstall();
    if (result === "dismissed") snooze();
    setClosed(true);
  };

  // Sit above the app tab bar (68 high + 16 gap) on tab screens, above the 93 px Bottom Action Bar
  // on event and place pages (phones only), otherwise 16 from the bottom.
  const tabScreen = ["/m", "/my-events", "/my-places", "/spotlight"].includes(pathname);
  const actionBar = /^\/(events|places)\/[^/]+$/.test(pathname);
  const bottom = tabScreen ? 100 : actionBar ? 105 : 16;

  return (
    <div
      role="dialog"
      aria-label="Install Xiventa"
      className="fixed left-1/2 z-[90] w-[calc(100%-32px)] max-w-[358px] -translate-x-1/2 animate-[toast-in_240ms_ease-out]"
      style={{ bottom: `calc(${bottom}px + env(safe-area-inset-bottom))` }}
      data-action-bar={actionBar || undefined}
    >
      <div className="flex items-center gap-3 rounded-[12px] bg-[#172B3A] px-4 py-3 shadow-[0_12px_32px_rgba(23,43,58,0.16)]">
        <Image src="/icons/icon-192.png" alt="" width={32} height={32} className="shrink-0 rounded-[8px]" />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-[14px] leading-5 text-white">Add Xiventa to your home screen</span>
          <span className="text-[12px] leading-4 text-[#B4BFCA]">Tickets on your phone, even offline.</span>
        </div>
        <button type="button" onClick={install} className="flex h-8 shrink-0 items-center rounded-[8px] bg-[#E22765] px-3 text-[13px] leading-4 text-white">
          {canPrompt ? "Install" : "Add"}
        </button>
        <button type="button" onClick={notNow} aria-label="Not now" className="shrink-0 text-[#B4BFCA]">
          <CloseIcon size={20} />
        </button>
      </div>
    </div>
  );
}
