"use client";

import { useSyncExternalStore } from "react";

/**
 * Places side of "your stuff" (flow 4), kept on this device: planned visits (AM65 / PW47), places
 * marked Been here, place reviews (PW46) and suggestions (AM80 / PW48).
 */
export interface PlannedVisit {
  slug: string;
  /** Local date, YYYY-MM-DD */
  date: string;
  /** "9 PM" */
  time: string;
  /** "Sat 29 Nov, 9 PM" */
  label: string;
}

export interface VisitState {
  plans: PlannedVisit[];
  /** Slugs marked Been here (added on top of the sample list) */
  been: string[];
  /** Sample plans the person answered (Yes, I went / Not yet) */
  answered: string[];
  reviews: Record<string, { stars: number; text: string }>;
  suggestions: { name: string; at: number }[];
}

const KEY = "xiventa_visits";
const EVT = "xiventa-visits";
const EMPTY: VisitState = { plans: [], been: [], answered: [], reviews: {}, suggestions: [] };

let cachedRaw: string | null | undefined;
let cached: VisitState = EMPTY;

function read(): VisitState {
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

export function useVisits(): VisitState {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

function write(next: VisitState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(EVT));
  } catch {}
}

export function savePlan(plan: PlannedVisit) {
  const s = read();
  write({ ...s, plans: [plan, ...s.plans.filter((p) => p.slug !== plan.slug)], answered: s.answered.filter((x) => x !== plan.slug) });
}

/** "Did you go?" answer. Yes moves the place to Been here; either way the plan is done. */
export function answerPlan(slug: string, went: boolean) {
  const s = read();
  write({
    ...s,
    plans: s.plans.filter((p) => p.slug !== slug),
    answered: [...s.answered.filter((x) => x !== slug), slug],
    been: went ? [...s.been.filter((x) => x !== slug), slug] : s.been,
  });
}

export function setBeen(slug: string, on: boolean) {
  const s = read();
  write({ ...s, been: on ? [...s.been.filter((x) => x !== slug), slug] : s.been.filter((x) => x !== slug) });
}

export function saveReview(slug: string, review: { stars: number; text: string }) {
  const s = read();
  write({ ...s, reviews: { ...s.reviews, [slug]: review } });
}

export function saveSuggestion(name: string) {
  const s = read();
  write({ ...s, suggestions: [{ name, at: Date.now() }, ...s.suggestions] });
}

/* ------------------------------------------------------------- dates and opening hours */

export const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const isoDate = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** "Sat 29 Nov" */
export const shortDay = (d: Date) => d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }).replace(",", "");

/** "9 PM" -> minutes after midnight */
export function minutesOf(t: string) {
  const m = t.match(/(\d+)(?::(\d+))?\s*(AM|PM)/i);
  if (!m) return 0;
  return ((+m[1] % 12) + (m[3].toUpperCase() === "PM" ? 12 : 0)) * 60 + (m[2] ? +m[2] : 0);
}

/** Is a place open at `time` given that day's hours ("4 PM to 2 AM" or "Closed")? */
export function openAt(hours: string, time: string) {
  if (/closed/i.test(hours)) return false;
  const [a, b] = hours.split(" to ");
  const open = minutesOf(a);
  let close = minutesOf(b ?? "11:59 PM");
  if (close <= open) close += 24 * 60;
  const t = minutesOf(time);
  return (t >= open && t < close) || (t + 1440 >= open && t + 1440 < close);
}

/** True once the planned day has passed (the "Did you go?" day after). */
export const isPast = (date: string, today: Date) => date < isoDate(today);
