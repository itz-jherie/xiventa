/** Category tag colours from the Figma `Category Tag` variants. */
const CATEGORY_TAG: Record<string, { bg: string; fg: string }> = {
  NIGHTLIFE: { bg: "#FFEDFD", fg: "#A8189E" },
  OUTDOORS: { bg: "#E6F4FC", fg: "#0E5F8A" },
  "FOOD & DRINK": { bg: "#F8FCE3", fg: "#586A0C" },
  "FUN & GAMES": { bg: "#FFF6D6", fg: "#7A5500" },
  "TECH & BUSINESS": { bg: "#E6F1FF", fg: "#0059BE" },
  TECH: { bg: "#E6F1FF", fg: "#0059BE" },
  MUSIC: { bg: "#F1EEFF", fg: "#5B3FD6" },
  FAITH: { bg: "#EEF0FF", fg: "#2E35A3" },
  COMEDY: { bg: "#E0FBF5", fg: "#00735E" },
};

export const categoryTone = (label: string) => CATEGORY_TAG[label] ?? { bg: "#FFEDFD", fg: "#A8189E" };
