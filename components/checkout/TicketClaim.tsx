"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { XiventaEvent } from "@/data";
import type { TicketClaimLink } from "@/data/claims";
import { newCart, tiersFor } from "@/lib/checkout";
import { saveOrder, toTicket } from "@/lib/orders";
import { setReturnTo, useSession } from "@/lib/session";
import { categoryTone } from "@/lib/categoryTone";
import { ArrowLeftIcon, BookmarkIcon } from "@/components/icons";
import { CategoryTag, HostLine } from "@/components/shared/Tags";
import { ticketPathH } from "@/components/shared/ticket";
import { useSize } from "@/components/checkout/CheckoutParts";
import { isDesktop } from "@/components/auth/WebAuth";
import { useToast } from "@/components/shared/Sheet";
import { TopNav } from "@/components/web/TopNav";
import { WebFooter } from "@/components/web/WebFooter";

/** Ticket card from PW24: image stub 112 px, cream body, 1 px outline, ticket count bottom right. */
function ClaimCard({ event, label }: { event: XiventaEvent; label: string }) {
  const { ref, size } = useSize<HTMLDivElement>();
  const w = size?.w ?? 358;
  const h = 129;
  const tone = categoryTone(event.categoryLabel);
  return (
    <div ref={ref} className="relative w-full" style={{ height: h }}>
      {size && <div className="absolute inset-0 bg-[#D5DCE3]" style={{ clipPath: `path('${ticketPathH(w, h, 112.5)}')` }} />}
      <div className="absolute inset-0 flex" style={{ clipPath: size ? `path('${ticketPathH(w, h, 112.5, 1)}')` : undefined }}>
        <div className="relative w-[112px] shrink-0 bg-[#E9EDF1]">
          <Image src={event.imageUrl} alt="" fill sizes="112px" className="object-cover" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-[5px] bg-[#FDFFF0] py-3 pl-[13px] pr-3 pt-5">
          <span className="truncate text-[12px] leading-4 text-[#C81E57]">{event.dateLabel}</span>
          <span className="truncate text-[14px] font-bold leading-5 text-[#172B3A]">{event.title}</span>
          <HostLine name={event.hostName} verified={!event.isListing} />
          <div className="mt-auto flex items-center justify-between gap-2">
            <CategoryTag label={event.categoryLabel} bg={tone.bg} fg={tone.fg} />
            <span className="whitespace-nowrap pr-[100px] text-[14px] font-bold leading-5 text-[#172B3A] max-md:pr-2">{label}</span>
          </div>
        </div>
      </div>
      <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-[#F4F6F8] text-[#172B3A]">
        <BookmarkIcon size={16} />
      </span>
    </div>
  );
}

/**
 * PW24 Ticket claim (314:20722): someone transferred a ticket by link. Claiming moves it to this
 * account (the sender's copy stops working). Guests sign in first and come straight back here.
 * Preview: /t/tunde24 (open), /t/claimed (already claimed or expired).
 */
export function TicketClaim({ event, link, code }: { event?: XiventaEvent; link?: TicketClaimLink; code: string }) {
  const router = useRouter();
  const session = useSession();
  const [done, setDone] = useState<null | "declined">(null);
  const { show: toast, node: toastNode } = useToast();
  const tier = event && link ? tiersFor(event).find((t) => t.id === link.tier) : undefined;
  const label = link ? `${link.qty} ${tier?.label ?? "Regular"}` : "";

  const claim = () => {
    if (!event || !link) return;
    if (session?.status !== "signed-in") {
      setReturnTo(`/t/${code}`);
      return router.push("/welcome");
    }
    const cart = newCart(event, { name: session.name ?? "Ada Okafor", email: "ada@example.com" });
    cart.qty = { [link.tier]: link.qty };
    saveOrder(cart);
    const id = toTicket(event, cart).id;
    router.push(isDesktop() ? `/events/${event.slug}?state=have-ticket` : `/my-events/${id}`);
  };

  const ended = !event || !link;
  const body = ended ? (
    <div className="flex flex-col gap-3">
      <span className="inline-flex h-6 w-fit items-center rounded-full bg-[#F4F6F8] px-2 text-[12px] leading-4 text-[#4D5E70]">Link ended</span>
      <h1 className="text-[24px] font-bold leading-[30px] tracking-[-0.02em] text-[#172B3A]">This ticket link has ended</h1>
      <p className="text-[14px] leading-5 text-[#4D5E70]">It expired or was already claimed. Ask the person who sent it to send it again.</p>
      <Link href="/events" className="mt-3 flex h-[52px] w-full flex-none items-center justify-center rounded-[12px] bg-[#E22765] text-[16px] tracking-[-0.01em] text-white hover:bg-[#C81E57]">
        Find events
      </Link>
    </div>
  ) : done === "declined" ? (
    <div className="flex flex-col gap-3">
      <span className="inline-flex h-6 w-fit items-center rounded-full bg-[#F4F6F8] px-2 text-[12px] leading-4 text-[#4D5E70]">Declined</span>
      <h1 className="text-[24px] font-bold leading-[30px] tracking-[-0.02em] text-[#172B3A]">You declined the ticket</h1>
      <p className="text-[14px] leading-5 text-[#4D5E70]">We&apos;ve let {link.from} know. Their ticket still works.</p>
      <Link href={`/events/${event.slug}`} className="mt-3 flex h-[52px] w-full flex-none items-center justify-center rounded-[12px] border border-[#B4BFCA] text-[16px] tracking-[-0.01em] text-[#172B3A]">
        View event
      </Link>
    </div>
  ) : (
    <div className="flex flex-col">
      <span className="inline-flex h-6 w-fit items-center rounded-full bg-[#FDEEF3] px-2 text-[12px] leading-4 text-[#C81E57]">Ticket for you</span>
      <h1 className="pt-4 text-[24px] font-bold leading-[30px] tracking-[-0.02em] text-[#172B3A]">{link.from} sent you a ticket</h1>
      <p className="pt-6 text-[14px] leading-5 text-[#4D5E70]">
        Claim it to add it to your account. {link.from}&apos;s copy stops working once you do.
      </p>
      <div className="pt-5">
        <ClaimCard event={event} label={label} />
      </div>
      <button type="button" onClick={claim} className="mt-5 hidden h-[52px] w-full flex-none items-center justify-center rounded-[12px] bg-[#E22765] text-[16px] tracking-[-0.01em] text-white hover:bg-[#C81E57] md:flex">
        Claim ticket
      </button>
      <button type="button" onClick={() => { setDone("declined"); toast(`${link.from} has been told`); }} className="mt-5 hidden h-11 items-center justify-center text-[14px] text-[#C81E57] md:flex">
        Decline
      </button>
      <p className="pt-6 text-[12px] leading-4 text-[#4D5E70]">
        This link expires {link.expires}. If it has expired or was already claimed, ask {link.from} to send it again.
      </p>
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-white pb-[170px] pt-[env(safe-area-inset-top)] md:hidden">
        <div className="flex h-14 items-center gap-3 px-4">
          <button type="button" aria-label="Back" onClick={() => (window.history.length > 1 ? router.back() : router.push("/m"))} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F4F6F8] text-[#172B3A]">
            <ArrowLeftIcon size={20} />
          </button>
        </div>
        <div className="px-4 pt-2">{body}</div>
        {!ended && !done && (
          <div className="fixed inset-x-0 bottom-0 flex flex-col gap-1 border-t border-[#E9EDF1] bg-white px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-3">
            <button type="button" onClick={claim} className="flex h-[52px] w-full flex-none items-center justify-center rounded-[12px] bg-[#E22765] text-[16px] tracking-[-0.01em] text-white">
              Claim ticket
            </button>
            <button type="button" onClick={() => setDone("declined")} className="flex h-11 items-center justify-center text-[14px] text-[#C81E57]">
              Decline
            </button>
          </div>
        )}
      </div>
      <div className="hidden min-h-screen flex-col bg-white md:flex">
        <TopNav />
        <main className="flex flex-1 justify-center px-6 pb-24 pt-10">
          <div className="h-fit w-[520px] rounded-2xl border border-[#E9EDF1] bg-white p-8">{body}</div>
        </main>
        <WebFooter />
      </div>
      {toastNode}
    </>
  );
}
