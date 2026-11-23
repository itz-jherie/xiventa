"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import type { XiventaEvent } from "@/data";
import { ArrowLeftIcon } from "@/components/icons";
import { TopNav } from "@/components/web/TopNav";
import { WebFooter } from "@/components/web/WebFooter";

/** App checkout top bar (AM28 to AM33): 36 px grey back, 17 / 22 title, 12 / 16 subtitle. */
export function AppTop({ title, subtitle, back = true, onBack }: { title: string; subtitle?: string; back?: boolean; onBack?: () => void }) {
  const router = useRouter();
  return (
    <div className="flex h-14 items-center gap-3 px-4">
      {back && (
        <button
          type="button"
          aria-label="Back"
          onClick={onBack ?? (() => router.back())}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F4F6F8] text-[#172B3A]"
        >
          <ArrowLeftIcon size={20} />
        </button>
      )}
      <div className="flex min-w-0 flex-col">
        <h1 className="truncate text-[17px] font-bold leading-[22px] tracking-[-0.01em] text-[#172B3A]">{title}</h1>
        {subtitle && <p className="truncate text-[12px] leading-4 text-[#68788A]">{subtitle}</p>}
      </div>
    </div>
  );
}

/** Figma `Bottom Action Bar` (93 high): optional label + price, 52 px primary. */
export function AppBottomBar({
  label,
  price,
  action,
  onAction,
  disabled,
}: {
  label?: string;
  price?: string;
  action: string;
  onAction: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-4 border-t border-[#E9EDF1] bg-white px-4 pb-[max(28px,env(safe-area-inset-bottom))] pt-3">
      {price && (
        <div className="flex min-w-[60px] flex-col">
          {label && <span className="text-[10px] leading-3 text-[#4D5E70]">{label}</span>}
          <span className="whitespace-nowrap text-[16px] font-bold leading-6 tracking-[-0.01em] text-[#172B3A]">{price}</span>
        </div>
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={onAction}
        className="flex h-[52px] min-w-0 flex-1 items-center justify-center rounded-[12px] bg-[#E22765] px-5 text-[16px] leading-5 tracking-[-0.01em] text-white hover:bg-[#C81E57] disabled:bg-[#F5A3BF]"
      >
        {action}
      </button>
    </div>
  );
}

/** AM28 `Event Header`: 48 x 60 flyer, meta line, one urgency pill. */
export function EventHeader({ event, meta, pill, tone = "amber" }: { event: XiventaEvent; meta: string; pill?: string; tone?: "amber" | "green" }) {
  return (
    <div className="flex items-center gap-3 px-4 pb-3 pt-2">
      <span className="relative h-[60px] w-12 shrink-0 overflow-hidden rounded-[8px] bg-[#E9EDF1]">
        <Image src={event.imageUrl} alt="" fill sizes="48px" className="object-cover" />
      </span>
      <div className="flex min-w-0 flex-col gap-1.5">
        <span className="truncate text-[13px] text-[#4D5E70]">{meta}</span>
        {pill && (
          <span
            className={`inline-flex h-[22px] w-fit items-center gap-1.5 rounded-full px-2.5 text-[12px] font-bold ${
              tone === "green" ? "bg-[#E3F8EF] text-[#067647]" : "bg-[#FFF6DD] text-[#8F5200]"
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.4" />
              <path d="M7 4.2V7L8.8 8.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            {pill}
          </span>
        )}
      </div>
    </div>
  );
}

/** Web checkout shell: Top Nav, main padding 40 / 120 / 96, footer. */
export function WebShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="hidden min-h-screen flex-col bg-white md:flex">
      <TopNav />
      <main className="mx-auto w-full max-w-[1440px] flex-1 px-6 pb-24 pt-10 lg:px-[120px]">{children}</main>
      <WebFooter />
    </div>
  );
}

/** Checkout art tile (pink, 144 x 120) used on pending and failed (AM32 / AM33). */
export { TicketsIllustration } from "@/components/mobile/AppParts";
