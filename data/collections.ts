import { pickEvents } from "./index";
import type { XiventaEvent } from "./types";

export interface Collection {
  slug: string;
  title: string;
  by: string;
  intro: string;
  ended: boolean;
  events: XiventaEvent[];
}

/** AM15 Collection (301:13918) and Collection / Ended (301:14088). */
export const getCollections = (): Collection[] => [
  {
    slug: "best-of-this-weekend",
    title: "Best of this weekend",
    by: "Picked by Xiventa",
    intro: "Parties, picnics and live music worth leaving the house for. Updated every Thursday.",
    ended: false,
    events: pickEvents(["abnormal-nightout", "jersey-creek-picnic", "afrobeats-live-session", "lekki-food-market"]),
  },
  {
    slug: "rooftop-summer",
    title: "Rooftop summer",
    by: "Picked by Xiventa",
    intro: "Sunsets, cocktails and rooftop sets across the Island.",
    ended: true,
    events: [],
  },
];

export const getCollection = (slug: string) => getCollections().find((c) => c.slug === slug);
