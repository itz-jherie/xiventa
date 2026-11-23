/**
 * Admin sample data (flow 8, AW01 to AW43). Static: the backend replaces all of it.
 */

export const QUEUES: [string, number, string, string][] = [
  ["Verification", 14, "2 days", "/admin/organizers?tab=pending"],
  ["Events in review", 9, "6 hours", "/admin/events"],
  ["Spotlight clips", 11, "3 hours", "/admin/content/spotlight"],
  ["Instagram pages", 5, "2 hours", "/admin/content/listings"],
  ["Place claims", 4, "1 day", "/admin/content/place-claims"],
  ["Place suggestions", 6, "1 day", "/admin/content/suggestions"],
  ["Venue declines", 1, "2 hours", "/admin/content/venue-declines"],
  ["Reports and appeals", 7, "5 hours", "/admin/support/reports"],
  ["Fraud review", 3, "1 hour", "/admin/support/fraud"],
  ["Support cases", 22, "1 day", "/admin/support"],
];

export const USERS = [
  { id: "ada-okafor", name: "Ada Okafor", phone: "0803 000 0000", email: "ada@example.com", joined: "Jun 2026", orders: 14, status: "Active" },
  { id: "kunle-ojo", name: "Kunle Ojo", phone: "0803 000 0201", email: "kunle@example.com", joined: "Jul 2026", orders: 3, status: "Restricted" },
  { id: "funmi-eze", name: "Funmi Eze", phone: "0803 000 0202", email: "funmi@example.com", joined: "Aug 2026", orders: 6, status: "Active" },
  { id: "tunde-bello", name: "Tunde Bello", phone: "0803 000 0203", email: "tunde@example.com", joined: "Sep 2026", orders: 2, status: "Active" },
];

export type OrgTab = "all" | "pending" | "verified" | "restricted" | "tiers";
export const ORGS = [
  { id: "south-circle", name: "South Circle", type: "Business", events: 24, payout: "Failed", status: "Verified", tier: "Trusted Host", owner: "Yemi Ogun", verified: "Thu 2 Oct" },
  { id: "lagos-outdoor-club", name: "Lagos Outdoor Club", type: "Community", events: 9, payout: "None", status: "Checks pending", tier: "Host", owner: "Tobi Lawal", verified: "" },
  { id: "grace-hall", name: "Grace Hall", type: "Institution", events: 31, payout: "Active", status: "Verified", tier: "Headliner", owner: "Pastor Femi", verified: "Mon 4 Aug" },
  { id: "sun-club", name: "Sun Club", type: "Business", events: 2, payout: "Verifying", status: "Pending review", tier: "Host", owner: "Bisi Ade", verified: "" },
  { id: "unknown-promo", name: "Unknown Promo", type: "Individual", events: 1, payout: "None", status: "Restricted", tier: "Host", owner: "Unknown", verified: "" },
  { id: "ember-house", name: "Ember House", type: "Business", events: 0, payout: "Active", status: "Verified", tier: "Trusted Host, by hand", owner: "Bisi Adeyemi", verified: "Mon 6 Oct" },
];
export const ORG_TABS: Record<OrgTab, string[]> = {
  all: ["south-circle", "lagos-outdoor-club", "grace-hall", "sun-club"],
  pending: ["sun-club"],
  verified: ["south-circle", "grace-hall"],
  restricted: ["unknown-promo"],
  tiers: ["south-circle", "grace-hall", "ember-house"],
};
export const getOrg = (id: string) => ORGS.find((o) => o.id === id);

