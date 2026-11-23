import type { Metadata, Viewport } from "next";
import { Arimo } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";
import { InstallToast } from "@/components/pwa/InstallToast";
import { InstallSheet } from "@/components/pwa/InstallSheet";
import { GetAppDialog } from "@/components/pwa/GetAppDialog";
import { CookieNotice } from "@/components/site/SitePages";
import { EARLY_INSTALL_SCRIPT } from "@/lib/pwa";

const arimo = Arimo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arimo",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#E22765",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: {
    default: "Xiventa · Events, Tickets and Places",
    template: "%s · Xiventa",
  },
  description: "Discover curated events, buy verified tickets, and explore places worth the trip.",
  manifest: "/manifest.json",
  applicationName: "Xiventa",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Xiventa",
  },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${arimo.variable} antialiased`} suppressHydrationWarning>
      <head>
        {/* Catch the browser's install prompt before React loads (see lib/pwa.ts). */}
        <script dangerouslySetInnerHTML={{ __html: EARLY_INSTALL_SCRIPT }} />
      </head>
      <body
        className="min-h-screen flex flex-col font-sans bg-background text-foreground"
        suppressHydrationWarning
      >
        {children}
        <ServiceWorkerRegister />
        <Suspense fallback={null}>
          <InstallToast />
        </Suspense>
        <InstallSheet />
        <GetAppDialog />
        <Suspense fallback={null}>
          <CookieNotice />
        </Suspense>
      </body>
    </html>
  );
}

