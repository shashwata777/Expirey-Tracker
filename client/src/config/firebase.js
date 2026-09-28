import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

// Initialize Firebase App safely
const app = getApps().length > 0 
  ? getApp() 
  : (firebaseConfig.apiKey ? initializeApp(firebaseConfig) : initializeApp({ apiKey: 'dummy-api-key', projectId: 'dummy-project' }));

// Initialize Firebase Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Custom parameters to force account selection
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export { signInWithPopup, signOut };
export default app;