export type EvTab = "review" | "all" | "reported" | "live" | "cancelled";
export const ADMIN_EVENTS = [
  { id: "sunday-sundowner", title: "Sunday Sundowner", host: "South Circle", date: "Sun 16 Nov", reason: "Possible duplicate", status: "In review" },
  { id: "day-party", title: "Day Party at the Beach", host: "Sun Club", date: "Sat 1 Nov", reason: "Selfie check in review", status: "In review" },
  { id: "free-phone", title: "Free Phone Giveaway Night", host: "Unknown Promo", date: "Sat 25 Oct", reason: "Reported 4 times", status: "Reported", reported: "Scam or fake, 4 reports" },
  { id: "kids-craft", title: "Kids Craft Saturday", host: "Little Hands", date: "Sat 8 Nov", reason: "Selfie check in review", status: "In review" },
  { id: "abnormal-nightout", title: "The Abnormal Nightout", host: "South Circle", date: "Sat 25 Oct", reason: "On sale", status: "Published" },
  { id: "jersey-creek-picnic", title: "Jersey Creek Picnic", host: "Lagos Outdoor Club", date: "Sun 26 Oct", reason: "Free", status: "Published" },
  { id: "late-night-jams", title: "Late Night Jams", host: "Retro Lagos", date: "Sat 15 Nov", reason: "Misleading, 1 report", status: "Reported" },
  { id: "neon-weekender", title: "Neon Weekender", host: "Neon Room", date: "Fri 31 Oct", reason: "Unsafe, 1 report", status: "Reported" },
  { id: "afrobeats-live", title: "Afrobeats Live Session", host: "Sound Hub", date: "Today, 7 PM", reason: "412 checked in", status: "Live" },
  { id: "lekki-food-market", title: "Lekki Food Market", host: "Eat Lagos", date: "Today, 12 PM", reason: "1,020 checked in", status: "Live" },
  { id: "lagoon-boat-party", title: "Lagoon Boat Party", host: "Wave Rides", date: "Sat 4 Oct", reason: "64 refunded", status: "Cancelled" },
];
export const EV_TABS: Record<EvTab, string[]> = {
  review: ["sunday-sundowner", "day-party", "free-phone", "kids-craft"],
  all: ["abnormal-nightout", "sunday-sundowner", "jersey-creek-picnic", "free-phone"],
  reported: ["free-phone", "late-night-jams", "neon-weekender"],
  live: ["afrobeats-live", "lekki-food-market"],
  cancelled: ["lagoon-boat-party"],
};
export const getAdminEvent = (id: string) => ADMIN_EVENTS.find((e) => e.id === id);

export type PlaceTab = "all" | "unclaimed" | "owner" | "changes";
export const ADMIN_PLACES = [
  { id: "skyline-lounge", name: "Skyline Lounge", area: "Victoria Island", cat: "Bars and lounges", by: "Owner", status: "Published" },
  { id: "the-garden-lagos", name: "The Garden Lagos", area: "Ikoyi", cat: "Restaurants", by: "Xiventa", status: "Published" },
  { id: "lagoon-park", name: "Lagoon Park", area: "Ikoyi", cat: "Parks", by: "Xiventa", status: "Published" },
  { id: "kiln-coffee", name: "Kiln Coffee", area: "Yaba", cat: "Cafes", by: "Xiventa", status: "Draft" },
  { id: "play-arena", name: "Play Arena", area: "Ikeja", cat: "Games", by: "Owner", status: "Published" },
];
export const PLACE_TABS: Record<PlaceTab, string[]> = {
  all: ["skyline-lounge", "the-garden-lagos", "lagoon-park", "kiln-coffee"],
  unclaimed: ["kiln-coffee", "lagoon-park", "the-garden-lagos"],
  owner: ["skyline-lounge", "play-arena"],
  changes: [],
};
export const PLACE_CHANGES = [
  { id: "skyline-lounge", name: "Skyline Lounge", area: "Victoria Island", change: "Rename to Skyline Lounge and Grill", by: "Owner" },
  { id: "harbour-hall", name: "Harbour Hall", area: "Lekki", change: "New address", by: "Owner" },
];

