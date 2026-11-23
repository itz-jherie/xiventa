/* Xiventa service worker.
 *
 * - App shell, icons and the offline page are cached on install.
 * - Pages: network first, then the cached copy, then /offline (rule 22: keep showing saved content).
 * - Next build files, images and fonts: cache first (they are content hashed or rarely change).
 * - Never cached: anything that is not a GET, other origins, API calls, checkout, payments,
 *   account and sign in pages, so personal data and money flows always come from the network.
 *
 * Bump VERSION whenever this file's caching rules change; old caches are deleted on activate.
 */
const VERSION = "v1";
const SHELL = `xiventa-shell-${VERSION}`;
const PAGES = `xiventa-pages-${VERSION}`;
const ASSETS = `xiventa-assets-${VERSION}`;

const PRECACHE = [
  "/offline",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/maskable-512.png",
  "/icons/apple-touch-icon.png",
];

const NEVER_CACHE = [/^\/api\//, /^\/checkout/, /^\/pay/, /^\/account/, /^\/code/, /^\/signout/, /^\/dashboard/];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(SHELL).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("xiventa-") && !k.endsWith(VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (NEVER_CACHE.some((re) => re.test(url.pathname))) return;

  // Page navigations: network first, fall back to cache, then the offline page.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(PAGES).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(async () => (await caches.match(req)) || (await caches.match("/offline")) || Response.error())
    );
    return;
  }

  // Static assets: cache first.
  const isAsset =
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/_next/image") ||
    url.pathname.startsWith("/images/") ||
    url.pathname.startsWith("/icons/") ||
    /\.(?:png|jpg|jpeg|webp|avif|svg|ico|woff2?)$/.test(url.pathname);

  if (isAsset) {
    event.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(ASSETS).then((c) => c.put(req, copy));
            }
            return res;
          })
      )
    );
  }
});
