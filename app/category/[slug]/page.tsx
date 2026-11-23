import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getAllCategories, getAllEvents, getAllPlaces } from "@/data";
import { getCategoryCopy } from "@/data/categoryCopy";
import { CategoryPage } from "@/components/category/CategoryPage";

export function generateStaticParams() {
  return getAllCategories().map((c) => ({ slug: c.slug }));
}

/** Category: AM14 on phones, PW04 from 768 px. */
/** URL params are read inside <Suspense> so navigations stay instant (cacheComponents). */
export default function Category({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={null}>
      <CategoryContent params={params} />
    </Suspense>
  );
}

async function CategoryContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getAllCategories().find((c) => c.slug === slug);
  if (!category) notFound();
  const copy = getCategoryCopy(category.slug, category.name);
  const events = getAllEvents().filter((e) => e.category === category.slug);
  const places = getAllPlaces().filter((p) => copy.placeLabels.includes(p.categoryLabel));
  return <CategoryPage category={category} copy={copy} events={events} places={places} />;
}
