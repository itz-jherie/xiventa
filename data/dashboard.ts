import { getEventBySlug } from "@/data";

/**
 * Organizer web dashboard sample data (flow 7b, OW01 to OW46). Static: the backend replaces all of it.
 * Event ids match the organizer app (lib/hosting) where the same event appears in both.
 */

export type DashStatus = "On sale" | "In review" | "Draft" | "Ended" | "Cancelled" | "Listing";
export type DashTab = "upcoming" | "draft" | "live" | "ended" | "cancelled";

export interface DashEvent {
  id: string;
  title: string;
  date: string;
  venue: string;
  status: DashStatus;
  tab: DashTab;
  sold: number;
  capacity: number;
  revenue: number;
  slug?: string;
  image: string;
  kind: "paid" | "free" | "listing";
  series?: string;
  join?: "request";
  refunded?: number;
}

const img = (s: string) => getEventBySlug(s)?.imageUrl ?? "";

export const DASH_EVENTS: DashEvent[] = [
  { id: "abnormal-nightout", slug: "abnormal-nightout", title: "The Abnormal Nightout", date: "Sat 25 Oct, 9 PM", venue: "Skyline Lounge", status: "On sale", tab: "upcoming", sold: 142, capacity: 300, revenue: 2130000, image: img("abnormal-nightout"), kind: "paid" },
  { id: "halloween-rooftop", slug: "halloween-rooftop", title: "Halloween Rooftop", date: "Fri 31 Oct, 11 PM", venue: "Skyline Lounge", status: "On sale", tab: "upcoming", sold: 38, capacity: 250, revenue: 760000, image: img("halloween-rooftop"), kind: "paid" },
  { id: "sunday-sundowner", slug: "sunday-sundowner", title: "Sunday Sundowner", date: "Sun 16 Nov, 4 PM", venue: "Skyline Lounge", status: "In review", tab: "upcoming", sold: 0, capacity: 120, revenue: 0, image: img("sunday-sundowner"), kind: "paid" },
  { id: "day-party", title: "Day Party at the Beach", date: "Sat 1 Nov, 3 PM", venue: "Harbour Beach, Lekki", status: "Draft", tab: "draft", sold: 0, capacity: 400, revenue: 0, image: img("jersey-creek-picnic"), kind: "paid" },
  { id: "friday-rush-17", slug: "friday-rush", title: "Friday Rush, 17 Oct", date: "Fri 17 Oct, 10 PM", venue: "Skyline Lounge", status: "Ended", tab: "ended", sold: 80, capacity: 100, revenue: 640000, image: img("friday-rush"), kind: "paid" },
  { id: "sunday-sundowner-12", slug: "sunday-sundowner", title: "Sunday Sundowner", date: "Sun 12 Oct, 4 PM", venue: "Skyline Lounge", status: "Ended", tab: "ended", sold: 120, capacity: 120, revenue: 600000, image: img("sunday-sundowner"), kind: "paid" },
  { id: "hangover-friday", slug: "hangover-friday", title: "Hangover Friday", date: "Fri 10 Oct, 11 PM", venue: "Skyline Lounge", status: "Ended", tab: "ended", sold: 250, capacity: 250, revenue: 1500000, image: img("hangover-friday"), kind: "paid" },
  { id: "lagoon-boat-party", title: "Lagoon Boat Party", date: "Sat 4 Oct, 3 PM", venue: "Five Cowries Terminal", status: "Cancelled", tab: "cancelled", sold: 64, capacity: 80, revenue: 0, refunded: 64, image: img("connect-lagos"), kind: "paid" },
  // Reached from links, not the Upcoming table
  { id: "friday-rush", slug: "friday-rush", title: "Friday Rush", date: "Fri 24 Oct, 10 PM", venue: "Skyline Lounge", status: "On sale", tab: "upcoming", sold: 186, capacity: 250, revenue: 2790000, image: img("friday-rush"), kind: "paid", series: "Every Friday, 10 PM" },
  { id: "afro-night-market", title: "Afro Night Market", date: "Sat 1 Nov, 7 PM", venue: "Skyline Lounge", status: "Listing", tab: "upcoming", sold: 0, capacity: 0, revenue: 0, image: img("connect-lagos"), kind: "listing" },
  { id: "jersey-creek-picnic", slug: "jersey-creek-picnic", title: "Jersey Creek Picnic", date: "Sun 26 Oct, 1 PM", venue: "Lagoon Park", status: "On sale", tab: "upcoming", sold: 48, capacity: 100, revenue: 0, image: img("jersey-creek-picnic"), kind: "free", join: "request" },
];
/** The rows OW03 shows per tab (the extra events above are reached from links). */
export const TABLE_IDS: Record<DashTab, string[]> = {
  upcoming: ["abnormal-nightout", "halloween-rooftop", "sunday-sundowner"],
  draft: ["day-party"],
  live: [],
  ended: ["friday-rush-17", "sunday-sundowner-12", "hangover-friday"],
  cancelled: ["lagoon-boat-party"],
};
export const TAB_COUNTS: Record<DashTab, number> = { upcoming: 3, draft: 1, live: 0, ended: 21, cancelled: 1 };
export const getDashEvent = (id: string) => DASH_EVENTS.find((e) => e.id === id);

