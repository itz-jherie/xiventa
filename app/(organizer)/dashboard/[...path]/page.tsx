"use client";

import { Suspense, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getDashEvent } from "@/data/dashboard";
import { CreateWeb, DashSignIn, EventsList } from "@/components/dashboard/DashHome";
import { CancelEventWeb, DuplicateWeb, EventAnalytics, EventAttendees, EventCheckIn, EventDetails, EventOrders, EventSettings, EventSummary, EventTickets, OrderDetail, PublishWeb, TicketType } from "@/components/dashboard/DashEvent";
import { Cases, ClipWeb, Feedback, GuestRequests, PromoCodes, Promote, Promotion, SeriesDates, Waitlist } from "@/components/dashboard/DashEventMore";
import { Approvals, Audience, Payouts, Reports, Transactions, Wallet, Withdraw } from "@/components/dashboard/DashMoney";
import { ClaimPlace, NewPlaceWeb, PlaceListing, PlaceReviewsWeb, SettingsNotifications, SettingsPayout, SettingsProfile, SettingsRoles, SettingsTeam, SettingsVerification, VenueRequestsWeb } from "@/components/dashboard/DashSettings";

/**
 * Organizer web dashboard (flow 7b, OW01 to OW46), desktop only; phones are sent to the organizer app.
 * /dashboard/signin · events (?tab) · events/new · events/[id] and its tabs and tools · wallet (?state=tier|dropped),
 * wallet/transactions, payouts, withdraw · audience · reports · approvals · settings (profile), verification,
 * payout, team, roles, notifications, place, place/claim, place/new, place/requests, place/reviews.
 * Access is not checked beyond signed in (see claude/xiventa-auth-todo.md).
 */
const EVENT: Record<string, (p: { id: string }) => React.ReactElement> = {
  "": EventSummary,
  details: EventDetails,
  tickets: EventTickets,
  orders: EventOrders,
  attendees: EventAttendees,
  "check-in": EventCheckIn,
  settings: EventSettings,
  analytics: EventAnalytics,
  cancel: CancelEventWeb,
  duplicate: DuplicateWeb,
  publish: PublishWeb,
  series: SeriesDates,
  guests: GuestRequests,
  waitlist: Waitlist,
  promote: Promote,
  cases: Cases,
  clip: ClipWeb,
  feedback: Feedback,
  "promo-codes": PromoCodes,
  promotion: Promotion,
};
const PAGES: Record<string, () => React.ReactElement> = {
  signin: DashSignIn,
  events: EventsList,
  "events/new": CreateWeb,
  wallet: Wallet,
  "wallet/transactions": Transactions,
  "wallet/payouts": Payouts,
  "wallet/withdraw": Withdraw,
  audience: Audience,
  reports: Reports,
  approvals: Approvals,
  settings: SettingsProfile,
  "settings/verification": SettingsVerification,
  "settings/payout": SettingsPayout,
  "settings/team": SettingsTeam,
  "settings/roles": SettingsRoles,
  "settings/notifications": SettingsNotifications,
  "settings/place": PlaceListing,
  "settings/place/claim": ClaimPlace,
  "settings/place/new": NewPlaceWeb,
  "settings/place/requests": VenueRequestsWeb,
  "settings/place/reviews": PlaceReviewsWeb,
};

export default function DashboardPathPage() {
  return (
    <Suspense fallback={null}>
      <Dash />
    </Suspense>
  );
}

function Dash() {
  const { path = [] } = useParams<{ path: string[] }>();
  const router = useRouter();
  const key = path.join("/");
  const Page = PAGES[key];
  let node: React.ReactElement | null = Page ? <Page /> : null;

  if (!node && path[0] === "events" && path[1] && getDashEvent(path[1])) {
    const id = path[1];
    const [, , tool = "", sub] = path;
    if (tool === "tickets" && sub && path.length === 4) node = <TicketType id={id} type={sub} />;
    else if (tool === "orders" && sub && path.length === 4) node = <OrderDetail id={id} code={sub} />;
    else if (path.length <= 3 && EVENT[tool]) {
      const Tool = EVENT[tool];
      node = <Tool id={id} />;
    }
  }

  const missing = !node;
  useEffect(() => {
    if (missing) router.replace("/dashboard/events");
  }, [missing, router]);

  return node;
}
