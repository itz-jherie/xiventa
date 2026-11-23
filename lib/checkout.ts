"use client";

import { useSyncExternalStore } from "react";
import type { XiventaEvent } from "@/data";

/** Rule 0: every number is an admin setting. These are the launch defaults. */
export const CHECKOUT_SETTINGS = {
  serviceFeeRate: 0.05, // ₦1,500 on ₦30,000 in AM30 / PW11
  holdMinutes: 10, // PW12 Time's up: "We kept your tickets for 10 minutes"
  maxPerTier: 6, // AM28: "Up to 6 tickets each"
  maxFreePerPerson: 4, // AM28 Free: "Up to 4 per person"
  transferMinutes: 30, // PW40 account expiry
};

export interface CheckoutTier {
  id: string;
  name: string; // upper-case label, e.g. "REGULAR"
  label: string; // readable, e.g. "Regular"
  price: number;
  description: string;
  max: number;
  soldOut?: boolean;
  mode?: "in-person" | "online";
}

const naira = (n: number) => `₦${n.toLocaleString("en-NG")}`;
export const money = (n: number) => (n === 0 ? "Free" : naira(n));

/** Ticket types for each event, from AM28 / PW10 and their variants. */
export function tiersFor(e: XiventaEvent): CheckoutTier[] {
  const t = (id: string, name: string, price: number, description: string, extra: Partial<CheckoutTier> = {}): CheckoutTier => ({
    id,
    name,
    label: name.length <= 3 ? name : name.charAt(0) + name.slice(1).toLowerCase(),
    price,
    description,
    max: CHECKOUT_SETTINGS.maxPerTier,
    ...extra,
  });
  switch (e.slug) {
    case "abnormal-nightout":
      return [
        t("early", "EARLY BIRD", 10000, "Cheaper entry before 10 PM.", { soldOut: true }),
        t("regular", "REGULAR", 15000, "Early bird sold out. Entry and dance floor."),
        t("vip", "VIP", 45000, "Fast track entry, VIP area and one welcome drink. Goes up to ₦55,000 at 1 AM."),
        t("table", "VIP TABLE", 450000, "Seats 6. Two bottles, mixers and a reserved table by the DJ.", { max: 2, label: "VIP table" }),
      ];
    case "friday-rush":
    case "the-backyard-party":
      return [
        t("regular", "REGULAR", e.priceValue || 15000, "Entry for one date only."),
        t("table", "VIP TABLE", 300000, "Seats 6. Bottles and a table by the DJ.", { max: 2, label: "VIP table" }),
      ];
    case "connect-lagos":
      return [
        t("standard", "STANDARD", 5000, "Online. The Zoom link and passcode come with your ticket.", { mode: "online" }),
        t("workshop", "WORKSHOP PASS", 15000, "The talks plus the workshop room after. 30 spots.", { mode: "online", label: "Workshop pass" }),
      ];
    case "emerging-leaders-forum":
      return [
        t("in-person", "IN PERSON", 15000, `At ${e.venueName}, ${e.neighborhood}. QR code entry.`, { mode: "in-person", label: "In person" }),
        t("online", "ONLINE", 5000, "On Zoom. The join link is in your ticket.", { mode: "online" }),
      ];
    case "supper-at-the-secret-garden":
      return [t("seat", "INVITE SEAT", 25000, "Four courses and a wine pairing. Up to 2 seats per invite.", { max: 2, label: "Invite seat" })];
  }
  if (e.isFree)
    return [t("free", "FREE TICKET", 0, "Entry to the event. Each ticket has its own QR code for the gate.", { max: CHECKOUT_SETTINGS.maxFreePerPerson, label: "Free ticket" })];
  if (e.tiers?.length)
    return e.tiers.map((tier, i) => {
      const price = Number(tier.price.replace(/[^\d]/g, "")) || e.priceValue;
      return t(`t${i}`, tier.name, price, tier.description);
    });
  return [t("regular", "REGULAR", e.priceValue, "General admission.")];
}

export interface Cart {
  slug: string;
  qty: Record<string, number>;
  date?: string;
  name: string;
  phone: string;
  email: string;
  guests: string[];
  method: "card" | "transfer" | "ussd";
  adult: boolean;
  heldUntil?: number;
  code: string;
}

const KEY = "xiventa_cart";
const EVT = "xiventa-cart";

function read(): Cart | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Cart) : null;
  } catch {
    return null;
  }
}

export function writeCart(c: Cart) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(c));
    window.dispatchEvent(new Event(EVT));
  } catch {}
}

/** A fresh cart for an event. The order code is stable per cart (AM37: "XV 7TGT MP4"). */
export function newCart(e: XiventaEvent, defaults: Partial<Cart> = {}): Cart {
  const first = tiersFor(e).find((t) => !t.soldOut);
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const pick = (n: number) => Array.from({ length: n }, () => letters[Math.floor(Math.random() * letters.length)]).join("");
  return {
    slug: e.slug,
    qty: first ? { [first.id]: e.isFree ? 2 : 2 } : {},
    name: "",
    phone: "",
    email: "",
    guests: [],
    method: "card",
    adult: !e.ageRestriction,
    code: `XV ${pick(4)} ${pick(3)}`,
    ...defaults,
  };
}

let cachedRaw: string | null | undefined;
let cachedCart: Cart | null = null;
function snapshot() {
  let raw: string | null = null;
  try {
    raw = sessionStorage.getItem(KEY);
  } catch {}
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedCart = read();
  }
  return cachedCart;
}
function subscribe(cb: () => void) {
  window.addEventListener(EVT, cb);
  return () => window.removeEventListener(EVT, cb);
}

/** The cart for this event, or undefined on the server / null when there is none. */
export function useCart(slug: string): Cart | null | undefined {
  const c = useSyncExternalStore(subscribe, snapshot, () => undefined);
  if (c === undefined) return undefined;
  return c && c.slug === slug ? c : null;
}

export interface Totals {
  lines: { label: string; qty: number; amount: number; tier: CheckoutTier }[];
  count: number;
  subtotal: number;
  fee: number;
  total: number;
}

export function totals(e: XiventaEvent, c: Pick<Cart, "qty">): Totals {
  const lines = tiersFor(e)
    .filter((t) => (c.qty[t.id] ?? 0) > 0)
    .map((t) => ({ label: t.label, qty: c.qty[t.id], amount: t.price * c.qty[t.id], tier: t }));
  const subtotal = lines.reduce((s, l) => s + l.amount, 0);
  const fee = Math.round(subtotal * CHECKOUT_SETTINGS.serviceFeeRate);
  return { lines, count: lines.reduce((s, l) => s + l.qty, 0), subtotal, fee, total: subtotal + fee };
}

/** "2 Regular tickets", "1 VIP table", "2 free tickets" */
export function ticketsLabel(t: Totals) {
  if (t.lines.length === 1) {
    const l = t.lines[0];
    const isTable = /table/i.test(l.label);
    const noun = isTable ? (l.qty === 1 ? "table" : "tables") : l.qty === 1 ? "ticket" : "tickets";
    return `${l.qty} ${l.tier.price === 0 ? "free" : l.label.replace(/ table$/i, "")} ${noun}`;
  }
  return `${t.count} tickets`;
}

/** m:ss left on the hold, or null once it ran out. */
export function holdLeft(c: Cart | null | undefined, now: number): string | null {
  if (!c?.heldUntil) return `${CHECKOUT_SETTINGS.holdMinutes}:00`;
  const ms = c.heldUntil - now;
  if (ms <= 0) return null;
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
