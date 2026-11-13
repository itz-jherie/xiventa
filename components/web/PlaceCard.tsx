import Image from "next/image";
import Link from "next/link";
import { Place } from "@/data";
import { StarFilledIcon, BookmarkIcon } from "@/components/icons";

interface PlaceCardProps {
  place: Place;
  className?: string;
}

/**
 * Place Card
 * 1:1 exact match with Figma `Place Card` (Node `310:16892`)
 *
 * Dimensions: 384px wide, 270px high, cornerRadius 16px
 * Image height: 176px
 * Border: NONE (strokes: []) - Card has zero border in Figma!
 */
export function PlaceCard({ place, className = "" }: PlaceCardProps) {
  return (
    <article
      className={`group relative flex flex-col w-full sm:w-[384px] h-[270px] rounded-2xl bg-white overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 ${className}`}
    >
      <Link
        href={`/places/${place.slug}`}
        className="block relative w-full h-[176px] bg-slate-100 overflow-hidden"
        aria-label={place.name}
      >
        <Image
          src={place.imageUrl}
          alt={place.name}
          fill
          sizes="(max-width: 640px) 100vw, 384px"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Live Status indicator (Node 310:16350 Place Card top-left) */}
        <div className="absolute top-3 left-3 z-10">
          {place.isOpenNow ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[#E4F8EF] text-[#067647] shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#067647]" />
              Open now
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-medium bg-[#F4F6F8] text-[#68788A] shadow-xs">
              Closed
            </span>
          )}
        </div>

        {/* Save button (Node 310:16350 Place Card top-right) */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          aria-label="Save place"
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/75 hover:bg-white text-[#172B3A] flex items-center justify-center backdrop-blur-xs transition z-10 shadow-xs"
        >
          <BookmarkIcon size={16} />
        </button>
      </Link>

      {/* Body */}
      <div className="flex-1 p-3.5 flex flex-col justify-between">
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-[16px] font-bold text-[#172B3A] tracking-tight group-hover:text-[#E22765] transition-colors line-clamp-1">
              <Link href={`/places/${place.slug}`}>{place.name}</Link>
            </h3>

            <span
              className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider ${place.tagBg} ${place.tagColor}`}
            >
              {place.categoryLabel}
            </span>
          </div>

          <p className="text-[12px] text-[#4D5E70] font-normal truncate">
            {place.metaLabel}
          </p>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[12px]">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-[#172B3A] font-bold">
              <StarFilledIcon size={14} className="text-[#FFB020]" />
              <span>{place.rating.toFixed(1)}</span>
            </div>
            <span className="text-slate-300">·</span>
            <span className="text-[#68788A]">{place.distanceLabel}</span>
          </div>

          {place.beenHereCount && (
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E6F1FF] text-[#0059BE] text-[11px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0059BE]" />
              <span>Been here</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
