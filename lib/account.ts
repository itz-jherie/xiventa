"use client";

import { useSyncExternalStore } from "react";

/**
 * Account settings for flow 5 (AM43 to AM69, PW15, PW26), kept on this device. Static stand-in:
 * nothing is sent anywhere.
 */
export interface Settings {
  /** AM45 "Your choice" switches */
  notify: Record<"reminders" | "waitlist" | "picks" | "roundup" | "hosts", boolean>;
  quiet: { on: boolean; from: string; to: string };
  /** AM46 Event picks and offers */
  offers: boolean;
  /** AM56 signals */
  signals: { saves: boolean; going: boolean };
  /** AM69 */
  locationAccess: "While using the app" | "Only when I ask" | "Never";
  askWhenNew: boolean;
  places: { label: string; area: string }[];
  /** AM48: hosts you stopped following */
  unfollowed: string[];
  /** PW26 */
  cookies: { decided: boolean; analytics: boolean; marketing: boolean };
  /** AM57 Download my data */
  dataRequested: boolean;
  /** AM42 read state */
  notificationsSeen: boolean;
  /** PW15 Email updates */
  emailUpdates: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  notify: { reminders: true, waitlist: true, picks: true, roundup: true, hosts: false },
  quiet: { on: true, from: "10 PM", to: "7 AM" },
  offers: true,
  signals: { saves: true, going: true },
  locationAccess: "While using the app",
  askWhenNew: true,
  places: [
    { label: "Home", area: "Yaba, Mainland" },
    { label: "Work", area: "Victoria Island, Island" },
  ],
  unfollowed: [],
  cookies: { decided: false, analytics: false, marketing: false },
  dataRequested: false,
  notificationsSeen: false,
  emailUpdates: true,
};

const KEY = "xiventa_settings";
const EVT = "xiventa-settings";
let cachedRaw: string | null | undefined;
let cached: Settings = DEFAULT_SETTINGS;

function read(): Settings {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {}
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cached = raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
    } catch {
      cached = DEFAULT_SETTINGS;
    }
  }
  return cached;
}

function subscribe(cb: () => void) {
  window.addEventListener(EVT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVT, cb);
    window.removeEventListener("storage", cb);
  };
}

/** Settings on the client; defaults while prerendering. `ready` is false until the device copy is read. */
export function useSettings(): Settings & { ready: boolean } {
  const s = useSyncExternalStore(subscribe, read, () => null);
  return { ...(s ?? DEFAULT_SETTINGS), ready: s !== null };
}

export function updateSettings(patch: Partial<Settings>) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...read(), ...patch }));
    window.dispatchEvent(new Event(EVT));
  } catch {}
}
