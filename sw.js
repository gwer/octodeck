importScripts('./precache-manifest.js');

const CACHE_NAME = 'app-precache-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      await cache.addAll(self.__PRECACHE_URLS);

      self.skipWaiting();
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k.startsWith('app-precache-') && k !== CACHE_NAME)
          .map((k) => caches.delete(k)),
      );

      self.clients.claim();
    })(),
  );
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const res = await fetch(request);

    if (request.method === 'GET' && res && res.ok) {
      cache.put(request, res.clone());
    }

    return res;
  } catch {
    const cached = await cache.match(request, { ignoreSearch: true });

    if (cached) {
      return cached;
    }

    throw new Error('offline and no cache');
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request, { ignoreSearch: true });
  if (cached) {
    return cached;
  }

  const res = await fetch(request);
  if (request.method === 'GET' && res && res.ok) {
    cache.put(request, res.clone());
  }

  return res;
}

self.addEventListener('fetch', (event) => {
  const req = event.request;

  if (req.method !== 'GET') {
    return;
  }

  const dest = req.destination;

  if (req.mode === 'navigate' || dest === 'document') {
    event.respondWith(networkFirst(req));
    return;
  }

  if (['script', 'style', 'font', 'image'].includes(dest)) {
    event.respondWith(cacheFirst(req));
    return;
  }

  event.respondWith(networkFirst(req));
});
