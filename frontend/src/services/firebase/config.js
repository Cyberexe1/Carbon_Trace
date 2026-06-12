// =============================================================================
// SECTION: Firebase App Initialization
// Reads config exclusively from environment variables — no hardcoded keys.
// Called once at app startup; re-importing this file returns the same instance.
//
// Services initialized here:
//   auth      — Firebase Authentication (Email/Password)
//   db        — Cloud Firestore (user data, activity logs, goals)
//   analytics — Google Analytics 4 via Firebase SDK
// =============================================================================

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth }                         from 'firebase/auth';
import { getFirestore }                    from 'firebase/firestore';
import { getAnalytics, isSupported }       from 'firebase/analytics';

// --- Firebase project configuration (values injected from .env.local) ---
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Prevent duplicate initialization during Vite HMR hot reloads
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// --- Service exports ---
export const auth = getAuth(app);
export const db   = getFirestore(app);

// Analytics only runs in browser contexts (not SSR / Node.js test runners)
export const analyticsPromise = isSupported().then((yes) =>
  yes ? getAnalytics(app) : null
);

export default app;
