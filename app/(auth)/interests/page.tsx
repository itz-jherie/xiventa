"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { img } from "@/data";
import { CheckIcon, MapPinIcon } from "@/components/icons";
import { OnboardingShell, primaryBtnClass } from "@/components/auth/Onboarding";
import { updateSession, useSession } from "@/lib/session";

const INTERESTS: [string, string][] = [
  ["Nightlife", "9f2029fa"],
  ["Music", "bf806b66"],
  ["Food & Drink", "39ef03ef"],
  ["Tech & Business", "c6118754"],
  ["Outdoors", "9007b949"],
  ["Arts & Culture", "56eda086"],
  ["Sports", "9abb12ec"],
  ["Family & Kids", "b06c6167"],
];

/**
 * AM09 What are you into, 1:1 with Figma node 820:54725.
 * Interests are private (rule 13). Home shows up to 3 interest rows in the order picked (rule 13, decision 44).
 * Skip goes to Home with no interests yet.
 */
export default function InterestsPage() {
  const router = useRouter();
  const session = useSession();
  const [picked, setPicked] = useState<string[]>(["Nightlife", "Music", "Food & Drink"]);
  const area = session?.side === "Island" ? "Victoria Island, Island" : "Yaba, Mainland";

  const toggle = (name: string) =>
    setPicked((p) => (p.includes(name) ? p.filter((x) => x !== name) : [...p, name]));

  const finish = (interests: string[]) => {
    updateSession({ interests });
    router.push("/m");
  };

  return (
    <OnboardingShell backHref="/side-of-lagos" step={2} skip={{ onClick: () => finish([]) }}>
      <div className="flex flex-col gap-3 px-6 pb-[120px] pt-28">
        <button
          type="button"
          onClick={() => router.push("/side-of-lagos")}
          className="flex h-8 w-fit items-center gap-2 rounded-full bg-[#FDEEF3] py-2 pl-3 pr-3.5 text-[13px] font-bold text-[#C81E57]"
        >
          <MapPinIcon size={16} className="text-[#C81E57]" />
          You&rsquo;re in {area} · Change
        </button>
        <h1 className="text-[30px] font-bold leading-9 tracking-[-0.02em] text-[#172B3A]">What are you into?</h1>
        <p className="text-[16px] leading-6 text-[#4D5E70]">Pick a few and we&apos;ll fill Home with them. Only you see this.</p>

        <div className="grid grid-cols-2 gap-2.5">
          {INTERESTS.map(([name, hash]) => {
            const on = picked.includes(name);
            return (
              <button
                key={name}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(name)}
                className="relative h-24 overflow-hidden rounded-[18px] text-left"
              >
                <Image src={img(hash)} alt="" fill sizes="166px" className="object-cover" />
                <span className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.05) 20%, rgba(13,20,31,0.8) 100%)" }} />
                <span className="absolute bottom-[13px] left-3 text-[15px] font-bold leading-[17px] text-white">{name}</span>
                {on && <span className="absolute inset-0 rounded-[18px] border-[3px] border-[#E22765]" />}
                {on && (
                  <span className="absolute right-[18px] top-2 flex h-6 w-[14px] items-center justify-center rounded-[12px] bg-[#E22765] text-white">
                    <CheckIcon size={14} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 mx-auto w-full max-w-[390px] border-t border-[#E9EDF1] bg-white px-4 pb-7 pt-3">
        <button type="button" onClick={() => finish(picked)} className={primaryBtnClass}>
          {picked.length ? `Show me Lagos (${picked.length})` : "Show me Lagos"}
        </button>
      </div>
    </OnboardingShell>
  );
}
