"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { XiventaEvent } from "@/data";
import { ArrowLeftIcon } from "@/components/icons";
import { TopNav } from "@/components/web/TopNav";
import { WebFooter } from "@/components/web/WebFooter";
import { ListEventCard } from "@/components/mobile/AppEventCards";
import { EmptyState } from "@/components/mobile/AppParts";
import { categoryTone } from "@/lib/categoryTone";

/**
 * Private event. Phone: AM22 (301:12984, Link expired 301:13067). Web: PW07 (313:19377), a 520 px
 * card. The right code (GARDEN24, any case) opens the event in its Invite only state.
 */
export function PrivateInvite({ event, code, codes }: { event?: XiventaEvent; code: string; codes: Record<string, string> }) {
  const router = useRouter();
  const [value, setValue] = useState(code.toUpperCase());
  const [error, setError] = useState(false);
  const expired = !event;

  const enter = (e?: React.FormEvent) => {
    e?.preventDefault();
    const slug = codes[value.trim().toLowerCase()];
    if (slug) router.push(`/events/${slug}?state=invite`);
    else setError(true);
  };

  const body = expired ? (
    <EmptyState title="This invite has expired" body="Invite links stop working after the host closes the guest list or all spots are taken." action="Browse events" href="/events" />
  ) : (
    <form onSubmit={enter} className="flex flex-col gap-4">
      <span className="inline-flex h-6 w-fit items-center rounded-full bg-[#FDEEF3] px-2 text-[12px] leading-4 text-[#C81E57]">Invite only</span>
      <h1 className="text-[24px] font-bold leading-[30px] tracking-[-0.02em] text-[#172B3A]">You&apos;re invited</h1>
      <p className="text-[14px] leading-5 text-[#4D5E70]">This event is invite only. Enter the code from your invite to see the details and get tickets.</p>
      <div className="flex justify-center">
        <ListEventCard event={event} hostLine showRepeatAndAge={false} href="#" categoryTag={categoryTone(event.categoryLabel)} />
      </div>
      <label className="flex flex-col gap-2">
        <span className="text-[13px] leading-4 text-[#172B3A]">Invite code</span>
        <input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(false);
          }}
          autoCapitalize="characters"
          className={`h-12 rounded-[12px] border bg-white px-4 text-[14px] uppercase text-[#172B3A] focus:outline-none ${error ? "border-[#FA443A]" : "border-[#D5DCE3] focus:border-[#E22765]"}`}
        />
        <span className={`text-[12px] leading-4 ${error ? "text-[#C0231A]" : "text-[#68788A]"}`}>{error ? "That code didn't work. Check your invite and try again." : "Codes are not case sensitive."}</span>
      </label>
      <button type="submit" className="hidden h-[52px] items-center justify-center rounded-[12px] bg-[#E22765] text-[16px] tracking-[-0.01em] text-white hover:bg-[#C81E57] md:flex">
        Enter with invite
      </button>
      <Link href="/welcome" className="hidden justify-center py-2 text-[14px] text-[#C81E57] md:flex">
        Sign in to see your invites
      </Link>
    </form>
  );

  return (
    <>
      <div className="min-h-screen bg-white pb-[110px] pt-[env(safe-area-inset-top)] md:hidden">
        <div className="flex h-14 items-center gap-3 px-4">
          <button
            type="button"
            aria-label="Back"
            onClick={() => (window.history.length > 1 ? router.back() : router.push("/m"))}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F4F6F8] text-[#172B3A]"
          >
            <ArrowLeftIcon size={20} />
          </button>
          <h1 className="text-[17px] font-bold leading-[22px] tracking-[-0.01em] text-[#172B3A]">{expired ? "Link expired" : "Private event"}</h1>
        </div>
        <div className="px-4 pt-4">{body}</div>
        {!expired && (
          <div className="fixed inset-x-0 bottom-0 border-t border-[#E9EDF1] bg-white px-4 pb-[max(28px,env(safe-area-inset-bottom))] pt-3">
            <button type="button" onClick={() => enter()} className="flex h-[52px] w-full items-center justify-center rounded-[12px] bg-[#E22765] text-[16px] tracking-[-0.01em] text-white">
              Enter with invite
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
    </>
  );
}
