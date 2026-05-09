import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCPElp1QUAuUah1OkJ0CCSrZOy2enQRL38",
  authDomain: "paw-forward.firebaseapp.com",
  projectId: "paw-forward",
  storageBucket: "paw-forward.firebasestorage.app",
  messagingSenderId: "686589728822",
  appId: "1:686589728822:web:ffa26e0a95b249e3e26097",
};

// Avoid re-initializing on Next.js hot reload
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);