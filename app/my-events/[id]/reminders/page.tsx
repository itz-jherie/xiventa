"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import { MY_TICKETS } from "@/data/mine";
import { useTicket } from "@/components/tickets/useTicket";
import { RemindersPage } from "@/components/tickets/TicketFlows";

/** AM39 Reminders (app). */
export default function RemindersRoute() {
  return (
    <Suspense fallback={null}>
      <Content />
    </Suspense>
  );
}

function Content() {
  const { id } = useParams<{ id: string }>();
  return <RemindersPage ticket={useTicket(id) ?? MY_TICKETS[0]} />;
}
