// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, enableNetwork, disableNetwork } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Unified error handler — returns { code, message } for all callers
export const handleFirebaseError = (error) => {
  console.error('Firebase error:', error);
  
  const code = error.code || 'unknown';
  
  if (code === 'unavailable' || error.message?.includes('offline')) {
    return {
      code,
      message: 'You appear to be offline. Data will sync when connection is restored.'
    };
  }
  
  if (code === 'permission-denied') {
    return {
      code,
      message: 'You do not have permission to perform this action.'
    };
  }

  return {
    code,
    message: error.message || 'An unexpected error occurred'
  };
};

// Network status monitoring
export const monitorNetworkStatus = () => {
  if (typeof window !== 'undefined') {
    const updateOnlineStatus = async () => {
      try {
        if (navigator.onLine) {
          await enableNetwork(db);
          console.log('Firebase: Network enabled');
        } else {
          await disableNetwork(db);
          console.log('Firebase: Network disabled');
        }
      } catch (error) {
        console.warn('Firebase network toggle error:', error);
      }
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // Initial check
    updateOnlineStatus();
  }
};

// Initialize Analytics (only in browser environment)
let analytics;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (e) {
    console.warn('Firebase Analytics initialization failed:', e);
  }
}

export { analytics };
export default app;