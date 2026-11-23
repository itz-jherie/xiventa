"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthField, AuthNote, AuthScreen, AuthTitle, PrimaryButton } from "@/components/auth/AuthScreen";
import { isDesktop, WebAuthShell, WebAuthSmall, WebAuthText, WebAuthTitle, WebField, webPrimaryBtn } from "@/components/auth/WebAuth";
import { saveName, takeReturnTo } from "@/lib/session";

/**
 * Your name, asked once after the code (rule 1). Static: an empty field uses the Figma sample name.
 * - Below 768 px: AM05 Your name (833:55844), then AM07 See what's on near you.
 * - 768 px and up: PW14 Sign in / Your name (1060:64637), then Home (PW01 / Signed in, no interests yet).
 */
export default function YourNamePage() {
  const router = useRouter();
  const [name, setName] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    saveName(name.trim() || "Ada Okafor");
    router.push(takeReturnTo() ?? (isDesktop() ? "/" : "/location"));
  };

  const fieldProps = {
    autoComplete: "name",
    autoCapitalize: "words",
    placeholder: "Ada Okafor",
    value: name,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value),
  };

  return (
    <>
      <div className="md:hidden">
        <AuthScreen fadeHeight={468} panelBottom={40} backHref="/code">
          <form onSubmit={submit} className="flex flex-col gap-2.5">
            <AuthTitle size={26}>What should we call you?</AuthTitle>
            <AuthNote>Shows on your tickets and guest lists.</AuthNote>
            <AuthField label="Your name" {...fieldProps} />
            <PrimaryButton>Continue</PrimaryButton>
          </form>
        </AuthScreen>
      </div>

      <div className="hidden md:block">
        <WebAuthShell>
          <form onSubmit={submit} className="flex flex-col gap-5">
            <WebAuthTitle>What should we call you?</WebAuthTitle>
            <WebAuthText>Shows on your tickets and guest lists.</WebAuthText>
            <WebField label="Your name" {...fieldProps} />
            <button type="submit" className={webPrimaryBtn}>Continue</button>
            <WebAuthSmall>
              By continuing you accept the <Link href="/terms">Terms</Link> and the <Link href="/privacy">Privacy policy</Link>.
            </WebAuthSmall>
          </form>
        </WebAuthShell>
      </div>
    </>
  );
}
