"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Place } from "@/data";
import type { PlaceDetails } from "@/data/placeDetails";
import { DAY_NAMES, isoDate, openAt, saveReview, savePlan, saveSuggestion, shortDay, useVisits } from "@/lib/visits";
import { AlertIcon, ArrowLeftIcon, ArrowRightIcon, ChevronRightIcon, InfoIcon, NavigationIcon, PlusIcon } from "@/components/icons";
import { Sheet, sheetPrimary, sheetSecondary } from "@/components/shared/Sheet";
import { Field } from "@/components/checkout/CheckoutParts";
import { AppBottomBar, AppTop, WebShell } from "@/components/checkout/CheckoutShell";
import { KeyRows, Stars } from "@/components/tickets/TicketParts";
import { isDesktop } from "@/components/auth/WebAuth";
import { Segmented } from "@/components/mobile/AppParts";

type Toast = (message: string, action?: string, onAction?: () => void) => void;

export const chipCls = (on: boolean) =>
  `flex h-8 items-center whitespace-nowrap rounded-full px-4 text-[13px] leading-4 transition ${on ? "bg-[#E22765] text-white" : "border border-[#B4BFCA] bg-white text-[#4D5E70] hover:border-[#68788A]"}`;

/** Today's date as YYYY-MM-DD on the client, null while prerendering (no clock on the server). */
function useTodayIso() {
  return useSyncExternalStore(
    () => () => {},
    () => isoDate(new Date()),
    () => null
  );
}
const fromIso = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

/* ------------------------------------------------------------------ calendar */

/**
 * Month calendar from AM65 / PW47: 40 px days, today in pink text, past days grey, the picked day
 * a pink circle. `range` paints a pale pink band from the picked day to `rangeEnd` (This weekend).
 */
