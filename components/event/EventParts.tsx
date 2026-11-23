import Link from "next/link";
import { MapPinIcon, PlusIcon } from "@/components/icons";
import { ticketPathH } from "@/components/shared/ticket";
import type { TicketTier } from "@/data";

/** Ticket Tier (Figma `Ticket Tier`): 334 wide, main 237 + dashed perforation + 96 stub with a pink add button. */
export function TicketTierCard({ tier, height, soldOut = false }: { tier: TicketTier; height: number; soldOut?: boolean }) {
  const w = 334;
  const nx = 237.5;
  return (
    <div className="relative" style={{ width: w, height }}>
      <div className={`flex h-full ${soldOut ? "bg-[#F4F6F8]" : "bg-[#FDFFF0]"}`} style={{ clipPath: `path('${ticketPathH(w, height, nx)}')` }}>
        <div className="flex w-[237px] flex-col gap-1 p-4">
          <span className="text-[10px] uppercase leading-3 tracking-[0.04em] text-[#4D5E70]">{tier.name}</span>
          <span className={`text-[20px] font-bold leading-[26px] tracking-[-0.02em] ${soldOut ? "text-[#8C99A7]" : "text-[#172B3A]"}`}>{tier.price}</span>
          <span className="text-[12px] leading-4 text-[#4D5E70]">{tier.description}</span>
        </div>
        <div className="flex flex-1 items-center justify-center">
          {soldOut ? (
            <span className="text-[12px] leading-4 text-[#68788A]">Sold out</span>
          ) : (
            <button type="button" aria-label={`Add ${tier.name.toLowerCase()} ticket`} className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E22765] text-white hover:bg-[#C81E57]">
              <PlusIcon size={18} />
            </button>
          )}
        </div>
      </div>
      <svg className="pointer-events-none absolute inset-0" width={w} height={height} viewBox={`0 0 ${w} ${height}`} fill="none" aria-hidden="true">
        <path d={ticketPathH(w, height, nx, 0.5)} stroke="#B4BFCA" />
        <line x1={nx} y1="8" x2={nx} y2={height - 8} stroke="#B4BFCA" strokeDasharray="4 4" />
      </svg>
    </div>
  );
}

type Shape = [number, number, number, number, string, number, number];

/** PW06 `Map Preview` (768 wide) shapes: x, y, w, h, fill, radius, rotation. */
const WEB_SHAPES: Shape[] = [
  [451.9, 95, 549.9, 150.6, "#E6F1FF", 40, -5.6],
  [51.6, 18, 185, 54, "#E0FBF5", 12, 0],
  [537.9, 10, 150.6, 40, "#E0FBF5", 10, 0],
  [-43, 70, 896.8, 14.5, "#FFFFFF", 0, -3.7],
  [322.8, -20, 29.4, 220.2, "#FFFFFF", 0, 6.6],
  [-21.5, 30, 859, 7.1, "#FFFFFF", 0, 1.9],
  [129.1, -10, 15, 183.5, "#FFFFFF", 0, -2.8],
  [602.5, -10, 14.9, 124.1, "#FFFFFF", 0, 3.7],
  [0, 118, 516.2, 7, "#FFFFFF", 0, -0.9],
];
/** AM21 / AM24 `Map Preview` (358 wide) shapes. */
const APP_SHAPES: Shape[] = [
  [181, 95, 260, 140, "#E6F1FF", 40, 0],
  [24, 18, 86, 54, "#E0FBF5", 12, 0],
  [250, 10, 70, 40, "#E0FBF5", 10, 0],
  [-22, 70, 420, 14, "#FFFFFF", 0, 0],
  [150, -23, 14, 200, "#FFFFFF", 0, 0],
  [-10, 2, 400, 7, "#FFFFFF", 0, 0],
  [41, -10, 7, 180, "#FFFFFF", 0, 0],
  [280, -11, 7, 120, "#FFFFFF", 0, 0],
  [0, 118, 240, 7, "#FFFFFF", 0, 0],
];

/** Decorative map preview (Figma `Map Preview`): roads, water and parks drawn as shapes, pink pin, name and Get directions. */
export function MapPreview({ name, address, onDirections, app = false }: { name: string; address: string; onDirections?: () => void; app?: boolean }) {
  const shapes = app ? APP_SHAPES : WEB_SHAPES;
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E9EDF1] bg-white">
      <div className="relative h-[150px] overflow-hidden bg-[#F4F6F8]">
        {shapes.map(([x, y, w, h, fill, r, rot], i) => (
          <div key={i} className="absolute origin-top-left" style={{ left: x, top: y, width: w, height: h, backgroundColor: fill, borderRadius: r, transform: `rotate(${-rot}deg)` }} />
        ))}
        <div
          className="absolute flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-white bg-[#E22765] text-white"
          style={app ? { left: "calc(50% - 18px)", top: 57 } : { left: 366, top: 57 }}
        >
          <MapPinIcon size={18} />
        </div>
      </div>
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-[14px] font-bold leading-5 text-[#172B3A]">{name}</span>
          <span className="truncate text-[12px] leading-4 text-[#4D5E70]">{address}</span>
        </div>
        {onDirections ? (
          <button type="button" onClick={onDirections} className="shrink-0 text-[13px] leading-4 text-[#C81E57]">
            Get directions
          </button>
        ) : (
          <Link href="#directions" className="shrink-0 text-[13px] leading-4 text-[#C81E57]">
            Get directions
          </Link>
        )}
      </div>
    </div>
  );
}

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
