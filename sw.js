const CACHE = 'anticlick-v1';
const PRECACHE = ['./', './index.html', './manifest.json', './icons/icon-192.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

// Network first – iframe content always live, shell from cache on fail
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Always fetch the Streamlit app live
  if (url.hostname.includes('streamlit')) return;
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
