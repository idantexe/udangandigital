import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD8Q3IrR73rpaE695YI3maGtUuJSPV33j8",
  authDomain: "udangandigital-c0c76.firebaseapp.com",
  projectId: "udangandigital-c0c76",
  storageBucket: "udangandigital-c0c76.firebasestorage.app",
  messagingSenderId: "885328796440",
  appId: "1:885328796440:web:8007f9ee605987c2509c6d",
  measurementId: "G-JEZ6YQM20P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);