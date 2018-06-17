var filesToCache = [
  '/',
  'index.html',
  'restaurant.html',
  'css/main.css',
  'css/other.css',
  'css/responsive.css',
  'img/1.jpg',
  'img/2.jpg',
  'img/3.jpg',
  'img/4.jpg',
  'img/5.jpg',
  'img/6.jpg',
  'img/7.jpg',
  'img/8.jpg',
  'img/9.jpg',
  'img/10.jpg',
  'img/small-1.jpg',
  'img/small-2.jpg',
  'img/small-3.jpg',
  'img/small-4.jpg',
  'img/small-5.jpg',
  'img/small-6.jpg',
  'img/small-7.jpg',
  'img/small-8.jpg',
  'img/small-9.jpg',
  'img/small-10.jpg',
  'js/main.min.js',
  'js/dbhelper.min.js',
  'js/idb.min.js',
  'js/lazysizes.min.js',
  'js/restaurant_info.min.js'
];


let cacheName = 'restaurant-review-cache-v11';

// Listen for install event, set callback
self.addEventListener('install', function (event) {
  //console.log('Attempting to install service worker and cache static public');
  event.waitUntil(
    caches.open(cacheName)
    .then(function (cache) {
      return cache.addAll(filesToCache);
    })
  );
});

//fetch event in order to cache them
self.addEventListener('fetch', function (event) {
  //console.log('Fetch event for ', event.request.url);
  event.respondWith(
    caches.match(event.request).then(function (response) {
      if (response) {
        //console.log('Found ', event.request.url, ' in cache');
        return response;
      }
      //console.log('Network request for ', event.request.url);
      return fetch(event.request).then(function (response) {
        if (response.status === 404) {
          return caches.match('404.html');
        }
        return caches.open(cacheName).then(function (cache) {
          if (event.request.url.indexOf('test') < 0) {
            cache.put(event.request.url, response.clone());
          }
          return response;
        });
      });
    }).catch(function (error) {
      //console.log('Error, ', error);
      return caches.match('offline.html');
    })
  );
});

self.addEventListener('activate', function (event) {
  //console.log('Activating new service worker...');

  const cacheWhitelist = [cacheName];

  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
