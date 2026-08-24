const CACHE_NAME = "chi-nav-v2.8.0";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./css/style.css?v=2.8.0",
  "./css/responsive.css?v=2.8.0",
  "./css/theme.css?v=2.8.0",
  "./css/update.css?v=2.8.0",
  "./css/card-tooltip.css?v=2.8.0",
  "./css/enhancements.css?v=2.8.0",
  "./js/data.js?v=2.8.0",
  "./js/storage.js?v=2.8.0",
  "./js/update.js?v=2.8.0",
  "./js/search.js?v=2.8.0",
  "./js/navigation.js?v=2.8.0",
  "./js/render.js?v=2.8.0",
  "./js/app.js?v=2.8.0",
  "./js/theme.js?v=2.8.0",
  "./js/card-tooltip.js?v=2.8.0",
  "./js/bootstrap.js?v=2.8.0",
  "./data/data.json",
  "./data/version.json",
  "./manifest.json?v=2.8.0",
  "./assets/icon/icon-black.svg",
  "./assets/icon/icon-white.svg"
];

const NETWORK_FIRST = ["/", "/index.html", "/data/data.json", "/data/version.json", "/manifest.json"];
const CACHE_FIRST_EXTENSIONS = [".css", ".js", ".svg", ".png", ".jpg", ".jpeg", ".webp", ".ico", ".woff", ".woff2"];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key.startsWith("chi-nav-") && key !== CACHE_NAME).map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

async function networkFirst(request) {
  try {
    const response = await fetch(request, { cache: "no-store" });
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    if (request.mode === "navigate") {
      const fallback = await caches.match("./index.html");
      if (fallback) return fallback;
    }
    throw new Error("Network unavailable and no cached response");
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, response.clone());
    }
    return response;
  } catch {
    throw new Error("Resource unavailable");
  }
}

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  const path = url.pathname;
  const isNetworkFirst = NETWORK_FIRST.some(item => path === item || path.endsWith(item));
  const isCacheFirst = CACHE_FIRST_EXTENSIONS.some(extension => path.endsWith(extension));

  if (isNetworkFirst) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  if (isCacheFirst) {
    event.respondWith(cacheFirst(event.request));
  }
});
