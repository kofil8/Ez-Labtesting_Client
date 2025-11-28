/* eslint-disable no-undef */
importScripts(
  "https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyDmJD8BXC9o838Ak4iVIRikqA7dNvIiZGI",
  authDomain: "ez-labtesting-6ddd6.firebaseapp.com",
  projectId: "ez-labtesting-6ddd6",
  messagingSenderId: "851917974376",
  appId: "1:851917974376:web:fd63d9ea55982aef1244dd",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Background push received", payload);

  const { title, body } = payload.notification || {};

  self.registration.showNotification(title || "New Notification", {
    body: body || "",
    icon: "/logo.png",
  });
});
