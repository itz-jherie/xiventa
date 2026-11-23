"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { AlertIcon, CalendarIcon, CheckIcon, ChevronRightIcon, GridIcon, InfoIcon, LogOutIcon, PlusIcon, SettingsIcon, TrendDownIcon, TrendUpIcon, UsersIcon, WalletIcon } from "@/components/icons";
import { XiventaWordmark } from "@/components/icons/XiventaWordmark";
import { Sheet, sheetPrimary, sheetSecondary } from "@/components/shared/Sheet";
import { WEB_PROFILES } from "@/data/dashboard";
import { updateHost, useHost } from "@/lib/hosting";
import { useSession } from "@/lib/session";

/* ------------------------------------------------------------------ shared styles */

export const btnPrimary = "flex h-11 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[12px] bg-[#E22765] px-4 text-[14px] leading-[18px] text-white hover:bg-[#C81E57] disabled:bg-[#F5A3BF]";
export const btnSecondary = "flex h-11 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[12px] border border-[#B4BFCA] bg-white px-4 text-[14px] leading-[18px] text-[#172B3A] hover:border-[#68788A]";
export const btnLink = "text-[13px] leading-4 text-[#C81E57] hover:underline";

export function useActingWeb() {
  const s = useHost();
  return WEB_PROFILES.find((p) => p.id === s.webActing) ?? WEB_PROFILES[0];
}

