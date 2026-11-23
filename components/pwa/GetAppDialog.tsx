"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { XiventaWordmark } from "@/components/icons/XiventaWordmark";
import { MoreIcon, PlusIcon, ShareIcon } from "@/components/icons";
import { Sheet } from "@/components/shared/Sheet";
import { closeGetApp, requestInstall, useInstall } from "@/lib/pwa";

const PHONE_STEPS = {
  android: [
    { icon: <MoreIcon size={16} />, text: "Open the link in Chrome and tap the menu (⋮)" },
    { icon: <PlusIcon size={16} />, text: "Tap Install app or Add to Home screen" },
  ],
  ios: [
    { icon: <ShareIcon size={16} />, text: "Open the link in Safari and tap Share" },
    { icon: <PlusIcon size={16} />, text: "Tap Add to Home Screen, then Add" },
  ],
};

/**
 * PW30 Get the app (desktop). A real QR code that opens Xiventa (the app home, /m) on a phone.
 * Xiventa installs from the browser, so Google Play and App Store show the steps for that phone
 * instead of opening a store. "Install on this computer" shows when the browser offers it.
 */
export function GetAppDialog() {
  const { getAppOpen, canPrompt } = useInstall();
  const [svg, setSvg] = useState("");
  const [steps, setSteps] = useState<keyof typeof PHONE_STEPS | null>(null);
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (!getAppOpen) return;
    const link = `${window.location.origin}/m`;
    QRCode.toString(link, { type: "svg", margin: 0, errorCorrectionLevel: "M", color: { dark: "#172B3A", light: "#FFFFFF" } })
      .then((s) => {
        setSvg(s);
        setUrl(link);
      })
      .catch(() => setSvg(""));
  }, [getAppOpen]);

  const close = () => {
    closeGetApp();
    setSteps(null);
  };

  return (
    <Sheet open={getAppOpen} onClose={close} title="Get the Xiventa app">
      <p className="text-[14px] leading-5 text-[#4D5E70]">Scan with your phone camera. Your tickets, saved events and alerts move with you.</p>
      <div className="mx-auto mt-5 flex w-[280px] flex-col items-center gap-3 rounded-2xl border border-[#E9EDF1] px-6 py-6">
        <span className="text-[12px] uppercase leading-4 tracking-[0.04em] text-[#C81E57]">Scan to download</span>
        <div
          role="img"
          aria-label={url ? `QR code for ${url}` : "QR code"}
          className="h-[168px] w-[168px] [&>svg]:h-full [&>svg]:w-full"
          // The SVG comes from the qrcode package, built from our own URL.
          dangerouslySetInnerHTML={{ __html: svg }}
        />
        <span className="pt-2 text-[12px] leading-4 text-[#172B3A]">Xiventa for Lagos</span>
        <span className="text-[12px] leading-4 text-[#4D5E70]">For iPhone and Android</span>
        <XiventaWordmark width={87} height={20} />
      </div>
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          aria-pressed={steps === "android"}
          onClick={() => setSteps(steps === "android" ? null : "android")}
          className="flex h-11 flex-1 items-center justify-center rounded-[12px] bg-[#172B3A] text-[14px] text-white"
        >
          Google Play
        </button>
        <button
          type="button"
          aria-pressed={steps === "ios"}
          onClick={() => setSteps(steps === "ios" ? null : "ios")}
          className="flex h-11 flex-1 items-center justify-center rounded-[12px] bg-[#E22765] text-[14px] text-white hover:bg-[#C81E57]"
        >
          App Store
        </button>
      </div>
      {steps && (
        <div className="mt-3 flex flex-col gap-2 rounded-2xl bg-[#F4F6F8] p-4">
          <p className="text-[13px] leading-4 text-[#172B3A]">{steps === "ios" ? "On iPhone" : "On Android"}, Xiventa installs from the browser:</p>
          {PHONE_STEPS[steps].map((s) => (
            <p key={s.text} className="flex items-center gap-2 text-[12px] leading-4 text-[#4D5E70]">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FDEEF3] text-[#C81E57]">{s.icon}</span>
              {s.text}
            </p>
          ))}
        </div>
      )}
      <div className="flex flex-col items-center pb-2 pt-3">
        {canPrompt && (
          <button
            type="button"
            onClick={async () => {
              await requestInstall();
              close();
            }}
            className="flex h-11 items-center px-4 text-[14px] text-[#172B3A] hover:text-[#C81E57]"
          >
            Install on this computer
          </button>
        )}
        <button type="button" onClick={close} className="flex h-11 items-center px-4 text-[14px] text-[#C81E57]">
          Not now
        </button>
      </div>
    </Sheet>
  );
}
