import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";

// Replace these values with your actual Firebase configuration from the console
const firebaseConfig = {
   apiKey: "AIzaSyDn6VN_fOwAhvsLR2NX7NyI7_7DD0w2WTo",
  authDomain: "vitask-337c8.firebaseapp.com",
  projectId: "vitask-337c8",
  storageBucket: "vitask-337c8.firebasestorage.app",
  messagingSenderId: "348990969142",
  appId: "1:348990969142:web:272dfb1faf38a68e6a4f97",
  measurementId: "G-XVNDD69X7M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication and Providers
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Microsoft Provider (Requires "microsoft.com" enabled in Firebase console)
export const microsoftProvider = new OAuthProvider('microsoft.com');