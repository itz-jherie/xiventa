"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { naira, stepCount, updateDraft, type Draft, type DraftTicket, type PricePhase } from "@/lib/createDraft";
import { Field, useSize } from "@/components/checkout/CheckoutParts";
import { InfoNotice, RadioRows } from "@/components/tickets/TicketParts";
import { Segmented } from "@/components/mobile/AppParts";
import { Sheet, sheetPrimary, sheetSecondary } from "@/components/shared/Sheet";
import { ticketPathH } from "@/components/shared/ticket";
import { CalendarIcon, PlusIcon, UsersIcon } from "@/components/create/createIcons";
import { Chips, CreateShell, Label, PickerField, SwitchRow } from "@/components/create/CreateParts";

/** One line for a ticket type on EC08: today's price and what happens next. */
function priceLine(t: DraftTicket) {
  if (t.phases.length > 1) {
    const rest = t.phases.slice(1);
    const last = rest[rest.length - 1];
    const lastFrom = t.phases[t.phases.length - 2].ends?.split(", ")[1];
    const then =
      rest.length === 1
        ? naira(last.price)
        : `${rest.slice(0, -1).map((p) => naira(p.price)).join(", ")}, and ${naira(last.price)}${lastFrom ? ` from ${lastFrom}` : ""}`;
    return `${t.phases[0].name} now. Then ${then}.`;
  }
  if (t.kind === "table") return `Seats ${t.seats}. ${t.note ?? ""} ${t.qty} tables.`.replace(/\s+/g, " ").trim();
  return `${t.note ?? ""} ${t.qty} available.`.trim();
}

/** Cream ticket card with the stub notch (EC08). */
function TicketCard({ t, onClick }: { t: DraftTicket; onClick: () => void }) {
  const { ref, size } = useSize<HTMLButtonElement>();
  const w = size?.w ?? 358;
  const h = size?.h ?? 112;
  return (
    <button ref={ref} type="button" onClick={onClick} className="relative block w-full text-left">
      {size && <span className="absolute inset-0 bg-[#D5DCE3]" style={{ clipPath: `path('${ticketPathH(w, h, w - 96)}')` }} />}
      <span className="relative flex min-h-[112px] flex-col gap-1 bg-[#FDFFF0] py-4 pl-4 pr-[112px]" style={{ clipPath: size ? `path('${ticketPathH(w, h, w - 96, 1)}')` : undefined }}>
        <span className="text-[10px] uppercase leading-3 tracking-[0.04em] text-[#4D5E70]">{t.name}</span>
        <span className="text-[20px] font-bold leading-[26px] tracking-[-0.02em] text-[#172B3A]">{t.phases[0].price ? naira(t.phases[0].price) : "Free"}</span>
        <span className="text-[12px] leading-4 text-[#4D5E70]">{priceLine(t)}</span>
      </span>
      <span className="pointer-events-none absolute bottom-3 right-[96px] top-3 border-l border-dashed border-[#D5DCE3]" />
    </button>
  );
}

/* ------------------------------------------------------------------ EC08 Ticket types */

export function CreateTickets({ draft }: { draft: Draft }) {
  const router = useRouter();
  const n = stepCount(draft);
  const fromFlyer = draft.flyer === "read" && draft.tickets.length > 0;
  return (
    <CreateShell title="New event" subtitle={draft.name} step={{ label: "Tickets", n: 4, of: n }} back="/create/location" action="Review" disabled={!draft.tickets.length} onAction={() => router.push("/create/review")}>
      {draft.tickets.length ? (
        <>
          {fromFlyer && (
            <div className="pb-4">
              <InfoNotice title="From your flyer" body={`${draft.tickets.length} ticket type${draft.tickets.length > 1 ? "s" : ""} and their price phases. Tap one to check it.`} />
            </div>
          )}
          <div className="flex flex-col gap-3">
            {draft.tickets.map((t) => (
              <TicketCard key={t.id} t={t} onClick={() => router.push(`/create/ticket?id=${t.id}`)} />
            ))}
          </div>
          <button type="button" onClick={() => router.push("/create/ticket?id=new")} className="mt-3 flex h-[52px] items-center justify-center gap-2 rounded-[12px] border border-[#B4BFCA] text-[16px] tracking-[-0.01em] text-[#172B3A]">
            <PlusIcon size={20} />
            Add ticket type
          </button>
        </>
      ) : (
        <>
          <InfoNotice title="No ticket prices on your flyer" body="Add at least one ticket type to sell. You can add more later." />
          <button type="button" onClick={() => router.push("/create/ticket?id=new")} className="mx-auto mt-6 flex h-[52px] items-center rounded-[12px] bg-[#E22765] px-6 text-[16px] tracking-[-0.01em] text-white">
            Add a ticket type
          </button>
        </>
      )}
    </CreateShell>
  );
}

