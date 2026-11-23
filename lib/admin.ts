"use client";

import { useSyncExternalStore } from "react";

/**
 * Admin stand-in (flow 8). Staff sign in and every decision made in the admin are kept in this browser
 * (localStorage `xiventa_admin`). Decisions are also written to the audit log shown in AW27.
 */
export interface AdminState {
  signedIn: boolean;
  name: string;
  role: string;
  /** record id → decision label ("Approved", "Rejected", "Restricted"…) */
  decisions: Record<string, string>;
  audit: [string, string, string, string][];
  config: Record<string, string>;
  toggles: Record<string, boolean>;
}

const EMPTY: AdminState = { signedIn: false, name: "Kemi Adebayo", role: "Operations admin", decisions: {}, audit: [], config: {}, toggles: {} };
const KEY = "xiventa_admin";
const EVT = "xiventa-admin";
let cachedRaw: string | null | undefined;
let cached: AdminState = EMPTY;

function read(): AdminState {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {}
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cached = raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
    } catch {
      cached = EMPTY;
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

/** `undefined` until the browser has been read (server render and the first client render). */
export function useAdmin(): AdminState | undefined {
  return useSyncExternalStore(subscribe, read, () => undefined);
}

export function updateAdmin(patch: Partial<AdminState> | ((s: AdminState) => Partial<AdminState>)) {
  const s = read();
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...s, ...(typeof patch === "function" ? patch(s) : patch) }));
    window.dispatchEvent(new Event(EVT));
  } catch {}
}

function stamp() {
  const d = new Date();
  return `${d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }).replace(",", "")}, ${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
}

/** Record a decision on a record and add it to the audit log. */
export function decide(id: string, label: string, action: string, record: string) {
  updateAdmin((s) => ({ decisions: { ...s.decisions, [id]: label }, audit: [[stamp(), s.name, action, record] as [string, string, string, string], ...s.audit].slice(0, 50) }));
}

export const adminSignIn = () => updateAdmin({ signedIn: true });
export const adminSignOut = () => updateAdmin({ signedIn: false });
