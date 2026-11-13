"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { XiventaLogo, SearchIcon, FilterIcon } from "@/components/icons";

interface TopNavProps {
  onSearch?: (query: string) => void;
}

/**
 * Top Nav (Web)
 * 1:1 match with Figma component `Top Nav (Web)` in screen `PW01 Home` (Node `310:16351`)
 *
 * Dimensions: 1440px wide, 72px high
 * Colors: White background, subtle border, Brand Pink (#E22765) primary button
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
    { label: "Spotlight", href: "/spotlight" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full h-[72px] bg-white border-b border-slate-100 transition-colors">
      <div className="max-w-[1200px] h-full mx-auto px-4 sm:px-6 flex items-center justify-between gap-6">
        {/* Left: Logo & Navigation Links */}
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center" aria-label="Xiventa home">
            <XiventaLogo width={122} height={28} className="text-brand-500" />
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
                      ? "text-[#172b3a] font-semibold"
                      : "text-[#4d5e70] hover:text-[#172b3a]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Center: Search Field */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden lg:flex items-center w-[400px] h-[44px] bg-[#f4f6f8] rounded-full px-3.5 pl-4 transition-all focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:bg-white focus-within:border focus-within:border-brand-500/30"
        >
          <SearchIcon size={18} className="text-[#68788a] shrink-0 mr-2.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events, places and hosts"
            className="w-full bg-transparent text-[14px] text-[#172b3a] placeholder:text-[#68788a] focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Filter events"
            className="w-9 h-9 rounded-full bg-brand-500 text-white flex items-center justify-center hover:bg-brand-600 transition shadow-sm shrink-0 ml-1"
          >
            <FilterIcon size={16} />
          </button>
        </form>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-[14px] font-semibold text-brand-600 hover:text-brand-700 transition"
          >
            Sign in
          </Link>

          <Link
            href="/splash"
            className="inline-flex items-center justify-center h-[44px] px-5 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-semibold text-[14px] shadow-sm transition hover:shadow active:scale-95"
          >
            Get the app
          </Link>
        </div>
      </div>
    </header>
  );
}
