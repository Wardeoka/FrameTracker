const CACHE_NAME = "frame-tracker-v2";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./manifest.json",
    "./icons/icon-512.png",
    "./audio/score.mp3"
];

self.addEventListener("install", function(event) {

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then(function(cache) {

                return cache.addAll(FILES_TO_CACHE);

            })

    );

});


self.addEventListener("fetch", function(event) {

    event.respondWith(

        caches.match(event.request)
            .then(function(response) {

                return response || fetch(event.request);

            })

    );

});