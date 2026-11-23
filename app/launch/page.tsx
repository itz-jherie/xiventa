"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { SplashScreen } from "@/components/shared/SplashScreen";
import { getSession } from "@/lib/session";

/**
 * PWA start_url (manifest.json). Shows AM01 Launch, then:
 * signed in or guest -> Home (AM11); first open -> Welcome and sign in (AM02).
 * The OS splash uses the same pink (manifest background_color), so the hand over is seamless.
 */
export default function LaunchPage() {
  const router = useRouter();
  const next = useCallback(() => {
    router.replace(getSession() ? "/m" : "/welcome");
  }, [router]);

  return (
    <div className="min-h-[100dvh] bg-[#E22765]">
      <SplashScreen onFinish={next} minDuration={1600} />
    </div>
  );
}
