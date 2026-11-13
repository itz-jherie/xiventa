import Link from "next/link";
import { XiventaLogo } from "@/components/icons";

/**
 * Web Footer
 * 1:1 match with Figma component `Web Footer` in `PW01 Home` (Node `310:16350`)
 *
 * Background: Dark Navy (#172B3A)
 * Container: 1200px max width centered
 */
export function WebFooter() {
  return (
    <footer className="w-full bg-[#172b3a] text-white pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Top 4 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-10 border-b border-white/10">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-block" aria-label="Xiventa home">
              <XiventaLogo width={140} height={32} className="text-white" />
            </Link>
            <p className="text-[14px] leading-relaxed text-[#b4bfca] max-w-xs">
              Find what is on in Lagos tonight, this weekend and beyond.
            </p>
          </div>

          {/* Column 1: Discover */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-[#b4bfca] uppercase tracking-wider">
              Discover
            </h4>
            <ul className="space-y-2 text-[14px]">
              <li>
                <Link href="/events" className="text-white hover:text-brand-300 transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/places" className="text-white hover:text-brand-300 transition-colors">
                  Places
                </Link>
              </li>
              <li>
                <Link href="/spotlight" className="text-white hover:text-brand-300 transition-colors">
                  Spotlight
                </Link>
              </li>
              <li>
                <Link href="/collections" className="text-white hover:text-brand-300 transition-colors">
                  Collections
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Host */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-[#b4bfca] uppercase tracking-wider">
              Host
            </h4>
            <ul className="space-y-2 text-[14px]">
              <li>
                <Link href="/organizers" className="text-white hover:text-brand-300 transition-colors">
                  For organizers
                </Link>
              </li>
              <li>
                <Link href="/places/new" className="text-white hover:text-brand-300 transition-colors">
                  List your place
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-white hover:text-brand-300 transition-colors">
                  Host dashboard
                </Link>
              </li>
              <li>
                <Link href="/help/host" className="text-white hover:text-brand-300 transition-colors">
                  Host help
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Xiventa */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-[#b4bfca] uppercase tracking-wider">
              Xiventa
            </h4>
            <ul className="space-y-2 text-[14px]">
              <li>
                <Link href="/about" className="text-white hover:text-brand-300 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-white hover:text-brand-300 transition-colors">
                  Help centre
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-white hover:text-brand-300 transition-colors">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-white hover:text-brand-300 transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/refunds" className="text-white hover:text-brand-300 transition-colors">
                  Refund policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-white hover:text-brand-300 transition-colors">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-[#b4bfca]">
            © 2026 Xiventa. Made in Lagos.
          </p>

          <Link
            href="/splash"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-semibold text-[13px] shadow-sm transition active:scale-95"
          >
            Get the app
          </Link>
        </div>
      </div>
    </footer>
  );
}
