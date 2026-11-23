"use client";

import { useState } from "react";
import { ChevronDownIcon, FilterIcon } from "@/components/icons";
import { DatesSheet, FilterSheet, type DateValue } from "@/components/search/Filters";
import { useToast } from "@/components/shared/Sheet";

const chip = (on: boolean) =>
  `flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 text-[13px] leading-4 ${on ? "bg-[#E22765] text-white" : "border border-[#B4BFCA] bg-white text-[#4D5E70]"}`;

/** Chip row under the hub top bar: Filters, a pink lead chip (date for events), quick filters. */
export function HubChips({ kind, lead, quick, count }: { kind: "events" | "places"; lead?: string; quick: string[]; count: number }) {
  const [sheet, setSheet] = useState<null | "filters" | "dates">(null);
  const [date, setDate] = useState<DateValue>({ label: "Any date" });
  const [on, setOn] = useState<string | null>(null);
  const { show: toast, node } = useToast();
  return (
    <>
      <div className="overflow-x-auto no-scrollbar" style={{ scrollbarWidth: "none" }}>
        <div className="flex w-max gap-2 px-4 pb-1 pt-3">
          <button type="button" onClick={() => setSheet("filters")} className={chip(false)}>
            <FilterIcon size={16} />
            Filters
          </button>
          {kind === "events" ? (
            <button type="button" onClick={() => setSheet("dates")} className={chip(true)}>
              {date.label}
              <ChevronDownIcon size={16} />
            </button>
          ) : (
            <button type="button" onClick={() => setOn(on === lead ? null : lead ?? null)} className={chip(on !== null ? on === lead : true)}>
              {lead}
            </button>
          )}
          {quick.map((q) => (
            <button key={q} type="button" onClick={() => setOn(on === q ? null : q)} className={chip(on === q)}>
              {q}
            </button>
          ))}
        </div>
      </div>
      <FilterSheet open={sheet === "filters"} onClose={() => setSheet(null)} kind={kind} count={count} onApply={() => toast("Filters applied")} onPickDates={() => setSheet("dates")} />
      {kind === "events" && <DatesSheet open={sheet === "dates"} onClose={() => setSheet(null)} value={date} onChange={setDate} />}
      {node}
    </>
  );
}
