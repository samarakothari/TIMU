// src/pages/Login.js
import React, { useState } from 'react';
import {
    signInWithEmailAndPassword,
    sendPasswordResetEmail            // 👈 NEW
} from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [err, setErr] = useState('');
    const [showReset, setShowReset] = useState(false);   // 👈 NEW
    const [resetEmail, setResetEmail] = useState('');    // 👈 NEW
    const [resetMsg, setResetMsg] = useState('');        // 👈 NEW

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/post');
        } catch (error) {
            console.error(error);
            setErr('Login failed. Check your credentials.');
        }
    };

    const handleReset = async (e) => {
        e.preventDefault();
        try {
            await sendPasswordResetEmail(auth, resetEmail);
            setResetMsg('✅  Reset link sent! Check your inbox.');
        } catch (error) {
            console.error(error);
            setResetMsg('❌  Could not send reset email.');
        }
    };

    return (
        <div style={styles.page}>
            <form onSubmit={handleLogin} style={styles.form}>
                <h2 style={styles.title}>🔐 Login to TIMUU</h2>

                {err && <p style={styles.error}>{err}</p>}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                />

                <button type="submit" style={styles.button}>Login</button>

                {/* ---- Forgot‑password link ---- */}
                <p style={styles.forgotText}>
                    <button
                        type="button"
                        onClick={() => setShowReset(true)}
                        style={styles.forgotBtn}
                    >
                        Forgot password?
                    </button>
                </p>

                {/* ---- Sign‑up link ---- */}
                <p style={styles.signupText}>
                    New here?{' '}
                    <Link to="/signup" style={styles.signupLink}>
                        Create an account ✨
                    </Link>
                </p>
            </form>

            {/* -------- Password‑reset modal -------- */}
            {showReset && (
                <div style={styles.modalBackdrop}>
                    <div style={styles.modal}>
                        <h3 style={{ marginBottom: '1rem' }}>🔑 Reset password</h3>
                        {resetMsg && <p>{resetMsg}</p>}
                        {!resetMsg && (
                            <>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={resetEmail}
                                    required
                                    onChange={(e) => setResetEmail(e.target.value)}
                                    style={styles.input}
                                />
                                <button onClick={handleReset} style={styles.button}>
                                    Send reset link
                                </button>
                            </>
                        )}
                        <button
                            onClick={() => {
                                setShowReset(false);
                                setResetMsg('');
                                setResetEmail('');
                            }}
                            style={{ ...styles.button, backgroundColor: '#444', marginTop: '1rem' }}
                        >
                            Close
                        </button>
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
        padding: '2rem',
    },
    form: {
        maxWidth: '400px',
        margin: '2rem auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        backgroundColor: '#111',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 0 20px #222',
    },
    title: {
        textAlign: 'center',
        fontSize: '1.5rem',
        marginBottom: '1rem',
    },
    input: {
        padding: '0.75rem',
        fontSize: '1rem',
        borderRadius: '8px',
        border: '1px solid #555',
        backgroundColor: '#222',
        color: '#fff',
    },
    button: {
        padding: '0.75rem 1.5rem',
        fontSize: '1rem',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: '#ff5722',
        color: '#fff',
        cursor: 'pointer',
    },
    error: {
        color: '#ff5252',
    },
    signupText: {
        textAlign: 'center',
        marginTop: '1rem',
        fontSize: '0.9rem',
    },
    signupLink: {
        color: '#4fc3f7',
        textDecoration: 'none',
        fontWeight: 'bold',
    },
    forgotText: {
        textAlign: 'center',
        marginTop: '.5rem',
    },
    forgotBtn: {
        background: 'none',
        border: 'none',
        color: '#4fc3f7',
        cursor: 'pointer',
        textDecoration: 'underline',
        fontSize: '.9rem',
    },
    modalBackdrop: {
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
    modal: {
        background: '#111',
        padding: '2rem',
        borderRadius: '12px',
        maxWidth: '400px',
        width: '90%',
        boxShadow: '0 0 30px #000',
    },
};
export default Login;

