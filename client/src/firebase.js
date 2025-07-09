// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyCkQ1mPuJY-TffBUC7w-PPeb6AttOc7Ct0',
    authDomain: 'timuu-9fed8.firebaseapp.com',
    projectId: 'timuu-9fed8',
    storageBucket: 'timuu-9fed8.appspot.com',
    messagingSenderId: '372152667406',
    appId: '1:372152667406:web:4649ddba60228264eddb5f'
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
