import Link from "next/link";
import { EventCategory } from "@/data";
import {
  MusicIcon,
  PaletteIcon,
  UtensilsIcon,
  SparkleIcon,
  UsersIcon,
  HeartIcon,
  SunIcon,
  LaptopIcon,
  SmileIcon,
  BallIcon,
  DiceIcon,
  CandleIcon,
  GraduationCapIcon,
  HangerIcon,
  TicketIcon,
} from "@/components/icons";

interface CategoryTileProps {
  category: EventCategory;
  isActive?: boolean;
}

/**
 * Category Tile
 * 1:1 match with Figma `Category Tile` (Node `310:16477`)
 *
 * Dimensions: 64px x 74px, icon tile 52px x 52px (cornerRadius 12px)
 * Label: 12px Arimo Regular text-[#4D5E70]
 */
export function CategoryTile({ category, isActive = false }: CategoryTileProps) {
  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case "music":
        return <MusicIcon size={24} />;
      case "nightlife":
        return <SparkleIcon size={24} />;
      case "art":
        return <PaletteIcon size={24} />;
      case "food":
        return <UtensilsIcon size={24} />;
      case "tech":
        return <LaptopIcon size={24} />;
      case "comedy":
        return <SmileIcon size={24} />;
      case "sports":
        return <BallIcon size={24} />;
      case "games":
        return <DiceIcon size={24} />;
      case "faith":
        return <CandleIcon size={24} />;
      case "family":
        return <HeartIcon size={24} />;
      case "learning":
        return <GraduationCapIcon size={24} />;
      case "community":
        return <UsersIcon size={24} />;
      case "fashion":
        return <HangerIcon size={24} />;
      case "outdoors":
        return <SunIcon size={24} />;
      default:
        return <TicketIcon size={24} />;
    }
  };

  return (
    <Link
      href={`/events?category=${category.slug}`}
      className="group flex flex-col items-center gap-1.5 w-[64px] shrink-0 select-none transition-transform hover:-translate-y-0.5"
    >
      <div
        className={`w-[52px] h-[52px] rounded-xl flex items-center justify-center transition-all duration-200 shadow-2xs group-hover:shadow-sm ${category.bgTint} ${category.iconColor} ${
          isActive ? "ring-2 ring-[#E22765] scale-105" : ""
        }`}
      >
        {getCategoryIcon(category.slug)}
      </div>

      <span
        className={`text-[12px] text-center font-normal truncate w-full ${
          isActive ? "text-[#E22765] font-bold" : "text-[#4D5E70] group-hover:text-[#172B3A]"
        }`}
      >
        {category.name}
      </span>
    </Link>
  );
}
