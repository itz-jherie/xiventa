import { ChevronDownIcon } from "@/components/icons";

interface ChipProps {
  label: string;
  selected?: boolean;
  /** Shows the 16 px chevron used on dropdown chips. */
  dropdown?: boolean;
  leadingIcon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

/**
 * Figma `Chip`: 32 high, fully rounded, 16 px side padding, 6 px gap, 13 / 16 Arimo Regular.
 * Selected = brand #E22765 with white text; default = white with a 1 px #B4BFCA border.
 */
export function Chip({ label, selected = false, dropdown = false, leadingIcon, onClick, className = "" }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-full px-4 text-[13px] leading-4 whitespace-nowrap transition-colors ${
        selected
          ? "bg-[#E22765] text-white hover:bg-[#C81E57]"
          : "border border-[#B4BFCA] bg-white text-[#4D5E70] hover:border-[#68788A]"
      } ${className}`}
    >
      {leadingIcon}
      <span>{label}</span>
      {dropdown && <ChevronDownIcon size={16} className={selected ? "text-white" : "text-[#68788A]"} />}
    </button>
  );
}
