importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyDIeXtKJMTEnqnmZi44QoYuvgNehInBY0s",
  authDomain: "ezlabtesting-a772a.firebaseapp.com",
  projectId: "ezlabtesting-a772a",
  storageBucket: "ezlabtesting-a772a.firebasestorage.app",
  messagingSenderId: "44380631715",
  appId: "1:44380631715:web:6739728ff2b1679aa08516",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || "EZ Lab Testing";
  const options = {
    body: payload.notification?.body || "",
    icon: "/images/logo.png",
    data: payload.data || {},
  };

  self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  const targetUrl =
    event.notification?.data?.clickAction || "/dashboard";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if ("focus" in client) {
            client.navigate(targetUrl);
            return client.focus();
          }
        }
        if (clients.openWindow) return clients.openWindow(targetUrl);
      }),
  );
});
