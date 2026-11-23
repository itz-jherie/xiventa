import { TopNav } from "@/components/web/TopNav";
import { WebFooter } from "@/components/web/WebFooter";

/** Phone web is below 768 px (rule 19); at that width and up the sign in flow uses the PW14 web pages. */
export const DESKTOP_QUERY = "(min-width: 768px)";

export function isDesktop() {
  return typeof window !== "undefined" && window.matchMedia(DESKTOP_QUERY).matches;
}

/**
 * PW14 Sign in shell, 1:1 with Figma frame 314:20613: Top Nav (Web), main padding 40 / 120 / 96,
 * a centred 440 wide card (white, 1 px #E9EDF1, radius 16, padding 32, gap 20), Web Footer.
 */
export function WebAuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-white text-[#172B3A]">
      <TopNav />
      <main className="flex flex-1 justify-center px-4 pb-24 pt-10 md:px-[120px]">
        <div className="flex h-fit w-full max-w-[440px] flex-col gap-5 rounded-2xl border border-[#E9EDF1] bg-white p-8">{children}</div>
      </main>
      <WebFooter />
    </div>
  );
}

export function WebAuthTitle({ children }: { children: React.ReactNode }) {
  return <h1 className="text-[24px] font-bold leading-[30px] tracking-[-0.02em] text-[#172B3A]">{children}</h1>;
}

export function WebAuthText({ children }: { children: React.ReactNode }) {
  return <p className="text-[14px] leading-5 text-[#4D5E70]">{children}</p>;
}

export function WebAuthSmall({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-[12px] leading-4 text-[#4D5E70] ${className}`}>{children}</p>;
}

export function WebField({ label, ...input }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] leading-4 text-[#172B3A]">{label}</span>
      <input
        {...input}
        className="h-12 w-full rounded-[8px] border border-[#D5DCE3] bg-white px-4 text-[14px] leading-5 text-[#172B3A] placeholder:text-[#68788A] focus:border-2 focus:border-[#E22765] focus:px-[15px] focus:outline-none"
      />
    </label>
  );
}

export const webPrimaryBtn =
  "flex h-[52px] w-full items-center justify-center rounded-[12px] bg-[#E22765] px-5 text-[16px] leading-5 tracking-[-0.01em] text-white hover:bg-[#C81E57] disabled:opacity-60";
export const webOutlineBtn =
  "flex h-[52px] w-full items-center justify-center rounded-[12px] border border-[#B4BFCA] bg-white px-5 text-[16px] leading-5 tracking-[-0.01em] text-[#172B3A] hover:border-[#68788A]";
export const webGhostBtn =
  "flex h-11 w-full items-center justify-center rounded-[12px] px-4 text-[14px] leading-[18px] text-[#C81E57] hover:bg-[#FDEEF3]";
