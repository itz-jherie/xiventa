import { Suspense } from "react";
import { getEventBySlug } from "@/data";
import { CLAIM_CODES } from "@/data/claims";
import { TicketClaim } from "@/components/checkout/TicketClaim";

/** PW24 Ticket claim: /t/tunde24. Unknown or claimed codes show "This ticket link has ended". */
export default function ClaimPage({ params }: { params: Promise<{ code: string }> }) {
  return (
    <Suspense fallback={null}>
      <ClaimPageContent params={params} />
    </Suspense>
  );
}

async function ClaimPageContent({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const link = CLAIM_CODES[code.toLowerCase()];
  return <TicketClaim event={link ? getEventBySlug(link.slug) : undefined} link={link} code={code} />;
}
