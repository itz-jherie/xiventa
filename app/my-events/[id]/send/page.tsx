"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import { MY_TICKETS } from "@/data/mine";
import { useTicket } from "@/components/tickets/useTicket";
import { SendPage } from "@/components/tickets/TicketFlows";

/** AM52 Send ticket (app). ?step=pending. */
export default function SendRoute() {
  return (
    <Suspense fallback={null}>
      <Content />
    </Suspense>
  );
}

function Content() {
  const { id } = useParams<{ id: string }>();
  return <SendPage ticket={useTicket(id) ?? MY_TICKETS[0]} />;
}
