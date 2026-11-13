"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { XiventaLogo, PhoneIcon } from "@/components/icons";
import { getAllEvents } from "@/data";

/**
 * AM02 Welcome and sign in
 * 1:1 match with Figma screen `AM02 Welcome and sign in` (Node `820:54669`)
 *
 * - Canvas: 390px x 844px mobile viewport (centered in desktop view)
 * - Dynamic flyer wall moving background from event store
 * - Nigerian +234 phone number input with "We'll send your tickets here."
 * - Primary Action "Continue"
 * - Social logins: Google & Apple
 * - "Just looking" guest mode linking directly to discover feed
 */
export default function WelcomeSignInPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const events = getAllEvents();

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;
    setIsSubmitting(true);
    // Dynamic mock OTP flow
    setTimeout(() => {
      const cleanPhone = phoneNumber.trim().replace(/^0+/, "");
      router.push(`/code?phone=${encodeURIComponent(cleanPhone ? `0${cleanPhone}` : "0803 000 0000")}`);
    }, 400);
  };

  return (
    <div className="relative min-h-screen bg-black flex flex-col items-center justify-center overflow-hidden selection:bg-brand-500 selection:text-white">
      {/* 1. Dynamic Flyer Wall Background (3 vertical staggered columns) */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-30 select-none pointer-events-none scale-105">
        <div className="grid grid-cols-3 gap-3 h-[130%] -mt-10">
          {/* Column 1 (Scrolls up) */}
          <div className="flex flex-col gap-3 animate-infinite-scroll">
            {events.concat(events).map((evt, idx) => (
              <div key={`col1-${idx}`} className="relative h-44 rounded-xl overflow-hidden bg-slate-800">
                <Image src={evt.imageUrl} alt={evt.title} fill sizes="140px" className="object-cover" />
              </div>
            ))}
          </div>

          {/* Column 2 (Offset / Reverse) */}
          <div className="flex flex-col gap-3 -mt-12 animate-infinite-scroll">
            {events.slice().reverse().concat(events).map((evt, idx) => (
              <div key={`col2-${idx}`} className="relative h-48 rounded-xl overflow-hidden bg-slate-800">
                <Image src={evt.imageUrl} alt={evt.title} fill sizes="140px" className="object-cover" />
              </div>
            ))}
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-3 -mt-6 animate-infinite-scroll">
            {events.concat(events).map((evt, idx) => (
              <div key={`col3-${idx}`} className="relative h-40 rounded-xl overflow-hidden bg-slate-800">
                <Image src={evt.imageUrl} alt={evt.title} fill sizes="140px" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dark gradient overlay & fades */}
      <div className="absolute inset-0 z-1 bg-gradient-to-t from-black via-black/85 to-black/60" />

      {/* 2. Main Mobile Frame (390px x 844px) */}
      <div className="relative z-10 w-full max-w-[390px] min-h-screen sm:min-h-[844px] flex flex-col justify-between p-6 py-8">
        {/* Top: Xiventa Logo */}
        <div className="pt-6 flex justify-center">
          <Link href="/" aria-label="Xiventa home">
            <XiventaLogo width={120} height={28} className="text-white" />
          </Link>
        </div>

        {/* Bottom Card: Sign In form */}
        <div className="space-y-6 pb-4">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-[26px] font-extrabold text-white tracking-tight leading-tight">
              What&apos;s on in Lagos tonight?
            </h1>
            <p className="text-[13px] text-[#b4bfca] leading-relaxed">
              Find the plan for tonight, this weekend or whenever.
            </p>
          </div>

          {/* Phone Form */}
          <form onSubmit={handleContinue} className="space-y-3">
            <div className="space-y-1.5">
              <label htmlFor="phone" className="block text-[12px] font-semibold text-white">
                Phone number
              </label>

              <div className="flex items-center h-12 bg-white rounded-xl px-3 border border-slate-200 focus-within:ring-2 focus-within:ring-brand-500 shadow-sm transition">
                <span className="flex items-center gap-1.5 text-sm font-semibold text-[#172b3a] pr-2.5 border-r border-slate-200">
                  <PhoneIcon size={16} className="text-slate-400" />
                  <span>+234</span>
                </span>
                <input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="801 234 5678"
                  className="w-full pl-3 bg-transparent text-[14px] text-[#172b3a] placeholder:text-slate-400 focus:outline-none font-medium"
                  required
                />
              </div>

              <p className="text-[11px] text-[#b4bfca]">We&apos;ll send your tickets here.</p>
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-70 text-white font-bold text-[14px] transition shadow-lg shadow-brand-500/25 active:scale-98 flex items-center justify-center"
            >
              {isSubmitting ? "Sending verification..." : "Continue"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-white/15" />
            <span className="text-[12px] text-white/50 uppercase font-medium">or</span>
            <div className="flex-1 h-px bg-white/15" />
          </div>

          {/* Social Logins */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="w-full h-11 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-medium text-[13px] flex items-center justify-center gap-2 transition"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <button
              type="button"
              onClick={() => router.push("/")}
              className="w-full h-11 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-medium text-[13px] flex items-center justify-center gap-2 transition"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.89c.65-.79 1.09-1.89.97-2.89-.94.04-2.07.63-2.73 1.41-.58.68-1.09 1.78-.95 2.84 1.05.08 2.06-.57 2.71-1.36z" />
              </svg>
              <span>Continue with Apple</span>
            </button>
          </div>

          {/* Alternative links: Email and Guest mode */}
          <div className="flex items-center justify-between text-[12px] pt-1 text-[#b4bfca]">
            <Link href="/login" className="hover:text-white transition">
              Use email instead
            </Link>

            <Link href="/m" className="font-semibold text-brand-400 hover:text-brand-300 transition">
              Just looking →
            </Link>
          </div>

          {/* Legal */}
          <p className="text-[11px] text-center text-white/40 leading-relaxed pt-2">
            By continuing you accept the{" "}
            <Link href="/terms" className="underline hover:text-white/70">
              Terms
            </Link>{" "}
            and the{" "}
            <Link href="/privacy" className="underline hover:text-white/70">
              Privacy policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