export const ADMIN_ORDERS = [
  { code: "XV 7TGT", buyer: "Ada Okafor", event: "The Abnormal Nightout", total: "₦31,500", date: "Mon 20 Oct", status: "Paid" },
  { code: "XV 5RTA", buyer: "Bola Uche", event: "The Abnormal Nightout", total: "₦15,750", date: "Fri 17 Oct", status: "Pending" },
  { code: "XV 1PLQ", buyer: "Emeka Obi", event: "The Abnormal Nightout", total: "₦21,000", date: "Thu 9 Oct", status: "Failed" },
  { code: "XV 2MZD", buyer: "Chiamaka Nwosu", event: "The Abnormal Nightout", total: "₦63,000", date: "Fri 17 Oct", status: "Partly refunded" },
];

export const PAYMENTS = [
  { ref: "PSK 99812 34", order: "XV 7TGT", amount: "₦31,500", method: "Card", time: "Mon 20 Oct, 7:42 PM", state: "Succeeded" },
  { ref: "PSK 99812 77", order: "XV 5RTA", amount: "₦15,750", method: "Transfer", time: "Fri 17 Oct, 9:10 PM", state: "Pending" },
  { ref: "PSK 99811 02", order: "XV 1PLQ", amount: "₦21,000", method: "USSD", time: "Thu 9 Oct, 1:15 PM", state: "Failed" },
  { ref: "PSK 99809 51", order: "XV 0ZZK", amount: "₦8,400", method: "Card", time: "Wed 8 Oct, 6:02 PM", state: "Reversed" },
];
export const REFUNDS = [
  { id: "r1", order: "XV 7TGT", buyer: "Ada Okafor", amount: "₦31,500", reason: "Not let in", state: "Pending", fee: "Yes", source: "Host balance, held funds", note: "Host agreed in case C 1042." },
  { id: "r2", order: "XV 2MZD", buyer: "Chiamaka Nwosu", amount: "₦15,000", reason: "Partial, host", state: "Processed", fee: "No", source: "Host balance", note: "Host refunded two of four tickets." },
  { id: "r3", order: "XV 6WNB", buyer: "Kunle Ojo", amount: "₦90,000", reason: "Event changed", state: "Failed", fee: "Yes", source: "Host balance", note: "Card issuer declined the refund. Retry or pay by transfer." },
];
export const SETTLEMENTS = [
  { id: "s1", host: "South Circle", amount: "₦1,240,000", account: "GTBank ending 4821", state: "Failed" },
  { id: "s2", host: "Grace Hall", amount: "₦3,410,000", account: "Zenith ending 1188", state: "Scheduled" },
  { id: "s3", host: "Sound Hub", amount: "₦920,000", account: "Access ending 0071", state: "Processing" },
  { id: "s4", host: "Laugh Lagos", amount: "₦610,000", account: "UBA ending 5530", state: "On hold" },
];
export const EXCEPTIONS = [
  { id: "x1", ref: "PSK 99812 77", issue: "Partner says paid, ledger says pending", amount: "₦15,750", state: "Open", partner: "Succeeded, Fri 17 Oct 9:11 PM", ledger: "Pending", order: "XV 5RTA · Bola Uche", note: "Webhook missed. Marking order paid and sending tickets." },
  { id: "x2", ref: "PSK 99790 11", issue: "Ledger refund with no partner record", amount: "₦8,000", state: "Open", partner: "No record", ledger: "Refunded", order: "XV 0ZZK · Femi D.", note: "Check with the payment partner before closing." },
  { id: "x3", ref: "PSK 99701 40", issue: "Amount mismatch by ₦100", amount: "₦12,100", state: "Resolved", partner: "₦12,100", ledger: "₦12,000", order: "XV 3QWE · Ngozi E.", note: "Rounding on an old fee rule. Ledger corrected." },
];

