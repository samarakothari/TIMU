// src/pages/Login.js
import React, { useState } from 'react';
import {
    signInWithEmailAndPassword,
    updatePassword,
    signInWithEmailLink,
    getAuth,
} from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';

/**
 * ⚠️  NOTE for devs
 * A true password‑reset flow *without* an email link requires privileged
 * server‑side code (e.g. Firebase Admin SDK) to verify the user’s identity
 * and issue a custom token. On the client alone we can only offer a *fake*
 * reset experience. Here we choose a pragmatic middle‑ground:
 *   1. Ask the user for their e‑mail *and* a brand‑new password.
 *   2. Attempt to sign‑in using a temporary password we keep in an ENV var
 *      reserved for exactly this purpose (e.g. REACT_APP_TEMP_PW).
 *   3. If that succeeds we immediately call updatePassword() with the user’s
 *      chosen new password.
 *   4. Finally we force the user to log‑in again with the freshly created pw.
 *
 * You **must** have already set each user’s password to the same temp value
 * (or otherwise guaranteed re‑authentication). For production you should
 * absolutely stick with sendPasswordResetEmail().
 */

function Login() {
    const navigate = useNavigate();

    // ─────────────────────────── State ──────────────────────────
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [err, setErr] = useState('');

    const [showReset, setShowReset] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [newPw, setNewPw] = useState('');
    const [newPw2, setNewPw2] = useState('');
    const [resetMsg, setResetMsg] = useState('');

    // ────────────────────────── Login ───────────────────────────
    const handleLogin = async (e) => {
        e.preventDefault();
        setErr('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/post');
        } catch (error) {
            console.error(error);
            setErr('Login failed. Check your credentials.');
        }
    };

    // ──────────────────────── Fake‑reset ────────────────────────
    const handleFakeReset = async (e) => {
        e.preventDefault();
        setResetMsg('');

        if (newPw !== newPw2) {
            setResetMsg('❌  Passwords do not match.');
            return;
        }

        try {
            // 1️⃣ Sign‑in with universal temporary password
            const tempPw = process.env.REACT_APP_TEMP_PW;
            const { user } = await signInWithEmailAndPassword(auth, resetEmail, tempPw);

            // 2️⃣ Update to the new password
            await updatePassword(user, newPw);
            setResetMsg('✅  Password updated! You can now log in ✨');
        } catch (error) {
            console.error(error);
            setResetMsg('❌  Could not reset password. Is the e‑mail correct?');
        }
    };

    // ─────────────────────────── UI ────────────────────────────
    return (
        <div style={styles.page}>
            {/* ────────────── Login form ────────────── */}
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

                <button type="submit" style={styles.button}>
                    Login
                </button>

                {/* Forgot‑password link */}
                <p style={styles.forgotText}>
                    <button
                        type="button"
                        onClick={() => setShowReset(true)}
                        style={styles.forgotBtn}
                    >
                        Forgot password?
                    </button>
                </p>

                {/* Sign‑up link */}
                <p style={styles.signupText}>
                    New here?{' '}
                    <Link to="/signup" style={styles.signupLink}>
                        Create an account ✨
                    </Link>
                </p>
            </form>

            {/* ──────────── Reset modal ──────────── */}
            {showReset && (
                <div style={styles.modalBackdrop}>
                    <div style={styles.modal}>
                        <h3 style={{ marginBottom: '1rem' }}>🔑 Set a new password</h3>

                        {resetMsg && <p>{resetMsg}</p>}

                        {!resetMsg && (
                            <form onSubmit={handleFakeReset} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    value={resetEmail}
                                    required
                                    onChange={(e) => setResetEmail(e.target.value)}
                                    style={styles.input}
                                />
                                <input
                                    type="password"
                                    placeholder="New password"
                                    value={newPw}
                                    required
                                    onChange={(e) => setNewPw(e.target.value)}
                                    style={styles.input}
                                />
                                <input
                                    type="password"
                                    placeholder="Confirm new password"
                                    value={newPw2}
                                    required
                                    onChange={(e) => setNewPw2(e.target.value)}
                                    style={styles.input}
                                />
                                <button type="submit" style={styles.button}>
                                    Save new password
                                </button>
                            </form>
                        )}

                        <button
                            onClick={() => {
                                setShowReset(false);
                                setResetMsg('');
                                setResetEmail('');
                                setNewPw('');
                                setNewPw2('');
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

// ────────────────────────── Styles ───────────────────────────
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
