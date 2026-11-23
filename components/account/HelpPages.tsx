"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { HELP_TOPICS, type HelpTopic } from "@/data/account";
import { MY_TICKETS } from "@/data/mine";
import { useAfterTicket } from "@/lib/afterTicket";
import { ActionRow, TicketLineIcon } from "@/components/mobile/AppParts";
import { AppTop, WebShell } from "@/components/checkout/CheckoutShell";
import { Sheet, useToast } from "@/components/shared/Sheet";
import { BuildingIcon, InfoIcon, MoreIcon, SearchIcon, UserIcon, WalletIcon } from "@/components/icons";
import { SectionLabel } from "@/components/account/AccountParts";

const TOPIC_ICONS: Record<HelpTopic["icon"], React.ReactNode> = {
  ticket: <TicketLineIcon />,
  wallet: <WalletIcon size={20} />,
  building: <BuildingIcon size={20} />,
  user: <UserIcon size={20} />,
};

/** Phone page or web help centre column, same content. */
function HelpLayout({ title, subtitle, back, children, bar }: { title: string; subtitle?: string; back: string; children: React.ReactNode; bar?: React.ReactNode }) {
  const router = useRouter();
  return (
    <>
      <div className={`min-h-screen bg-white pt-[env(safe-area-inset-top)] md:hidden ${bar ? "pb-[120px]" : "pb-10"}`}>
        <AppTop title={title} subtitle={subtitle} onBack={() => (window.history.length > 1 ? router.back() : router.push(back))} />
        <div className="flex flex-col px-4 pt-3">{children}</div>
        {bar}
      </div>
      <WebShell>
        <div className="mx-auto flex w-full max-w-[640px] flex-col">
          {subtitle && (
            <Link href={back} className="w-fit pb-3 text-[14px] text-[#C81E57]">
              {subtitle}
            </Link>
          )}
          <h1 className="pb-6 text-[28px] font-bold leading-[34px] tracking-[-0.02em] text-[#172B3A]">{title}</h1>
          {children}
        </div>
      </WebShell>
    </>
  );
}

function SearchHelp({ q, setQ }: { q: string; setQ: (v: string) => void }) {
  return (
    <label className="flex h-12 items-center gap-2 rounded-full border border-[#E9EDF1] bg-[#F4F6F8] px-4">
      <SearchIcon size={20} className="text-[#68788A]" />
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search help" className="h-full flex-1 bg-transparent text-[14px] text-[#172B3A] placeholder:text-[#68788A] focus:outline-none" />
    </label>
  );
}

function SearchResults({ q }: { q: string }) {
  const hits = HELP_TOPICS.flatMap((t) => t.articles.filter((a) => (a.title + a.body.join(" ")).toLowerCase().includes(q.toLowerCase())).map((a) => ({ t, a })));
  return (
    <div className="flex flex-col pt-3">
      <SectionLabel first>{hits.length ? `${hits.length} answer${hits.length === 1 ? "" : "s"}` : "No answers"}</SectionLabel>
      {hits.map(({ t, a }) => (
        <ActionRow key={a.slug} icon={TOPIC_ICONS[t.icon]} title={a.title} subtitle={t.title} href={`/help/${t.slug}/${a.slug}`} />
      ))}
      {!hits.length && <p className="py-3 text-[14px] leading-5 text-[#4D5E70]">Try other words, or start a case and we&apos;ll help.</p>}
    </div>
  );
}

/** "Start a case" asks which order it is about, then opens Get help on that order (PW44). */
export function StartCaseSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const orders = MY_TICKETS.filter((t) => t.pass && t.code);
  return (
    <Sheet open={open} onClose={onClose} title="Which order is it about?">
      <div className="flex flex-col">
        {orders.map((t) => (
          <ActionRow key={t.id} icon={<TicketLineIcon />} title={t.event.title} subtitle={`Order ${t.code.split(" ").slice(0, 2).join(" ")} · ${t.event.dateLabel}`} onClick={() => router.push(`/my-events/${t.id}/order?help`)} />
        ))}
        <ActionRow icon={<MoreIcon size={20} />} title="Something else" subtitle="Email support@xiventa.com" href="mailto:support@xiventa.com" />
      </div>
    </Sheet>
  );
}

/* ------------------------------------------------------------------ AM50 Help and support */

