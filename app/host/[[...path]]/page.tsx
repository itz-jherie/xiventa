"use client";

import { Suspense, useEffect, useSyncExternalStore } from "react";
import { getDashEvent } from "@/data/dashboard";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/session";
import { useHosted } from "@/lib/hosting";
import { ChangePayout, EarlyPayouts, HostHub, HostProfile, SetupStatus, Team, Wallet } from "@/components/host/HostHub";
import { CancelEvent, EditEvent, EditReview, EventOverview, HostClip, HostShare, HostTickets } from "@/components/host/HostEvent";
import { Attendees, FindGuest, LiveCount, PromoterInvite, PromoterLink, Promoters, Requests, Staff, StaffInvite } from "@/components/host/HostPeople";
import { Scanner } from "@/components/host/HostScanner";
import { AddPlace, Amenities, Hours, MenuContact, NewPlace, PlaceProof, PlaceReviews, VenueRequests, YourPlace } from "@/components/host/HostPlace";

/**
 * Organizer app (flow 7a, OM01 to OM33). One client route:
 * /host (OM01, ?tab) · /host/event/[id] (OM02, ?state=doors | ended | venue-wait | venue-declined |
 * listing-review | listing-hidden) and its tools: edit, edit-review, tickets, attendees, scan
 * (?state=offline | valid | used), find, count, cancel, staff, clip (?state=rejected), requests, share,
 * promoters, promoters-invite · /host/{profile, setup, payout, wallet (?state=tier), wallet-early, team,
 * staff-invite, promoter/[id]} · /host/place (OM24, ?state=review) and add, new, proof (?claim=1),
 * hours, amenities, requests, reviews, contact.
 * Access is not checked yet beyond signed in (see claude/xiventa-auth-todo.md).
 */
const EVENT_TOOLS: Record<string, (p: { id: string }) => React.ReactElement> = {
  "": EventOverview,
  edit: EditEvent,
  "edit-review": EditReview,
  tickets: HostTickets,
  attendees: Attendees,
  scan: Scanner,
  find: FindGuest,
  count: LiveCount,
  cancel: CancelEvent,
  staff: Staff,
  clip: HostClip,
  requests: Requests,
  share: HostShare,
  promoters: Promoters,
  "promoters-invite": PromoterInvite,
};
const ACCOUNT: Record<string, () => React.ReactElement> = {
  "": HostHub,
  profile: HostProfile,
  setup: SetupStatus,
  payout: ChangePayout,
  wallet: Wallet,
  "wallet-early": EarlyPayouts,
  team: Team,
  "staff-invite": StaffInvite,
};
const PLACE: Record<string, () => React.ReactElement> = {
  "": YourPlace,
  add: AddPlace,
  new: NewPlace,
  proof: PlaceProof,
  hours: Hours,
  amenities: Amenities,
  requests: VenueRequests,
  reviews: PlaceReviews,
  contact: MenuContact,
};

/** Desktop has the web dashboard (OW) for most organizer screens; the rest keep the app column. */
const EVENT_WEB: Record<string, string> = { "": "", edit: "details", "edit-review": "details", tickets: "tickets", attendees: "attendees", staff: "check-in", count: "check-in", cancel: "cancel", clip: "clip", requests: "cases", share: "promote", promoters: "promote?tab=promoters", "promoters-invite": "promote?tab=promoters" };
const PAGE_WEB: Record<string, string> = { "": "/dashboard", profile: "/dashboard/settings", setup: "/dashboard/settings/verification", payout: "/dashboard/settings/payout", wallet: "/dashboard/wallet", team: "/dashboard/settings/team", "place/": "/dashboard/settings/place", "place/add": "/dashboard/settings/place/claim", "place/new": "/dashboard/settings/place/new", "place/hours": "/dashboard/settings/place", "place/amenities": "/dashboard/settings/place", "place/contact": "/dashboard/settings/place", "place/requests": "/dashboard/settings/place/requests", "place/reviews": "/dashboard/settings/place/reviews" };
function webHref(path: string[]): string | null {
  const [a = "", b = "", c = ""] = path;
  if (a === "event") {
    if (!(c in EVENT_WEB) || !getDashEvent(b)) return null;
    const t = EVENT_WEB[c];
    return `/dashboard/events/${b}${t ? `/${t}` : ""}`;
  }
  if (a === "place") return PAGE_WEB[`place/${b}`] ?? null;
  return path.length <= 1 ? (PAGE_WEB[a] ?? null) : null;
}
const subscribeMq = (cb: () => void) => {
  const mq = window.matchMedia("(min-width: 768px)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

export default function HostPage() {
  return (
    <Suspense fallback={null}>
      <Host />
    </Suspense>
  );
}

function Host() {
  const { path = [] } = useParams<{ path?: string[] }>();
  const router = useRouter();
  const session = useSession();
  const hosted = useHosted();
  const guest = session !== undefined && session?.status !== "signed-in";
  const [a = "", b = "", c = ""] = path;

  let id: string | null = null;
  let EventTool: ((p: { id: string }) => React.ReactElement) | undefined;
  let View: (() => React.ReactElement) | undefined;
  if (a === "event" || a === "promoter") {
    const ev = hosted.find((h) => h.id === b);
    EventTool = a === "promoter" ? (path.length === 2 ? PromoterLink : undefined) : path.length <= 3 ? EVENT_TOOLS[c] : undefined;
    if (ev) id = ev.id;
  } else if (a === "place") {
    if (path.length <= 2) View = PLACE[b];
  } else if (path.length <= 1) View = ACCOUNT[a];

  const ok = !!View || (!!EventTool && !!id);
  const unknown = !ok && session !== undefined;
  const desktop = useSyncExternalStore(subscribeMq, () => window.matchMedia("(min-width: 768px)").matches, () => false);
  const web = desktop && !guest && session !== undefined ? webHref(path) : null;
  useEffect(() => {
    if (guest) router.replace("/welcome");
    else if (web) router.replace(web);
    else if (unknown) router.replace("/host");
  }, [guest, web, unknown, router]);

  if (guest || !ok || web) return null;
  if (View) return <View />;
  return EventTool && id ? <EventTool id={id} /> : null;
}
