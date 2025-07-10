// src/firebase.js
//----------------------------------------------
// Initialize Firebase for TIMUU
//----------------------------------------------
import { initializeApp } from 'firebase/app';
import {
    getAuth,
    setPersistence,
    browserLocalPersistence, // optional: remember login
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// import { getStorage }   from 'firebase/storage'; // <- enable later if you need storage

//------------------------------------------------
// 1. Your project’s web config (keep these secret
//    in a .env file for public repos 😉)
//------------------------------------------------
const firebaseConfig = {
    apiKey: 'AIzaSyCkQ1mPuJY-TffBUC7w-PPeb6AttOc7Ct0',
    authDomain: 'timuu-9fed8.firebaseapp.com',
    projectId: 'timuu-9fed8',
    storageBucket: 'timuu-9fed8.appspot.com',
    messagingSenderId: '372152667406',
    appId: '1:372152667406:web:4649ddba60228264eddb5f',
};

//------------------------------------------------
// 2. Boot up the SDKs
//------------------------------------------------
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
// const storage = getStorage(app); // uncomment if/when you need it

//------------------------------------------------
// 3. (Optional) keep users logged in
//------------------------------------------------
setPersistence(auth, browserLocalPersistence).catch(console.error);

//------------------------------------------------
// 4. Re‑export for easy import elsewhere
//------------------------------------------------
export { app, auth, db /*, storage */ };
export default app;
