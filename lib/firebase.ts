import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, setPersistence, browserLocalPersistence, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Check if Firebase config is properly set
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error(
    "Firebase configuration is missing. Please check your .env.local file."
  );
  console.error("Required environment variables:");
  console.error("- NEXT_PUBLIC_FIREBASE_API_KEY");
  console.error("- NEXT_PUBLIC_FIREBASE_PROJECT_ID");
  console.error("- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN");
  console.error("- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET");
  console.error("- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID");
  console.error("- NEXT_PUBLIC_FIREBASE_APP_ID");
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase services with error handling
export const db = getFirestore(app, "travlabhi");
export const auth = getAuth(app);
// Set persistence once (best-effort; non-blocking)
if (typeof window !== "undefined") {
  setPersistence(auth, browserLocalPersistence).catch((err) => {
    console.error("[firebase] Failed to set auth persistence", err);
  });
}
export const storage = getStorage(app);

// Google OAuth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

export default app;
