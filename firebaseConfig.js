// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6qx0e1h7i515xoizJ2gEVoX6VsgAKPoE",
  authDomain: "autodidak-firebase-8b787.firebaseapp.com",
  projectId: "autodidak-firebase-8b787",
  storageBucket: "autodidak-firebase-8b787.firebasestorage.app",
  messagingSenderId: "541812902041",
  appId: "1:541812902041:web:8344ad20ca83b24c405008"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Ekspor layanan yang akan digunakan di seluruh aplikasi Anda
export const auth = getAuth(app);
export const db = getFirestore(app);