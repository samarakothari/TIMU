// src/pages/Eula.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Eula() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);

    const style = document.createElement("style");
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;600;700&display=swap');
      
      * { margin: 0; padding: 0; box-sizing: border-box; }
      
      body {
        background: #f1f5f9;
        color: #1e293b;
        font-family: 'Inter', sans-serif;
        overflow-x: hidden;
        min-height: 100vh;
      }

      @keyframes orbitFloat {
        0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
        33% { transform: translate(30px, -30px) rotate(120deg); }
        66% { transform: translate(-20px, 20px) rotate(240deg); }
      }

      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-6px); }
      }

      .eula-orb {
        position: fixed;
        border-radius: 50%;
        filter: blur(60px);
        z-index: -1;
        opacity: 0.35;
        animation: orbitFloat 12s ease-in-out infinite;
      }

      .eula-orb:nth-child(1) {
        top: 10%;
        left: 5%;
        width: 180px;
        height: 180px;
        background: radial-gradient(circle, rgba(168, 85, 247, 0.3), transparent);
      }

      .eula-orb:nth-child(2) {
        bottom: 15%;
        right: 5%;
        width: 220px;
        height: 220px;
        background: radial-gradient(circle, rgba(236, 72, 153, 0.25), transparent);
        animation-delay: -4s;
      }

      .eula-orb:nth-child(3) {
        top: 50%;
        left: 75%;
        width: 140px;
        height: 140px;
        background: radial-gradient(circle, rgba(59, 130, 246, 0.2), transparent);
        animation-delay: -8s;
      }

      .back-btn:hover {
        background: rgba(255, 255, 255, 0.9) !important;
        border-color: rgba(168, 85, 247, 0.3) !important;
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(168, 85, 247, 0.1) !important;
        color: #1e293b !important;
      }

      .interactive-card {
        transition: all 0.3s ease;
      }

      .interactive-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 12px 30px rgba(30, 41, 59, 0.08) !important;
        border-color: rgba(168, 85, 247, 0.25) !important;
      }

      @media (max-width: 767px) {
        .eula-page-container {
          padding: 1.5rem 1rem !important;
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

  return (
    <div style={styles.page} className="eula-page-container">
      {/* Background Orbs */}
      <div className="eula-orb"></div>
      <div className="eula-orb"></div>
      <div className="eula-orb"></div>

      {/* Header section */}
      <div style={styles.header}>
        <button 
          onClick={() => navigate(-1)} 
          style={styles.backButton}
          className="back-btn"
        >
          ← Go Back
        </button>

        <h1 style={styles.title}>
          <span style={styles.titleGradient}>End User License Agreement</span>
        </h1>
        <p style={styles.subtitle}>
          Please read this EULA carefully before registering, logging in, or uploading content to TIMU.
        </p>
      </div>

      {/* Main Content Card */}
      <div style={styles.cardContainer}>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={styles.content}
        >
          <div style={styles.alertCard}>
            <span style={styles.alertIcon}>⚠️</span>
            <div>
              <strong style={styles.alertTitle}>Zero Tolerance Safety Policy</strong>
              <p style={styles.alertText}>
                TIMU enforces a zero-tolerance policy against objectionable content and abusive behavior. If you violate this agreement, your content will be removed instantly and your account will be permanently banned.
              </p>
            </div>
          </div>

          <h3 style={styles.sectionHeading}>1. Acceptance of Terms</h3>
          <p style={styles.paragraph}>
            By creating an account, logging into, or using the TIMU mobile application or website, you agree to be bound by the terms of this End User License Agreement (EULA). If you do not agree, do not use the application.
          </p>

          <h3 style={styles.sectionHeading}>2. Age Requirements</h3>
          <p style={styles.paragraph}>
            You must be at least 13 years of age to access or use the application. If you are under 21 years of age, you may post stories. All users must comply fully with our community guidelines.
          </p>

          <h3 style={styles.sectionHeading}>3. User-Generated Content Rules</h3>
          <p style={styles.paragraph}>
            TIMU allows users to upload, post, and share stories anonymously. You retain ownership of your content, but you grant TIMU a license to display it. You are solely responsible for the content you post.
          </p>
          <p style={styles.paragraph}>
            <strong>You MUST NOT post or transmit any content that:</strong>
          </p>
          <ul style={styles.list}>
            <li>Contains obscene, profane, vulgar, or sexually explicit language or imagery.</li>
            <li>Contains hate speech, slurs, defamation, or targets individuals or protected groups.</li>
            <li>Harasses, bullies, threatens, or incites violence against any person.</li>
            <li>Promotes illegal activities, dangerous acts, self-harm, or substance abuse.</li>
            <li>Infringes on the intellectual property, privacy, or publicity rights of others.</li>
            <li>Contains spam, ads, links to malicious websites, or phishing attempts.</li>
          </ul>

          <h3 style={styles.sectionHeading}>4. Moderation, Flagging, and Blocking</h3>
          <p style={styles.paragraph}>
            To protect our community, we provide built-in tools to manage content and prevent abuse:
          </p>
          <ul style={styles.list}>
            <li>
              <strong>Flagging/Reporting Content:</strong> Any user can flag stories containing objectionable content. Flagging immediately hides the content from the reporter's feed and submits it directly to the developer team for review.
            </li>
            <li>
              <strong>Blocking Abusive Users:</strong> Any user can block abusive creators. Blocking a user instantly hides all of their current and future posts from your feed and automatically sends a report to the developer team.
            </li>
            <li>
              <strong>Developer Action within 24 hours:</strong> The developer team reviews all flagged content and blocked user reports. Within 24 hours, the developer will remove the offending content and permanently eject (ban) the user who posted it.
            </li>
          </ul>

          <h3 style={styles.sectionHeading}>5. Termination of Access</h3>
          <p style={styles.paragraph}>
            TIMU reserves the right, at its sole discretion, to terminate your account, restrict your posting capabilities, or block access to the application immediately and without prior notice if you violate any part of this EULA.
          </p>

          <h3 style={styles.sectionHeading}>6. Contact Information</h3>
          <p style={styles.paragraph}>
            If you have questions regarding this EULA, or if you need to report content directly, you can email us at: <strong>samarakothari2504@gmail.com</strong>.
          </p>
        </motion.div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <p>© 2026 TIMU. All rights reserved. Moderating responsibly to ensure a safe environment.</p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    background: "#f1f5f9",
    minHeight: "100vh",
    padding: "clamp(2rem, 5vh, 4rem) clamp(1rem, 4vw, 2rem)",
    fontFamily: "'Inter', sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    overflowX: "hidden",
  },

  header: {
    width: "100%",
    maxWidth: "800px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    marginBottom: "2.5rem",
    position: "relative",
  },

  backButton: {
    alignSelf: "flex-start",
    background: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(203, 213, 225, 0.3)",
    borderRadius: "12px",
    padding: "8px 16px",
    color: "#475569",
    fontWeight: "600",
    fontSize: "0.85rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
    marginBottom: "1.5rem",
    outline: "none",
  },

  title: {
    marginBottom: "0.75rem",
    animation: "float 4s ease-in-out infinite",
  },

  titleGradient: {
    fontSize: "clamp(2rem, 6vw, 3.2rem)",
    fontWeight: "800",
    background: "linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #3b82f6 100%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "0.5px",
    fontFamily: "'Space Grotesk', sans-serif",
    filter: "drop-shadow(0 0 15px rgba(168, 85, 247, 0.25))",
  },

  subtitle: {
    fontSize: "clamp(0.9rem, 2.2vw, 1.1rem)",
    color: "#64748b",
    fontWeight: "400",
    lineHeight: "1.5",
    maxWidth: "600px",
  },

  cardContainer: {
    width: "100%",
    maxWidth: "800px",
    background: "rgba(255, 255, 255, 0.85)",
    backdropFilter: "blur(25px)",
    border: "1px solid rgba(203, 213, 225, 0.35)",
    borderRadius: "24px",
    padding: "clamp(1.5rem, 4vw, 2.5rem)",
    boxShadow: "0 10px 35px rgba(30, 41, 59, 0.05)",
    zIndex: 1,
  },

  content: {
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
  },

  alertCard: {
    display: "flex",
    gap: "1rem",
    alignItems: "flex-start",
    background: "rgba(239, 68, 68, 0.08)",
    border: "1px solid rgba(239, 68, 68, 0.2)",
    borderRadius: "16px",
    padding: "1.25rem 1.5rem",
    marginBottom: "1rem",
  },

  alertIcon: {
    fontSize: "1.5rem",
  },

  alertTitle: {
    fontSize: "1rem",
    fontWeight: "700",
    color: "#be123c",
    display: "block",
    marginBottom: "0.25rem",
  },

  alertText: {
    fontSize: "0.9rem",
    lineHeight: "1.6",
    color: "#9f1239",
  },

  sectionHeading: {
    fontSize: "1.25rem",
    fontWeight: "700",
    color: "#1e293b",
    marginTop: "0.75rem",
    fontFamily: "'Space Grotesk', sans-serif",
  },

  paragraph: {
    fontSize: "0.95rem",
    lineHeight: "1.7",
    color: "#475569",
  },

  list: {
    paddingLeft: "1.5rem",
    fontSize: "0.95rem",
    lineHeight: "1.7",
    color: "#475569",
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
  },

  footer: {
    marginTop: "3rem",
    textAlign: "center",
    maxWidth: "600px",
  },
};

export default Eula;
