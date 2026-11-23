import type { EventCategorySlug } from "./types";

/** Copy for the category page (AM14 / PW04). Nightlife carries the Figma copy. */
export interface CategoryCopy {
  kicker: string;
  appBody: string;
  title: string;
  webBody: string;
  subs: string[];
  /** Place categoryLabel values shown on the Places tab */
  placeLabels: string[];
}

const COPY: Partial<Record<EventCategorySlug, CategoryCopy>> = {
  nightlife: {
    kicker: "NIGHTLIFE & PARTIES",
    appBody: "Club nights, day parties, house parties and raves across Lagos.",
    title: "Nightlife and parties",
    webBody: "Rooftops, day parties, clubs and late nights across Lagos.",
    subs: ["Club nights", "Day parties", "Beach parties", "Rooftop", "Bars and lounges"],
    placeLabels: ["NIGHTLIFE", "BARS & LOUNGES"],
  },
  food: {
    kicker: "FOOD & DRINK",
    appBody: "Food markets, brunches, tastings and supper clubs across Lagos.",
    title: "Food and drink",
    webBody: "Markets, brunches, tastings and the best tables in Lagos.",
    subs: ["Brunch", "Markets", "Tastings", "Supper clubs"],
    placeLabels: ["FOOD & DRINK", "RESTAURANTS"],
  },
  outdoors: {
    kicker: "OUTDOORS",
    appBody: "Picnics, beach days, hikes and sunrise yoga around Lagos.",
    title: "Outdoors",
    webBody: "Picnics, beaches, parks and sunrise sessions around Lagos.",
    subs: ["Picnics", "Beach days", "Fitness", "Parks"],
    placeLabels: ["OUTDOORS", "BEACHES"],
  },
  games: {
    kicker: "FUN & GAMES",
    appBody: "Game nights, bowling, arcades and board game meetups.",
    title: "Fun and games",
    webBody: "Game nights, bowling, arcades and board games across Lagos.",
    subs: ["Game nights", "Bowling", "Arcades", "Board games"],
    placeLabels: ["FUN & GAMES"],
  },
};

export function getCategoryCopy(slug: EventCategorySlug, name: string): CategoryCopy {
  return (
    COPY[slug] ?? {
      kicker: name.toUpperCase(),
      appBody: `${name} events and places across Lagos.`,
      title: name,
      webBody: `${name} events and places across Lagos, picked for you.`,
      subs: ["This weekend", "Free", "Family friendly"],
      placeLabels: [name.toUpperCase()],
    }
  );
}
