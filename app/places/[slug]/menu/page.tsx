import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getPlaceBySlug } from "@/data";
import { getPlaceDetails } from "@/data/placeDetails";
import { MenuPage } from "@/components/place/PlaceFlows";

/** AM66 Place menu. */
export default function MenuRoute({ params }: { params: Promise<{ slug: string }> }) {
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
  return <MenuPage place={place} details={getPlaceDetails(place)} />;
}
