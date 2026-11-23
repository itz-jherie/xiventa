"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { img } from "@/data";
import { OnboardingShell, primaryBtnClass } from "@/components/auth/Onboarding";
import { updateSession } from "@/lib/session";

/* Radar pins: position inside the 320 x 320 radar and flyer art, from Figma. */
const PINS: [number, number, string][] = [
  [40, 60, "c33706bb"],
  [230, 40, "5b0bbfce"],
  [250, 200, "dcd2cb3c"],
  [30, 210, "3432dc22"],
  [150, 10, "610df935"],
  [130, 250, "39ef03ef"],
];

/**
 * AM07 See what's on near you, 1:1 with Figma node 820:56316.
 * Rule 13: our own screen first, then the system prompt for While using the app only.
 * Static for now: Allow location does not ask the browser; it sets the area to the Island and moves on.
 */
export default function LocationPage() {
  const router = useRouter();

  const allow = () => {
    updateSession({ side: "Island" });
    router.push("/interests");
  };

  return (
    <OnboardingShell backHref="/name" step={1}>
      <div className="pt-[116px]">
      <div className="relative mx-auto h-80 w-80" aria-hidden="true">
        <span className="absolute inset-0 rounded-full border border-[#E22765]/[0.07]" />
        <span className="absolute left-[45px] top-[45px] h-[230px] w-[230px] rounded-full border border-[#E22765]/[0.12]" />
        <span className="absolute left-[90px] top-[90px] h-[140px] w-[140px] rounded-full border border-[#E22765]/20" />
        <span className="absolute left-[149px] top-[149px] h-[22px] w-[22px] rounded-full border-4 border-white bg-[#E22765]" />
        {PINS.map(([x, y, h]) => (
          <span
            key={h}
            className="absolute h-[52px] w-[52px] overflow-hidden rounded-full border-[3px] border-white shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
            style={{ left: x, top: y }}
          >
            <Image src={img(h)} alt="" fill sizes="52px" className="object-cover" />
          </span>
        ))}
      </div>
      </div>

      <div className="mt-[34px] flex flex-col gap-3 px-6">
        <h1 className="text-[30px] font-bold leading-9 tracking-[-0.02em] text-[#172B3A]">See what&apos;s on near you</h1>
        <p className="text-[16px] leading-6 text-[#4D5E70]">
          We use your location to show events and places close to you, and how far they are. Only while you&apos;re using the app. Hosts never see it.
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 bg-white px-6 pb-7 pt-3">
        <button type="button" onClick={allow} className={primaryBtnClass}>
          Allow location
        </button>
        <button
          type="button"
          onClick={() => router.push("/side-of-lagos")}
          className="flex h-[52px] w-full items-center justify-center rounded-[12px] px-5 text-[16px] leading-5 tracking-[-0.01em] text-[#C81E57]"
        >
          Not now, I&rsquo;ll pick my area
        </button>
      </div>
    </OnboardingShell>
  );
}
