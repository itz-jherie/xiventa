"use client";

import { useSyncExternalStore } from "react";

/**
 * One place that knows whether Xiventa can be installed on this device, shared by every
 * "Get the app" button, the install toast and the install sheet.
 *
 * The browser's `beforeinstallprompt` event can fire before React starts, so a tiny inline
 * script in app/layout.tsx stashes it on `window.__xvInstallPrompt`; we pick it up here.
 */
export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

declare global {
  interface Window {
    __xvInstallPrompt?: BeforeInstallPromptEvent | null;
    __xvInstalled?: boolean;
  }
}

export type Platform = "ios" | "android" | "desktop";

export interface InstallState {
  /** Running as the installed app (home screen icon). */
  standalone: boolean;
  /** The browser offered its install prompt, so one tap installs. */
  canPrompt: boolean;
  /** Installed during this visit. */
  installed: boolean;
  /** Page is on HTTPS or localhost. Browsers only install from secure pages. */
  secure: boolean;
  platform: Platform;
  /** The "how to add to home screen" sheet is open. */
  sheetOpen: boolean;
  getAppOpen: boolean;
}

let sheetOpen = false;
const listeners = new Set<() => void>();
const emit = () => {
  cached = null;
  listeners.forEach((l) => l());
};

function detectPlatform(): Platform {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) return "ios";
  if (/Android/.test(ua)) return "android";
  return "desktop";
}

let cached: InstallState | null = null;
function snapshot(): InstallState {
  if (cached) return cached;
  cached = {
    standalone:
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true,
    canPrompt: Boolean(window.__xvInstallPrompt),
    installed: Boolean(window.__xvInstalled),
    secure: window.isSecureContext,
    platform: detectPlatform(),
    sheetOpen,
    getAppOpen,
  };
  return cached;
}

const SERVER: InstallState = { standalone: false, canPrompt: false, installed: false, secure: true, platform: "desktop", sheetOpen: false, getAppOpen: false };

let wired = false;
function subscribe(cb: () => void) {
  listeners.add(cb);
  if (!wired) {
    wired = true;
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault(); // we show our own button / toast instead of the browser mini bar
      window.__xvInstallPrompt = e as BeforeInstallPromptEvent;
      emit();
    });
    window.addEventListener("appinstalled", () => {
      window.__xvInstallPrompt = null;
      window.__xvInstalled = true;
      sheetOpen = false;
      emit();
    });
    window.matchMedia("(display-mode: standalone)").addEventListener("change", emit);
    window.addEventListener("xv-install-ready", emit);
  }
  return () => listeners.delete(cb);
}

export function useInstall(): InstallState {
  return useSyncExternalStore(subscribe, snapshot, () => SERVER);
}

export function openInstallSheet() {
  sheetOpen = true;
  emit();
}

export function closeInstallSheet() {
  sheetOpen = false;
  emit();
}

/** PW30 Get the app (desktop): QR code to open Xiventa on a phone. */
let getAppOpen = false;
export function openGetApp() {
  getAppOpen = true;
  emit();
}
export function closeGetApp() {
  getAppOpen = false;
  emit();
}

/**
 * What every "Get the app" button does:
 * - already installed and running as the app: nothing to do, go to Home;
 * - the browser offered its prompt: show the system "Add to Home screen / Install" dialog;
 * - otherwise (iPhone Safari, Firefox, insecure page, prompt not offered yet): open the sheet
 *   with step by step instructions for this device.
 */
export async function requestInstall(): Promise<"prompted" | "accepted" | "dismissed" | "sheet" | "standalone"> {
  const s = snapshot();
  if (s.standalone) return "standalone";
  const evt = window.__xvInstallPrompt;
  if (evt) {
    await evt.prompt();
    const { outcome } = await evt.userChoice;
    window.__xvInstallPrompt = null; // a prompt event can only be used once
    emit();
    return outcome;
  }
  openInstallSheet();
  return "sheet";
}

/** Inline script for <head>: catches the install prompt even if it fires before hydration. */
export const EARLY_INSTALL_SCRIPT = `
window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();window.__xvInstallPrompt=e;window.dispatchEvent(new Event('xv-install-ready'));});
window.addEventListener('appinstalled',function(){window.__xvInstallPrompt=null;window.__xvInstalled=true;window.dispatchEvent(new Event('xv-install-ready'));});
`;
