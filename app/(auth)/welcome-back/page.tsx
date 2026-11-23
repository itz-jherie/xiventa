"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthNote, AuthScreen, AuthTitle } from "@/components/auth/AuthScreen";
import { firstName, useSession, takeReturnTo } from "@/lib/session";

/**
 * AM05 Welcome back, 1:1 with Figma node 932:60110. A returning account sees this for about
 * 1.5 s after the code, then Home (rule 1). Never shows the name, location or interest steps.
 */
export default function WelcomeBackPage() {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    const t = setTimeout(() => router.replace(takeReturnTo() ?? "/m"), 1500);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <AuthScreen fadeHeight={468} panelBottom={56}>
      <AuthTitle>Welcome back{session?.name ? `, ${firstName(session.name)}` : ""}</AuthTitle>
      <AuthNote>Your tickets, saved events and places are right where you left them.</AuthNote>
    </AuthScreen>
  );
}
