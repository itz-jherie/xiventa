import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getPlaceBySlug } from "@/data";
import { getPlaceDetails } from "@/data/placeDetails";
import { PlanVisitPage } from "@/components/place/PlaceFlows";

/** AM65 Plan a visit (app). Desktop opens PW47 on the place page. ?state=special-day. */
export default function PlanVisitRoute({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={null}>
      <Content params={params} />
    </Suspense>
  );
}

async function Content({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const place = getPlaceBySlug(slug);
  if (!place) notFound();
  return <PlanVisitPage place={place} details={getPlaceDetails(place)} />;
}
