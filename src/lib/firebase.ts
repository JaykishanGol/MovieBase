import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCyUVutFHsG5E1trOU0PfENhzPFX3RTSes",
  authDomain: "moviebase-g2swl.firebaseapp.com",
  projectId: "moviebase-g2swl",
  storageBucket: "moviebase-g2swl.firebasestorage.app",
  messagingSenderId: "870190976782",
  appId: "1:870190976782:web:9325549924693b3870915f"
};

// Initialize Firebase
const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export { firebaseApp, auth, db };
