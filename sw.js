const CACHE_NAME = 'moqatel-health-pwa-v1';
const APP_FILES = [
  './',
  './trainee-health.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './background.png'
];
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_FILES).catch(()=>{})));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE_NAME ? caches.delete(k) : null))));
  self.clients.claim();
});
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  event.respondWith(fetch(req).then(res => {
    const copy = res.clone();
    caches.open(CACHE_NAME).then(cache => cache.put(req, copy)).catch(()=>{});
    return res;
  }).catch(() => caches.match(req).then(cached => cached || caches.match('./trainee-health.html'))));
});
