// src/pages/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();
    const [showModal, setShowModal] = React.useState(false);

    React.useEffect(() => {
        const accepted = localStorage.getItem('timuAcceptedTerms');
        if (!accepted) {
            setShowModal(true);
        }

        const style = document.createElement('style');
        style.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Anton&family=Comfortaa:wght@300;400;500;600;700&display=swap');
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                background-color: rgb(0, 0, 0);
                color: rgb(244, 238, 238);
                font-family: 'Comfortaa', sans-serif;
                overflow-x: hidden;
                min-height: 100vh;
            }
            @keyframes slideUp {
                from { opacity: 0; transform: translateY(40px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
            }
        `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    const handleAgree = () => {
        localStorage.setItem('timuAcceptedTerms', 'true');
        setShowModal(false);
    };

    const containerStyle = {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '5vh 5vw',
        position: 'relative',
        background: `
            radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.02) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.02) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(255, 255, 255, 0.02) 0%, transparent 50%)
        `,
    };

    const titleStyle = {
        fontFamily: 'Anton, sans-serif',
        fontSize: 'clamp(60px, 15vw, 120px)',
        fontWeight: 400,
        letterSpacing: '4px',
        marginBottom: '10px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        animation: 'float 3s ease-in-out infinite',
        background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        color: 'transparent',
        maxWidth: '90vw',
        textAlign: 'center',
        lineHeight: 1.1,
    };

    const subtitleStyle = {
        fontSize: 'clamp(16px, 4vw, 24px)',
        color: '#e0e0e0',
        fontWeight: 400,
        letterSpacing: '1px',
        marginBottom: '30px',
        textAlign: 'center',
        padding: '0 10px',
    };

    const buttonContainerStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        animation: 'slideUp 0.8s ease-out 0.3s both',
        maxWidth: '300px',
        width: '100%',
    };

    const buttonStyle = {
        background: 'linear-gradient(135deg, rgba(31, 31, 34, 0.8), rgba(45, 45, 48, 0.6))',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '18px 24px',
        color: '#ffffff',
        fontFamily: "'Comfortaa', sans-serif",
        fontSize: '16px',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        backdropFilter: 'blur(10px)',
    };

    const modalOverlay = {
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: '100vw',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    };

    const modalStyle = {
        backgroundColor: '#1e1e1e',
        padding: '30px',
        borderRadius: '16px',
        maxWidth: '90vw',
        maxHeight: '80vh',
        overflowY: 'auto',
        color: '#fff',
        fontFamily: "'Comfortaa', sans-serif",
        textAlign: 'left',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
    };

    return (
        <>
            {showModal && (
                <div style={modalOverlay}>
                    <div style={modalStyle}>
                        <h2 style={{ marginBottom: '12px' }}>📜 Terms & Privacy</h2>
                        <p style={{ marginBottom: '16px', whiteSpace: 'pre-wrap' }}>
                            <strong>Terms and Conditions</strong>
                            {'\n\n'}
                            Welcome to Timu. By accessing or utilizing Timu, you acknowledge and agree to be bound by the following Terms and Conditions.

                            {'\n\n'}1. Use of the Application:
                            - Users must be at least 13 years of age to access or use the Application.
                            - Users are solely responsible for their actions within the Application and any content they submit or share.
                            - The Application must not be used to engage in unlawful, harmful, or inappropriate behavior, including but not limited to the dissemination of explicit material.

                            {'\n\n'}2. Content Ownership:
                            - Users retain ownership of any content they submit. However, by posting content on Timu, users grant Timu a worldwide, non-exclusive, royalty-free license to utilize, display, and distribute said content for operational and promotional purposes.

                            {'\n\n'}3. Data Collection:
                            - Timu collects user data, which may include, but is not limited to: user-generated content, usernames, and related metadata.
                            - This data may be used to enhance user experience, facilitate targeted advertising, and analyze overall application performance.
                            - For detailed information, please refer to the Privacy Policy below.

                            {'\n\n'}4. Termination:
                            - Timu reserves the right to suspend or permanently revoke a user's access to the Application, and/or remove any content at its sole discretion, particularly in instances of misconduct, violation of these Terms, or inappropriate behavior.

                            {'\n\n'}5. Limitation of Liability:
                            - The Application is provided on an "as is" basis, without warranties of any kind, either express or implied.
                            - Timu shall not be held liable for any direct, indirect, incidental, consequential, or punitive damages arising out of your use of the Application.

                            {'\n\n'}<strong>Privacy Policy</strong>

                            {'\n\n'}1. Information Collected:
                            - Timu may collect a range of data, including but not limited to: posts, likes, comments, IP addresses, device information, browser type, geolocation data (when permitted), and session-related information.

                            {'\n\n'}2. Use of Information:
                            - Collected information may be used to improve the Application’s functionality, detect misuse, deliver personalized content, and potentially provide advertisements.

                            {'\n\n'}3. Cookies:
                            - Timu utilizes digital cookies to enhance user experience. These cookies are used for tracking, analytics, and functionality purposes.

                            {'\n\n'}4. Third-Party Sharing:
                            - Timu may share anonymized or aggregated data with trusted third-party partners for analytical purposes. No personally identifiable information will be sold or disclosed without consent, except as required by law.

                            {'\n\n'}5. Data Retention:
                            - Timu retains collected data only for as long as necessary to fulfill the purposes for which it was collected, or as required by law. Users may request deletion of their data at any time.

                            {'\n\n'}By continuing to access or use Timu, you affirm your acceptance of this Privacy Policy. If you do not agree with these terms, you are advised to discontinue use of the Application.
                        </p>

                        <button style={buttonStyle} onClick={handleAgree}>
                            ✅ I Agree, Enter Timu
                        </button>
                    </div>
                </div>
            )}

            <div style={containerStyle}>
                <h1 style={titleStyle}>TIMU</h1>
                <p style={subtitleStyle}>Today I Messed Up</p>


                <div style={buttonContainerStyle}>
                    <button style={buttonStyle} onClick={() => navigate('/browse')}>
                        🔍 Browse Chaos
                    </button>
                    <button style={buttonStyle} onClick={() => navigate('/post')}>
                        📝 Post Your Regret
                    </button>
                    <button style={buttonStyle} onClick={() => navigate('/leaderboard')}>
                        🏆 Leaderboard
                    </button>
                </div>
            </div>
        </>
    );
}

export default Home;
