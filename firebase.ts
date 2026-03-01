import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAfTGQ9Nw93DbQhvCTkNyTEc0L-IWKp3rs",
  authDomain: "tel-finder.firebaseapp.com",
  projectId: "tel-finder",
  storageBucket: "tel-finder.firebasestorage.app",
  messagingSenderId: "184577684783",
  appId: "1:184577684783:web:13f3a4e0dadc19b587ddda"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
