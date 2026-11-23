import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getEventBySlug } from "@/data";
import { WaitlistFlow } from "@/components/checkout/WaitlistFlow";

/** AM63 Waitlist (app). ?step=joined | offer | expired. */
export default function WaitlistPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={null}>
      <WaitlistPageContent params={params} />
    </Suspense>
  );
}

async function WaitlistPageContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = getEventBySlug(id);
  if (!event) notFound();
  return <WaitlistFlow event={event} />;
}
