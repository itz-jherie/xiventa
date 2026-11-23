"use client";

import { useSyncExternalStore } from "react";

/**
 * What a person did with a ticket after buying it (flow 3), kept on this device so the static
 * pages remember it: a transfer waiting to be accepted, a refund request, an open case, a rating
 * and reminder choices. Keyed by ticket id (/my-events/<id>).
 */
export interface AfterTicket {
  transfer?: { to: string; name?: string; qty: number; sentAt: number };
  refund?: { reason: string; note: string; amount: number; at: number };
  case?: { reason: string; note: string; at: number };
  review?: { stars: number; text: string };
  reminders?: string[];
}

const KEY = "xiventa_after_ticket";
const EVT = "xiventa-after-ticket";

let cachedRaw: string | null | undefined;
let cached: Record<string, AfterTicket> = {};

function read(): Record<string, AfterTicket> {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {}
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cached = raw ? JSON.parse(raw) : {};
    } catch {
      cached = {};
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

const EMPTY: AfterTicket = {};

export function useAfterTicket(id: string): AfterTicket {
  return useSyncExternalStore(subscribe, () => read()[id] ?? EMPTY, () => EMPTY);
}

/** Merge a change for one ticket. Pass `undefined` for a key to clear it. */
export function updateAfterTicket(id: string, patch: Partial<AfterTicket>) {
  const all = { ...read() };
  const next: AfterTicket = { ...(all[id] ?? {}), ...patch };
  (Object.keys(next) as (keyof AfterTicket)[]).forEach((k) => next[k] === undefined && delete next[k]);
  all[id] = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(all));
    window.dispatchEvent(new Event(EVT));
  } catch {}
}

/** "Sat 25 Oct, 11:40 PM" for a timestamp. */
export function stamp(ms: number) {
  const d = new Date(ms);
  const day = d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }).replace(",", "");
  const h = d.getHours();
  return `${day}, ${h % 12 || 12}:${String(d.getMinutes()).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}

/** The order code shown on order pages: the first two groups of the ticket code ("XV 7TGT"). */
export const orderCode = (code: string) => code.split(" ").slice(0, 2).join(" ");
