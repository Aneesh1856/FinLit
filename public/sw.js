const CACHE_NAME = 'finlit-ai-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/manifest.json',
  '/logo.jpeg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // CRITICAL: Ignore all authentication and API routes
  // These MUST always go to the network
  if (url.pathname.startsWith('/auth') || url.pathname.startsWith('/api') || url.pathname.includes('_next')) {
    return; // Let the browser handle these normally
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => {
        // Fallback for when network fails and asset isn't in cache
        return caches.match('/');
      });
    })
  );
});
