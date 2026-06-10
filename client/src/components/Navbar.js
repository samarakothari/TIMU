// src/components/Navbar.js
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [activeLink, setActiveLink] = useState(window.location.pathname);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap');
            
            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-2px); }
            }
            
            @keyframes glow {
                0%, 100% { box-shadow: 0 0 15px rgba(251, 113, 133, 0.2); }
                50% { box-shadow: 0 0 20px rgba(217, 70, 239, 0.3); }
            }
            
            @keyframes slideDown {
                from { opacity: 0; transform: translateY(-20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes modalSlideIn {
                from { 
                    opacity: 0; 
                    transform: translateX(100%); 
                }
                to { 
                    opacity: 1; 
                    transform: translateX(0); 
                }
            }

            @keyframes modalSlideOut {
                from { 
                    opacity: 1; 
                    transform: translateX(0); 
                }
                to { 
                    opacity: 0; 
                    transform: translateX(100%); 
                }
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }

            @keyframes hamburgerToX1 {
                0% { transform: rotate(0deg) translateY(0); }
                50% { transform: rotate(0deg) translateY(8px); }
                100% { transform: rotate(45deg) translateY(8px); }
            }

            @keyframes hamburgerToX2 {
                0% { opacity: 1; transform: scaleX(1); }
                50% { opacity: 0; transform: scaleX(0.8); }
                100% { opacity: 0; transform: scaleX(0); }
            }

            @keyframes hamburgerToX3 {
                0% { transform: rotate(0deg) translateY(0); }
                50% { transform: rotate(0deg) translateY(-8px); }
                100% { transform: rotate(-45deg) translateY(-8px); }
            }

            @keyframes xToHamburger1 {
                0% { transform: rotate(45deg) translateY(8px); }
                50% { transform: rotate(0deg) translateY(8px); }
                100% { transform: rotate(0deg) translateY(0); }
            }

            @keyframes xToHamburger2 {
                0% { opacity: 0; transform: scaleX(0); }
                50% { opacity: 0; transform: scaleX(0.8); }
                100% { opacity: 1; transform: scaleX(1); }
            }

            @keyframes xToHamburger3 {
                0% { transform: rotate(-45deg) translateY(-8px); }
                50% { transform: rotate(0deg) translateY(-8px); }
                100% { transform: rotate(0deg) translateY(0); }
            }
            
            .navbar-orb {
                position: absolute;
                width: 120px;
                height: 120px;
                border-radius: 50%;
                filter: blur(40px);
                z-index: -1;
                opacity: 0.3;
            }
            
            .navbar-orb:nth-child(1) {
                top: -30%;
                left: 20%;
                background: radial-gradient(circle, rgba(251, 113, 133, 0.3), transparent);
                animation: float 4s ease-in-out infinite;
            }
            
            .navbar-orb:nth-child(2) {
                top: -30%;
                right: 20%;
                background: radial-gradient(circle, rgba(217, 70, 239, 0.25), transparent);
                animation: float 6s ease-in-out infinite reverse;
            }
            
            .navbar-container {
                animation: slideDown 0.6s ease-out;
            }

            .mobile-menu-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 9999;
                animation: fadeIn 0.3s ease-out;
            }

            .mobile-menu-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(30, 41, 59, 0.6);
                backdrop-filter: blur(8px);
            }

            .mobile-menu-content {
                position: absolute;
                top: 0;
                right: 0;
                height: 100vh;
                width: 280px;
                max-width: 85vw;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(20px);
                border-left: 1px solid rgba(203, 213, 225, 0.3);
                animation: modalSlideIn 0.3s ease-out;
                display: flex;
                flex-direction: column;
                padding: 2rem 1.5rem;
                box-shadow: -10px 0 25px rgba(30, 41, 59, 0.1);
            }

            .mobile-menu-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 2rem;
                padding-bottom: 1rem;
                border-bottom: 1px solid rgba(203, 213, 225, 0.2);
            }

            .mobile-menu-links {
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
                flex: 1;
            }

            .mobile-menu-link {
                padding: 1rem;
                border-radius: 12px;
                border: 1px solid rgba(203, 213, 225, 0.2);
                text-decoration: none;
                color: #475569;
                font-weight: 600;
                font-size: 1rem;
                display: flex;
                align-items: center;
                gap: 0.75rem;
                transition: all 0.2s ease;
                background: rgba(248, 250, 252, 0.8);
                backdrop-filter: blur(10px);
            }

            .mobile-menu-link:hover {
                background: rgba(251, 113, 133, 0.08);
                border-color: rgba(251, 113, 133, 0.2);
                transform: translateX(-4px);
                color: #1e293b;
            }

            .mobile-menu-link.active {
                background: rgba(251, 113, 133, 0.1);
                border-color: rgba(251, 113, 133, 0.3);
                color: #1e293b;
                box-shadow: 0 4px 15px rgba(251, 113, 133, 0.1);
            }

            .hamburger-menu {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                width: 24px;
                height: 24px;
                cursor: pointer;
                padding: 4px;
                border-radius: 6px;
                transition: all 0.2s ease;
                background: rgba(248, 250, 252, 0.8);
                border: 1px solid rgba(203, 213, 225, 0.2);
            }

            .hamburger-menu:hover {
                background: rgba(251, 113, 133, 0.08);
                border-color: rgba(251, 113, 133, 0.2);
            }

            .hamburger-line {
                width: 16px;
                height: 2px;
                background: #475569;
                border-radius: 1px;
                transition: all 0.3s ease;
                transform-origin: center;
            }

            .hamburger-line:nth-child(2) {
                margin: 3px 0;
            }

            .hamburger-menu.open .hamburger-line:nth-child(1) {
                animation: hamburgerToX1 0.3s ease-out forwards;
            }

            .hamburger-menu.open .hamburger-line:nth-child(2) {
                animation: hamburgerToX2 0.3s ease-out forwards;
            }

            .hamburger-menu.open .hamburger-line:nth-child(3) {
                animation: hamburgerToX3 0.3s ease-out forwards;
            }

            .hamburger-menu:not(.open) .hamburger-line:nth-child(1) {
                animation: xToHamburger1 0.3s ease-out forwards;
            }

            .hamburger-menu:not(.open) .hamburger-line:nth-child(2) {
                animation: xToHamburger2 0.3s ease-out forwards;
            }

            .hamburger-menu:not(.open) .hamburger-line:nth-child(3) {
                animation: xToHamburger3 0.3s ease-out forwards;
            }
            
            /* Responsive hover effects */
            @media (hover: hover) and (pointer: fine) {
                .nav-link:hover {
                    background: rgba(251, 113, 133, 0.1) !important;
                    border-color: rgba(251, 113, 133, 0.3) !important;
                    transform: translateY(-2px) scale(1.02);
                    box-shadow: 0 8px 20px rgba(251, 113, 133, 0.15) !important;
                    color: #1e293b !important;
                }
                
                .nav-logo:hover {
                    transform: scale(1.05) rotate(1deg);
                }
                
                .nav-link:hover .link-icon {
                    transform: scale(1.1) rotate(3deg);
                }
            }
            
            /* Mobile optimizations */
            @media (max-width: 767px) {
                .nav-container {
                    justify-content: space-between !important;
                }
                
                .nav-links {
                    display: none !important;
                }

                .mobile-menu-toggle {
                    display: flex !important;
                }
                
                .nav-logo-subtitle {
                    display: none !important;
                }

                body.menu-open {
                    overflow: hidden;
                }
            }

            /* Desktop - hide hamburger menu */
            @media (min-width: 768px) {
                .mobile-menu-toggle {
                    display: none !important;
                }
            }
            
            /* Tablet optimizations */
            @media (min-width: 768px) and (max-width: 1024px) {
                .nav-container {
                    padding: 0 1.5rem !important;
                }
                
                .nav-link {
                    padding: 9px 14px !important;
                    font-size: 0.85rem !important;
                }
            }
        `;
        document.head.appendChild(style);

        const handleScroll = () => {
            setScrolled(window.scrollY > 30);
        };

        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setMobileMenuOpen(false);
                document.body.classList.remove('menu-open');
            }
        };

        const handleLocationChange = () => {
            setActiveLink(window.location.pathname);
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);
        window.addEventListener('popstate', handleLocationChange);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('popstate', handleLocationChange);
            document.body.classList.remove('menu-open');
            if (document.head.contains(style)) {
                document.head.removeChild(style);
            }
        };
    }, []);

    // Handle mobile menu toggle
    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
        if (!mobileMenuOpen) {
            document.body.classList.add('menu-open');
        } else {
            document.body.classList.remove('menu-open');
        }
    };

    // Handle mobile menu link click
    const handleMobileLinkClick = (href) => {
        setActiveLink(href);
        setMobileMenuOpen(false);
        document.body.classList.remove('menu-open');
    };

    // Close mobile menu when clicking overlay
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            setMobileMenuOpen(false);
            document.body.classList.remove('menu-open');
        }
    };

    const getNavStyle = () => ({
        ...styles.nav,
        background: scrolled 
            ? 'rgba(255, 255, 255, 0.95)' 
            : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        boxShadow: scrolled 
            ? '0 8px 32px rgba(30, 41, 59, 0.08)' 
            : '0 4px 20px rgba(30, 41, 59, 0.04)',
        borderBottom: scrolled 
            ? '1px solid rgba(203, 213, 225, 0.3)' 
            : '1px solid rgba(203, 213, 225, 0.2)',
        padding: 'clamp(0.75rem, 2vw, 1rem) clamp(1rem, 4vw, 2rem)',
    });

    const getLinkStyle = (href) => {
        const isActive = href === activeLink;
        return {
            ...styles.link,
            background: isActive 
                ? 'rgba(251, 113, 133, 0.1)'
                : 'rgba(248, 250, 252, 0.8)',
            borderColor: isActive 
                ? 'rgba(251, 113, 133, 0.3)'
                : 'rgba(203, 213, 225, 0.2)',
            color: isActive 
                ? '#1e293b'
                : '#475569',
            boxShadow: isActive 
                ? '0 4px 15px rgba(251, 113, 133, 0.1)'
                : '0 2px 10px rgba(30, 41, 59, 0.05)',
            padding: 'clamp(8px, 2vw, 10px) clamp(12px, 3vw, 16px)',
            fontSize: 'clamp(0.75rem, 2vw, 0.9rem)',
        };
    };

    return (
        <>
            <nav style={getNavStyle()} className="navbar-container">
                <div className="navbar-orb"></div>
                <div className="navbar-orb"></div>
                
                <div style={styles.navContainer} className="nav-container">
                    <Link 
                        to="/" 
                        style={styles.logoContainer}
                        className="nav-logo"
                        onClick={() => setActiveLink('/')}
                    >
                        <div style={styles.logoIcon}>✨</div>
                        <div style={styles.logoText} className="nav-logo-text">
                            <span style={styles.logoMain}>TIMU</span>
                            <span style={styles.logoSubtitle} className="nav-logo-subtitle">
                                Today I Messed Up
                            </span>
                        </div>
                    </Link>
                    
                    {/* Desktop Navigation Links */}
                    <div style={styles.links} className="nav-links">
                        <Link 
                            to="/browse" 
                            style={getLinkStyle('/browse')} 
                            className="nav-link"
                            onClick={() => setActiveLink('/browse')}
                        >
                            <span style={styles.linkIcon} className="link-icon">🌌</span>
                            <span style={styles.linkText}>Browse</span>
                        </Link>
                        
                        <Link 
                            to="/post" 
                            style={getLinkStyle('/post')} 
                            className="nav-link"
                            onClick={() => setActiveLink('/post')}
                        >
                            <span style={styles.linkIcon} className="link-icon">✍️</span>
                            <span style={styles.linkText}>Post</span>
                        </Link>
                        
                        <Link 
                            to="/leaderboard" 
                            style={getLinkStyle('/leaderboard')} 
                            className="nav-link"
                            onClick={() => setActiveLink('/leaderboard')}
                        >
                            <span style={styles.linkIcon} className="link-icon">🏆</span>
                            <span style={styles.linkText}>Leaderboard</span>
                        </Link>

                        <Link 
                            to="/privacy" 
                            style={getLinkStyle('/privacy')} 
                            className="nav-link"
                            onClick={() => setActiveLink('/privacy')}
                        >
                            <span style={styles.linkIcon} className="link-icon">🔒</span>
                            <span style={styles.linkText}>Privacy</span>
                        </Link>
                    </div>

                    {/* Mobile Hamburger Menu Toggle */}
                    <div 
                        className={`hamburger-menu mobile-menu-toggle ${mobileMenuOpen ? 'open' : ''}`}
                        onClick={toggleMobileMenu}
                        style={{display: 'none'}}
                    >
                        <div className="hamburger-line"></div>
                        <div className="hamburger-line"></div>
                        <div className="hamburger-line"></div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Modal */}
            {mobileMenuOpen && (
                <div className="mobile-menu-modal">
                    <div className="mobile-menu-overlay" onClick={handleOverlayClick}></div>
                    <div className="mobile-menu-content">
                        <div className="mobile-menu-header">
                            <div style={styles.modalLogo}>
                                <div style={styles.logoIcon}>✨</div>
                                <span style={styles.modalLogoText}>TIMU</span>
                            </div>
                            <div 
                                className={`hamburger-menu ${mobileMenuOpen ? 'open' : ''}`}
                                onClick={toggleMobileMenu}
                            >
                                <div className="hamburger-line"></div>
                                <div className="hamburger-line"></div>
                                <div className="hamburger-line"></div>
                            </div>
                        </div>
                        
                        <div className="mobile-menu-links">
                            <Link 
                                to="/browse"
                                className={`mobile-menu-link ${activeLink === '/browse' ? 'active' : ''}`}
                                onClick={() => handleMobileLinkClick('/browse')}
                            >
                                <span style={styles.mobileLinkIcon}>🌌</span>
                                <span>Browse</span>
                            </Link>
                            
                            <Link 
                                to="/post"
                                className={`mobile-menu-link ${activeLink === '/post' ? 'active' : ''}`}
                                onClick={() => handleMobileLinkClick('/post')}
                            >
                                <span style={styles.mobileLinkIcon}>✍️</span>
                                <span>Post</span>
                            </Link>
                            
                            <Link 
                                to="/leaderboard"
                                className={`mobile-menu-link ${activeLink === '/leaderboard' ? 'active' : ''}`}
                                onClick={() => handleMobileLinkClick('/leaderboard')}
                            >
                                <span style={styles.mobileLinkIcon}>🏆</span>
                                <span>Leaderboard</span>
                            </Link>

                            <Link 
                                to="/privacy"
                                className={`mobile-menu-link ${activeLink === '/privacy' ? 'active' : ''}`}
                                onClick={() => handleMobileLinkClick('/privacy')}
                            >
                                <span style={styles.mobileLinkIcon}>🔒</span>
                                <span>Privacy</span>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

const styles = {
    nav: {
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        fontFamily: "'Inter', sans-serif",
        transition: 'all 0.3s ease',
        overflow: 'hidden',
    },
    
    navContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 2,
        gap: 'clamp(1rem, 4vw, 2rem)',
    },
    
    logoContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: 'clamp(0.5rem, 2vw, 0.75rem)',
        textDecoration: 'none',
        transition: 'all 0.2s ease',
        animation: 'float 4s ease-in-out infinite',
        cursor: 'pointer',
        padding: '0.25rem',
        borderRadius: '12px',
    },
    
    logoIcon: {
        fontSize: 'clamp(1.5rem, 4vw, 2rem)',
        filter: 'drop-shadow(0 0 15px rgba(251, 113, 133, 0.3))',
        animation: 'float 3s ease-in-out infinite',
    },
    
    logoText: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.1rem',
    },
    
    logoMain: {
        fontSize: 'clamp(2rem, 5vw, 2.5rem)',
        fontWeight: '800',
        background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f97316 100%)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        letterSpacing: 'clamp(1px, 1vw, 2px)',
        fontFamily: "'Space Grotesk', sans-serif",
        lineHeight: '1',
        filter: 'drop-shadow(0 0 10px rgba(251, 113, 133, 0.2))',
    },
    
    logoSubtitle: {
        fontSize: 'clamp(0.5rem, 1.5vw, 0.6rem)',
        fontWeight: '500',
        color: '#94a3b8',
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
        lineHeight: '1',
    },
    
    links: {
        display: 'flex',
        alignItems: 'center',
        gap: 'clamp(0.4rem, 2vw, 0.75rem)',
        flexWrap: 'wrap',
    },
    
    link: {
        position: 'relative',
        textDecoration: 'none',
        fontWeight: '600',
        borderRadius: '12px',
        border: '1px solid',
        transition: 'all 0.2s ease',
        backdropFilter: 'blur(10px)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 'clamp(4px, 1vw, 6px)',
        fontFamily: "'Inter', sans-serif",
        letterSpacing: '0.25px',
        minWidth: 'fit-content',
        justifyContent: 'center',
        whiteSpace: 'nowrap',
    },
    
    linkIcon: {
        fontSize: 'clamp(0.9rem, 2vw, 1rem)',
        filter: 'drop-shadow(0 1px 2px rgba(30, 41, 59, 0.1))',
        transition: 'transform 0.2s ease',
    },
    
    linkText: {
        fontWeight: '600',
        fontSize: 'inherit',
    },

    modalLogo: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    },

    modalLogoText: {
        fontSize: '1.5rem',
        fontWeight: '800',
        background: 'linear-gradient(135deg, #fb7185 0%, #d946ef 50%, #6366f1 100%)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontFamily: "'Space Grotesk', sans-serif",
        filter: 'drop-shadow(0 0 10px rgba(251, 113, 133, 0.2))',
    },

    mobileLinkIcon: {
        fontSize: '1.25rem',
        filter: 'drop-shadow(0 1px 2px rgba(30, 41, 59, 0.1))',
    },
};