export const TICKET_TYPES = [
  { id: "early-bird", name: "Early bird", price: "₦10,000", sold: 40, qty: 40, window: "Ended Fri 10 Oct", status: "Sold out" },
  { id: "regular", name: "Regular", price: "₦15,000 now · ₦20,000 from 1 AM", short: "₦15,000", sold: 98, qty: 150, window: "Until Sat 25 Oct, 6 PM", status: "On sale" },
  { id: "vip", name: "VIP", price: "₦45,000", sold: 4, qty: 20, window: "Until Sat 25 Oct, 6 PM", status: "Paused" },
  { id: "table", name: "Table for 6", price: "₦150,000", sold: 0, qty: 5, window: "Until Fri 24 Oct", status: "On sale" },
];

export const ORDERS = [
  { code: "XV 7TGT", buyer: "Ada Okafor", tickets: "Regular × 2", total: 31500, date: "Mon 20 Oct", status: "Paid" },
  { code: "XV 8KQ2", buyer: "Tunde Bello", tickets: "VIP × 1", total: 46500, date: "Sun 19 Oct", status: "Paid" },
  { code: "XV 6WNB", buyer: "Kunle Ojo", tickets: "VIP × 2", total: 93000, date: "Sat 18 Oct", status: "Refunded" },
  { code: "XV 2MZD", buyer: "Chiamaka Nwosu", tickets: "Regular × 4", total: 63000, date: "Fri 17 Oct", status: "Partly refunded" },
  { code: "XV 5RTA", buyer: "Bola Uche", tickets: "Regular × 1", total: 15750, date: "Fri 17 Oct", status: "Pending" },
  { code: "XV 1PLQ", buyer: "Emeka Obi", tickets: "Early bird × 2", total: 21000, date: "Thu 9 Oct", status: "Failed" },
];
export const orderSlug = (code: string) => code.replace(" ", "").toLowerCase();
export const getOrder = (slug: string) => ORDERS.find((o) => orderSlug(o.code) === slug);

export const WEB_ATTENDEES = [
  { name: "Ada Okafor", ticket: "Regular", order: "XV 7TGT", status: "Not yet" },
  { name: "Tunde Okafor", ticket: "Regular", order: "XV 7TGT", status: "Not yet" },
  { name: "Tunde Bello", ticket: "VIP", order: "XV 8KQ2", status: "Not yet" },
  { name: "Chiamaka Nwosu", ticket: "Regular × 4", order: "XV 2MZD", status: "Not yet" },
  { name: "Funmi Eze", ticket: "Regular", order: "XV 4RTS", status: "Transfer pending" },
];

export const WEB_STAFF = [
  { name: "Dayo Ade", phone: "0803 000 0001", gate: "Gate A", status: "Active" },
  { name: "Seyi Martins", phone: "0803 000 0002", gate: "Gate B", status: "Active" },
  { name: "Bisi Kalu", phone: "0803 000 0003", gate: "Gate C", status: "Invite sent" },
];

export const SOURCES = [
  { source: "Instagram bio link", short: "Instagram bio", visits: "1,240", tickets: 62, sales: "₦930,000" },
  { source: "WhatsApp broadcast", short: "WhatsApp broadcast", visits: "860", tickets: 41, sales: "₦615,000" },
  { source: "Xiventa discovery", visits: "1,050", tickets: 31, sales: "₦465,000" },
  { source: "Poster QR", short: "Poster QR", visits: "260", tickets: 8, sales: "₦120,000" },
];
export const DAILY = [6, 9, 8, 13, 20, 15, 10, 12, 17, 25, 18, 23, 30, 33];

