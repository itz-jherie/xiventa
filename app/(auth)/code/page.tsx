"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeftIcon, CheckIcon } from "@/components/icons";

function CodeVerificationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phoneParam = searchParams.get("phone") || "0803 000 0000";

  // 4-digit OTP state
  const [digits, setDigits] = useState<string[]>(["", "", "", ""]);
  const [secondsLeft, setSecondsLeft] = useState(42);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsLeft]);

  // Handle digit typing & auto-advance
  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const char = value.slice(-1);
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);

    if (char && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // If 4 digits entered, auto-verify
    if (char && index === 3 && newDigits.every((d) => d !== "")) {
      triggerVerification();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const triggerVerification = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/name");
      }, 500);
    }, 600);
  };

  const formattedTimer = `0:${secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}`;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start sm:justify-center p-4">
      {/* Mobile Frame Container (390px x 844px) */}
      <div className="w-full max-w-[390px] min-h-[640px] flex flex-col justify-between py-6 px-4">
        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/welcome"
              className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-[#172B3A] hover:bg-slate-100 transition"
              aria-label="Go back"
            >
              <ArrowLeftIcon size={20} />
            </Link>
            <span className="text-[14px] font-semibold text-[#172B3A]">9:41</span>
            <div className="w-8" />
          </div>

          {/* Heading */}
          <div className="space-y-2 mb-8">
            <h1 className="text-[30px] font-bold text-[#172B3A] tracking-tight leading-tight">
              Check your texts
            </h1>
            <p className="text-[13px] text-[#68788A] leading-relaxed">
              We sent a 4 digit code to{" "}
              <span className="font-semibold text-[#172B3A]">{phoneParam}</span>. It
              fills in by itself when it arrives.
            </p>
          </div>

          {/* OTP Digit Boxes */}
          <div className="flex items-center justify-between gap-3 mb-8">
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                disabled={isVerifying || isSuccess}
                className={`w-[70px] h-[72px] text-center text-[28px] font-bold rounded-2xl border transition-all outline-none ${
                  digit
                    ? "border-[#E22765] bg-[#FFF1F5] text-[#172B3A]"
                    : "border-[#B4BFCA] bg-[#F8FAFC] text-[#172B3A] focus:border-[#E22765] focus:bg-white focus:ring-4 focus:ring-[#E22765]/15"
                }`}
              />
            ))}
          </div>

          {/* Resend & Change Number Row */}
          <div className="flex items-center justify-between text-[14px]">
            {secondsLeft > 0 ? (
              <span className="text-[#68788A]">Resend in {formattedTimer}</span>
            ) : (
              <button
                type="button"
                onClick={() => setSecondsLeft(45)}
                className="font-semibold text-[#E22765] hover:text-[#C81E57] transition"
              >
                Resend code
              </button>
            )}

            <Link
              href="/welcome"
              className="text-[#E22765] font-semibold hover:text-[#C81E57] transition"
            >
              Wrong number?
            </Link>
          </div>

          {/* Status feedback */}
          {isVerifying && (
            <div className="mt-6 flex items-center justify-center gap-2 text-[13px] text-[#68788A]">
              <span className="w-4 h-4 border-2 border-[#E22765] border-t-transparent rounded-full animate-spin" />
              <span>Verifying code...</span>
            </div>
          )}

          {isSuccess && (
            <div className="mt-6 flex items-center justify-center gap-2 text-[13px] text-emerald-600 font-semibold">
              <CheckIcon size={16} />
              <span>Verified! Continuing...</span>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="pt-8 border-t border-slate-100">
          <p className="text-[13px] text-center text-[#68788A] leading-relaxed">
            Been here before? You go straight to Home after the code.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CodeVerificationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[#E22765] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CodeVerificationContent />
    </Suspense>
  );
}
