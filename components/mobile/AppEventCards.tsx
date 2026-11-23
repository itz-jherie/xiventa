import Image from "next/image";
import Link from "next/link";
import { XiventaEvent } from "@/data";
import { BookmarkIcon, MapPinIcon } from "@/components/icons";
import { ticketPathH } from "@/components/shared/ticket";
import { AgeBadge, CategoryTag, HostLine, RepeatTag, StatusBadge } from "@/components/shared/Tags";

/* Exact outlines from the Figma `Event Card / Featured` component (Layout=Featured). */
const FEATURED_IMAGE_MASK =
  "M 315.558 171.933 L 315.558 8.645 C 315.558 3.869 311.689 0 306.913 0 L 8.645 0 C 3.869 0 0 3.869 0 8.645 L 0 171.933 C 3.566 171.933 6.452 174.824 6.452 178.39 L 309.106 178.39 C 309.106 174.824 311.992 171.933 315.558 171.933 Z";
const FEATURED_BODY =
  "M 0 6.452 L 0 88.965 C 0 93.741 3.869 97.61 8.645 97.61 L 306.913 97.61 C 311.689 97.61 315.558 93.741 315.558 88.965 L 315.558 6.452 C 311.992 6.452 309.106 3.561 309.106 0 L 6.452 0 C 6.452 3.561 3.566 6.452 0 6.452 Z";

interface FeaturedProps {
  event: XiventaEvent;
  /** Figma shows the venue line on some featured cards only (Games Night). */
  showVenue?: boolean;
  categoryTag?: { bg: string; fg: string };
}

/**
 * Event Card / Featured (AM11 Home, 316 x 276). Image with concave lower corners, 2 px lemon
 * dashed tear line, cream body with a 0.5 px #97A3B1 outline.
 */
export function FeaturedEventCard({ event, showVenue = false, categoryTag }: FeaturedProps) {
  const tags = [
    event.status ? <StatusBadge key="s" status={event.status} /> : null,
    event.recurrence ? <RepeatTag key="r" label={event.recurrence} /> : null,
    event.ageRestriction ? <AgeBadge key="a" label={event.ageRestriction} /> : null,
  ].filter(Boolean);

  return (
    <div className="relative h-[276px] w-[316px] shrink-0 select-none">
      <Link
        href={`/events/${event.slug}`}
        className="absolute left-0 top-px block h-[179px] w-[316px] overflow-hidden"
        style={{ clipPath: `path('${FEATURED_IMAGE_MASK}')` }}
        aria-label={event.title}
      >
        <Image src={event.imageUrl} alt="" width={316} height={396} sizes="316px" className="absolute left-0 top-[-67.76px] h-[395.88px] w-[316px] max-w-none object-cover" />
      </Link>

      <svg className="absolute left-0 top-[178px]" width="316" height="98" viewBox="0 0 315.558 97.61" preserveAspectRatio="none" fill="none" aria-hidden="true">
        <path d={FEATURED_BODY} fill="#FDFFF0" stroke="#97A3B1" strokeWidth="0.5" />
      </svg>
      <svg className="absolute left-[7.66px] top-[178.13px]" width="301" height="2" viewBox="0 0 301 2" fill="none" aria-hidden="true">
        <line x1="0" y1="1" x2="300.5" y2="1" stroke="#F3FDB8" strokeWidth="2" strokeDasharray="3 3" />
      </svg>

      <div className="absolute left-4 top-[183px] flex h-[88px] w-[285px] flex-col justify-center gap-1.5">
        <div className="flex items-end gap-2">
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="truncate text-[12px] leading-4 text-[#C81E57]">{event.dateLabel}</span>
            <Link href={`/events/${event.slug}`} className="truncate text-[14px] font-bold leading-5 text-[#172B3A]">
              {event.title}
            </Link>
          </div>
          <div className="flex shrink-0 flex-col items-end">
            {event.priceLabel && <span className="text-right text-[12px] leading-4 text-[#4D5E70]">{event.priceLabel}</span>}
            <span className="text-right text-[14px] font-bold leading-5 text-[#172B3A]">{event.displayPrice}</span>
          </div>
        </div>
        {showVenue && (
          <div className="flex h-4 items-center">
            <MapPinIcon size={14} className="shrink-0 text-[#E22765]" />
            <span className="truncate text-[12px] leading-4 text-[#4D5E70]">{event.venueLabel}</span>
          </div>
        )}
        <div className="flex h-5 items-center justify-between gap-2">
          <HostLine name={event.hostName} verified={!event.isListing} />
          <CategoryTag label={event.categoryLabel} bg={categoryTag?.bg} fg={categoryTag?.fg} />
        </div>
      </div>

      {tags.length > 0 && <div className="absolute left-3 top-3 flex items-center gap-1">{tags}</div>}
      <button
        type="button"
        aria-label={`Save ${event.title}`}
        className="absolute left-[268px] top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.72] text-[#172B3A]"
      >
        <BookmarkIcon size={20} />
      </button>
    </div>
  );
}

