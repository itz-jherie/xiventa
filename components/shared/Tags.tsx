import { EventStatus, FormatTag as FormatTagData } from "@/data";
import { RepeatIcon, VerifiedBadgeIcon } from "@/components/icons";

/** Status badge (Figma `Status Badge` / `Status`): pill 24 high, 6 px dot, 12 px label. */
export function StatusBadge({ status }: { status: Exclude<EventStatus, null> }) {
  const tone =
    status === "selling-fast"
      ? { bg: "#FDEEF3", dot: "#E22765", fg: "#C81E57", label: "Selling fast" }
      : { bg: "#E9EDF1", dot: "#68788A", fg: "#33465A", label: "Sold out" };
  return (
    <span
      className="inline-flex h-6 items-center gap-1.5 rounded-full px-2 text-[12px] leading-4 whitespace-nowrap"
      style={{ backgroundColor: tone.bg, color: tone.fg }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: tone.dot }} />
      {tone.label}
    </span>
  );
}

/** Open now pill on Place cards. */
export function OpenNowBadge() {
  return (
    <span className="inline-flex h-6 items-center gap-1.5 rounded-full bg-[#E3F8EF] px-2 text-[12px] leading-4 text-[#067647] whitespace-nowrap">
      <span className="h-1.5 w-1.5 rounded-full bg-[#067647]" />
      Open now
    </span>
  );
}

const FORMAT_TONE: Record<FormatTagData["kind"], { bg: string; dot: string; fg: string }> = {
  online: { bg: "#E6F1FF", dot: "#0278FB", fg: "#0059BE" },
  hybrid: { bg: "#FDEEF3", dot: "#E22765", fg: "#C81E57" },
  live: { bg: "#FFECEB", dot: "#FA443A", fg: "#C0231A" },
};

/** Format tag (Figma `Format Tag`): Online / Hybrid / Live. */
export function FormatTag({ format }: { format: FormatTagData }) {
  const t = FORMAT_TONE[format.kind];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[12px] leading-[15px] whitespace-nowrap"
      style={{ backgroundColor: t.bg, color: t.fg }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: t.dot }} />
      {format.label}
    </span>
  );
}

/** Repeat tag (Figma `Repeat Tag`). */
export function RepeatTag({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#E9EDF1] py-[3px] pl-1.5 pr-2 text-[12px] leading-[15px] text-[#4D5E70] whitespace-nowrap">
      <RepeatIcon size={14} className="text-[#4D5E70]" />
      {label}
    </span>
  );
}

/** Age badge (Figma `Age Badge`): white, 1 px #B4BFCA border, radius 6. */
export function AgeBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-[6px] border border-[#B4BFCA] bg-white px-2 py-[3px] text-[12px] leading-[15px] text-[#172B3A] whitespace-nowrap">
      {label}
    </span>
  );
}

/** Category tag (Figma `Category Tag` / `Tag`): 20 high, 10 px upper case, +4% tracking. */
export function CategoryTag({ label, bg = "#FFEDFD", fg = "#A8189E" }: { label: string; bg?: string; fg?: string }) {
  return (
    <span
      className="inline-flex h-5 shrink-0 items-center justify-center rounded-full px-2 text-[10px] uppercase leading-3 tracking-[0.04em] whitespace-nowrap"
      style={{ backgroundColor: bg, color: fg }}
    >
      {label}
    </span>
  );
}

/** Host line used on cards: name + 14 px pink verified badge, 3 px apart. */
export function HostLine({ name, verified = true, className = "" }: { name: string; verified?: boolean; className?: string }) {
  return (
    <span className={`flex min-w-0 items-center gap-[3px] ${className}`}>
      <span className="truncate text-[12px] leading-4 text-[#4D5E70]">{name}</span>
      {verified && <VerifiedBadgeIcon size={14} className="shrink-0 text-[#E22765]" />}
    </span>
  );
}
