// src/pages/Home.js
import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = React.useState(false);

  React.useEffect(() => {
    const accepted = localStorage.getItem("timuAcceptedTerms");
    if (!accepted) {
      setShowModal(true);
    }

    const style = document.createElement("style");
    style.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700;800&display=swap');
            
            * { margin: 0; padding: 0; box-sizing: border-box; }
            
            body {
                background: #f1f5f9;
                color: #1e293b;
                font-family: 'Inter', sans-serif;
                overflow-x: hidden;
                min-height: 100vh;
            }
            
            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-6px); }
            }
            
            @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes gradientShift {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            
            @keyframes orbitFloat {
                0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
                33% { transform: translate(30px, -30px) rotate(120deg); }
                66% { transform: translate(-20px, 20px) rotate(240deg); }
            }
            
            .home-orb {
                position: fixed;
                border-radius: 50%;
                filter: blur(60px);
                z-index: -1;
                opacity: 0.4;
                animation: orbitFloat 12s ease-in-out infinite;
            }
            
            .home-orb:nth-child(1) {
                top: 15%;
                left: 10%;
                width: 200px;
                height: 200px;
                background: radial-gradient(circle, rgba(251, 113, 133, 0.3), transparent);
            }
            
            .home-orb:nth-child(2) {
                bottom: 20%;
                right: 15%;
                width: 250px;
                height: 250px;
                background: radial-gradient(circle, rgba(217, 70, 239, 0.25), transparent);
                animation-delay: -6s;
            }
            
            .home-orb:nth-child(3) {
                top: 50%;
                left: 70%;
                width: 150px;
                height: 150px;
                background: radial-gradient(circle, rgba(99, 102, 241, 0.2), transparent);
                animation-delay: -3s;
            }
            
            .home-container {
                animation: fadeInUp 0.8s ease-out;
            }
            
            /* Enhanced hover effects */
            @media (hover: hover) and (pointer: fine) {
                .home-button:hover {
                    background: rgba(255, 255, 255, 0.95) !important;
                    border-color: rgba(251, 113, 133, 0.4) !important;
                    transform: translateY(-3px) scale(1.02);
                    box-shadow: 0 12px 35px rgba(251, 113, 133, 0.15) !important;
                    color: #1e293b !important;
                }
                
                .home-title:hover {
                    transform: scale(1.02);
                    filter: drop-shadow(0 0 30px rgba(251, 113, 133, 0.4));
                }
            }
            
            /* Mobile optimizations */
            @media (max-width: 767px) {
                .home-container {
                    padding: 2rem 1rem !important;
                    min-height: 100vh !important;
                    justify-content: center !important;
                }
                
                .home-buttons {
                    gap: 0.75rem !important;
                    max-width: 100% !important;
                    padding: 0 !important;
                }
                
                .home-button {
                    padding: 14px 18px !important;
                    font-size: 0.9rem !important;
                }
                
                .modal-content {
                    padding: 1.5rem !important;
                    max-height: 85vh !important;
                    margin: 1rem !important;
                }
                
                .modal-text {
                    font-size: 0.85rem !important;
                    line-height: 1.6 !important;
                }
            }
            
            /* Tablet optimizations */
            @media (min-width: 768px) and (max-width: 1024px) {
                .home-container {
                    padding: 3rem 2rem !important;
                }
                
                .home-buttons {
                    max-width: 350px !important;
                }
            }
        `;
    document.head.appendChild(style);

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  const handleAgree = () => {
    localStorage.setItem("timuAcceptedTerms", "true");
    setShowModal(false);
  };

  return (
    <>
      <div className="home-orb"></div>
      <div className="home-orb"></div>
      <div className="home-orb"></div>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent} className="modal-content">
            <h2 style={styles.modalTitle}>📜 Terms & Privacy</h2>
            <div style={styles.modalScrollContainer}>
              <div style={styles.modalText} className="modal-text">
                <strong>Terms and Conditions</strong>
                <br />
                <br />
                Welcome to "TIMU". By accessing or utilizing "TIMU", you
                acknowledge and agree to be bound by the following Terms and
                Conditions.
                <br />
                <br />
                <strong>1. Use of the Application:</strong>
                <br />• Users must be at least 13 years of age to access or use
                the Application.
                <br />• Users must be under 21 years of age to post content on
                the Application.
                <br />• Users are solely responsible for their actions within
                the Application and any content they submit or share.
                <br />• The Application must not be used to engage in unlawful,
                harmful, or inappropriate behavior.
                <br />
                <br />
                <strong>2. Content Ownership:</strong>
                <br />• Users retain ownership of any content they submit.
                However, by posting content on "TIMU", users grant "TIMU" a
                worldwide, non-exclusive, royalty-free license to utilize,
                display, and distribute said content for operational and
                promotional purposes.
                <br />
                <br />
                <strong>3. Data Collection:</strong>
                <br />• "TIMU" collects user data, which may include
                user-generated content, usernames, and related metadata.
                <br />• This data may be used to enhance user experience,
                facilitate targeted advertising, and analyze overall application
                performance.
                <br />
                <br />
                <strong>4. Termination:</strong>
                <br />• "TIMU" reserves the right to suspend or permanently
                revoke a user's access to the Application at its sole
                discretion.
                <br />
                <br />
                <strong>5. Limitation of Liability:</strong>
                <br />• The Application is provided on an "as is" basis, without
                warranties of any kind.
                <br />• "TIMU" shall not be held liable for any damages arising
                out of your use of the Application.
                <br />
                <br />
                <strong>Privacy Policy</strong>
                <br />
                <br />
                <strong>1. Information Collected:</strong>
                <br />• "TIMU" may collect posts, likes, comments, IP addresses,
                device information, and session-related information.
                <br />
                <br />
                <strong>2. Use of Information:</strong>
                <br />• Collected information may be used to improve the
                Application's functionality and deliver personalized content.
                <br />
                <br />
                <strong>3. Cookies:</strong>
                <br />• "TIMU" utilizes digital cookies to enhance user
                experience for tracking and analytics purposes.
                <br />
                <br />
                <strong>4. Third-Party Sharing:</strong>
                <br />• "TIMU" may share anonymized data with trusted partners
                for analytical purposes.
                <br />
                <br />
                <strong>5. Data Retention:</strong>
                <br />• "TIMU" retains collected data only for as long as
                necessary. Users may request deletion of their data at any time.
              </div>
            </div>
            <button style={styles.modalButton} onClick={handleAgree}>
              ✅ I Agree, Enter TIMU
            </button>
          </div>
        </div>
      )}

      <div style={styles.container} className="home-container">
        <h1 style={styles.title} className="home-title">
          TIMU
        </h1>
        <p style={styles.subtitle}>Today I Messed Up</p>
        <div style={styles.buttonContainer} className="home-buttons">
          <button
            style={styles.button}
            className="home-button"
            onClick={() => navigate("/browse")}
          >
            🔍 Browse Chaos
          </button>
          <button
            style={styles.button}
            className="home-button"
            onClick={() => navigate("/post")}
          >
            📝 Post Your Regret
          </button>
          <button
            style={styles.button}
            className="home-button"
            onClick={() => navigate("/leaderboard")}
          >
            🏆 Leaderboard
          </button>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "clamp(2rem, 5vh, 4rem) clamp(1rem, 4vw, 2rem)",
    minHeight: "100vh",
    position: "relative",
    textAlign: "center",
  },

  title: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: "clamp(3rem, 12vw, 8rem)",
    fontWeight: "800",
    letterSpacing: "clamp(2px, 1vw, 6px)",
    marginBottom: "clamp(0.5rem, 2vh, 1rem)",
    cursor: "pointer",
    transition: "all 0.3s ease",
    background: "linear-gradient(135deg, #fb7185 0%, #d946ef 50%, #6366f1 100%)",
    backgroundSize: "400% 400%",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    color: "transparent",
    lineHeight: "1.1",
    animation: "float 4s ease-in-out infinite, gradientShift 6s ease infinite",
    filter: "drop-shadow(0 0 25px rgba(251, 113, 133, 0.3))",
  },

  subtitle: {
    fontSize: "clamp(1rem, 3vw, 1.5rem)",
    color: "#475569",
    fontWeight: "500",
    letterSpacing: "clamp(0.5px, 0.5vw, 1px)",
    marginBottom: "clamp(2rem, 5vh, 3rem)",
    fontFamily: "'Inter', sans-serif",
  },

  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "clamp(0.75rem, 2vh, 1rem)",
    maxWidth: "clamp(280px, 80vw, 320px)",
    width: "100%",
  },

  button: {
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(251, 113, 133, 0.15)",
    borderRadius: "16px",
    padding: "clamp(14px, 3vh, 18px) clamp(18px, 4vw, 26px)",
    color: "#1e293b",
    fontFamily: "'Inter', sans-serif",
    fontSize: "clamp(0.95rem, 2.5vw, 1.05rem)",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    position: "relative",
    overflow: "hidden",
    textAlign: "center",
    lineHeight: "1.4",
    letterSpacing: "0.5px",
    boxShadow: "0 4px 20px rgba(251, 113, 133, 0.08)",
    outline: "none",
  },

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    width: "100vw",
    backgroundColor: "rgba(30, 41, 59, 0.8)",
    backdropFilter: "blur(10px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    padding: "clamp(1rem, 5vw, 2rem)",
  },

  modalContent: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(203, 213, 225, 0.3)",
    borderRadius: "20px",
    padding: "clamp(1.5rem, 4vw, 2.5rem)",
    maxWidth: "clamp(320px, 90vw, 600px)",
    maxHeight: "clamp(400px, 80vh, 700px)",
    width: "100%",
    color: "#1e293b",
    fontFamily: "'Inter', sans-serif",
    boxShadow: "0 20px 40px rgba(30, 41, 59, 0.15)",
    display: "flex",
    flexDirection: "column",
  },

  modalTitle: {
    fontSize: "clamp(1.2rem, 4vw, 1.5rem)",
    fontWeight: "700",
    marginBottom: "1rem",
    background: "linear-gradient(135deg, #fb7185, #d946ef)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textAlign: "center",
  },

  modalScrollContainer: {
    flex: 1,
    overflowY: "auto",
    marginBottom: "1.5rem",
    paddingRight: "8px",
  },

  modalText: {
    fontSize: "clamp(0.85rem, 2vw, 0.95rem)",
    lineHeight: "1.6",
    color: "#475569",
    textAlign: "left",
  },

  modalButton: {
    background: "linear-gradient(135deg, rgba(251, 113, 133, 0.1), rgba(217, 70, 239, 0.08))",
    backdropFilter: "blur(20px)",
    border: "2px solid rgba(251, 113, 133, 0.2)",
    borderRadius: "16px",
    padding: "clamp(14px, 3vh, 18px)",
    color: "#1e293b",
    fontFamily: "'Inter', sans-serif",
    fontSize: "clamp(0.95rem, 2.5vw, 1.05rem)",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s ease",
    textAlign: "center",
    letterSpacing: "0.5px",
    boxShadow: "0 8px 25px rgba(251, 113, 133, 0.1)",
    outline: "none",
    width: "100%",
  },
};

export default Home;