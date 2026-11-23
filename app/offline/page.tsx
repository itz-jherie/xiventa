import Link from "next/link";
import { WifiOffIcon } from "@/components/icons";

export const metadata = { title: "Offline" };

/**
 * Shown by the service worker when a page that was never saved is opened without a connection
 * (rule 22: icon, plain title, one line, Try again).
 */
export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-[100dvh] w-full max-w-[390px] flex-col items-center justify-center gap-3 px-6 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF6DD] text-[#8F5200]">
        <WifiOffIcon size={28} />
      </span>
      <h1 className="text-[20px] font-bold leading-[26px] tracking-[-0.02em] text-[#172B3A]">You&apos;re offline</h1>
      <p className="text-[14px] leading-5 text-[#4D5E70]">This page isn&apos;t saved on this phone yet. Your tickets still work in My events.</p>
      <div className="mt-2 flex w-full flex-col gap-2">
        <a href="" className="flex h-[52px] items-center justify-center rounded-[12px] bg-[#E22765] text-[16px] leading-5 text-white">
          Try again
        </a>
        <Link href="/m" className="flex h-11 items-center justify-center rounded-[12px] text-[14px] leading-[18px] text-[#C81E57]">
          Go to Home
        </Link>
      </div>
    </main>
  );
}
