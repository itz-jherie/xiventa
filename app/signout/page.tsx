"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/session";

/** Test helper: clears the static session and goes back to sign in. */
export default function SignOutPage() {
  const router = useRouter();
  useEffect(() => {
    signOut();
    router.replace("/welcome");
  }, [router]);
  return null;
}
