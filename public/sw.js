const CACHE_NAME = 'clipbox-static-v1';
const OFFLINE_URL = '/offline.html';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll([
        '/',
        OFFLINE_URL,
        '/manifest.webmanifest',
        '/icons/icon-192.png',
        '/icons/icon-512.png',
        '/apple-touch-icon.png',
        '/favicon.svg',
        '/favicon.ico'
      ])
    )
  );

  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );

  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;

  const isNavigationRequest = event.request.mode === 'navigate';

  if (isNavigationRequest) {
    event.respondWith(
      fetch(event.request).catch(async () => {
        const cache = await caches.open(CACHE_NAME);
        return cache.match(OFFLINE_URL);
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }

          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });

          return networkResponse;
        })
        .catch(async () => {
          if (event.request.destination === 'document') {
            const cache = await caches.open(CACHE_NAME);
            return cache.match(OFFLINE_URL);
          }

          return Response.error();
        });
    })
  );
});
