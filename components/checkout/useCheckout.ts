"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { XiventaEvent } from "@/data";
import { type Cart, totals, useCart, writeCart } from "@/lib/checkout";
import { saveOrder } from "@/lib/orders";
import { useSession } from "@/lib/session";

/**
 * Shared state for the steps after Choose tickets. Without a cart (page opened directly) the
 * person is sent back to Choose tickets. Details default to the account, then the Figma sample.
 */
export function useCheckout(event: XiventaEvent) {
  const router = useRouter();
  const raw = useCart(event.slug);
  const session = useSession();
  useEffect(() => {
    if (raw === null) router.replace(`/events/${event.slug}/tickets`);
  }, [raw, event.slug, router]);
  const contact = session?.contact ?? "";
  const cart: Cart | null = !raw
    ? null
    : ({
      ...raw,
      name: raw.name || session?.name || "Ada Okafor",
      email: raw.email || (contact.includes("@") ? contact : "ada@example.com"),
      phone: raw.phone || (/^\+?\d[\d\s]+$/.test(contact) ? contact : "0803 000 0000"),
    } as Cart);
  const t = cart ? totals(event, cart) : null;
  const update = (patch: Partial<Cart>) => cart && writeCart({ ...cart, ...patch });
  const base = `/events/${event.slug}`;

  /** Simulated payment: email containing "decline" fails, anything else goes through. */
  const settle = () => {
    if (!cart) return;
    if (/decline/i.test(cart.email)) router.replace(`${base}/pay?status=failed`);
    else {
      saveOrder(cart);
      router.replace(`${base}/confirmed`);
    }
  };
  const confirmFree = () => {
    if (!cart) return;
    writeCart(cart);
    saveOrder(cart);
    router.push(`${base}/confirmed`);
  };
  return { cart, t, update, base, settle, confirmFree, session, router };
}
