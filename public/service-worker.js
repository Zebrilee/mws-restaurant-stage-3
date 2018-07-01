const cachedFiles = [
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
  'js/restaurant_info.min.js',
  'js/offline.min.js',
  'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.3.1/dist/leaflet.js'
];

let cacheName = 'restaurant-review-cache-v2';

// Listen for install event, set callback
self.addEventListener('install', function (event) {
  //console.log('Attempting to install service worker and cache static public');
  event.waitUntil(
    caches.open(cacheName)
    .then(function (cache) {
      return cache.addAll(cachedFiles);
    })
  );
});

//fetch event in order to cache them
self.addEventListener('fetch', event => {
  //console.log('Fetch event for ', event.request.url);
  var url = new URL(event.request.url);
  var req = event.request;
  if (url.origin != location.origin) {
    return;
  }
  if (url.origin === location.origin && url.pathname === "/") {
    req = new Request("/index.html");
  }

  event.respondWith(
    caches
    .open(cacheName)
    .then(cache => {
      return cache.match(req)
        .then(response => {
          if (response) {
            return response;
          }
          return fetch(req)
            .then(r => {
              cache.put(req, r.clone())
              return r;
            });
        });
    })
  );
});

self.addEventListener('activate', event => {
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