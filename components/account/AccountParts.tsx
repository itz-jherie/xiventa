"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateSession, useSession } from "@/lib/session";
import { AppBottomBar, AppTop } from "@/components/checkout/CheckoutShell";
import { AccountShell } from "@/components/web/AccountShell";
import { Sheet, sheetPrimary, sheetSecondary } from "@/components/shared/Sheet";

/**
 * One settings screen in both layouts: the app page (back arrow, title, fixed bottom action) below
 * 768 px, and the same body inside the web account shell above it. Only PW15 Account has its own
 * web frame; the other settings reuse the app content on the web.
 */
export function SettingsPage({
  title,
  subtitle,
  back = "/account",
  action,
  onAction,
  actionDisabled,
  children,
}: {
  title: string;
  subtitle?: string;
  back?: string;
  action?: string;
  onAction?: () => void;
  actionDisabled?: boolean;
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <>
      <div className={`min-h-screen bg-white pt-[env(safe-area-inset-top)] md:hidden ${action ? "pb-[120px]" : "pb-10"}`}>
        <AppTop title={title} subtitle={subtitle} onBack={() => (window.history.length > 1 ? router.back() : router.push(back))} />
        <div className="flex flex-col px-4 pt-3">{children}</div>
        {action && onAction && <AppBottomBar action={action} onAction={onAction} disabled={actionDisabled} />}
      </div>
      <div className="hidden md:block">
        <AccountShell>
          <h1 className="text-[28px] font-bold leading-[34px] tracking-[-0.02em] text-[#172B3A]">{title}</h1>
          <div className="flex w-full max-w-[632px] flex-col">{children}</div>
          {action && onAction && (
            <button
              type="button"
              disabled={actionDisabled}
              onClick={onAction}
              className="flex h-11 w-fit items-center rounded-[12px] bg-[#E22765] px-4 text-[14px] text-white hover:bg-[#C81E57] disabled:bg-[#F5A3BF]"
            >
              {action}
            </button>
          )}
        </AccountShell>
      </div>
    </>
  );
}

/** 10 / 12 uppercase section label ("YOURS", "SETTINGS", "ALWAYS ON"). */
export function SectionLabel({ children, first = false }: { children: React.ReactNode; first?: boolean }) {
  return <span className={`text-[10px] uppercase leading-3 tracking-[0.04em] text-[#68788A] ${first ? "pb-1" : "pb-1 pt-5"}`}>{children}</span>;
}

/** Settings row with a title, optional hint and a control or value on the right. */
export function SettingRow({ title, sub, right, onClick }: { title: string; sub?: string; right?: React.ReactNode; onClick?: () => void }) {
  const inner = (
    <>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5 text-left">
        <span className="text-[16px] leading-6 tracking-[-0.01em] text-[#172B3A]">{title}</span>
        {sub && <span className="text-[12px] leading-4 text-[#68788A]">{sub}</span>}
      </span>
      {right}
    </>
  );
  const cls = "flex min-h-[52px] w-full items-center gap-4 py-2";
  return onClick ? (
    <button type="button" onClick={onClick} className={cls}>
      {inner}
    </button>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

/** Red notice with an action on the right (AM45 Off on phone, AM64 Delete account). */
export function AlertNotice({ title, body, action, onAction }: { title: string; body: string; action?: string; onAction?: () => void }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-[#FDECEB] px-4 py-3">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="shrink-0">
        <circle cx="10" cy="10" r="7.5" stroke="#C0231A" strokeWidth="1.5" />
        <path d="M10 6.5V11M10 13.5V13.6" stroke="#C0231A" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="text-[13px] leading-4 text-[#172B3A]">{title}</p>
        <p className="text-[12px] leading-4 text-[#4D5E70]">{body}</p>
      </div>
      {action && (
        <button type="button" onClick={onAction} className="shrink-0 text-[13px] leading-4 text-[#C0231A]">
          {action}
        </button>
      )}
    </div>
  );
}

/** PW31 interest chips. Labels that match onboarding (AM09) are stored under the onboarding name. */
export const INTEREST_OPTIONS: [string, string][] = [
  ["Music", "Music"],
  ["Nightlife & Parties", "Nightlife"],
  ["Arts & Culture", "Arts & Culture"],
  ["Food & Drink", "Food & Drink"],
  ["Tech & Business", "Tech & Business"],
  ["Comedy", "Comedy"],
  ["Sports & Fitness", "Sports"],
  ["Fun & Games", "Fun & Games"],
  ["Faith & Spirituality", "Faith"],
  ["Family & Kids", "Family & Kids"],
  ["Learning & Workshops", "Learning & Workshops"],
  ["Community & Causes", "Community & Causes"],
  ["Fashion & Lifestyle", "Fashion & Lifestyle"],
  ["Outdoors & Travel", "Outdoors"],
];

export const interestSummary = (list?: string[]) => (list?.length ? list.slice(0, 3).join(", ") + (list.length > 3 ? ` and ${list.length - 3} more` : "") : "Pick a few to tune Home");

/** PW31 What are you into? (bottom sheet on phones). */
export function InterestsSheet({ open, onClose, onSaved }: { open: boolean; onClose: () => void; onSaved?: (n: number) => void }) {
  return (
    <Sheet open={open} onClose={onClose} title="What are you into?">
      {open && <InterestsBody onClose={onClose} onSaved={onSaved} />}
    </Sheet>
  );
}

function InterestsBody({ onClose, onSaved }: { onClose: () => void; onSaved?: (n: number) => void }) {
  const session = useSession();
  const [picked, setPicked] = useState<string[]>(() => session?.interests ?? ["Nightlife", "Food & Drink", "Tech & Business"]);
  const toggle = (v: string) => setPicked((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]));
  return (
    <div className="flex flex-col gap-4">
      <p className="text-[14px] leading-5 text-[#4D5E70]">Pick a few. You can change these any time in Account.</p>
      <div className="flex flex-wrap gap-2">
        {INTEREST_OPTIONS.map(([label, value]) => {
          const on = picked.includes(value);
          return (
            <button
              key={label}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(value)}
              className={`flex h-8 items-center whitespace-nowrap rounded-full px-4 text-[13px] leading-4 ${on ? "bg-[#E22765] text-white" : "border border-[#B4BFCA] bg-white text-[#4D5E70] hover:border-[#68788A]"}`}
            >
              {label}
            </button>
          );
        })}
      </div>
      <p className="text-[14px] leading-5 text-[#4D5E70]">Your interests are private. They only change what you see on Home and are never shared with hosts.</p>
      <div className="flex gap-3 pb-2">
        <button type="button" onClick={onClose} className={`${sheetSecondary} w-[104px]`}>
          Not now
        </button>
        <button
          type="button"
          disabled={!picked.length}
          onClick={() => {
            updateSession({ interests: picked });
            onClose();
            onSaved?.(picked.length);
          }}
          className={sheetPrimary}
        >
          Save {picked.length} interest{picked.length === 1 ? "" : "s"}
        </button>
      </div>
    </div>
  );
}
