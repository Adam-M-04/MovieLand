var CACHE_NAME = 'v1';
var urlsToCache = [
    'https://unpkg.com/swiper/swiper.min.css',
    'https://unpkg.com/swiper/components/pagination/pagination.min.css',
    'https://unpkg.com/swiper/swiper-bundle.min.js',
    'https://movieland-kappa.vercel.app/img/close.svg',
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
    let cacheKeepList = ['v1'];
    event.waitUntil(
        caches.keys().then( keyList => {
            return Promise.all(keyList.map(function(key) {
                if (cacheKeepList.indexOf(key) === -1) {
                    return caches.delete(key);
                }
            }));
        })
    );
    console.log('Worker activated successfully', event);
});

self.addEventListener('fetch', function(event) {
    if (event.request.method != 'GET') return;

    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          if (response) {
            return response;
          }
          return fetch(event.request).then(
            function(response) {
              if(!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }

              var responseToCache = response.clone();
  
              caches.open(CACHE_NAME)
                .then(function(cache) {
                  cache.put(event.request, responseToCache);
                });
  
              return response;
            }
          );
        }
      )
    );
  });
