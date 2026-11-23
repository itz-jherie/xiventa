import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getEventBySlug } from "@/data";
import { DetailsStep } from "@/components/checkout/DetailsStep";

/** Your details: AM29 on phones, PW11 Checkout from 768 px. */
export default function DetailsPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={null}>
      <DetailsPageContent params={params} />
    </Suspense>
  );
}

async function DetailsPageContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = getEventBySlug(id);
  if (!event) notFound();
  return <DetailsStep event={event} />;
}
