"use client";

import { useMemo, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon, ChevronDownIcon } from "@/components/icons";
import { Sheet, sheetPrimary, sheetSecondary } from "@/components/shared/Sheet";

export type DateValue = { label: string; from?: Date; to?: Date };

const chipCls = (on: boolean) =>
  `flex h-8 items-center gap-1.5 whitespace-nowrap rounded-full px-4 text-[13px] leading-4 transition ${on ? "bg-[#E22765] text-white" : "border border-[#B4BFCA] bg-white text-[#4D5E70] hover:border-[#68788A]"}`;

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-[13px] leading-4 text-[#172B3A] md:text-[10px] md:uppercase md:leading-3 md:tracking-[0.04em] md:text-[#68788A]">{title}</span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Single({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <>
      {options.map((o) => (
        <button key={o} type="button" onClick={() => onChange(o)} className={chipCls(value === o)}>
          {o}
        </button>
      ))}
    </>
  );
}

const ISLAND = [["Victoria Island", 42], ["Ikoyi", 18], ["Lekki", 37], ["Lagos Island", 9], ["Ajah", 7]] as const;
const MAINLAND = [["Yaba", 24], ["Ikeja", 31], ["Surulere", 12], ["Maryland", 8], ["Gbagada", 6], ["Festac", 5], ["Ikorodu", 3]] as const;

/**
 * Filters. Events: AM19 (213:2530, Island 433:35434) / PW33 (1069:66773). Places: PW34 (1069:67019).
 * Chips 32 high, selected pink. Area opens the Island or Mainland neighbourhoods with counts.
 */
export function FilterSheet({
  open,
  onClose,
  kind = "events",
  count,
  onApply,
  onPickDates,
}: {
  open: boolean;
  onClose: () => void;
  kind?: "events" | "places";
  count: number;
  onApply?: () => void;
  onPickDates?: () => void;
}) {
  const init = { when: "Any time", format: "Any", price: "Any", cats: [] as string[], side: "All of Lagos", areas: [] as string[], open: "Any time", good: [] as string[] };
  const [f, setF] = useState(init);
  const [moreCats, setMoreCats] = useState(false);
  const toggle = (key: "cats" | "areas" | "good", v: string) => setF((s) => ({ ...s, [key]: s[key].includes(v) ? s[key].filter((x) => x !== v) : [...s[key], v] }));
  const active = JSON.stringify(f) !== JSON.stringify(init);
  const shown = active ? Math.max(1, Math.round(count * 0.5)) : count;

  const eventCats = ["Music", "Nightlife & Parties", "Arts & Culture", "Food & Drink", "Tech & Business", "Comedy", ...(moreCats ? ["Outdoors & Travel", "Faith", "Family", "Sports", "Fashion"] : [])];
  const placeCats = ["Restaurants", "Cafés & Bakeries", "Bars & Lounges", "Clubs", "Beaches", "Parks & Nature", "Fun & Games", ...(moreCats ? ["Hotels & Pools", "Galleries", "Spas"] : [])];
  const areas = f.side === "Island" ? ISLAND : f.side === "Mainland" ? MAINLAND : [];

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Filters"
      footer={
        <>
          <button type="button" onClick={() => setF(init)} className={`${sheetSecondary} w-[100px]`}>
            Clear all
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onApply?.();
            }}
            className={sheetPrimary}
          >
            Show {shown} {kind === "places" ? (shown === 1 ? "place" : "places") : "results"}
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-5 pb-2">
        {kind === "events" ? (
          <>
            <Group title="When">
              <Single options={["Any time", "Today", "Tomorrow", "This weekend"]} value={f.when} onChange={(v) => setF({ ...f, when: v })} />
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onPickDates?.();
                }}
                className={chipCls(f.when === "Pick dates")}
              >
                Pick dates
                <ChevronDownIcon size={16} />
              </button>
            </Group>
            <Group title="Format">
              <Single options={["Any", "In person", "Online", "Hybrid"]} value={f.format} onChange={(v) => setF({ ...f, format: v })} />
            </Group>
            <Group title="Price">
              <Single options={["Any", "Free", "Paid"]} value={f.price} onChange={(v) => setF({ ...f, price: v })} />
            </Group>
          </>
        ) : (
          <Group title="Open">
            <Single options={["Any time", "Open now", "Open late"]} value={f.open} onChange={(v) => setF({ ...f, open: v })} />
          </Group>
        )}
        <Group title="Category">
          {kind === "events" && (
            <button type="button" onClick={() => setF({ ...f, cats: [] })} className={chipCls(f.cats.length === 0)}>
              All
            </button>
          )}
          {(kind === "events" ? eventCats : placeCats).map((c) => (
            <button key={c} type="button" onClick={() => toggle("cats", c)} className={chipCls(f.cats.includes(c))}>
              {c}
            </button>
          ))}
          <button type="button" onClick={() => setMoreCats((v) => !v)} className={chipCls(false)}>
            {moreCats ? "Less" : "More"}
            <ChevronDownIcon size={16} className={moreCats ? "rotate-180" : ""} />
          </button>
        </Group>
        <Group title="Area">
          <Single options={["All of Lagos", "Island", "Mainland"]} value={f.side} onChange={(v) => setF({ ...f, side: v, areas: [] })} />
          {areas.length > 0 && (
            <div className="flex w-full flex-wrap gap-2">
              {areas.map(([a, n]) => (
                <button key={a} type="button" onClick={() => toggle("areas", a)} className={chipCls(f.areas.includes(a))}>
                  {a} {n}
                </button>
              ))}
            </div>
          )}
          {areas.length > 0 && <p className="w-full text-[12px] leading-4 text-[#4D5E70]">Pick one or more. Counts show {kind} this week.</p>}
        </Group>
        {kind === "places" && (
          <Group title="Good to know">
            {["Good for groups", "Kid friendly", "Parking", "Outdoor seating", "Pay by card", "Reservations", "Walk ins welcome", "Step free entry"].map((g) => (
              <button key={g} type="button" onClick={() => toggle("good", g)} className={chipCls(f.good.includes(g))}>
                {g}
              </button>
            ))}
          </Group>
        )}
      </div>
    </Sheet>
  );
}

