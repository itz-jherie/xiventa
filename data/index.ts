export * from "./types";
export * from "./categories";
export * from "./events";
export * from "./places";
export * from "./spotlight";

import { EVENTS } from "./events";
import { PLACES } from "./places";
import { CATEGORIES } from "./categories";
import { SPOTLIGHT_STORIES } from "./spotlight";
import { XiventaEvent, Place } from "./types";

export function getWeekendEvents(): XiventaEvent[] {
  return EVENTS.filter((e) => e.isWeekend);
}

export function getFreeEvents(): XiventaEvent[] {
  return EVENTS.filter((e) => e.isFree);
}

export function getAllEvents(): XiventaEvent[] {
  return EVENTS;
}

export function getEventBySlug(slug: string): XiventaEvent | undefined {
  return EVENTS.find((e) => e.slug === slug);
}

export function getAllPlaces(): Place[] {
  return PLACES;
}

export function getAllCategories() {
  return CATEGORIES;
}

export function getSpotlightStories() {
  return SPOTLIGHT_STORIES;
}

