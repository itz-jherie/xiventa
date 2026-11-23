import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getEventBySlug } from "@/data";
import { ConfirmedStep } from "@/components/checkout/ConfirmedStep";

/** You're in: AM34 on phones, PW13 from 768 px. */
export default function ConfirmedPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={null}>
      <ConfirmedPageContent params={params} />
    </Suspense>
  );
}

async function ConfirmedPageContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = getEventBySlug(id);
  if (!event) notFound();
  return <ConfirmedStep event={event} />;
}
