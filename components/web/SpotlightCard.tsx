import Image from "next/image";
import Link from "next/link";
import { SpotlightStory } from "@/data";
import { BookmarkIcon, PlayIcon, ShareIcon } from "@/components/icons";

interface SpotlightCardProps {
  story: SpotlightStory;
  className?: string;
}

/**
 * Spotlight Item, 1:1 with Figma node 310:16728 (215 x 429). It is a scaled down phone clip, so
 * the inner type sizes are the Figma values (5.5 to 11 px).
 */
export function SpotlightCard({ story, className = "" }: SpotlightCardProps) {
  const isPlace = story.actionType === "directions";
  const titleColor = story.headerTone === "dark" ? "#172B3A" : "#FFFFFF";

  return (
    <article className={`relative h-[429px] w-[215px] shrink-0 overflow-hidden bg-[#0E1C27] select-none ${className}`}>
      <Image src={story.imageUrl} alt="" fill sizes="215px" className="object-cover" />
      <div
        className="absolute inset-x-0 bottom-0 h-[242px]"
        style={{ background: "linear-gradient(180deg, rgba(14,28,39,0) 0%, rgba(14,28,39,0.8) 100%)" }}
      />

      {/* Header */}
      <div className="absolute left-[9px] top-[31px] flex h-[22px] w-[197px] items-center justify-between">
        <span className="text-[11px] font-bold leading-[14.3px] tracking-[-0.02em]" style={{ color: titleColor }}>
          Spotlight
        </span>
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/[0.72]">
          <PlayIcon size={11} className="text-[#172B3A]" />
        </span>
      </div>

      {/* Actions */}
      <div className="absolute left-[182px] top-[236px] flex w-6 flex-col items-center gap-[8.8px]">
        {[
          { label: "Save", Icon: BookmarkIcon },
          { label: "Share", Icon: ShareIcon },
        ].map(({ label, Icon }) => (
          <div key={label} className="flex flex-col items-center gap-[2.2px]">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/[0.72]">
              <Icon size={13} className="text-[#172B3A]" />
            </span>
            <span className="text-[5.5px] leading-[6.6px] text-white">{label}</span>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="absolute left-[9px] top-[289px] flex w-[197px] flex-col gap-[6.6px]">
        <div className="flex items-center gap-[4.4px]">
          <span className="flex h-[15px] w-[15px] items-center justify-center rounded-full bg-[#F1EEFF] text-[5.5px] leading-[6.6px] text-[#5B3FD6]">
            {story.posterInitials}
          </span>
          <span className="text-[7.15px] leading-[8.8px] text-white">{story.posterName}</span>
        </div>
        <p className="w-40 text-[7.7px] leading-[11px] text-white">{story.caption}</p>
        <div className="flex h-8 items-center gap-[6.6px] rounded-[8.8px] bg-white p-[6.6px]">
          <div className="flex min-w-0 flex-1 flex-col gap-[1.1px]">
            <span
              className="truncate text-[5.5px] uppercase leading-[6.6px] tracking-[0.04em]"
              style={{ color: isPlace ? "#067647" : "#C81E57" }}
            >
              {story.meta}
            </span>
            <span className="truncate text-[7.7px] leading-[11px] text-[#172B3A]">{story.posterName}</span>
          </div>
          <Link
            href={isPlace ? "/places" : "/events"}
            className="flex h-[18px] shrink-0 items-center rounded-[4.4px] bg-[#E22765] px-[6.6px] text-[7.15px] leading-[8.8px] text-white"
          >
            {story.actionLabel}
          </Link>
        </div>
      </div>
    </article>
  );
}
