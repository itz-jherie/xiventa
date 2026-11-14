import Image from "next/image";
import Link from "next/link";
import { XiventaEvent } from "@/data";
import { BookmarkIcon, VerifiedBadgeIcon } from "@/components/icons";

interface EventCardProps {
  event: XiventaEvent;
  className?: string;
}

// Exact 1:1 SVG path matching Figma Node 310:16595 (Event Card ticket geometry)
// Width: 282px, Height: 265px, cornerRadius: 16px, Notch: 16px inward cutout at y: 116.5px - 132.5px
const TICKET_CLIP_PATH =
  "path('M 16 0 H 266 A 16 16 0 0 1 282 16 V 116.5 A 8 8 0 0 0 282 132.5 V 249 A 16 16 0 0 1 266 265 H 16 A 16 16 0 0 1 0 249 V 132.5 A 8 8 0 0 0 0 116.5 V 16 A 16 16 0 0 1 16 0 Z')";

const TICKET_STROKE_PATH =
  "M 16 0.5 H 266 A 15.5 15.5 0 0 1 281.5 16 V 116.5 A 8 8 0 0 0 281.5 132.5 V 249 A 15.5 15.5 0 0 1 266 264.5 H 16 A 15.5 15.5 0 0 1 0.5 249 V 132.5 A 8 8 0 0 0 0.5 116.5 V 16 A 15.5 15.5 0 0 1 16 0.5 Z";

export function EventCard({ event, className = "" }: EventCardProps) {
  const formattedPrice = event.isFree ? "Free" : event.displayPrice.replace(/^From\s+/i, "");

  return (
    <div className={`relative w-[282px] h-[265px] shrink-0 select-none group ${className}`}>
      {/* 1. Ticket Card Content (Clipped to inward notch silhouette via CSS path) */}
      <article
        className="w-full h-full bg-[#FDFFF0] flex flex-col justify-between transition-all duration-300 group-hover:brightness-98"
        style={{ clipPath: TICKET_CLIP_PATH }}
      >
        {/* Header Image (h: 124px) */}
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

        {/* Card Body (h: 140px, pad: 12px, spacing: 4px) */}
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
      </article>

      {/* 2. Continuous 1px Border Stroke (#B4BFCA / VariableID:17:132) curving inward into notches */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-30"
        viewBox="0 0 282 265"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d={TICKET_STROKE_PATH}
          stroke="#B4BFCA"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}
