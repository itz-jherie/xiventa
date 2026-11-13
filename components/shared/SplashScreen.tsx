"use client";

import { useEffect, useState } from "react";
import { XiventaLogo } from "@/components/icons";

interface SplashScreenProps {
  onFinish?: () => void;
  minDuration?: number; // Duration in ms
  persistent?: boolean; // When true, doesn't auto-dismiss (for preview / inspection)
}

/**
 * AM01 Launch Splash Screen
 * 1:1 match with Figma frame `286:10829` ("AM01 Launch")
 *
 * - Canvas Background: Solid Brand Pink (#E22765 / brand-500)
 * - Brand Mark + Wordmark: Native 155x163 white vector logo perfectly centered
 */
function getSessionItem(key: string): string | null {
  try {
    return typeof window !== "undefined" ? sessionStorage.getItem(key) : null;
  } catch {
    return null;
  }
}

function setSessionItem(key: string, value: string): void {
  try {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(key, value);
    }
  } catch {}
}

export function SplashScreen({
  onFinish,
  minDuration = 2000,
  persistent = false,
}: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (persistent) return;

    // Check if the user already saw the splash screen in this browser session
    const hasSeenSplash = getSessionItem("xiventa_splash_seen");
    if (hasSeenSplash) {
      setIsVisible(false);
      onFinish?.();
      return;
    }

    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, Math.max(minDuration - 400, 300));

    const finishTimer = setTimeout(() => {
      setIsVisible(false);
      setSessionItem("xiventa_splash_seen", "true");
      onFinish?.();
    }, minDuration);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [minDuration, onFinish, persistent]);

  const handleDismiss = () => {
    if (isFading) return;
    setIsFading(true);
    setTimeout(() => {
      setIsVisible(false);
      setSessionItem("xiventa_splash_seen", "true");
      onFinish?.();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Xiventa launch screen"
      onClick={persistent ? undefined : handleDismiss}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-brand-500 text-white select-none transition-opacity duration-500 ease-out cursor-pointer ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Centered Native Xiventa Logo (155px x 163px exactly as defined in Figma AM01) */}
      <div className="flex flex-col items-center justify-center transform transition-transform duration-700 ease-out animate-in fade-in zoom-in-95">
        <XiventaLogo
          width={155}
          height={163}
          className="text-white"
        />
      </div>

      {/* Persistent preview indicator for development only */}
      {persistent && (
        <div className="absolute bottom-16 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-[11px] font-semibold text-white tracking-wide">
          AM01 Launch · Persistent Mode
        </div>
      )}
    </div>
  );
}
