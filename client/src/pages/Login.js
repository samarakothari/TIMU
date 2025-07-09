// src/pages/Login.js
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom'; // ⬅️ Added Link for navigation

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [err, setErr] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/post'); // Redirect to Post after successful login
        } catch (error) {
            console.error(error);
            setErr('Login failed. Check your credentials.');
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

                {/* 👇 Add Sign Up Option */}
                <p style={styles.signupText}>
                    New here?{' '}
                    <Link to="/signup" style={styles.signupLink}>
                        Create an account ✨
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
};

export default Login;
