import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from 'firebase/database'
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAn-PcSABcA2mgua68tpBpi1rg2A9-HHlQ",
  authDomain: "capitaluy-234cc.firebaseapp.com",
  databaseURL: "https://capitaluy-234cc-default-rtdb.firebaseio.com",
  projectId: "capitaluy-234cc",
  storageBucket: "capitaluy-234cc.firebasestorage.app",
  messagingSenderId: "326810824238",
  appId: "1:326810824238:web:5191e45bad68f75101f9bf",
  measurementId: "G-J18YDVXSQQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics: ReturnType<typeof getAnalytics> | null = null
try {
  if (typeof window !== "undefined") {
    analytics = getAnalytics(app)
  }
} catch (e) {
  analytics = null
}

// Exports for Firestore, Realtime Database and Auth
const firestore = getFirestore(app)
const database = getDatabase(app)
const auth = getAuth(app)

export { app as firebaseApp, analytics, firestore, database, auth }