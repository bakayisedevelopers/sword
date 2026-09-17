import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

/**
 * Firebase project configuration matching:
 * flutter-website/lib/backend/firebase/firebase_config.dart
 */
export const firebaseConfig = {
  apiKey: 'AIzaSyDPRznvHNhICZlG_a_1F8a1s5GPS1ss3Yk',
  authDomain: 'ssmi-database.firebaseapp.com',
  projectId: 'ssmi-database',
  storageBucket: 'ssmi-database.firebasestorage.app',
  messagingSenderId: '464475463837',
  appId: '1:464475463837:web:8f6d4a51f27d2672003474',
  measurementId: 'G-ZMP83GTQTZ',
};

// Initialize Firebase once
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Analytics (browser only)
export let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then((yes) => {
    if (yes) {
      analytics = getAnalytics(app);
    }
  });
}

export default app;
