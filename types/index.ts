export type UserRole = "attendee" | "organizer" | "admin";

export type EventFormat = "physical" | "online" | "hybrid";

export type EventCategory =
  | "nightlife"
  | "festivals"
  | "tech"
  | "food"
  | "wellness"
  | "community"
  | "music";

export interface OrganizerSummary {
  id: string;
  name: string;
  avatar_url?: string;
  verified: boolean;
  follower_count: number;
}

export interface TicketTier {
  id: string;
  event_id: string;
  name: string;
  price: number;
  currency: string;
  capacity: number;
  sold_count: number;
  perks?: string[];
  is_sold_out: boolean;
}

export interface XiventaEvent {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: EventCategory;
  format: EventFormat;
  date_start: string;
  date_end?: string;
  doors_open?: string;
  venue_name: string;
  venue_address: string;
  city: string;
  flyer_url: string;
  min_price: number;
  currency: string;
  status: "draft" | "published" | "cancelled" | "completed";
  organizer: OrganizerSummary;
  attendee_count: number;
}

export interface TicketItem {
  id: string;
  ticket_code: string;
  event_id: string;
  event_title: string;
  tier_name: string;
  doors_open: string;
  venue_name: string;
  qr_payload: string;
  attendee_name: string;
  status: "valid" | "checked_in" | "refunded";
  checked_in_at?: string;
}

export interface OrderSummary {
  id: string;
  order_number: string;
  event_id: string;
  total_amount: number;
  currency: string;
  status: "pending" | "paid" | "failed";
  tickets: TicketItem[];
  created_at: string;
}