const subscribeMq = (cb: () => void) => {
  const mq = window.matchMedia("(max-width: 767px)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
/** Phones get the organizer app (OM); the dashboard is desktop only (rule 19). */
function usePhone() {
  return useSyncExternalStore(subscribeMq, () => window.matchMedia("(max-width: 767px)").matches, () => false);
}

const NAV = [
  { label: "Overview", href: "/dashboard", Icon: GridIcon, match: (p: string) => p === "/dashboard" },
  { label: "Events", href: "/dashboard/events", Icon: CalendarIcon, match: (p: string) => p.startsWith("/dashboard/events") || p.startsWith("/dashboard/reports") },
  { label: "Wallet", href: "/dashboard/wallet", Icon: WalletIcon, match: (p: string) => p.startsWith("/dashboard/wallet") },
  { label: "Audience", href: "/dashboard/audience", Icon: UsersIcon, match: (p: string) => p.startsWith("/dashboard/audience") },
  { label: "Settings", href: "/dashboard/settings", Icon: SettingsIcon, match: (p: string) => p.startsWith("/dashboard/settings") || p.startsWith("/dashboard/approvals") },
];

/**
 * OW sidebar (248 px) and main column on #F4F6F8. Guests go to OW01 sign in; phones go to the matching
 * organizer app screen (`phone`).
 */
export function DashShell({ children, phone = "/host" }: { children: React.ReactNode; phone?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const session = useSession();
  const isPhone = usePhone();
  const acting = useActingWeb();
  const [switching, setSwitching] = useState(false);
  const guest = session !== undefined && session?.status !== "signed-in";

  useEffect(() => {
    if (isPhone) router.replace(phone);
    else if (guest) router.replace(`/dashboard/signin?next=${encodeURIComponent(pathname)}`);
  }, [isPhone, guest, phone, pathname, router]);

  if (session === undefined || guest || isPhone) return <div className="min-h-screen bg-[#F4F6F8]" />;

  return (
    <div className="flex min-h-screen w-full bg-[#F4F6F8] text-[#172B3A]">
      <aside className="sticky top-0 flex h-screen w-[248px] shrink-0 flex-col gap-1 border-r border-[#E9EDF1] bg-white p-4">
        <div className="flex h-10 items-center pb-4 pl-3">
          <Link href="/" aria-label="Xiventa home">
            <XiventaWordmark width={104} height={24} />
          </Link>
        </div>
        <Link href="/dashboard/events/new" className={btnPrimary}>
          <PlusIcon size={20} />
          Create event
        </Link>
        <div className="h-3" />
        {NAV.map(({ label, href, Icon, match }) => {
          const on = match(pathname);
          return (
            <Link key={label} href={href} className={`flex h-10 items-center gap-3 rounded-[8px] px-3 text-[14px] leading-[18px] ${on ? "bg-[#FDEEF3] text-[#C81E57]" : "text-[#4D5E70] hover:bg-[#F4F6F8]"}`}>
              <Icon size={20} />
              {label}
            </Link>
          );
        })}
        <div className="flex-1" />
        <div className="flex items-center gap-3 border-t border-[#E9EDF1] pt-3">
          <button type="button" onClick={() => setSwitching(true)} className="flex min-w-0 flex-1 items-center gap-3 rounded-[8px] text-left hover:bg-[#F4F6F8]" aria-label="Switch host profile">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F1EEFF] text-[10px] leading-3 text-[#5B3FD6]">{acting.initials}</span>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="truncate text-[13px] leading-4 text-[#172B3A]">{acting.name}</span>
              <span className="truncate text-[12px] leading-4 text-[#68788A]">{acting.role}</span>
            </span>
          </button>
          <Link href="/signout" aria-label="Sign out" className="text-[#4D5E70]">
            <LogOutIcon size={18} />
          </Link>
        </div>
      </aside>
      <main className="flex min-w-0 flex-1 flex-col gap-6 px-10 pb-12 pt-8">{children}</main>
      <ActingAsDialog open={switching} onClose={() => setSwitching(false)} />
    </div>
  );
}

/** OW46 Acting as. */
function ActingAsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const acting = useActingWeb();
  const router = useRouter();
  const [pick, setPick] = useState<string | null>(null);
  const sel = pick ?? acting.id;
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Acting as"
      footer={
        <>
          <button type="button" onClick={onClose} className={sheetSecondary}>
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              updateHost({ webActing: sel });
              setPick(null);
              onClose();
              router.push("/dashboard");
            }}
            className={sheetPrimary}
          >
            Switch
          </button>
        </>
      }
    >
      <p className="pb-2 text-[14px] leading-5 text-[#4D5E70]">Switch between the host profiles you run. Sales, payouts and teams are separate for each.</p>
      {WEB_PROFILES.map((p) => (
        <button key={p.id} type="button" role="radio" aria-checked={sel === p.id} onClick={() => setPick(p.id)} className="flex min-h-[60px] w-full items-center gap-3 text-left">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F1EEFF] text-[12px] text-[#5B3FD6]">{p.initials}</span>
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="text-[14px] leading-5 text-[#172B3A]">{p.name}</span>
            <span className="text-[12px] leading-4 text-[#68788A]">{p.line}</span>
          </span>
          <span className={`h-5 w-5 shrink-0 rounded-full ${sel === p.id ? "border-[6px] border-[#E22765]" : "border-[1.5px] border-[#B4BFCA]"}`} />
        </button>
      ))}
      <Link href="/create/verify" className="flex min-h-[60px] items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F4F6F8]">
          <PlusIcon size={18} />
        </span>
        <span className="flex flex-col">
          <span className="text-[14px] text-[#172B3A]">Create host profile</span>
          <span className="text-[12px] text-[#68788A]">Business, institution, community and more</span>
        </span>
      </Link>
    </Sheet>
  );
}

/* ------------------------------------------------------------------ page parts */

