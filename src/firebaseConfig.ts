
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA9gi8G-5iyJ2Df3sFTh58J9dQS1t3TX6Q",
  authDomain: "tech-blog-b1087.firebaseapp.com",
  projectId: "tech-blog-b1087",
  storageBucket: "tech-blog-b1087.firebasestorage.app",
  messagingSenderId: "1019791566381",
  appId: "1:1019791566381:web:b0907b4fea9fe103f17aa4"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)
