// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, enableNetwork, disableNetwork, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAajawgz3pxEmhOZ0cPWqh1LpbVR7thzhA",
  authDomain: "weai-f2d08.firebaseapp.com",
  projectId: "weai-f2d08",
  storageBucket: "weai-f2d08.firebasestorage.app",
  messagingSenderId: "754005838816",
  appId: "1:754005838816:web:e7346f1c53018056a3b985",
  measurementId: "G-QL3VQDXPJK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Network monitoring and error handling
export const handleFirebaseError = (error) => {
  console.error('Firebase error:', error);
  
  if (error.code === 'unavailable' || error.message.includes('offline')) {
    return {
      isOffline: true,
      message: 'You appear to be offline. Data will sync when connection is restored.'
    };
  }
  
  return {
    isOffline: false,
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
  analytics = getAnalytics(app);
}

export { analytics };
export default app;