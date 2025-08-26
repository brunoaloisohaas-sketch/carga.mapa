const CACHE_NAME = "lf-coleta-v1";
const urlsToCache = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/dashboard.js",
  "./js/admin.js",
  "./js/export.js",
  "./js/main.js",
  "./logo-lf.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)));
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => Promise.all(
      cacheNames.filter((c) => c !== CACHE_NAME).map((c) => caches.delete(c))
    ))
  );
});
