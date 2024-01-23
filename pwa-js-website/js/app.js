//delete service worker
navigator.serviceWorker.getRegistrations().then(function (registrations) {
  for (let registration of registrations) {
    registration.unregister();
  }
});

window.addEventListener("load", () => {
  function handleNetworkChange(event) {
    const offlineMessage = document.getElementById("offline-message");
    if (!navigator.onLine) {
      new Notification("Example notification", {
        body: "You are offline",
      });
      offlineMessage.classList.add("offline");
    } else {
      offlineMessage.classList.remove("offline");
    }
  }

  // Show initial offline message if the user loads the page while offline

  window.addEventListener("online", handleNetworkChange);
  window.addEventListener("offline", handleNetworkChange);
});

//Request notification permission
Notification.requestPermission().then(function (permission) {
  if (permission === "granted") {
    if (navigator.serviceWorker) {
      navigator.serviceWorker
        .register("sw.js")
        .then(() => navigator.serviceWorker.ready)
        .then((registration) => {
          // sync event
          if ("SyncManager" in window) {
            registration.sync.register("sync-messagess");
          }
        })
        .catch((error) => {
          console.error("Error registering service worker:", error);
        });
    }
  }
});

function serverMessage() {
  if (navigator.serviceWorker) {
    //message event
    navigator.serviceWorker.addEventListener("message", (event) => {
      console.log(`The service sent me a message: ${event.data}`);
      // new Notification(`The client worker sent me a message: ${event.data}`);
    });

    navigator.serviceWorker.ready.then((registration) => {
      // sent message to service worker
      registration.active.postMessage("Hi service worker");
      // Show a notification that includes an action titled Archive.
      registration.showNotification("New mail ", {
        actions: [
          {
            action: "archive",
            title: "Archive",
          },
        ],
      });
      registration.showNotification("New mail second", {
        actions: [
          {
            action: "archive",
            title: "Archive",
          },
        ],
      });
    });
  }
}