export const CATEGORIES = [
  ["Nightlife and parties", "Event", "Rooftop, Clubs, Day parties", "412"],
  ["Music", "Event", "Live, DJ sets, Concerts", "280"],
  ["Food and drink", "Event and place", "Markets, Tastings, Restaurants", "366"],
  ["Faith and spirituality", "Event", "Services, Retreats, Concerts", "190"],
  ["Outdoors and travel", "Event and place", "Picnics, Parks, Trips", "154"],
];
export const COLLECTIONS = [
  ["Best of this weekend", "Lagos", "6", "Thu 23 to Sun 26 Oct", "Live"],
  ["Halloween in Lagos", "Lagos", "8", "Mon 27 Oct to Fri 31 Oct", "Scheduled"],
  ["Rooftop summer", "Lagos", "10", "Ended Sun 28 Sep", "Expired"],
  ["Detty December picks", "Lagos", "0", "Not scheduled", "Draft"],
];
export const AREAS: [string, string, number, number, boolean][] = [
  ["Victoria Island", "Island", 312, 204, true],
  ["Lekki", "Island", 280, 190, true],
  ["Ikeja", "Mainland", 96, 120, true],
  ["Ikorodu", "Mainland", 8, 12, false],
];
export const CLIPS = [
  { id: "c1", clip: "The Abnormal Nightout", host: "South Circle", waiting: "3 hours", state: "Pending" },
  { id: "c2", clip: "Day Party at the Beach", host: "Sun Club", waiting: "2 hours", state: "Pending" },
  { id: "c3", clip: "Friday Rush", host: "Skyline Lounge", waiting: "Live", state: "Pinned" },
  { id: "c4", clip: "Neon clip", host: "Unknown Promo", waiting: "Rejected", state: "Rejected" },
];
export const LISTINGS = [
  { id: "l1", title: "Afro Night Market", ig: "@afronightmkt.official", waiting: "2 hours", flag: "Lookalike name", info: "Instagram: @afronightmkt.official · 5 weeks old · 410 followers · not Instagram verified. Flag: name is close to @afronightmarket (verified host on Xiventa)." },
  { id: "l2", title: "Beach Rave Lagos", ig: "@beachravelagos", waiting: "5 hours", flag: "New account", info: "Instagram: @beachravelagos · 3 weeks old · 2,100 followers · not Instagram verified." },
  { id: "l3", title: "Owambe Thursdays", ig: "@owambethursdays", waiting: "1 day", flag: "Few followers", info: "Instagram: @owambethursdays · 8 months old · 140 followers · not Instagram verified." },
  { id: "l4", title: "Detty Fest Tickets", ig: "@dettyfest.tix", waiting: "Rejected", flag: "Rejected", info: "Rejected: selling tickets for an event they do not run." },
];
export const PLACE_CLAIMS = [
  { id: "pc1", place: "Skyline Lounge", by: "Skyline Lounge Ltd", proof: "Phone code", state: "Approved" },
  { id: "pc2", place: "Kiln Coffee", by: "Kiln Ventures", proof: "CAC document", state: "Pending" },
  { id: "pc3", place: "The Garden Lagos", by: "Two claims", proof: "Photo", state: "Disputed" },
  { id: "pc4", place: "Bukka Corner (new)", by: "Ade Foods", proof: "Photo", state: "Pending" },
];
export const SUGGESTIONS = [
  { id: "ps1", place: "Ewa Garden Bar", by: "Guest · 2 photos", area: "Lekki", state: "New", line: "Suggested by a guest · Bars & Lounges · Admiralty Way, Lekki Phase 1", dup: "No match" },
  { id: "ps2", place: "Bukka Hut Yaba", by: "Guest", area: "Yaba", state: "Possible duplicate", line: "Suggested by a guest · Restaurants · Herbert Macaulay Way, Yaba", dup: "Close to Bukka Hut, Yaba" },
  { id: "ps3", place: "Lagoon Kayak Club", by: "Guest · 1 photo", area: "Lagos Island", state: "Published", line: "Suggested by a guest · Outdoors · Tarzan Jetty", dup: "No match" },
];
export const GUEST_PHOTOS = [
  { id: "gp1", place: "Skyline Lounge", from: "Tolu A.", photos: 3, state: "Pending" },
  { id: "gp2", place: "The Garden Lagos", from: "Chidi O.", photos: 2, state: "Pending" },
  { id: "gp3", place: "Kiln Coffee", from: "Review photo", photos: 1, state: "Removed" },
];
export const REPORTED_REVIEWS = [
  { id: "rr1", on: "Skyline Lounge", by: "Bisi K.", reason: "Spam", state: "Open", line: "By Bisi K. · 3 stars · Reported by the Skyline Lounge team", text: "Nice space but parking was full by 8 PM. The valet helped in the end." },
  { id: "rr2", on: "Afrobeats Live Session", by: "Femi D.", reason: "Hate or harassment", state: "Open", line: "By Femi D. · 1 star · Reported by 3 guests", text: "Review text hidden while it is checked." },
  { id: "rr3", on: "The Garden Lagos", by: "Ngozi E.", reason: "Not a real visit", state: "Kept", line: "By Ngozi E. · 2 stars · Reported by the owner", text: "Food took an hour and nobody told us why." },
];
export const VENUE_DECLINES = [
  { id: "vd1", event: "Ladies Night", host: "Ife Events", venue: "Skyline Lounge", state: "Open", date: "Fri 7 Nov", tier: "Trusted Host", sold: 46, said: "We didn't agree to this." },
  { id: "vd2", event: "Sunday Jazz Brunch", host: "Ember House", venue: "The Garden Lagos", state: "Shown", date: "Sun 9 Nov", tier: "Trusted Host", sold: 30, said: "Wrong date." },
];

