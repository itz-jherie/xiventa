"use client";

import { useSyncExternalStore } from "react";
import { WifiOffIcon } from "@/components/icons";

function subscribe(cb: () => void) {
  window.addEventListener("online", cb);
  window.addEventListener("offline", cb);
  return () => {
    window.removeEventListener("online", cb);
    window.removeEventListener("offline", cb);
  };
}

/**
 * Notice Banner / Tone=Offline (Figma 210:2176), rule 22: shown at the top while offline,
 * saved content keeps showing. #FFF6DD, radius 16, 13 / 16 title, 12 / 16 body, ghost Try again.
 */
export function OfflineBanner({ className = "px-4 pb-3" }: { className?: string }) {
  const online = useSyncExternalStore(subscribe, () => navigator.onLine, () => true);
  if (online) return null;
  return (
    <div className={className} role="status">
      <div className="flex items-center gap-3 rounded-2xl bg-[#FFF6DD] px-4 py-3">
        <WifiOffIcon size={20} className="shrink-0 text-[#8F5200]" />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-[13px] leading-4 text-[#172B3A]">You&apos;re offline</span>
          <span className="text-[12px] leading-4 text-[#4D5E70]">Showing what&apos;s saved on this phone. Tickets still work without data.</span>
        </div>
        <button type="button" onClick={() => location.reload()} className="flex h-8 shrink-0 items-center rounded-[8px] px-3 text-[13px] leading-4 text-[#C81E57]">
          Try again
        </button>
      </div>
    </div>
  );
}
