import Image from "next/image";
import Link from "next/link";
import { img } from "@/data";
import { ArrowLeftIcon } from "@/components/icons";
import { XiventaWordmark } from "@/components/icons/XiventaWordmark";

/* Flyers per column, in Figma order (Flyer wall instance, node I849:57897). Each column lists its
   five flyers twice so the drift loops without a seam (rule 1: about 24 s per cycle). */
const COLUMNS: { hashes: string[]; dir: "up" | "down" }[] = [
  { hashes: ["9fd92999", "54e3dedd", "997f6d5f", "bf43f5e9", "9abb12ec"], dir: "up" },
  { hashes: ["c33706bb", "610df935", "2e73803e", "60d46c17", "6b030ea9"], dir: "down" },
  { hashes: ["5b0bbfce", "dcd2cb3c", "4ba72e77", "c45fde73", "77336b6d"], dir: "up" },
];

/**
 * Sign in flyer wall: three columns of 124 x 156 flyers (radius 14, gap 10), tilted 8°, placed
 * at (41, -199) as in AM02 / AM04 / AM05. Outer columns drift up, the middle one drifts down.
 * Stops when Reduce Motion is on (see globals.css).
 */
export function FlyerWall({ left = 41, top = -199 }: { left?: number; top?: number }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute flex gap-2.5"
      style={{ left, top, width: 392, transform: "rotate(8deg)", transformOrigin: "0 0" }}
    >
      {COLUMNS.map((col, i) => (
        <div key={i} className={`flex w-[124px] flex-col gap-2.5 ${col.dir === "up" ? "flyer-drift-up" : "flyer-drift-down"}`}>
          {[...col.hashes, ...col.hashes].map((h, j) => (
            <div key={j} className="relative h-[156px] w-[124px] shrink-0 overflow-hidden rounded-[14px] bg-[#23364A]">
              <Image src={img(h)} alt="" fill sizes="124px" className="object-cover" priority={j < 3} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

interface AuthScreenProps {
  /** Height of the bottom fade (Figma `Fade`): 620 on AM02, 468 on AM04 / AM05. */
  fadeHeight: number;
  /** Space between the panel and the bottom edge: 28 on AM02, 40 on AM04 / AM05. */
  panelBottom: number;
  showLogo?: boolean;
  backHref?: string;
  wall?: { left: number; top: number };
  children: React.ReactNode;
}

/**
 * Shared shell for the dark sign in screens (AM02, AM04, AM05), 390 wide.
 * Layers bottom to top: #172B3A, flyer wall, top fade (130, 90% to 0), bottom fade (0 to solid by 28%),
 * then the logo or back button and the panel pinned to the bottom.
 */
export function AuthScreen({ fadeHeight, panelBottom, showLogo, backHref, wall, children }: AuthScreenProps) {
  return (
    <div className="min-h-[100dvh] w-full bg-[#172B3A]">
      <div className="relative mx-auto h-[100dvh] min-h-[680px] w-full max-w-[390px] overflow-hidden bg-[#172B3A]">
        <FlyerWall {...wall} />
        <div
          className="absolute inset-x-0 top-0 h-[130px]"
          style={{ background: "linear-gradient(180deg, rgba(23,43,58,0.9) 0%, rgba(23,43,58,0) 100%)" }}
        />
        <div
          className="absolute inset-x-0 bottom-0"
          style={{ height: fadeHeight, background: "linear-gradient(180deg, rgba(23,43,58,0) 0%, #172B3A 28%)" }}
        />

        {showLogo && (
          <Link href="/" aria-label="Xiventa home" className="absolute left-6 top-[58px]">
            <XiventaWordmark width={110} height={25} wordColor="#FFFFFF" emblemColor="#FFFFFF" />
          </Link>
        )}
        {backHref && (
          <Link
            href={backHref}
            aria-label="Back"
            className="absolute left-4 top-[54px] flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.72] text-[#172B3A]"
          >
            <ArrowLeftIcon size={20} />
          </Link>
        )}

        <div className="absolute inset-x-0 flex flex-col gap-2.5 px-6" style={{ bottom: panelBottom }}>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ---- Panel building blocks ---- */

export function AuthTitle({ children, size = 30 }: { children: React.ReactNode; size?: 30 | 26 }) {
  return (
    <h1
      className="font-bold tracking-[-0.02em] text-white"
      style={{ fontSize: size, lineHeight: size === 30 ? "36px" : "32px" }}
    >
      {children}
    </h1>
  );
}

export function AuthNote({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-[12px] leading-[14px] text-[#B4BFCA] ${className}`}>{children}</p>;
}

export function AuthField({
  label,
  focused,
  ...input
}: { label: string; focused?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] leading-4 text-white">{label}</span>
      <input
        {...input}
        className={`h-12 w-full rounded-[8px] bg-white px-4 text-[14px] leading-5 text-[#172B3A] placeholder:text-[#68788A] focus:outline-none ${
          focused ? "border-2 border-[#E22765]" : "border border-[#D5DCE3] focus:border-2 focus:border-[#E22765]"
        }`}
      />
    </label>
  );
}

export function PrimaryButton({ children, disabled, type = "submit", onClick }: { children: React.ReactNode; disabled?: boolean; type?: "submit" | "button"; onClick?: () => void }) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="flex h-[52px] w-full items-center justify-center rounded-[12px] bg-[#E22765] px-5 text-[16px] leading-5 tracking-[-0.01em] text-white hover:bg-[#C81E57] disabled:opacity-60"
    >
      {children}
    </button>
  );
}
