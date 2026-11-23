"use client";

import { useState } from "react";
import { NavigationIcon, SearchIcon } from "@/components/icons";
import { Sheet, sheetPrimary } from "@/components/shared/Sheet";
import { updateSession, useSession } from "@/lib/session";

const AREAS = {
  Island: ["Victoria Island", "Ikoyi", "Lekki", "Lagos Island", "Ajah"],
  Mainland: ["Yaba", "Ikeja", "Surulere", "Maryland", "Gbagada"],
};

function Radio({ on }: { on: boolean }) {
  return <span className={`h-5 w-5 shrink-0 rounded-full ${on ? "border-[6px] border-[#E22765]" : "border-[1.5px] border-[#B4BFCA]"}`} />;
}

/**
 * PW19 City picker (310:17239, Abuja alert on 1069:67793): search, Use my location, cities (Abuja
 * coming soon with an alert), side of Lagos chips and areas. Saves the side to the session.
 */
export function CityPicker({ open, onClose, toast }: { open: boolean; onClose: () => void; toast?: (m: string) => void }) {
  const session = useSession();
  const [picked, setSide] = useState<"All of Lagos" | "Island" | "Mainland" | null>(null);
  const side = picked ?? session?.side ?? "All of Lagos";
  const [area, setArea] = useState<string>("all");
  const [abuja, setAbuja] = useState(false);
  const [q, setQ] = useState("");
  const areas = side === "All of Lagos" ? [] : AREAS[side].filter((a) => a.toLowerCase().includes(q.toLowerCase()));
  const label = "text-[11px] uppercase leading-4 tracking-[0.04em] text-[#68788A]";
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Choose your city"
      footer={
        <button
          type="button"
          onClick={() => {
            if (side !== "All of Lagos") updateSession({ side });
            onClose();
            toast?.(`Showing ${area !== "all" ? area : side === "All of Lagos" ? "all of Lagos" : `the ${side}`}`);
          }}
          className={sheetPrimary}
        >
          Done
        </button>
      }
    >
      <div className="flex flex-col gap-4">
        <label className="flex h-12 items-center gap-2 rounded-full border border-[#E9EDF1] bg-[#F4F6F8] px-4 focus-within:border-[#E22765]">
          <SearchIcon size={20} className="text-[#68788A]" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search an area" className="w-full bg-transparent text-[14px] text-[#172B3A] placeholder:text-[#68788A] focus:outline-none" />
        </label>
        <button type="button" onClick={() => toast?.("Location access comes with the app")} className="flex h-11 items-center justify-center gap-2 rounded-[12px] border border-[#B4BFCA] text-[14px] text-[#172B3A]">
          <NavigationIcon size={20} />
          Use my location
        </button>
        <span className={label}>Cities</span>
        <div className="-mt-2 flex flex-col">
          <div className="flex h-[72px] items-center gap-3 px-1">
            <span className="flex flex-1 flex-col gap-0.5">
              <span className="text-[13px] text-[#172B3A]">Lagos</span>
              <span className="text-[12px] text-[#4D5E70]">Live now</span>
            </span>
            <Radio on />
          </div>
          <button type="button" onClick={() => setAbuja((v) => !v)} className="flex h-[72px] items-center gap-3 px-1 text-left">
            <span className="flex flex-1 flex-col gap-0.5">
              <span className="text-[13px] text-[#172B3A]">Abuja</span>
              <span className={`text-[12px] ${abuja ? "text-[#067647]" : "text-[#4D5E70]"}`}>{abuja ? "Alert on. We'll tell you when Abuja opens" : "Coming soon. Get told when it opens"}</span>
            </span>
            <Radio on={false} />
          </button>
        </div>
        <span className={label}>Your side of Lagos</span>
        <div className="-mt-2 flex gap-2">
          {(["All of Lagos", "Island", "Mainland"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setSide(s);
                setArea("all");
              }}
              className={`flex h-8 items-center rounded-full px-4 text-[13px] ${side === s ? "bg-[#E22765] text-white" : "border border-[#B4BFCA] text-[#4D5E70]"}`}
            >
              {s}
            </button>
          ))}
        </div>
        {side !== "All of Lagos" && (
          <>
            <span className={label}>Areas on the {side}</span>
            <div className="-mt-2 flex flex-col">
              {["all", ...areas].map((a) => (
                <button key={a} type="button" onClick={() => setArea(a)} className="flex h-[60px] items-center gap-3 px-1 text-left">
                  <span className="flex-1 text-[13px] text-[#172B3A]">{a === "all" ? `All of the ${side}` : a}</span>
                  <Radio on={area === a} />
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </Sheet>
  );
}
