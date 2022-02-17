// // importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.2.0/workbox-sw.js');
//
// const CACHE_NAME = 'home-page-cache';
// let urlsToCache = [
//     '/',
//     '/index',
//     '/registration',
//     '/static/css/main.css',
//     '/static/manifest.json',
//     '/static/js/controller/boardsManager.js',
//     '/static/img/codecool-logo.png',
//     '/static/js/data/dataHandler.js',
//     '/static/js/view/htmlFactory.js',
//     '/static/js/view/domManager.js',
//     '/static/js/controller/cardsManager.js',
//     '/static/js/main.js',
//     '/api/boards',
//     '/api/statuses/',
//     // `/api/boards/${boardId}/cards/`,
//     // 'https://use.fontawesome.com/releases/v5.5.0/webfonts/fa-solid-900.woff2',
//     '/static/favicon/favicon.ico',
//     '/static/favicon/favicon-32x32.png',
//     '/api/boards/1/cards/',
//     '/api/boards/2/cards/'
// ];
//
// // let data = '';
// // self.addEventListener('message', function (event) {
// //     data = JSON.parse(event.data);
// //     // console.log(urlsToCache);
// //     urlsToCache = [urlsToCache, ...data];
// //     console.log(urlsToCache);
// // });
//
// self.addEventListener('install', function(e) {
//  e.waitUntil(
//    caches.open(CACHE_NAME).then(function(cache) {
//      return cache.addAll(urlsToCache);
//    })
//  );
//  self.skipWaiting();
// });
//
// self.addEventListener('fetch', async function(event) {
//  console.log(event.request.url);
//
//  caches.open(CACHE_NAME).then(function(cache) {
//      return cache.add(event.request.url);
//  });
//
//  event.respondWith(
//    caches.match(event.request).then(async function(response) {
//        // console.log(event.request);
//        // console.log(caches.keys());
//        return response || await fetch(event.request);
//    })
//  );
// });

importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

workbox.skipWaiting();
workbox.clientsClaim();

// cache name
workbox.core.setCacheNameDetails({
    prefix: 'My-awesome-cache',
    precache: 'precache',
    runtime: 'runtime',
  });

// runtime cache
// 1. stylesheet
workbox.routing.registerRoute(
    new RegExp('\.css$'),
    workbox.strategies.networkFirst({
        cacheName: 'My-awesome-cache-Stylesheets',
        plugins: [
            new workbox.expiration.Plugin({
                maxAgeSeconds: 60 * 60 * 24 * 7, // cache for one week
                maxEntries: 20, // only cache 20 request
                purgeOnQuotaError: true
            })
        ]
    })
);
// 2. images
workbox.routing.registerRoute(
    new RegExp('\.(png|svg|jpg|jpeg)$'),
    workbox.strategies.networkFirst({
        cacheName: 'My-awesome-cache-Images',
        plugins: [
            new workbox.expiration.Plugin({
                maxAgeSeconds: 60 * 60 * 24 * 7,
                maxEntries: 50,
                purgeOnQuotaError: true
            })
        ]
    })
);

// 3. cache news articles result
workbox.routing.registerRoute(
    new RegExp('/'),
    workbox.strategies.networkFirst({
        cacheName: 'My-awesome-cache-main-page',
        cacheExpiration: {
            maxAgeSeconds: 60 * 30 //cache the news content for 30mn
        }
    })
);

workbox.routing.registerRoute(
    'https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css',
    workbox.strategies.networkFirst({
        cacheName: 'bs-css'
    })
);

workbox.routing.registerRoute(
    'https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css',
    workbox.strategies.networkFirst({
        cacheName: 'normalize-css'
    })
);

workbox.routing.registerRoute(
    'https://use.fontawesome.com/releases/v5.5.0/css/solid.css',
    workbox.strategies.networkFirst({
        cacheName: 'solid-css'
    })
);

workbox.routing.registerRoute(
    'https://use.fontawesome.com/releases/v5.5.0/css/fontawesome.css',
    workbox.strategies.networkFirst({
        cacheName: 'fontawesome-css'
    })
);

workbox.routing.registerRoute(
    'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js',
    workbox.strategies.networkFirst({
        cacheName: 'jquery-js'
    })
);

workbox.routing.registerRoute(
    'https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js',
    workbox.strategies.networkFirst({
        cacheName: 'bs-js'
    })
);

workbox.routing.registerRoute(
    new RegExp('(http|https)://cdn.backgroundhost.com/backgrounds/subtlepatterns/diagonal-noise.png'),
    workbox.strategies.networkFirst({
        cacheName: 'background-png'
    })
);

workbox.routing.registerRoute(
    new RegExp('https://use.fontawesome.com/releases/v5.5.0/webfonts/'),
    workbox.strategies.networkFirst({
        cacheName: 'webfonts'
    })
);

workbox.precaching.precacheAndRoute([]);