/* ------------------------------------------------------------------ EC09 Ticket editor */

const NAMES = ["Regular", "VIP", "VVIP", "Group", "Couple", "Student"] as const;

export function CreateTicketEditor({ draft }: { draft: Draft }) {
  const router = useRouter();
  const id = useSearchParams().get("id") ?? "new";
  const existing = draft.tickets.find((t) => t.id === id);
  const [t, setT] = useState<DraftTicket>(
    () =>
      existing ?? {
        id: `t${Date.now()}`,
        kind: "standard",
        name: "Regular",
        phases: [{ name: "Price", price: 0 }],
        qty: 100,
        window: `Now until ${draft.date || "the event"}${draft.start ? `, ${draft.start}` : ""}`,
        maxPerOrder: 6,
        names: false,
        fee: "guests",
        mode: draft.format === "hybrid" ? "in-person" : undefined,
      }
  );
  const [custom, setCustom] = useState(!NAMES.includes(t.name as (typeof NAMES)[number]) && t.kind === "standard");
  const [phase, setPhase] = useState<number | null>(null);
  const set = (patch: Partial<DraftTicket>) => setT((x) => ({ ...x, ...patch }));
  const table = t.kind === "table";
  const phased = t.phases.length > 1;
  const save = () => {
    updateDraft((d) => ({ tickets: existing ? d.tickets.map((x) => (x.id === t.id ? t : x)) : [...d.tickets, t] }));
    router.push("/create/tickets");
  };
  return (
    <CreateShell title="Ticket type" subtitle={draft.name} back="/create/tickets" action="Save ticket type" disabled={!t.name.trim()} onAction={save}>
      <Segmented
        items={[
          { value: "standard", label: "Standard" },
          { value: "table", label: "Table" },
        ]}
        value={t.kind}
        onChange={(k) => set(k === "table" ? { kind: "table", name: t.kind === "table" ? t.name : "Table for 6", seats: t.seats ?? 6, qty: 5 } : { kind: "standard", name: "Regular", seats: undefined })}
      />
      {draft.format === "hybrid" && (
        <>
          <Label className="pt-5">Who is it for?</Label>
          <Chips options={["In person", "Online"] as const} value={[t.mode === "online" ? "Online" : "In person"]} onChange={(v) => set({ mode: v === "Online" ? "online" : "in-person" })} />
        </>
      )}
      {table ? (
        <div className="flex flex-col gap-4 pt-5">
          <Field label="Name" value={t.name} onChange={(v) => set({ name: v })} />
        </div>
      ) : (
        <>
          <Label className="pt-5">Name</Label>
          <Chips
            options={NAMES}
            value={custom ? [] : [t.name as (typeof NAMES)[number]]}
            onChange={(v) => {
              setCustom(false);
              set({ name: v });
            }}
            after={
              <button type="button" aria-pressed={custom} onClick={() => setCustom(true)} className={`flex h-8 items-center gap-1 rounded-full px-4 text-[13px] ${custom ? "bg-[#E22765] text-white" : "border border-[#B4BFCA] text-[#4D5E70]"}`}>
                <PlusIcon size={16} />
                Custom
              </button>
            }
          />
          {custom && (
            <div className="pt-3">
              <Field label="Custom name" value={NAMES.includes(t.name as (typeof NAMES)[number]) ? "" : t.name} onChange={(v) => set({ name: v })} placeholder="Early access, Backstage…" />
            </div>
          )}
        </>
      )}

      <Label className="pt-5">Price</Label>
      {phased ? (
        <>
          <p className="pb-3 text-[12px] leading-4 text-[#4D5E70]">Set one price, or let it go up over time.{draft.flyer === "read" ? " From your flyer: " + t.phases.map((p) => p.name.toLowerCase()).join(", ") + "." : ""}</p>
          <div className="flex flex-col gap-2">
            {t.phases.map((p, i) => (
              <button key={i} type="button" onClick={() => setPhase(i)} className={`flex min-h-[64px] items-center gap-3 rounded-2xl border px-4 text-left ${i === 0 ? "border-[#E22765] bg-[#FDEEF3]" : "border-[#E9EDF1]"}`}>
                <span className="flex flex-1 flex-col gap-0.5">
                  <span className="flex items-center gap-2 text-[14px] text-[#172B3A]">
                    {p.name}
                    {i === 0 ? <span className="text-[12px] text-[#C81E57]">Selling now</span> : i === 1 ? <span className="rounded-full bg-[#F4F6F8] px-2 text-[12px] text-[#4D5E70]">Next</span> : null}
                  </span>
                  <span className="text-[12px] text-[#4D5E70]">{p.ends ? `Until ${p.ends}${p.cap ? ` or ${p.cap} sold` : ""}` : i > 0 ? `From ${t.phases[i - 1].ends?.split(", ")[1] ?? "then"} until sales close` : "Until sales close"}</span>
                </span>
                <span className="text-[17px] font-bold text-[#172B3A]">{naira(p.price)}</span>
              </button>
            ))}
          </div>
        </>
      ) : (
        <Field label="" value={t.phases[0].price ? String(t.phases[0].price) : ""} onChange={(v) => set({ phases: [{ ...t.phases[0], price: Number(v.replace(/\D/g, "")) || 0 }] })} placeholder="₦0" inputMode="tel" hint="Set to ₦0 to make it free." />
      )}
      <button
        type="button"
        onClick={() => {
          if (!phased) set({ phases: [{ name: "Early bird", price: t.phases[0].price, ends: draft.date ? `before ${draft.date}` : "Thu, 11:59 PM", cap: 100 }, { name: "Regular", price: Math.round((t.phases[0].price || 10000) * 1.5) }] });
          setPhase(phased ? t.phases.length : null);
          if (phased) set({ phases: [...t.phases, { name: "At the gate", price: t.phases[t.phases.length - 1].price + 5000 }] });
        }}
        className="w-fit py-3 text-[13px] text-[#C81E57]"
      >
        {phased ? "Add a price phase" : "Let the price change over time"}
      </button>
      {phased && <p className="text-[12px] leading-4 text-[#4D5E70]">Buyers see today&apos;s price and when it goes up. A price is locked once tickets are held. You can lower a price any time; earlier buyers are not refunded the difference.</p>}

      <div className="flex flex-col gap-4 pt-5">
        <Field label="How many" value={`${t.qty}${table ? " tables" : ""}`} onChange={(v) => set({ qty: Number(v.replace(/\D/g, "")) || 0 })} inputMode="tel" />
        <PickerField label="Sales window" icon={<CalendarIcon size={20} />} value={t.window} onClick={() => set({ window: t.window.startsWith("Now") ? `Now until ${draft.date || "the event"}` : t.window })} />
        {table ? (
          <Field label="Guests per table" value={String(t.seats ?? 6)} onChange={(v) => set({ seats: Number(v.replace(/\D/g, "")) || 1 })} inputMode="tel" />
        ) : (
          <Field label="Max per order" value={String(t.maxPerOrder)} onChange={(v) => set({ maxPerOrder: Number(v.replace(/\D/g, "")) || 1 })} inputMode="tel" />
        )}
      </div>
      <div className="pt-3">
        <SwitchRow icon={<UsersIcon size={20} />} title="Ask for each guest name" sub="Helps the door when tickets are shared" on={t.names} onChange={(v) => set({ names: v })} />
      </div>
      <Label className="pt-3">Service fee</Label>
      <RadioRows
        options={[
          ["Guests pay it", "Added at checkout"],
          ["I absorb it", "Taken from your payout"],
        ]}
        value={t.fee === "guests" ? "Guests pay it" : "I absorb it"}
        onChange={(v) => set({ fee: v === "Guests pay it" ? "guests" : "host" })}
      />
      {existing && (
        <button
          type="button"
          onClick={() => {
            updateDraft((d) => ({ tickets: d.tickets.filter((x) => x.id !== t.id) }));
            router.push("/create/tickets");
          }}
          className="w-fit py-4 text-[14px] text-[#C0231A]"
        >
          Delete ticket type
        </button>
      )}
      <PhaseSheet
        phase={phase === null ? null : t.phases[phase]}
        onClose={() => setPhase(null)}
        onSave={(p) => {
          set({ phases: t.phases.map((x, i) => (i === phase ? p : x)) });
          setPhase(null);
        }}
        onDelete={() => {
          const rest = t.phases.filter((_, i) => i !== phase);
          set({ phases: rest.length ? rest : [{ name: "Price", price: 0 }] });
          setPhase(null);
        }}
      />
    </CreateShell>
  );
}

