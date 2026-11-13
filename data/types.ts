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
  bgTint: string;
  iconColor: string;
  count: number;
}

export interface XiventaEvent {
  id: string;
  slug: string;
  title: string;
  hostName: string;
  hostAvatar?: string;
  venueName: string;
  neighborhood: string;
  city: string;
  dateLabel: string; // e.g. "Sat 25 Oct, 9 PM"
  rawDate: string; // ISO date for filtering e.g. "2026-10-25T21:00:00"
  priceLabel: string; // e.g. "From" or "Request to join"
  priceValue: number; // 0 for Free
  displayPrice: string; // e.g. "₦15,000" or "Free"
  isFree: boolean;
  isSoldOut?: boolean;
  isOnline?: boolean;
  isWeekend?: boolean;
  isTonight?: boolean;
  ageRestriction?: string; // e.g. "18+"
  recurrence?: string; // e.g. "Every Sunday"
  category: EventCategorySlug;
  imageUrl: string;
  description: string;
  attendeesCount?: number;
}

export interface Place {
  id: string;
  slug: string;
  name: string;
  categoryLabel: string; // e.g. "NIGHTLIFE", "FOOD & DRINK", "OUTDOORS"
  tagColor: string; // text color
  tagBg: string; // badge background
  metaLabel: string; // e.g. "Rooftop bar · Victoria Island"
  rating: number; // e.g. 4.6
  distanceLabel: string; // e.g. "1.4 km away"
  isOpenNow: boolean;
  openUntil?: string; // e.g. "11 PM"
  beenHereCount?: number;
  imageUrl: string;
  neighborhood: string;
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
  avatarBg?: string;
}

