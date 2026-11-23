import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getEventBySlug } from "@/data";
import { RequestFlow } from "@/components/checkout/RequestFlow";

/** AM62 Request to join (app). ?step=pending | approved | declined. */
export default function RequestPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={null}>
      <RequestPageContent params={params} />
    </Suspense>
  );
}

async function RequestPageContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = getEventBySlug(id);
  if (!event) notFound();
  return <RequestFlow event={event} />;
}
