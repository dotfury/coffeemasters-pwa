self.addEventListener('fetch', event => {
  event.respondWith(
    (async () => {
      const cacheResponse = await caches.match(event.request);
      
      if (cacheResponse) {
        return cacheResponse;
      } else {
        return fetch(event.request);
      }
    })()
  );
});