import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getAllEvents, getEventBySlug, getPlaceBySlug, pickEvents, PRIVATE_EVENTS } from "@/data";
import { EventDetail } from "@/components/event/EventDetail";
import { slugify } from "@/components/event/EventParts";

export function generateStaticParams() {
  return [...getAllEvents(), ...PRIVATE_EVENTS].map((e) => ({ id: e.slug }));
}

/** Event page: AM21 on phones, PW06 from 768 px. See components/event/EventDetail.tsx. */
/** URL params are read inside <Suspense> so navigations stay instant (cacheComponents). */
export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={null}>
      <EventDetailPageContent params={params} />
    </Suspense>
  );
}

async function EventDetailPageContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = getEventBySlug(id);
  if (!event) notFound();

  const sameHost = getAllEvents().filter((e) => e.hostName === event.hostName && e.slug !== event.slug).slice(0, 4);
  const more = sameHost.length >= 2 ? sameHost : pickEvents(["hangover-friday", "halloween-rooftop", "day-party-at-the-beach"]).filter((e) => e.slug !== event.slug);
  const place = getPlaceBySlug(slugify(event.venueName));

  return (
    <Suspense fallback={null}>
      <EventDetail event={event} more={more} place={place} />
    </Suspense>
  );
}
