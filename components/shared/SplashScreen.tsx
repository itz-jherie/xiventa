"use client";

import { useEffect, useRef, useState } from "react";
import { XiventaLogo } from "@/components/icons";

interface SplashScreenProps {
  onFinish?: () => void;
  /** How long the splash stays before fading (ms). */
  minDuration?: number;
  /** Keep it on screen (design preview). */
  persistent?: boolean;
}

/**
 * AM01 Launch, 1:1 with Figma frame 286:10829: #E22765, white logo 155 x 163 centred
 * (top 340 on an 844 high screen). Fades out over 400 ms, tap to skip.
 */
export function SplashScreen({ onFinish, minDuration = 1600, persistent = false }: SplashScreenProps) {
  const [fading, setFading] = useState(false);
  const [gone, setGone] = useState(false);
  const finished = useRef(false);
  const onFinishRef = useRef(onFinish);
  useEffect(() => {
    onFinishRef.current = onFinish;
  });

  // Fade, then unmount and hand over once (timer or tap, whichever comes first).
  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    setFading(true);
    setTimeout(() => {
      setGone(true);
      onFinishRef.current?.();
    }, 400);
  };

  useEffect(() => {
    if (persistent) return;
    const t = setTimeout(finish, Math.max(minDuration - 400, 200));
    return () => clearTimeout(t);
  }, [minDuration, persistent]);

  if (gone) return null;

  return (
    <div
      role="dialog"
      aria-label="Xiventa"
      onClick={persistent ? undefined : finish}
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#E22765] transition-opacity duration-[400ms] ease-out ${
        fading ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <XiventaLogo width={155} height={163} className="text-white" />
    </div>
  );
}
