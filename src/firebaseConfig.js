// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD9xBf0g3Gh80lppefxnt0QvFNzl5HXE7g",
  authDomain: "leftoverfood-firebase.firebaseapp.com",
  projectId: "leftoverfood-firebase",
  storageBucket: "leftoverfood-firebase.appspot.com",
  messagingSenderId: "797334377648",
  appId: "1:797334377648:web:fa94eb50fbe2d33e5b5775",
  measurementId: "G-29YFE7ZGJM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);