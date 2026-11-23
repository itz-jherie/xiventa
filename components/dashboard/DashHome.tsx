"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { AlertIcon, ChevronRightIcon, InfoIcon, TrendUpIcon } from "@/components/icons";
import { XiventaWordmark } from "@/components/icons/XiventaWordmark";
import { Toggle } from "@/components/checkout/CheckoutParts";
import { useToast } from "@/components/shared/Sheet";
import { DASH_EVENTS, TABLE_IDS, TAB_COUNTS, type DashTab } from "@/data/dashboard";
import { fromFlyer, startDraft, updateDraft, type Format } from "@/lib/createDraft";
import { naira, useHost } from "@/lib/hosting";
import { completeCode, saveName, signInWithProvider, startSignIn, useSession } from "@/lib/session";
import { Card, DashShell, Filters, H2, ImageDrop, LinkTabs, Notice, PageHead, StepRow, Status, Table, WField, btnLink, btnPrimary, btnSecondary, useActingWeb } from "./DashParts";
import { evHref } from "./DashEvent";

/* ------------------------------------------------------------------ OW02 Overview (+ New host) */

const STATS = [
  { label: "Ticket sales", value: "₦2,130,000", delta: "Up 18% vs last week", up: true },
  { label: "Tickets sold", value: "142", delta: "Up 24 this week", up: true },
  { label: "Coming up", value: "3 events", delta: "Next: Sat 25 Oct" },
  { label: "Available to pay out", value: "₦1,240,000", delta: "Next payout Fri 31 Oct" },
];
const ACTIONS = [
  { tone: "alert", title: "Fix your payout account", detail: "The account name does not match your CAC name", action: "Fix", href: "/dashboard/settings/payout" },
  { tone: "info", title: "Publish 1 draft", detail: "Day Party at the Beach is ready to review", action: "Add", href: evHref("day-party", "publish") },
  { tone: "info", title: "Add a Spotlight clip", detail: "Events with a clip get seen in Spotlight", action: "Add", href: evHref("abnormal-nightout", "clip") },
];

function Greeting() {
  const acting = useActingWeb();
  const h = new Date().getHours();
  const part = h < 12 ? "morning" : h < 17 ? "afternoon" : "evening";
  return <h1 className="text-[28px] font-bold leading-[34px] tracking-[-0.02em]">{`Good ${part}, ${acting.name}`}</h1>;
}

export function Overview() {
  const sp = useSearchParams();
  const fresh = sp.get("state") === "new";
  return <DashShell phone="/host">{fresh ? <NewHost /> : <OverviewBody />}</DashShell>;
}

