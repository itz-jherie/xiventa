"use client";

import { useSyncExternalStore } from "react";
import { getEventBySlug, type XiventaEvent } from "@/data";
import type { MyTicket } from "@/data/mine";
import { type Cart, money, ticketsLabel, totals } from "@/lib/checkout";

/** Orders placed in this browser (static stand-in for the orders API). */
interface StoredOrder {
  slug: string;
  qty: Record<string, number>;
  date?: string;
  name: string;
  email: string;
  code: string;
  placedAt: number;
}

const KEY = "xiventa_orders";
const EVT = "xiventa-orders";

/** "Sat 25 Oct, 9 PM to 3 AM" -> "Sat 25 Oct  ·  9 PM to 3 AM" (the pass header line). */
export function passWhen(e: XiventaEvent) {
  const full = e.timeRangeLabel ?? e.dateLabel;
  const i = full.indexOf(",");
  return i > 0 ? `${full.slice(0, i)}  ·  ${full.slice(i + 1).trim()}${e.format && e.format.kind !== "hybrid" ? " WAT" : ""}` : full;
}

export function passWhere(e: XiventaEvent) {
  if (e.format?.kind === "online" || e.format?.kind === "live") return `Online on ${e.format.label.split(" · ")[1] ?? "Zoom"}`;
  return e.venueName === "Online" ? "Online" : `${e.venueName}, ${e.neighborhood}`;
}

export function toTicket(e: XiventaEvent, o: Pick<StoredOrder, "qty" | "code" | "slug">): MyTicket {
  const t = totals(e, o);
  const single = t.lines.length === 1 ? t.lines[0] : null;
  return {
    id: `order-${o.code.replace(/\s/g, "").toLowerCase()}`,
    event: e,
    appLabel: ticketsLabel(t).replace(/^(\d+) \w+ (tickets?)$/, "$1 $2"),
    webLabel: ticketsLabel(t).replace(/^(\d+) \w+ (tickets?)$/, "$1 $2"),
    tier: single ? single.label : t.lines.map((l) => l.label).join(" + "),
    count: t.count,
    unitPrice: single ? money(single.tier.price) : money(t.subtotal),
    paid: money(t.total),
    code: `${o.code} MP4`,
    when: passWhen(e),
    where: passWhere(e),
    showOnApp: true,
    pass: true,
    qty: o.qty,
    online: e.format?.kind === "online" || /online/i.test(e.venueName) ? { platform: "Zoom", opens: "15 min before the start", passcode: "LAGOS24" } : undefined,
    paidOn: "Today",
    refundsUntil: t.total > 0 ? "48 hours before the start" : "",
  };
}

function readAll(): StoredOrder[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as StoredOrder[];
  } catch {
    return [];
  }
}

export function saveOrder(c: Cart) {
  const all = readAll().filter((o) => o.code !== c.code);
  all.unshift({ slug: c.slug, qty: c.qty, date: c.date, name: c.name, email: c.email, code: c.code, placedAt: Date.now() });
  try {
    localStorage.setItem(KEY, JSON.stringify(all));
    window.dispatchEvent(new Event(EVT));
  } catch {}
}

let cachedRaw: string | null | undefined;
let cached: MyTicket[] = [];
function snapshot(): MyTicket[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {}
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cached = readAll().flatMap((o) => {
      const e = getEventBySlug(o.slug);
      return e ? [toTicket(e, o)] : [];
    });
  }
  return cached;
}
const empty: MyTicket[] = [];
function subscribe(cb: () => void) {
  window.addEventListener(EVT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVT, cb);
    window.removeEventListener("storage", cb);
  };
}

/** Tickets from orders placed in this browser, newest first. */
export function useOrders(): MyTicket[] {
  return useSyncExternalStore(subscribe, snapshot, () => empty);
}