export const SUPPORT_CASES = [
  { id: "C 1042", from: "Ada Okafor", about: "Not let in", state: "With host", title: "Not let in with a valid ticket", order: "XV 7TGT", reply: "We have asked the host to respond. You will hear back within 48 hours." },
  { id: "C 1039", from: "Bola Uche", about: "Wrong charge", state: "With Xiventa", title: "Charged twice for one ticket", order: "XV 5RTA", reply: "Only one payment went through. The other was reversed by your bank." },
  { id: "C 1036", from: "Tolu Bakare", about: "Cannot sign in", state: "Open", title: "Code never arrives", order: "None", reply: "We have reset your sign in. Try again with your phone number." },
  { id: "C 1031", from: "Kunle Ojo", about: "Event changed", state: "Resolved", title: "The date changed", order: "XV 6WNB", reply: "Refunded in full." },
];
export const REPORTS = [
  { id: "rp1", item: "Free Phone Giveaway Night", type: "Event", reason: "Scam or fake", reports: 4, state: "Open", line: "4 reports: asks people to pay a fee to claim a phone." },
  { id: "rp2", item: "Neon clip", type: "Spotlight", reason: "Unsafe", reports: 1, state: "Open", line: "1 report: shows a crowd crush near the stage." },
  { id: "rp3", item: "Unknown Promo", type: "Host", reason: "Pretending", reports: 2, state: "Appealed", line: "2 reports: uses another promoter's name. The host appealed the restriction." },
  { id: "rp4", item: "Late Night Jams", type: "Event", reason: "Misleading", reports: 1, state: "Dismissed", line: "1 report: line up changed. Host updated the event." },
];
export const FRAUD = [
  { id: "f1", signal: "12 cards on one phone in an hour", type: "Orders", score: "High", state: "Open", detail: "12 · ₦540,000 · The Abnormal Nightout", account: "Created today", partner: "4 declined, 8 succeeded" },
  { id: "f2", signal: "New host, payout account changed twice", type: "Payout", score: "Medium", state: "Open", detail: "Sun Club · 2 changes in 5 days", account: "Created Sun 4 Oct", partner: "No payouts yet" },
  { id: "f3", signal: "Resale above face value reported", type: "Account", score: "Low", state: "Cleared", detail: "1 report · Funmi Eze", account: "Created Aug 2026", partner: "Normal" },
];

export const SCANS = [
  ["9:42 PM", "Gate A", "Dayo Ade", "Android, app 1.4", "Online", "Valid"],
  ["9:45 PM", "Gate B", "Seyi Martins", "iPhone, app 1.4", "Offline, synced 9:51 PM", "Already used"],
  ["9:46 PM", "Gate B", "Seyi Martins", "iPhone, app 1.4", "Offline, synced 9:51 PM", "Already used"],
];

