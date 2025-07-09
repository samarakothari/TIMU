// src/components/Navbar.js
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

// Load Comfortaa font
let fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;400;600;700&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

export default function Navbar() {
    useEffect(() => {
        // Handle hover effects only for non-touch devices
        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouch) return;

        let logoEl = document.querySelector('[data-logo]');
        let linkEls = document.querySelectorAll('[data-link]');

        if (logoEl) {
            logoEl.addEventListener('mouseenter', () => {
                logoEl.style.transform = 'scale(1.05) rotate(1deg)';
                logoEl.style.textShadow = '0 0 40px rgba(255, 107, 107, 0.5)';
            });
            logoEl.addEventListener('mouseleave', () => {
                logoEl.style.transform = 'scale(1) rotate(0deg)';
                logoEl.style.textShadow = '0 0 30px rgba(255, 107, 107, 0.3)';
            });
        }

        linkEls.forEach(link => {
            link.addEventListener('mouseenter', () => {
                link.style.color = '#ffffff';
                link.style.background = 'rgba(255, 255, 255, 0.15)';
                link.style.border = '1px solid rgba(255, 255, 255, 0.3)';
                link.style.transform = 'translateY(-2px)';
                link.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
            });
            link.addEventListener('mouseleave', () => {
                link.style.color = '#e0e0e0';
                link.style.background = 'rgba(255, 255, 255, 0.05)';
                link.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                link.style.transform = 'translateY(0)';
                link.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
            });
        });
    }, []);

    return (
        <nav style={styles.nav}>
            <Link to="/" style={styles.logo} data-logo>TIMU</Link>
            <div style={styles.links}>
                <Link to="/browse" style={styles.link} data-link>Browse</Link>
                <Link to="/post" style={styles.link} data-link>Post</Link>
                <Link to="/leaderboard" style={styles.link} data-link>Leaderboard</Link>
            </div>
        </nav>
    );
}

const styles = {
    nav: {
        background: 'linear-gradient(135deg,rgb(0, 0, 0) 0%, #2d2d2d 100%)',
        color: '#ffffff',
        padding: '1rem 5vw',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 40px rgba(255, 255, 255, 0.02)',
        position: 'sticky',
        top: 0,
        zIndex: 999,
        fontFamily: '"Comfortaa", sans-serif',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        flexWrap: 'wrap', // So it stacks on smaller screens
    },
    logo: {
        fontWeight: '700',
        fontSize: 'clamp(1.5rem, 5vw, 2rem)',
        color: 'transparent',
        background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        textDecoration: 'none',
        letterSpacing: '2px',
        textShadow: '0 0 30px rgba(255, 107, 107, 0.3)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
    },
    links: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        flexWrap: 'wrap',
        marginTop: '0.5rem',
    },
    link: {
        color: '#e0e0e0',
        textDecoration: 'none',
        fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)',
        fontWeight: '400',
        padding: '0.5rem 1rem',
        borderRadius: '12px',
        position: 'relative',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'all 0.3s ease-in-out',
        backdropFilter: 'blur(5px)',
        overflow: 'hidden',
        cursor: 'pointer',
        transform: 'translateY(0)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
};