function OverviewBody() {
  const router = useRouter();
  const host = useHost();
  const upcoming = TABLE_IDS.upcoming.map((id) => DASH_EVENTS.find((e) => e.id === id)!).concat(DASH_EVENTS.filter((e) => e.id === "day-party"));
  return (
    <>
      <div className="flex items-end gap-6">
        <div className="flex flex-1 flex-col gap-1.5">
          <Greeting />
          <p className="text-[14px] leading-5 text-[#4D5E70]">Here is how your events are doing this week</p>
        </div>
        <Link href="/dashboard/events/new" className={btnPrimary}>
          Create event
        </Link>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {STATS.map((s) => (
          <div key={s.label} className="flex h-[120px] flex-col gap-2 rounded-2xl border border-[#D5DCE3] bg-white p-5">
            <span className="text-[13px] leading-4 text-[#4D5E70]">{s.label}</span>
            <span className="text-[24px] font-bold leading-[30px] tracking-[-0.02em]">{s.value}</span>
            <span className={`flex items-center gap-1 text-[12px] leading-4 ${s.up ? "text-[#067647]" : "text-[#68788A]"}`}>
              {s.up && <TrendUpIcon size={16} />}
              {s.delta}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-start gap-6">
        <section className="flex min-w-0 flex-1 flex-col gap-3">
          <H2>Upcoming events</H2>
          <Table
            head={["Event", "Date", "Status", "Sold", ""]}
            widths={[0, 150, 130, 100, 90]}
            rows={upcoming.map((e) => [
              e.title,
              e.date.split(",")[0],
              <Status key="s" label={host.cancelled.includes(e.id) ? "Cancelled" : e.status} />,
              e.sold ? `${e.sold} / ${e.capacity}` : "0",
              <span key="o" className="flex items-center justify-end gap-2 text-[13px] text-[#C81E57]">
                Open
                <ChevronRightIcon size={16} className="text-[#E22765]" />
              </span>,
            ])}
            onRow={(i) => router.push(upcoming[i].status === "Draft" ? evHref(upcoming[i].id, "publish") : evHref(upcoming[i].id))}
          />
        </section>
        <section className="flex w-[400px] shrink-0 flex-col rounded-2xl border border-[#E9EDF1] bg-white p-5">
          <H2>Next actions</H2>
          {ACTIONS.map((a) => (
            <Link key={a.title} href={a.href} className="flex h-[62px] items-center gap-3 py-3">
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${a.tone === "alert" ? "bg-[#FFECEB] text-[#C0231A]" : "bg-[#E6F1FF] text-[#0059BE]"}`}>
                {a.tone === "alert" ? <AlertIcon size={18} /> : <InfoIcon size={18} />}
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-[14px] leading-5 text-[#172B3A]">{a.title}</span>
                <span className="truncate text-[12px] leading-4 text-[#68788A]">{a.detail}</span>
              </span>
              <span className="text-[13px] leading-4 text-[#C81E57]">{a.action}</span>
              <ChevronRightIcon size={16} className="text-[#E22765]" />
            </Link>
          ))}
        </section>
      </div>
    </>
  );
}

function NewHost() {
  return (
    <>
      <PageHead title="Welcome to Xiventa" />
      <div className="flex items-start gap-6">
        <Card className="min-w-0 flex-1 gap-3">
          <H2>Create your first event</H2>
          <p className="text-[14px] leading-5 text-[#4D5E70]">Every host verifies once with a bank account and a code. Then you can publish free or paid events.</p>
          <Link href="/dashboard/events/new" className={`${btnPrimary} w-fit`}>
            Create event
          </Link>
        </Card>
        <Card className="w-[400px] shrink-0 !pb-2">
          <StepRow done title="Host profile" sub="Name, photo and bio" />
          <StepRow done={false} title="Verify to host" sub="Bank account and a code. This also sets where we pay you." href="/create/verify" />
        </Card>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ OW03 Events */

const TABS: [DashTab, string][] = [
  ["upcoming", "Upcoming"],
  ["draft", "Drafts"],
  ["live", "Live"],
  ["ended", "Ended"],
  ["cancelled", "Cancelled"],
];

export function EventsList() {
  const sp = useSearchParams();
  const router = useRouter();
  const host = useHost();
  const tab = (TABS.find(([t]) => t === sp.get("tab"))?.[0] ?? "upcoming") as DashTab;
  const [q, setQ] = useState("");
  const cancelledNow = host.cancelled.filter((id) => DASH_EVENTS.some((e) => e.id === id));
  const ids = tab === "cancelled" ? [...cancelledNow.filter((id) => !TABLE_IDS.cancelled.includes(id)), ...TABLE_IDS.cancelled] : TABLE_IDS[tab].filter((id) => !cancelledNow.includes(id));
  const rows = ids.map((id) => DASH_EVENTS.find((e) => e.id === id)!).filter((e) => !q.trim() || e.title.toLowerCase().includes(q.trim().toLowerCase()));
  const count = (t: DashTab) => (t === "cancelled" ? TAB_COUNTS.cancelled + cancelledNow.filter((id) => !TABLE_IDS.cancelled.includes(id)).length : t === "upcoming" ? TAB_COUNTS.upcoming - cancelledNow.filter((id) => TABLE_IDS.upcoming.includes(id)).length : TAB_COUNTS[t]);
  return (
    <DashShell phone={`/host?tab=${tab === "cancelled" ? "ended" : tab}`}>
      <PageHead
        title="Events"
        actions={
          <>
            <Link href="/dashboard/reports" className={btnSecondary}>
              Reports
            </Link>
            <Link href="/dashboard/events/new" className={btnPrimary}>
              Create event
            </Link>
          </>
        }
      />
      <LinkTabs items={TABS.map(([t, l]) => [`${l} ${count(t)}`, `/dashboard/events?tab=${t}`])} active={`${TABS.find(([t]) => t === tab)![1]} ${count(tab)}`} />
      <Filters q={q} setQ={setQ} placeholder="Search your events" filters={["Any date"]} />
      <Table
        head={["Event", "Date", "Status", "Sold", "Revenue", ""]}
        widths={[0, 180, 140, 130, 140, 90]}
        rows={rows.map((e) => {
          const cancelled = host.cancelled.includes(e.id) || e.status === "Cancelled";
          return [
            <span key="t" className="text-[#172B3A]">{e.title}</span>,
            e.date,
            <Status key="s" label={cancelled ? "Cancelled" : e.status} />,
            cancelled ? `${e.refunded ?? e.sold} refunded` : `${e.sold} / ${e.capacity}`,
            naira(cancelled ? 0 : e.revenue),
            <span key="o" className={btnLink}>
              Open
            </span>,
          ];
        })}
        onRow={(i) => router.push(rows[i].status === "Draft" ? evHref(rows[i].id, "publish") : evHref(rows[i].id))}
        empty={
          tab === "live" ? (
            <>
              <span className="text-[16px] font-bold text-[#172B3A]">Nothing is live right now</span>
              <span className="text-[14px] text-[#4D5E70]">Events show here while doors are open, with the live check in count.</span>
            </>
          ) : (
            <span className="text-[14px] text-[#4D5E70]">No events match that.</span>
          )
        }
      />
    </DashShell>
  );
}

/* ------------------------------------------------------------------ OW04 Create event */

const FORMATS: [Format, string][] = [
  ["in-person", "In person"],
  ["virtual", "Online"],
  ["live", "Live stream"],
  ["hybrid", "Hybrid"],
];

export function CreateWeb() {
  const router = useRouter();
  const { show, node } = useToast();
  const file = useRef<HTMLInputElement>(null);
  const [flyer, setFlyer] = useState<string | null>(null);
  const [format, setFormat] = useState<Format>("in-person");
  const [v, setV] = useState({ name: "Day Party at the Beach", cat: "Nightlife & Parties, Music", date: "Sat 1 Nov 2026", time: "3 PM to 11 PM", age: "18" });
  const [repeat, setRepeat] = useState(false);
  const set = (k: keyof typeof v) => (x: string) => setV({ ...v, [k]: x });
  const basicsDone = !!(v.name.trim() && v.date.trim() && v.time.trim());
  const go = (to: string) => {
    startDraft("paid");
    const [start, end] = v.time.split(" to ");
    updateDraft({
      ...fromFlyer("paid"),
      flyer: flyer ? "read" : "by-hand",
      name: v.name.trim(),
      categories: v.cat.split(",").map((c) => c.trim()).filter(Boolean).slice(0, 2),
      date: v.date.replace(/ 20\d\d$/, ""),
      start: start ?? "",
      end,
      format,
      age: v.age ? Number(v.age) : null,
      repeat: repeat ? "Every week" : "Does not repeat",
      venue: "",
    });
    router.push(to);
  };
  return (
    <DashShell phone="/create">
      <PageHead
        crumbs={[["Events", "/dashboard/events"], ["New event"]]}
        title="Create event"
        sub="Same steps as the app. Your progress saves as a draft."
        actions={
          <>
            <button type="button" onClick={() => show("Saved to Drafts")} className={btnSecondary}>
              Save draft
            </button>
            <button type="button" disabled={!basicsDone} onClick={() => go("/create/location")} className={btnPrimary}>
              Next
            </button>
          </>
        }
      />
      <div className="flex items-start gap-6">
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <Card className="gap-3">
            <H2>Your flyer</H2>
            <span className="text-[10px] uppercase tracking-[0.04em] text-[#68788A]">We read it and fill in the details below</span>
            <span className="text-[13px] text-[#172B3A]">Flyer or poster</span>
            <input
              ref={file}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setFlyer(URL.createObjectURL(f));
              }}
            />
            <ImageDrop src={flyer ?? DASH_EVENTS.find((e) => e.id === "day-party")?.image} hint="Drop a new flyer here to read it again. It also becomes your event poster." onChange={() => file.current?.click()} />
            <Notice title="Filled in from your flyer" body="Name, date, start time, venue and three ticket prices. Check each one; anything we could not read is left empty." />
          </Card>
          <Card className="gap-4" >
            <H2>Event basics</H2>
            <span className="text-[10px] uppercase tracking-[0.04em] text-[#68788A]">How will people attend?</span>
            <div className="flex gap-2">
              {FORMATS.map(([k, l]) => (
                <button key={k} type="button" onClick={() => setFormat(k)} className={`flex h-8 items-center rounded-full px-4 text-[13px] ${format === k ? "bg-[#E22765] text-white" : "border border-[#B4BFCA] text-[#4D5E70]"}`}>
                  {l}
                </button>
              ))}
            </div>
            <WField label="Event name" value={v.name} onChange={set("name")} hint="From your flyer" />
            <WField label="Category" value={v.cat} onChange={set("cat")} hint="Up to 2. Suggested from your flyer." />
            <WField label="Date" value={v.date} onChange={set("date")} hint="From your flyer" />
            <WField label="Starts and ends" value={v.time} onChange={set("time")} hint="From your flyer" />
            <div className="flex items-center gap-3">
              <span className="flex flex-1 flex-col">
                <span className="text-[14px] text-[#172B3A]">Repeats</span>
                <span className="text-[12px] text-[#68788A]">For services, weekly nights or yearly events</span>
              </span>
              <Toggle on={repeat} onChange={setRepeat} label="Repeats" />
            </div>
            <WField label="Minimum age" value={v.age} onChange={(x) => set("age")(x.replace(/\D/g, "").slice(0, 2))} hint="Leave empty for all ages. We remind guests to bring ID." />
          </Card>
        </div>
        <Card className="sticky top-8 w-[300px] shrink-0 !py-2">
          <StepRow done title="Flyer" sub="Name, date, venue, prices" />
          <StepRow done title="Free or paid" sub="Paid or large" />
          <StepRow done={basicsDone} title="Event basics" sub="Name, category, date and time" onClick={() => window.scrollTo({ top: 400, behavior: "smooth" })} />
          <StepRow done={false} title="Location and access" sub="Venue and who can join" onClick={() => go("/create/location")} />
          <StepRow done={false} title="Extras (optional)" sub="Clip, details, gallery and links" onClick={() => go("/create/details")} />
          <StepRow done={false} title="Tickets" sub="Types, prices and limits" onClick={() => go("/create/tickets")} />
          <StepRow done={false} title="Review and publish" sub="Checklist and preview" onClick={() => go("/create/review")} />
        </Card>
      </div>
      {node}
    </DashShell>
  );
}

/* ------------------------------------------------------------------ OW01 Sign in */

export function DashSignIn() {
  const router = useRouter();
  const sp = useSearchParams();
  const session = useSession();
  const next = sp.get("next")?.startsWith("/dashboard") ? sp.get("next")! : "/dashboard";
  const [step, setStep] = useState<"start" | "code" | "name">("start");
  const [email, setEmail] = useState(false);
  const [contact, setContact] = useState("");
  const [code, setCode] = useState("");
  const [wrong, setWrong] = useState(false);
  const [name, setName] = useState("");
  const [fresh, setFresh] = useState(false);
  const signedIn = session?.status === "signed-in" && step !== "name";

  const send = () => {
    startSignIn(contact.trim());
    setCode("");
    setWrong(false);
    setStep("code");
  };
  const verify = () => {
    if (code === "000000") {
      setWrong(true);
      return;
    }
    const r = completeCode();
    if (r.returning) router.replace(next);
    else {
      setFresh(true);
      setStep("name");
    }
  };
  const masked = email ? contact : contact.replace(/^(\d{4})\s?\d{3}\s?(\d{4})$/, "$1 *** $2");

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F4F6F8] px-4 py-10">
      <div className="flex w-full max-w-[436px] flex-col gap-4 rounded-2xl bg-white p-8">
        <XiventaWordmark width={140} height={32} />
        {signedIn ? (
          <>
            <h1 className="text-[24px] font-bold leading-[30px] tracking-[-0.02em] text-[#172B3A]">You are signed in</h1>
            <Link href={next} className={`${btnPrimary} w-full`}>
              Open your dashboard
            </Link>
          </>
        ) : step === "start" ? (
          <>
            <h1 className="text-[24px] font-bold leading-[30px] tracking-[-0.02em] text-[#172B3A]">Sign in to your host dashboard</h1>
            <p className="text-[14px] text-[#4D5E70]">{email ? "Enter your email and we'll send you a code." : "Use the same Xiventa account you use on the app."}</p>
            <WField label={email ? "Email" : "Phone number"} value={contact} onChange={setContact} />
            <button type="button" disabled={email ? !/^\S+@\S+\.\S+$/.test(contact) : contact.replace(/\D/g, "").length < 10} onClick={send} className={`${btnPrimary} w-full`}>
              Send code
            </button>
            <div className="flex items-center gap-3 text-[12px] text-[#68788A]">
              <span className="h-px flex-1 bg-[#E9EDF1]" />
              or
              <span className="h-px flex-1 bg-[#E9EDF1]" />
            </div>
            <div className="flex gap-2">
              {(["Google", "Apple"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    signInWithProvider(p);
                    router.replace(next);
                  }}
                  className={`${btnSecondary} flex-1`}
                >
                  Continue with {p}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                setEmail(!email);
                setContact("");
              }}
              className={`${btnSecondary} w-full`}
            >
              {email ? "Use phone instead" : "Use email instead"}
            </button>
            <Notice title="New to hosting?" body="Sign in, then create your first event. Free events go live straight away." />
          </>
        ) : step === "code" ? (
          <>
            <h1 className="text-[24px] font-bold leading-[30px] tracking-[-0.02em] text-[#172B3A]">{wrong ? "That code didn't work" : email ? "Check your email" : "Enter the code"}</h1>
            <p className="text-[14px] text-[#4D5E70]">
              {wrong
                ? `Check the 6 digits we sent to ${masked} and try again. After 5 wrong codes, sign in pauses for 15 minutes.`
                : email
                  ? `We sent a 6 digit code to ${contact}. It can take a minute to arrive.`
                  : `We sent a 6 digit code to ${contact}. It fills in by itself if this is your phone.`}
            </p>
            <input
              autoFocus
              inputMode="numeric"
              aria-label="6 digit code"
              value={code}
              onChange={(e) => {
                setWrong(false);
                setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
              }}
              className={`h-14 rounded-[12px] border px-4 text-center text-[24px] tracking-[0.5em] text-[#172B3A] focus:outline-none ${wrong ? "border-[#FA443A]" : "border-[#D5DCE3] focus:border-[#E22765]"}`}
            />
            <button type="button" disabled={!wrong && code.length !== 6} onClick={wrong ? send : verify} className={`${btnPrimary} w-full`}>
              {wrong ? "Send a new code" : "Verify and continue"}
            </button>
            <button type="button" onClick={() => setStep("start")} className={`${btnSecondary} w-full`}>
              {email ? "Use a different email" : "Use a different number"}
            </button>
            <Notice title={fresh ? "New here?" : "New to hosting?"} body="Sign in, then create your first event. Free events go live straight away." />
          </>
        ) : (
          <>
            <h1 className="text-[24px] font-bold leading-[30px] tracking-[-0.02em] text-[#172B3A]">What should we call you?</h1>
            <p className="text-[14px] text-[#4D5E70]">Shows on your tickets, guest lists and host profile.</p>
            <WField label="Your name" value={name} onChange={setName} />
            <button
              type="button"
              disabled={name.trim().length < 2}
              onClick={() => {
                saveName(name.trim());
                router.replace("/dashboard?state=new");
              }}
              className={`${btnPrimary} w-full`}
            >
              Continue
            </button>
          </>
        )}
      </div>
    </div>
  );
}
