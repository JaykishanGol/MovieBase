import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "your_api_key_here",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "your_auth_domain_here",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "your_project_id_here",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "your_storage_bucket_here",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "your_messaging_sender_id_here",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "your_app_id_here",
};

// Initialize Firebase
const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export { firebaseApp, auth, db };
