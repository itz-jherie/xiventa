"use client";

import { useSyncExternalStore } from "react";
import { getEventBySlug } from "@/data";

/**
 * Organizer app sample data and host actions (flow 7a, OM01 to OM33). Static stand-in: what a host
 * does (check ins, approvals, staff, hours) is kept on this device in localStorage `xiventa_host`.
 */

export type HostedStatus = "upcoming" | "draft" | "live" | "ended";

export interface Hosted {
  id: string;
  title: string;
  date: string;
  when: string;
  venue: string;
  image: string;
  status: HostedStatus;
  kind: "paid" | "free" | "listing";
  sold: number;
  capacity: number;
  came?: number;
  revenue: number;
  recurring?: string;
  /** Slug of the public event page */
  slug?: string;
}

const img = (slug: string) => getEventBySlug(slug)?.imageUrl ?? "";

export const HOSTED: Hosted[] = [
  { id: "friday-rush", slug: "friday-rush", title: "Friday Rush", date: "Fri 24 Oct, 10 PM", when: "Fri 24 Oct, 10 PM · On sale", venue: "Skyline Lounge", image: img("friday-rush"), status: "upcoming", kind: "paid", sold: 186, capacity: 250, revenue: 2790000, recurring: "Every Friday" },
  { id: "abnormal-nightout", slug: "abnormal-nightout", title: "The Abnormal Nightout", date: "Sat 25 Oct, 9 PM", when: "Sat 25 Oct, 9 PM · On sale", venue: "Skyline Lounge", image: img("abnormal-nightout"), status: "upcoming", kind: "paid", sold: 142, capacity: 300, revenue: 2130000 },
  { id: "sunday-sundowner", slug: "sunday-sundowner", title: "Sunday Sundowner", date: "Sun 2 Nov, 4 PM", when: "Sun 2 Nov, 4 PM · On sale", venue: "Skyline Lounge", image: img("sunday-sundowner"), status: "upcoming", kind: "paid", sold: 38, capacity: 120, revenue: 304000 },
  { id: "afro-night-market", title: "Afro Night Market", date: "Sat 1 Nov, 7 PM", when: "Sat 1 Nov, 7 PM · Listing, tickets on Instagram", venue: "Skyline Lounge", image: img("connect-lagos"), status: "upcoming", kind: "listing", sold: 0, capacity: 0, revenue: 0 },
  { id: "day-party", title: "Day Party at the Beach", date: "Sat 1 Nov, 3 PM", when: "Sat 1 Nov, 3 PM · Draft", venue: "Elegushi Beach", image: img("jersey-creek-picnic"), status: "draft", kind: "paid", sold: 0, capacity: 200, revenue: 0 },
  { id: "friday-rush-17", slug: "friday-rush", title: "Friday Rush, 17 Oct", date: "Fri 17 Oct, 10 PM", when: "Fri 17 Oct · Ended", venue: "Skyline Lounge", image: img("friday-rush"), status: "ended", kind: "paid", sold: 80, capacity: 250, came: 74, revenue: 1200000 },
  { id: "sunday-sundowner-12", slug: "sunday-sundowner", title: "Sunday Sundowner", date: "Sun 12 Oct, 4 PM", when: "Sun 12 Oct · Ended", venue: "Skyline Lounge", image: img("sunday-sundowner"), status: "ended", kind: "paid", sold: 120, capacity: 120, came: 106, revenue: 960000 },
  { id: "hangover-friday", slug: "hangover-friday", title: "Hangover Friday", date: "Fri 10 Oct, 11 PM", when: "Fri 10 Oct · Ended", venue: "Skyline Lounge", image: img("hangover-friday"), status: "ended", kind: "paid", sold: 250, capacity: 250, came: 212, revenue: 2500000 },
];

export const getHosted = (id: string) => HOSTED.find((h) => h.id === id);

export interface Attendee {
  id: string;
  name: string;
  initials: string;
  ticket: string;
  qty: number;
  order: string;
  /** How many of the tickets are checked in */
  inCount: number;
  refunded?: boolean;
}

export const ATTENDEES: Attendee[] = [
  { id: "a1", name: "Ada Okafor", initials: "AO", ticket: "Regular", qty: 2, order: "XV 7TGT", inCount: 0 },
  { id: "a2", name: "Tunde Bello", initials: "TB", ticket: "VIP", qty: 1, order: "XV 8KQ2", inCount: 1 },
  { id: "a3", name: "Chiamaka Nwosu", initials: "CN", ticket: "Regular", qty: 4, order: "XV 2MZD", inCount: 2 },
  { id: "a4", name: "Ibrahim Adamu", initials: "IA", ticket: "Early bird", qty: 1, order: "XV 9PLA", inCount: 1 },
  { id: "a5", name: "Funmi Eze", initials: "FE", ticket: "Regular", qty: 1, order: "XV 4RTS", inCount: 0 },
  { id: "a6", name: "Kunle Ojo", initials: "KO", ticket: "VIP", qty: 2, order: "XV 6WNB", inCount: 0, refunded: true },
  { id: "a7", name: "Adaeze Eze", initials: "AE", ticket: "VIP", qty: 1, order: "XV 3HJK", inCount: 1 },
  { id: "a8", name: "Ada Bello", initials: "AB", ticket: "Regular", qty: 1, order: "XV 9QWE", inCount: 0 },
];

export interface HostRequest {
  id: string;
  name: string;
  initials: string;
  kind: "Refund" | "Transfer";
  ticket: string;
  amount?: number;
  left: string;
  message: string;
}

