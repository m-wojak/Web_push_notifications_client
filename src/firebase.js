// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC5eWh2q-3ao4EAxZT3YSSjO3vyosgyoOI",
  authDomain: "citizencapital-wpn-4dc50.firebaseapp.com",
  projectId: "citizencapital-wpn-4dc50",
  storageBucket: "citizencapital-wpn-4dc50.appspot.com",
  messagingSenderId: "46228943213",
  appId: "1:46228943213:web:01c1befd2087c134f72a64",
  measurementId: "G-J7BZM4CMGW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const messaging = getMessaging(app);
export default messaging;