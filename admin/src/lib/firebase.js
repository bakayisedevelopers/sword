import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase web configuration identifies the project; it is not a secret.  The
// defaults deliberately point at the existing Flutter application's project.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDPRznvHNhICZlG_a_1F8a1s5GPS1ss3Yk',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'ssmi-database.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'ssmi-database',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'ssmi-database.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '464475463837',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:464475463837:web:8f6d4a51f27d2672003474',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const firebaseProjectId = firebaseConfig.projectId;
export const firebaseAuth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