function MonthCalendar({ today, value, onChange, rangeEnd }: { today: Date; value: Date; onChange: (d: Date) => void; rangeEnd?: Date }) {
  const [month, setMonth] = useState(() => new Date(value.getFullYear(), value.getMonth(), 1));
  const lead = (month.getDay() + 6) % 7;
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1))];
  const same = (a?: Date, b?: Date) => !!a && !!b && isoDate(a) === isoDate(b);
  const canBack = month > new Date(today.getFullYear(), today.getMonth(), 1);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <button
          type="button"
          aria-label="Previous month"
          disabled={!canBack}
          onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
          className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#F4F6F8] text-[#172B3A] disabled:opacity-40"
        >
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
          const picked = same(d, value);
          const band = rangeEnd && d > value && d <= rangeEnd;
          return (
            <span key={i} className={`flex h-10 items-center justify-center ${band ? "rounded-r-full bg-[#FDEEF3]" : ""}`}>
              <button
                type="button"
                disabled={past}
                aria-pressed={picked}
                onClick={() => onChange(d)}
                className={`flex h-10 w-10 items-center justify-center rounded-full text-[14px] ${
                  picked ? "bg-[#E22765] text-white" : past ? "text-[#8C99A7]" : same(d, today) ? "text-[#C81E57]" : "text-[#172B3A] hover:bg-[#F4F6F8]"
                }`}
              >
                {d.getDate()}
              </button>
            </span>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ plan a visit */

const APP_TIMES = ["2 PM", "4 PM", "6 PM", "7 PM", "8 PM", "9 PM", "10 PM"];
const WEB_TIMES = ["6 PM", "7 PM", "8 PM", "9 PM", "10 PM"];

/** Shared state for AM65 and PW47: the day, the time and whether the place is open then. */
function usePlan(place: Place, d: PlaceDetails, today: Date, special: boolean, defaultTime: string) {
  const nextSat = new Date(today.getFullYear(), today.getMonth(), today.getDate() + ((6 - today.getDay() + 7) % 7 || 7));
  const [date, setDate] = useState(nextSat);
  const [time, setTime] = useState(defaultTime);
  const dayName = DAY_NAMES[date.getDay()];
  const specialToday = special && d.specialHours?.day === dayName && date <= new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
  const hours = specialToday ? d.specialHours!.hours : (d.hours.find(([n]) => n === dayName)?.[1] ?? "Closed");
  const open = openAt(hours, time);
  const line = specialToday
    ? `Special hours this ${dayName}: open ${hours}`
    : /closed/i.test(hours)
      ? `Closed on ${dayName}s`
      : `Open ${dayName} ${hours}`;
  const opensAt = hours.split(" to ")[0];
  const warning = open
    ? null
    : /closed/i.test(hours)
      ? { title: `${place.name} is closed on ${dayName}s`, body: "Pick another day." }
      : { title: `${place.name} is closed at ${time}`, body: `It opens at ${opensAt} on ${dayName}s. Pick a later time or another day.` };
  const save = () => {
    const label = `${shortDay(date)}, ${time}`;
    savePlan({ slug: place.slug, date: isoDate(date), time, label });
    return label;
  };
  return { date, setDate, time, setTime, hours, open, line, warning, save };
}

/** AM65 Plan a visit (app page). Desktop visitors get the PW47 dialog on the place page. */
export function PlanVisitPage({ place, details }: { place: Place; details: PlaceDetails }) {
  const router = useRouter();
  const params = useSearchParams();
  const todayIso = useTodayIso();
  const special = params.get("state") === "special-day";
  useEffect(() => {
    if (isDesktop()) router.replace(`/places/${place.slug}?plan${special ? "&state=special-day" : ""}`);
  }, [place.slug, router, special]);
  return (
    <div className="min-h-screen bg-white pb-[120px] pt-[env(safe-area-inset-top)]">
      <AppTop title="Plan a visit" subtitle={place.name} onBack={() => router.push(`/places/${place.slug}`)} />
      {todayIso && <PlanVisitBody place={place} details={details} today={fromIso(todayIso)} special={special} />}
    </div>
  );
}

function PlanVisitBody({ place, details, today, special }: { place: Place; details: PlaceDetails; today: Date; special: boolean }) {
  const router = useRouter();
  const p = usePlan(place, details, today, special, "8 PM");
  return (
    <>
      <div className="flex flex-col px-4 pt-3">
        <span className="pb-3 text-[10px] uppercase leading-3 tracking-[0.04em] text-[#4D5E70]">Pick a day</span>
        <div className="rounded-[24px] bg-white p-4 shadow-[0_12px_32px_rgba(23,43,58,0.16)]">
          <MonthCalendar today={today} value={p.date} onChange={p.setDate} />
        </div>
        <span className="pb-3 pt-6 text-[10px] uppercase leading-3 tracking-[0.04em] text-[#4D5E70]">Pick a time</span>
        <div className="flex flex-wrap gap-2">
          {APP_TIMES.map((t) => (
            <button key={t} type="button" onClick={() => p.setTime(t)} className={`${chipCls(p.time === t)} w-[64px] justify-center px-0`}>
              {t}
            </button>
          ))}
        </div>
        <p className="pt-4 text-[12px] leading-4 text-[#4D5E70]">{p.line}</p>
        {p.warning && (
          <div className="mt-4 flex items-center gap-3 rounded-2xl bg-[#FDECEB] px-4 py-3">
            <AlertIcon size={20} className="shrink-0 text-[#C0231A]" />
            <div className="flex flex-col gap-0.5">
              <p className="text-[13px] leading-4 text-[#172B3A]">{p.warning.title}</p>
              <p className="text-[12px] leading-4 text-[#4D5E70]">{p.warning.body}</p>
            </div>
          </div>
        )}
      </div>
      <AppBottomBar
        action="Save plan"
        disabled={!p.open}
        onAction={() => {
          p.save();
          router.push("/my-places?tab=planned");
        }}
      />
    </>
  );
}

/** PW47 Plan a visit (web dialog). */
export function PlanVisitSheet({ open, onClose, place, details, special, toast }: { open: boolean; onClose: () => void; place: Place; details: PlaceDetails; special: boolean; toast: Toast }) {
  return (
    <Sheet open={open} onClose={onClose} title={`Plan a visit to ${place.name}`}>
      {open && <PlanVisitDialogBody place={place} details={details} special={special} onClose={onClose} toast={toast} />}
    </Sheet>
  );
}

function PlanVisitDialogBody({ place, details, special, onClose, toast }: { place: Place; details: PlaceDetails; special: boolean; onClose: () => void; toast: Toast }) {
  const router = useRouter();
  const todayIso = useTodayIso();
  const today = fromIso(todayIso ?? isoDate(new Date(2026, 10, 5)));
  const p = usePlan(place, details, today, special, "9 PM");
  const [preset, setPreset] = useState<string | null>("This weekend");
  const add = (n: number) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + n);
  const sat = (today.getDay() === 6 ? 0 : (6 - today.getDay() + 7) % 7) || 0;
  const presets: Record<string, Date> = { Today: today, Tomorrow: add(1), "This weekend": add(sat), "Next week": add(((8 - today.getDay()) % 7) || 7) };
  const weekendEnd = preset === "This weekend" ? add(sat + 1) : undefined;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {WEB_TIMES.map((t) => (
          <button key={t} type="button" onClick={() => p.setTime(t)} className={`${chipCls(p.time === t)} w-[64px] justify-center px-0`}>
            {t}
          </button>
        ))}
      </div>
      <p className={`text-[13px] leading-5 ${p.warning ? "text-[#C0231A]" : "text-[#172B3A]"}`}>
        {p.warning ? `${p.warning.title}. ${p.warning.body}` : `${p.line.replace(/^Open \w+ /, "Open ").replace(/$/, " that day")}. We add it to your calendar and ask the day after if you went.`}
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {Object.keys(presets).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => {
              setPreset(k);
              p.setDate(presets[k]);
            }}
            className={chipCls(preset === k)}
          >
            {k}
          </button>
        ))}
      </div>
      <MonthCalendar
        key={isoDate(p.date).slice(0, 7)}
        today={today}
        value={p.date}
        rangeEnd={weekendEnd}
        onChange={(d) => {
          setPreset(null);
          p.setDate(d);
        }}
      />
      <div className="flex items-center gap-3 pb-2 pt-2">
        <button type="button" onClick={onClose} className="flex h-11 items-center px-6 text-[14px] text-[#C81E57]">
          Cancel
        </button>
        <button
          type="button"
          disabled={!p.open}
          onClick={() => {
            const label = p.save();
            onClose();
            toast(`Planned for ${label}`, "View", () => router.push("/my-places?tab=planned"));
          }}
          className="flex h-11 flex-1 items-center justify-center rounded-[12px] bg-[#E22765] text-[14px] text-white hover:bg-[#C81E57] disabled:bg-[#F5A3BF]"
        >
          Save to My places
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ hours, did you go */

