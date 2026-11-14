"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  XiventaLogo,
  SearchIcon,
  FilterIcon,
  UserIcon,
  PhoneIcon,
  ArrowRightIcon,
} from "@/components/icons";

interface TopNavProps {
  onSearch?: (query: string) => void;
}

/**
 * Top Nav (Web)
 * 1:1 exact match with Figma component `Top Nav (Web)` (Node `310:16351`)
 *
 * Dimensions: 1440px canvas wide, 72px high, px-10 (40px)
 * Colors: White background, 1px border-b #E8ECEF (Variable 17:130)
 */
export function TopNav({ onSearch }: TopNavProps) {
  const pathname = usePathname();
  const [query, setQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query);
  };

  const navLinks = [
    { label: "Events", href: "/events" },
    { label: "Places", href: "/places" },
    { label: "For organizers", href: "/organizers" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full h-[72px] bg-white border-b border-[#E9EDF1] transition-colors">
      <div className="max-w-[1200px] h-full mx-auto px-4 sm:px-6 flex items-center justify-between gap-6">
        {/* Left (Node I310:16351;34:285): Logo & Links */}
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center" aria-label="Xiventa home">
            <XiventaLogo width={122} height={28} className="text-[#E22765]" />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[14px] font-medium transition-colors ${
                    isActive
                      ? "text-[#172B3A] font-bold"
                      : "text-[#4D5E70] hover:text-[#172B3A]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Center: Search Field (Node I310:16351;34:304, 400px wide, 44px high, r: 999, bg: #F4F6F8, border: 1px #E8ECEF) */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden lg:flex items-center w-[400px] h-[44px] bg-[#F4F6F8] rounded-full pl-4 pr-1.5 border border-[#E9EDF1] focus-within:ring-2 focus-within:ring-[#E22765]/20 focus-within:bg-white focus-within:border-[#E22765] transition-all"
        >
          <SearchIcon size={20} className="text-[#68788A] shrink-0 mr-2.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events, places or artists"
            className="w-full bg-transparent text-[14px] text-[#172B3A] placeholder:text-[#68788A] focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Filter events"
            className="w-9 h-9 rounded-full bg-[#E22765] text-white flex items-center justify-center hover:bg-[#C81E57] transition shadow-xs shrink-0"
          >
            <FilterIcon size={16} />
          </button>
        </form>

        {/* Right (Node I310:16351;34:314): Sign in & Get the app */}
        <div className="flex items-center gap-3">
          <Link
            href="/welcome"
            className="h-[44px] px-4 rounded-xl flex items-center gap-2 text-[14px] font-medium text-[#C81E57] hover:bg-[#FFF1F5] transition"
          >
            <UserIcon size={16} className="text-[#E22765]" />
            <span>Sign in</span>
          </Link>

          <Link
            href="/m"
            className="h-[44px] px-4 rounded-xl bg-[#E22765] hover:bg-[#C81E57] text-white font-medium text-[14px] flex items-center gap-2 shadow-xs transition active:scale-98"
          >
            <PhoneIcon size={16} />
            <span>Get the app</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
