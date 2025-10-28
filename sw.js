
const CACHE_NAME = 'dev-store-v2.1';
const urlsToCache = [
  '/',
  '/index.html',
  // Note: We can't cache CDN resources with this basic setup.
  // In a real app with a build step, you would list your local JS/CSS files.
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});