/** AM67 Opening hours. Today's row says ", today". */
export function HoursSheet({ open, onClose, details }: { open: boolean; onClose: () => void; details: PlaceDetails }) {
  const todayIso = useTodayIso();
  const todayName = todayIso ? DAY_NAMES[fromIso(todayIso).getDay()] : "";
  return (
    <Sheet open={open} onClose={onClose} title="Opening hours">
      <KeyRows rows={details.hours.map(([d, h]) => [d === todayName ? `${d}, today` : d, h])} />
      <p className="pt-3 text-[12px] leading-4 text-[#4D5E70]">Holiday hours can differ. The venue keeps these up to date.</p>
    </Sheet>
  );
}

/** "Did you go?" (AM77 Day after on phones; PW22 shows the same question as a banner). */
export function DidYouGoSheet({ open, onClose, name, when, onAnswer }: { open: boolean; onClose: () => void; name: string; when: string; onAnswer: (went: boolean) => void }) {
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Did you go?"
      footer={
        <>
          <button type="button" onClick={() => onAnswer(false)} className={`${sheetSecondary} flex-1`}>
            Not yet
          </button>
          <button type="button" onClick={() => onAnswer(true)} className={sheetPrimary}>
            Yes, I went
          </button>
        </>
      }
    >
      <p className="text-[14px] leading-5 text-[#172B3A]">
        Did you go to {name} on {when}?
      </p>
      <p className="pt-1 text-[12px] leading-4 text-[#4D5E70]">Tell us and we move it to Been here. Only you see this.</p>
    </Sheet>
  );
}

/* ------------------------------------------------------------------ reviews */

const SORTS = ["Most recent", "Highest", "Lowest", "With photos"] as const;