export const KPIS: [string, string, string, "up" | "down"][] = [
  ["Active people", "82,400", "Up 9%", "up"],
  ["Tickets sold", "18,920", "Up 14%", "up"],
  ["Gross sales", "₦284,000,000", "Up 11%", "up"],
  ["Check in rate", "87%", "Up 2 points", "up"],
  ["New hosts", "312", "Up 6%", "up"],
  ["Events published", "1,140", "Up 8%", "up"],
  ["Refund rate", "1.9%", "Down 0.4 points", "down"],
  ["Search with no results", "6%", "Down 1 point", "down"],
];
export const CATEGORY_SALES = [
  ["Nightlife and parties", "412", "8,410", "₦126,000,000"],
  ["Music", "280", "5,220", "₦78,000,000"],
  ["Food and drink", "366", "2,960", "₦31,000,000"],
];

export const STAFF = [
  { name: "Kemi Adebayo", role: "Operations admin", scope: "All of Lagos", twoStep: "On" },
  { name: "Chidi Eze", role: "Finance", scope: "Payments, refunds, payouts", twoStep: "On" },
  { name: "Amaka Nwosu", role: "Moderator", scope: "Events, places, Spotlight", twoStep: "On" },
  { name: "Seun Bakare", role: "Support", scope: "Cases and users", twoStep: "Off" },
];
export const AUDIT = [
  ["Tue 6 Oct, 9:14 AM", "Kemi Adebayo", "Approved verification", "Host: Grace Hall"],
  ["Tue 6 Oct, 8:50 AM", "Chidi Eze", "Processed refund ₦15,000", "Order XV 2MZD"],
  ["Mon 5 Oct, 6:02 PM", "Amaka Nwosu", "Rejected Spotlight clip", "Clip: Neon clip"],
  ["Mon 5 Oct, 4:40 PM", "Kemi Adebayo", "Changed waitlist offer hold", "Platform configuration"],
  ["Mon 5 Oct, 11:21 AM", "Seun Bakare", "Restricted account", "User: Kunle Ojo"],
];
export const AUDIT_TIERS = [
  ["Sat 11 Oct, 9:02 AM", "Kemi Adebayo, approved by Chidi Eze", "Trusted Host paid as tickets sell: 50% to 60%", "Host tiers and payouts"],
  ["Fri 10 Oct, 4:15 PM", "Kemi Adebayo, approved by Chidi Eze", "Override set: reserve 50% until Sat 31 Jan", "Host: Lagos Outdoor Club"],
  ["Tue 7 Oct, 10:12 AM", "Kemi Adebayo", "Tier changed by hand: Host to Trusted Host", "Host: Ember House"],
  ["Mon 6 Oct, 11:40 PM", "System", "Tier dropped: Trusted Host to Host, refunds owed", "Host: South Circle"],
  ["Sun 5 Oct, 2:30 PM", "Seun Bakare, approved by Kemi Adebayo", "Cooling off period: 5 days to 7 days", "Host tiers and payouts"],
];
export const RISK_RULES: [string, string, string, boolean][] = [
  ["More than 5 cards on one device in an hour", "Fraud review", "3", true],
  ["Payout account changed within 7 days of payout", "Fraud review", "1", true],
  ["Event reported 3 or more times", "Reports", "4", true],
  ["New host selling over ₦1,000,000 in a day", "Fraud review", "0", false],
];
export const PLATFORMS: [string, string, string, string, boolean][] = [
  ["Google Meet", "Video call", "meet.google.com/...", "42", true],
  ["Zoom", "Video call", "zoom.us/j/...", "31", true],
  ["Instagram Live", "Live stream", "instagram.com/...", "18", true],
  ["TikTok Live", "Live stream", "tiktok.com/@...", "12", true],
  ["YouTube Live", "Live stream", "youtube.com/live/...", "9", true],
  ["X Spaces", "Audio", "x.com/i/spaces/...", "0", false],
];
