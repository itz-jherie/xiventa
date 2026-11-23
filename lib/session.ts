"use client";

import { useSyncExternalStore } from "react";

/**
 * Static stand-in for sign in, kept in localStorage so the flow can be tested end to end.
 * No validation or verification happens anywhere yet: any phone, email or code is accepted.
 */
export interface Session {
  status: "signed-in" | "guest";
  name?: string;
  contact?: string; // phone or email used to sign in
  /** AM44 / PW15 Account fields */
  phone?: string;
  email?: string;
  side?: "Island" | "Mainland";
  interests?: string[];
  /** Name of a place this person runs (EC00 place-owner variant). Not set by the static flow. */
  ownsPlace?: string;
}

const SESSION_KEY = "xiventa_session";
const KNOWN_KEY = "xiventa_known_accounts"; // contact -> name, so a second sign in is "returning"
const PENDING_KEY = "xiventa_pending_contact";
const EVENT = "xiventa-session";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {}
  if (typeof window !== "undefined") window.dispatchEvent(new Event(EVENT));
}

export function getSession(): Session | null {
  return read<Session | null>(SESSION_KEY, null);
}

export function updateSession(patch: Partial<Session>) {
  const current = getSession() ?? { status: "signed-in" as const };
  write(SESSION_KEY, { ...current, ...patch });
}

export function signOut() {
  write(SESSION_KEY, null);
  write(PENDING_KEY, null);
}

export function continueAsGuest() {
  write(SESSION_KEY, { status: "guest" });
}

/** Step 1: remember who is signing in until the code is entered. */
export function startSignIn(contact: string) {
  write(PENDING_KEY, contact);
}

/** Step 2: the code is "correct". Returns the known name for a returning account (rule 1). */
export function completeCode(): { returning: boolean; name?: string } {
  const contact = read<string | null>(PENDING_KEY, null) ?? "demo";
  const known = read<Record<string, string>>(KNOWN_KEY, {});
  const name = known[contact];
  write(SESSION_KEY, { status: "signed-in", contact, name });
  return name ? { returning: true, name } : { returning: false };
}

/** Google / Apple: no code; the name comes from the account (rule 1). */
export function signInWithProvider(provider: "Google" | "Apple") {
  write(SESSION_KEY, { status: "signed-in", contact: provider, name: "Ada Okafor" });
}

export function saveName(name: string) {
  const s = getSession();
  updateSession({ name });
  if (s?.contact) write(KNOWN_KEY, { ...read<Record<string, string>>(KNOWN_KEY, {}), [s.contact]: name });
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

let cachedRaw: string | null | undefined;
let cachedValue: Session | null = null;
function snapshot(): Session | null {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(SESSION_KEY);
  } catch {}
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedValue = raw ? (JSON.parse(raw) as Session) : null;
    } catch {
      cachedValue = null;
    }
  }
  return cachedValue;
}

/** Current session; `undefined` during server render and the first client render. */
export function useSession(): Session | null | undefined {
  return useSyncExternalStore(subscribe, snapshot, () => undefined);
}

export function firstName(name?: string) {
  return name?.trim().split(/\s+/)[0] ?? "";
}

export function initialsOf(name?: string) {
  return (name ?? "").trim().split(/\s+/).map((p) => p[0]).join("").slice(0, 2).toUpperCase() || "XV";
}

/* Rule 1: after sign in, return the person to the exact step they were on. */
const RETURN_KEY = "xiventa_return_to";

/** Remember where to land after sign in (for example a checkout step). */
export function setReturnTo(path: string) {
  try {
    sessionStorage.setItem(RETURN_KEY, path);
  } catch {}
}

/** Read and clear the saved landing path. */
export function takeReturnTo(): string | null {
  try {
    const p = sessionStorage.getItem(RETURN_KEY);
    sessionStorage.removeItem(RETURN_KEY);
    return p;
  } catch {
    return null;
  }
}
