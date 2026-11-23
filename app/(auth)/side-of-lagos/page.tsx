"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { img } from "@/data";
import { NavigationIcon } from "@/components/icons";
import { OnboardingShell } from "@/components/auth/Onboarding";
import { updateSession } from "@/lib/session";

const SIDES = [
  { side: "Island", areas: "Victoria Island, Ikoyi, Lekki, Ajah", image: img("3432dc22") },
  { side: "Mainland", areas: "Yaba, Ikeja, Surulere, Maryland", image: img("825e4ee3") },
] as const;

/**
 * AM07 Your side of Lagos, 1:1 with Figma node 820:54706 (shown after "Not now, I'll pick my area").
 * Rule 13: store the side, not coordinates. Every choice continues to AM09 What are you into.
 */
export default function SideOfLagosPage() {
  const router = useRouter();

  const choose = (side?: "Island" | "Mainland") => {
    if (side) updateSession({ side });
    router.push("/interests");
  };

  return (
    <OnboardingShell backHref="/location" step={1} skip={{ onClick: () => choose() }}>
      <div className="flex flex-col gap-3.5 px-6 pb-10 pt-[120px]">
        <h1 className="text-[30px] font-bold leading-9 tracking-[-0.02em] text-[#172B3A]">Which side of Lagos are you on?</h1>
        <p className="text-[16px] leading-6 text-[#4D5E70]">We&apos;ll show what&apos;s close first. Switch any time.</p>

        {SIDES.map(({ side, areas, image }) => (
          <button key={side} type="button" onClick={() => choose(side)} className="relative h-[196px] w-full overflow-hidden rounded-3xl text-left">
            <Image src={image} alt="" fill sizes="342px" className="object-cover" />
            <span className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(13,20,31,0.85) 100%)" }} />
            <span className="absolute left-5 top-[124px] text-[24px] font-bold leading-7 text-white">{side}</span>
            <span className="absolute left-5 top-[156px] text-[14px] leading-4 text-white/85">{areas}</span>
          </button>
        ))}

        <button
          type="button"
          onClick={() => choose("Island")}
          className="flex h-[52px] w-full items-center justify-center gap-2 rounded-[12px] border border-[#B4BFCA] bg-white px-5 text-[16px] leading-5 tracking-[-0.01em] text-[#172B3A] hover:border-[#68788A]"
        >
          <NavigationIcon size={20} className="text-[#172B3A]" />
          Use my location
        </button>
      </div>
    </OnboardingShell>
  );
}
