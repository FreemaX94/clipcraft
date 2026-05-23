// ClipCraft service worker — minimal install/activate hooks for PWA install
// + stale-while-revalidate cache for the app shell (HTML + Next static chunks)
// so a returning user gets near-instant first paint and offline fallback.

const CACHE_NAME = "clipcraft-shell-v1";
const APP_SHELL = ["/", "/privacy", "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  // Pre-cache the app shell. Failure of any one URL won't fail install.
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.all(
        APP_SHELL.map((url) =>
          fetch(url, { cache: "no-cache" })
            .then((res) => (res.ok ? cache.put(url, res) : null))
            .catch(() => null),
        ),
      ),
    ),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // Delete old cache versions
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)),
      ),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Only handle same-origin GET requests
  if (event.request.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  // Never intercept the sample video or PNG outputs (large + one-off)
  if (url.pathname === "/sample.mp4" || url.pathname.startsWith("/_next/data/")) {
    return;
  }

  // Stale-while-revalidate for HTML and Next static chunks
  if (
    event.request.destination === "document" ||
    url.pathname.startsWith("/_next/static/")
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(event.request).then((cached) => {
          const networkFetch = fetch(event.request)
            .then((res) => {
              if (res && res.ok) cache.put(event.request, res.clone());
              return res;
            })
            .catch(() => cached);
          return cached || networkFetch;
        }),
      ),
    );
  }
});
