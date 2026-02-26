// Force update — old SW clear karo
const CACHE = 'mr-trader-v6';
const CORE = ['./', './index.html', './manifest.json'];

self.addEventListener('install', e => {
  // Immediately take control — no waiting
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c => 
      Promise.allSettled(CORE.map(u => c.add(u)))
    )
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    // Delete ALL old caches
    caches.keys().then(keys => 
      Promise.all(keys.map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  
  // Network first — fresh content hamesha
  e.respondWith(
    fetch(e.request)
      .then(resp => {
        if (resp && resp.ok) {
          const clone = resp.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return resp;
      })
      .catch(() => caches.match(e.request)
        .then(cached => cached || caches.match('./index.html'))
      )
  );
});
