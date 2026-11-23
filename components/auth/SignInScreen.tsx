"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { continueAsGuest, signInWithProvider, startSignIn, takeReturnTo } from "@/lib/session";
import { AuthField, AuthNote, AuthScreen, AuthTitle, PrimaryButton } from "./AuthScreen";
import { isDesktop, WebAuthShell, WebAuthSmall, WebAuthText, WebAuthTitle, WebField, webGhostBtn, webOutlineBtn, webPrimaryBtn } from "./WebAuth";

const ghostLink = "flex h-11 items-center rounded-[12px] px-4 text-[14px] leading-[18px] text-[#C81E57]";
const socialBtn = "flex h-[52px] flex-1 items-center justify-center rounded-[12px] bg-white px-5 text-[16px] leading-5 tracking-[-0.01em] text-[#172B3A] hover:bg-[#F4F6F8]";

/**
 * Sign in or sign up, one flow (rule 1). Static for now: nothing is validated, an empty field uses
 * the Figma sample value.
 * - Below 768 px: AM02 Welcome and sign in (820:54669) / email (820:56598), the app screens.
 * - 768 px and up: PW14 Sign in (314:20613) / Email (1060:64472), the web pages.
 * Both share the same state, so resizing keeps what was typed.
 */
export function SignInScreen({ mode }: { mode: "phone" | "email" }) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const isPhone = mode === "phone";
  const sample = isPhone ? "0803 000 0000" : "ada@example.com";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const contact = value.trim() || sample;
    startSignIn(contact);
    router.push(`/code?${isPhone ? "phone" : "email"}=${encodeURIComponent(contact)}`);
  };

  // Google / Apple skip the code and the name (rule 1). Web goes to Home (PW01 / Signed in, no
  // interests yet); the app continues to the location step.
  const provider = (p: "Google" | "Apple") => {
    signInWithProvider(p);
    router.push(takeReturnTo() ?? (isDesktop() ? "/" : "/location"));
  };

  const fieldProps = {
    type: isPhone ? "tel" : "email",
    inputMode: isPhone ? ("numeric" as const) : ("email" as const),
    autoComplete: isPhone ? "tel-national" : "email",
    placeholder: sample,
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value),
  };

  return (
    <>
      {/* App (phone web) */}
      <div className="md:hidden">
        <AuthScreen fadeHeight={620} panelBottom={28} showLogo wall={isPhone ? undefined : { left: 24, top: -83 }}>
          <form onSubmit={submit} className="flex flex-col gap-2.5">
            <AuthTitle>What&apos;s on in Lagos tonight?</AuthTitle>
            <AuthNote>Find the plan for tonight, this weekend or whenever.</AuthNote>
            <AuthField label={isPhone ? "Phone number" : "Email"} {...fieldProps} />
            <PrimaryButton>Continue</PrimaryButton>

            <div className="flex h-[15px] items-center gap-3">
              <span className="h-px flex-1 bg-[#B4BFCA]/40" />
              <span className="text-[13px] text-[#B4BFCA]">or</span>
              <span className="h-px flex-1 bg-[#B4BFCA]/40" />
            </div>

            <div className="flex gap-2.5">
              <button type="button" className={socialBtn} onClick={() => provider("Google")}>Google</button>
              <button type="button" className={socialBtn} onClick={() => provider("Apple")}>Apple</button>
            </div>

            <div className="flex items-center justify-between">
              <Link href={isPhone ? "/login" : "/welcome"} className={ghostLink}>
                {isPhone ? "Use email instead" : "Use phone instead"}
              </Link>
              <button
                type="button"
                className={ghostLink}
                onClick={() => {
                  continueAsGuest();
                  router.push("/m");
                }}
              >
                Just looking
              </button>
            </div>

            <AuthNote className="text-center">
              By continuing you accept the <Link href="/terms">Terms</Link> and the <Link href="/privacy">Privacy policy</Link>.
            </AuthNote>
          </form>
        </AuthScreen>
      </div>

      {/* Web (desktop) */}
      <div className="hidden md:block">
        <WebAuthShell>
          <form onSubmit={submit} className="flex flex-col gap-5">
            <WebAuthTitle>Sign in or sign up</WebAuthTitle>
            <WebAuthText>{isPhone ? "Enter your phone number and we'll text you a code." : "Enter your email and we'll send you a code."}</WebAuthText>
            <WebField label={isPhone ? "Phone number" : "Email"} {...fieldProps} />
            <button type="submit" className={webPrimaryBtn}>Send code</button>

            <div className="flex h-[15px] items-center gap-3">
              <span className="h-px flex-1 bg-[#E9EDF1]" />
              <span className="text-[13px] text-[#68788A]">or</span>
              <span className="h-px flex-1 bg-[#E9EDF1]" />
            </div>

            <div className="flex gap-2.5">
              <button type="button" className={`${webOutlineBtn} flex-1 whitespace-nowrap px-3`} onClick={() => provider("Google")}>Continue with Google</button>
              <button type="button" className={`${webOutlineBtn} flex-1 whitespace-nowrap px-3`} onClick={() => provider("Apple")}>Continue with Apple</button>
            </div>

            <Link href={isPhone ? "/login" : "/welcome"} className={webOutlineBtn}>
              {isPhone ? "Use email instead" : "Use phone instead"}
            </Link>
            <Link href="/help/account" className={webGhostBtn}>Can&apos;t sign in? Recover your account</Link>

            <WebAuthSmall>
              By continuing you accept the <Link href="/terms">Terms</Link> and the <Link href="/privacy">Privacy policy</Link>.
            </WebAuthSmall>
          </form>
        </WebAuthShell>
      </div>
    </>
  );
}
