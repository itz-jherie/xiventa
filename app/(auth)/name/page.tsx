"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, UserIcon } from "@/components/icons";

export default function YourNamePage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Derive initials dynamically
  const initials = fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() || "")
    .join("") || "YO";

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;
    setIsSubmitting(true);
    // Save to session storage for dynamic personalization
    try {
      sessionStorage.setItem("xiventa_user_name", fullName.trim());
      sessionStorage.setItem("xiventa_user_initials", initials);
    } catch {
      // safe fallback
    }
    setTimeout(() => {
      router.push("/side-of-lagos");
    }, 300);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start sm:justify-center p-4">
      {/* Mobile Frame Container (390px x 844px) */}
      <div className="w-full max-w-[390px] min-h-[640px] flex flex-col justify-between py-6 px-4">
        {/* Top & Form */}
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/code"
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
            <h1 className="text-[28px] font-bold text-[#172B3A] tracking-tight leading-tight">
              What should we call you?
            </h1>
            <p className="text-[13px] text-[#68788A] leading-relaxed">
              Shows on your tickets and guest lists.
            </p>
          </div>

          {/* Dynamic Avatar & Input Form */}
          <form onSubmit={handleContinue} className="space-y-6">
            {/* Live Avatar Preview */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <div className="w-14 h-14 rounded-full bg-[#FFF1F5] border-2 border-[#E22765] flex items-center justify-center text-[#E22765] font-bold text-[18px] transition-transform active:scale-95">
                {fullName.trim() ? initials : <UserIcon size={24} className="text-[#E22765]" />}
              </div>
              <div>
                <p className="text-[14px] font-semibold text-[#172B3A]">
                  {fullName.trim() || "Your profile"}
                </p>
                <p className="text-[12px] text-[#68788A]">
                  {fullName.trim() ? "Looking good!" : "Type your name below"}
                </p>
              </div>
            </div>

            {/* Field: Your name */}
            <div className="space-y-1.5">
              <label htmlFor="fullName" className="block text-[13px] font-semibold text-[#172B3A]">
                Your name
              </label>
              <div className="flex items-center h-12 bg-white rounded-xl px-3.5 border border-[#B4BFCA] focus-within:border-[#E22765] focus-within:ring-4 focus-within:ring-[#E22765]/15 transition">
                <input
                  id="fullName"
                  type="text"
                  autoFocus
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ada Okafor"
                  className="w-full bg-transparent text-[15px] text-[#172B3A] placeholder:text-slate-400 focus:outline-none font-medium"
                  required
                />
              </div>
            </div>

            {/* Primary Action */}
            <button
              type="submit"
              disabled={!fullName.trim() || isSubmitting}
              className="w-full h-12 rounded-xl bg-[#E22765] hover:bg-[#C81E57] disabled:opacity-50 text-white font-bold text-[15px] transition shadow-md shadow-[#E22765]/20 active:scale-98 flex items-center justify-center"
            >
              {isSubmitting ? "Saving..." : "Continue"}
            </button>
          </form>
        </div>

        {/* Footer legal */}
        <div className="pt-6 border-t border-slate-100">
          <p className="text-[12px] text-center text-[#68788A] leading-relaxed">
            By continuing you accept the{" "}
            <Link href="/terms" className="underline hover:text-[#172B3A]">
              Terms
            </Link>{" "}
            and the{" "}
            <Link href="/privacy" className="underline hover:text-[#172B3A]">
              Privacy policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
