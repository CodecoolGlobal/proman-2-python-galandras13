importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

workbox.skipWaiting();
workbox.clientsClaim();

workbox.core.setCacheNameDetails({
    prefix: 'ProMan-cache',
    precache: 'precache',
    runtime: 'runtime',
});

workbox.routing.registerRoute(
    new RegExp('\.css$'),
    workbox.strategies.networkFirst({
        cacheName: 'ProMan-cache-Stylesheets',
        plugins: [
            new workbox.expiration.Plugin({
                maxAgeSeconds: 60 * 60 * 24 * 7,
                maxEntries: 20,
                purgeOnQuotaError: true
            })
        ]
    })
);

workbox.routing.registerRoute(
    new RegExp('\.(png|svg|jpg|jpeg)$'),
    workbox.strategies.networkFirst({
        cacheName: 'ProMan-cache-Images',
        plugins: [
            new workbox.expiration.Plugin({
                maxAgeSeconds: 60 * 60 * 24 * 7,
                maxEntries: 50,
                purgeOnQuotaError: true
            })
        ]
    })
);

workbox.routing.registerRoute(
    new RegExp('https://proman-blonde-elephants.herokuapp.com/'),
    workbox.strategies.networkFirst({
        cacheName: 'ProMan-cache-main-page'
    })
);

workbox.routing.registerRoute(
    new RegExp('https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css'),
    workbox.strategies.networkFirst({
        cacheName: 'bs-css'
    })
);

workbox.routing.registerRoute(
    new RegExp('https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css'),
    workbox.strategies.networkFirst({
        cacheName: 'normalize-css'
    })
);

workbox.routing.registerRoute(
    new RegExp('https://use.fontawesome.com/releases/v5.5.0/css/solid.css'),
    workbox.strategies.networkFirst({
        cacheName: 'solid-css'
    })
);

workbox.routing.registerRoute(
    new RegExp('https://use.fontawesome.com/releases/v5.5.0/css/fontawesome.css'),
    workbox.strategies.networkFirst({
        cacheName: 'fontawesome-css'
    })
);

workbox.routing.registerRoute(
    new RegExp('https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js'),
    workbox.strategies.networkFirst({
        cacheName: 'jquery-js'
    })
);

workbox.routing.registerRoute(
    new RegExp('https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js'),
    workbox.strategies.networkFirst({
        cacheName: 'bs-js'
    })
);

workbox.routing.registerRoute(
    new RegExp('https://use.fontawesome.com/releases/v5.5.0/webfonts/'),
    workbox.strategies.networkFirst({
        cacheName: 'webfonts'
    })
);

workbox.precaching.precacheAndRoute([]);