"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, MapPinIcon, CheckIcon } from "@/components/icons";

export default function SideOfLagosPage() {
  const router = useRouter();
  const [selectedSide, setSelectedSide] = useState<"Island" | "Mainland" | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const handleSelectSide = (side: "Island" | "Mainland") => {
    setSelectedSide(side);
    try {
      sessionStorage.setItem("xiventa_user_side", side);
      sessionStorage.setItem(
        "xiventa_user_neighborhood",
        side === "Island" ? "Victoria Island" : "Yaba"
      );
    } catch {
      // safe fallback
    }
    setTimeout(() => {
      router.push("/m");
    }, 300);
  };

  const handleUseLocation = () => {
    setIsLocating(true);
    setTimeout(() => {
      try {
        sessionStorage.setItem("xiventa_user_side", "Island");
        sessionStorage.setItem("xiventa_user_neighborhood", "Victoria Island");
      } catch {
        // safe fallback
      }
      router.push("/m");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start sm:justify-center p-4">
      {/* Mobile Frame Container (390px x 844px) */}
      <div className="w-full max-w-[390px] min-h-[640px] flex flex-col justify-between py-6 px-4">
        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/name"
              className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-[#172B3A] hover:bg-slate-100 transition"
              aria-label="Go back"
            >
              <ArrowLeftIcon size={20} />
            </Link>
            <span className="text-[14px] font-semibold text-[#172B3A]">9:41</span>
            <Link
              href="/m"
              className="text-[14px] font-semibold text-[#68788A] hover:text-[#172B3A] transition"
            >
              Skip
            </Link>
          </div>

          {/* Heading */}
          <div className="space-y-2 mb-8">
            <h1 className="text-[30px] font-bold text-[#172B3A] tracking-tight leading-tight">
              Which side of Lagos are you on?
            </h1>
            <p className="text-[15px] text-[#68788A] leading-relaxed">
              We&apos;ll show what&apos;s close first. Switch any time.
            </p>
          </div>

          {/* Side Options (Island vs Mainland) */}
          <div className="space-y-4 mb-8">
            {/* Island Card */}
            <button
              type="button"
              onClick={() => handleSelectSide("Island")}
              className={`w-full p-6 text-left rounded-2xl border-2 transition-all relative ${
                selectedSide === "Island"
                  ? "border-[#E22765] bg-[#FFF1F5] shadow-md shadow-[#E22765]/10"
                  : "border-[#B4BFCA]/50 bg-white hover:border-[#172B3A] hover:shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-[24px] font-bold text-[#172B3A] mb-1">Island</h2>
                  <p className="text-[14px] text-[#68788A]">
                    Victoria Island, Ikoyi, Lekki, Ajah
                  </p>
                </div>
                {selectedSide === "Island" && (
                  <div className="w-7 h-7 rounded-full bg-[#E22765] flex items-center justify-center text-white">
                    <CheckIcon size={16} />
                  </div>
                )}
              </div>
            </button>

            {/* Mainland Card */}
            <button
              type="button"
              onClick={() => handleSelectSide("Mainland")}
              className={`w-full p-6 text-left rounded-2xl border-2 transition-all relative ${
                selectedSide === "Mainland"
                  ? "border-[#E22765] bg-[#FFF1F5] shadow-md shadow-[#E22765]/10"
                  : "border-[#B4BFCA]/50 bg-white hover:border-[#172B3A] hover:shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-[24px] font-bold text-[#172B3A] mb-1">Mainland</h2>
                  <p className="text-[14px] text-[#68788A]">
                    Yaba, Ikeja, Surulere, Maryland
                  </p>
                </div>
                {selectedSide === "Mainland" && (
                  <div className="w-7 h-7 rounded-full bg-[#E22765] flex items-center justify-center text-white">
                    <CheckIcon size={16} />
                  </div>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Bottom Action: Use my location */}
        <div className="pt-6">
          <button
            type="button"
            onClick={handleUseLocation}
            disabled={isLocating}
            className="w-full h-12 rounded-xl border border-[#B4BFCA] hover:border-[#172B3A] bg-white text-[#172B3A] font-semibold text-[15px] transition flex items-center justify-center gap-2 active:scale-98"
          >
            {isLocating ? (
              <>
                <span className="w-4 h-4 border-2 border-[#172B3A] border-t-transparent rounded-full animate-spin" />
                <span>Finding location...</span>
              </>
            ) : (
              <>
                <MapPinIcon size={18} className="text-[#E22765]" />
                <span>Use my location</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

