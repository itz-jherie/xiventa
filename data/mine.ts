import { getEventBySlug, getPlaceBySlug } from "./index";
import { img } from "./events";
import { Place, XiventaEvent } from "./types";

/** Static "your stuff" for My events (AM36 / PW16), tickets (AM37 / PW17) and My places (AM77 / PW22). */

const ev = (slug: string, patch: Partial<XiventaEvent> = {}): XiventaEvent => ({ ...getEventBySlug(slug)!, ...patch });

export interface MyTicket {
  /** URL id: /my-events/<id> */
  id: string;
  event: XiventaEvent;
  /** App list footer ("2 tickets", "1 table") */
  appLabel: string;
  /** Web card footer ("2 tickets", "1 going", "Online ticket", "Request sent") */
  webLabel: string;
  tier: string;
  count: number;
  unitPrice: string;
  paid: string;
  code: string;
  when: string;
  where: string;
  showOnApp: boolean;
  /** Free RSVP or a pending request: no pass to show yet */
  pass: boolean;
  /** Tier ids and counts, used to rebuild the order total (AM38 / PW18). */
  qty?: Record<string, number>;
  /** Pass state shown on the badge. Defaults to valid. */
  status?: "valid" | "checked-in" | "refunded";
  /** "Checked in at 10:42 PM" time (AM37 Checked in, PW17 Past). */
  checkedIn?: string;
  /** Online events: no QR, a join button instead (AM37 Online, PW17 Online). */
  online?: { platform: string; opens: string; passcode: string };
  /** Tables: each seat has its own QR (AM37 Table). */
  table?: { seats: number };
  /** "door" or "gate" in the pass hint. */
  entry?: "door" | "gate";
  /** Date the order was paid (PW18 Payment). */
  paidOn?: string;
  /** Last day refunds are open (AM55, AM68). Empty = closed. */
  refundsUntil?: string;
  /** Past orders: refund already done (AM38 Refunded). */
  refunded?: boolean;
}

export const MY_TICKETS: MyTicket[] = [
  {
    id: "abnormal-nightout",
    event: ev("abnormal-nightout"),
    appLabel: "2 tickets",
    webLabel: "2 tickets",
    tier: "Regular",
    count: 2,
    unitPrice: "₦15,000",
    paid: "₦31,500",
    code: "XV 7TGT MP4",
    when: "Sat 25 Oct  ·  9 PM to 3 AM",
    where: "Skyline Lounge, Victoria Island",
    showOnApp: true,
    pass: true,
    qty: { regular: 2 },
    paidOn: "Mon 20 Oct",
    refundsUntil: "Thu 23 Oct, 9 PM",
  },
  {
    id: "jersey-creek-picnic",
    event: ev("jersey-creek-picnic"),
    appLabel: "1 going",
    webLabel: "1 going",
    tier: "Free",
    count: 1,
    unitPrice: "Free",
    paid: "Free",
    code: "XV 4JCP 2K8",
    when: "Sun 26 Oct  ·  1 PM to 7 PM",
    where: "Lagoon Park, Lagos Island",
    showOnApp: false,
    pass: true,
    qty: { free: 1 },
    entry: "gate",
  },
  {
    id: "connect-lagos",
    event: ev("connect-lagos", { venueLabel: "Online · Zoom" }),
    appLabel: "2 tickets",
    webLabel: "Online ticket",
    tier: "Standard",
    count: 2,
    unitPrice: "₦5,000",
    paid: "₦10,500",
    code: "XV 9CNL Z3Q",
    when: "Thu 30 Oct  ·  6 PM to 8 PM",
    where: "Online on Zoom",
    showOnApp: true,
    pass: true,
    qty: { standard: 2 },
    online: { platform: "Zoom", opens: "5:45 PM on Thu 30 Oct", passcode: "LAGOS24" },
    paidOn: "Tue 21 Oct",
    refundsUntil: "Wed 29 Oct, 6 PM",
  },
  {
    id: "friday-rush",
    event: ev("friday-rush", { dateLabel: "Fri 31 Oct, 10 PM" }),
    appLabel: "1 table",
    webLabel: "1 table",
    tier: "VIP Table · Seat 1",
    count: 1,
    unitPrice: "₦300,000",
    paid: "₦315,000",
    code: "XV 8RTB T01",
    when: "Fri 31 Oct  ·  10 PM to 4 AM",
    where: "Skyline Lounge, Victoria Island",
    showOnApp: true,
    pass: true,
    qty: { table: 1 },
    table: { seats: 6 },
    paidOn: "Sat 18 Oct",
    refundsUntil: "",
  },
  {
    id: "jersey-creek-request",
    event: ev("jersey-creek-picnic"),
    appLabel: "Request sent",
    webLabel: "Request sent",
    tier: "Free",
    count: 1,
    unitPrice: "Free",
    paid: "Free",
    code: "",
    when: "Sun 26 Oct  ·  1 PM to 7 PM",
    where: "Lagoon Park, Lagos Island",
    showOnApp: false,
    pass: false,
  },
];

