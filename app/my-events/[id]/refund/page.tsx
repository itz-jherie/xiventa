"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import { MY_TICKETS } from "@/data/mine";
import { useTicket } from "@/components/tickets/useTicket";
import { RefundPage } from "@/components/tickets/TicketFlows";

/** AM55 Request a refund (app). ?step=closed | sent. */
export default function RefundRoute() {
  return (
    <Suspense fallback={null}>
      <Content />
    </Suspense>
  );
}

function Content() {
  const { id } = useParams<{ id: string }>();
  return <RefundPage ticket={useTicket(id) ?? MY_TICKETS[0]} />;
}
