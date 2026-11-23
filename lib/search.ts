import { getAllEvents, getAllPlaces, type Place, type XiventaEvent } from "@/data";
import { getHosts, type Host } from "@/data/hosts";

const STOP = new Set(["in", "the", "a", "an", "at", "on", "this", "near", "me", "and", "of", "for", "to", "out"]);
const words = (q: string) =>
  q
    .toLowerCase()
    .split(/[^a-z0-9&]+/)
    .filter((w) => w.length > 1 && !STOP.has(w));

/** "night" also finds nightlife and "rooftop" finds rooftop bars: every query word must appear somewhere. */
function matches(hay: string, q: string) {
  const ws = words(q);
  if (!ws.length) return false;
  const h = hay.toLowerCase();
  return ws.every((w) => h.includes(w) || (w.endsWith("s") && h.includes(w.slice(0, -1))));
}

export interface SearchResults {
  events: XiventaEvent[];
  places: Place[];
  hosts: Host[];
}

export function search(q: string): SearchResults {
  const events = getAllEvents().filter((e) =>
    matches([e.title, e.venueName, e.neighborhood, e.categoryLabel, e.category, e.hostName, e.recurrence ?? "", e.format?.label ?? "", e.description].join(" "), q)
  );
  const places = getAllPlaces().filter((p) => matches([p.name, p.metaLabel, p.categoryLabel, p.neighborhood, p.side].join(" "), q));
  const hosts = getHosts().filter((h) => matches(h.name, q));
  return { events, places, hosts };
}

const KEY = "xiventa_recent_searches";
const DEFAULT_RECENT = ["Rooftop parties", "Brunch in Lekki", "Comedy this weekend", "Board games"];

export function getRecent(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : DEFAULT_RECENT;
  } catch {
    return DEFAULT_RECENT;
  }
}

export function addRecent(q: string) {
  const t = q.trim();
  if (!t) return;
  try {
    localStorage.setItem(KEY, JSON.stringify([t, ...getRecent().filter((r) => r.toLowerCase() !== t.toLowerCase())].slice(0, 6)));
  } catch {}
}

export function clearRecent() {
  try {
    localStorage.setItem(KEY, "[]");
  } catch {}
}
