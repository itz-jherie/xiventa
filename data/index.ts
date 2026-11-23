export * from "./types";
export * from "./categories";
export * from "./events";
export * from "./places";
export * from "./spotlight";

import { EVENTS, PRIVATE_EVENTS } from "./events";
import { PLACES } from "./places";
import { CATEGORIES } from "./categories";
import { SPOTLIGHT_STORIES } from "./spotlight";
import { XiventaEvent, Place } from "./types";

export function getAllEvents(): XiventaEvent[] {
  return EVENTS;
}

export function getEventBySlug(slug: string): XiventaEvent | undefined {
  return EVENTS.find((e) => e.slug === slug) ?? PRIVATE_EVENTS.find((e) => e.slug === slug);
}

/** Look up events by slug, keeping the given order. Optional image override per slug (some Figma frames reuse different flyer art). */
export function pickEvents(slugs: (string | [string, string])[]): XiventaEvent[] {
  return slugs.flatMap((s) => {
    const [slug, imageUrl] = Array.isArray(s) ? s : [s, undefined];
    const e = getEventBySlug(slug);
    return e ? [imageUrl ? { ...e, imageUrl } : e] : [];
  });
}

export function getAllPlaces(): Place[] {
  return PLACES;
}

export function getPlaceBySlug(slug: string): Place | undefined {
  return PLACES.find((p) => p.slug === slug);
}

export function pickPlaces(slugs: (string | [string, Partial<Place>])[]): Place[] {
  return slugs.flatMap((s) => {
    const [slug, patch] = Array.isArray(s) ? s : [s, undefined];
    const p = getPlaceBySlug(slug);
    return p ? [patch ? { ...p, ...patch } : p] : [];
  });
}

export function getAllCategories() {
  return CATEGORIES;
}

export function getSpotlightStories() {
  return SPOTLIGHT_STORIES;
}
