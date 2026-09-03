const CACHE_NAME = "frame-tracker-v7";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./manifest.json",
    "./icons/apple-touch-icon.png",
    "./icons/icon-192.png",
    "./icons/icon-512.png",
    "./audio/score.mp3",
    "./images/background.png"
];


/*
=================================
INSTALL
=================================
*/

self.addEventListener("install", function(event) {

    self.skipWaiting();

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                return cache.addAll(
                    FILES_TO_CACHE
                );
            })
    );

});


/*
=================================
ACTIVATE
=================================
*/

self.addEventListener("activate", function(event) {

    event.waitUntil(

        caches.keys()
            .then(function(cacheNames) {

                return Promise.all(

                    cacheNames
                        .filter(function(cacheName) {
                            return cacheName !== CACHE_NAME;
                        })
                        .map(function(cacheName) {
                            return caches.delete(cacheName);
                        })

                );

            })
            .then(function() {

                return self.clients.claim();

            })

    );

});


/*
=================================
FETCH
=================================
*/

self.addEventListener("fetch", function(event) {

    /*
    For actual pages, try the internet
    first so updates appear immediately.
    */

    if (
        event.request.mode === "navigate"
    ) {

        event.respondWith(

            fetch(event.request)
                .then(function(response) {

                    const copy =
                        response.clone();

                    caches.open(CACHE_NAME)
                        .then(function(cache) {

                            cache.put(
                                event.request,
                                copy
                            );

                        });

                    return response;

                })
                .catch(function() {

                    return caches.match(
                        "./index.html"
                    );

                })

        );

        return;

    }


    /*
    For images, audio, icons etc.
    use the cached copy first.
    */

    event.respondWith(

        caches.match(event.request)
            .then(function(response) {

                return (
                    response ||
                    fetch(event.request)
                );

            })

    );

});