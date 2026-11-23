import Image from "next/image";
import Link from "next/link";
import { XiventaEvent } from "@/data";
import { BookmarkIcon } from "@/components/icons";
import { ticketPathV } from "@/components/shared/ticket";
import { AgeBadge, FormatTag, HostLine, RepeatTag, StatusBadge } from "@/components/shared/Tags";

type TagKind = "status" | "format" | "repeat" | "age";

interface EventCardProps {
  event: XiventaEvent;
  /**
   * `web`: Figma `Event Card` (282 x 265, host line, no "From" label) used on PW01, PW02 and PW06.
   * `compact`: Figma `Event Card / Compact` (180 x 245, no host line, price label shown) used on AM11.
   */
  variant?: "web" | "compact";
  /** Card width. Web defaults to 282 (PW06 "More from" uses 240). */
  width?: number;
  /** Tags shown over the image. Defaults follow the Figma frames: none on web, format on compact. */
  tags?: TagKind[];
  className?: string;
  /** Replaces the price with a status line (PW16: "2 tickets", "1 going", "Request sent"). */
  footer?: string;
  href?: string;
}

const IMAGE_H = 124;
const NOTCH_Y = 125;

/**
 * Event Card, 1:1 with the Figma `Event Card` component set (Layout=Compact, node 37:71).
 * Ticket outline with notches at y 125, dashed perforation under the image, body padding 12 / gap 4.
 */
export function EventCard({ event, variant = "web", width, tags, className = "", footer, href }: EventCardProps) {
  const link = href ?? `/events/${event.slug}`;
  const w = width ?? (variant === "compact" ? 180 : 282);
  const h = variant === "compact" ? 245 : 265;
  const showTags = tags ?? (variant === "compact" ? ["format"] : []);
  // Web cards never show "From" (rule 6: "From" only with several prices, and PW frames hide it).
  const priceLabel = variant === "web" && event.priceLabel === "From" ? null : event.priceLabel;

  const tagNodes = showTags.flatMap((t) => {
    if (t === "status" && event.status) return [<StatusBadge key="s" status={event.status} />];
    if (t === "format" && event.format) return [<FormatTag key="f" format={event.format} />];
    if (t === "repeat" && event.recurrence) return [<RepeatTag key="r" label={event.recurrence} />];
    if (t === "age" && event.ageRestriction) return [<AgeBadge key="a" label={event.ageRestriction} />];
    return [];
  });

  return (
    <div className={`group relative shrink-0 select-none ${className}`} style={{ width: w, height: h }}>
      <article
        className="flex h-full w-full flex-col bg-[#FDFFF0]"
        style={{ clipPath: `path('${ticketPathV(w, h, NOTCH_Y)}')` }}
      >
        <Link href={link} className="relative block shrink-0 overflow-hidden bg-[#E9EDF1]" style={{ height: IMAGE_H }} aria-label={event.title}>
          <Image src={event.imageUrl} alt="" fill sizes={`${w}px`} className="object-cover" />
        </Link>

        <div className="flex flex-1 flex-col gap-1 p-3 pt-[13px]">
          <p className="truncate text-[12px] leading-4 text-[#C81E57]">{event.dateLabel}</p>
          <h3 className="line-clamp-2 h-10 text-[14px] font-bold leading-5 text-[#172B3A]">
            <Link href={link}>{event.title}</Link>
          </h3>
          {variant === "web" && <HostLine name={event.hostName} verified={!event.isListing} />}
          <div className="flex h-8 flex-col justify-end">
            {!footer && priceLabel && <span className="text-[12px] leading-4 text-[#4D5E70]">{priceLabel}</span>}
            <span className="text-[14px] font-bold leading-5 text-[#172B3A]">{footer ?? event.displayPrice}</span>
          </div>
        </div>
      </article>

      {/* Border, notch strokes and perforation (Figma: Border 1 px #B4BFCA inside, Perforation dashed 4/4) */}
      <svg className="pointer-events-none absolute inset-0" width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" aria-hidden="true">
        <path d={ticketPathV(w, h, NOTCH_Y, 0.5)} stroke="#B4BFCA" strokeWidth="1" />
        <line x1="8" y1={IMAGE_H + 0.5} x2={w - 8} y2={IMAGE_H + 0.5} stroke="#B4BFCA" strokeWidth="1" strokeDasharray="4 4" />
      </svg>

      {tagNodes.length > 0 && <div className="absolute left-3 top-3 flex items-center gap-1">{tagNodes}</div>}

      <button
        type="button"
        aria-label={`Save ${event.title}`}
        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.72] text-[#172B3A] transition hover:bg-white"
      >
        <BookmarkIcon size={20} />
      </button>
    </div>
  );
}
