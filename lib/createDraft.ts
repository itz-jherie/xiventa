"use client";

import { useSyncExternalStore } from "react";

/**
 * The event someone is creating (flow 6, EC01 to EC27), kept on this device until they publish.
 * Static stand-in: "reading the flyer" fills in sample details for the kind of event chosen.
 */

export type EventKind = "free" | "paid" | "listing";
export type Format = "in-person" | "virtual" | "live" | "hybrid";
export type JoinMode = "open" | "request" | "invite";

export interface PricePhase {
  name: string;
  price: number;
  ends?: string;
  cap?: number;
}

export interface DraftTicket {
  id: string;
  kind: "standard" | "table";
  name: string;
  /** One phase = one price. More phases = the price goes up over time (EC09, EC25). */
  phases: PricePhase[];
  qty: number;
  window: string;
  maxPerOrder: number;
  seats?: number;
  names: boolean;
  fee: "guests" | "host";
  note?: string;
  mode?: "in-person" | "online";
}

export interface Host {
  id: string;
  name: string;
  initials: string;
  kind: string;
  role?: string;
  /** Verified to sell tickets under this name */
  verified: boolean;
  verifiedPlace?: boolean;
}

export interface Draft {
  kind: EventKind;
  hostId: string;
  flyer: "none" | "uploaded" | "read" | "by-hand";
  flyerUrl?: string;
  name: string;
  format: Format;
  categories: string[];
  date: string;
  start: string;
  end?: string;
  repeat: string;
  repeatEnds: string;
  age: number | null;
  venue: string;
  hideAddress: boolean;
  join: JoinMode;
  freeTickets: boolean;
  limit: boolean;
  spots: number;
  online: { platform: "Google Meet" | "Zoom"; link: string; passcode: string };
  live: { platform: "Instagram Live" | "TikTok Live" | "YouTube Live"; handle: string };
  tickets: DraftTicket[];
  listing: { ig: "none" | "connected"; post: string; low: number; high: number };
  details: { dress: string; parking: string; security: string; bring: string; access: string[] };
  clip: boolean;
  /** New host verification (EC10 to EC12) */
  verify: { type?: string; profile?: string; bank?: string; account?: string; status: "none" | "verified" | "review" };
  /** Group check for a host that is not verified yet (EC11 / EC12 Group check) */
  groupCheck: "none" | "pending";
  /** Preview someone with no verified host profile yet (/create?host=new) */
  newHost: boolean;
  publishedAt?: number;
}

/** Host profiles for the sample account (EC20). `?host=new` previews someone who has none yet. */
export const HOSTS: Host[] = [
  { id: "self", name: "Ada Okafor", initials: "AO", kind: "Hosting as yourself", verified: true },
  { id: "loc", name: "Lagos Outdoor Club", initials: "LO", kind: "Community", role: "Owner", verified: true },
  { id: "skyline", name: "Skyline Lounge", initials: "SL", kind: "Business", role: "Owner", verified: true, verifiedPlace: true },
  { id: "grace", name: "Grace Assembly Lekki", initials: "GA", kind: "Institution", role: "Manager", verified: false },
];
export const NEW_HOST: Host = { id: "self", name: "Ada Okafor", initials: "AO", kind: "Hosting as yourself", verified: false };

const BASE: Draft = {
  kind: "free",
  hostId: "loc",
  flyer: "none",
  name: "",
  format: "in-person",
  categories: [],
  date: "",
  start: "",
  repeat: "Does not repeat",
  repeatEnds: "No end date",
  age: null,
  venue: "",
  hideAddress: false,
  join: "open",
  freeTickets: false,
  limit: false,
  spots: 150,
  online: { platform: "Zoom", link: "", passcode: "" },
  live: { platform: "Instagram Live", handle: "" },
  tickets: [],
  listing: { ig: "none", post: "", low: 0, high: 0 },
  details: { dress: "", parking: "", security: "", bring: "", access: [] },
  clip: false,
  verify: { status: "none" },
  groupCheck: "none",
  newHost: false,
};