/** Past tickets (My events / Past): Checked in (PW17 Past) and Refunded (AM38 Refunded). */
export const PAST_TICKETS: MyTicket[] = [
  {
    id: "afrobeats-live-session",
    event: ev("afrobeats-live-session", { dateLabel: "Fri 3 Oct, 7 PM", venueName: "Sound Hub", venueLabel: "Sound Hub, Yaba" }),
    appLabel: "Attended",
    webLabel: "Attended",
    tier: "Regular",
    count: 1,
    unitPrice: "₦10,000",
    paid: "₦10,500",
    code: "XV 3BQE 7LM",
    when: "Fri 3 Oct  ·  7 PM to 11 PM",
    where: "Sound Hub, Yaba",
    showOnApp: false,
    pass: true,
    qty: { regular: 1 },
    status: "checked-in",
    checkedIn: "7:42 PM",
    paidOn: "Mon 29 Sep",
    refundsUntil: "",
  },
  {
    id: "sunday-sundowner",
    event: ev("sunday-sundowner", { dateLabel: "Sun 12 Oct, 4 PM" }),
    appLabel: "Attended",
    webLabel: "Attended",
    tier: "Regular",
    count: 1,
    unitPrice: "₦8,000",
    paid: "₦8,400",
    code: "XV 5SSD 2RT",
    when: "Sun 12 Oct  ·  4 PM to 9 PM",
    where: "Skyline Lounge, Victoria Island",
    showOnApp: false,
    pass: true,
    qty: { regular: 1 },
    status: "checked-in",
    checkedIn: "4:20 PM",
    paidOn: "Fri 10 Oct",
    refundsUntil: "",
  },
  {
    id: "hangover-friday",
    event: ev("hangover-friday", { dateLabel: "Fri 26 Sep, 10 PM" }),
    appLabel: "Refunded",
    webLabel: "Refunded",
    tier: "Regular",
    count: 1,
    unitPrice: "₦10,000",
    paid: "₦10,500",
    code: "XV 4KDP 8NA",
    when: "Fri 26 Sep  ·  10 PM",
    where: "Skyline Lounge, Victoria Island",
    showOnApp: false,
    pass: true,
    qty: { regular: 1 },
    status: "refunded",
    refunded: true,
    paidOn: "Mon 15 Sep",
    refundsUntil: "",
  },
];

export const appUpcoming = () => MY_TICKETS.filter((t) => t.showOnApp);
/** PW16 Upcoming shows four cards in this order. */
export const webUpcoming = () => ["abnormal-nightout", "jersey-creek-picnic", "connect-lagos", "jersey-creek-request"].map((id) => MY_TICKETS.find((t) => t.id === id)!);
export const getTicket = (id: string) => MY_TICKETS.find((t) => t.id === id) ?? PAST_TICKETS.find((t) => t.id === id);

export type EventBadge = { label: string; bg: string; fg: string; dot: string };

export const SAVED_EVENTS: { event: XiventaEvent; badge?: EventBadge }[] = [
  { event: ev("friday-rush"), badge: { label: "Price goes up soon", bg: "#FFF6DD", fg: "#8F5200", dot: "#F5A300" } },
  { event: ev("jersey-creek-picnic"), badge: { label: "You're going", bg: "#E3F8EF", fg: "#067647", dot: "#067647" } },
  { event: ev("connect-lagos") },
];

export const PAST_EVENTS: { event: XiventaEvent; label: string }[] = [
  { event: ev("afrobeats-live-session", { dateLabel: "Fri 3 Oct, 7 PM", venueLabel: "Harbour Hall, Lekki" }), label: "Attended" },
  { event: ev("sunday-sundowner", { dateLabel: "Sun 12 Oct, 4 PM" }), label: "Attended" },
  { event: ev("hangover-friday", { dateLabel: "Fri 26 Sep, 10 PM" }), label: "Refunded" },
];

const pl = (slug: string, patch: Partial<Place> = {}): Place => ({ ...getPlaceBySlug(slug)!, ...patch });

export type { PlaceBadge } from "@/components/mobile/AppPlaceRow";
import type { PlaceBadge } from "@/components/mobile/AppPlaceRow";

export const SAVED_PLACES: { place: Place; badge: PlaceBadge }[] = [
  { place: pl("the-garden-lagos", { imageUrl: img("dcd2cb3c") }), badge: { label: "Open now", tone: "open" } },
  { place: pl("kiln-coffee", { imageUrl: img("77336b6d") }), badge: { label: "Open now", tone: "open" } },
];

export const PLANNED_PLACES: { place: Place; badge: PlaceBadge }[] = [
  { place: pl("skyline-lounge", { imageUrl: img("dcd2cb3c"), distanceLabel: "3.2 km away" }), badge: { label: "Planned · Sat 29 Nov, 9 PM", tone: "blue" } },
];

export const BEEN_PLACES: { place: Place; badge: PlaceBadge }[] = [
  {
    place: pl("terrace-21", { slug: "nok-by-alara", name: "Nok by Alara", metaLabel: "Restaurant · Victoria Island", categoryLabel: "RESTAURANTS", distanceLabel: "3.2 km away", imageUrl: img("dcd2cb3c") }),
    badge: { label: "Been here", tone: "blue" },
  },
  {
    place: pl("art-twenty-one", { slug: "terra-kulture", name: "Terra Kulture", metaLabel: "Arts centre · Victoria Island", distanceLabel: "9.1 km away", imageUrl: img("77336b6d") }),
    badge: { label: "Been here", tone: "blue" },
  },
];
