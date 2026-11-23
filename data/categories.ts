import { EventCategory } from "./types";

/** Category tiles on PW01 Home, colours taken from the Figma Category Tile instances. */
export const CATEGORIES: EventCategory[] = [
  { id: "cat-music", name: "Music", slug: "music", tileBg: "#F1EEFF", iconColor: "#5B3FD6", count: 48 },
  { id: "cat-nightlife", name: "Nightlife", slug: "nightlife", tileBg: "#FFEDFD", iconColor: "#A8189E", count: 35 },
  { id: "cat-art", name: "Art", slug: "art", tileBg: "#FFEEE7", iconColor: "#B23F0E", count: 19 },
  { id: "cat-food", name: "Food", slug: "food", tileBg: "#F8FCE3", iconColor: "#586A0C", count: 27 },
  { id: "cat-tech", name: "Tech", slug: "tech", tileBg: "#E6F1FF", iconColor: "#0059BE", count: 22 },
  { id: "cat-comedy", name: "Comedy", slug: "comedy", tileBg: "#E0FBF5", iconColor: "#00735E", count: 14 },
  { id: "cat-sports", name: "Sports", slug: "sports", tileBg: "#E3F8EF", iconColor: "#067647", count: 16 },
  { id: "cat-games", name: "Games", slug: "games", tileBg: "#FFF6D6", iconColor: "#7A5500", count: 11 },
  { id: "cat-faith", name: "Faith", slug: "faith", tileBg: "#EEF0FF", iconColor: "#2E35A3", count: 24 },
  { id: "cat-family", name: "Family", slug: "family", tileBg: "#FFEEE8", iconColor: "#A5361A", count: 13 },
  { id: "cat-learning", name: "Learning", slug: "learning", tileBg: "#E3F6F4", iconColor: "#0B6660", count: 18 },
  { id: "cat-community", name: "Community", slug: "community", tileBg: "#F6EEE7", iconColor: "#6B4226", count: 21 },
  { id: "cat-fashion", name: "Fashion", slug: "fashion", tileBg: "#FDEEF3", iconColor: "#A2174A", count: 9 },
  { id: "cat-outdoors", name: "Outdoors", slug: "outdoors", tileBg: "#E6F4FC", iconColor: "#0E5F8A", count: 15 },
];
