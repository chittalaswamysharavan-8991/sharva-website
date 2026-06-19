const STATIC_CACHE = "pablo-static-v4";
const RUNTIME_CACHE = "pablo-runtime-v4";

const APP_SHELL = [
  "/",
  "/index.html",
  "/home",
  "/manifest.webmanifest",
  "/icons/icon.svg",
  "/icons/icon-180.png",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/src/design-tokens.css",
  "/src/styles.css",
  "/src/main.jsx"
];

// Install Event: cache the static app shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// Activate Event: clean up old version caches
self.addEventListener("activate", (event) => {
  const allowedCaches = [STATIC_CACHE, RUNTIME_CACHE];
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (!allowedCaches.includes(key)) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: apply resource-type-specific caching strategies
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // 1. Network-only for API calls and external services like Supabase
  if (url.pathname.startsWith("/api") || url.host.includes("supabase.co")) {
    return;
  }

  // 2. Network-first for HTML pages (document navigations)
  const isNav = event.request.mode === "navigate" || url.pathname === "/" || url.pathname === "/home" || !url.pathname.includes(".");
  if (isNav) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => {
          return caches.match(event.request).then((cached) => {
            return cached || caches.match("/home") || caches.match("/");
          });
        })
    );
    return;
  }

  // 3. Cache-first for Fonts and Images
  const isFont = url.host.includes("fonts.gstatic.com") || url.host.includes("fonts.googleapis.com") || url.pathname.endsWith(".woff2") || url.pathname.endsWith(".woff");
  const isImage = url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico)$/i);
  if (isFont || isImage) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (!response || response.status !== 200) return response;
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(event.request, copy));
          return response;
        });
      })
    );
    return;
  }

  // 4. Stale-while-revalidate for JS/CSS/JSX assets
  const isAsset = url.pathname.match(/\.(css|js|jsx|ts|tsx|json)$/i) || APP_SHELL.includes(url.pathname);
  if (isAsset) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        const fetchPromise = fetch(event.request)
          .then((response) => {
            if (response && response.status === 200) {
              const copy = response.clone();
              caches.open(RUNTIME_CACHE).then((cache) => cache.put(event.request, copy));
            }
            return response;
          })
          .catch(() => null);
        return cached || fetchPromise;
      })
    );
    return;
  }

  // Default: Stale-while-revalidate fallback
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => null);
      return cached || fetchPromise;
    })
  );
});
