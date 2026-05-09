// One-time script to seed real animals into Firestore.
// Run with: node scripts/seed-dogs.mjs
// Safe to re-run — uses setDoc with deterministic IDs, won't create duplicates.

import { initializeApp } from "firebase/app";
import { getFirestore, setDoc, deleteDoc, doc } from "firebase/firestore";

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

// All animals from Vipanshi's PDF, distributed across YODA + WSD per her spec.
const animals = [
  // ─── YODA ─────────────────────────────────────────────
  {
    shelter: "yoda",
    id: "veer",
    name: "Veer",
    image: "/images/buddy.avif",
    breed: "Indian Indie Dog",
    type: "dog",
    age: "2 months",
    gender: "Male",
    description:
      "Veer is a bouncy little boy full of life. At just 2 months old he's ready to explore the world — he'll thrive with an active family who can keep up with his endless curiosity and playful energy.",
    tags: {
      type: "dog",
      activity: ["walks", "runner"],
      home: ["garden", "large-house"],
      size: "medium",
      experience: ["first-timer", "experienced"],
      energy: "high-energy",
      household: ["children", "other-pets", "both", "neither"],
      hours: ["most-day", "few-hours"],
      grooming: ["love-it", "occasional"],
      priority: ["playfulness", "loyalty"],
    },
  },
  {
    shelter: "yoda",
    id: "chikki",
    name: "Chikki",
    image: "/images/charlie.avif",
    breed: "Indian Indie Dog",
    type: "dog",
    age: "1.5 years",
    gender: "Female",
    description:
      "Chikki is a spirited and loving girl ready for her forever home. She's full of energy and loves to play — perfect for an active household with space to roam and explore.",
    tags: {
      type: "dog",
      activity: ["walks", "runner"],
      home: ["garden", "large-house"],
      size: "large",
      experience: ["experienced", "expert"],
      energy: "high-energy",
      household: ["children", "neither"],
      hours: ["most-day", "few-hours"],
      grooming: ["love-it", "occasional"],
      priority: ["loyalty", "playfulness"],
    },
  },
  {
    shelter: "yoda",
    id: "diana",
    name: "Diana",
    image: "/images/cat1.jpg",
    breed: "Calico Kitten",
    type: "cat",
    age: "3 months",
    gender: "Female",
    description:
      "Diana is a tough little calico who survived a herpes virus and came out stronger. Vibrant, feisty, and absolutely full of personality — a real fighter with a huge heart waiting for you.",
    tags: {
      type: "cat",
      activity: ["couch", "walks"],
      home: ["apartment", "garden"],
      size: "small",
      experience: ["first-timer", "experienced"],
      energy: "high-energy",
      household: ["children", "neither"],
      hours: ["most-day", "few-hours"],
      grooming: ["occasional", "low-maintenance"],
      priority: ["playfulness", "independence"],
    },
  },
  // ─── WSD ─────────────────────────────────────────────
  {
    shelter: "wsd",
    id: "chai",
    name: "Chai",
    image: "/images/buddy.avif",
    breed: "Indian Indie Dog",
    type: "dog",
    age: "3 months",
    gender: "Male",
    description:
      "Chai is a vaccinated little guy with a warm personality to match his name. Growing into a medium-sized boy, he loves to play and explore — a wonderful first companion for someone ready to embrace the puppy phase.",
    tags: {
      type: "dog",
      activity: ["walks", "runner"],
      home: ["garden", "large-house"],
      size: "medium",
      experience: ["first-timer", "experienced"],
      energy: "high-energy",
      household: ["children", "other-pets", "both", "neither"],
      hours: ["most-day", "few-hours"],
      grooming: ["love-it", "occasional"],
      priority: ["playfulness", "affection"],
    },
  },
  {
    shelter: "wsd",
    id: "melody",
    name: "Melody",
    image: "/images/cat2.jpg",
    breed: "Kitten (Partially Blind)",
    type: "cat",
    age: "3 months",
    gender: "Female",
    description:
      "Melody is a brave little soul who doesn't let her partial blindness slow her down one bit. Dewormed and ready to go — a tiny burst of energy who'll steal your heart completely.",
    tags: {
      type: "cat",
      activity: ["couch", "walks"],
      home: ["apartment", "garden"],
      size: "small",
      experience: ["experienced", "expert"],
      energy: "high-energy",
      household: ["other-pets", "neither"],
      hours: ["most-day", "few-hours", "evening"],
      grooming: ["love-it", "occasional"],
      priority: ["playfulness", "affection"],
    },
  },
  {
    shelter: "wsd",
    id: "tinoo",
    name: "Tinoo",
    image: "/images/cat3.jpg",
    breed: "Three-Legged Cat",
    type: "cat",
    age: "Adult",
    gender: "Female",
    description:
      "Tinoo is a gentle black and white girl who likes to take life at her own pace. Sweet and a little shy at first, she loves quiet spaces and rewards patience with the most loyal, gentle companionship.",
    tags: {
      type: "cat",
      activity: ["couch"],
      home: ["apartment", "garden", "large-house"],
      size: "small",
      experience: ["first-timer", "experienced", "expert"],
      energy: "calm",
      household: ["other-pets", "neither"],
      hours: ["most-day", "few-hours", "evening"],
      grooming: ["occasional", "low-maintenance"],
      priority: ["affection", "independence"],
    },
  },
];

async function clearOldPlaceholders() {
  // Remove the old placeholder docs (yoda-buddy, yoda-charlie, etc.)
  // so we don't end up with duplicates.
  const oldIds = ["buddy", "charlie", "mochi"];
  for (const shelter of ["yoda", "wsd"]) {
    for (const oldId of oldIds) {
      try {
        await deleteDoc(doc(db, `dogs_${shelter}`, `${shelter}-${oldId}`));
        console.log(`  cleared placeholder dogs_${shelter}/${shelter}-${oldId}`);
      } catch (err) {
        // doc didn't exist — fine
      }
    }
  }
}

async function seed() {
  console.log("Clearing old placeholder dogs...");
  await clearOldPlaceholders();

  console.log("\nSeeding real animals...");
  for (const a of animals) {
    const { shelter, id, ...data } = a;
    await setDoc(doc(db, `dogs_${shelter}`, id), {
      ...data,
      addedAt: new Date(),
    });
    console.log(`  ✓ ${a.name} → dogs_${shelter}/${id}`);
  }

  console.log("\nDone! Check Firestore console.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});