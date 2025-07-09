import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import {
    collection,
    addDoc,
    serverTimestamp,
    getDocs,
    query,
    where
} from 'firebase/firestore';

function Post() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    const prefix = 'TIMU by ';
    const [title, setTitle] = useState('');
    const [storyBody, setStoryBody] = useState(prefix);
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            const savedUsername = localStorage.getItem(`username_${user.uid}`);
            if (savedUsername) {
                setUsername(savedUsername);
            } else {
                const newUsername = `user_${Math.floor(1000 + Math.random() * 9000)}`;
                localStorage.setItem(`username_${user.uid}`, newUsername);
                setUsername(newUsername);
            }
        }
    }, [user]);

    if (loading) return <p style={styles.loading}>Loading...</p>;
    if (!user) return <Navigate to="/login" replace />;

    const handleStoryChange = (e) => {
        let input = e.target.value;

        if (!input.startsWith(prefix)) {
            input = prefix + input.slice(prefix.length);
        }

        const userInput = input.slice(prefix.length).slice(0, 300);
        setStoryBody(prefix + userInput);
    };

    const handleKeyDown = (e) => {
        const cursorPos = e.target.selectionStart;
        if (
            (e.key === 'Backspace' || e.key === 'ArrowLeft') &&
            cursorPos <= prefix.length
        ) {
            e.preventDefault();
        }
    };

    const isUsernameTaken = async (name) => {
        const postsRef = collection(db, 'posts');
        const q = query(postsRef, where('username', '==', name));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.some(doc => doc.data().user !== user.email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || storyBody.length <= prefix.length) {
            setError('Both title and story are required.');
            return;
        }

        if (!username.trim()) {
            setError('Username is required.');
            return;
        }

        try {
            const taken = await isUsernameTaken(username.trim());
            if (taken) {
                setError('This username is already taken by another user. Please pick something else 🕵️‍♀️');
                return;
            }

            await addDoc(collection(db, 'posts'), {
                title,
                story: storyBody,
                reactions: {
                    '😂': 0,
                    '😬': 0,
                    '😭': 0,
                    '🤯': 0,
                    '🔥': 0
                },
                createdAt: serverTimestamp(),
                user: user.email,
                username: username.trim(),
                authorId: user.uid
            });

            localStorage.setItem(`username_${user.uid}`, username.trim());

            setTitle('');
            setStoryBody(prefix);
            setError('');
            navigate('/browse');
        } catch (err) {
            console.error('Error posting to Firestore:', err);
            setError('Failed to post. Try again later.');
        }
    };

    return (
        <div style={styles.page}>
            <h2 style={styles.title}>📝 Share Your Regret</h2>
            {error && <p style={styles.error}>{error}</p>}
            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={styles.input}
                    required
                />
                <textarea
                    value={storyBody}
                    onChange={handleStoryChange}
                    onKeyDown={handleKeyDown}
                    style={styles.textarea}
                    maxLength={prefix.length + 300}
                    required
                />
                <p style={styles.charCount}>
                    {storyBody.length - prefix.length}/300
                </p>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={styles.input}
                    required
                />
                <button type="submit" style={styles.button}>Post It 💥</button>
            </form>
        </div>
    );
}

const styles = {
    page: {
        backgroundColor: '#000',
        color: '#fff',
        minHeight: '90vh',
        padding: '3vh 4vw', // slightly less padding
        fontFamily: `'Comfortaa', sans-serif`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    title: {
        textAlign: 'center',
        fontSize: 'clamp(1.5rem, 5vw, 2.25rem)', // smaller max
        marginBottom: '1rem',
        fontWeight: '400',
        textShadow: '0 0 10px rgba(255, 255, 255, 0.12)',
        animation: 'float 3s ease-in-out infinite'
    },
    form: {
        width: '70%',
        maxWidth: '400px', // a bit narrower
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8rem', // tighter spacing
        background: 'rgba(255,255,255,0.015)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '12px',
        padding: '20px',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 0 30px rgba(255,255,255,0.025)'
    },
    input: {
        padding: '10px 14px',
        borderRadius: '8px',
        border: '1px solid #333',
        backgroundColor: '#111',
        color: '#fff',
        fontSize: '0.95rem', // slightly smaller
        fontFamily: 'inherit',
    },
    textarea: {
        padding: '10px 14px',
        borderRadius: '8px',
        border: '1px solid #333',
        backgroundColor: '#111',
        color: '#fff',
        fontSize: '0.95rem',
        minHeight: '140px', // smaller default height
        resize: 'vertical',
        fontFamily: 'inherit',
    },
    button: {
        padding: '12px',
        background: 'linear-gradient(135deg, #222, #333)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '10px',
        color: '#fff',
        fontSize: '0.95rem',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    },
    charCount: {
        textAlign: 'right',
        fontSize: '0.85rem',
        opacity: 0.65
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginBottom: '0.8rem',
    },
    loading: {
        color: 'white',
        textAlign: 'center'
    }
};
export default Post;