/** PW45 Place reviews (also the phone's "See all" sheet). */
export function PlaceReviewsSheet({ open, onClose, place, details, toast, onWrite }: { open: boolean; onClose: () => void; place: Place; details: PlaceDetails; toast: Toast; onWrite: () => void }) {
  const [sort, setSort] = useState<(typeof SORTS)[number]>("Most recent");
  const visits = useVisits();
  const mine = visits.reviews[place.slug];
  let list = [...details.reviews];
  if (sort === "Highest") list.sort((a, b) => b.stars - a.stars);
  if (sort === "Lowest") list.sort((a, b) => a.stars - b.stars);
  if (sort === "With photos") list = list.slice(0, 1);
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Reviews"
      footer={
        <>
          <button type="button" onClick={onWrite} className={`${sheetSecondary} flex-1 md:flex-none`}>
            Write a review
          </button>
          <button type="button" onClick={onClose} className={`${sheetPrimary} hidden md:ml-auto md:flex md:h-10 md:flex-none md:px-4 md:text-[14px]`}>
            Close
          </button>
        </>
      }
    >
      <p className="text-[14px] leading-5 text-[#4D5E70]">{place.name} · anyone signed in can review</p>
      <div className="flex items-center gap-3 pt-4">
        <span className="text-[24px] font-bold leading-[30px] text-[#172B3A]">{details.rating}</span>
        <span className="flex flex-col gap-0.5">
          <Stars value={Math.round(details.rating)} size={14} />
          <span className="text-[12px] leading-4 text-[#4D5E70]">{details.reviewCount + (mine ? 1 : 0)} reviews</span>
        </span>
      </div>
      <div className="flex flex-wrap gap-2 pt-4">
        {SORTS.map((s) => (
          <button key={s} type="button" onClick={() => setSort(s)} className={chipCls(sort === s)}>
            {s}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-3 pt-4">
        {mine && sort === "Most recent" && <ReviewItem name="You" initials="YO" when="Just now" stars={mine.stars} text={mine.text || "No words, just stars."} toast={toast} />}
        {list.map((r) => (
          <ReviewItem key={r.name} {...r} host={place.name} toast={toast} />
        ))}
      </div>
    </Sheet>
  );
}

function ReviewItem({ name, initials, when, stars, text, reply, host, toast }: { name: string; initials: string; when: string; stars: number; text: string; reply?: string; host?: string; toast: Toast }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#E9EDF1] p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F0ECFF] text-[10px] font-bold text-[#5B3FD6]">{initials}</span>
        <span className="flex flex-1 flex-col gap-0.5">
          <span className="text-[13px] font-bold leading-4 text-[#172B3A]">{name}</span>
          <span className="text-[12px] leading-4 text-[#4D5E70]">{when}</span>
        </span>
        <Stars value={stars} size={12} />
      </div>
      <p className="text-[14px] leading-5 text-[#172B3A]">{text}</p>
      {reply && (
        <div className="flex flex-col gap-1 rounded-[12px] bg-[#F4F6F8] px-3 py-2.5">
          <span className="text-[12px] font-bold leading-4 text-[#172B3A]">Reply from {host}</span>
          <span className="text-[12px] leading-4 text-[#4D5E70]">{reply}</span>
        </div>
      )}
      {name !== "You" && (
        <button type="button" onClick={() => toast("Review reported. Thanks for telling us")} className="w-fit text-[12px] leading-4 text-[#68788A]">
          Report
        </button>
      )}
    </div>
  );
}

/** Picked photos shown as 96 px tiles with an add tile (AM80, PW46). Files stay on this device. */
function PhotoPicker({ photos, setPhotos, max = 5, compact = false }: { photos: string[]; setPhotos: (p: string[]) => void; max?: number; compact?: boolean }) {
  const input = useRef<HTMLInputElement>(null);
  const pick = (files: FileList | null) => {
    if (!files) return;
    setPhotos([...photos, ...[...files].map((f) => URL.createObjectURL(f))].slice(0, max));
  };
  const field = (
    <input ref={input} type="file" accept="image/*" multiple hidden onChange={(e) => pick(e.target.files)} />
  );
  if (compact)
    return (
      <>
        {field}
        <button type="button" onClick={() => input.current?.click()} className="flex h-12 w-full items-center rounded-[12px] border border-[#D5DCE3] bg-white px-4 text-left text-[14px] text-[#172B3A] hover:border-[#B4BFCA]">
          {photos.length ? `${photos.length} photo${photos.length > 1 ? "s" : ""} added · add more` : "Add photos"}
        </button>
      </>
    );
  return (
    <div className="flex flex-wrap gap-3">
      {field}
      {photos.map((src) => (
        <span key={src} className="relative h-24 w-24 overflow-hidden rounded-[12px] bg-[#E9EDF1]">
          <Image src={src} alt="" fill unoptimized sizes="96px" className="object-cover" />
        </span>
      ))}
      {photos.length < max && (
        <button type="button" aria-label="Add photos" onClick={() => input.current?.click()} className="flex h-24 w-24 items-center justify-center rounded-[12px] border border-dashed border-[#B4BFCA] bg-[#F4F6F8] text-[#68788A]">
          <PlusIcon size={24} />
        </button>
      )}
    </div>
  );
}

/** PW46 Write a review / Your review is up. */
export function WriteReviewSheet({ open, onClose, place }: { open: boolean; onClose: () => void; place: Place }) {
  const [stars, setStars] = useState(4);
  const [text, setText] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [posted, setPosted] = useState(false);
  const close = () => {
    onClose();
    setTimeout(() => setPosted(false), 300);
  };
  return (
    <Sheet
      open={open}
      onClose={close}
      title={posted ? "Your review is up" : "Write a review"}
      footer={
        posted ? (
          <button type="button" onClick={close} className={`${sheetPrimary} md:ml-auto md:flex-none md:px-8`}>
            Done
          </button>
        ) : (
          <>
            <button type="button" onClick={close} className={`${sheetSecondary} w-[104px]`}>
              Cancel
            </button>
            <button
              type="button"
              disabled={!stars}
              onClick={() => {
                saveReview(place.slug, { stars, text });
                setPosted(true);
              }}
              className={sheetPrimary}
            >
              Post review
            </button>
          </>
        )
      }
    >
      {posted ? (
        <p className="text-[14px] leading-5 text-[#4D5E70]">It shows on {place.name} now and the team can reply. {photos.length ? "Photos show once checked." : ""}</p>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-[14px] leading-5 text-[#4D5E70]">
            {place.name} · {place.neighborhood}
          </p>
          <Stars value={stars} onChange={setStars} size={36} />
          <Field label="Your review" value={text} onChange={setText} placeholder="Lovely view at sunset. Book a table on Fridays." />
          <div className="flex flex-col gap-2">
            <span className="text-[13px] leading-4 text-[#172B3A]">Photos (optional)</span>
            <PhotoPicker photos={photos} setPhotos={setPhotos} max={5} compact />
          </div>
          <p className="text-[14px] leading-5 text-[#4D5E70]">Your first name shows with your review. Photos show once our team checks them.</p>
        </div>
      )}
    </Sheet>
  );
}

/* ------------------------------------------------------------------ menu */

/** AM66 Place menu (Drinks / Food / Specials tabs). Desktop gets the same content in the web shell. */
export function MenuPage({ place, details }: { place: Place; details: PlaceDetails }) {
  const router = useRouter();
  const tabs = Object.keys(details.menu);
  const [tab, setTab] = useState(tabs[0]);
  const body = (
    <>
      <Segmented items={tabs.map((t) => ({ value: t, label: t }))} value={tab} onChange={setTab} />
      <div className="mt-4 flex items-center gap-3 rounded-2xl bg-[#E6F1FF] px-4 py-3">
        <InfoIcon size={20} className="shrink-0 text-[#0059BE]" />
        <div className="flex flex-col gap-0.5">
          <p className="text-[13px] leading-4 text-[#172B3A]">Prices are set by the venue</p>
          <p className="text-[12px] leading-4 text-[#4D5E70]">They can change without notice. Check with staff before you order.</p>
        </div>
      </div>
      {details.menu[tab].map(([section, items]) => (
        <div key={section} className="flex flex-col pt-6">
          <span className="text-[10px] uppercase leading-3 tracking-[0.04em] text-[#4D5E70]">{section}</span>
          <div className="flex flex-col divide-y divide-[#E9EDF1]">
            {items.map(([name, price]) => (
              <div key={name} className="flex min-h-[60px] items-center justify-between">
                <span className="text-[16px] leading-6 tracking-[-0.01em] text-[#172B3A]">{name}</span>
                <span className="text-[14px] text-[#4D5E70]">{price}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
      <p className="pt-4 text-[12px] leading-4 text-[#4D5E70]">{details.menuUpdated}</p>
    </>
  );
  return (
    <>
      <div className="min-h-screen bg-white pb-10 pt-[env(safe-area-inset-top)] md:hidden">
        <AppTop title="Menu" subtitle={place.name} onBack={() => router.push(`/places/${place.slug}`)} />
        <div className="px-4 pt-2">{body}</div>
      </div>
      <WebShell>
        <div className="mx-auto flex w-full max-w-[640px] flex-col">
          <button type="button" onClick={() => router.push(`/places/${place.slug}`)} className="w-fit pb-4 text-[14px] text-[#C81E57]">
            Back to {place.name}
          </button>
          <h1 className="pb-4 text-[28px] font-bold leading-[34px] tracking-[-0.02em] text-[#172B3A]">Menu</h1>
          {body}
        </div>
      </WebShell>
    </>
  );
}

/* ------------------------------------------------------------------ suggest a place */

const KINDS = ["Restaurants", "Bars & Lounges", "Cafés & Bakeries", "Beaches", "Parks & Nature", "Fun & Games", "More"];

/** AM80 / PW48 Suggest a place, and the Sent state (?step=sent). */
export function SuggestPlace() {
  const router = useRouter();
  const params = useSearchParams();
  const visits = useVisits();
  const [name, setName] = useState("");
  const [kind, setKind] = useState<string | null>(null);
  const [where, setWhere] = useState("");
  const [here, setHere] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const sent = params.get("step") === "sent";
  const sentName = visits.suggestions[0]?.name ?? "the place";
  const ok = name.trim().length > 1 && !!kind && (here || where.trim().length > 2);
  const send = () => {
    saveSuggestion(name.trim());
    router.push("/suggest-place?step=sent");
  };
  const back = () => (window.history.length > 1 ? router.back() : router.push("/m"));

  if (sent)
    return (
      <>
        <div className="flex min-h-screen flex-col bg-white pb-[120px] pt-[env(safe-area-inset-top)] md:hidden">
          <AppTop title="Suggest a place" onBack={() => router.push("/m")} />
          <div className="flex flex-1 flex-col justify-center gap-2 px-4 pb-24">
            <h2 className="text-[20px] font-bold leading-[26px] tracking-[-0.02em] text-[#172B3A]">Thanks, we&apos;re on it</h2>
            <p className="text-[14px] leading-5 text-[#4D5E70]">We&apos;ll check {sentName} and tell you when it&apos;s live on Xiventa.</p>
          </div>
          <AppBottomBar action="Back to Home" onAction={() => router.push("/m")} />
        </div>
        <WebShell>
          <div className="mx-auto flex w-full max-w-[440px] flex-col gap-3 rounded-2xl border border-[#E9EDF1] p-8">
            <h1 className="text-[24px] font-bold leading-[30px] tracking-[-0.02em] text-[#172B3A]">Thanks, we&apos;re on it</h1>
            <p className="text-[14px] leading-5 text-[#4D5E70]">Our team checks {sentName} and adds it. We tell you when it&apos;s live.</p>
            <button type="button" onClick={() => router.push("/places")} className="mt-3 flex h-[52px] w-full flex-none items-center justify-center rounded-[12px] bg-[#E22765] text-[16px] tracking-[-0.01em] text-white hover:bg-[#C81E57]">
              Back to places
            </button>
          </div>
        </WebShell>
      </>
    );

  const kinds = (
    <div className="flex flex-wrap gap-2">
      {KINDS.map((k) => (
        <button key={k} type="button" onClick={() => setKind(k)} className={chipCls(kind === k)}>
          {k}
        </button>
      ))}
    </div>
  );
  return (
    <>
      {/* ---------- App (AM80) ---------- */}
      <div className="min-h-screen bg-white pb-[120px] pt-[env(safe-area-inset-top)] md:hidden">
        <AppTop title="Suggest a place" onBack={back} />
        <div className="flex flex-col px-4 pt-4">
          <p className="text-[14px] leading-5 text-[#4D5E70]">Found somewhere good that isn&apos;t on Xiventa yet? Tell us and we&apos;ll take a look.</p>
          <div className="pt-5">
            <Field label="Name" value={name} onChange={setName} placeholder="Ewa Garden Bar" />
          </div>
          <span className="pb-3 pt-6 text-[13px] font-bold leading-4 text-[#172B3A]">What kind of place is it?</span>
          {kinds}
          <span className="pt-6 text-[13px] font-bold leading-4 text-[#172B3A]">Where is it?</span>
          <button type="button" onClick={() => setHere(true)} className="flex min-h-[66px] items-center gap-3 py-3 text-left">
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${here ? "bg-[#FDEEF3] text-[#E22765]" : "bg-[#F4F6F8] text-[#172B3A]"}`}>
              <NavigationIcon size={20} />
            </span>
            <span className="flex flex-1 flex-col gap-0.5">
              <span className="text-[16px] leading-6 tracking-[-0.01em] text-[#172B3A]">Use where I am now</span>
              <span className="text-[12px] leading-4 text-[#68788A]">{here ? "Admiralty Way, Lekki Phase 1" : "Or type the address below"}</span>
            </span>
            <ChevronRightIcon size={20} className="text-[#4D5E70]" />
          </button>
          {!here && <Field label="Address or area" value={where} onChange={setWhere} placeholder="Admiralty Way, Lekki Phase 1" />}
          <span className="pt-6 text-[13px] font-bold leading-4 text-[#172B3A]">Photos (optional)</span>
          <p className="pb-3 pt-2 text-[12px] leading-4 text-[#4D5E70]">Up to 5. The place itself works best: the space, the food, the sign.</p>
          <PhotoPicker photos={photos} setPhotos={setPhotos} />
          <div className="pt-6">
            <Field label="Anything we should know? (optional)" value={note} onChange={setNote} placeholder="Garden seating, suya on Friday nights" />
          </div>
          <p className="pt-5 text-[12px] leading-4 text-[#4D5E70]">We check every suggestion before it goes live. Your name is never shown on the place.</p>
        </div>
        <AppBottomBar action="Send suggestion" disabled={!ok} onAction={send} />
      </div>

      {/* ---------- Web (PW48) ---------- */}
      <WebShell>
        <div className="mx-auto flex w-full max-w-[440px] flex-col rounded-2xl border border-[#E9EDF1] p-8">
          <h1 className="text-[24px] font-bold leading-[30px] tracking-[-0.02em] text-[#172B3A]">Suggest a place</h1>
          <p className="pt-4 text-[14px] leading-5 text-[#4D5E70]">Found a great spot that isn&apos;t on Xiventa? Tell us and our team adds it.</p>
          <div className="flex flex-col gap-4 pt-5">
            <Field label="Name of the place" value={name} onChange={setName} placeholder="Ewa Garden Bar" />
            <Field label="Where is it?" value={where} onChange={setWhere} placeholder="Admiralty Way, Lekki Phase 1 · Use where I am now" />
            {kinds}
            <div className="flex flex-col gap-2">
              <span className="text-[13px] leading-4 text-[#172B3A]">Photos (optional, up to 5)</span>
              <PhotoPicker photos={photos} setPhotos={setPhotos} compact />
            </div>
            <Field label="Anything we should know? (optional)" value={note} onChange={setNote} placeholder="Lovely garden, live band on Fridays." />
          </div>
          <button
            type="button"
            disabled={!ok}
            onClick={send}
            className="mt-5 flex h-[52px] w-full flex-none items-center justify-center rounded-[12px] bg-[#E22765] text-[16px] tracking-[-0.01em] text-white hover:bg-[#C81E57] disabled:bg-[#F5A3BF]"
          >
            Send suggestion
          </button>
          <p className="pt-4 text-[12px] leading-4 text-[#4D5E70]">We check every suggestion before it goes live. Nobody sees who suggested it.</p>
        </div>
      </WebShell>
    </>
  );
}
