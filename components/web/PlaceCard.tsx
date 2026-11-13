import Image from "next/image";
import Link from "next/link";
import { Place } from "@/data";
import { StarIcon } from "@/components/icons";

interface PlaceCardProps {
  place: Place;
  className?: string;
}

/**
 * Place Card
 * 1:1 match with Figma `Place Card` (Node `310:16350`)
 *
 * Dimensions: 384px x 270px, cornerRadius 16px
 */
export function PlaceCard({ place, className = "" }: PlaceCardProps) {
  return (
    <article
      className={`group relative flex flex-col w-full sm:w-[384px] h-[270px] rounded-2xl bg-white border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-300 ${className}`}
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

        {/* Live Status indicator */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
          {place.isOpenNow ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-950/80 text-emerald-300 backdrop-blur-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Open now
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-900/80 text-slate-300 backdrop-blur-xs">
              Closed
            </span>
          )}
        </div>
      </Link>

      {/* Body */}
      <div className="flex-1 p-3.5 flex flex-col justify-between">
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-[16px] font-bold text-[#172b3a] tracking-tight group-hover:text-brand-600 transition-colors line-clamp-1">
              <Link href={`/places/${place.slug}`}>{place.name}</Link>
            </h3>

            <span
              className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider ${place.tagBg} ${place.tagColor}`}
            >
              {place.categoryLabel}
            </span>
          </div>

          <p className="text-[12px] text-[#4d5e70] font-normal">
            {place.metaLabel}
          </p>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[12px]">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-[#172b3a] font-bold">
              <StarIcon size={14} className="text-[#ffb020] fill-[#ffb020]" />
              <span>{place.rating.toFixed(1)}</span>
            </div>
            <span className="text-slate-300">·</span>
            <span className="text-[#68788a]">{place.distanceLabel}</span>
          </div>

          {place.beenHereCount && (
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>{place.beenHereCount} been here</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
