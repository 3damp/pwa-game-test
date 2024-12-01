const CACHE_NAME = "PetTest-0.0.4";
const contentToCache = [
  "Build/pwa.loader.js",
  "Build/pwa.framework.js",
  "Build/pwa.data",
  "Build/pwa.wasm",
  "TemplateData/style.css"

];
self.addEventListener('install', function (e) {
  console.log(`[Service Worker] (${CACHE_NAME}) Install`);
  self.skipWaiting();

  e.waitUntil((async function () {
    const cache = await caches.open(CACHE_NAME);
    console.log(`[Service Worker] (${CACHE_NAME}) Caching all: app shell and content`);
    await cache.addAll(contentToCache);
  })());
});

self.addEventListener('activate', function (e) {
  console.log(`[Service Worker] (${CACHE_NAME}) Activate`);
  caches.keys().then(function (cacheNames) {
    return Promise.all(
      cacheNames.map(function (cName) {
        if (cName !== CACHE_NAME) {
          console.log(`[Service Worker] (${CACHE_NAME}) Deleting: ${cName}`);
          return caches.delete(cName);
        }
      })
    );
  })
});

self.addEventListener('fetch', function (e) {
  e.respondWith((async function () {
    let response = await caches.match(e.request);
    console.log(`[Service Worker] (${CACHE_NAME}) Fetching resource: ${e.request.url}`);
    if (response) { return response; }

    response = await fetch(e.request);
    const cache = await caches.open(CACHE_NAME);
    console.log(`[Service Worker] (${CACHE_NAME}) Caching new resource: ${e.request.url}`);
    cache.put(e.request, response.clone());
    return response;
  })());
});
