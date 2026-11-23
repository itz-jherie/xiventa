import Image from "next/image";
import Link from "next/link";
import { Place } from "@/data";
import { BookmarkIcon } from "@/components/icons";

export type PlaceBadge = { label: string; tone: "open" | "blue" | "closed" | "amber" };

export function PlaceBadgePill({ badge }: { badge: PlaceBadge }) {
  const cls =
    badge.tone === "open"
      ? "bg-[#E3F8EF] text-[#067647]"
      : badge.tone === "closed"
        ? "bg-[#E9EDF1] text-[#33465A]"
        : badge.tone === "amber"
          ? "bg-[#FFF6DD] text-[#8F5200]"
          : "bg-[#E6F1FF] text-[#0059BE]";
  return (
    <span className={`inline-flex h-6 w-fit items-center gap-1.5 whitespace-nowrap rounded-full px-2 text-[12px] leading-4 ${cls}`}>
      {badge.tone !== "blue" && badge.tone !== "amber" && <span className={`h-1.5 w-1.5 rounded-full ${badge.tone === "open" ? "bg-[#067647]" : "bg-[#68788A]"}`} />}
      {badge.label}
    </span>
  );
}

/**
 * Figma `Place Card` list layout (AM77, AM21 venue, AM14 places): 358 x 118, white, 1 px #D5DCE3,
 * radius 16, 104 px image, body padding 12 / 44 / 12 / 12 gap 4, 30 px grey save.
 */
export function AppPlaceRow({ place, badge, onBadge }: { place: Place; badge?: PlaceBadge; onBadge?: () => void }) {
  const b = badge ?? (place.isOpenNow ? { label: "Open now", tone: "open" as const } : { label: "Closed now", tone: "closed" as const });
  return (
    <article className="relative flex h-[118px] w-full max-w-[358px] overflow-hidden rounded-2xl border border-[#D5DCE3] bg-white">
      <Link href={`/places/${place.slug}`} className="relative block w-[104px] shrink-0 bg-[#E9EDF1]" aria-label={place.name}>
        <Image src={place.imageUrl} alt="" fill sizes="104px" className="object-cover" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-1 py-3 pl-3 pr-11">
        <Link href={`/places/${place.slug}`} className="truncate text-[16px] leading-6 tracking-[-0.01em] text-[#172B3A]">
          {place.name}
        </Link>
        <p className="truncate whitespace-pre text-[12px] leading-4 text-[#4D5E70]">{place.metaLabel.replace(/\s·\s/g, "  ·  ")}</p>
        <p className="text-[12px] leading-4 text-[#68788A]">{place.distanceLabel}</p>
        {onBadge ? (
          <button type="button" onClick={onBadge} className="w-fit">
            <PlaceBadgePill badge={b} />
          </button>
        ) : (
          <PlaceBadgePill badge={b} />
        )}
      </div>
      <button
        type="button"
        aria-label={`Save ${place.name}`}
        className="absolute right-[9px] top-[9px] flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#F4F6F8] text-[#172B3A]"
      >
        <BookmarkIcon size={16} />
      </button>
    </article>
  );
}
