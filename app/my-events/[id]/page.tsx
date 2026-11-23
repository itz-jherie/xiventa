"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import { MY_TICKETS } from "@/data/mine";
import { useTicket } from "@/components/tickets/useTicket";
import { TicketDetail } from "@/components/tickets/TicketDetail";

/** Ticket: AM37 / PW17. See components/tickets/TicketDetail for variants and previews. */
export default function TicketPage() {
  return (
    <Suspense fallback={null}>
      <Ticket />
    </Suspense>
  );
}

function Ticket() {
  const { id } = useParams<{ id: string }>();
  const ticket = useTicket(id) ?? MY_TICKETS[0];
  return <TicketDetail ticket={ticket} />;
}
