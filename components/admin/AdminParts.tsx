"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { CalendarIcon, GridIcon, ImageIcon, InfoIcon, LogOutIcon, MapPinIcon, SettingsIcon, ShieldCheckIcon, TicketIcon, TrendUpIcon, UsersIcon, WalletIcon } from "@/components/icons";
import { XiventaWordmark } from "@/components/icons/XiventaWordmark";
import { adminSignOut, useAdmin } from "@/lib/admin";
import { LinkTabs } from "@/components/dashboard/DashParts";

const NAV = [
  { label: "Dashboard", href: "/admin", Icon: GridIcon, root: "/admin$" },
  { label: "Users", href: "/admin/users", Icon: UsersIcon, root: "/admin/users" },
  { label: "Organizers", href: "/admin/organizers", Icon: ShieldCheckIcon, root: "/admin/organizers" },
  { label: "Events", href: "/admin/events", Icon: CalendarIcon, root: "/admin/events" },
  { label: "Places", href: "/admin/places", Icon: MapPinIcon, root: "/admin/places" },
  { label: "Tickets and orders", href: "/admin/orders", Icon: TicketIcon, root: "/admin/orders" },
  { label: "Finance", href: "/admin/finance", Icon: WalletIcon, root: "/admin/finance" },
  { label: "Content", href: "/admin/content", Icon: ImageIcon, root: "/admin/content" },
  { label: "Support", href: "/admin/support", Icon: InfoIcon, root: "/admin/support" },
  { label: "Analytics", href: "/admin/analytics", Icon: TrendUpIcon, root: "/admin/analytics" },
  { label: "Settings", href: "/admin/settings", Icon: SettingsIcon, root: "/admin/settings" },
];

const subscribeMq = (cb: () => void) => {
  const mq = window.matchMedia("(max-width: 767px)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/** AW sidebar (Admin label, 11 sections, staff name and role) and main column. Staff only; desktop only. */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const admin = useAdmin();
  const phone = useSyncExternalStore(subscribeMq, () => window.matchMedia("(max-width: 767px)").matches, () => false);
  const out = admin !== undefined && !admin.signedIn;

  useEffect(() => {
    if (out) router.replace(`/admin/signin?next=${encodeURIComponent(pathname)}`);
  }, [out, pathname, router]);

  if (admin === undefined || out) return <div className="min-h-screen bg-[#F4F6F8]" />;
  if (phone)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#172B3A] px-8 text-center text-white">
        <XiventaWordmark width={120} height={28} />
        <p className="text-[16px] font-bold">The admin works on a computer</p>
        <p className="text-[14px] text-[#B4BFCA]">Open this page on a laptop or desktop to review queues and records.</p>
      </div>
    );

  const initials = admin.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2);
  return (
    <div className="flex min-h-screen w-full bg-[#F4F6F8] text-[#172B3A]">
      <aside className="sticky top-0 flex h-screen w-[248px] shrink-0 flex-col gap-1 border-r border-[#E9EDF1] bg-white p-4">
        <div className="flex h-10 items-center gap-2 pb-4 pl-3">
          <Link href="/admin" aria-label="Xiventa admin home">
            <XiventaWordmark width={104} height={24} />
          </Link>
          <span className="pt-1 text-[11px] text-[#68788A]">Admin</span>
        </div>
        {NAV.map(({ label, href, Icon, root }) => {
          const on = new RegExp(`^${root}`).test(pathname);
          return (
            <Link key={label} href={href} className={`flex h-10 items-center gap-3 rounded-[8px] px-3 text-[14px] leading-[18px] ${on ? "bg-[#FDEEF3] text-[#C81E57]" : "text-[#4D5E70] hover:bg-[#F4F6F8]"}`}>
              <Icon size={20} />
              {label}
            </Link>
          );
        })}
        <div className="flex-1" />
        <div className="flex items-center gap-3 border-t border-[#E9EDF1] pt-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F1EEFF] text-[10px] text-[#5B3FD6]">{initials}</span>
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="truncate text-[13px] leading-4 text-[#172B3A]">{admin.name}</span>
            <span className="truncate text-[12px] leading-4 text-[#68788A]">{admin.role}</span>
          </span>
          <button
            type="button"
            aria-label="Sign out"
            onClick={() => {
              adminSignOut();
              router.replace("/admin/signin");
            }}
            className="text-[#4D5E70]"
          >
            <LogOutIcon size={18} />
          </button>
        </div>
      </aside>
      <main className="flex min-w-0 flex-1 flex-col gap-6 px-10 pb-12 pt-8">{children}</main>
    </div>
  );
}

export const FINANCE_TABS: [string, string][] = [
  ["Payments", "/admin/finance"],
  ["Refunds", "/admin/finance/refunds"],
  ["Settlements", "/admin/finance/settlements"],
  ["Exceptions", "/admin/finance/exceptions"],
];
export const CONTENT_TABS: [string, string][] = [
  ["Categories", "/admin/content"],
  ["Collections", "/admin/content/collections"],
  ["Cities and areas", "/admin/content/cities"],
  ["Spotlight queue", "/admin/content/spotlight"],
  ["Listing review", "/admin/content/listings"],
  ["Place claims", "/admin/content/place-claims"],
  ["Suggestions", "/admin/content/suggestions"],
  ["Photos", "/admin/content/photos"],
  ["Reviews", "/admin/content/reviews"],
  ["Venue declines", "/admin/content/venue-declines"],
];
export const SUPPORT_TABS: [string, string][] = [
  ["Cases", "/admin/support"],
  ["Reports and appeals", "/admin/support/reports"],
  ["Fraud review", "/admin/support/fraud"],
];
export const SETTINGS_TABS: [string, string][] = [
  ["Staff roles", "/admin/settings"],
  ["Platform configuration", "/admin/settings/config"],
  ["Audit log", "/admin/settings/audit"],
  ["Risk rules", "/admin/settings/risk"],
  ["Platforms", "/admin/settings/platforms"],
];

export function SectionHead({ title, sub, tabs, active, actions }: { title: string; sub?: string; tabs: [string, string][]; active: string; actions?: React.ReactNode }) {
  return (
    <>
      <div className="flex items-end gap-6">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <h1 className="text-[28px] font-bold leading-[34px] tracking-[-0.02em]">{title}</h1>
          {sub && <p className="text-[14px] leading-5 text-[#4D5E70]">{sub}</p>}
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
      <LinkTabs items={tabs} active={active} />
    </>
  );
}

/** Label / value rows inside a detail card. */
export function Rows({ rows }: { rows: [string, React.ReactNode][] }) {
  return (
    <div className="flex flex-col">
      {rows.map(([k, v]) => (
        <div key={k} className="flex min-h-12 items-center justify-between gap-4 border-b border-[#E9EDF1] py-2 last:border-0">
          <span className="text-[14px] text-[#172B3A]">{k}</span>
          <span className="text-right text-[13px] text-[#4D5E70]">{v}</span>
        </div>
      ))}
    </div>
  );
}