const sameDay = (a?: Date, b?: Date) => !!a && !!b && a.toDateString() === b.toDateString();
const fmt = (d: Date) => d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });

/** AM20 Custom dates / PW35 Pick dates: presets, month grid (Monday first), range selection, Clear + Apply. */
export function DatesSheet({ open, onClose, value, onChange }: { open: boolean; onClose: () => void; value: DateValue; onChange: (v: DateValue) => void }) {
  // The calendar reads today's date, so it mounts only once the sheet opens (never during prerender).
  return (
    <Sheet open={open} onClose={onClose} title="Pick dates">
      {open && <DatesBody value={value} onChange={onChange} onClose={onClose} />}
    </Sheet>
  );
}

function DatesBody({ onClose, value, onChange }: { onClose: () => void; value: DateValue; onChange: (v: DateValue) => void }) {
  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);
  const [month, setMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [from, setFrom] = useState<Date | undefined>(value.from);
  const [to, setTo] = useState<Date | undefined>(value.to);
  const [preset, setPreset] = useState<string | null>(value.from ? null : value.label === "Any date" ? null : value.label);

  const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  const presets: Record<string, [Date, Date]> = {
    Today: [today, today],
    Tomorrow: [addDays(today, 1), addDays(today, 1)],
    "This weekend": [addDays(today, (6 - today.getDay() + 7) % 7), addDays(today, ((6 - today.getDay() + 7) % 7) + 1)],
    "Next week": [addDays(today, ((8 - today.getDay()) % 7) || 7), addDays(today, (((8 - today.getDay()) % 7) || 7) + 6)],
  };
  const pick = (d: Date) => {
    setPreset(null);
    if (!from || (from && to) || d < from) {
      setFrom(d);
      setTo(undefined);
    } else setTo(d);
  };
  const applyPreset = (p: string) => {
    setPreset(p);
    setFrom(presets[p][0]);
    setTo(presets[p][1]);
    setMonth(new Date(presets[p][0].getFullYear(), presets[p][0].getMonth(), 1));
  };
  const lead = (month.getDay() + 6) % 7;
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1))];
  const end = to ?? from;

  const apply = () => {
    if (!from) onChange({ label: "Any date" });
    else onChange({ label: preset ?? (end && !sameDay(from, end) ? `${fmt(from)} to ${fmt(end)}` : fmt(from)), from, to: end });
    onClose();
  };

  return (
      <div className="flex flex-col gap-4 rounded-[24px] bg-white p-4 shadow-[0_12px_32px_rgba(23,43,58,0.16)] md:p-0 md:shadow-none">
        <div className="flex flex-wrap gap-2">
          {Object.keys(presets).map((p) => (
            <button key={p} type="button" onClick={() => applyPreset(p)} className={chipCls(preset === p)}>
              {p}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <button type="button" aria-label="Previous month" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#F4F6F8] text-[#172B3A]">
            <ArrowLeftIcon size={16} />
          </button>
          <span className="text-[17px] font-bold leading-[22px] tracking-[-0.01em] text-[#172B3A]">{month.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</span>
          <button type="button" aria-label="Next month" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#F4F6F8] text-[#172B3A]">
            <ArrowRightIcon size={16} />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-y-1 text-center">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
            <span key={i} className="flex h-6 items-center justify-center text-[12px] text-[#68788A]">
              {d}
            </span>
          ))}
          {cells.map((d, i) => {
            if (!d) return <span key={i} />;
            const past = d < today;
            const isEnd = sameDay(d, from) || sameDay(d, end);
            const inRange = from && end && d > from && d < end;
            const rangeStart = sameDay(d, from) && end && !sameDay(from, end);
            const rangeEnd = sameDay(d, end) && from && !sameDay(from, end);
            return (
              <span key={i} className={`relative flex h-10 items-center justify-center ${inRange ? "bg-[#FDEEF3]" : ""} ${rangeStart ? "bg-gradient-to-r from-transparent from-50% to-[#FDEEF3] to-50%" : ""} ${rangeEnd ? "bg-gradient-to-l from-transparent from-50% to-[#FDEEF3] to-50%" : ""}`}>
                <button
                  type="button"
                  disabled={past}
                  onClick={() => pick(d)}
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-[14px] ${
                    isEnd ? "bg-[#E22765] text-white" : past ? "text-[#8C99A7]" : sameDay(d, today) ? "text-[#C81E57]" : "text-[#172B3A] hover:bg-[#F4F6F8]"
                  }`}
                >
                  {d.getDate()}
                </button>
              </span>
            );
          })}
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => {
              setFrom(undefined);
              setTo(undefined);
              setPreset(null);
            }}
            className="flex h-11 items-center rounded-[12px] px-4 text-[14px] text-[#C81E57] hover:bg-[#FDEEF3]"
          >
            Clear
          </button>
          <button type="button" onClick={apply} className="flex h-11 flex-1 items-center justify-center rounded-[12px] bg-[#E22765] text-[14px] text-white hover:bg-[#C81E57]">
            Apply dates
          </button>
        </div>
      </div>
  );
}
