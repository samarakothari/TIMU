import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const Leaderboard = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            const postSnapshot = await getDocs(collection(db, 'posts'));
            const postData = postSnapshot.docs.map(doc => {
                const data = doc.data();
                const totalReactions = Object.values(data.reactions || {}).reduce((a, b) => a + b, 0);
                return {
                    id: doc.id,
                    ...data,
                    totalReactions,
                };
            });

            // Sort posts by total reactions
            postData.sort((a, b) => b.totalReactions - a.totalReactions);
            setPosts(postData);
        };

        fetchPosts();
    }, []);

    return (
        <div style={styles.page}>
            <h2 style={styles.title}>🏆 Leaderboard</h2>
            {posts.length === 0 ? (
                <p style={styles.empty}>No posts yet. React to rise, legend 😎</p>
            ) : (
                <div style={styles.list}>
                    {posts.map((post, index) => {
                        const displayName = post.username || 'Anonymous';
                        const emoji = post.emoji || '👤';
                        const color = post.color || '#ccc';

                        return (
                            <div key={post.id} style={styles.card}>
                                <div style={{ ...styles.rank, color }}>{`#${index + 1}`}</div>
                                <div style={styles.content}>
                                    <div style={styles.nameBlock}>
                                        <span style={styles.titleText}>{post.title}</span>
                                        <p style={styles.bodyText}>{post.story}</p>
                                        <div style={styles.meta}>
                                            <span style={styles.metaUser}>
                                                🧠 {emoji} {displayName}
                                            </span>
                                        </div>
                                    </div>
                                    <div style={styles.score}>{post.totalReactions} 💥</div>
                                </div>
                                <div style={styles.reactions}>
                                    {Object.entries(post.reactions || {}).map(([emoji, count]) => (
                                        <span key={emoji} style={styles.reaction}>
                                            {emoji} {count}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const styles = {
    page: {
        padding: '2rem',
        backgroundColor: '#000',
        color: '#fff',
        minHeight: '100vh',
        fontFamily: 'system-ui, sans-serif',
    },
    title: {
        fontSize: 'clamp(2rem, 5vw, 3rem)',
        fontWeight: 'bold',
        marginBottom: '2rem',
        textAlign: 'center',
        color: '#5ea0ff',
    },
    empty: {
        textAlign: 'center',
        fontSize: '1.2rem',
        color: '#aaa',
    },
    list: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        maxWidth: '800px',
        margin: '0 auto',
    },
    card: {
        backgroundColor: '#111',
        border: '1px solid #333',
        borderRadius: '12px',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    rank: {
        fontWeight: 'bold',
        fontSize: '1.2rem',
    },
    content: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
    },
    nameBlock: {
        flex: 1,
    },
    titleText: {
        fontSize: '1.1rem',
        fontWeight: 'bold',
        marginBottom: '0.3rem',
    },
    bodyText: {
        fontSize: '0.95rem',
        color: '#ccc',
        marginBottom: '0.5rem',
    },
    meta: {
        fontSize: '0.9rem',
        color: '#888',
    },
    metaUser: {
        fontWeight: '500',
    },
    score: {
        fontSize: '1.3rem',
        fontWeight: '600',
        color: '#0f0',
        minWidth: '40px',
        textAlign: 'right',
    },
    reactions: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        fontSize: '0.9rem',
    },
    reaction: {
        backgroundColor: '#222',
        padding: '0.3rem 0.6rem',
        borderRadius: '8px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.3rem',
        border: '1px solid #333',
    },
};

export default Leaderboard;
