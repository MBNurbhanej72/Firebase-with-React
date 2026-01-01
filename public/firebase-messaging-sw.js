importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");



firebase.initializeApp({
  apiKey: "AIzaSyA2-mbdRUh_8nBKgLiBR-e_e9us68A-uSM",
  authDomain: "fir-with-react-a5fbc.firebaseapp.com",
  projectId: "fir-with-react-a5fbc",
  messagingSenderId: "1004489891704",
  appId: "1:1004489891704:web:472c668a08c5540025b28d",
  storageBucket: "fir-with-react-a5fbc.firebasestorage.app",
});



const messaging = firebase.messaging();



//? Background notifications
messaging.onBackgroundMessage((payload) => {
  console.log("📩 Background Message:", payload);

  self.registration.showNotification(
    payload.notification.title,
    {
      body: payload.notification.body,
      icon: "/firebase-logo.png",
    }
  );
});