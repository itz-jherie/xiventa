import type { XiventaEvent } from "@/data";

/**
 * Every AM21 / PW06 event state in Figma. Each event in the static data has a default state
 * (STATE_BY_SLUG); `?state=<key>` on the event URL previews any other one.
 */
export type EventStateKey =
  | "paid"
  | "hidden-location"
  | "sold-out"
  | "recurring"
  | "free-ticket"
  | "free-limited"
  | "free-going"
  | "im-going"
  | "request"
  | "request-sent"
  | "invite"
  | "virtual"
  | "virtual-going"
  | "live"
  | "live-now"
  | "hybrid"
  | "instagram"
  | "have-ticket"
  | "cancelled"
  | "ended";

export const EVENT_STATES: EventStateKey[] = [
  "paid", "hidden-location", "sold-out", "recurring", "free-ticket", "free-limited", "free-going", "im-going",
  "request", "request-sent", "invite", "virtual", "virtual-going", "live", "live-now", "hybrid", "instagram",
  "have-ticket", "cancelled", "ended",
];

const STATE_BY_SLUG: Record<string, EventStateKey> = {
  "abnormal-nightout": "paid",
  "jersey-creek-picnic": "free-limited",
  "friday-rush": "recurring",
  "the-backyard-party": "recurring",
  "connect-lagos": "virtual",
  "define-your-brand": "virtual",
  "midweek-prayer-online": "virtual",
  "album-listening-live": "live",
  "emerging-leaders-forum": "hybrid",
  "lekki-food-market": "instagram",
  "halloween-rooftop": "sold-out",
  "hangover-friday": "ended",
  "sunday-sundowner": "ended",
  "afrobeats-live-session": "ended",
  "saturn-saturday": "cancelled",
  "picnic-in-the-park": "request",
  "kids-wonderland-day": "invite",
  "sunday-praise-gathering": "free-going",
  "sunrise-yoga-by-the-water": "free-ticket",
  "day-party-at-the-beach": "hidden-location",
  "supper-at-the-secret-garden": "invite",
};

export function defaultState(e: XiventaEvent): EventStateKey {
  const s = STATE_BY_SLUG[e.slug];
  if (s) return s;
  if (e.isListing) return "instagram";
  if (e.status === "sold-out") return "sold-out";
  if (e.format?.kind === "live") return "live";
  if (e.format?.kind === "online") return "virtual";
  if (e.format?.kind === "hybrid") return "hybrid";
  if (e.recurrence) return "recurring";
  if (e.isFree) return "free-ticket";
  return "paid";
}

export function resolveState(e: XiventaEvent, override?: string | null): EventStateKey {
  return override && (EVENT_STATES as string[]).includes(override) ? (override as EventStateKey) : defaultState(e);
}

const MAINLAND = ["Ikeja", "Yaba", "Surulere", "Maryland", "Gbagada", "Ogba", "Magodo", "Festac"];
const sideOf = (n: string) => (MAINLAND.includes(n) ? "Mainland" : "Island");

export type Row = { icon: "calendar" | "pin" | "ticket" | "video" | "star"; title: string; subtitle: string; href?: "directions" | "calendar" | "reviews" };
export type Block = "waitlist" | "cancelled" | "ended" | "join" | "other-dates" | "instagram";
export type Tone = "pink" | "green" | "red" | "grey" | "blue";

export interface EventView {
  state: EventStateKey;
  online: boolean;
  /** Venue section (map and place card) on the app, map on the web */
  showVenue: boolean;
  /** Extra pills after the category tag (AM21 `Tags`) */
  pills: { label: string; tone: Tone; dot?: boolean }[];
  rows: Row[];
  block?: Block;
  bar: { label?: string; price: string; action: string; tone?: "primary" | "outline" };
  /** PW06 right column card */
  web: {
    title: string;
    price?: string;
    body?: string;
    action: string;
    note: string;
    tiers?: "buy" | "sold-out" | "dated";
    secondary?: boolean;
  };
  ratingRow?: Row;
}

/** "Sat 25 Oct, 9 PM to 3 AM" -> ["Sat 25 Oct", "9 PM to 3 AM"] */
function splitWhen(e: XiventaEvent): [string, string] {
  const full = e.timeRangeLabel ?? e.dateLabel;
  const i = full.indexOf(",");
  return i > 0 ? [full.slice(0, i), full.slice(i + 1).trim()] : [full, ""];
}

