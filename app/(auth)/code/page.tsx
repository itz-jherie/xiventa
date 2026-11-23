"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthNote, AuthScreen, AuthTitle } from "@/components/auth/AuthScreen";
import { isDesktop, WebAuthShell, WebAuthSmall, WebAuthText, WebAuthTitle, webGhostBtn, webPrimaryBtn } from "@/components/auth/WebAuth";
import { completeCode, takeReturnTo } from "@/lib/session";

const LENGTH = 6;
const SAMPLE_CODE = "482913";

/** "0803 000 0000" -> "0803 *** 0000" */
function maskPhone(phone: string) {
  const d = phone.replace(/\D/g, "");
  if (d.length < 8) return phone;
  return `${d.slice(0, 4)} *** ${d.slice(-4)}`;
}

type CodeState = "typing" | "checking" | "wrong";

/**
 * Enter the code. Static: any 6 digits are accepted; 000000 shows the Wrong code state.
 * - Below 768 px: AM04 Code (821:55777) and its states. The code "arrives" and fills in by itself
 *   after 1.5 s (one-time-code autofill) and checks itself on the sixth digit (rule 1).
 * - 768 px and up: PW14 Sign in / Enter code (1060:64292), Email code (1060:64546), Wrong code
 *   (1060:64386). Typed by hand, then Verify and continue.
 * After the code: new account -> Your name; returning account -> Welcome back (app) or Home (web).
 */