/** Breadcrumb, 28 px title, subtitle and actions on the right. */
export function PageHead({ crumbs, title, sub, actions }: { crumbs?: [string, string?][]; title: string; sub?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex items-end gap-6">
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        {crumbs && (
          <span className="text-[12px] leading-4 text-[#4D5E70]">
            {crumbs.map(([l, h], i) => (
              <span key={l}>
                {i > 0 && " / "}
                {h ? (
                  <Link href={h} className="hover:underline">
                    {l}
                  </Link>
                ) : (
                  l
                )}
              </span>
            ))}
          </span>
        )}
        <h1 className="text-[28px] font-bold leading-[34px] tracking-[-0.02em]">{title}</h1>
        {sub && <p className="text-[14px] leading-5 text-[#4D5E70]">{sub}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}

/** Underlined tabs as links (Summary · Details · …, Balances · Transactions · Payouts). */
export function LinkTabs({ items, active }: { items: [string, string][]; active: string }) {
  return (
    <div className="flex gap-1 border-b border-[#E9EDF1]">
      {items.map(([label, href]) => (
        <Link key={label} href={href} className={`-mb-px border-b-2 px-1 pb-2 pr-2 text-[14px] leading-5 ${label === active ? "border-[#E22765] text-[#172B3A]" : "border-transparent text-[#4D5E70] hover:text-[#172B3A]"}`}>
          {label}
        </Link>
      ))}
    </div>
  );
}

/** Pill tabs (Last 7 days / Last 30 days / All time, Requests / Guest list). */
export function PillTabs<T extends string>({ items, value, onChange }: { items: [T, string][]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex gap-2">
      {items.map(([v, l]) => (
        <button key={v} type="button" onClick={() => onChange(v)} className={`flex h-9 items-center rounded-full px-4 text-[13px] ${v === value ? "bg-[#E22765] text-white" : "border border-[#B4BFCA] bg-white text-[#4D5E70]"}`}>
          {l}
        </button>
      ))}
    </div>
  );
}

export const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => <section className={`flex flex-col rounded-2xl border border-[#E9EDF1] bg-white p-5 ${className}`}>{children}</section>;
export const CardTitle = ({ children }: { children: React.ReactNode }) => <h2 className="pb-3 text-[20px] font-bold leading-[26px] tracking-[-0.02em]">{children}</h2>;
export const H2 = ({ children }: { children: React.ReactNode }) => <h2 className="text-[20px] font-bold leading-[26px] tracking-[-0.02em]">{children}</h2>;
export const Foot = ({ children }: { children: React.ReactNode }) => <p className="text-[12px] leading-4 text-[#4D5E70]">{children}</p>;

export function Stat({ label, value, note, tone }: { label: string; value: string; note?: string; tone?: "up" | "down" }) {
  return (
    <div className="flex min-h-[120px] flex-col gap-2 rounded-2xl border border-[#D5DCE3] bg-white p-5">
      <span className="text-[13px] leading-4 text-[#4D5E70]">{label}</span>
      <span className="text-[24px] font-bold leading-[30px] tracking-[-0.02em]">{value}</span>
      {note && (
        <span className={`flex items-center gap-1 text-[12px] leading-4 ${tone === "up" ? "text-[#067647]" : tone === "down" ? "text-[#C0231A]" : "text-[#68788A]"}`}>
          {tone === "up" && <TrendUpIcon size={16} />}
          {tone === "down" && <TrendDownIcon size={16} />}
          {note}
        </span>
      )}
    </div>
  );
}

const STATUS_TONE: Record<string, string> = {
  green: "bg-[#E3F8EF] text-[#067647]",
  grey: "bg-[#E9EDF1] text-[#4D5E70]",
  amber: "bg-[#FEF3DC] text-[#93500B]",
  red: "bg-[#FFECEB] text-[#C0231A]",
  blue: "bg-[#E6F1FF] text-[#0059BE]",
  pink: "bg-[#FDEEF3] text-[#C81E57]",
};
const GREEN = ["On sale", "Paid", "Active", "Available", "Valid", "Paid out", "Running", "Approved", "Allowed", "Released", "Yes", "Checked in", "Accepted", "Succeeded", "Processed", "Published", "Live", "Resolved", "Verified", "Kept", "On", "OK", "Cleared", "Matches"];
const AMBER = ["Paused", "Pending", "Partly refunded", "Held until event", "Waiting on you", "Waiting", "Held", "Offers out", "Scheduled", "In review", "Pending review", "Transfer pending", "Skipped", "Open", "New", "Checks pending", "Verifying", "Processing", "With host", "Appealed", "On hold", "Watch", "Medium"];
const RED = ["Failed", "Cancelled", "Refunds owed", "Rejected", "Restricted", "Reported", "Disputed", "Removed", "Possible duplicate", "High", "Removed from listings"];
const BLUE = ["With Xiventa", "Pinned"];
export function toneOf(s: string) {
  return GREEN.includes(s) ? "green" : AMBER.includes(s) ? "amber" : RED.includes(s) ? "red" : BLUE.includes(s) ? "blue" : "grey";
}

/** Status pill with a dot (On sale, Paused, Failed…). */
export function Status({ label, tone }: { label: string; tone?: keyof typeof STATUS_TONE }) {
  return (
    <span className={`inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-full px-2 text-[12px] leading-4 ${STATUS_TONE[tone ?? toneOf(label)]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

/** OW table: grey 40 px header in 10 px caps, 56 px rows. `widths` in px; 0 = flexible. */
export function Table({ head, widths, rows, onRow, empty }: { head: string[]; widths: number[]; rows: React.ReactNode[][]; onRow?: (i: number) => void; empty?: React.ReactNode }) {
  const cell = (i: number) => ({ width: widths[i] || undefined, flexGrow: widths[i] ? 0 : 1, flexShrink: widths[i] ? 0 : 1, minWidth: 0 });
  return (
    <div className="overflow-hidden rounded-[12px] border border-[#E9EDF1] bg-white">
      <div className="flex h-10 items-center border-b border-[#E9EDF1] bg-[#F4F6F8]">
        {head.map((h, i) => (
          <span key={i} className="px-4 text-[10px] uppercase leading-3 tracking-[0.04em] text-[#68788A]" style={cell(i)}>
            {h}
          </span>
        ))}
      </div>
      {rows.map((r, ri) => (
        <div key={ri} onClick={onRow ? () => onRow(ri) : undefined} className={`flex min-h-14 items-center border-b border-[#E9EDF1] py-2 last:border-b-0 ${onRow ? "cursor-pointer hover:bg-[#FAFBFC]" : ""}`}>
          {r.map((c, i) => (
            <span key={i} className="truncate px-4 text-[14px] leading-5 text-[#4D5E70]" style={cell(i)}>
              {c}
            </span>
          ))}
        </div>
      ))}
      {!rows.length && empty && <div className="flex flex-col items-center gap-1 px-6 py-12 text-center">{empty}</div>}
    </div>
  );
}

/** "Showing 1 to 6 of 118 orders" and page buttons. */
export function Pager({ text, page, setPage }: { text: string; page: number; setPage: (n: number) => void }) {
  const pages: (number | "…")[] = [1, 2, 3, "…", 8];
  return (
    <div className="flex items-center justify-between">
      <span className="text-[13px] text-[#4D5E70]">{text}</span>
      <div className="flex items-center gap-1">
        <button type="button" disabled={page === 1} onClick={() => setPage(page - 1)} className="h-9 rounded-[8px] border border-[#D5DCE3] bg-white px-3 text-[13px] text-[#172B3A] disabled:text-[#B4BFCA]">
          Previous
        </button>
        {pages.map((p, i) =>
          p === "…" ? (
            <span key={i} className="px-2 text-[13px] text-[#68788A]">
              …
            </span>
          ) : (
            <button key={i} type="button" onClick={() => setPage(p)} className={`h-9 w-9 rounded-[8px] text-[13px] ${p === page ? "bg-[#E22765] text-white" : "border border-[#D5DCE3] bg-white text-[#172B3A]"}`}>
              {p}
            </button>
          ),
        )}
        <button type="button" disabled={page === 8} onClick={() => setPage(page + 1)} className="h-9 rounded-[8px] border border-[#D5DCE3] bg-white px-3 text-[13px] text-[#172B3A] disabled:text-[#B4BFCA]">
          Next
        </button>
      </div>
    </div>
  );
}

/** Tinted notice row: alert (red), info (blue), warn (amber), with an action on the right. */
export function Notice({ tone = "info", title, body, action, onAction, href }: { tone?: "info" | "alert" | "warn" | "good"; title: string; body?: string; action?: string; onAction?: () => void; href?: string }) {
  const bg = { info: "bg-[#E6F1FF]", alert: "bg-[#FFECEB]", warn: "bg-[#FEF3DC]", good: "bg-[#E3F8EF]" }[tone];
  const fg = { info: "text-[#0059BE]", alert: "text-[#C0231A]", warn: "text-[#93500B]", good: "text-[#067647]" }[tone];
  return (
    <div className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${bg}`}>
      <span className={`shrink-0 ${fg}`}>{tone === "alert" ? <AlertIcon size={18} /> : tone === "good" ? <CheckIcon size={18} /> : <InfoIcon size={18} />}</span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-[14px] leading-5 text-[#172B3A]">{title}</span>
        {body && <span className="text-[12px] leading-4 text-[#4D5E70]">{body}</span>}
      </div>
      {action &&
        (href ? (
          <Link href={href} className={btnLink}>
            {action}
          </Link>
        ) : (
          <button type="button" onClick={onAction} className={btnLink}>
            {action}
          </button>
        ))}
    </div>
  );
}

/** OW05 Manage row: grey icon circle, title, hint, chevron. */
export function ManageRow({ icon, title, sub, href, onClick }: { icon: React.ReactNode; title: string; sub: string; href?: string; onClick?: () => void }) {
  const inner = (
    <>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F4F6F8] text-[#172B3A]">{icon}</span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5 text-left">
        <span className="text-[16px] leading-6 tracking-[-0.01em] text-[#172B3A]">{title}</span>
        <span className="truncate text-[12px] leading-4 text-[#68788A]">{sub}</span>
      </span>
      <ChevronRightIcon size={20} className="shrink-0 text-[#4D5E70]" />
    </>
  );
  const cls = "flex min-h-[62px] w-full items-center gap-3 py-3";
  return href ? (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}

/** Status checklist row (OW04 steps, OW22 Status): green tick or blue info with "Add". */
export function StepRow({ done, title, sub, href, onClick, action = "Add" }: { done: boolean; title: string; sub: string; href?: string; onClick?: () => void; action?: string }) {
  const inner = (
    <>
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${done ? "bg-[#E3F8EF] text-[#067647]" : "bg-[#E6F1FF] text-[#0059BE]"}`}>{done ? <CheckIcon size={16} /> : <InfoIcon size={16} />}</span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5 text-left">
        <span className="text-[14px] leading-5 text-[#172B3A]">{title}</span>
        <span className="truncate text-[12px] leading-4 text-[#68788A]">{sub}</span>
      </span>
      {!done && (
        <span className="flex items-center gap-1 text-[13px] text-[#C81E57]">
          {action}
          <ChevronRightIcon size={16} />
        </span>
      )}
    </>
  );
  const cls = "flex min-h-[62px] w-full items-center gap-3 py-2";
  if (done) return <div className={cls}>{inner}</div>;
  return href ? (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}

/** Search box + filter buttons above a table. */
export function Filters({ q, setQ, placeholder, filters = [] }: { q: string; setQ: (v: string) => void; placeholder: string; filters?: string[] }) {
  return (
    <div className="flex items-center gap-3">
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder} className="h-11 w-[320px] rounded-[12px] border border-[#D5DCE3] bg-white px-4 text-[14px] text-[#172B3A] placeholder:text-[#68788A] focus:border-[#E22765] focus:outline-none" />
      {filters.map((f) => (
        <span key={f} className="flex h-11 items-center gap-2 rounded-[12px] border border-[#D5DCE3] bg-white px-4 text-[14px] text-[#4D5E70]">
          {f}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      ))}
    </div>
  );
}

