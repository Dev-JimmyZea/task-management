import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBp0KAoNnObp_YiKboGfSkMDVGvum4KLC0",
    authDomain: "task-manager-fd03e.firebaseapp.com",
    projectId: "task-manager-fd03e",
    storageBucket: "task-manager-fd03e.firebasestorage.app",
    messagingSenderId: "609791737215",
    appId: "1:609791737215:web:3f064f9cc46b17c97b6e4a",
    measurementId: "G-R73FQ7NFQF"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);