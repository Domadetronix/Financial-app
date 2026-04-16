import { FirebaseApp, initializeApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';

const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined;

let firebaseApp: FirebaseApp | null = null;
let firestoreInstance: Firestore | null = null;

if (projectId) {
  firebaseApp = initializeApp({
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
    projectId,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
    appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
  });
  firestoreInstance = getFirestore(firebaseApp);
}

export const firestoreDb = firestoreInstance;
export const isFirestoreEnabled = Boolean(projectId);
