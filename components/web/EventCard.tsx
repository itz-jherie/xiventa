import Image from "next/image";
import Link from "next/link";
import { XiventaEvent } from "@/data";
import { BookmarkIcon, VerifiedBadgeIcon } from "@/components/icons";

interface EventCardProps {
  event: XiventaEvent;
  className?: string;
}

/**
 * Event Card
 * 1:1 exact match with Figma `Event Card` (Node `310:16595`)
 *
 * Dimensions: 282px x 265px, cornerRadius 16px
 * Background: Warm ivory (#FDFFF0 / VariableID:17:94)
 * Border: 1px solid #B4BFCA (VariableID:17:132)
 * Notches: 16px circular cutouts at x: -8px & x: 274px, y: 116.5px
 * ClipsContent: true (overflow: hidden)
 */
export function EventCard({ event, className = "" }: EventCardProps) {
  const formattedPrice = event.isFree ? "Free" : event.displayPrice.replace(/^From\s+/i, "");

  return (
    <article
      className={`group relative flex flex-col w-full sm:w-[282px] h-[265px] rounded-2xl bg-[#FDFFF0] overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 ${className}`}
    >
      {/* 1. Header Image (h: 124px) */}
      <Link
        href={`/events/${event.slug}`}
        className="block relative w-full h-[124px] bg-slate-200 overflow-hidden shrink-0"
        aria-label={event.title}
      >
        <Image
          src={event.imageUrl}
          alt={event.title}
          fill
          sizes="(max-width: 640px) 100vw, 282px"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Bookmark Button (Node 310:16595 Save: 36x36px, bg: white 72% opacity, top-right) */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          aria-label="Save event"
          className="absolute top-2.5 right-2.5 w-9 h-9 rounded-full bg-white/75 hover:bg-white text-[#172B3A] flex items-center justify-center backdrop-blur-xs transition z-20 shadow-xs active:scale-95"
        >
          <BookmarkIcon size={16} />
        </button>
      </Link>

      {/* 2. Ticket Perforation Line (1px dashed #B4BFCA at y: 124px) */}
      <div className="relative w-full h-0 border-t border-dashed border-[#B4BFCA] shrink-0 z-10" />

      {/* 3. Card Body (h: 140px, pad: 12px, spacing: 4px) */}
      <div className="flex-1 p-3 flex flex-col justify-between z-10">
        <div className="space-y-1">
          {/* Date Label in brand pink (#C81E57 / VariableID:17:123) */}
          <div className="text-[12px] font-bold text-[#C81E57] tracking-tight">
            {event.dateLabel}
          </div>

          {/* Event Title (w: 258, h: 40, text: #172B3A, 14px bold, 2-line clamp) */}
          <h3 className="text-[14px] font-bold text-[#172B3A] tracking-tight line-clamp-2 leading-[20px] h-[40px] group-hover:text-[#E22765] transition-colors">
            <Link href={`/events/${event.slug}`}>{event.title}</Link>
          </h3>

          {/* Host row: Host name + Verified badge (Node 310:16595 Host: 12px #4D5E70 + 14px Verified badge) */}
          <div className="flex items-center gap-1.5 text-[12px] text-[#4D5E70] line-clamp-1">
            <span className="font-normal text-[#4D5E70] truncate">{event.hostName}</span>
            <VerifiedBadgeIcon size={14} className="text-[#E22765] shrink-0" />
          </div>
        </div>

        {/* Footer: Price Block (Node 310:16595: 14px bold #172B3A, NO 'From' prefix) */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[14px] font-bold text-[#172B3A]">
            {formattedPrice}
          </span>
        </div>
      </div>

      {/* 4. Outer Border Layer (Node 310:16595 Border: 282x265, 1px solid #B4BFCA, rounded-2xl) */}
      <div className="absolute inset-0 rounded-2xl border border-[#B4BFCA] pointer-events-none z-10" />

      {/* 5. Inward Ticket Notches (Node 310:16595: 16x16 ellipse, fills: #FFFFFF, strokes: #B4BFCA) */}
      {/* Positioned at x: -8px & x: 274px, y: 116.5px. Rendered over Border (z-20) and clipped by container overflow-hidden */}
      <div
        className="absolute -left-2 top-[116px] w-4 h-4 rounded-full bg-white border border-[#B4BFCA] z-20 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -right-2 top-[116px] w-4 h-4 rounded-full bg-white border border-[#B4BFCA] z-20 pointer-events-none"
        aria-hidden="true"
      />
    </article>
  );
}
