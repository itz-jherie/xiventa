"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { addRecent, getRecent, search } from "@/lib/search";
import { SearchIcon } from "@/components/icons";
import { XiventaWordmark } from "@/components/icons/XiventaWordmark";
import { GetAppButton } from "@/components/pwa/GetAppButton";
import { initialsOf, useSession } from "@/lib/session";

interface TopNavProps {
  onSearch?: (query: string) => void;
}

const NAV_LINKS = [
  { label: "Events", href: "/events" },
  { label: "Places", href: "/places" },
  { label: "Spotlight", href: "/spotlight" },
];

/**
 * Top Nav (Web), 1:1 with the Figma instance on PW01 / PW02 / PW03 / PW06.
 * Full width, 72 high, 40 px side padding, space-between: Left (logo + links, gap 40),
 * 400 x 44 search, Right (Sign in ghost + Get the app primary, gap 12). 1 px #E9EDF1 bottom border.
 */
export function TopNav({ onSearch }: TopNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const suggestions = useMemo(() => (focused && query.trim().length > 1 ? search(query) : null), [focused, query]);
  const recent = focused && query.trim().length > 1 ? getRecent().filter((r) => r.toLowerCase().includes(query.trim().toLowerCase().slice(0, 3))).slice(0, 2) : [];
  const open = (href: string) => {
    setFocused(false);
    router.push(href);
  };
  const session = useSession();
  const signedIn = session?.status === "signed-in";

  const isActive = (href: string) =>
    pathname.startsWith(href) || (href === "/events" && pathname === "/");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setFocused(false);
    if (onSearch) onSearch(query);
    else if (query.trim()) {
      addRecent(query.trim());
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 h-[72px] w-full border-b border-[#E9EDF1] bg-white">
      <div className="flex h-full items-center justify-between px-4 md:px-10">
        <div className="flex items-center gap-10">
          <Link href="/" aria-label="Xiventa home" className="flex">
            <XiventaWordmark />
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[14px] leading-[18px] transition-colors ${
                  isActive(link.href) ? "text-[#172B3A]" : "text-[#4D5E70] hover:text-[#172B3A]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <form
          onSubmit={submit}
          role="search"
          className="relative hidden h-11 w-[400px] items-center gap-2 rounded-full border border-[#E9EDF1] bg-[#F4F6F8] pl-4 pr-1.5 focus-within:border-[#E22765] lg:flex"
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocused(false);
          }}
        >
          <SearchIcon size={20} className="shrink-0 text-[#68788A]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events, places and hosts"
            aria-label="Search events, places and hosts"
            className="h-5 w-full bg-transparent text-[14px] leading-5 text-[#172B3A] placeholder:text-[#68788A] focus:outline-none"
          />
          {suggestions && (
            /* PW36 Search suggestions: 560 wide, radius 16, Recent / Events / Places / Hosts, See all */
            <div className="absolute left-1/2 top-[52px] z-50 flex w-[560px] -translate-x-1/2 flex-col rounded-2xl bg-white p-3 shadow-[0_12px_32px_rgba(23,43,58,0.16)]">
              {[
                { title: "Recent", rows: recent.map((r) => ({ label: r, meta: "", href: `/search?q=${encodeURIComponent(r)}` })) },
                { title: "Events", rows: suggestions.events.slice(0, 2).map((e) => ({ label: e.title, meta: `${e.dateLabel.split(",")[0]} · ${e.neighborhood}`, href: `/events/${e.slug}` })) },
                { title: "Places", rows: suggestions.places.slice(0, 2).map((p) => ({ label: p.name, meta: p.metaLabel, href: `/places/${p.slug}` })) },
                { title: "Hosts", rows: suggestions.hosts.slice(0, 2).map((h) => ({ label: h.name, meta: h.verified ? "Verified organizer" : "Host", href: `/hosts/${h.slug}` })) },
              ]
                .filter((g) => g.rows.length)
                .map((g) => (
                  <div key={g.title} className="flex flex-col">
                    <span className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase leading-4 tracking-[0.04em] text-[#4D5E70]">{g.title}</span>
                    {g.rows.map((row) => (
                      <button
                        key={row.href}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => open(row.href)}
                        className="flex h-[38px] items-center gap-2 rounded-[8px] px-3 text-left hover:bg-[#F4F6F8]"
                      >
                        <span className="text-[14px] text-[#172B3A]">{row.label}</span>
                        {row.meta && <span className="truncate text-[13px] text-[#4D5E70]">{row.meta}</span>}
                      </button>
                    ))}
                  </div>
                ))}
              <div className="mt-1 border-t border-[#E9EDF1] pt-1">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    addRecent(query.trim());
                    open(`/search?q=${encodeURIComponent(query.trim())}`);
                  }}
                  className="flex h-10 w-full items-center rounded-[8px] px-3 text-left text-[14px] text-[#C81E57] hover:bg-[#FDEEF3]"
                >
                  See all results for &quot;{query.trim()}&quot;
                </button>
              </div>
            </div>
          )}
        </form>

        <div className="flex items-center gap-3">
          {signedIn ? (
            <>
              {/* PW01 Home / Signed in: My events ghost button + 40 px avatar */}
              <Link href="/my-events" className="flex h-11 items-center rounded-[12px] px-4 text-[14px] leading-[18px] text-[#C81E57] hover:bg-[#FDEEF3]">
                My events
              </Link>
              {/* PW15 Account */}
              <Link
                href="/account"
                aria-label="Account (sign out for testing)"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F1EEFF] text-[13px] leading-4 text-[#5B3FD6]"
              >
                {initialsOf(session?.name)}
              </Link>
            </>
          ) : (
            <Link href="/welcome" className="flex h-11 items-center rounded-[12px] px-4 text-[14px] leading-[18px] text-[#C81E57] hover:bg-[#FDEEF3]">
              Sign in
            </Link>
          )}
          {!signedIn && <GetAppButton navCta className="flex h-11 items-center rounded-[12px] bg-[#E22765] px-4 text-[14px] leading-[18px] text-white hover:bg-[#C81E57]" />}
        </div>
      </div>
    </header>
  );
}

