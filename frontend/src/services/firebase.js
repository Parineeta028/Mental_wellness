// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // ✅ Add this


const firebaseConfig = {
  apiKey: "AIzaSyDOMvl8g5r-LrBKnJD_5DAyVe7xHndChC0",
  authDomain: "mentalhealthapp-d7840.firebaseapp.com",
  projectId: "mentalhealthapp-d7840",
  storageBucket: "mentalhealthapp-d7840.firebasestorage.app",
  messagingSenderId: "751756358078",
  appId: "1:751756358078:web:53378b40269c26c67a09ef",
  measurementId: "G-JJGNEKS908"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);