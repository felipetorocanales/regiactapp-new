// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAbNlUlaXL4asCdIL5-T8uWbW77suGxCCU",
  authDomain: "regiactappnew.firebaseapp.com",
  projectId: "regiactappnew",
  storageBucket: "regiactappnew.firebasestorage.app",
  messagingSenderId: "1012665110857",
  appId: "1:1012665110857:web:c386df7968e28451178a98"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { auth };
export { db };