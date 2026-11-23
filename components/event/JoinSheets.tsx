"use client";

import Link from "next/link";
import { useState } from "react";
import type { XiventaEvent } from "@/data";
import { Sheet, sheetPrimary, sheetSecondary } from "@/components/shared/Sheet";

/**
 * AM74 You're going (535:40960, Online 852:57129, Hybrid online 852:57134): confirmation after
 * I'm going, with Add to calendar and Done.
 */
export function YoureGoingSheet({ open, onClose, event, kind = "in-person", onCalendar }: { open: boolean; onClose: () => void; event: XiventaEvent; kind?: "in-person" | "online" | "hybrid-online"; onCalendar: () => void }) {
  const body =
    kind === "online"
      ? `${event.title} is in My events. The join link shows on the event page and opens 15 minutes before it starts.`
      : kind === "hybrid-online"
        ? `${event.title} is in My events. We send the live link before it starts, and it also shows on the event page.`
        : `${event.title} is in My events. We remind you the day before. No ticket needed at the gate.`;
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="You're going"
      footer={
        <>
          <button
            type="button"
            onClick={() => {
              onCalendar();
              onClose();
            }}
            className={`${sheetSecondary} flex-1`}
          >
            Add to calendar
          </button>
          <button type="button" onClick={onClose} className={sheetPrimary}>
            Done
          </button>
        </>
      }
    >
      <p className="pb-2 text-[14px] leading-5 text-[#4D5E70]">{body}</p>
    </Sheet>
  );
}

/** AM59 Join sheet (301:13391): platform, start, passcode, Join on <platform>. */
export function JoinSheet({ open, onClose, event }: { open: boolean; onClose: () => void; event: XiventaEvent }) {
  const platform = event.format?.label.split(" · ")[1] ?? "Zoom";
  const start = event.dateLabel.split(", ")[1] ?? "";
  const row = (k: string, v: string) => (
    <div className="flex items-center justify-between py-2 text-[14px] leading-5">
      <span className="text-[#4D5E70]">{k}</span>
      <span className="text-[#172B3A]">{v}</span>
    </div>
  );
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Join online"
      footer={
        <>
          <button type="button" onClick={onClose} className={`${sheetSecondary} w-[104px]`}>
            Not now
          </button>
          <a href="https://zoom.us" target="_blank" rel="noopener noreferrer" onClick={onClose} className={sheetPrimary}>
            Join on {platform}
          </a>
        </>
      }
    >
      <div className="flex flex-col gap-3 pb-2">
        <p className="text-[13px] leading-[18px] text-[#4D5E70]">{event.title} · online</p>
        <div className="flex flex-col divide-y divide-[#E9EDF1] rounded-2xl border border-[#E9EDF1] px-4">
          {row("Platform", platform)}
          {row("Starts", start)}
          {row("Passcode", "LAGOS24")}
        </div>
        <p className="text-[13px] leading-4 text-[#172B3A]">Opens shortly before start</p>
        <p className="text-[12px] leading-4 text-[#4D5E70]">We&apos;ll remind you when the room opens. Details changed? We update this sheet and tell you.</p>
        <Link href="/my-events" className="text-[14px] text-[#C81E57]">
          View my tickets
        </Link>
      </div>
    </Sheet>
  );
}

/** AM76 How are you joining (636:48263): free hybrid asks In person or Online before I'm going. */
export function HowJoiningSheet({ open, onClose, event, onPick }: { open: boolean; onClose: () => void; event: XiventaEvent; onPick: (mode: "in-person" | "online") => void }) {
  const [mode, setMode] = useState<"in-person" | "online">("in-person");
  const platform = event.format?.label.split(" · ")[1] ?? "YouTube Live";
  const opts = [
    { id: "in-person" as const, title: "In person", sub: `${event.venueName}, ${event.neighborhood}` },
    { id: "online" as const, title: "Online", sub: `Watch on ${platform}` },
  ];
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="How are you joining?"
      footer={
        <>
          <button type="button" onClick={onClose} className={`${sheetSecondary} w-[92px]`}>
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onPick(mode);
              onClose();
            }}
            className={sheetPrimary}
          >
            Add
          </button>
        </>
      }
    >
      <div role="radiogroup" className="flex flex-col pb-2">
        {opts.map((o) => (
          <button key={o.id} type="button" role="radio" aria-checked={mode === o.id} onClick={() => setMode(o.id)} className="flex min-h-14 items-center gap-3 px-1 text-left">
            <span className="flex flex-1 flex-col gap-0.5">
              <span className="text-[13px] text-[#172B3A]">{o.title}</span>
              <span className="text-[12px] text-[#4D5E70]">{o.sub}</span>
            </span>
            <span className={`h-5 w-5 rounded-full ${mode === o.id ? "border-[6px] border-[#E22765]" : "border-[1.5px] border-[#B4BFCA]"}`} />
          </button>
        ))}
      </div>
    </Sheet>
  );
}