/** Field rows in the web style (label, 48 px input, hint). */
export function WField({ label, value, onChange, hint, area = false, tone }: { label: string; value: string; onChange: (v: string) => void; hint?: string; area?: boolean; tone?: "red" }) {
  const cls = "w-full rounded-[12px] border border-[#D5DCE3] bg-white px-4 text-[14px] leading-5 text-[#172B3A] focus:border-[#E22765] focus:outline-none";
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[13px] leading-4 text-[#172B3A]">{label}</span>
      {area ? <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} className={`${cls} resize-none py-3`} /> : <input value={value} onChange={(e) => onChange(e.target.value)} className={`${cls} h-12`} />}
      {hint && <span className={`text-[12px] leading-4 ${tone === "red" ? "text-[#C0231A]" : "text-[#68788A]"}`}>{hint}</span>}
    </label>
  );
}

/** Image drop area with the flyer (OW04, OW22, OW33). */
export function ImageDrop({ src, hint, onChange }: { src?: string; hint: string; onChange?: () => void }) {
  return (
    <div className="flex flex-col gap-2">
      <button type="button" onClick={onChange} className="relative h-[180px] w-full overflow-hidden rounded-[12px] border border-dashed border-[#B4BFCA] bg-[#F4F6F8] text-[14px] text-[#4D5E70]">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" className="h-full w-full object-cover" />
        ) : (
          "Drop an image here or choose one"
        )}
      </button>
      <span className="text-[12px] leading-4 text-[#68788A]">{hint}</span>
    </div>
  );
}
