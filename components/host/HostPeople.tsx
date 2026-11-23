"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { CreateShell } from "@/components/create/CreateParts";
import { Field } from "@/components/checkout/CheckoutParts";
import { ActionRow, Segmented } from "@/components/mobile/AppParts";
import { Sheet, sheetPrimary, sheetSecondary, useToast } from "@/components/shared/Sheet";
import { QrCodeIcon, SearchIcon, ShareIcon } from "@/components/icons";
import { ATTENDEES, DONE_REQUESTS, REQUESTS, inCount, naira, updateHost, useHost, type Attendee } from "@/lib/hosting";
import { Banner, Initials, Note, PairButtons, Pairs, Pill, StatCard, type Tone } from "./HostParts";
import { Poster, evBase, useCheckedDelta, useEv } from "./HostEvent";

export function attendeeStatus(n: number, a: Attendee): [string, Tone] {
  if (a.refunded) return ["Refunded", "red"];
  if (n >= a.qty) return ["Checked in", "green"];
  if (n > 0) return [`${n} of ${a.qty} in`, "amber"];
  return ["Not yet", "grey"];
}

function AttendeeRow({ a, onClick }: { a: Attendee; onClick: () => void }) {
  const s = useHost();
  const [label, tone] = attendeeStatus(inCount(s, a), a);
  return (
    <button type="button" onClick={onClick} className="flex min-h-[72px] w-full items-center gap-3 py-2 text-left">
      <Initials text={a.initials} />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-[14px] leading-5 text-[#172B3A]">{a.name}</span>
        <span className="truncate text-[12px] leading-4 text-[#4D5E70]">
          {a.ticket} × {a.qty} · {a.order}
        </span>
      </span>
      <Pill label={label} tone={tone} />
    </button>
  );
}

/** OM05 attendee sheet: ticket, order, status and Check in N. */
export function AttendeeSheet({ a, onClose, onDone }: { a: Attendee | null; onClose: () => void; onDone: (m: string) => void }) {
  const s = useHost();
  const n = a ? inCount(s, a) : 0;
  const left = a ? a.qty - n : 0;
  return (
    <Sheet
      open={!!a}
      onClose={onClose}
      title={a?.name ?? "Guest"}
      footer={
        a &&
        !a.refunded && (
          <>
            <button type="button" onClick={onClose} className={sheetSecondary}>
              Close
            </button>
            <button
              type="button"
              disabled={left === 0}
              onClick={() => {
                updateHost((st) => ({ checkedIn: { ...st.checkedIn, [a.id]: a.qty } }));
                onDone(`${a.name} checked in`);
                onClose();
              }}
              className={sheetPrimary}
            >
              {left === 0 ? "All checked in" : `Check in ${left}`}
            </button>
          </>
        )
      }
    >
      {a && (
        <Pairs
          rows={[
            ["Ticket", `${a.ticket} × ${a.qty}`],
            ["Order", a.order],
            ["Status", a.refunded ? "Refunded" : `${n} of ${a.qty}`],
          ]}
        />
      )}
    </Sheet>
  );
}

/* ------------------------------------------------------------------ OM05 Attendees */

export function Attendees({ id }: { id: string }) {
  const h = useEv(id)!;
  const router = useRouter();
  const s = useHost();
  const delta = useCheckedDelta();
  const { show, node } = useToast();
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"all" | "in" | "not">("all");
  const [open, setOpen] = useState<Attendee | null>(null);
  const ended = h.status === "ended";
  const total = h.sold || 142;
  const inN = ended ? (h.came ?? 131) : 38 + delta;
  const list = ATTENDEES.filter((a) => {
    const n = inCount(s, a);
    if (tab === "in" && n === 0) return false;
    if (tab === "not" && (n > 0 || a.refunded)) return false;
    const t = q.trim().toLowerCase();
    return !t || a.name.toLowerCase().includes(t) || a.order.toLowerCase().replace(" ", "").includes(t.replace(" ", ""));
  });
  return (
    <CreateShell title="Attendees" subtitle={h.title} back={evBase(id)} action={ended ? undefined : "Scan tickets"} onAction={() => router.push(`${evBase(id)}/scan`)}>
      <label className="flex h-12 items-center gap-3 rounded-full border border-[#E9EDF1] bg-[#F4F6F8] px-4">
        <SearchIcon size={20} className="text-[#4D5E70]" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or order number" className="min-w-0 flex-1 bg-transparent text-[14px] text-[#172B3A] placeholder:text-[#68788A] focus:outline-none" />
      </label>
      <Segmented
        className="mt-4"
        value={tab}
        onChange={setTab}
        items={[
          { value: "all", label: `All ${total}` },
          { value: "in", label: `${ended ? "Came" : "Checked in"} ${inN}` },
          { value: "not", label: `Not yet ${total - inN}` },
        ]}
      />
      <span className="pt-4 text-[11px] uppercase leading-4 tracking-[0.06em] text-[#4D5E70]">{h.date.split(",")[0].replace(/^(\w+) /, (m) => ({ "Sat ": "Saturday ", "Fri ": "Friday ", "Sun ": "Sunday " })[m] ?? m)}</span>
      {list.map((a) => (
        <AttendeeRow key={a.id} a={a} onClick={() => setOpen(a)} />
      ))}
      {!list.length && <p className="py-6 text-center text-[14px] text-[#4D5E70]">No one matches that. Try the order number on their ticket.</p>}
      {ended && <Note>The full guest list with phone numbers exports from the web dashboard.</Note>}
      <AttendeeSheet a={open} onClose={() => setOpen(null)} onDone={show} />
      {node}
    </CreateShell>
  );
}

/* ------------------------------------------------------------------ OM08 Check in by name */

export function FindGuest({ id }: { id: string }) {
  const h = useEv(id)!;
  const { show, node } = useToast();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<Attendee | null>(null);
  const t = q.trim().toLowerCase();
  const list = t ? ATTENDEES.filter((a) => a.name.toLowerCase().includes(t) || a.order.toLowerCase().replace(" ", "").includes(t.replace(" ", ""))) : [];
  return (
    <CreateShell title="Check in by name" subtitle={h.title} back={`${evBase(id)}/scan`}>
      <label className="flex h-12 items-center gap-3 rounded-full border border-[#E22765] bg-white px-4">
        <SearchIcon size={20} className="text-[#4D5E70]" />
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, phone or order number" className="min-w-0 flex-1 bg-transparent text-[14px] text-[#172B3A] placeholder:text-[#68788A] focus:outline-none" />
      </label>
      <div className="flex flex-col pt-2">
        {list.map((a) => (
          <AttendeeRow key={a.id} a={a} onClick={() => setOpen(a)} />
        ))}
      </div>
      {t && !list.length && (
        <div className="flex flex-col items-center gap-2 px-6 pt-12 text-center">
          <p className="text-[16px] font-bold leading-6 text-[#172B3A]">No ticket for {q.trim()}</p>
          <p className="text-[14px] leading-5 text-[#4D5E70]">Check the spelling, try their phone number or ask for the order number on their ticket.</p>
        </div>
      )}
      <AttendeeSheet a={open} onClose={() => setOpen(null)} onDone={show} />
      {node}
    </CreateShell>
  );
}

/* ------------------------------------------------------------------ OM09 Live count */

export function LiveCount({ id }: { id: string }) {
  const h = useEv(id)!;
  const router = useRouter();
  const delta = useCheckedDelta();
  const checked = 64 + delta;
  return (
    <CreateShell title="Live count" subtitle={h.title} back={`${evBase(id)}/scan`} action="Back to scanning" onAction={() => router.push(`${evBase(id)}/scan`)}>
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Checked in" value={String(checked)} note={`Of ${h.sold} tickets`} />
        <StatCard label="Still to come" value={String(h.sold - checked)} note="Doors close 1 AM" />
      </div>
      <span className="pb-1 pt-5 text-[11px] uppercase leading-4 tracking-[0.06em] text-[#4D5E70]">By gate</span>
      {[
        ["Gate A", 38 + delta],
        ["Gate B", 26],
      ].map(([g, n]) => (
        <div key={g} className="flex items-center justify-between border-b border-[#E9EDF1] py-3">
          <span className="text-[15px] text-[#172B3A]">{g}</span>
          <span className="text-[15px] font-bold text-[#172B3A]">{n}</span>
        </div>
      ))}
      <Note>Last scan 10:42 PM at Gate A. Counts include scans saved offline once they sync.</Note>
    </CreateShell>
  );
}

/* ------------------------------------------------------------------ OM15 Check in staff, OM16 Staff invite */

const STAFF = [
  { initials: "DA", name: "Dayo Ade", line: "0803 000 0001 · Gate A", status: ["Active", "green"] as [string, Tone] },
  { initials: "SM", name: "Seyi Martins", line: "0803 000 0002 · Gate B", status: ["Active", "green"] as [string, Tone] },
  { initials: "BK", name: "Bisi Kalu", line: "0803 000 0003", status: ["Invite sent", "grey"] as [string, Tone] },
];

export function Staff({ id }: { id: string }) {
  const h = useEv(id)!;
  const s = useHost();
  const { show, node } = useToast();
  const [add, setAdd] = useState(false);
  const [phone, setPhone] = useState("");
  const [gate, setGate] = useState("");
  const ok = phone.replace(/\D/g, "").length >= 10;
  return (
    <CreateShell title="Check in staff" subtitle={h.title} back={evBase(id)} action="Add staff" onAction={() => setAdd(true)}>
      <Banner tone="blue" title="Staff can only scan tickets" body="They see names and ticket types for this event. They never see money or payouts." />
      <span className="pb-1 pt-5 text-[11px] uppercase leading-4 tracking-[0.06em] text-[#4D5E70]">Your team</span>
      <div className="flex min-h-[72px] items-center gap-3 py-2">
        <Initials text="YO" />
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-[14px] leading-5 text-[#172B3A]">You (Yemi Ogun)</span>
          <span className="text-[12px] leading-4 text-[#4D5E70]">Host · Can scan and manage</span>
        </span>
        <Pill label="Owner" tone="pink" />
      </div>
      {[...STAFF, ...s.staff.map((x) => ({ initials: "NS", name: "New staff", line: [x.phone, x.gate].filter(Boolean).join(" · "), status: ["Invite sent", "grey"] as [string, Tone] }))].map((x, i) => (
        <div key={i} className="flex min-h-[72px] items-center gap-3 py-2">
          <Initials text={x.initials} />
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="text-[14px] leading-5 text-[#172B3A]">{x.name}</span>
            <span className="text-[12px] leading-4 text-[#4D5E70]">{x.line}</span>
          </span>
          <Pill label={x.status[0]} tone={x.status[1]} />
        </div>
      ))}
      <Note>Staff sign in with their phone number. Access ends when the event ends.</Note>
      <Sheet
        open={add}
        onClose={() => setAdd(false)}
        title="Add staff"
        footer={
          <>
            <button type="button" onClick={() => setAdd(false)} className={sheetSecondary}>
              Cancel
            </button>
            <button
              type="button"
              disabled={!ok}
              onClick={() => {
                updateHost((st) => ({ staff: [...st.staff, { phone, gate: gate || undefined, invited: true }] }));
                setAdd(false);
                setPhone("");
                setGate("");
                show("Invite sent");
              }}
              className={sheetPrimary}
            >
              Send invite
            </button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Field label="Phone number" value={phone} onChange={setPhone} inputMode="tel" placeholder="0803 000 0004" hint="We send them a link to join as staff." />
          <Field label="Gate or note (optional)" value={gate} onChange={setGate} placeholder="Gate C" />
        </div>
      </Sheet>
      {node}
    </CreateShell>
  );
}

export function StaffInvite() {
  const router = useRouter();
  const { show, node } = useToast();
  return (
    <CreateShell
      title="Staff invite"
      close
      back="/m"
      action="Accept and open scanner"
      onAction={() => router.push("/host/event/abnormal-nightout/scan")}
      secondary={
        <button
          type="button"
          onClick={() => {
            show("Invite declined");
            setTimeout(() => router.push("/m"), 900);
          }}
          className="flex h-11 items-center justify-center text-[15px] text-[#172B3A]"
        >
          Decline
        </button>
      }
    >
      <div className="flex flex-col items-start gap-3">
        <Pill label="Check in staff" tone="pink" />
        <h2 className="text-[24px] font-bold leading-[30px] tracking-[-0.02em] text-[#172B3A]">South Circle wants you on the door</h2>
        <p className="text-[14px] leading-5 text-[#4D5E70]">Scan tickets for The Abnormal Nightout. You will see names and ticket types, never money.</p>
      </div>
      <div className="pt-4">
        <Pairs
          rows={[
            ["Event", "Sat 25 Oct, 9 PM"],
            ["Where", "Skyline Lounge, Gate A"],
            ["Access ends", "When the event ends"],
          ]}
        />
      </div>
      {node}
    </CreateShell>
  );
}

/* ------------------------------------------------------------------ OM22 Requests */

export function Requests({ id }: { id: string }) {
  const h = useEv(id)!;
  const s = useHost();
  const { show, node } = useToast();
  const [tab, setTab] = useState<"open" | "done">("open");
  const [approve, setApprove] = useState<string | null>(null);
  const open = REQUESTS.filter((r) => !s.requests[r.id]);
  const done = [
    ...REQUESTS.filter((r) => s.requests[r.id]).map((r) => ({
      name: r.name,
      initials: r.initials,
      line: r.kind === "Refund" ? `Refund · ${naira(r.amount ?? 0)}` : `Transfer · ${r.ticket}`,
      status: s.requests[r.id] === "declined" ? "Declined" : r.kind === "Refund" ? "Refunded" : "Allowed",
    })),
    ...DONE_REQUESTS,
  ];
  const r = REQUESTS.find((x) => x.id === approve);
  const decide = (rid: string, v: "approved" | "declined", m: string) => {
    updateHost((st) => ({ requests: { ...st.requests, [rid]: v } }));
    show(m);
  };
  return (
    <CreateShell title="Requests" subtitle={h.title} back={evBase(id)}>
      <Segmented
        value={tab}
        onChange={setTab}
        items={[
          { value: "open", label: `Open ${open.length}` },
          { value: "done", label: `Done ${done.length}` },
        ]}
      />
      <div className="flex flex-col gap-3 pt-4">
        {tab === "open" &&
          open.map((x) => (
            <div key={x.id} className="flex flex-col gap-3 rounded-2xl border border-[#E9EDF1] p-4">
              <div className="flex items-center gap-3">
                <Initials text={x.initials} />
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="text-[14px] leading-5 text-[#172B3A]">{x.name}</span>
                  <span className="text-[12px] leading-4 text-[#4D5E70]">
                    {x.kind} · {x.ticket}
                  </span>
                </span>
                <Pill label={x.left} tone="amber" />
              </div>
              <p className="text-[14px] leading-5 text-[#172B3A]">&quot;{x.message}&quot;</p>
              <PairButtons
                left="Decline"
                right={x.kind === "Refund" ? `Refund ${naira(x.amount ?? 0)}` : "Allow transfer"}
                onLeft={() => decide(x.id, "declined", `${x.kind} declined. ${x.name.split(" ")[0]} is told.`)}
                onRight={() => (x.kind === "Refund" ? setApprove(x.id) : decide(x.id, "approved", "Transfer allowed"))}
              />
            </div>
          ))}
        {tab === "open" && !open.length && <p className="py-6 text-center text-[14px] text-[#4D5E70]">Nothing waiting for you.</p>}
        {tab === "done" &&
          done.map((x) => (
            <div key={x.name + x.line} className="flex min-h-[64px] items-center gap-3">
              <Initials text={x.initials} />
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-[14px] leading-5 text-[#172B3A]">{x.name}</span>
                <span className="text-[12px] leading-4 text-[#4D5E70]">{x.line}</span>
              </span>
              <Pill label={x.status} tone={x.status === "Refunded" || x.status === "Allowed" ? "green" : "grey"} />
            </div>
          ))}
      </div>
      {tab === "open" && <Note>If you do not reply in time, Xiventa reviews the request and decides. Refunds come out of your next payout.</Note>}
      <Sheet
        open={!!r}
        onClose={() => setApprove(null)}
        title="Approve this refund?"
        footer={
          <>
            <button type="button" onClick={() => setApprove(null)} className={sheetSecondary}>
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                if (r) decide(r.id, "approved", `${naira(r.amount ?? 0)} refunded to ${r.name.split(" ")[0]}`);
                setApprove(null);
              }}
              className={sheetPrimary}
            >
              Approve refund
            </button>
          </>
        }
      >
        {r && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Initials text={r.initials} />
              <span className="flex flex-col">
                <span className="text-[14px] text-[#172B3A]">{r.name}</span>
                <span className="text-[12px] text-[#4D5E70]">{r.ticket} · Order XV 7TGT</span>
              </span>
            </div>
            <Pairs rows={[["Refund", <span key="v" className="font-bold">{naira(r.amount ?? 0)}</span>]]} />
            <p className="text-[12px] leading-4 text-[#68788A]">Comes out of your next payout. {r.name.split(" ")[0]} is told and gets the money back through the payment partner.</p>
          </div>
        )}
      </Sheet>
      {node}
    </CreateShell>
  );
}

/* ------------------------------------------------------------------ OM24 Promoters, Invite, OM25 Promoter link */

export function Promoters({ id }: { id: string }) {
  const h = useEv(id)!;
  const router = useRouter();
  const s = useHost();
  const { show, node } = useToast();
  const pending = !s.promoters.tunde;
  const invited = useSearchParams().get("invited") === "1";
  return (
    <CreateShell title="Promoters" subtitle={`${h.title} · ${h.date.split(",")[0]}`} back={evBase(id)} action="Invite a promoter" onAction={() => router.push(`${evBase(id)}/promoters-invite`)}>
      {invited && (
        <div className="pb-3">
          <Banner tone="green" title="Invite sent" body="Tunde gets a link to join. You see every sale he makes here." />
        </div>
      )}
      {pending && (
        <div className="flex flex-col gap-3 rounded-2xl border border-[#E9EDF1] p-4">
          <div className="flex items-center gap-3">
            <Initials text="TB" />
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="text-[14px] leading-5 text-[#172B3A]">Tunde Bakare wants to promote this event</span>
              <span className="text-[12px] leading-4 text-[#4D5E70]">Verified host · Hosted 2 events on Xiventa</span>
            </span>
          </div>
          <PairButtons
            left="Decline"
            right="Approve"
            onLeft={() => {
              updateHost((st) => ({ promoters: { ...st.promoters, tunde: "declined" } }));
              show("Tunde is told");
            }}
            onRight={() => {
              updateHost((st) => ({ promoters: { ...st.promoters, tunde: "approved" } }));
              show("Tunde can now share his own link");
            }}
          />
        </div>
      )}
      <span className="pb-1 pt-5 text-[11px] uppercase leading-4 tracking-[0.06em] text-[#4D5E70]">Sales by promoter</span>
      {[
        ["Ife the Plug", "42 tickets · ₦630,000"],
        ["Lagos Nights Crew", "18 tickets · ₦270,000"],
        ...(s.promoters.tunde === "approved" ? [["Tunde Bakare", "0 tickets · ₦0"]] : []),
        ["Your own links", "120 tickets · ₦1,800,000"],
      ].map(([n, l]) => (
        <ActionRow key={n} icon={<ShareIcon size={20} />} title={n} subtitle={l} href={n === "Your own links" ? `${evBase(id)}/share` : `/host/promoter/${id}`} />
      ))}
      <Note>All ticket money goes to you. Settle any commission with your promoters directly.</Note>
      {node}
    </CreateShell>
  );
}

export function PromoterInvite({ id }: { id: string }) {
  const h = useEv(id)!;
  const router = useRouter();
  const [who, setWho] = useState("");
  const found = who.trim().length >= 4;
  return (
    <CreateShell title="Invite a promoter" subtitle={h.title} back={`${evBase(id)}/promoters`} action="Send invite" disabled={!found} onAction={() => router.push(`${evBase(id)}/promoters?invited=1`)}>
      <p className="pb-4 text-[14px] leading-5 text-[#4D5E70]">Promoters must be verified hosts on Xiventa. They get their own link and QR, and you see every sale they make.</p>
      <Field label="Phone number or Xiventa name" value={who} onChange={setWho} placeholder="0806 *** 2231" />
      {found && (
        <div className="mt-3 flex items-center gap-3 rounded-2xl bg-[#F4F6F8] p-3">
          <Initials text="TB" />
          <span className="text-[14px] text-[#172B3A]">Tunde Bakare · Verified host</span>
        </div>
      )}
      <div className="pt-4">
        <Banner tone="blue" title="About commission" body="Xiventa does not pay promoter commission yet. Agree it with your promoter directly." />
      </div>
    </CreateShell>
  );
}

/** OM25: what a promoter sees for an event they promote. */
export function PromoterLink({ id }: { id: string }) {
  const h = useEv(id)!;
  const { show, node } = useToast();
  const link = `xiventa.com/e/${h.slug ?? h.id}?p=tunde`;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`https://${link}`);
    } catch {}
    show("Link copied");
  };
  return (
    <CreateShell title="Your promoter link" subtitle={`${h.title} · by ${h.venue}`} back="/host" action="Share link" onAction={copy}>
      <Poster h={h} />
      <div className="flex flex-col gap-1 pt-4">
        <span className="text-[13px] text-[#172B3A]">Your link</span>
        <span className="rounded-[12px] bg-[#F4F6F8] px-4 py-3 text-[14px] text-[#172B3A]">{link}</span>
        <span className="text-[12px] text-[#68788A]">Sales from this link are counted for you.</span>
      </div>
      <div className="flex gap-2 pt-3">
        <button type="button" onClick={copy} className="flex h-11 flex-1 items-center justify-center rounded-[12px] border border-[#B4BFCA] text-[14px] text-[#172B3A]">
          Copy link
        </button>
        <button type="button" onClick={() => show("QR saved to your phone")} className="flex h-11 flex-1 items-center justify-center gap-2 rounded-[12px] border border-[#B4BFCA] text-[14px] text-[#172B3A]">
          <QrCodeIcon size={18} />
          Save QR
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2 pt-4">
        {[
          ["Tickets sold", "42"],
          ["Sales", "₦630,000"],
          ["Link visits", "310"],
        ].map(([k, v]) => (
          <div key={k} className="flex flex-col gap-1 rounded-2xl border border-[#D5DCE3] p-3">
            <span className="text-[12px] text-[#4D5E70]">{k}</span>
            <span className="text-[16px] font-bold text-[#172B3A]">{v}</span>
          </div>
        ))}
      </div>
      <Note>Buyers pay on the {h.title} page, so their tickets and refunds are protected.</Note>
      {node}
    </CreateShell>
  );
}