interface ListProps {
  event: XiventaEvent;
  /** Tags in the footer. Figma: category always, repeat and age when the event has them. */
  showRepeatAndAge?: boolean;
  categoryTag?: { bg: string; fg: string };
  /** Status pill above the date (AM36 Saved: "Price goes up soon", "You're going"). */
  badge?: { label: string; bg: string; fg: string; dot: string };
  /** Replaces tags and price with one bold line on the right (AM36 tickets: "2 tickets", "Attended"). */
  footer?: string;
  href?: string;
  showSave?: boolean;
  /** AM15 Collection shows the host (with the verified tick) where other lists show the venue. */
  hostLine?: boolean;
}

/**
 * Event Card / List (AM11 "Tonight" and "This weekend"): 358 wide, 112 px image, notches top and
 * bottom on the perforation, 0.5 opacity border, 30 px grey save button.
 */
export function ListEventCard({ event, showRepeatAndAge = true, categoryTag, badge, footer, href, showSave = true, hostLine = false }: ListProps) {
  const w = 358;
  const hasExtraTags = !footer && showRepeatAndAge && (event.recurrence || event.ageRestriction);
  const h = (hasExtraTags ? 156 : 129) + (badge ? 29 : 0);
  const link = href ?? `/events/${event.slug}`;
  const nx = 112.5;

  return (
    <div className="relative shrink-0 select-none" style={{ width: w, height: h }}>
      <div className="flex h-full bg-[#FDFFF0]" style={{ clipPath: `path('${ticketPathH(w, h, nx)}')` }}>
        <Link href={link} className="relative block w-[112px] shrink-0 bg-[#E9EDF1]" aria-label={event.title}>
          <Image src={event.imageUrl} alt="" fill sizes="112px" className="object-cover" />
        </Link>
        <div className="flex min-w-0 flex-1 flex-col gap-[5px] pb-3 pl-[13px] pr-11 pt-5">
          {badge && (
            <span className="inline-flex h-6 w-fit items-center gap-1.5 whitespace-nowrap rounded-full px-2 text-[12px] leading-4" style={{ backgroundColor: badge.bg, color: badge.fg }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: badge.dot }} />
              {badge.label}
            </span>
          )}
          <span className="truncate text-[12px] leading-4 text-[#C81E57]">{event.dateLabel}</span>
          <Link href={link} className="whitespace-nowrap text-[14px] font-bold leading-5 text-[#172B3A]">
            {event.title}
          </Link>
          {hostLine ? (
            <HostLine name={event.hostName} verified={!event.isListing} />
          ) : (
            <span className="flex h-4 items-center">
              <MapPinIcon size={14} className="shrink-0 text-[#E22765]" />
              <span className="truncate text-[12px] leading-4 text-[#4D5E70]">{event.venueLabel}</span>
            </span>
          )}
          <span className="h-[5px]" />
          {footer ? (
            <div className="-mr-7 mt-auto flex h-5 items-end justify-end">
              <span className="text-[14px] font-bold leading-5 text-[#172B3A]">{footer}</span>
            </div>
          ) : (
          <div className="-mr-7 flex items-end justify-between gap-2">
            <div className={`flex flex-wrap items-center gap-1 ${hasExtraTags ? "w-[164px]" : ""}`}>
              <CategoryTag label={event.categoryLabel} bg={categoryTag?.bg} fg={categoryTag?.fg} />
              {showRepeatAndAge && event.recurrence && <RepeatTag label={event.recurrence} />}
              {showRepeatAndAge && event.ageRestriction && <AgeBadge label={event.ageRestriction} />}
            </div>
            <div className="flex shrink-0 flex-col items-end">
              {event.priceLabel && <span className="text-[12px] leading-4 text-[#4D5E70]">{event.priceLabel}</span>}
              <span className="text-[14px] font-bold leading-5 text-[#172B3A]">{event.displayPrice}</span>
            </div>
          </div>
          )}
        </div>
      </div>
      <svg className="pointer-events-none absolute inset-0" width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" aria-hidden="true">
        <path d={ticketPathH(w, h, nx, 0.5)} stroke="#B4BFCA" strokeOpacity="0.5" />
        <line x1={nx} y1="8" x2={nx} y2={h - 8} stroke="#B4BFCA" strokeDasharray="4 4" />
      </svg>
      {showSave && <button
        type="button"
        aria-label={`Save ${event.title}`}
        className="absolute right-2.5 top-2.5 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#F4F6F8] text-[#172B3A]"
      >
        <BookmarkIcon size={16} />
      </button>}
    </div>
  );
}