function CodeContent() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email");
  const phone = params.get("phone") ?? "0803 000 0000";
  const isEmail = Boolean(email);

  const [code, setCode] = useState("");
  const [state, setState] = useState<CodeState>("typing");
  const [seconds, setSeconds] = useState(42);
  const touched = useRef(false);
  const appInput = useRef<HTMLInputElement>(null);
  const webInput = useRef<HTMLInputElement>(null);

  const check = (value: string) => {
    setState("checking");
    setTimeout(() => {
      if (value === "000000") {
        setState("wrong");
        return;
      }
      const { returning } = completeCode();
      const desktop = isDesktop();
      router.push(returning ? (desktop ? takeReturnTo() ?? "/" : "/welcome-back") : "/name");
    }, 1200);
  };

  const onChange = (value: string) => {
    touched.current = true;
    const next = value.replace(/\D/g, "").slice(0, LENGTH);
    setCode(next);
    if (state === "wrong") setState("typing");
    if (next.length === LENGTH && !isDesktop()) check(next);
  };

  const resend = () => {
    setSeconds(42);
    setCode("");
    setState("typing");
  };

  useEffect(() => {
    const desktop = isDesktop();
    (desktop ? webInput : appInput).current?.focus();
    if (desktop || isEmail) return;
    const t = setTimeout(() => {
      if (touched.current) return;
      setCode(SAMPLE_CODE);
      check(SAMPLE_CODE);
    }, 1500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEmail]);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const target = isEmail ? email : maskPhone(phone);
  const wrong = state === "wrong";
  const changeHref = isEmail ? "/login" : "/welcome";
  const resendLabel = `Resend in 0:${String(seconds).padStart(2, "0")}`;

  const boxes = (variant: "app" | "web", ref: React.RefObject<HTMLInputElement | null>) => (
    <div
      className="relative flex gap-2"
      onClick={() => {
        if (wrong) resend();
        ref.current?.focus();
      }}
    >
      {Array.from({ length: LENGTH }).map((_, i) => {
        const digit = code[i];
        const active = state === "typing" && i === code.length;
        const style =
          variant === "app"
            ? {
                border: wrong ? "2px solid #C0231A" : active ? "2px solid #E22765" : "1px solid rgba(255,255,255,0.18)",
                backgroundColor: digit ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.06)",
              }
            : {
                border: wrong ? "2px solid #C0231A" : active ? "2px solid #E22765" : "1px solid #D5DCE3",
                backgroundColor: "#FFFFFF",
              };
        return (
          <div
            key={i}
            className={`flex h-[60px] flex-1 items-center justify-center rounded-[14px] text-[26px] font-bold ${variant === "app" ? "text-white" : "text-[#172B3A]"}`}
            style={style}
          >
            {digit}
          </div>
        );
      })}
      <input
        ref={ref}
        value={code}
        onChange={(e) => onChange(e.target.value)}
        inputMode="numeric"
        autoComplete="one-time-code"
        aria-label="6 digit code"
        maxLength={LENGTH}
        disabled={state === "checking"}
        className="absolute inset-0 opacity-0"
      />
    </div>
  );

  return (
    <>
      {/* App (phone web) */}
      <div className="md:hidden">
        <AuthScreen fadeHeight={468} panelBottom={40} backHref={changeHref}>
          <AuthTitle>{wrong ? "That code didn't work" : isEmail ? "Check your email" : "Check your texts"}</AuthTitle>
          <AuthNote>
            {wrong
              ? `Check the 6 digits we sent to ${target} and try again. After 5 wrong codes, sign in pauses for 15 minutes.`
              : isEmail
                ? `We sent a 6 digit code to ${target}. Paste it, or tap the code in the email.`
                : `We sent a 6 digit code to ${target}. It fills in by itself when it arrives.`}
          </AuthNote>
          {boxes("app", appInput)}
          {state === "checking" ? (
            <p className="text-[14px] leading-4 text-[#B4BFCA]">Checking your code…</p>
          ) : (
            <div className="flex h-4 items-center justify-between text-[14px] leading-4">
              {wrong || seconds === 0 ? (
                <button type="button" className="text-[#B4BFCA]" onClick={resend}>Send a new code</button>
              ) : (
                <span className="text-[#B4BFCA]">{resendLabel}</span>
              )}
              <Link href={changeHref} className="font-bold text-[#E22765]">
                {isEmail ? "Wrong email?" : "Wrong number?"}
              </Link>
            </div>
          )}
          <p className="text-center text-[13px] leading-[18px] text-[#B4BFCA]">Been here before? You go straight to Home after the code.</p>
        </AuthScreen>
      </div>

      {/* Web (desktop) */}
      <div className="hidden md:block">
        <WebAuthShell>
          <form
            className="flex flex-col gap-5"
            onSubmit={(e) => {
              e.preventDefault();
              if (state !== "checking") check(code || SAMPLE_CODE);
            }}
          >
            <WebAuthTitle>{wrong ? "That code didn't work" : isEmail ? "Check your email" : "Check your texts"}</WebAuthTitle>
            <WebAuthText>
              {wrong
                ? `Check the 6 digits we sent to ${target} and try again. After 5 wrong codes, sign in pauses for 15 minutes.`
                : isEmail
                  ? `We sent a 6 digit code to ${target}. It can take a minute to arrive.`
                  : `We sent a 6 digit code to ${target}. It fills in by itself if this is your phone.`}
            </WebAuthText>
            {boxes("web", webInput)}
            <button type="submit" className={webPrimaryBtn} disabled={state === "checking"}>
              {state === "checking" ? "Checking your code…" : "Verify and continue"}
            </button>
            {wrong || seconds === 0 ? (
              <button type="button" className={webGhostBtn} onClick={resend}>Send a new code</button>
            ) : (
              <span className={`${webGhostBtn} hover:bg-transparent`}>{resendLabel}</span>
            )}
            <Link href={changeHref} className={webGhostBtn}>{isEmail ? "Use a different email" : "Use a different number"}</Link>
            <WebAuthSmall>Been here before? You go straight back to where you were.</WebAuthSmall>
          </form>
        </WebAuthShell>
      </div>
    </>
  );
}

export default function CodePage() {
  return (
    <Suspense fallback={null}>
      <CodeContent />
    </Suspense>
  );
}
