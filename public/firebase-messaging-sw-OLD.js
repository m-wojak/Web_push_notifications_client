import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging/sw";


const firebaseApp = initializeApp ({
    apiKey: "AIzaSyC5eWh2q-3ao4EAxZT3YSSjO3vyosgyoOI",
    authDomain: "citizencapital-wpn-4dc50.firebaseapp.com",
    projectId: "citizencapital-wpn-4dc50",
    storageBucket: "citizencapital-wpn-4dc50.appspot.com",
    messagingSenderId: "46228943213",
    appId: "1:46228943213:web:01c1befd2087c134f72a64",
    measurementId: "G-J7BZM4CMGW"
  });

  const messaging = getMessaging(firebaseApp);
  messaging.onBackgroundMessage((payload) => {
    console.log(
        '[firebase-messaging-sw.js] Received background message ',
        payload
    )
  });