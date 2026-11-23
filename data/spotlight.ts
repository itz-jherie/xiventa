import { SpotlightStory } from "./types";
import { img } from "./events";

const carnival: Omit<SpotlightStory, "id"> = {
  posterName: "Lagoon Carnival",
  posterInitials: "OC",
  caption: "Three stages, one night. Carnival costumes welcome, glitter encouraged.",
  meta: "SAT 29 NOV · 8 PM",
  actionLabel: "Get tickets",
  actionType: "tickets",
  imageUrl: img("bf806b66"),
  headerTone: "light",
};

const garden: Omit<SpotlightStory, "id"> = {
  posterName: "The Garden Lagos",
  posterInitials: "GL",
  caption: "Acoustic Fridays in the courtyard. Come early for a table under the lights.",
  meta: "OPEN NOW · CLOSES 11 PM",
  actionLabel: "Directions",
  actionType: "directions",
  imageUrl: img("943ae751"),
  headerTone: "dark",
};

/** PW01 Spotlight strip: five clips alternating as in Figma. */
export const SPOTLIGHT_STORIES: SpotlightStory[] = [
  { id: "spotlight-1", ...carnival },
  { id: "spotlight-2", ...garden },
  { id: "spotlight-3", ...carnival },
  { id: "spotlight-4", ...garden },
  { id: "spotlight-5", ...carnival },
];
