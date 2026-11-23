import Image from "next/image";
import Link from "next/link";
import { Place } from "@/data";
import { BookmarkIcon } from "@/components/icons";
import { CategoryTag, OpenNowBadge } from "@/components/shared/Tags";

interface PlaceCardProps {
  place: Place;
  /**
   * `default`: Figma `Place Card` (384 x 270) on PW01 / PW03.
   * `featured`: Figma `Place Card / Featured` (316 x 270) on AM11.
   * `compact`: Figma `Place Card / Compact` (180 x 204) on AM11.
   */
  variant?: "default" | "featured" | "compact";
  className?: string;
}

/** "Rooftop bar · Victoria Island" is set with two spaces either side of the dot in Figma. */
const spacedMeta = (meta: string) => meta.replace(/\s·\s/g, "  ·  ");

/**
 * Place Card, 1:1 with the Figma `Place Card` component set.
 * Rating and "Been here" are hidden in the designs: ratings only show once a place has 5 reviews
 * (rule 17), and Been here is private to the signed in person (rule 15).
 */
export function PlaceCard({ place, variant = "default", className = "" }: PlaceCardProps) {
  const compact = variant === "compact";
  const width = variant === "default" ? 384 : variant === "featured" ? 316 : 180;
  const height = compact ? 204 : 270;
  const imageH = compact ? 120 : 176;
  const showRating = place.reviewCount >= 5;

  return (
    <article
      className={`relative flex shrink-0 flex-col overflow-hidden rounded-2xl border border-[#D5DCE3] bg-white ${className}`}
      style={{ width: variant === "default" ? undefined : width, height, maxWidth: variant === "default" ? width : undefined }}
    >
      <Link href={`/places/${place.slug}`} className="relative block shrink-0 bg-[#E9EDF1]" style={{ height: imageH }} aria-label={place.name}>
        <Image src={place.imageUrl} alt="" fill sizes={`${width}px`} className="object-cover" />
      </Link>

      <div className={`flex flex-1 flex-col p-3 ${compact ? "gap-1" : "gap-1.5"}`}>
        {compact ? (
          <h3 className="truncate text-[14px] leading-[18px] text-[#172B3A]">
            <Link href={`/places/${place.slug}`}>{place.name}</Link>
          </h3>
        ) : (
          <div className="flex h-6 items-center gap-2">
            <h3 className="min-w-0 flex-1 truncate text-[16px] leading-6 tracking-[-0.01em] text-[#172B3A]">
              <Link href={`/places/${place.slug}`}>{place.name}</Link>
            </h3>
            <CategoryTag label={place.categoryLabel} bg={place.tagBg} fg={place.tagColor} />
          </div>
        )}
        <p className="truncate whitespace-pre text-[12px] leading-4 text-[#4D5E70]">{spacedMeta(place.metaLabel)}</p>
        <div className="flex items-center gap-1 text-[12px] leading-4">
          {showRating && <span className="text-[#172B3A]">★ {place.rating.toFixed(1)} ·</span>}
          <span className="text-[#68788A]">{place.distanceLabel}</span>
        </div>
      </div>

      {!compact && (
        <>
          {place.isOpenNow && (
            <div className="absolute left-[11px] top-[11px]">
              <OpenNowBadge />
            </div>
          )}
          <button
            type="button"
            aria-label={`Save ${place.name}`}
            className="absolute right-[11px] top-[11px] flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.72] text-[#172B3A] transition hover:bg-white"
          >
            <BookmarkIcon size={20} />
          </button>
        </>
      )}
    </article>
  );
}
