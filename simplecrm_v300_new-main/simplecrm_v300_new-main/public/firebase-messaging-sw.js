
// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyAScUDJ_W8QOHFnWcyBQHCzvboo4PRhVp8",
  authDomain: "v300-45134.firebaseapp.com",
  projectId: "v300-45134",
  storageBucket: "v300-45134.appspot.com",
  messagingSenderId: "122074927862",
  appId: "1:122074927862:web:f07e1756903fafe33252d7",
  measurementId: "G-HQVQB0MBFX",
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
