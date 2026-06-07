import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDTNvWG9387JHw8AGhj1VhIZKJdFJaGHq8",
  authDomain: "microearn-6851a.firebaseapp.com",
  projectId: "microearn-6851a",
  storageBucket: "microearn-6851a.firebasestorage.app",
  messagingSenderId: "310740607198",
  appId: "1:310740607198:web:3ed23cc637e0cf5bdd624f",
  measurementId: "G-Y1YTECP7KK",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
