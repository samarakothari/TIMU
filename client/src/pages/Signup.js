// src/pages/Signup.js
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [err, setErr] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate('/post'); // 🔁 after signup, go to post page
        } catch (error) {
            console.error(error);
            switch (error.code) {
                case 'auth/email-already-in-use':
                    setErr('That email is already registered!');
                    break;
                case 'auth/invalid-email':
                    setErr('That email is not valid.');
                    break;
                case 'auth/weak-password':
                    setErr('Password should be at least 6 characters.');
                    break;
                default:
                    setErr('Signup failed. Please try again.');
            }
        }
    };

    return (
        <div style={styles.page}>
            <form onSubmit={handleSignup} style={styles.form}>
                <h2 style={styles.title}>🧁 Create a TIMUU Account</h2>
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
                <button type="submit" style={styles.button}>Sign Up</button>
                <p style={styles.loginText}>
                    Already have an account?{' '}
                    <Link to="/login" style={styles.loginLink}>
                        Login here ✨
                    </Link>
                </p>
            </form>
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
        backgroundColor: '#4caf50',
        color: '#fff',
        cursor: 'pointer',
    },
    error: {
        color: '#ff5252',
    },
    loginText: {
        textAlign: 'center',
        marginTop: '1rem',
        fontSize: '0.9rem',
    },
    loginLink: {
        color: '#4fc3f7',
        textDecoration: 'none',
        fontWeight: 'bold',
    },
};

export default Signup;
