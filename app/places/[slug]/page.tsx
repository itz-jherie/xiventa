import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getAllEvents, getAllPlaces, getEventBySlug, getPlaceBySlug } from "@/data";
import { getPlaceDetails } from "@/data/placeDetails";
import { PlaceDetail } from "@/components/place/PlaceDetail";

export function generateStaticParams() {
  return getAllPlaces().map((p) => ({ slug: p.slug }));
}

/** Place page: AM24 on phones, PW08 from 768 px. See components/place/PlaceDetail.tsx. */
/** URL params are read inside <Suspense> so navigations stay instant (cacheComponents). */
export default function PlacePage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={null}>
      <PlacePageContent params={params} />
    </Suspense>
  );
}

async function PlacePageContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const place = getPlaceBySlug(slug);
  if (!place) notFound();

  const upcoming = getAllEvents().filter((e) => e.venueName === place.name).slice(0, 4);
  const tables = upcoming.find((e) => e.recurrence) ?? (place.slug === "skyline-lounge" ? getEventBySlug("friday-rush") : undefined);
  const nearby = getAllPlaces()
    .filter((p) => p.slug !== place.slug && p.side === place.side)
    .slice(0, 6);

  return (
    <Suspense fallback={null}>
      <PlaceDetail place={place} details={getPlaceDetails(place)} upcoming={upcoming} tables={tables} nearby={nearby} />
    </Suspense>
  );
}
