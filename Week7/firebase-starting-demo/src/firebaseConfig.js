// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyChli9Uqxm85iyAzSxe8UwYN-AAmm6F8vs",
  authDomain: "week-7-demo-ashwika.firebaseapp.com",
  projectId: "week-7-demo-ashwika",
  storageBucket: "week-7-demo-ashwika.firebasestorage.app",
  messagingSenderId: "474326590144",
  appId: "1:474326590144:web:2babcb21ab4c1fc0e40325"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// Use the modular SDK's provider constructor directly
export const googleProvider = new GoogleAuthProvider();