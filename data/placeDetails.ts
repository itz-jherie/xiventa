import type { Place } from "./types";
import { img } from "./events";

/** Extra copy for the place page (AM24 / PW08). Skyline Lounge carries the Figma copy; others get sensible defaults. */
export interface PlaceDetails {
  /** Big photo on the place page (AM24 / PW08 use a different shot from the cards) */
  hero: string;
  team: string;
  teamMeta: string;
  webTeamMeta: string;
  about: string;
  phone: string;
  menuUrl: string;
  street: string;
  hours: [string, string][];
  todayHours: string;
  closesAt: string;
  amenities: [string, string][];
  chips: string[];
  rating: number;
  reviewCount: number;
  reviews: { initials: string; name: string; when: string; stars: number; text: string; reply?: string }[];
  /** AM65 Special day: different hours on one weekday this week (previewed with ?state=special-day). */
  specialHours?: { day: string; hours: string };
  /** AM66 Menu: tab -> sections -> [item, price] */
  menu: Record<string, [string, [string, string][]][]>;
  /** "Updated by Skyline Lounge on 3 Oct" */
  menuUpdated: string;
}

const DEFAULT_MENU: PlaceDetails["menu"] = {
  Drinks: [
    ["Cocktails", [["Lagoon Sunset", "₦9,000"], ["Island Mule", "₦9,000"], ["Zobo Spritz", "₦9,000"]]],
    ["Soft drinks", [["Chapman", "₦4,500"], ["Fresh juice", "₦4,500"]]],
  ],
  Food: [
    ["Grill", [["Suya platter", "₦12,000"], ["Peppered chicken wings", "₦8,500"], ["Grilled fish", "₦18,000"]]],
    ["Sides", [["Plantain fries", "₦3,500"], ["Jollof rice", "₦4,000"]]],
  ],
  Specials: [["This week", [["Friday sundowner jug", "₦25,000"], ["Sunday brunch board", "₦15,000"]]]],
};

const DEFAULT_HOURS: [string, string][] = [
  ["Monday", "Closed"],
  ["Tuesday", "4 PM to 12 AM"],
  ["Wednesday", "4 PM to 12 AM"],
  ["Thursday", "4 PM to 2 AM"],
  ["Friday", "4 PM to 3 AM"],
  ["Saturday", "4 PM to 3 AM"],
  ["Sunday", "2 PM to 12 AM"],
];

const SKYLINE: Partial<PlaceDetails> = {
  // AM67 Opening hours. Saturday follows AM65 (open 4 PM to 2 AM, closed at 2 PM).
  hours: [
    ["Monday", "4 PM to 2 AM"],
    ["Tuesday", "4 PM to 2 AM"],
    ["Wednesday", "4 PM to 2 AM"],
    ["Thursday", "4 PM to 2 AM"],
    ["Friday", "4 PM to 4 AM"],
    ["Saturday", "4 PM to 2 AM"],
    ["Sunday", "Closed"],
  ],
  specialHours: { day: "Saturday", hours: "6 PM to 11 PM" },
  menuUpdated: "Updated by Skyline Lounge on 3 Oct",
  hero: img("92c79913"),
  closesAt: "2 AM",
  team: "Skyline Lounge team",
  teamMeta: "Verified place · Hosts 3 events a month",
  webTeamMeta: "Verified place · Owner managed",
  about:
    "A rooftop lounge over the Island with sunset views, cocktails, a grill menu and DJs from Thursday to Sunday. Tables can be booked for Friday and Saturday nights.",
  phone: "0803 000 0100",
  menuUrl: "skylinelounge.ng/menu",
  street: "Ozumba Mbadiwe Avenue",
};

export function getPlaceDetails(p: Place): PlaceDetails {
  const base: PlaceDetails = {
    hero: p.imageUrl,
    team: `${p.name} team`,
    teamMeta: "Verified place · Hosts events every month",
    webTeamMeta: "Verified place · Owner managed",
    about: `${p.name} is a ${p.metaLabel.split(" · ")[0].toLowerCase()} in ${p.neighborhood}. Good food, good music and a friendly crowd most nights of the week.`,
    phone: "0800 000 0000",
    menuUrl: `${p.slug.replace(/-/g, "")}.ng/menu`,
    street: p.neighborhood,
    hours: DEFAULT_HOURS,
    todayHours: "4 PM to 2 AM",
    closesAt: p.openUntil ?? "2 AM",
    amenities: [
      ["Parking", "Valet"],
      ["Comfort", "Air conditioning, power backup, outdoor seating"],
      ["Paying", "Card, transfer or cash"],
      ["Who it is for", "Good for groups · 18+ after 9 PM"],
      ["Dress code", "Smart casual"],
      ["Booking", "Walk ins welcome, reservations taken"],
    ],
    chips: ["Valet parking", "Air conditioning", "Power backup", "Outdoor seating", "Card, transfer or cash", "Good for groups", "18+ after 9 PM", "Reservations"],
    rating: 4.6,
    reviewCount: 38,
    specialHours: { day: "Saturday", hours: "6 PM to 11 PM" },
    menu: DEFAULT_MENU,
    menuUpdated: `Updated by ${p.name} on 3 Oct`,
    reviews: [
      {
        initials: "TA",
        name: "Tolu A.",
        when: "2 weeks ago",
        stars: 4,
        text: "Lovely view at sunset and the cocktails are worth it. Gets very loud after 10 PM, so come early if you want to talk.",
        reply: "Thank you, Tolu. Fridays are busy, so book a table if you want a quieter corner.",
      },
      { initials: "CO", name: "Chidi O.", when: "Last month", stars: 5, text: "Best rooftop on the Island. Staff were quick and the grill platter was big enough for three." },
      { initials: "TB", name: "Tobi A.", when: "Sun 26 Oct", stars: 5, text: "Great view and quick service on a busy Friday." },
      { initials: "KB", name: "Kemi B.", when: "Mon 27 Oct", stars: 3, text: "Pricey drinks but the music and the view make up for it." },
    ],
  };
  return p.slug === "skyline-lounge" ? { ...base, ...SKYLINE } : base;
}