export const SERIES = [
  { date: "Fri 17 Oct", sold: "80 / 100", inn: "74", status: "Ended", note: "", action: "View" },
  { date: "Fri 24 Oct", sold: "64 / 100", inn: "Not yet", status: "On sale", note: "", action: "Manage" },
  { date: "Fri 31 Oct", sold: "21 / 100", inn: "Not yet", status: "On sale", note: "", action: "Manage" },
  { date: "Fri 7 Nov", sold: "0 / 100", inn: "Not yet", status: "Skipped", note: "Venue booked for a wedding", action: "Undo" },
  { date: "Fri 14 Nov", sold: "0 / 100", inn: "Not yet", status: "Cancelled", note: "Holders refunded", action: "View" },
];

export const GUEST_REQUESTS = [
  { id: "g1", name: "Ada Okafor", spots: 2, note: "Coming with my sister. We loved your last picnic!", sent: "Mon 20 Oct" },
  { id: "g2", name: "Ibrahim Adamu", spots: 1, note: "", sent: "Tue 21 Oct" },
  { id: "g3", name: "Funmi Eze", spots: 3, note: "Bringing kids, is that okay?", sent: "Tue 21 Oct" },
];
export const GUEST_LIST = [
  { name: "Ada Okafor", spots: 2, status: "Approved Mon 20 Oct", date: "Mon 20 Oct" },
  { name: "Tunde Bello", spots: 1, status: "Approved Tue 21 Oct", date: "Tue 21 Oct" },
  { name: "Kemi Bala", spots: 3, status: "Added by you", date: "Wed 22 Oct" },
];

export const CASES = [
  { id: "C 1042", from: "Ada Okafor", about: "Not let in", status: "Waiting on you", title: "Not let in with a valid ticket", line: "Ada Okafor · Order XV 7TGT · 2 Regular", quote: "The gate said the scanner was down and turned us away. We had two valid tickets.", amount: 31500 },
  { id: "C 1039", from: "Bola Uche", about: "Wrong charge", status: "With Xiventa", title: "Charged twice for one ticket", line: "Bola Uche · Order XV 5RTA · 1 Regular", quote: "My bank shows two payments for the same order.", amount: 15750 },
  { id: "C 1031", from: "Kunle Ojo", about: "Event changed", status: "Closed", title: "The date changed", line: "Kunle Ojo · Order XV 6WNB · 2 VIP", quote: "I can't make the new date, please refund me.", amount: 93000 },
];

export const FEEDBACK = [
  { rating: 5, note: "Great sound and sunset views. Will be back.", date: "Mon 13 Oct" },
  { rating: 4, note: "Loved it, but the queue at the gate was long.", date: "Mon 13 Oct" },
  { rating: 3, note: "Ran out of small chops early.", date: "Tue 14 Oct" },
];

export const PROMO_CODES = [
  { code: "CIRCLE10", discount: "10% off", tickets: "Regular", used: "34 / 50", ends: "Fri 24 Oct", status: "Active" },
  { code: "VIPFRIEND", discount: "₦5,000 off", tickets: "VIP", used: "20 / 20", ends: "Sat 25 Oct", status: "Limit reached" },
  { code: "EARLYLOVE", discount: "₦2,000 off", tickets: "Early bird", used: "15 / 40", ends: "Fri 10 Oct", status: "Expired" },
];

export const PLACEMENTS = [
  { name: "Featured on Home", where: "Lagos Home, Featured row", dates: "Mon 20 to Sat 25 Oct", views: "18,400", status: "Running" },
  { name: "Top of Nightlife", where: "Nightlife category", dates: "Thu 23 to Sat 25 Oct", views: "0", status: "Pending review" },
  { name: "Friday Rush boost", where: "Search results", dates: "Fri 10 Oct", views: "6,200", status: "Ended" },
];

export const WALLET_EVENTS = [
  { event: "The Abnormal Nightout", sales: "₦2,130,000", fees: "₦85,200", refunds: "₦93,000", status: "Held until event", avail: "₦1,278,000", reserve: "₦852,000", release: "Tue 28 Oct" },
  { event: "Friday Rush, 17 Oct", sales: "₦640,000", fees: "₦25,600", refunds: "₦0", status: "Available", avail: "₦640,000", reserve: "₦0", release: "Released" },
  { event: "Sunday Sundowner, 12 Oct", sales: "₦600,000", fees: "₦24,000", refunds: "₦0", status: "Paid out", avail: "₦600,000", reserve: "₦0", release: "Paid out" },
];

