const STACTIC_CACHE_NAME = "teting-caches";
const DYNAMIC_CACHE_NAME = "dynamic-cahces";

const urlsToCache = [
  "/",
  "/assets/img/about/1.jpg",
  "/assets/img/about/2.jpg",
  "/assets/img/about/3.jpg",
  "/assets/img/about/4.jpg",
  "/assets/img/logos/facebook.svg",
  "/assets/img/logos/google.svg",
  "/assets/img/logos/ibm.svg",
  "/assets/img/logos/microsoft.svg",
  "/assets/img/portfolio/1.jpg",
  "/assets/img/portfolio/2.jpg",
  "/assets/img/portfolio/3.jpg",
  "/assets/img/portfolio/4.jpg",
  "/assets/img/portfolio/5.jpg",
  "/assets/img/portfolio/6.jpg",
  "/assets/img/team/1.jpg",
  "/assets/img/team/2.jpg",
  "/assets/img/team/3.jpg",
  "/assets/img/close-icon.svg",
  "/assets/img/header-bg.jpg",
  "/assets/img/map-image.png",
  "/assets/img/navbar-logo.svg",
  "/assets/app/logo.png",
  "/css/styles.css",
  "/js/app.js",
  "/js/scripts.js",
  "/manifest.json",
  "/sw.js",
  "/index.html",
];

self.addEventListener("install", async (event) => {
  event.waitUntil(cacheResources());
});

//cache delete
self.addEventListener("activate", (evt) => {
  evt.waitUntil(
    caches.keys().then((keys) => {
      //console.log(keys);
      return Promise.all(
        keys
          .filter(
            (key) => key !== STACTIC_CACHE_NAME && key !== DYNAMIC_CACHE_NAME
          )
          .map((key) => caches.delete(key))
      );
    })
  );
});

self.addEventListener("updatefound", (event) => {
  // A new service worker is being installed.
  const newWorker = event.target.installing;
  console.log("jfaof");

  newWorker.addEventListener("statechange", () => {
    // Check if the new service worker has activated.
    if (newWorker.state === "activated") {
      // Perform actions when the new service worker becomes active.
      console.log("New service worker activated.");

      // You can notify the user or perform other tasks here.
    }
  });
});

// static cache fetch
// self.addEventListener("fetch", (event) => {
//   event.respondWith(cacheThenNetwork(event.request));
// });

self.addEventListener("fetch", (evt) => {
  evt.respondWith(
    caches.match(evt.request).then((cacheRes) => {
      return cacheRes || fetAndPush;
    })
  );
});

//message event
self.addEventListener("message", (event) => {
  console.log(`The client sent me a message: ${event.data}`);
  event.source.postMessage("Hi client");
});

//notificationclick event
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  if (event.action === "archive") {
    console.log("archive");
  } else {
    console.log("not click any action");
  }
});

// sync event
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-messagess") {
    event.waitUntil(console.log("async"));
  }
});

//static cache fetch function
async function cacheThenNetwork(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  console.log("Falling back to network");
  return fetch(request);
}

// store static cache
const cacheResources = async () => {
  const cache = await caches.open(STACTIC_CACHE_NAME);
  return cache.addAll(urlsToCache);
};

const fetAndPush = async () => {
  await fetch(evt.request).then(async (fetchRes) => {
    return caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
      cache.put(evt.request.url, fetchRes.clone());
      return fetchRes;
    });
  });
};
