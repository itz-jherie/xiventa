import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getAllEvents } from "@/data";
import { getCollection, getCollections } from "@/data/collections";
import { CollectionView } from "@/components/mobile/CollectionView";

export function generateStaticParams() {
  return getCollections().map((c) => ({ slug: c.slug }));
}

/** Collection: AM15 on phones; desktop reuses the PW02 grid. */
/** URL params are read inside <Suspense> so navigations stay instant (cacheComponents). */
export default function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={null}>
      <CollectionPageContent params={params} />
    </Suspense>
  );
}

async function CollectionPageContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getCollection(slug);
  if (!c) notFound();
  const weekend = getAllEvents().filter((e) => e.isWeekend).slice(0, 4);
  return <CollectionView c={c} weekend={weekend} />;
}
