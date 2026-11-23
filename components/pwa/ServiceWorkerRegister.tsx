"use client";

import { useEffect } from "react";

/**
 * Registers the service worker, which (with the manifest) is what makes the app installable.
 * Production: /sw.js (offline caching). Development: /sw-dev.js (installable, caches nothing,
 * so edits always show). Set NEXT_PUBLIC_ENABLE_SW=true to try the real one in `npm run dev`.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator) || !window.isSecureContext) return;
    const real = process.env.NODE_ENV === "production" || process.env.NEXT_PUBLIC_ENABLE_SW === "true";
    navigator.serviceWorker.register(real ? "/sw.js" : "/sw-dev.js", { scope: "/" }).catch(() => {});
  }, []);
  return null;
}
