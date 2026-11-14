import Image from "next/image";
import Link from "next/link";
import { SpotlightStory } from "@/data";
import { PlayIcon, BookmarkIcon, ShareIcon } from "@/components/icons";

interface SpotlightCardProps {
  story: SpotlightStory;
  className?: string;
}

/**
 * Spotlight Item
 * 1:1 exact match with Figma `Spotlight Item` (Node `310:16728`)
 *
 * Dimensions: 215px x 429px (9:16 vertical reel)
 * Ground truth from Figma export `figma_spotlight_export.png`:
 *  - Top bar: "Spotlight" (text-white font-semibold 12px) + circular play button (white/30 backdrop-blur-md)
 *  - Right rail: Save & Share frosted glass circular buttons with labels underneath
 *  - Bottom area: Creator avatar + name, 2-line caption
 *  - Bottom floating white action card: Date/Status badge, Place/Event title, vibrant pink button ("Get tickets" / "Directions")
 */
export function SpotlightCard({ story, className = "" }: SpotlightCardProps) {
  const isOpenStatus = story.meta?.toUpperCase().startsWith("OPEN");

  return (
    <article
      className={`group relative flex-shrink-0 w-[215px] h-[429px] rounded-2xl overflow-hidden shadow-md select-none bg-slate-900 hover:shadow-xl transition-all duration-300 ${className}`}
    >
      {/* Background Image / Video Poster */}
      <Image
        src={story.imageUrl}
        alt={story.posterName}
        fill
        sizes="215px"
        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
      />

      {/* Gradient Scrim (top and bottom for maximum legibility of white elements) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent via-40% to-black/85 pointer-events-none" />

      {/* Top Header Row (Node I310:16728;... Top) */}
      <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10 pointer-events-none">
        <span className="text-[12px] font-semibold text-white tracking-tight drop-shadow-md">
          Spotlight
        </span>

        <button
          type="button"
          aria-label="Play spotlight"
          className="pointer-events-auto w-6 h-6 rounded-full bg-white/30 hover:bg-white/50 text-white flex items-center justify-center backdrop-blur-md transition shadow-xs"
        >
          <PlayIcon size={11} className="ml-0.5 fill-white text-white drop-shadow-xs" />
        </button>
      </div>

      {/* Right Rail: Floating Frosted Action Buttons (Save & Share) */}
      <div className="absolute right-2.5 bottom-[96px] z-20 flex flex-col items-center gap-2.5">
        {/* Bookmark / Save */}
        <div className="flex flex-col items-center gap-0.5">
          <button
            type="button"
            aria-label="Save spotlight"
            className="w-8 h-8 rounded-full bg-white/35 hover:bg-white/55 backdrop-blur-md flex items-center justify-center text-white shadow-sm transition active:scale-95"
          >
            <BookmarkIcon size={15} className="text-white drop-shadow-xs" />
          </button>
          <span className="text-[9.5px] font-medium text-white drop-shadow-md">
            Save
          </span>
        </div>

        {/* Share */}
        <div className="flex flex-col items-center gap-0.5">
          <button
            type="button"
            aria-label="Share spotlight"
            className="w-8 h-8 rounded-full bg-white/35 hover:bg-white/55 backdrop-blur-md flex items-center justify-center text-white shadow-sm transition active:scale-95"
          >
            <ShareIcon size={15} className="text-white drop-shadow-xs" />
          </button>
          <span className="text-[9.5px] font-medium text-white drop-shadow-md">
            Share
          </span>
        </div>
      </div>

      {/* Bottom Content Area */}
      <div className="absolute bottom-0 inset-x-0 p-2.5 flex flex-col gap-1.5 z-10 text-white">
        {/* Creator Info (Avatar + Name) */}
        <div className="flex items-center gap-1.5 pr-11">
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow-xs shrink-0 ${
              story.avatarBg || "bg-[#E22765]"
            }`}
          >
            {story.posterInitials}
          </div>
          <span className="text-[12px] font-bold tracking-tight text-white line-clamp-1 drop-shadow-md">
            {story.posterName}
          </span>
        </div>

        {/* Caption (2 lines, padded right so it never overlaps right rail) */}
        <p className="text-[10.5px] leading-[1.3] text-white/95 line-clamp-2 drop-shadow-md pr-11">
          {story.caption}
        </p>

        {/* Floating White Action Card (Figma Node I310:16728;...) */}
        <div className="mt-0.5 bg-white rounded-xl py-1.5 px-2 flex items-center justify-between gap-1 shadow-lg border border-black/5">
          <div className="flex flex-col min-w-0 flex-1">
            <span
              className={`text-[8.5px] font-bold uppercase tracking-tight whitespace-nowrap overflow-hidden text-ellipsis ${
                isOpenStatus ? "text-[#067647]" : "text-[#C81E57]"
              }`}
            >
              {story.meta}
            </span>
            <span className="text-[11.5px] font-bold text-[#172B3A] line-clamp-1 leading-snug">
              {story.posterName}
            </span>
          </div>

          <Link
            href={story.actionType === "directions" ? "/places" : "/events"}
            className="shrink-0 px-2 py-1.5 rounded-lg bg-[#E22765] hover:bg-[#C81E57] text-white text-[10px] font-bold transition shadow-xs active:scale-95 whitespace-nowrap"
          >
            {story.actionLabel}
          </Link>
        </div>
      </div>
    </article>
  );
}