export const TRANSACTIONS = [
  { date: "Mon 20 Oct", type: "Sale", event: "The Abnormal Nightout", ref: "XV 7TGT", amount: "₦30,000", status: "Held" },
  { date: "Mon 20 Oct", type: "Fee", event: "The Abnormal Nightout", ref: "XV 7TGT", amount: "₦1,200", status: "Charged" },
  { date: "Sat 18 Oct", type: "Refund", event: "The Abnormal Nightout", ref: "XV 6WNB", amount: "₦90,000", status: "Refunded" },
  { date: "Fri 17 Oct", type: "Payout", event: "Friday Rush, 10 Oct", ref: "PO 0042", amount: "₦890,000", status: "Paid out" },
  { date: "Fri 17 Oct", type: "Payout", event: "Sunday Sundowner", ref: "PO 0041", amount: "₦600,000", status: "Failed" },
];

export const PAYOUTS = [
  { id: "PO 0043", date: "Fri 31 Oct", amount: "₦1,240,000", status: "Scheduled" },
  { id: "PO 0042", date: "Fri 17 Oct", amount: "₦890,000", status: "Paid" },
  { id: "PO 0041", date: "Fri 17 Oct", amount: "₦600,000", status: "Failed" },
  { id: "PO 0040", date: "Fri 10 Oct", amount: "₦420,000", status: "Paid" },
  { id: "PO 0039", date: "Fri 3 Oct", amount: "₦150,000", status: "Reversed" },
];

export const WEB_TEAM = [
  { name: "Yemi Ogun", contact: "yemi@southcircle.ng", role: "Owner", status: "Active", action: "" },
  { name: "Kemi Bala", contact: "kemi@southcircle.ng", role: "Manager", status: "Active", action: "Edit" },
  { name: "Tolu Ade", contact: "tolu@southcircle.ng", role: "Finance", status: "Invite sent", action: "Resend" },
  { name: "Dayo Ade", contact: "0803 000 0001", role: "Check in staff", status: "This event only", action: "Remove" },
];

export const ROLE_MATRIX: [string, boolean, boolean, boolean, boolean][] = [
  ["Create and edit events", true, true, false, false],
  ["See orders and attendees", true, true, true, false],
  ["Refund orders", true, true, true, false],
  ["See wallet and payouts", true, false, true, false],
  ["Change payout account", true, false, false, false],
  ["Invite team members", true, true, false, false],
  ["Scan tickets", true, true, false, true],
];

export const AUDIENCE = [
  { name: "Ada Okafor", events: 4, last: "The Abnormal Nightout", tickets: 9 },
  { name: "Tunde Bello", events: 3, last: "Friday Rush, 17 Oct", tickets: 4 },
  { name: "Chiamaka Nwosu", events: 2, last: "The Abnormal Nightout", tickets: 6 },
  { name: "Ibrahim Adamu", events: 1, last: "Sunday Sundowner", tickets: 1 },
];

export const REPORT_ROWS = [
  { event: "The Abnormal Nightout", sold: 142, through: "47%", inn: "Not yet", revenue: "₦2,130,000" },
  { event: "Friday Rush, 17 Oct", sold: 80, through: "80%", inn: "92%", revenue: "₦640,000" },
  { event: "Sunday Sundowner, 12 Oct", sold: 120, through: "100%", inn: "88%", revenue: "₦600,000" },
];

export const APPROVALS = [
  { change: "New ticket type: Table for 10", by: "Kemi Bala", event: "Halloween Rooftop", status: "Waiting" },
  { change: "Price change: VIP to ₦50,000", by: "Kemi Bala", event: "Halloween Rooftop", status: "Waiting" },
  { change: "Refund ₦90,000", by: "Tolu Ade", event: "The Abnormal Nightout", status: "Approved" },
];

export const WEB_PROFILES = [
  { id: "south-circle", name: "South Circle", initials: "SC", line: "Owner · Verified organizer", role: "Owner" },
  { id: "ember", name: "Ember House", initials: "EH", line: "Manager · Verified business", role: "Manager" },
  { id: "self", name: "Ada Okafor", initials: "AO", line: "Yourself · Verified organizer", role: "Owner" },
  { id: "skyline", name: "Skyline Lounge", initials: "SL", line: "Owner · Place", role: "Owner · Place" },
];
