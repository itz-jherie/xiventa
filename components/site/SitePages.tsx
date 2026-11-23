"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { LEGAL_PAGES } from "@/data/account";
import { updateSettings, useSettings } from "@/lib/account";
import { setReturnTo } from "@/lib/session";
import { TopNav } from "@/components/web/TopNav";
import { WebFooter } from "@/components/web/WebFooter";
import { AppTop } from "@/components/checkout/CheckoutShell";
import { Toggle } from "@/components/checkout/CheckoutParts";
import { GetAppButton } from "@/components/pwa/GetAppButton";
import { Sheet, sheetPrimary, sheetSecondary } from "@/components/shared/Sheet";
import { ChevronRightIcon, InfoIcon } from "@/components/icons";

/* ------------------------------------------------------------------ PW21 Legal */

/** PW21 Legal: side list of the five pages, 40 px title, draft notice and the sections. */
export function LegalPage({ slug }: { slug: string }) {
  const router = useRouter();
  const page = LEGAL_PAGES.find((p) => p.slug === slug) ?? LEGAL_PAGES[0];
  const body = (
    <>
      <p className="pt-3 text-[12px] leading-4 text-[#4D5E70] md:pt-4">Last updated Mon 6 Oct 2026</p>
      <div className="mt-6 flex items-center gap-3 rounded-2xl bg-[#FDECEB] px-4 py-3">
        <InfoIcon size={20} className="shrink-0 text-[#C0231A]" />
        <div className="flex flex-col gap-0.5">
          <p className="text-[13px] leading-4 text-[#172B3A]">Draft wording</p>
          <p className="text-[12px] leading-4 text-[#4D5E70]">Final legal text is being prepared. This page shows the structure only.</p>
        </div>
      </div>
      {page.sections.map(([h, p]) => (
        <section key={h} className="flex flex-col gap-2 pt-6">
          <h2 className="text-[20px] font-bold leading-[26px] tracking-[-0.02em] text-[#172B3A]">{h}</h2>
          <p className="text-[16px] leading-6 text-[#4D5E70]">{p}</p>
        </section>
      ))}
    </>
  );
  return (
    <>
      <div className="min-h-screen bg-white pb-10 pt-[env(safe-area-inset-top)] md:hidden">
        <AppTop title={page.title} onBack={() => (window.history.length > 1 ? router.back() : router.push("/m"))} />
        <div className="flex flex-col px-4">{body}</div>
      </div>
      <div className="hidden min-h-screen flex-col bg-white md:flex">
        <TopNav />
        <main className="mx-auto flex w-full max-w-[1440px] flex-1 gap-12 px-6 pb-24 pt-10 lg:px-[120px]">
          <nav aria-label="Legal" className="hidden w-[240px] shrink-0 flex-col gap-1 lg:flex">
            {LEGAL_PAGES.map((p) => {
              const on = p.slug === page.slug;
              return (
                <Link key={p.slug} href={`/${p.slug}`} className={`flex h-10 items-center gap-3 rounded-[8px] px-3 text-[14px] ${on ? "bg-[#FDEEF3] text-[#C81E57]" : "text-[#4D5E70] hover:bg-[#F4F6F8]"}`}>
                  <InfoIcon size={16} className={on ? "text-[#E22765]" : "text-[#68788A]"} />
                  {p.title}
                </Link>
              );
            })}
          </nav>
          <article className="flex min-w-0 max-w-[912px] flex-1 flex-col">
            <h1 className="text-[40px] font-bold leading-[48px] tracking-[-0.02em] text-[#172B3A]">{page.title}</h1>
            {body}
          </article>
        </main>
        <WebFooter />
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ PW23 For organizers */

const FEATURES: [string, string][] = [
  ["Free events stay free", "Picnics, church programmes and meetups list at no cost, with RSVP and guest lists."],
  ["Paid tickets, tables and waitlists", "Ticket types, tables, guest names and a waitlist that fills seats when people drop out."],
  ["Fast check in", "Scan QR codes even when the network drops. Add staff for every gate."],
];
const QUESTIONS: [string, string, string][] = [
  ["Do I need to be verified?", "Only to sell paid tickets. Free events can go live straight away.", "/help/hosting/verified"],
  ["When do I get paid?", "After your event ends, on the schedule shown in your wallet.", "/help/hosting/payouts"],
  ["Can my team help?", "Add managers, finance and check in staff with their own access.", "/help/hosting/check-in-staff"],
];

export function OrganizersPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <TopNav />
      <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-12 px-4 pb-24 pt-6 md:px-6 md:pt-10 lg:px-[120px]">
        <section className="flex flex-col gap-4 rounded-[24px] bg-[#172B3A] p-6 md:p-14">
          <h1 className="text-[32px] font-bold leading-[40px] tracking-[-0.02em] text-white md:text-[40px] md:leading-[48px]">Sell out your next event</h1>
          <p className="text-[16px] leading-6 text-white/80">Create it on your phone, sell tickets in naira, check people in at the door and get paid to your bank.</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/dashboard" className="flex h-[52px] items-center rounded-[12px] bg-[#E22765] px-5 text-[16px] tracking-[-0.01em] text-white hover:bg-[#C81E57]">
              Go to the dashboard
            </Link>
            <GetAppButton className="flex h-[52px] items-center rounded-[12px] bg-white px-5 text-[16px] tracking-[-0.01em] text-[#172B3A]">Get the app</GetAppButton>
          </div>
        </section>
        <section id="list-your-place" className="grid gap-6 md:grid-cols-3">
          {FEATURES.map(([t, b]) => (
            <div key={t} className="flex flex-col gap-2 rounded-2xl border border-[#E9EDF1] p-6">
              <h2 className="text-[20px] font-bold leading-[26px] tracking-[-0.02em] text-[#172B3A]">{t}</h2>
              <p className="text-[14px] leading-5 text-[#4D5E70]">{b}</p>
            </div>
          ))}
        </section>
        <section className="flex flex-col gap-3 rounded-2xl border border-[#E9EDF1] p-6 md:p-8">
          <h2 className="text-[24px] font-bold leading-[30px] tracking-[-0.02em] text-[#172B3A]">How fees work</h2>
          <p className="text-[16px] leading-6 text-[#4D5E70]">
            Listing free events costs nothing. For paid tickets, Xiventa charges a service fee that you can pass to buyers or absorb. Current fees are shown in your dashboard before you publish, as they can change.
          </p>
        </section>
        <section className="flex flex-col">
          <h2 className="pb-3 text-[24px] font-bold leading-[30px] tracking-[-0.02em] text-[#172B3A]">Questions hosts ask</h2>
          {QUESTIONS.map(([q, a, href]) => (
            <Link key={q} href={href} className="flex min-h-[70px] items-center gap-3 py-3">
              <span className="flex flex-1 flex-col gap-1">
                <span className="text-[16px] leading-6 tracking-[-0.01em] text-[#172B3A]">{q}</span>
                <span className="text-[12px] leading-4 text-[#68788A]">{a}</span>
              </span>
              <ChevronRightIcon size={20} className="text-[#4D5E70]" />
            </Link>
          ))}
        </section>
      </main>
      <WebFooter />
    </div>
  );
}

/* ------------------------------------------------------------------ PW20 Not found */

export function NotFoundView() {
  const body = (
    <div className="flex flex-col items-center gap-3 px-6 text-center">
      <Image src="/images/not-found.svg" alt="" width={144} height={120} />
      <h1 className="pt-3 text-[20px] font-bold leading-[26px] tracking-[-0.02em] text-[#172B3A]">This page is not here</h1>
      <p className="max-w-[320px] text-[14px] leading-5 text-[#4D5E70]">The link may be wrong, or the event was removed or made private by its host.</p>
      <div className="flex gap-3 pt-6">
        <Link href="/search" className="flex h-[52px] items-center rounded-[12px] border border-[#B4BFCA] bg-white px-5 text-[16px] tracking-[-0.01em] text-[#172B3A] hover:border-[#68788A]">
          Search events
        </Link>
        <Link href="/" className="flex h-[52px] items-center rounded-[12px] bg-[#E22765] px-5 text-[16px] tracking-[-0.01em] text-white hover:bg-[#C81E57]">
          Go to Home
        </Link>
      </div>
    </div>
  );
  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-white md:hidden">{body}</div>
      <div className="hidden min-h-screen flex-col bg-white md:flex">
        <TopNav />
        <main className="flex flex-1 items-center justify-center py-24">{body}</main>
        <WebFooter />
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ PW26 Cookie notice */

/**
 * PW26 Cookie notice (560 px card, bottom left) and Cookie settings. Web only and shown until a
 * choice is made. /cookies?settings opens the settings straight away.
 */
export function CookieNotice() {
  const pathname = usePathname();
  const settings = useSettings();
  const [open, setOpen] = useState<"notice" | "settings" | null>("notice");
  const [draft, setDraft] = useState<{ analytics: boolean; marketing: boolean } | null>(null);
  if (!settings.ready || settings.cookies.decided || open === null || /^\/(dashboard|admin|host)/.test(pathname)) return null;
  const c = draft ?? { analytics: true, marketing: true };
  const save = (v: { analytics: boolean; marketing: boolean }) => {
    updateSettings({ cookies: { decided: true, ...v } });
    setOpen(null);
  };
  return (
    <div role="dialog" aria-label={open === "notice" ? "Cookies on Xiventa" : "Cookie settings"} className="fixed bottom-6 left-6 z-[96] hidden w-[560px] max-w-[calc(100vw-48px)] rounded-2xl border border-[#E9EDF1] bg-white p-6 shadow-[0_12px_32px_rgba(23,43,58,0.16)] md:block">
      {open === "notice" ? (
        <>
          <h2 className="text-[17px] leading-[22px] text-[#172B3A]">Cookies on Xiventa</h2>
          <p className="pt-3 text-[14px] leading-5 text-[#4D5E70]">We use a few cookies to keep you signed in and to understand what people look for. You choose the rest.</p>
          <div className="flex justify-end gap-3 pt-5">
            <button type="button" onClick={() => setOpen("settings")} className="flex h-11 items-center rounded-[12px] border border-[#B4BFCA] px-4 text-[14px] text-[#172B3A] hover:border-[#68788A]">
              Manage
            </button>
            <button type="button" onClick={() => save({ analytics: true, marketing: true })} className="flex h-11 items-center rounded-[12px] bg-[#E22765] px-4 text-[14px] text-white hover:bg-[#C81E57]">
              Accept all
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className="pb-2 text-[17px] leading-[22px] text-[#172B3A]">Cookie settings</h2>
          <div className="flex min-h-[56px] items-center justify-between">
            <span className="text-[16px] leading-6 text-[#172B3A]">Needed</span>
            <span className="flex items-center gap-2 text-[14px] text-[#4D5E70]">
              Always on
              <ChevronRightIcon size={20} />
            </span>
          </div>
          {(
            [
              ["analytics", "Analytics", "Helps us see what works"],
              ["marketing", "Marketing", "Lets us show you Xiventa ads elsewhere"],
            ] as const
          ).map(([k, t, s]) => (
            <div key={k} className="flex min-h-[62px] items-center justify-between gap-4">
              <span className="flex flex-col gap-0.5">
                <span className="text-[16px] leading-6 text-[#172B3A]">{t}</span>
                <span className="text-[12px] leading-4 text-[#68788A]">{s}</span>
              </span>
              <Toggle on={c[k]} onChange={(v) => setDraft({ ...c, [k]: v })} label={t} />
            </div>
          ))}
          <div className="flex justify-end pt-3">
            <button type="button" onClick={() => save(c)} className="flex h-11 items-center rounded-[12px] bg-[#E22765] px-4 text-[14px] text-white hover:bg-[#C81E57]">
              Save choices
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ PW32 Sign in prompts */

export type SignInReason = "save" | "join" | "alerts" | "report" | "tickets" | "review";

const SIGN_IN_COPY: Record<SignInReason, [string, string]> = {
  save: ["Sign in to save this", "Saved events and places stay with your account on every device. We remind you before they start."],
  join: ["Sign in to save your spot", "Hosts need to know who is coming. I'm going, free tickets, waitlists and requests to join need an account."],
  alerts: ["Sign in to get alerts", "Reminders, ticket updates and changes to events you care about come to your account."],
  report: ["Sign in to report", "Reports come from real accounts so our team can follow up with you."],
  tickets: ["Sign in to get your tickets", "We keep your choice while you sign in, then take you straight to the next step."],
  review: ["Sign in to review", "Reviews come from real accounts. Add stars, a few words and photos."],
};

/** PW32 Sign in (overlay): why we ask, then Continue with phone. Comes back to `returnTo` after. */
export function SignInSheet({ reason, onClose, returnTo }: { reason: SignInReason | null; onClose: () => void; returnTo: string }) {
  const router = useRouter();
  const [title, body] = SIGN_IN_COPY[reason ?? "save"];
  return (
    <Sheet
      open={!!reason}
      onClose={onClose}
      title={title}
      footer={
        <>
          <button type="button" onClick={onClose} className={`${sheetSecondary} w-[104px] md:ml-auto`}>
            Not now
          </button>
          <button
            type="button"
            onClick={() => {
              setReturnTo(returnTo);
              router.push("/welcome");
            }}
            className={`${sheetPrimary} md:flex-none md:px-5`}
          >
            Continue with phone
          </button>
        </>
      }
    >
      <p className="text-[14px] leading-5 text-[#4D5E70]">{body}</p>
      <p className="pt-3 text-[14px] leading-5 text-[#4D5E70]">We send a one time code. No password needed.</p>
    </Sheet>
  );
}
