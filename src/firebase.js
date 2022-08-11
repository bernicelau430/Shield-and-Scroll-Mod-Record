import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
  setDoc,
	onSnapshot,
	doc,
	updateDoc,
	arrayUnion,
    arrayRemove,
	getDoc,
	deleteDoc,
	serverTimestamp,
} from "firebase/firestore";

// Replace with your firebaseConfig
const firebaseConfig = {
    apiKey: "AIzaSyCdt7jjv84jY85SZA-Ws3XK1pkfK9c8c_c",
    authDomain: "shield-and-scroll-mod-tracker.firebaseapp.com",
    projectId: "shield-and-scroll-mod-tracker",
    storageBucket: "shield-and-scroll-mod-tracker.appspot.com",
    messagingSenderId: "962492405697",
    appId: "1:962492405697:web:825f1c146b0920597a4140",
    measurementId: "G-B6E02F54WL"
  };

const logout = () => {
  signOut(auth);
};

// Create a new user and add them to the users collection
const registerWithEmailAndPassword = async (name, registry, induction_term, induction_year, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await setDoc(doc(db, "users", user.uid), {
      name,
      authProvider: "local",
      email,
			registry,
			induction_term,
      induction_year,
      admin: false,
			mods: 0,
      mod_submissions: [],
      mod_history: [],
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {
  auth,
  db,
  updateEmail,
  updatePassword,
	query,
	getDocs,
  collection,
  where,
	addDoc,
  signInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordResetEmail,
  logout,
	onSnapshot,
	doc,
	getDoc,
	arrayUnion,
    arrayRemove,
	updateDoc,
	deleteDoc,
	serverTimestamp,
};