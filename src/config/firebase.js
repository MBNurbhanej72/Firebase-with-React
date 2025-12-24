import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,

  //? For realtime database
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL
};

export const app = initializeApp(firebaseConfig);



//? Create realtime database instance
export const realTimeDB = getDatabase(app);

//? Create authentication instance
export const auth = getAuth(app);

//? Create firestore database instance
export const db = getFirestore(app);