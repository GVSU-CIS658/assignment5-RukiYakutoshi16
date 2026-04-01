import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyB4bdNSxAmLtSHuGqV7rV05qdSDF2tMEbc",
  authDomain: "custombeverage-46482.firebaseapp.com",
  projectId: "custombeverage-46482",
  storageBucket: "custombeverage-46482.firebasestorage.app",
  messagingSenderId: "524235465163",
  appId: "1:524235465163:web:f2d61e0a53c05b4d57164e",
  measurementId: "G-PZS8NST5EP"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
