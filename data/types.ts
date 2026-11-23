export type EventCategorySlug =
  | "music"
  | "nightlife"
  | "art"
  | "food"
  | "tech"
  | "comedy"
  | "sports"
  | "games"
  | "faith"
  | "family"
  | "learning"
  | "community"
  | "fashion"
  | "outdoors";

export interface EventCategory {
  id: string;
  name: string;
  slug: EventCategorySlug;
  /** Icon tile background (Figma Category Tile / Icon tile fill) */
  tileBg: string;
  /** Icon stroke colour (Figma Category Tile / Icon vector stroke) */
  iconColor: string;
  count: number;
}

/** Card label under/over the price (rule 6, decision 88). */
export type PriceLabel =
  | "From"
  | "Request to join"
  | "Ticket needed"
  | "Livestream"
  | `${number} spots left`
  | null;

export type EventStatus = "selling-fast" | "sold-out" | null;

export interface FormatTag {
  kind: "online" | "hybrid" | "live";
  label: string; // e.g. "Online · Zoom"
}

export interface TicketTier {
  name: string; // e.g. "REGULAR"
  price: string; // e.g. "₦15,000"
  description: string;
}

export interface GoodToKnowRow {
  icon: "info" | "car" | "accessibility";
  title: string;
  subtitle: string;
}

export interface XiventaEvent {
  id: string;
  slug: string;
  title: string;
  hostName: string;
  /** Instagram listing (decision 85): host shows without the Verified tick (rule 6). */
  isListing?: boolean;
  hostInitials?: string;
  hostMeta?: string; // e.g. "Verified organizer · ★ 4.6 · 24 events"
  venueName: string;
  neighborhood: string;
  /** Full venue line shown on cards, e.g. "Skyline Lounge, Victoria Island" or "Online" */
  venueLabel: string;
  city: string;
  dateLabel: string; // e.g. "Sat 25 Oct, 9 PM"
  rawDate: string; // ISO date for filtering e.g. "2026-10-25T21:00:00"
  priceLabel: PriceLabel;
  priceValue: number; // 0 for Free
  displayPrice: string; // e.g. "₦15,000" or "Free"
  isFree: boolean;
  status?: EventStatus;
  format?: FormatTag;
  isWeekend?: boolean;
  isTonight?: boolean;
  ageRestriction?: string; // e.g. "18+"
  recurrence?: string; // e.g. "Every Sunday"
  category: EventCategorySlug;
  /** Upper-case tag label, e.g. "NIGHTLIFE", "FUN & GAMES" */
  categoryLabel: string;
  imageUrl: string;
  description: string;
  attendeesCount?: number;
  // Event page (PW06) details
  heroImageUrl?: string; // the PW06 frame uses different art for the big image
  timeRangeLabel?: string; // "Sat 25 Oct, 9 PM to 3 AM"
  address?: string; // "Ozumba Mbadiwe Avenue, Victoria Island"
  tiers?: TicketTier[];
  goodToKnow?: GoodToKnowRow[];
}

export interface Place {
  id: string;
  slug: string;
  name: string;
  categoryLabel: string; // e.g. "NIGHTLIFE", "FOOD & DRINK", "OUTDOORS"
  tagColor: string; // tag text colour (hex)
  tagBg: string; // tag background (hex)
  metaLabel: string; // e.g. "Rooftop bar · Victoria Island"
  rating: number; // only shown once the place has 5+ reviews (rule 17)
  reviewCount: number;
  distanceLabel: string; // e.g. "1.4 km away"
  distanceKm: number;
  isOpenNow: boolean;
  openUntil?: string; // e.g. "11 PM"
  imageUrl: string;
  neighborhood: string;
  side: "Island" | "Mainland";
}

export interface SpotlightStory {
  id: string;
  posterName: string;
  posterInitials: string;
  caption: string;
  meta: string; // e.g. "SAT 29 NOV · 8 PM"
  actionLabel: string; // e.g. "Get tickets" or "Directions"
  actionType: "tickets" | "directions";
  imageUrl: string;
  /** Colour of the "Spotlight" title in the clip header (white on dark clips, navy on light ones) */
  headerTone?: "light" | "dark";
}
