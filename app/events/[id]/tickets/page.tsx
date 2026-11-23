import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getEventBySlug } from "@/data";
import { TicketsStep } from "@/components/checkout/TicketsStep";

/** Choose tickets: AM28 on phones, PW10 from 768 px. */
export default function TicketsPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={null}>
      <TicketsPageContent params={params} />
    </Suspense>
  );
}

async function TicketsPageContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = getEventBySlug(id);
  if (!event) notFound();
  return <TicketsStep event={event} />;
}
