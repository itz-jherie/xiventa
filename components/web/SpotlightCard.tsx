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
 * 1:1 match with Figma `Spotlight Item` (Node `310:16350`)
 *
 * Dimensions: 215px x 429px (9:16 vertical reel)
 */
export function SpotlightCard({ story, className = "" }: SpotlightCardProps) {
  return (
    <article
      className={`group relative flex-shrink-0 w-[215px] h-[429px] rounded-2xl overflow-hidden shadow-md select-none bg-slate-900 hover:shadow-xl transition-all duration-300 ${className}`}
    >
      {/* Background Image/Video preview */}
      <Image
        src={story.imageUrl}
        alt={story.posterName}
        fill
        sizes="215px"
        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
      />

      {/* Gradient Scrim (dark at bottom for legible white text) */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0e1c27] via-[#0e1c27]/40 to-black/30" />

      {/* Top Header Row */}
      <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
        <span className="text-[11px] font-bold text-white/90 tracking-wide uppercase bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-xs">
          Spotlight
        </span>

        <div className="w-6 h-6 rounded-full bg-white/25 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-xs transition shadow-xs">
          <PlayIcon size={12} className="ml-0.5 fill-white text-white" />
        </div>
      </div>

      {/* Bottom Content Area */}
      <div className="absolute bottom-3 inset-x-3 flex flex-col gap-2 z-10 text-white">
        {/* Creator Info */}
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shadow-xs ${
              story.avatarBg || "bg-brand-500"
            }`}
          >
            {story.posterInitials}
          </div>
          <span className="text-[13px] font-bold tracking-tight text-white line-clamp-1 drop-shadow-xs">
            {story.posterName}
          </span>
        </div>

        {/* Caption */}
        <p className="text-[12px] leading-snug text-white/90 line-clamp-2 drop-shadow-xs">
          {story.caption}
        </p>

        {/* Meta / Date */}
        <div className="text-[10px] font-bold text-brand-300 uppercase tracking-wider">
          {story.meta}
        </div>

        {/* Quick Action Button & Social Tools */}
        <div className="flex items-center justify-between gap-1.5 pt-1">
          <Link
            href="/events"
            className="flex-1 py-1.5 px-3 rounded-full bg-brand-500 hover:bg-brand-600 text-white text-[11px] font-bold text-center tracking-wide transition shadow-xs"
          >
            {story.actionLabel}
          </Link>

          <button
            type="button"
            aria-label="Save"
            className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition backdrop-blur-xs"
          >
            <BookmarkIcon size={13} />
          </button>
          <button
            type="button"
            aria-label="Share"
            className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition backdrop-blur-xs"
          >
            <ShareIcon size={13} />
          </button>
        </div>
      </div>
    </article>
  );
}