export function buildView(e: XiventaEvent, state: EventStateKey): EventView {
  const [day, time] = splitWhen(e);
  const where = `${e.neighborhood}, ${sideOf(e.neighborhood)} · ${e.slug === "jersey-creek-picnic" ? "6.2" : "3.1"} km`;
  const date: Row = { icon: "calendar", title: day, subtitle: time ? `${time} · Add to calendar` : "Add to calendar", href: "calendar" };
  const venue: Row = { icon: "pin", title: e.venueName, subtitle: where, href: "directions" };
  const goesUp = e.tiers?.[0]?.description.match(/Goes up to ([^.]+)\./)?.[1];
  const from = e.isFree ? "Free" : `From ${e.displayPrice}`;
  const platform = e.format?.label.split(" · ")[1] ?? "Zoom";
  const statusPill = e.status === "selling-fast" ? [{ label: "Selling fast", tone: "pink" as Tone, dot: true }] : [];
  const age = e.ageRestriction ? [{ label: e.ageRestriction, tone: "grey" as Tone }] : [{ label: "All ages", tone: "grey" as Tone }];
  const base: EventView = {
    state,
    online: false,
    showVenue: true,
    pills: [...age, ...statusPill],
    rows: [date, venue, { icon: "ticket", title: goesUp ? `${e.displayPrice} now` : from, subtitle: goesUp ? `Goes up to ${goesUp} on the night` : e.tiers ? `${e.tiers.length} ticket types` : "General admission" }],
    bar: { label: e.isFree ? undefined : "From", price: e.displayPrice, action: "Get tickets" },
    web: { title: "Tickets", action: "Get tickets", note: "Refunds follow the host’s refund policy. Prices include the service fee shown at checkout.", tiers: "buy" },
  };
  const free = (ticket: Row, action: string, web: EventView["web"]): EventView => ({
    ...base,
    rows: [date, venue, ticket],
    bar: { price: "Free", action },
    web,
  });

  switch (state) {
    case "paid":
      return base;
    case "hidden-location":
      return {
        ...base,
        showVenue: false,
        rows: [date, { icon: "pin", title: e.neighborhood, subtitle: "Exact address shows in your ticket" }, { icon: "ticket", title: from, subtitle: "3 ticket types, tables available" }],
      };
    case "sold-out":
      return {
        ...base,
        pills: [...age, { label: "Sold out", tone: "red", dot: true }],
        rows: [date, venue, { icon: "ticket", title: "Sold out", subtitle: "Join the waitlist. We offer you a ticket the moment one frees up." }],
        block: "waitlist",
        bar: { label: "From", price: e.displayPrice, action: "Join waitlist" },
        web: { ...base.web, action: "Join waitlist", note: "We offer you a ticket the moment one frees up. Each offer is held for a short time.", tiers: "sold-out" },
      };
    case "recurring":
      return {
        ...base,
        pills: [...(e.recurrence ? [{ label: e.recurrence, tone: "grey" as Tone }] : []), ...age],
        rows: [
          { ...date, title: `Next: ${day}`, subtitle: `${e.recurrence ?? "Every week"}, ${time || "10 PM to 4 AM"} · Add to calendar` },
          venue,
          { icon: "ticket", title: from, subtitle: "Tickets are for one date. Tables available" },
          { icon: "star", title: `Rated 4.6 across past ${(e.recurrence ?? "Every Friday").replace("Every ", "")}s`, subtitle: "212 ratings from guests who went", href: "reviews" },
        ],
        block: "other-dates",
        web: { ...base.web, note: "Tickets are for one date. Each date sells on its own.", tiers: "dated" },
      };
    case "free-ticket":
      return free({ icon: "ticket", title: "Free", subtitle: "Free ticket · Show the QR code at the door" }, "Get a free ticket", {
        title: "Free ticket", price: "Free", body: "Free ticket. Show the QR code at the door.", action: "Get a free ticket", note: "We save your ticket to My events and email it to you.",
      });
    case "free-limited":
      return free({ icon: "ticket", title: "Free", subtitle: "150 spots · 38 left. You get a QR ticket" }, "Get a free ticket", {
        title: "Free ticket", price: "Free", body: "150 spots · 38 left. You get a QR ticket.", action: "Get a free ticket", note: "We save your ticket to My events and email it to you.",
      });
    case "free-going":
      return free({ icon: "ticket", title: "Free", subtitle: "240 going · No ticket needed" }, "I'm going", {
        title: "Free entry", price: "Free", body: "240 going. No ticket needed, just show up.", action: "I'm going", note: "Tap I'm going and we remind you the day before.",
      });
    case "im-going":
      return {
        ...free({ icon: "ticket", title: "Free", subtitle: "You're going · No ticket needed" }, "Add to calendar", {
          title: "You're going", price: "Free", body: "It's in My events. We remind you the day before. No ticket needed at the gate.", action: "Add to calendar", note: "Plans changed? Remove it from My events.", secondary: true,
        }),
        pills: [...age, { label: "You're going", tone: "green", dot: true }],
      };
    case "request":
      return free({ icon: "ticket", title: "Free", subtitle: "The host approves each guest" }, "Request to join", {
        title: "Request to join", price: "Free", body: "The host approves each guest.", action: "Request to join", note: "We tell you by email and in the app when the host replies.",
      });
    case "request-sent":
      return {
        ...free({ icon: "ticket", title: "Request sent", subtitle: `Waiting for ${e.hostName} to approve` }, "Cancel request", {
          title: "Request sent", price: "Free", body: `Waiting for ${e.hostName} to approve your request.`, action: "Cancel request", note: "Requests close when the event starts.", secondary: true,
        }),
        bar: { price: "Free", action: "Cancel request", tone: "outline" },
        pills: [...age, { label: "Request sent", tone: "blue", dot: true }],
      };
    case "invite":
      return {
        ...free({ icon: "ticket", title: e.isFree ? "Free" : e.displayPrice, subtitle: "Invite only · Your invite lets you in" }, "Accept invite", {
          title: "Invite only", price: e.displayPrice, body: "Your invite lets you in. 4 seats left.", action: "Accept invite", note: "Only people with the invite link can see this event.",
        }),
        bar: { label: e.isFree ? undefined : "Price", price: e.displayPrice, action: "Accept invite" },
        // PW06 Invite only: the exact address stays hidden until you have a ticket.
        showVenue: false,
        rows: [date, { icon: "pin", title: `${e.neighborhood}, ${sideOf(e.neighborhood)}`, subtitle: "Exact address shows in your ticket" }, { icon: "ticket", title: e.isFree ? "Free" : e.displayPrice, subtitle: "Invite only · Your invite lets you in" }],
        pills: [...age, { label: "Invite only", tone: "pink" as Tone }],
      };
    case "virtual":
    case "virtual-going": {
      const going = state === "virtual-going";
      return {
        ...base,
        online: true,
        showVenue: false,
        pills: [{ label: e.format?.label ?? `Online · ${platform}`, tone: "blue" }, ...(going ? [{ label: "You're going", tone: "green" as Tone, dot: true }] : age)],
        rows: [
          { ...date, subtitle: `${time} WAT · Add to calendar` },
          { icon: "video", title: `Happens on ${platform}`, subtitle: "Join opens 15 min before" },
          { icon: "ticket", title: e.isFree ? "Free" : e.displayPrice, subtitle: going ? "You're going" : e.isFree ? "Join link shows once you're going" : "30 spots · Join link in your ticket" },
        ],
        block: "join",
        bar: going
          ? { price: e.isFree ? "Free" : e.displayPrice, action: "Join details", tone: "outline" }
          : e.isFree
            ? { price: "Free", action: "I'm going" }
            : { label: "From", price: e.displayPrice, action: "Get tickets" },
        web: e.isFree
          ? { title: going ? "You're going" : "Free", price: "Free", body: going ? `Join link opens 15 min before on ${platform}.` : "Join link shows once you're going.", action: going ? "Join details" : "I'm going", note: `Only guests see the ${platform} link.`, secondary: going }
          : { title: "Workshop pass", price: e.displayPrice, body: "30 spots · Join link in your ticket", action: "Get tickets", note: "Only ticket holders see the link and passcode." },
      };
    }
    case "live":
    case "live-now": {
      const now = state === "live-now";
      return {
        ...base,
        online: true,
        showVenue: false,
        pills: [{ label: e.format?.label ?? "Live · Instagram", tone: "blue" }, ...(now ? [{ label: "Live now", tone: "red" as Tone, dot: true }] : age)],
        rows: [
          now ? { ...date, title: "Today", subtitle: `${time} WAT` } : { ...date, subtitle: `${time} WAT · Add to calendar` },
          { icon: "video", title: "Live on Instagram", subtitle: "@kolademusic" },
          { icon: "ticket", title: "Free", subtitle: now ? "No ticket needed" : "Public livestream · No ticket needed" },
        ],
        block: "join",
        bar: { price: "Free", action: now ? "Watch on Instagram" : "Remind me" },
        web: { title: "Public livestream", price: "Free", body: "No ticket needed. Watch on Instagram.", action: now ? "Watch on Instagram" : "Remind me", note: "Opens in the Instagram app. Xiventa does not host the session." },
      };
    }
    case "hybrid":
      return {
        ...base,
        pills: [{ label: e.format?.label ?? "Hybrid · Zoom", tone: "blue" }, ...age],
        rows: [{ ...date, subtitle: `${time} WAT · Add to calendar` }, venue, { icon: "video", title: `Also on ${platform}`, subtitle: "For online ticket holders" }, { icon: "ticket", title: from, subtitle: "In person and online tickets" }],
        web: { title: "Tickets", price: from, body: "In person and online tickets", action: "Get tickets", note: `Online tickets get the ${platform} link in the ticket.` },
      };
    case "instagram":
      return {
        ...base,
        rows: [date, venue, { icon: "ticket", title: from, subtitle: `Sold by ${e.hostName} on Instagram · Instagram connected` }],
        block: "instagram",
        bar: { label: "From", price: e.displayPrice, action: "See on Instagram" },
        web: { title: "Tickets", price: from, body: `Sold by ${e.hostName} on Instagram`, action: "See on Instagram", note: "Payments, refunds and entry are handled by the host, not Xiventa. Only pay accounts you trust." },
      };
    case "have-ticket":
      return {
        ...base,
        pills: [...age, { label: "You have a ticket", tone: "green", dot: true }],
        rows: [date, venue, { icon: "ticket", title: "2 Regular tickets", subtitle: "Show the QR code at the door" }],
        bar: { label: "Your tickets", price: "2 Regular", action: "View my tickets" },
        web: { title: "You have a ticket", body: `2 Regular tickets for ${day}. Show the QR code at the door.`, action: "View my tickets", note: "Your tickets are also in My events and in your email." },
      };
    case "cancelled":
      return {
        ...base,
        pills: [...age, { label: "Cancelled", tone: "red", dot: true }],
        rows: [{ ...date, subtitle: "Cancelled by the host", href: undefined }, venue, { icon: "ticket", title: "No longer on sale", subtitle: "Ticket holders have been notified" }],
        block: "cancelled",
        bar: { label: "From", price: e.displayPrice, action: "See similar events", tone: "outline" },
        web: { title: "Sales closed", body: "Ticket holders get a full refund under Xiventa cancellation rules. No action needed.", action: "See similar events", note: base.web.note },
      };
    case "ended":
      return {
        ...base,
        pills: [...age, { label: "Ended", tone: "grey", dot: true }],
        rows: [{ ...date, subtitle: `Ended at ${time.split(" to ")[1] ?? "late"}`, href: undefined }, venue, { icon: "ticket", title: "Sales closed", subtitle: "Rated 4.5 by 86 guests" }],
        block: "ended",
        bar: { label: "From", price: e.displayPrice, action: `More from ${e.hostName}`, tone: "outline" },
        web: { title: "Sales closed", body: "Tickets are no longer on sale. Have a ticket? Your receipt stays in My events.", action: "See what’s next", note: base.web.note },
        ratingRow: { icon: "star", title: "Rated 4.5 by 86 guests", subtitle: "See reviews", href: "reviews" },
      };
  }
}

export const TONES: Record<Tone, { bg: string; fg: string; dot: string }> = {
  pink: { bg: "#FDEEF3", fg: "#C81E57", dot: "#E22765" },
  green: { bg: "#E3F8EF", fg: "#067647", dot: "#067647" },
  red: { bg: "#FFECEB", fg: "#C0231A", dot: "#FA443A" },
  grey: { bg: "#E9EDF1", fg: "#33465A", dot: "#68788A" },
  blue: { bg: "#E6F1FF", fg: "#0059BE", dot: "#0278FB" },
};
