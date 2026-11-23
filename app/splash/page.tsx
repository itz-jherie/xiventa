"use client";

import { useState } from "react";
import Link from "next/link";
import { SplashScreen } from "@/components/shared/SplashScreen";

export default function SplashPreviewPage() {
  const [key, setKey] = useState(0);
  const [persistent, setPersistent] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  return (
    <div className="relative min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
      {/* Exact AM01 Launch Splash Screen (auto-dismisses in 2s or tap to dismiss) */}
      <SplashScreen
        key={key}
        persistent={persistent}
        minDuration={2000}
        onFinish={() => {
          setIsDismissed(true);
        }}
      />

      {/* Post-splash landing state */}
      {isDismissed && (
        <div className="max-w-md w-full px-6 py-12 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-500">
          <div className="w-16 h-16 rounded-2xl bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-2xl mb-4 border border-brand-500/30">
            AM
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white mb-2">
            AM01 Launch Complete
          </h1>
          <p className="text-sm text-slate-400 mb-8 max-w-xs">
            In Figma, AM01 Launch transitions directly into AM02 Welcome and sign in.
          </p>

          <div className="flex flex-col w-full gap-3">
            <button
              onClick={() => {
                try {
                  sessionStorage.removeItem("xiventa_splash_seen");
                } catch {}
                setIsDismissed(false);
                setKey((k) => k + 1);
              }}
              className="w-full py-3 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 font-semibold text-sm transition shadow-lg shadow-brand-500/25"
            >
              Replay Splash Screen
            </button>
            <Link
              href="/"
              className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-medium text-sm transition border border-white/10"
            >
              Go to Home Screen
            </Link>
          </div>
        </div>
      )}

      {/* Floating dev dock */}
      <div className="fixed bottom-6 z-[110] bg-slate-950/90 backdrop-blur-md border border-white/15 px-4 py-2 rounded-full shadow-2xl flex items-center gap-3 text-xs text-white max-w-[90vw] overflow-hidden">
        <span className="font-semibold text-brand-400 whitespace-nowrap">AM01:</span>
        <button
          onClick={() => {
            try {
              sessionStorage.removeItem("xiventa_splash_seen");
            } catch {}
            setIsDismissed(false);
            setKey((k) => k + 1);
          }}
          className="px-3 py-1 rounded-full bg-white text-brand-600 font-bold hover:bg-slate-100 transition shadow-sm whitespace-nowrap"
        >
          Replay
        </button>
        <button
          onClick={() => {
            setPersistent(!persistent);
            setIsDismissed(false);
            setKey((k) => k + 1);
          }}
          className={`px-3 py-1 rounded-full border transition whitespace-nowrap ${
            persistent
              ? "bg-white/20 border-white/40 text-white font-semibold"
              : "border-white/20 text-white/70"
          }`}
        >
          {persistent ? "Mode: Freeze" : "Mode: Auto-close (2s)"}
        </button>
      </div>
    </div>
  );
}
