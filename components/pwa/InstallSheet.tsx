"use client";

import Image from "next/image";
import { CloseIcon, MoreIcon, PlusIcon, ShareIcon } from "@/components/icons";
import { closeInstallSheet, useInstall } from "@/lib/pwa";

const STEPS = {
  ios: [
    { icon: <ShareIcon size={18} />, text: "Tap Share in the browser bar" },
    { icon: <PlusIcon size={18} />, text: "Scroll down and tap Add to Home Screen" },
    { icon: null, text: "Tap Add. Xiventa appears on your home screen" },
  ],
  android: [
    { icon: <MoreIcon size={18} />, text: "Tap the menu (⋮) in the browser" },
    { icon: <PlusIcon size={18} />, text: "Tap Install app or Add to Home screen" },
    { icon: null, text: "Tap Install. Xiventa appears on your home screen" },
  ],
  desktop: [
    { icon: <PlusIcon size={18} />, text: "Click the install icon at the right of the address bar" },
    { icon: <MoreIcon size={18} />, text: "Or open the browser menu and choose Install Xiventa" },
    { icon: null, text: "Xiventa opens in its own window" },
  ],
};

/**
 * "Add Xiventa to your home screen" bottom sheet (sheets open from the bottom, handoff section 1).
 * Shown when one tap install isn't available: iPhone (Safari never offers it to websites),
 * browsers without an install prompt, or before the browser has offered one.
 */
export function InstallSheet() {
  const { sheetOpen, platform, secure } = useInstall();
  if (!sheetOpen) return null;
  const steps = STEPS[platform];

  return (
    <div className="fixed inset-0 z-[110]" role="dialog" aria-modal="true" aria-label="Add Xiventa to your home screen">
      <button type="button" aria-label="Close" onClick={closeInstallSheet} className="absolute inset-0 bg-[#0E1C27]/50" />
      <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-[430px] rounded-t-3xl bg-white px-6 pb-[calc(28px+env(safe-area-inset-bottom))] pt-3">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#D5DCE3]" />
        <div className="flex items-start gap-3">
          <Image src="/icons/icon-192.png" alt="" width={48} height={48} className="shrink-0 rounded-[12px]" />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <h2 className="text-[20px] font-bold leading-[26px] tracking-[-0.02em] text-[#172B3A]">Add Xiventa to your home screen</h2>
            <p className="text-[14px] leading-5 text-[#4D5E70]">Open it like an app, keep tickets on your phone and use them offline.</p>
          </div>
          <button type="button" onClick={closeInstallSheet} aria-label="Close" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F4F6F8] text-[#172B3A]">
            <CloseIcon size={18} />
          </button>
        </div>

        <ol className="mt-5 flex flex-col gap-3">
          {steps.map((s, i) => (
            <li key={i} className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FDEEF3] text-[13px] leading-4 text-[#C81E57]">
                {s.icon ?? i + 1}
              </span>
              <span className="text-[14px] leading-5 text-[#172B3A]">{s.text}</span>
            </li>
          ))}
        </ol>

        {!secure && (
          <p className="mt-4 rounded-[12px] bg-[#FFF6DD] px-4 py-3 text-[12px] leading-4 text-[#8F5200]">
            This page is on a plain http address, so the browser won&apos;t install it. Open the https version of the site to install.
          </p>
        )}

        <button
          type="button"
          onClick={closeInstallSheet}
          className="mt-5 flex h-[52px] w-full items-center justify-center rounded-[12px] bg-[#E22765] text-[16px] leading-5 tracking-[-0.01em] text-white"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
