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
  TicketIcon,
} from "@/components/icons";

interface CategoryTileProps {
  category: EventCategory;
  isActive?: boolean;
}

/**
 * Category Tile
 * 1:1 match with Figma `Category Tile` (Node `310:16350`)
 *
 * Dimensions: 64px x 74px, icon tile 52px x 52px (cornerRadius 12px)
 */
export function CategoryTile({ category, isActive = false }: CategoryTileProps) {
  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case "music":
        return <MusicIcon size={24} />;
      case "art":
      case "fashion":
        return <PaletteIcon size={24} />;
      case "food":
        return <UtensilsIcon size={24} />;
      case "nightlife":
      case "comedy":
        return <SparkleIcon size={24} />;
      case "community":
      case "family":
      case "learning":
      case "faith":
        return <UsersIcon size={24} />;
      case "outdoors":
      case "sports":
        return <SunIcon size={24} />;
      default:
        return <TicketIcon size={24} />;
    }
  };

  return (
    <Link
      href={`/events?category=${category.slug}`}
      className="group flex flex-col items-center w-16 select-none transition-transform hover:-translate-y-0.5"
    >
      <div
        className={`w-[52px] h-[52px] rounded-xl flex items-center justify-center transition-all shadow-2xs ${category.bgTint} ${category.iconColor} ${
          isActive ? "ring-2 ring-brand-500 ring-offset-2" : ""
        }`}
      >
        {getCategoryIcon(category.slug)}
      </div>

      <span
        className={`mt-1.5 text-[12px] font-medium text-center truncate w-full transition-colors ${
          isActive
            ? "text-brand-600 font-semibold"
            : "text-[#4d5e70] group-hover:text-[#172b3a]"
        }`}
      >
        {category.name}
      </span>
    </Link>
  );
}
