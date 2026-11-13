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
      className={`group relative flex flex-col w-full sm:w-[282px] h-[265px] rounded-2xl bg-[#FDFFF0] border border-[#B4BFCA] shadow-xs hover:shadow-md transition-all duration-300 ${className}`}
    >
      {/* 16px circular Ticket Notch cutouts (Node 310:16595: x: -8 & x: 274, y: 116.5, w: 16, h: 16, bg: #FFFFFF, border: 1px #B4BFCA) */}
      <div
        className="absolute -left-2 top-[116.5px] w-4 h-4 rounded-full bg-white border border-[#B4BFCA] z-20 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -right-2 top-[116.5px] w-4 h-4 rounded-full bg-white border border-[#B4BFCA] z-20 pointer-events-none"
        aria-hidden="true"
      />

      {/* Header Image with rounded-t-[15px] to sit cleanly inside the 16px border */}
      <Link
        href={`/events/${event.slug}`}
        className="block relative w-full h-[124px] bg-slate-200 rounded-t-[15px] overflow-hidden shrink-0"
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

      {/* Ticket Perforation Line (1px dashed #B4BFCA dividing image and body) */}
      <div className="relative w-full h-0 border-t border-dashed border-[#B4BFCA] shrink-0" />

      {/* Card Body (padding: 12px, spacing: 4px) */}
      <div className="flex-1 p-3 flex flex-col justify-between">
        <div className="space-y-1">
          {/* Date Label in brand pink (#C81E57 / Variable 17:123) */}
          <div className="text-[12px] font-bold text-[#C81E57] tracking-tight">
            {event.dateLabel}
          </div>

          {/* Event Title (w: 258, h: 40, text: #172B3A) */}
          <h3 className="text-[14px] font-bold text-[#172B3A] tracking-tight line-clamp-2 leading-[20px] h-[40px] group-hover:text-[#E22765] transition-colors">
            <Link href={`/events/${event.slug}`}>{event.title}</Link>
          </h3>

          {/* Host & Venue */}
          <p className="text-[12px] text-[#4D5E70] line-clamp-1">
            {event.hostName} · {event.venueName}
          </p>
        </div>

        {/* Footer: Price Block (NO border above price block in Figma) */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-baseline gap-1">
            <span className="text-[12px] text-[#4D5E70]">
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
