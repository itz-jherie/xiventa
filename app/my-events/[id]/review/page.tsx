"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import { MY_TICKETS } from "@/data/mine";
import { useTicket } from "@/components/tickets/useTicket";
import { ReviewPage } from "@/components/tickets/TicketFlows";

/** AM60 How was it (app). ?step=sent. */
export default function ReviewRoute() {
  return (
    <Suspense fallback={null}>
      <Content />
    </Suspense>
  );
}

function Content() {
  const { id } = useParams<{ id: string }>();
  return <ReviewPage ticket={useTicket(id) ?? MY_TICKETS[0]} />;
}
