import React, { useEffect, useState, useCallback } from 'react';
import { db } from '../firebase';
import {
    collection, onSnapshot, orderBy, query,
    doc, updateDoc, increment, getDoc, setDoc
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const EMOJIS = ['🔥', '😂', '🤯', '😬', '😭'];
const FALLBACK_NAMES = ['Tiger', 'Sloth', 'Ferret', 'Koala', 'Capybara'];
const PROFILE_EMOJIS = ['🐸', '🦊', '🐼', '🦁', '🐧'];
const USERNAME_COLORS = ['#F87171', '#60A5FA', '#FBBF24', '#34D399', '#A78BFA'];

function Browse() {
    const [posts, setPosts] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [navDisabled, setNavDisabled] = useState(false);
    const [usernames, setUsernames] = useState({});
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const { user } = useAuth();

    const isMobile = screenWidth < 768;

    useEffect(() => {
        const onResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    useEffect(() => {
        const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, async snapshot => {
            const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            setPosts(docs);

            const uids = [...new Set(docs.map(p => p.user))];
            const map = {};
            await Promise.all(uids.map(async uid => {
                try {
                    const ref = doc(db, 'usernames', uid);
                    const snap = await getDoc(ref);

                    if (snap.exists()) {
                        const d = snap.data();
                        map[uid] = {
                            ...d,
                            displayName: d.username || d.anonName || 'Anonymous'
                        };
                    } else {
                        const fallbackAnimal = FALLBACK_NAMES[Math.floor(Math.random() * FALLBACK_NAMES.length)];
                        const rand = Math.floor(100 + Math.random() * 900);
                        const emoji = PROFILE_EMOJIS[Math.floor(Math.random() * PROFILE_EMOJIS.length)];
                        const color = USERNAME_COLORS[Math.floor(Math.random() * USERNAME_COLORS.length)];
                        const anonName = `Anonymous ${fallbackAnimal} #${rand}`;
                        const newProfile = { anonName, emoji, color, displayName: anonName };
                        await setDoc(ref, newProfile);
                        map[uid] = newProfile;
                    }
                } catch {
                    map[uid] = { displayName: 'Anonymous', emoji: '👻', color: '#fff' };
                }
            }));
            setUsernames(map);
        });
        return () => unsub();
    }, []);

    const handleReaction = useCallback(async (postId, emoji) => {
        if (!user) return alert('Oops! You need to be logged in to react. Head over to Post and log in to join the fun!');
        const uid = user.uid;
        const postRef = doc(db, 'posts', postId);
        const psnap = await getDoc(postRef);
        if (!psnap.exists()) return;

        const data = psnap.data();
        const uReacts = data.reactionUsers?.[uid] || [];
        if (uReacts.length >= 5) return alert('Max 5 reactions per post.');

        const updated = [...uReacts, emoji];
        await updateDoc(postRef, {
            [`reactions.${emoji}`]: increment(1),
            [`reactionUsers.${uid}`]: updated,
        });
    }, [user]);

    const next = () => {
        if (navDisabled || posts.length === 0) return;
        setDirection(1);
        setCurrentIndex(i => (i + 1) % posts.length);
        setNavDisabled(true);
        setTimeout(() => setNavDisabled(false), 500);
    };
    const prev = () => {
        if (navDisabled || posts.length === 0) return;
        setDirection(-1);
        setCurrentIndex(i => (i - 1 + posts.length) % posts.length);
        setNavDisabled(true);
        setTimeout(() => setNavDisabled(false), 500);
    };

    const variants = {
        enter: dir => ({ x: dir > 0 ? 500 : -500, opacity: 0, scale: 0.8, rotate: dir > 0 ? 10 : -10 }),
        center: { x: 0, opacity: 1, scale: 1, rotate: 0, transition: { duration: 0.5 } },
        exit: dir => ({ x: dir > 0 ? -500 : 500, opacity: 0, scale: 0.8, rotate: dir > 0 ? -10 : 10, transition: { duration: 0.5 } }),
    };

    const current = posts[currentIndex];
    const meta = current
        ? {
            ...usernames[current.user],
            displayName: current.username || usernames[current.user]?.displayName || 'Anonymous'
        }
        : null;

    return (
        <div style={styles.page}>
            <h2 style={styles.title}>Today I Messed Up</h2>
            {!current ? (
                <p style={{ fontSize: '1.2rem' }}>No chaos yet. Be the first to confess.</p>
            ) : (
                <div style={styles.contentWrapper}>
                    <div style={{ ...styles.postContainer, flexDirection: isMobile ? 'column' : 'row' }}>
                        <AnimatePresence custom={direction} mode="wait">
                            <motion.div
                                key={current.id}
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                style={styles.post}
                            >
                                <h3 style={styles.postTitle}>{current.title}</h3>
                                <p style={styles.story}>{current.story}</p>
                                <p style={styles.meta}>
                                    <span style={{ fontSize: '1.3rem', marginRight: '0.5rem' }}>
                                        {meta?.emoji || '👤'}
                                    </span>
                                    <span style={{ ...styles.username, color: meta?.color || '#fff' }}>
                                        {meta?.displayName}
                                    </span>
                                </p>
                                <div style={styles.reactions}>
                                    {EMOJIS.map(e => (
                                        <span key={e} style={styles.reaction} onClick={() => handleReaction(current.id, e)}>
                                            {e} {current.reactions?.[e] || 0}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                    <div style={styles.arrowContainer}>
                        <button onClick={prev} style={styles.arrow} disabled={navDisabled}>⬅ Prev</button>
                        <button onClick={next} style={styles.arrow} disabled={navDisabled}>Next ➡</button>
                    </div>
                </div>
            )}
        </div>
    );
}


const styles = {
    page: {
        backgroundColor: '#000',
        color: '#fff',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        boxSizing: 'border-box',
        overflowX: 'hidden',
        fontFamily: 'system-ui, sans-serif',
        margin: 0,
        border: 'none',
    },

    title: {
        fontSize: 'clamp(2rem, 5vw, 4rem)',
        fontWeight: '900',
        marginBottom: '2rem',
        textAlign: 'center',
        color: '#fff',
    },

    contentWrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
        width: '100%',
        maxWidth: '900px',
        margin: '0 auto',
        padding: '0 1rem',
        boxSizing: 'border-box',
    },
    postContainer: {
        maxWidth: '600px',
        width: '100%',
        margin: '0 auto',
        padding: '1rem',
        boxSizing: 'border-box',
        display: 'flex',
        justifyContent: 'center',
        paddingLeft: '1rem', // much more left

    },



    post: {
        width: '100%',
        backgroundColor: '#111',
        border: 'none',
        boxShadow: '0 8px 32px rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        padding: 'clamp(1rem, 4vw, 2.5rem)',
        borderRadius: 'clamp(12px, 3vw, 24px)',
        color: '#eee',
        overflowY: 'auto',
        maxHeight: '40vh',
    },

    postTitle: {
        fontSize: 'clamp(1.3rem, 2vw, 1.8rem)',
        fontWeight: '500',
        marginBottom: '0.8rem',
        color: '#fff',
    },

    story: {
        fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
        lineHeight: '1.65',
        marginBottom: '1.5rem',
        fontWeight: '300',
        color: '#ddd'
    },

    meta: {
        fontSize: 'clamp(0.9rem, 1.2vw, 1rem)',
        opacity: 0.9,
        marginBottom: '1.5rem',
        fontStyle: 'italic',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        flexWrap: 'wrap',
    },

    username: {
        fontWeight: '600',
    },

    reactions: {
        marginTop: '1.5rem',
        display: 'flex',
        gap: '0.5rem',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },

    reaction: {
        cursor: 'pointer',
        background: '#fff',
        border: '1px solid #000',
        color: '#000',
        fontWeight: '600',
        fontSize: '1.2rem',
        padding: '0.4rem 0.8rem',
        borderRadius: '10px',
    },

    deleteButton: {
        marginTop: '2rem',
        alignSelf: 'center',
        backgroundColor: '#333',
        color: '#fff',
        border: '1px solid #888',
        padding: '0.8rem 1.5rem',
        borderRadius: '12px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: '600',
    },

    arrowContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: '1rem',
        marginTop: '1rem',
        flexWrap: 'wrap',
        width: '100%',
    },

    arrow: {
        fontSize: '1rem',
        fontWeight: '600',
        padding: '0.6rem 1.2rem',
        backgroundColor: '#111',
        color: '#fff',
        border: '1px solid #555',
        borderRadius: '10px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        flex: '1 1 auto',
        maxWidth: '150px',
    },
};

export default Browse;
