"use client";

import { useRouter } from "next/navigation";
import { openGetApp, requestInstall } from "@/lib/pwa";

interface GetAppButtonProps {
  className?: string;
  children?: React.ReactNode;
  /** Top Nav only: picks up the colour guard in globals.css. */
  navCta?: boolean;
}

/**
 * Every "Get the app" button. On desktop it opens PW30 (QR code for your phone). On phones it installs the app (system install dialog where the browser offers it,
 * otherwise the add to home screen sheet). When already running as the installed app it opens Home.
 */
export function GetAppButton({ className = "", children = "Get the app", navCta = false }: GetAppButtonProps) {
  const router = useRouter();
  return (
    <button
      type="button"
      data-nav-cta={navCta ? "get-the-app" : undefined}
      className={className}
      onClick={async () => {
        // Desktop: PW30 Get the app (QR code for your phone). Phones: install straight away.
        if (window.innerWidth >= 768 && !window.matchMedia("(display-mode: standalone)").matches) return openGetApp();
        const result = await requestInstall();
        if (result === "standalone") router.push("/m");
      }}
    >
      {children}
    </button>
  );
}
