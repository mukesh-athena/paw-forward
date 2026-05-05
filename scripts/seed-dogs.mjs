// One-time script to seed initial dogs into Firestore.
// Run with: node scripts/seed-dogs.js
//
// Safe to re-run: uses setDoc with deterministic IDs, so it won't create duplicates.

import { initializeApp } from "firebase/app";
import { getFirestore, setDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCPElp1QUAuUah1OkJ0CCSrZOy2enQRL38",
  authDomain: "paw-forward.firebaseapp.com",
  projectId: "paw-forward",
  storageBucket: "paw-forward.firebasestorage.app",
  messagingSenderId: "686589728822",
  appId: "1:686589728822:web:ffa26e0a95b249e3e26097",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const yodaDogs = [
  { id: "yoda-buddy", name: "Buddy", image: "/images/Buddy.avif" },
  { id: "yoda-charlie", name: "Charlie", image: "/images/Charlie.avif" },
  { id: "yoda-mochi", name: "Mochi", image: "/images/Mochi.avif" },
];

const wsdDogs = [
  { id: "wsd-buddy", name: "Buddy", image: "/images/Buddy.avif" },
  { id: "wsd-charlie", name: "Charlie", image: "/images/Charlie.avif" },
  { id: "wsd-mochi", name: "Mochi", image: "/images/Mochi.avif" },
];

async function seed() {
  console.log("Seeding YODA dogs...");
  for (const dog of yodaDogs) {
    await setDoc(doc(db, "dogs_yoda", dog.id), {
      name: dog.name,
      image: dog.image,
      addedAt: new Date(),
    });
    console.log(`  ✓ ${dog.name}`);
  }

  console.log("Seeding WSD dogs...");
  for (const dog of wsdDogs) {
    await setDoc(doc(db, "dogs_wsd", dog.id), {
      name: dog.name,
      image: dog.image,
      addedAt: new Date(),
    });
    console.log(`  ✓ ${dog.name}`);
  }

  console.log("\nDone! Check Firestore console.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});