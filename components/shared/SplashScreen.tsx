"use client";

import { useEffect, useState } from "react";
import { TicketIcon } from "@/components/icons";

interface SplashScreenProps {
  onFinish?: () => void;
  minDuration?: number; // Duration in ms
  persistent?: boolean; // When true, doesn't auto-dismiss (great for preview/testing)
}

export function SplashScreen({
  onFinish,
  minDuration = 2200,
  persistent = false,
}: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    if (persistent) {
      setProgress(100);
      return;
    }

    // Check if the user already saw the splash screen in this browser session
    const hasSeenSplash = sessionStorage.getItem("xiventa_splash_seen");
    if (hasSeenSplash) {
      setIsVisible(false);
      onFinish?.();
      return;
    }

    // Progress bar animation increments
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 20 + 10);
      });
    }, 250);

    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, minDuration - 400);

    const finishTimer = setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem("xiventa_splash_seen", "true");
      onFinish?.();
    }, minDuration);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [minDuration, onFinish, persistent]);

  const handleDismiss = () => {
    setIsFading(true);
    setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem("xiventa_splash_seen", "true");
      onFinish?.();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Xiventa splash screen"
      className={`fixed inset-0 z-[100] flex flex-col justify-between items-center px-6 py-10 sm:py-14 select-none overflow-hidden transition-all duration-500 ease-out ${
        isFading ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
      style={{
        background:
          "radial-gradient(120% 80% at 50% 20%, #5E0023 0%, #3D0016 45%, #1F000B 85%, #0E1C27 100%)",
      }}
    >
      {/* Decorative ambient glow orbs */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-brand-500/20 blur-[90px] pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-80 h-80 rounded-full bg-magenta-500/15 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-96 h-40 rounded-full bg-wine-700/30 blur-[80px] pointer-events-none" />

      {/* Top subtle controls */}
      <header className="w-full max-w-md flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[11px] font-semibold tracking-wider uppercase text-white/60">
            Lagos · Live
          </span>
        </div>

        {!persistent && (
          <button
            onClick={handleDismiss}
            className="text-xs font-medium text-white/70 hover:text-white transition px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10"
          >
            Skip
          </button>
        )}
      </header>

      {/* Center Brand Identity (Hero moment) */}
      <div className="flex flex-col items-center text-center relative z-10 max-w-sm px-4">
        {/* Logo Sticker Container with Halo */}
        <div className="relative mb-7">
          {/* Animated pulsing glow halo */}
          <div className="absolute -inset-4 rounded-[32px] bg-gradient-to-tr from-brand-500/40 via-magenta-500/30 to-brand-600/40 blur-xl animate-pulse" />

          {/* Hard offset shadow brand sticker badge */}
          <div
            className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-brand-500 border-[3px] border-white flex items-center justify-center transform transition-transform duration-500 hover:rotate-3 hover:scale-105"
            style={{
              boxShadow: "4px 4px 0px 0px #0E1C27, 8px 8px 24px 0px rgba(0, 0, 0, 0.4)",
            }}
          >
            <TicketIcon size={52} className="text-white drop-shadow-sm" />
          </div>
        </div>

        {/* Wordmark */}
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tightest text-white mb-3">
          Xiventa
        </h1>

        {/* Tagline adhering strictly to Figma writing principle (no dashes) */}
        <p className="text-sm sm:text-base font-medium text-white/85 leading-relaxed">
          Events, tickets and places worth the trip
        </p>

        {/* Subtle pill badge */}
        <div className="mt-5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-semibold text-white/80 backdrop-blur-md">
          <span className="text-brand-300">✦</span>
          <span>Instant Offline Tickets</span>
          <span className="text-white/40">·</span>
          <span>Verified Venues</span>
        </div>
      </div>

      {/* Bottom loading & progress section */}
      <footer className="w-full max-w-xs flex flex-col items-center relative z-10">
        {/* Progress bar */}
        <div className="w-40 h-1.5 bg-white/15 rounded-full overflow-hidden mb-3.5 backdrop-blur-sm p-[1px]">
          <div
            className="h-full bg-gradient-to-r from-brand-500 to-magenta-400 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        <p className="text-[11px] font-medium text-white/60 text-center tracking-wide">
          Ready for venue doors across Nigeria
        </p>

        {persistent && (
          <p className="mt-3 text-[10px] text-white/40 uppercase tracking-wider font-semibold">
            Preview Mode · Persistent
          </p>
        )}
      </footer>
    </div>
  );
}
