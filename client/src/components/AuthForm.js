// AuthForm.js
import React, { useState } from 'react';

function AuthForm({ type, onSubmit, email, setEmail, password, setPassword }) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <form onSubmit={onSubmit} style={styles.form}>
            <h2 style={styles.title}>{type === 'login' ? '🔑 Login' : '🧾 Sign Up'}</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
            />
            <div style={styles.passwordWrapper}>
                <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ ...styles.input, paddingRight: '3rem' }}
                />
                <span onClick={() => setShowPassword(!showPassword)} style={styles.toggle}>
                    {showPassword ? '🙈' : '👁️'}
                </span>
            </div>
            <button type="submit" style={styles.button}>
                {type === 'login' ? 'Login' : 'Sign Up'}
            </button>
        </form>
    );
}

const styles = {
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
        padding: '0.75rem',
        fontSize: '1rem',
        borderRadius: '8px',
        backgroundColor: '#333',
        color: '#fff',
        cursor: 'pointer',
        border: 'none',
        transition: 'background 0.3s ease',
    },
    passwordWrapper: {
        position: 'relative',
    },
    toggle: {
        position: 'absolute',
        right: '1rem',
        top: '50%',
        transform: 'translateY(-50%)',
        cursor: 'pointer',
        color: '#888',
        fontSize: '1.2rem',
    },
};

export default AuthForm;