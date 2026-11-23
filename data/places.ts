import { Place } from "./types";
import { img } from "./events";

/** Place category tag colours, as used on the Place Card tag in Figma. */
const TAG: Record<string, { bg: string; fg: string }> = {
  NIGHTLIFE: { bg: "#FFEDFD", fg: "#A8189E" },
  "FOOD & DRINK": { bg: "#F8FCE3", fg: "#586A0C" },
  RESTAURANTS: { bg: "#F8FCE3", fg: "#586A0C" },
  OUTDOORS: { bg: "#E6F4FC", fg: "#0E5F8A" },
  "HOTELS & POOLS": { bg: "#E6F4FC", fg: "#0E5F8A" },
  BEACHES: { bg: "#E6F4FC", fg: "#0E5F8A" },
  "FUN & GAMES": { bg: "#FFF6D6", fg: "#7A5500" },
  COMMUNITY: { bg: "#F6EEE7", fg: "#6B4226" },
  "ARTS & CULTURE": { bg: "#FFEEE7", fg: "#B23F0E" },
};

type PlaceSeed = Omit<Place, "id" | "tagBg" | "tagColor" | "distanceLabel" | "rating" | "reviewCount"> & {
  distanceLabel?: string;
  rating?: number;
  reviewCount?: number;
};

function pl(seed: PlaceSeed): Place {
  const tag = TAG[seed.categoryLabel] ?? TAG.COMMUNITY;
  return {
    id: `place-${seed.slug}`,
    tagBg: tag.bg,
    tagColor: tag.fg,
    distanceLabel: seed.distanceLabel ?? `${seed.distanceKm} km away`,
    rating: seed.rating ?? 0,
    reviewCount: seed.reviewCount ?? 0,
    ...seed,
  };
}

export const PLACES: Place[] = [
  // PW03 Places, in Figma order
  pl({ slug: "skyline-lounge", name: "Skyline Lounge", categoryLabel: "NIGHTLIFE", metaLabel: "Rooftop bar · Victoria Island", distanceKm: 1.4, isOpenNow: true, openUntil: "3 AM", imageUrl: img("6b030ea9"), neighborhood: "Victoria Island", side: "Island" }),
  pl({ slug: "the-garden-lagos", name: "The Garden Lagos", categoryLabel: "FOOD & DRINK", metaLabel: "Garden restaurant · Ikoyi", distanceKm: 3.2, isOpenNow: true, openUntil: "11 PM", imageUrl: img("5b0bbfce"), neighborhood: "Ikoyi", side: "Island" }),
  pl({ slug: "lagoon-park", name: "Lagoon Park", categoryLabel: "OUTDOORS", metaLabel: "Park · Ikoyi", distanceKm: 4.0, distanceLabel: "4.0 km away", isOpenNow: true, openUntil: "8 PM", imageUrl: img("dcd2cb3c"), neighborhood: "Ikoyi", side: "Island" }),
  pl({ slug: "play-arena", name: "Play Arena", categoryLabel: "FUN & GAMES", metaLabel: "Games and bowling · Ikeja", distanceKm: 12, isOpenNow: true, openUntil: "10 PM", imageUrl: img("77336b6d"), neighborhood: "Ikeja", side: "Mainland" }),
  pl({ slug: "harbour-hall", name: "Harbour Hall", categoryLabel: "COMMUNITY", metaLabel: "Event hall · Lekki", distanceKm: 8.5, isOpenNow: true, openUntil: "11 PM", imageUrl: img("9fd92999"), neighborhood: "Lekki", side: "Island" }),
  pl({ slug: "kiln-coffee", name: "Kiln Coffee", categoryLabel: "FOOD & DRINK", metaLabel: "Cafe · Yaba", distanceKm: 9.1, isOpenNow: true, openUntil: "7 PM", imageUrl: img("610df935"), neighborhood: "Yaba", side: "Mainland" }),
  // AM11 Home (app)
  pl({ slug: "pulse-club", name: "Pulse Club", categoryLabel: "NIGHTLIFE", metaLabel: "Club · Victoria Island", distanceKm: 2.4, isOpenNow: true, imageUrl: img("39216498"), neighborhood: "Victoria Island", side: "Island" }),
  pl({ slug: "cove-bar", name: "Cove Bar", categoryLabel: "NIGHTLIFE", metaLabel: "Cocktail bar · Lekki", distanceKm: 4.1, isOpenNow: true, imageUrl: img("39ef03ef"), neighborhood: "Lekki", side: "Island" }),
  pl({ slug: "art-twenty-one", name: "Art Twenty One", categoryLabel: "ARTS & CULTURE", metaLabel: "Gallery · Victoria Island", distanceKm: 2.1, isOpenNow: true, imageUrl: img("39216498"), neighborhood: "Victoria Island", side: "Island" }),
  pl({ slug: "bogobiri-house", name: "Bogobiri House", categoryLabel: "FOOD & DRINK", metaLabel: "Restaurant and bar · Ikoyi", distanceKm: 3.4, isOpenNow: true, imageUrl: img("39ef03ef"), neighborhood: "Ikoyi", side: "Island" }),
  pl({ slug: "hans-and-rene", name: "Hans & René", categoryLabel: "FOOD & DRINK", metaLabel: "Ice cream · Ikoyi", distanceKm: 3.8, isOpenNow: true, imageUrl: img("92c79913"), neighborhood: "Ikoyi", side: "Island" }),
  pl({ slug: "azure-pool-club", name: "Azure Pool Club", categoryLabel: "HOTELS & POOLS", metaLabel: "Day pass pool · Ikoyi", distanceKm: 3.8, isOpenNow: true, imageUrl: img("61e5536b"), neighborhood: "Ikoyi", side: "Island" }),
  pl({ slug: "sandbar-beach-club", name: "Sandbar Beach Club", categoryLabel: "BEACHES", metaLabel: "Beach club · Lekki", distanceKm: 9, isOpenNow: true, imageUrl: img("633b2b38"), neighborhood: "Lekki", side: "Island" }),
  pl({ slug: "terrace-21", name: "Terrace 21", categoryLabel: "RESTAURANTS", metaLabel: "Restaurant · Ikoyi", distanceKm: 3.1, isOpenNow: true, imageUrl: img("acc77916"), neighborhood: "Ikoyi", side: "Island" }),
  pl({ slug: "strike-lanes", name: "Strike Lanes", categoryLabel: "FUN & GAMES", metaLabel: "Bowling · Victoria Island", distanceKm: 2.1, isOpenNow: true, imageUrl: img("1210af3f"), neighborhood: "Victoria Island", side: "Island" }),
];
