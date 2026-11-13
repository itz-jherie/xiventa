"use client";

import { useState } from "react";
import Link from "next/link";
import { SplashScreen } from "@/components/shared/SplashScreen";

export default function SplashPreviewPage() {
  const [key, setKey] = useState(0);
  const [persistent, setPersistent] = useState(true);

  return (
    <div className="relative min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      {/* Active Splash Screen */}
      <SplashScreen
        key={key}
        persistent={persistent}
        minDuration={2400}
        onFinish={() => {
          console.log("Splash finished transition");
        }}
      />

      {/* Floating control dock for inspecting during development */}
      <div className="fixed bottom-6 z-[110] bg-slate-900/90 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full shadow-2xl flex items-center gap-3 text-xs text-white">
        <span className="font-semibold text-brand-400">Splash Controls:</span>
        <button
          onClick={() => {
            sessionStorage.removeItem("xiventa_splash_seen");
            setKey((k) => k + 1);
          }}
          className="px-3 py-1 rounded-full bg-brand-500 hover:bg-brand-600 font-semibold transition"
        >
          Replay
        </button>
        <button
          onClick={() => setPersistent(!persistent)}
          className={`px-3 py-1 rounded-full border transition ${
            persistent
              ? "bg-white/20 border-white/40 text-white font-semibold"
              : "border-white/20 text-white/70"
          }`}
        >
          {persistent ? "Mode: Persistent" : "Mode: Auto dismiss (2.4s)"}
        </button>
        <Link
          href="/"
          className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white/80 transition"
        >
          Back to Discover
        </Link>
      </div>
    </div>
  );
}
