import Link from "next/link";
import { GetAppButton } from "@/components/pwa/GetAppButton";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: { label: string; href: string };
  /** Render the action as the install button (Spotlight "Get the app to watch"). */
  installAction?: string;
}

/**
 * Web section header (PW01 / PW06): 24 / 30 bold title, optional 14 / 20 subtitle (gap 4),
 * ghost button on the right (44 high, 16 px padding, #C81E57 label).
 */
export function SectionHeader({ title, subtitle, action, installAction }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h2 className="text-[24px] font-bold leading-[30px] tracking-[-0.02em] text-[#172B3A]">{title}</h2>
        {subtitle && <p className="text-[14px] leading-5 text-[#4D5E70]">{subtitle}</p>}
      </div>
      {installAction && (
        <GetAppButton className="flex h-11 shrink-0 items-center rounded-[12px] px-4 text-[14px] leading-[18px] text-[#C81E57] hover:bg-[#FDEEF3]">
          {installAction}
        </GetAppButton>
      )}
      {action && (
        <Link href={action.href} className="flex h-11 shrink-0 items-center rounded-[12px] px-4 text-[14px] leading-[18px] text-[#C81E57] hover:bg-[#FDEEF3]">
          {action.label}
        </Link>
      )}
    </div>
  );
}
