"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import { MY_TICKETS } from "@/data/mine";
import { useTicket } from "@/components/tickets/useTicket";
import { OrderDetail } from "@/components/tickets/OrderDetail";

/** Order: AM38 / PW18. Preview ?state=refund | refunded | case. */
export default function OrderPage() {
  return (
    <Suspense fallback={null}>
      <Order />
    </Suspense>
  );
}

function Order() {
  const { id } = useParams<{ id: string }>();
  return <OrderDetail ticket={useTicket(id) ?? MY_TICKETS[0]} />;
}
