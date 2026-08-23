const CACHE_NAME = "chi-nav-v2.2.21";
const CORE_ASSETS = ["./", "./index.html", "./css/style.css", "./css/theme.css?v=2.2.21", "./js/update.js?v=2.2.21", "./js/app.js?v=2.2.21", "./data/data.json", "./data/version.json", "./manifest.json", "./css/update.css?v=2.2.21", "./css/card-tooltip.css?v=2.2.21", "./js/theme.js?v=2.2.21", "./js/card-tooltip.js?v=2.2.21"];
self.addEventListener("install", event => { event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())); });
self.addEventListener("activate", event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.pathname.endsWith("/index.html") || url.pathname.endsWith("/version.json") || url.pathname.endsWith("/data.json") || url.pathname.endsWith("/sw.js")) { event.respondWith(fetch(event.request, {cache:"no-store"}).then(response => response).catch(() => caches.match(event.request))); return; }
  event.respondWith(fetch(event.request).then(response => { if (response.ok && url.origin === self.location.origin && (url.pathname.endsWith(".css") || url.pathname.endsWith(".js"))) { const copy = response.clone(); caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)); } return response; }).catch(() => caches.match(event.request)));
});
