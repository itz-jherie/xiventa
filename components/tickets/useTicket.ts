"use client";

import { getTicket, type MyTicket } from "@/data/mine";
import { useOrders } from "@/lib/orders";

/** A ticket from the sample data or from an order placed in checkout on this device. */
export function useTicket(id: string): MyTicket | undefined {
  const orders = useOrders();
  return getTicket(id) ?? orders.find((o) => o.id === id);
}