/** What "reading the flyer" fills in, per kind of event (EC24 Reading, EC03 Filled in from your flyer). */
export function fromFlyer(kind: EventKind): Partial<Draft> {
  if (kind === "paid")
    return {
      name: "The Abnormal Nightout",
      categories: ["Nightlife & Parties", "Music"],
      date: "Sat 25 Oct",
      start: "9 PM",
      age: 18,
      venue: "Skyline Lounge, Victoria Island",
      tickets: [
        {
          id: "regular",
          kind: "standard",
          name: "Regular",
          phases: [
            { name: "Early bird", price: 10000, ends: "Thu 23 Oct, 11:59 PM", cap: 100 },
            { name: "Regular", price: 15000, ends: "Sun 26 Oct, 1 AM" },
            { name: "Late", price: 20000 },
          ],
          qty: 250,
          window: "Now until Sun 26 Oct, 4 AM",
          maxPerOrder: 6,
          names: false,
          fee: "guests",
        },
        { id: "vip", kind: "standard", name: "VIP", phases: [{ name: "Price", price: 45000 }], qty: 50, window: "Now until Sun 26 Oct, 4 AM", maxPerOrder: 4, names: true, fee: "guests", note: "Fast track entry and the VIP area." },
        { id: "table", kind: "table", name: "VIP Table", phases: [{ name: "Price", price: 450000 }], qty: 8, window: "Now until Sat 25 Oct, 10 PM", maxPerOrder: 1, seats: 6, names: true, fee: "guests", note: "Two bottles and mixers." },
      ],
    };
  if (kind === "listing")
    return { name: "Afro Night Market", categories: ["Food & Drink", "Music"], date: "Sat 1 Nov", start: "6 PM", venue: "Skyline Lounge, Victoria Island", listing: { ig: "connected", post: "Afro Night Market · posted 2 days ago", low: 10000, high: 50000 } };
  return { name: "Jersey Creek Picnic", categories: ["Outdoors & Travel"], date: "Sun 26 Oct", start: "1 PM", venue: "Lagoon Park, Lagos Island" };
}

const KEY = "xiventa_draft";
const EVT = "xiventa-draft";
let cachedRaw: string | null | undefined;
let cached: Draft = BASE;

function read(): Draft {
  let raw: string | null = null;
  try {
    raw = sessionStorage.getItem(KEY);
  } catch {}
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cached = raw ? { ...BASE, ...JSON.parse(raw) } : BASE;
    } catch {
      cached = BASE;
    }
  }
  return cached;
}

function subscribe(cb: () => void) {
  window.addEventListener(EVT, cb);
  return () => window.removeEventListener(EVT, cb);
}

/** The draft on the client; `null` while prerendering. */
export function useDraft(): Draft | null {
  return useSyncExternalStore(subscribe, read, () => null);
}

export function updateDraft(patch: Partial<Draft> | ((d: Draft) => Partial<Draft>)) {
  const d = read();
  const next = { ...d, ...(typeof patch === "function" ? patch(d) : patch) };
  try {
    sessionStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // A big flyer image can fill sessionStorage; keep everything else.
    try {
      sessionStorage.setItem(KEY, JSON.stringify({ ...next, flyerUrl: undefined }));
    } catch {}
  }
  window.dispatchEvent(new Event(EVT));
}

export function startDraft(kind: EventKind, newHost = false) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ ...BASE, kind, newHost, hostId: newHost ? "self" : kind === "paid" ? "skyline" : "loc" }));
  } catch {}
  window.dispatchEvent(new Event(EVT));
}

export const hostOf = (d: Draft): Host =>
  d.newHost ? { ...NEW_HOST, verified: d.verify.status === "verified", name: d.verify.profile ?? NEW_HOST.name } : (HOSTS.find((h) => h.id === d.hostId) ?? HOSTS[0]);

/** Paid events have a Tickets step (Step 4 of 4); free and listings have three steps. */
export const stepCount = (d: Draft) => (d.kind === "paid" ? 4 : 3);

export const naira = (n: number) => `₦${n.toLocaleString("en-NG")}`;
export const lowestPrice = (d: Draft) => Math.min(...d.tickets.flatMap((t) => t.phases.map((p) => p.price)).filter((p) => p > 0), Infinity);

/** Can this draft be published right now? Paid events need a verified host (EC14 Paid, new host). */
export function needsVerification(d: Draft) {
  return d.kind === "paid" && d.newHost && d.verify.status !== "verified";
}

/** Paid event under a group whose checks have not passed (EC14 Paid, group in checks). */
export const needsGroupCheck = (d: Draft) => d.kind === "paid" && !d.newHost && !hostOf(d).verified && d.groupCheck === "none";

/** Published events from this device (for the hosting tools in flow 7). */
export function publishDraft() {
  const d = read();
  const done = { ...d, publishedAt: Date.now(), flyerUrl: undefined };
  try {
    const all = JSON.parse(localStorage.getItem("xiventa_hosted") ?? "[]");
    localStorage.setItem("xiventa_hosted", JSON.stringify([done, ...all].slice(0, 20)));
  } catch {}
  updateDraft({ publishedAt: done.publishedAt });
}

/** The event page state a draft would show (EC15 Preview uses the real event page). */
export function previewState(d: Draft): string {
  if (d.kind === "listing") return "instagram";
  if (d.format === "live") return "live";
  if (d.format === "hybrid") return "hybrid";
  if (d.format === "virtual") return "virtual";
  if (d.kind === "paid") return "paid";
  if (d.join === "invite") return "invite";
  if (d.join === "request") return "request";
  if (d.freeTickets) return d.limit ? "free-limited" : "free-ticket";
  return "free-going";
}
