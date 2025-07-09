// src/context/PostContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const PostContext = createContext();

export const usePosts = () => useContext(PostContext);

export const PostProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const unsub = onSnapshot(collection(db, 'posts'), (snapshot) => {
            const fetched = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            setPosts(fetched);
        });

        return () => unsub();
    }, []);

    const addPost = async (title, story) => {
        await addDoc(collection(db, 'posts'), {
            title,
            story,
            reactions: { '😂': 0, '😬': 0, '😭': 0, '🤯': 0, '🔥': 0 }
        });
    };

    return (
        <PostContext.Provider value={{ posts, addPost }}>
            {children}
        </PostContext.Provider>
    );
};
