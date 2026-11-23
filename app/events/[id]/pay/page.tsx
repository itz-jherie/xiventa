import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getEventBySlug } from "@/data";
import { PayStep } from "@/components/checkout/PayStep";

/** Payment: AM31 to AM33 on phones, PW12 from 768 px. ?status=pending | failed | timeout. */
export default function PayPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={null}>
      <PayPageContent params={params} />
    </Suspense>
  );
}

async function PayPageContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = getEventBySlug(id);
  if (!event) notFound();
  return <PayStep event={event} />;
}
