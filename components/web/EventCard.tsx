import Image from "next/image";
import Link from "next/link";
import { XiventaEvent } from "@/data";
import { BookmarkIcon } from "@/components/icons";

interface EventCardProps {
  event: XiventaEvent;
  className?: string;
}

/**
 * Event Card
 * 1:1 match with Figma `Event Card` (Node `310:16350` / `VariableID:17:94`)
 *
 * - Paper Ticket styling: Warm ivory (#FDFFF0) background
 * - Physical dashed perforation line dividing image header and details
 * - Dimension: 282px x 265px, cornerRadius 16px
 */
export function EventCard({ event, className = "" }: EventCardProps) {
  return (
    <article
      className={`group relative flex flex-col w-full sm:w-[282px] h-[265px] rounded-2xl bg-[#fdfff0] border border-stone-200/60 overflow-hidden shadow-xs hover:shadow-md hover:border-brand-500/30 transition-all duration-300 ${className}`}
    >
      <Link
        href={`/events/${event.slug}`}
        className="block relative w-full h-[124px] bg-slate-200 overflow-hidden"
        aria-label={event.title}
      >
        <Image
          src={event.imageUrl}
          alt={event.title}
          fill
          sizes="(max-width: 640px) 100vw, 282px"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
          {event.isFree && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/95 text-brand-600 shadow-xs backdrop-blur-xs">
              Free
            </span>
          )}
          {event.isOnline && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900/80 text-white shadow-xs backdrop-blur-xs">
              Online
            </span>
          )}
          {event.isSoldOut && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-600 text-white shadow-xs">
              Sold out
            </span>
          )}
        </div>

        {/* Bookmark Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          aria-label="Save event"
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-xs transition z-10 opacity-80 group-hover:opacity-100"
        >
          <BookmarkIcon size={14} />
        </button>
      </Link>

      {/* Ticket Perforation Line */}
      <div className="relative w-full border-t border-dashed border-[#b4bfca]/80 my-0">
        {/* Physical ticket notch cutouts */}
        <div className="absolute -left-2 -top-1.5 w-3 h-3 rounded-full bg-white border-r border-stone-200/60" />
        <div className="absolute -right-2 -top-1.5 w-3 h-3 rounded-full bg-white border-l border-stone-200/60" />
      </div>

      {/* Card Body */}
      <div className="flex-1 p-3 flex flex-col justify-between">
        <div className="space-y-1">
          {/* Date Label in brand-600 (#c81e57) */}
          <div className="text-[12px] font-semibold text-brand-600 tracking-tight">
            {event.dateLabel}
          </div>

          {/* Event Title */}
          <h3 className="text-[15px] font-bold text-[#172b3a] tracking-tight line-clamp-1 group-hover:text-brand-600 transition-colors">
            <Link href={`/events/${event.slug}`}>{event.title}</Link>
          </h3>

          {/* Host & Venue */}
          <p className="text-[12px] text-[#4d5e70] line-clamp-1">
            {event.hostName} · {event.venueName}, {event.neighborhood}
          </p>
        </div>

        {/* Footer: Price & Restriction tags */}
        <div className="flex items-center justify-between pt-1 border-t border-stone-100/80 mt-1">
          <div className="flex items-baseline gap-1">
            <span className="text-[11px] text-[#68788a] font-medium">
              {event.priceLabel}
            </span>
            <span className="text-[14px] font-bold text-[#172b3a]">
              {event.displayPrice}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-[#68788a]">
            {event.ageRestriction && (
              <span className="px-1.5 py-0.5 rounded bg-stone-100 font-semibold text-[10px]">
                {event.ageRestriction}
              </span>
            )}
            {event.recurrence && (
              <span className="text-[11px] text-slate-500 font-medium">
                {event.recurrence}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
