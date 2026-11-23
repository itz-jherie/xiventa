import { EVENTS, img } from "./events";
import type { XiventaEvent } from "./types";
import { defaultState } from "@/lib/eventState";

export interface Host {
  slug: string;
  name: string;
  initials: string;
  verified: boolean;
  kind: string;
  webKind: string;
  bio: string;
  webBio: string;
  hosted: number;
  rating: number;
  ratings: number;
  cover: string;
  webCover: string;
  upcoming: XiventaEvent[];
  past: XiventaEvent[];
}

const slugify = (s: string) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const COPY: Record<string, Partial<Host>> = {
  "south-circle": {
    kind: "Individual host · Lagos · Hosting since 2023",
    webKind: "Party host · Victoria Island · Hosting since 2021",
    bio: "Parties with good music and a safe door. We run The Abnormal Nightout, Hangover Friday and day parties across the Island.",
    webBio: "Rooftop parties and day raves around Lagos. Good music, good people, late finishes.",
    hosted: 24,
    rating: 4.6,
    ratings: 128,
    cover: img("bf806b66"),
    webCover: img("54e3dedd"),
  },
};

/** Organizer profiles (AM25 / PW09), built from the hosts in the event data. */
export function getHosts(): Host[] {
  const byHost = new Map<string, XiventaEvent[]>();
  for (const e of EVENTS) byHost.set(e.hostName, [...(byHost.get(e.hostName) ?? []), e]);
  return [...byHost.entries()].map(([name, events]) => {
    const slug = slugify(name);
    const ended = (e: XiventaEvent) => ["ended", "cancelled"].includes(defaultState(e));
    const first = events[0];
    const base: Host = {
      slug,
      name,
      initials: first.hostInitials ?? name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
      verified: !first.isListing,
      kind: `${first.isListing ? "Instagram host" : "Organizer"} · Lagos · Hosting since 2024`,
      webKind: `Organizer · ${first.neighborhood} · Hosting since 2024`,
      bio: first.description || `${name} hosts events around Lagos.`,
      webBio: first.description || `${name} hosts events around Lagos.`,
      hosted: events.length + 6,
      rating: 4.5,
      ratings: 40,
      cover: first.imageUrl,
      webCover: first.heroImageUrl ?? first.imageUrl,
      upcoming: events.filter((e) => !ended(e)),
      past: events.filter(ended),
    };
    return { ...base, ...COPY[slug] };
  });
}

export const getHost = (slug: string) => getHosts().find((h) => h.slug === slug);
