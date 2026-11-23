"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { CheckIcon, CloseIcon } from "@/components/icons";
import { ATTENDEES, inCount, updateHost, useHost } from "@/lib/hosting";
import { evBase, useCheckedDelta, useEv } from "./HostEvent";

type Result = { kind: "valid"; name: string; line: string } | { kind: "used"; name: string; line: string };

/**
 * OM06 / OM07 Scanner: navy screen, pink viewfinder corners, Online / Offline pill, count and
 * "Find by name or order". There is no camera here yet, so tapping the viewfinder stands in for a
 * scan: the next guest still to come is checked in, a full ticket shows "Already checked in".
 * Previews: ?state=offline | valid | used.
 */
export function Scanner({ id }: { id: string }) {
  const h = useEv(id)!;
  const router = useRouter();
  const sp = useSearchParams();
  const s = useHost();
  const delta = useCheckedDelta();
  const state = sp.get("state");
  const offline = state === "offline";
  const preview: Result | null =
    state === "valid"
      ? { kind: "valid", name: "Ada Okafor", line: "Regular · 1 of 2 · 10:42 PM · Check ID, 18+" }
      : state === "used"
        ? { kind: "used", name: "Ada Okafor", line: "First scan at 10:42 PM by Tolu, Door A. Check their ID." }
        : null;
  const [result, setResult] = useState<Result | null>(preview);
  const [turn, setTurn] = useState(0);

  const scan = () => {
    const pool = ATTENDEES.filter((a) => !a.refunded);
    const a = pool[turn % pool.length];
    setTurn(turn + 1);
    const n = inCount(s, a);
    if (n >= a.qty) {
      setResult({ kind: "used", name: a.name, line: `First scan at 10:42 PM by Tolu, Door A. Check their ID.` });
      return;
    }
    updateHost((st) => ({ checkedIn: { ...st.checkedIn, [a.id]: n + 1 } }));
    setResult({ kind: "valid", name: a.name, line: `${a.ticket} · ${n + 1} of ${a.qty} · 10:42 PM · Check ID, 18+` });
  };

  return (
    <div className="min-h-screen bg-[#172B3A] md:flex md:items-center md:justify-center md:bg-[#0F1F2B] md:py-10">
      <div className="relative mx-auto flex min-h-screen w-full max-w-[430px] flex-col bg-[#172B3A] px-4 pb-[max(28px,env(safe-area-inset-bottom))] pt-[calc(env(safe-area-inset-top)+12px)] text-white md:min-h-[844px] md:rounded-[24px]">
        <div className="flex h-14 items-center gap-3">
          <button type="button" aria-label="Close scanner" onClick={() => router.push(evBase(id))} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/80 text-[#172B3A]">
            <CloseIcon size={20} />
          </button>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-[14px] leading-5">{h.title}</span>
            <span className="truncate text-[12px] leading-4 text-[#B4BFCA]">Scanning as Tolu · Door A</span>
          </div>
          <span className={`flex h-6 items-center gap-1.5 rounded-full px-2 text-[12px] ${offline ? "bg-[#FEF3DC] text-[#93500B]" : "bg-[#E7F8EF] text-[#067647]"}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${offline ? "bg-[#F79009]" : "bg-[#067647]"}`} />
            {offline ? "Offline" : "Online"}
          </span>
        </div>

        <button type="button" onClick={result ? undefined : scan} aria-label="Scan a ticket" className="relative mx-auto mt-[145px] h-[260px] w-[260px] shrink-0">
          {[
            "left-0 top-0 border-l-[3px] border-t-[3px]",
            "right-0 top-0 border-r-[3px] border-t-[3px]",
            "bottom-0 left-0 border-b-[3px] border-l-[3px]",
            "bottom-0 right-0 border-b-[3px] border-r-[3px]",
          ].map((c) => (
            <span key={c} className={`absolute h-11 w-11 ${c} ${offline ? "border-[#B4BFCA]" : "border-[#E22765]"}`} />
          ))}
        </button>
        <p className="mx-auto max-w-[290px] pt-6 text-center text-[14px] leading-5">
          {offline ? "You're offline. Tickets are checked against the guest list saved on this phone. 12 scans will sync when you're back online." : "Point at the ticket QR code"}
        </p>

        <div className="mt-auto flex flex-col gap-3 pt-8">
          {result ? (
            <div className="overflow-hidden rounded-[24px] bg-white text-[#172B3A]">
              <div className={`flex h-[60px] items-center gap-3 px-5 ${result.kind === "valid" ? "bg-[#067647] text-white" : "bg-[#FEF3DC] text-[#93500B]"}`}>
                {result.kind === "valid" ? <CheckIcon size={24} /> : <CloseIcon size={24} />}
                <span className="text-[20px] font-bold leading-[26px]">{result.kind === "valid" ? "Checked in" : "Already checked in"}</span>
              </div>
              <div className="flex flex-col gap-1 px-4 pb-4 pt-4">
                <span className="text-[16px] leading-6">{result.name}</span>
                <span className="text-[14px] leading-5 text-[#4D5E70]">{result.line}</span>
                <button type="button" onClick={() => setResult(null)} className="mt-3 flex h-[52px] w-full items-center justify-center rounded-[12px] bg-[#172B3A] text-[16px] text-white">
                  Next scan
                </button>
              </div>
            </div>
          ) : (
            <>
              <button type="button" onClick={() => router.push(`${evBase(id)}/count`)} className="flex items-baseline justify-center gap-2">
                <span className="text-[24px] font-bold">{64 + delta}</span>
                <span className="text-[14px] text-[#B4BFCA]">of {h.sold} checked in</span>
              </button>
              <button type="button" onClick={() => router.push(`${evBase(id)}/find`)} className="flex h-[52px] w-full items-center justify-center rounded-[12px] bg-white text-[16px] text-[#172B3A]">
                Find by name or order
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