export const REQUESTS: HostRequest[] = [
  { id: "r1", name: "Ada Okafor", initials: "AO", kind: "Refund", ticket: "Regular × 2", amount: 31500, left: "2 days left", message: "Not let in with a valid ticket. The gate said the scanner was down." },
  { id: "r2", name: "Funmi Eze", initials: "FE", kind: "Transfer", ticket: "Regular × 1", left: "5 days left", message: "Can I move my ticket to my sister? I can no longer make it." },
];
export const DONE_REQUESTS = [
  { name: "Kunle Ojo", initials: "KO", line: "Refund · ₦90,000", status: "Declined" },
  { name: "Bola Uche", initials: "BU", line: "Refund · ₦15,000", status: "Xiventa decided" },
  { name: "Chidi Obi", initials: "CO", line: "Transfer · VIP × 1", status: "Allowed" },
];

export const PROFILES = [
  { id: "south-circle", name: "South Circle", initials: "SC", kind: "Business · Owner" },
  { id: "self", name: "Yemi Ogun", initials: "YO", kind: "Personal" },
  { id: "skyline", name: "Skyline Lounge", initials: "SL", kind: "Business · Owner", verifiedPlace: true },
  { id: "loc", name: "Lagos Outdoor Club", initials: "LO", kind: "Invited you as Manager", invite: true },
];

export const VENUE_REQUESTS = [
  { id: "v1", slug: "ballers-night", title: "Ballers Night", date: "Sat 8 Nov, 9 PM", host: "South Circle", price: "₦20,000", sent: "Sent today", image: img("abnormal-nightout") },
  { id: "v2", slug: "ladies-night", title: "Ladies Night", date: "Fri 7 Nov, 9 PM", host: "Ife Events", price: "Free", sent: "Sent yesterday", image: img("friday-rush") },
];

export const PLACE_REVIEWS = [
  { id: "pr1", name: "Bisi K.", initials: "BK", when: "Yesterday", stars: 3, text: "Nice space but parking was full by 8 PM. The valet helped in the end." },
  { id: "pr2", name: "Emeka U.", initials: "EU", when: "2 days ago", stars: 5, text: "Came for a birthday and they set up a table with no fuss. Will be back." },
  { id: "pr3", name: "Tolu A.", initials: "TA", when: "2 weeks ago", stars: 4, text: "Lovely view at sunset and the cocktails are worth it. Gets loud after 10 PM.", reply: "Thank you, Tolu. Fridays are busy, so book a table if you want a quieter corner." },
];

/* ------------------------------------------------------------------ host actions store */

export interface HostState {
  acting: string;
  /** Profile picked on the web dashboard (OW46); the app keeps its own (OM20) */
  webActing: string;
  checkedIn: Record<string, number>;
  requests: Record<string, "approved" | "declined">;
  staff: { phone: string; gate?: string; invited: true }[];
  team: { phone: string; role: string }[];
  cancelled: string[];
  venueRequests: Record<string, "accepted" | "declined">;
  replies: Record<string, string>;
  hours?: [string, string][];
  specialDays: { date: string; hours: string; note: string }[];
  closedForNow: boolean;
  amenities?: string[];
  promoters: Record<string, "approved" | "declined">;
  clipRemoved: string[];
  place?: { name: string; status: "review" | "live" };
}

const EMPTY: HostState = { acting: "skyline", webActing: "south-circle", checkedIn: {}, requests: {}, staff: [], team: [], cancelled: [], venueRequests: {}, replies: {}, specialDays: [], closedForNow: false, promoters: {}, clipRemoved: [] };
const KEY = "xiventa_host";
const EVT = "xiventa-host";
let cachedRaw: string | null | undefined;
let cached: HostState = EMPTY;

function read(): HostState {
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

export function useHost(): HostState {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function updateHost(patch: Partial<HostState> | ((s: HostState) => Partial<HostState>)) {
  const s = read();
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...s, ...(typeof patch === "function" ? patch(s) : patch) }));
    window.dispatchEvent(new Event(EVT));
  } catch {}
}

/** Checked-in count for an attendee, after any check ins made on this device. */
export const inCount = (s: HostState, a: Attendee) => s.checkedIn[a.id] ?? a.inCount;

export const naira = (n: number) => `₦${n.toLocaleString("en-NG")}`;

/* ------------------------------------------------------------------ events published on this device (flow 6) */

let pubRaw: string | null | undefined;
let pubCached: Hosted[] = [];
const NONE: Hosted[] = [];

function readPublished(): Hosted[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem("xiventa_hosted");
  } catch {}
  if (raw !== pubRaw) {
    pubRaw = raw;
    try {
      const list = (raw ? JSON.parse(raw) : []) as { name: string; date: string; start: string; venue: string; kind: Hosted["kind"]; publishedAt: number; repeat?: string; tickets?: { qty?: number }[] }[];
      pubCached = list.map((d) => ({
        id: `p${d.publishedAt}`,
        title: d.name || "Untitled event",
        date: [d.date, d.start].filter(Boolean).join(", "),
        when: `${[d.date, d.start].filter(Boolean).join(", ")} · ${d.kind === "listing" ? "Listing in review" : "On sale"}`,
        venue: d.venue || "Venue to be added",
        image: img("connect-lagos"),
        status: "upcoming" as const,
        kind: d.kind,
        sold: 0,
        capacity: (d.tickets ?? []).reduce((n, t) => n + (t.qty ?? 0), 0),
        revenue: 0,
        recurring: d.repeat && d.repeat !== "Does not repeat" ? d.repeat : undefined,
      }));
    } catch {
      pubCached = [];
    }
  }
  return pubCached;
}

/** Hosted events: the ones published on this device first, then the samples. */
export function useHosted(): Hosted[] {
  const pub = useSyncExternalStore(subscribe, readPublished, () => NONE);
  return pub.length ? [...pub, ...HOSTED] : HOSTED;
}
