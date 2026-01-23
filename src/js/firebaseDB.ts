// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCeqd9hFMCAwcU4CM1R3vL_DedoY9kyo48",
  authDomain: "bookkeeping-42d18.firebaseapp.com",
  projectId: "bookkeeping-42d18",
  storageBucket: "bookkeeping-42d18.firebasestorage.app",
  messagingSenderId: "58813759833",
  appId: "1:58813759833:web:6837033edafc8f7ebacc48",
  measurementId: "G-9FY5F4RQT4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
