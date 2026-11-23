import Link from "next/link";
import { ArrowLeftIcon } from "@/components/icons";

interface OnboardingShellProps {
  backHref: string;
  /** 1 or 2 of the two step bar (AM07 = step 1, AM09 = step 2). */
  step: 1 | 2;
  skip?: { label?: string; onClick: () => void };
  children: React.ReactNode;
}

/**
 * White onboarding shell for AM07 / AM09 (390 wide): grey back button at (16, 56),
 * 2 step progress at (136, 76), Skip ghost button at the right.
 */
export function OnboardingShell({ backHref, step, skip, children }: OnboardingShellProps) {
  return (
    <div className="min-h-[100dvh] w-full bg-white">
      <div className="relative mx-auto min-h-[100dvh] w-full max-w-[390px] bg-white">
        <Link href={backHref} aria-label="Back" className="absolute left-4 top-14 flex h-9 w-9 items-center justify-center rounded-full bg-[#F4F6F8] text-[#172B3A]">
          <ArrowLeftIcon size={20} />
        </Link>
        <div className="absolute left-1/2 top-[76px] flex -translate-x-1/2 gap-1.5" aria-label={`Step ${step} of 2`}>
          <span className="h-1 w-14 rounded-[2px] bg-[#E22765]" />
          <span className={`h-1 w-14 rounded-[2px] ${step === 2 ? "bg-[#E22765]" : "bg-[#E9EDF1]"}`} />
        </div>
        {skip && (
          <button
            type="button"
            onClick={skip.onClick}
            className="absolute right-4 top-14 flex h-11 items-center rounded-[12px] px-4 text-[14px] leading-[18px] text-[#C81E57]"
          >
            {skip.label ?? "Skip"}
          </button>
        )}
        {children}
      </div>
    </div>
  );
}

export const primaryBtnClass =
  "flex h-[52px] w-full items-center justify-center rounded-[12px] bg-[#E22765] px-5 text-[16px] leading-5 tracking-[-0.01em] text-white hover:bg-[#C81E57] disabled:opacity-60";
