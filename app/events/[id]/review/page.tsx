import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getEventBySlug } from "@/data";
import { ReviewStep } from "@/components/checkout/ReviewStep";

/** Review order: AM30 (app only; desktops use PW11). */
export default function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={null}>
      <ReviewPageContent params={params} />
    </Suspense>
  );
}

async function ReviewPageContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = getEventBySlug(id);
  if (!event) notFound();
  return <ReviewStep event={event} />;
}
