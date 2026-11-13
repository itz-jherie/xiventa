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
 * 1:1 exact match with Figma `Event Card` (Node `310:16350` / `VariableID:17:94`)
 *
 * - Paper Ticket styling: Warm ivory (#FDFFF0) background
 * - Physical dashed perforation line dividing image header and details
 * - 16px circular Ticket Notch cutouts on both left and right edges
 * - Dimension: 282px x 265px, cornerRadius 16px
 * - Border: 1px solid #B4BFCA (Variable 17:132)
 */
export function EventCard({ event, className = "" }: EventCardProps) {
  return (
    <article
      className={`group relative flex flex-col w-full sm:w-[282px] h-[265px] rounded-2xl bg-[#FDFFF0] border border-[#B4BFCA] overflow-hidden shadow-xs hover:shadow-md hover:border-[#E22765]/40 transition-all duration-300 ${className}`}
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
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-[#0059BE] shadow-xs">
              Free
            </span>
          )}
          {event.isOnline && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E6F1FF] text-[#0059BE] shadow-xs">
              Online · Zoom
            </span>
          )}
          {event.isSoldOut && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFE8E8] text-[#D92D20] shadow-xs">
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
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/70 hover:bg-white text-[#172B3A] flex items-center justify-center backdrop-blur-xs transition z-10"
        >
          <BookmarkIcon size={14} />
        </button>
      </Link>

      {/* Ticket Perforation Line with Notches */}
      <div className="relative w-full border-t border-dashed border-[#B4BFCA] my-0">
        <div className="absolute -left-2 -top-2 w-4 h-4 rounded-full bg-white border border-[#B4BFCA]" />
        <div className="absolute -right-2 -top-2 w-4 h-4 rounded-full bg-white border border-[#B4BFCA]" />
      </div>

      {/* Card Body */}
      <div className="flex-1 p-3 flex flex-col justify-between">
        <div className="space-y-1">
          {/* Date Label in brand pink (#C81E57) */}
          <div className="text-[12px] font-bold text-[#C81E57] tracking-tight">
            {event.dateLabel}
          </div>

          {/* Event Title */}
          <h3 className="text-[14px] font-bold text-[#172B3A] tracking-tight line-clamp-2 leading-snug group-hover:text-[#E22765] transition-colors">
            <Link href={`/events/${event.slug}`}>{event.title}</Link>
          </h3>

          {/* Host & Venue */}
          <p className="text-[12px] text-[#4D5E70] line-clamp-1">
            {event.hostName} · {event.venueName}
          </p>
        </div>

        {/* Footer: Price */}
        <div className="flex items-center justify-between pt-1 border-t border-stone-200/40">
          <div className="flex items-baseline gap-1">
            <span className="text-[11px] text-[#68788A] font-medium">
              {event.priceLabel}
            </span>
            <span className="text-[14px] font-bold text-[#172B3A]">
              {event.displayPrice}
            </span>
          </div>

          {event.ageRestriction && (
            <span className="px-1.5 py-0.5 rounded-sm border border-[#B4BFCA] text-[10px] font-bold text-[#172B3A]">
              {event.ageRestriction}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
