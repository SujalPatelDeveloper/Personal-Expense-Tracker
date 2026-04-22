import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider, signInWithPopup, linkWithPopup, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

// Your web app's Firebase configuration
// REPLACE these with your actual Firebase project configuration from the Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyB0tyiJjCpJ721N8dJGX2zmrudiEN8v-9s",
  authDomain: "login-personal-expense-tracker.firebaseapp.com",
  projectId: "login-personal-expense-tracker",
  storageBucket: "login-personal-expense-tracker.firebasestorage.app",
  messagingSenderId: "914809261655",
  appId: "1:914809261655:web:4940a2f57c8b9c730c1d12"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const microsoftProvider = new OAuthProvider('microsoft.com');
export const appleProvider = new OAuthProvider('apple.com');

export {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
}