/* ------------------------------------------------------------------ EC25 Price phase */

const PHASE_NAMES = ["Early bird", "Regular", "Late", "At the gate"] as const;

function PhaseSheet({ phase, onClose, onSave, onDelete }: { phase: PricePhase | null; onClose: () => void; onSave: (p: PricePhase) => void; onDelete: () => void }) {
  return (
    <Sheet open={!!phase} onClose={onClose} title={phase?.name ?? "Price phase"}>
      {phase && <PhaseBody key={phase.name} phase={phase} onSave={onSave} onDelete={onDelete} />}
    </Sheet>
  );
}

function PhaseBody({ phase, onSave, onDelete }: { phase: PricePhase; onSave: (p: PricePhase) => void; onDelete: () => void }) {
  const [p, setP] = useState(phase);
  const [custom, setCustom] = useState(!PHASE_NAMES.includes(phase.name as (typeof PHASE_NAMES)[number]));
  const [capOn, setCapOn] = useState(!!phase.cap);
  return (
    <div className="flex flex-col">
      <Label>Name</Label>
      <Chips
        options={PHASE_NAMES}
        value={custom ? [] : [p.name as (typeof PHASE_NAMES)[number]]}
        onChange={(v) => {
          setCustom(false);
          setP({ ...p, name: v });
        }}
        after={
          <button type="button" aria-pressed={custom} onClick={() => setCustom(true)} className={`flex h-8 items-center rounded-full px-4 text-[13px] ${custom ? "bg-[#E22765] text-white" : "border border-[#B4BFCA] text-[#4D5E70]"}`}>
            Custom
          </button>
        }
      />
      {custom && (
        <div className="pt-3">
          <Field label="Custom name" value={PHASE_NAMES.includes(p.name as (typeof PHASE_NAMES)[number]) ? "" : p.name} onChange={(v) => setP({ ...p, name: v })} placeholder="Friends and family" />
        </div>
      )}
      <div className="pt-4">
        <Field label="Price" value={p.price ? naira(p.price) : ""} onChange={(v) => setP({ ...p, price: Number(v.replace(/\D/g, "")) || 0 })} inputMode="tel" />
      </div>
      <Label className="pt-4">This price ends</Label>
      <Field label="On" value={p.ends ?? ""} onChange={(v) => setP({ ...p, ends: v || undefined })} placeholder="Thu 23 Oct, 11:59 PM" />
      <SwitchRow title="Or when this many are sold" sub="Whichever comes first" on={capOn} onChange={setCapOn} />
      {capOn && <Field label="Number sold" value={String(p.cap ?? 100)} onChange={(v) => setP({ ...p, cap: Number(v.replace(/\D/g, "")) || undefined })} inputMode="tel" />}
      <p className="pt-3 text-[12px] leading-4 text-[#4D5E70]">The next price starts as soon as this one ends.</p>
      <div className="flex gap-3 pb-2 pt-5">
        <button type="button" onClick={onDelete} className={`${sheetSecondary} w-[140px]`}>
          Delete
        </button>
        <button type="button" onClick={() => onSave({ ...p, cap: capOn ? (p.cap ?? 100) : undefined })} className={sheetPrimary}>
          Save
        </button>
      </div>
    </div>
  );
}
