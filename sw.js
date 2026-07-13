const CACHE = 'sentry-v1';
const ASSETS = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

// Cache-first for the app shell, network for everything else (camera streams,
// ntfy.sh requests, etc. are never intercepted since they aren't in ASSETS).
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return; // let cross-origin (ntfy.sh) pass straight through
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
