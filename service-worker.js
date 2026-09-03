const CACHE_NAME = "frame-tracker-v5";

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

Delete older versions of the
FrameTracker cache.
*/

self.addEventListener("activate", function(event) {

    event.waitUntil(

        caches.keys()
            .then(function(cacheNames) {

                return Promise.all(

                    cacheNames
                        .filter(
                            function(cacheName) {

                                return (
                                    cacheName !==
                                    CACHE_NAME
                                );

                            }
                        )
                        .map(
                            function(cacheName) {

                                return caches.delete(
                                    cacheName
                                );

                            }
                        )

                );

            })

    );

});


/*
=================================
FETCH
=================================
*/

self.addEventListener("fetch", function(event) {

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