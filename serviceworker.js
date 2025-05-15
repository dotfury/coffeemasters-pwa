self.addEventListener('install', async event => {
  const cache = await caches.open('cm-appshell');

  cache.addAll([
    "/",
    "styles.css",
    "scripts/API.js",
    "scripts/app.js",
    "scripts/Menu.js",
    "scripts/Order.js",
    "scripts/Router.js",
    "images/logo.svg",
    "https://cdn.jsdelivr.net/npm/idb@8/build/umd.js",
    "https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;700&display=swap",
    "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0",
    "https://fonts.gstatic.com/s/opensans/v40/memvYaGs126MiZpBA-UvWbX2vVnXBbObj2OVTS-mu0SC55I.woff2",
    "https://fonts.gstatic.com/s/materialsymbolsoutlined/v244/kJF1BvYX7BgnkSrUwT8OhrdQw4oELdPIeeII9v6oDMzByHX9rA6RzaxHMPdY43zj-jCxv3fzvRNU22ZXGJpEpjC_1n-q_4MrImHCIJIZrDCvHOejbdhzrA.woff2",
    "images/icons/icon.svg"
  ]);
});

// network first
self.addEventListener('fetch', event => {
  event.respondWith(
    (async () => {
      try {
        const fetchResponse = await fetch(event.request);
        const cache = await caches.open('cm-updatedassets');
        cache.put(event.request, fetchResponse.clone()); // cannot reuse, must clone

        return fetchResponse;
      } catch (e) {
        const cacheResponse = await caches.match(event.request);

        if (cacheResponse) return cacheResponse;
      }
    })()
  );
});

// cache first
// self.addEventListener('fetch', event => {
//   if (event.request.url == '/order') event.respondWith(fetch('/'));
//   event.respondWith(
//     (async () => {
//       const cacheResponse = await caches.match(event.request);
      
//       if (cacheResponse) {
//         return cacheResponse;
//       } else {
//         return fetch(event.request);
//       }
//     })()
//   );
// });