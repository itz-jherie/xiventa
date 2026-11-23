"use client";

import { useState } from "react";
import { Sheet, sheetPrimary, sheetSecondary } from "@/components/shared/Sheet";

/** Dates of a repeating series (rule 5: each date has its own tickets). Static sample from AM61. */
export const DATE_OPTIONS = [
  { label: "Fri 24 Oct", day: "FRI", date: "24 Oct", status: "Selling" },
  { label: "Fri 31 Oct", day: "FRI", date: "31 Oct", status: "Few left" },
  { label: "Fri 7 Nov", day: "FRI", date: "7 Nov", status: "Selling" },
  { label: "Fri 14 Nov", day: "FRI", date: "14 Nov", status: "Sold out" },
  { label: "Fri 21 Nov", day: "FRI", date: "21 Nov", status: "Cancelled" },
  { label: "Fri 28 Nov", day: "FRI", date: "28 Nov", status: "Selling" },
];

/** AM61 / PW37 Choose a date: 84 x 72 chips, selected pink, sold out and cancelled greyed. */
export function ChooseDateSheet({ open, onClose, value, onChange, title = "Friday Rush · every Friday, 10 PM" }: { open: boolean; onClose: () => void; value: string; onChange: (d: string) => void; title?: string }) {
  const [picked, setPicked] = useState<string | null>(null);
  const current = picked ?? value;
  return (
    <Sheet
      open={open}
      onClose={() => {
        setPicked(null);
        onClose();
      }}
      title="Choose a date"
      footer={
        <>
          <button type="button" onClick={onClose} className={`${sheetSecondary} w-[92px]`}>
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onChange(current);
              setPicked(null);
              onClose();
            }}
            className={sheetPrimary}
          >
            Continue with {current}
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <p className="text-[13px] leading-[18px] text-[#4D5E70]">{title}</p>
        <div className="flex flex-wrap gap-2">
          {DATE_OPTIONS.map((d) => {
            const on = d.label === current;
            const off = d.status === "Sold out" || d.status === "Cancelled";
            return (
              <button
                key={d.label}
                type="button"
                disabled={off}
                onClick={() => setPicked(d.label)}
                className={`flex h-[72px] w-[84px] flex-col items-center gap-0.5 rounded-[12px] px-3 py-2.5 text-[12px] ${
                  on ? "border-[1.5px] border-[#E22765] bg-[#FDEEF3]" : off ? "border border-[#E9EDF1] bg-[#F4F6F8]" : "border border-[#D5DCE3] bg-white"
                }`}
              >
                <span className={off ? "text-[#8C99A7]" : "text-[#4D5E70]"}>{d.day}</span>
                <span className={on ? "text-[#C81E57]" : off ? "text-[#8C99A7]" : "text-[#172B3A]"}>{d.date}</span>
                <span className={on ? "text-[#C81E57]" : off ? "text-[#8C99A7]" : d.status === "Few left" ? "text-[#8F5200]" : "text-[#4D5E70]"}>{d.status}</span>
              </button>
            );
          })}
        </div>
        <p className="text-[12px] leading-4 text-[#4D5E70]">No Friday Rush on Fri 5 Dec. The host skipped that date.</p>
      </div>
    </Sheet>
  );
}
