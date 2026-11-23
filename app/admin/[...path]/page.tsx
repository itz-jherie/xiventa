"use client";

import { Suspense, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ADMIN_PLACES, getAdminEvent } from "@/data/admin";
import { AdminOrganizers, AdminSignIn, AdminUser, AdminUsers, OrganizerDetail, VerificationReview } from "@/components/admin/AdminPeople";
import { AdminAnalytics, AdminEvent, AdminEvents, AdminOrder, AdminOrders, AdminPlaces, CheckInInvestigation, Exceptions, Payments, PlaceEditor, Refunds, Settlements } from "@/components/admin/AdminOps";
import { Categories, Cities, Collections, FraudReview, GuestPhotos, ListingReview, PlaceClaims, ReportedReviews, ReportsAppeals, SpotlightQueue, Suggestions, SupportCases, VenueDeclines } from "@/components/admin/AdminContent";
import { AuditLog, PlatformConfig, Platforms, RiskRules, StaffRoles, TierSettings } from "@/components/admin/AdminSettings";

/**
 * Xiventa admin (flow 8, AW01 to AW43), desktop only, staff sign in (AW01) first.
 * signin · users[/id] · organizers (?tab) · organizers/review/[id] · organizers/[id] (?tab=team|tier…)
 * · events (?tab) · events/[id] · events/[id]/check-in · places (?tab) · places/[id|new] · orders[/code]
 * · finance, /refunds, /settlements, /exceptions · content, /collections, /cities, /spotlight, /listings
 * (?tab=claims), /place-claims, /suggestions, /photos, /reviews, /venue-declines · support, /reports,
 * /fraud · analytics · settings, /config, /tiers, /audit (?tab=tiers), /risk, /platforms.
 * Staff roles are not enforced yet (see claude/xiventa-auth-todo.md).
 */
const PAGES: Record<string, () => React.ReactElement> = {
  signin: AdminSignIn,
  users: AdminUsers,
  organizers: AdminOrganizers,
  events: AdminEvents,
  places: AdminPlaces,
  orders: AdminOrders,
  finance: Payments,
  "finance/refunds": Refunds,
  "finance/settlements": Settlements,
  "finance/exceptions": Exceptions,
  content: Categories,
  "content/collections": Collections,
  "content/cities": Cities,
  "content/spotlight": SpotlightQueue,
  "content/listings": ListingReview,
  "content/place-claims": PlaceClaims,
  "content/suggestions": Suggestions,
  "content/photos": GuestPhotos,
  "content/reviews": ReportedReviews,
  "content/venue-declines": VenueDeclines,
  support: SupportCases,
  "support/reports": ReportsAppeals,
  "support/fraud": FraudReview,
  analytics: AdminAnalytics,
  settings: StaffRoles,
  "settings/config": PlatformConfig,
  "settings/tiers": TierSettings,
  "settings/audit": AuditLog,
  "settings/risk": RiskRules,
  "settings/platforms": Platforms,
};

export default function AdminPathPage() {
  return (
    <Suspense fallback={null}>
      <Admin />
    </Suspense>
  );
}

function Admin() {
  const { path = [] } = useParams<{ path: string[] }>();
  const router = useRouter();
  const [a, b, c, d] = path;
  const Page = PAGES[path.join("/")];
  let node: React.ReactElement | null = Page ? <Page /> : null;
  if (!node && b && path.length <= 3) {
    if (a === "users" && path.length === 2) node = <AdminUser id={b} />;
    else if (a === "organizers" && b === "review" && c && !d) node = <VerificationReview id={c} />;
    else if (a === "organizers" && path.length === 2) node = <OrganizerDetail id={b} />;
    else if (a === "events" && getAdminEvent(b)) node = path.length === 2 ? <AdminEvent id={b} /> : c === "check-in" ? <CheckInInvestigation id={b} /> : null;
    else if (a === "places" && path.length === 2 && (b === "new" || ADMIN_PLACES.some((p) => p.id === b))) node = <PlaceEditor id={b} />;
    else if (a === "orders" && path.length === 2) node = <AdminOrder code={b} />;
  }
  const missing = !node;
  useEffect(() => {
    if (missing) router.replace("/admin");
  }, [missing, router]);
  return node;
}
