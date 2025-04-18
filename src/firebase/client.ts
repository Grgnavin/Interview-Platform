// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp  } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyACVj1Scc0BQR2qcF64TpqL3eiWwdfjOio",
  authDomain: "prepwise-23577.firebaseapp.com",
  projectId: "prepwise-23577",
  storageBucket: "prepwise-23577.firebasestorage.app",
  messagingSenderId: "601749797172",
  appId: "1:601749797172:web:8d587db7e645ba8ee14d61",
  measurementId: "G-6QEYGLF27D"
};

// Initialize Firebase
const app = !getApps.length ?  initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);