export function HelpHome() {
  const [q, setQ] = useState("");
  const [start, setStart] = useState(false);
  const after = useAfterTicket("abnormal-nightout");
  return (
    <HelpLayout title="Help" back="/account">
      <SearchHelp q={q} setQ={setQ} />
      {q.trim() ? (
        <SearchResults q={q.trim()} />
      ) : (
        <>
          <div className="pt-5" />
          <SectionLabel first>Topics</SectionLabel>
          {HELP_TOPICS.map((t) => (
            <ActionRow key={t.slug} icon={TOPIC_ICONS[t.icon]} title={t.title} subtitle={t.sub} href={`/help/${t.slug}`} />
          ))}
          <SectionLabel>Your cases</SectionLabel>
          <ActionRow icon={<InfoIcon size={20} />} title={after.case && after.case.reason !== "Not let in" ? after.case.reason : "Not let in with a valid ticket"} subtitle="The Abnormal Nightout · Waiting for the host" href="/help/case" />
          <div className="pt-3">
            <ActionRow icon={<MoreIcon size={20} />} title="Contact support" subtitle="Start a new case" onClick={() => setStart(true)} />
          </div>
          <p className="pt-2 text-[12px] leading-4 text-[#4D5E70]">
            Or email{" "}
            <a href="mailto:support@xiventa.com" className="text-[#C81E57]">
              support@xiventa.com
            </a>
          </p>
        </>
      )}
      <StartCaseSheet open={start} onClose={() => setStart(false)} />
    </HelpLayout>
  );
}

/* ------------------------------------------------------------------ AM70 / AM71 topic */

export function HelpTopicPage({ topic }: { topic: HelpTopic }) {
  const [q, setQ] = useState("");
  const [start, setStart] = useState(false);
  return (
    <HelpLayout title={topic.title} subtitle="Help and support" back="/help">
      <SearchHelp q={q} setQ={setQ} />
      {q.trim() ? (
        <SearchResults q={q.trim()} />
      ) : (
        <>
          <div className="pt-5" />
          <SectionLabel first>Common questions</SectionLabel>
          <div className="flex flex-col divide-y divide-[#E9EDF1]">
            {topic.articles.map((a) => (
              <Link key={a.slug} href={`/help/${topic.slug}/${a.slug}`} className="flex min-h-[60px] items-center text-[16px] leading-6 tracking-[-0.01em] text-[#172B3A]">
                {a.title}
              </Link>
            ))}
          </div>
          <SectionLabel>Still stuck?</SectionLabel>
          <button type="button" onClick={() => setStart(true)} className="mt-2 flex h-[52px] w-full flex-none items-center justify-center rounded-[12px] bg-[#E22765] text-[16px] tracking-[-0.01em] text-white hover:bg-[#C81E57] md:w-fit md:px-6">
            Start a case
          </button>
        </>
      )}
      <StartCaseSheet open={start} onClose={() => setStart(false)} />
    </HelpLayout>
  );
}

/* ------------------------------------------------------------------ AM72 Help article */

export function HelpArticlePage({ topic, article }: { topic: HelpTopic; article: HelpTopic["articles"][number] }) {
  const [vote, setVote] = useState<"yes" | "no" | null>(null);
  const [start, setStart] = useState(false);
  const { show: toast, node: toastNode } = useToast();
  return (
    <HelpLayout title="Help" subtitle={topic.title} back={`/help/${topic.slug}`}>
      <h2 className="text-[20px] font-bold leading-[26px] tracking-[-0.02em] text-[#172B3A]">{article.title}</h2>
      <div className="flex flex-col gap-4 pt-3">
        {article.body.map((p) => (
          <p key={p} className="text-[14px] leading-5 text-[#172B3A]">
            {p}
          </p>
        ))}
        {article.note && <p className="text-[14px] leading-5 text-[#4D5E70]">{article.note}</p>}
      </div>
      <SectionLabel>Was this helpful?</SectionLabel>
      <div className="flex gap-2 pt-2">
        {(["yes", "no"] as const).map((v) => (
          <button
            key={v}
            type="button"
            aria-pressed={vote === v}
            onClick={() => {
              setVote(v);
              toast(v === "yes" ? "Thanks for telling us" : "Thanks. We'll make this clearer");
            }}
            className={`flex h-9 w-[56px] items-center justify-center rounded-[8px] text-[14px] ${vote === v ? "bg-[#E22765] text-white" : vote ? "bg-[#F4F6F8] text-[#68788A]" : "bg-[#172B3A] text-white"}`}
          >
            {v === "yes" ? "Yes" : "No"}
          </button>
        ))}
      </div>
      <button type="button" onClick={() => setStart(true)} className="mt-8 flex h-11 items-center justify-center self-center rounded-[12px] bg-[#E22765] px-6 text-[14px] text-white hover:bg-[#C81E57]">
        Start a case
      </button>
      <StartCaseSheet open={start} onClose={() => setStart(false)} />
      {toastNode}
    </HelpLayout>
  );
}
