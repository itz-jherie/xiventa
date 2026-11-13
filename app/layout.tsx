import type { Metadata, Viewport } from "next";
import { Arimo } from "next/font/google";
import "./globals.css";

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
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: {
    default: "Xiventa · Events, Tickets and Places",
    template: "%s · Xiventa",
  },
  description: "Discover curated events, buy verified tickets, and explore places worth the trip.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Xiventa",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-512.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${arimo.variable} antialiased`} suppressHydrationWarning>
      <body
        className="min-h-screen flex flex-col font-sans bg-background text-foreground"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
