"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TopNav } from "@/components/web/TopNav";
import { WebFooter } from "@/components/web/WebFooter";
import { ArrowLeftIcon, BellIcon, ShieldCheckIcon, UserIcon } from "@/components/icons";

const TicketSm = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M3.333 5.833C3.333 4.913 4.08 4.167 5 4.167H15C15.92 4.167 16.666 4.913 16.666 5.833V7.917C15.516 7.917 14.583 8.85 14.583 10C14.583 11.15 15.516 12.083 16.666 12.083V14.167C16.666 15.087 15.92 15.833 15 15.833H5C4.08 15.833 3.333 15.087 3.333 14.167V12.083C4.484 12.083 5.416 11.15 5.416 10C5.416 8.85 4.484 7.917 3.333 7.917V5.833Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    <path d="M12.083 5V6.25M12.083 9.375V10.625M12.083 13.75V15" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
);
const PinSm = ({ on }: { on: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      fill={on ? "#E22765" : "#68788A"}
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 1.5C7.3 1.5 3.5 5.2 3.5 9.9C3.5 15.9 10.5 22 11.2 22.6C11.42 22.797 11.705 22.906 12 22.906C12.295 22.906 12.58 22.797 12.8 22.6C13.5 22 20.5 15.9 20.5 9.9C20.5 5.2 16.7 1.5 12 1.5ZM12 12.8C10.4 12.8 9.1 11.5 9.1 9.9C9.1 8.3 10.4 7 12 7C13.6 7 14.9 8.3 14.9 9.9C14.9 11.5 13.6 12.8 12 12.8Z"
    />
  </svg>
);

/**
 * Signed-in web pages (PW16 My events, PW22 My places): Top Nav, Main padding 40 / 120 / 96,
 * 280 px sidebar of 40 px items (radius 8, gap 4, active #FDEEF3 / #C81E57), 48 px gap, content.
 */
/** `bare` drops the sidebar (PW17 Ticket uses the full content width). */
export function AccountShell({ children, bare = false }: { children: React.ReactNode; bare?: boolean }) {
  const pathname = usePathname();
  const items = [
    { label: "Account", href: "/account", icon: <UserIcon size={20} /> },
    { label: "My events", href: "/my-events", icon: <TicketSm /> },
    { label: "My places", href: "/my-places", icon: <PinSm on={pathname.startsWith("/my-places")} /> },
    { label: "Notifications", href: "/notifications", icon: <BellIcon size={20} /> },
    { label: "Privacy", href: "/account/privacy", icon: <ShieldCheckIcon size={20} /> },
    { label: "Host dashboard", href: "/dashboard", icon: <UserIcon size={20} /> },
    { label: "Sign out", href: "/signout", icon: <ArrowLeftIcon size={20} /> },
  ];
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <TopNav />
      <main className="mx-auto flex w-full max-w-[1440px] flex-1 gap-12 px-6 pb-24 pt-10 lg:px-[120px]">
        {!bare && <nav aria-label="Account" className="hidden w-[280px] shrink-0 flex-col gap-1 lg:flex">
          {items.map((it) => {
            // Account owns /account/* except Privacy, which has its own item; Notification settings sit under Notifications.
            const on =
              it.href === "/account"
                ? pathname === "/account" || (pathname.startsWith("/account/") && !pathname.startsWith("/account/privacy") && !pathname.startsWith("/account/notifications") && !pathname.startsWith("/account/personalisation") && !pathname.startsWith("/account/delete") && !pathname.startsWith("/account/quiet-hours"))
                : it.href === "/notifications"
                  ? pathname === "/notifications" || pathname.startsWith("/account/notifications") || pathname.startsWith("/account/quiet-hours")
                  : it.href === "/account/privacy"
                    ? ["/account/privacy", "/account/personalisation", "/account/delete"].some((x) => pathname.startsWith(x))
                    : it.href !== "/signout" && pathname.startsWith(it.href);
            return (
              <Link
                key={it.label}
                href={it.href}
                className={`flex h-10 items-center gap-3 rounded-[8px] px-3 text-[14px] leading-[18px] ${
                  on ? "bg-[#FDEEF3] text-[#C81E57]" : "text-[#4D5E70] hover:bg-[#F4F6F8]"
                }`}
              >
                <span className={`flex h-5 w-5 items-center justify-center ${on ? "text-[#E22765]" : "text-[#68788A]"}`}>{it.icon}</span>
                {it.label}
              </Link>
            );
          })}
        </nav>}
        <div className="flex min-w-0 flex-1 flex-col gap-6">{children}</div>
      </main>
      <WebFooter />
    </div>
  );
}

/** Figma `Notice Banner` (PW16 / PW17): #E6F1FF, radius 16, 12 / 16 padding, info icon, 13 / 12 copy. */
export function NoticeBanner({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-[#E6F1FF] px-4 py-3">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="shrink-0">
        <circle cx="10" cy="10" r="7.5" stroke="#0059BE" strokeWidth="1.5" />
        <path d="M10 9V13.5M10 6.5V6.6" stroke="#0059BE" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
      <div className="flex flex-col gap-0.5">
        <p className="text-[13px] leading-4 text-[#172B3A]">{title}</p>
        <p className="text-[12px] leading-4 text-[#4D5E70]">{body}</p>
      </div>
    </div>
  );
}

