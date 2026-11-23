import Link from "next/link";
import { XiventaWordmark } from "@/components/icons/XiventaWordmark";
import { GetAppButton } from "@/components/pwa/GetAppButton";

const COLUMNS = [
  {
    title: "Discover",
    links: [
      { label: "Events", href: "/events" },
      { label: "Places", href: "/places" },
      { label: "Spotlight", href: "/spotlight" },
      { label: "Collections", href: "/collections/best-of-this-weekend" },
    ],
  },
  {
    title: "Host",
    links: [
      { label: "For organizers", href: "/organizers" },
      { label: "List your place", href: "/organizers#list-your-place" },
      { label: "Host dashboard", href: "/dashboard" },
      { label: "Host help", href: "/help/host" },
    ],
  },
  {
    title: "Xiventa",
    links: [
      { label: "About", href: "/about" },
      { label: "Help centre", href: "/help" },
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
      { label: "Refund policy", href: "/refunds" },
      { label: "Cookies", href: "/cookies" },
    ],
  },
];

/**
 * Web Footer, 1:1 with the Figma `Web Footer` instance (1440 x 389).
 * #172B3A, padding 56 / 120 / 32, gap 40. Top row: brand (fills) + three link columns, gap 80.
 * Bottom row: 1 px border/inverse top line, padding-top 24, copyright + small Get the app button.
 */
export function WebFooter() {
  return (
    <footer className="w-full bg-[#172B3A]">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-4 pb-8 pt-14 md:px-[clamp(40px,calc((100%-1200px)/2),120px)]">
        <div className="flex flex-col gap-10 md:flex-row md:gap-20">
          <div className="flex flex-1 flex-col gap-4">
            <Link href="/" aria-label="Xiventa home" className="flex">
              <XiventaWordmark width={140} height={32} wordColor="#FFFFFF" emblemColor="#FFFFFF" />
            </Link>
            <p className="max-w-[280px] text-[14px] leading-5 text-[#B4BFCA]">
              Find what is on in Lagos tonight, this weekend and beyond.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title} className="flex flex-col gap-3">
              <h4 className="text-[10px] uppercase leading-3 tracking-[0.04em] text-[#B4BFCA]">{col.title}</h4>
              {col.links.map((l) => (
                <Link key={l.label} href={l.href} className="whitespace-nowrap text-[14px] leading-5 text-white hover:text-[#F6A9C3]">
                  {l.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="flex items-start justify-between gap-4 border-t border-white pt-6">
          <p className="text-[12px] leading-4 text-[#B4BFCA]">© 2026 Xiventa. Made in Lagos.</p>
          <GetAppButton className="inline-flex h-8 items-center rounded-[8px] bg-[#E22765] px-3 text-[13px] leading-4 text-white hover:bg-[#C81E57]" />
        </div>
      </div>
    </footer>
  );
}

