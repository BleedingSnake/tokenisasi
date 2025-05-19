import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDtbQkgnjkHM7tgpg44Yhsxq-HotwhkrGg",
  authDomain: "tokenisasi-1c485.firebaseapp.com",
  projectId: "tokenisasi-1c485",
  storageBucket: "tokenisasi-1c485.firebasestorage.app",
  messagingSenderId: "281732043006",
  appId: "1:281732043006:web:96e5c8d78f26df1e4a15af",
  measurementId: "G-8QGVXR2NT1"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };