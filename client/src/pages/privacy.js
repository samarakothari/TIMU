// src/pages/privacy.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function Privacy() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

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

      .privacy-orb {
        position: fixed;
        border-radius: 50%;
        filter: blur(60px);
        z-index: -1;
        opacity: 0.35;
        animation: orbitFloat 12s ease-in-out infinite;
      }

      .privacy-orb:nth-child(1) {
        top: 10%;
        left: 5%;
        width: 180px;
        height: 180px;
        background: radial-gradient(circle, rgba(251, 113, 133, 0.3), transparent);
      }

      .privacy-orb:nth-child(2) {
        bottom: 15%;
        right: 5%;
        width: 220px;
        height: 220px;
        background: radial-gradient(circle, rgba(217, 70, 239, 0.25), transparent);
        animation-delay: -4s;
      }

      .privacy-orb:nth-child(3) {
        top: 50%;
        left: 75%;
        width: 140px;
        height: 140px;
        background: radial-gradient(circle, rgba(99, 102, 241, 0.2), transparent);
        animation-delay: -8s;
      }

      /* Hover effects */
      .back-btn:hover {
        background: rgba(255, 255, 255, 0.9) !important;
        border-color: rgba(251, 113, 133, 0.3) !important;
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(251, 113, 133, 0.1) !important;
        color: #1e293b !important;
      }

      .tab-btn {
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .tab-btn:hover:not(.active-tab) {
        background: rgba(255, 255, 255, 0.7);
        color: #1e293b;
        transform: translateY(-1px);
      }

      .interactive-card {
        transition: all 0.3s ease;
      }

      .interactive-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 12px 30px rgba(30, 41, 59, 0.08) !important;
        border-color: rgba(251, 113, 133, 0.25) !important;
      }

      /* Responsive optimizations */
      @media (max-width: 767px) {
        .tabs-container {
          flex-direction: column !important;
          gap: 0.5rem !important;
        }
        .tab-btn {
          width: 100% !important;
          text-align: left !important;
          padding: 12px 16px !important;
        }
        .privacy-page-container {
          padding: 1.5rem 1rem !important;
        }
      }

      /* Beautiful scrollbars for content card */
      ::-webkit-scrollbar {
        width: 6px;
      }
      ::-webkit-scrollbar-track {
        background: transparent;
      }
      ::-webkit-scrollbar-thumb {
        background: rgba(203, 213, 225, 0.8);
        border-radius: 4px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: rgba(148, 163, 184, 0.8);
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  const tabs = [
    { id: "overview", label: "🌟 Overview", title: "Privacy First at TIMU" },
    { id: "collection", label: "📊 Data Collection", title: "Information We Collect" },
    { id: "usage", label: "⚙️ Usage & Protection", title: "How We Use & Secure Data" },
    { id: "rights", label: "🔑 Your Rights & Control", title: "Your Control Over Data" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            style={styles.tabContent}
          >
            <p style={styles.paragraph}>
              At <strong>TIMU</strong> (<em>Today I Messed Up</em>), we believe that making mistakes is a fundamental part of the human experience. Getting those regrets, hilarious blunders, and chaotic lessons off your chest shouldn't compromise your digital safety or personal identity.
            </p>
            <p style={styles.paragraph}>
              We have designed this platform from the ground up to respect your anonymity. We don't sell your data, we don't build advertisement profiles about your personality, and we don't display your private email address to the public.
            </p>

            <div style={styles.grid}>
              <div style={styles.card} className="interactive-card">
                <div style={styles.cardIcon}>🔒</div>
                <h4 style={styles.cardTitle}>Guaranteed Anonymity</h4>
                <p style={styles.cardText}>
                  Your stories are linked to a randomly generated animal avatar (e.g. <em>Anonymous Capybara</em>) or a custom pseudonymous username. Your registered email is never visible to others.
                </p>
              </div>

              <div style={styles.card} className="interactive-card">
                <div style={styles.cardIcon}>🚫</div>
                <h4 style={styles.cardTitle}>No Data Trading</h4>
                <p style={styles.cardText}>
                  We do not sell, rent, or lease your content or user info to marketers, advertisers, or third-party corporations. Your blunders stay here.
                </p>
              </div>

              <div style={styles.card} className="interactive-card">
                <div style={styles.cardIcon}>✨</div>
                <h4 style={styles.cardTitle}>User Control</h4>
                <p style={styles.cardText}>
                  You own your stories. You can edit your published posts or delete them completely at any time, instantly removing them from our live feed.
                </p>
              </div>
            </div>
          </motion.div>
        );

      case "collection":
        return (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            style={styles.tabContent}
          >
            <p style={styles.paragraph}>
              We minimize data collection to only what is necessary to run a secure, functional web application. Here is a transparent breakdown of what is collected and why:
            </p>

            <div style={styles.listContainer}>
              <div style={styles.listItem}>
                <span style={styles.bulletSymbol}>📝</span>
                <div>
                  <strong style={styles.listItemTitle}>User-Generated Content & Pseudonyms</strong>
                  <p style={styles.listItemDesc}>
                    When you write a story on TIMU, we collect your story title, the body of the story, and the username you provide. This information is stored securely in Firebase Firestore and is required to broadcast your stories to the community.
                  </p>
                </div>
              </div>

              <div style={styles.listItem}>
                <span style={styles.bulletSymbol}>🛡️</span>
                <div>
                  <strong style={styles.listItemTitle}>Account Credentials</strong>
                  <p style={styles.listItemDesc}>
                    When you sign up or log in, we collect your email address and password hash (handled securely via Firebase Authentication). This is used strictly to verify your ownership of posts, allowing you to edit or delete your stories later.
                  </p>
                </div>
              </div>

              <div style={styles.listItem}>
                <span style={styles.bulletSymbol}>⚡</span>
                <div>
                  <strong style={styles.listItemTitle}>Interactive Meta-Data</strong>
                  <p style={styles.listItemDesc}>
                    We collect reactions (such as 🔥, 😂, 😭, 😬, 🤯) that you cast or receive on posts. We also track timestamps for when posts are created or updated, which is necessary for ordering feed items and displaying correct leaderboard rankings.
                  </p>
                </div>
              </div>

              <div style={styles.listItem}>
                <span style={styles.bulletSymbol}>🔍</span>
                <div>
                  <strong style={styles.listItemTitle}>Technical Logs & Session Info</strong>
                  <p style={styles.listItemDesc}>
                    To prevent abuse, spam, and server overloading (such as denial-of-service attempts), our hosting partners and Firebase services collect temporary server logs containing IP addresses, browser types, and API usage stats.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case "usage":
        return (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            style={styles.tabContent}
          >
            <p style={styles.paragraph}>
              Your information is stored in Google Firebase cloud servers and is protected using secure access rules. We only use your information for the following specific purposes:
            </p>

            <div style={styles.listContainer}>
              <div style={styles.listItem}>
                <span style={styles.bulletSymbol}>🚀</span>
                <div>
                  <strong style={styles.listItemTitle}>To Provide and Maintain Our Service</strong>
                  <p style={styles.listItemDesc}>
                    Displaying your stories to the TIMU feed, keeping track of reactions, managing leaderboard standings, and ensuring registered users can modify their own posts.
                  </p>
                </div>
              </div>

              <div style={styles.listItem}>
                <span style={styles.bulletSymbol}>🔒</span>
                <div>
                  <strong style={styles.listItemTitle}>Security & Spam Prevention</strong>
                  <p style={styles.listItemDesc}>
                    We monitor post creation to prevent bots and malicious scripts from spamming the system or flooding the app with inappropriate content.
                  </p>
                </div>
              </div>

              <div style={styles.listItem}>
                <span style={styles.bulletSymbol}>🍪</span>
                <div>
                  <strong style={styles.listItemTitle}>Cookies & Web Storage</strong>
                  <p style={styles.listItemDesc}>
                    We use standard browser local storage (`localStorage`) to remember if you've accepted our Terms and Privacy Modal, as well as your local random anonymous username, to provide a smooth, prompt-free user experience on subsequent visits.
                  </p>
                </div>
              </div>
            </div>

            <div style={{...styles.alertCard, marginTop: "2rem"}}>
              <span style={styles.alertIcon}>⚠️</span>
              <div>
                <strong style={styles.alertTitle}>Important Security Notice</strong>
                <p style={styles.alertText}>
                  Please do not include personally identifiable information (such as your real full name, phone number, physical address, or financial details) within the body of your stories. Your stories are public. Keep it anonymous to keep it safe!
                </p>
              </div>
            </div>
          </motion.div>
        );

      case "rights":
        return (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            style={styles.tabContent}
          >
            <p style={styles.paragraph}>
              We strongly support user autonomy and your right to digital privacy. Under GDPR, CCPA, and general best practices, we offer the following controls:
            </p>

            <div style={styles.grid}>
              <div style={styles.card} className="interactive-card">
                <div style={styles.cardIcon}>✏️</div>
                <h4 style={styles.cardTitle}>Right to Rectification</h4>
                <p style={styles.cardText}>
                  You can edit the title or story of any post you have created. Simply go to the story in the Browse feed and click "Edit" (only visible when logged in to the account that posted it).
                </p>
              </div>

              <div style={styles.card} className="interactive-card">
                <div style={styles.cardIcon}>🗑️</div>
                <h4 style={styles.cardTitle}>Right to Erasure</h4>
                <p style={styles.cardText}>
                  You have the power to instantly delete any post you own via the "Delete" button. This permanently deletes the post and all its reaction records from the Firestore database.
                </p>
              </div>
            </div>

            <div style={styles.supportContainer}>
              <h4 style={styles.supportTitle}>Request Complete Data Account Deletion</h4>
              <p style={styles.supportText}>
                If you wish to delete your entire TIMU user account along with all posts associated with your email address, please write to us. We will handle your erasure request within 7 business days.
              </p>
              <a 
                href="mailto:samarakothari2504@gmail.com?subject=TIMU%20Account%20Deletion%20Request" 
                style={styles.supportButton}
              >
                ✉️ Email Deletion Request (samarakothari2504@gmail.com)
              </a>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={styles.page} className="privacy-page-container">
      {/* Background Orbs */}
      <div className="privacy-orb"></div>
      <div className="privacy-orb"></div>
      <div className="privacy-orb"></div>

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
          <span style={styles.titleGradient}>Privacy Policy</span>
        </h1>
        <p style={styles.subtitle}>
          How we safeguard your anonymous venting journey. Last updated: June 10, 2026.
        </p>
      </div>

      {/* Main Layout Card */}
      <div style={styles.cardContainer}>
        {/* Navigation Tabs */}
        <div style={styles.tabs} className="tabs-container">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-btn ${activeTab === tab.id ? "active-tab" : ""}`}
              style={{
                ...styles.tabButton,
                ...(activeTab === tab.id ? styles.activeTabButton : {}),
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic content area */}
        <div style={styles.contentArea}>
          <h2 style={styles.sectionTitle}>
            {tabs.find((t) => t.id === activeTab)?.title}
          </h2>
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer disclaimer */}
      <div style={styles.footer}>
        <p>© 2026 TIMU. All rights reserved. Embracing life's funny, awkward, and messy moments responsibly.</p>
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
    maxWidth: "960px",
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
    fontSize: "clamp(2.2rem, 6vw, 3.5rem)",
    fontWeight: "800",
    background: "linear-gradient(135deg, #fb7185 0%, #d946ef 50%, #6366f1 100%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "0.5px",
    fontFamily: "'Space Grotesk', sans-serif",
    filter: "drop-shadow(0 0 15px rgba(251, 113, 133, 0.25))",
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
    maxWidth: "960px",
    background: "rgba(255, 255, 255, 0.85)",
    backdropFilter: "blur(25px)",
    border: "1px solid rgba(203, 213, 225, 0.35)",
    borderRadius: "24px",
    padding: "clamp(1.5rem, 4vw, 2.5rem)",
    boxShadow: "0 10px 35px rgba(30, 41, 59, 0.05)",
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
    zIndex: 1,
  },

  tabs: {
    display: "flex",
    gap: "0.75rem",
    borderBottom: "1px solid rgba(203, 213, 225, 0.3)",
    paddingBottom: "1rem",
    width: "100%",
    overflowX: "auto",
  },

  tabButton: {
    padding: "10px 18px",
    borderRadius: "12px",
    border: "1px solid rgba(203, 213, 225, 0.2)",
    background: "rgba(248, 250, 252, 0.8)",
    color: "#64748b",
    fontWeight: "600",
    fontSize: "0.9rem",
    cursor: "pointer",
    whiteSpace: "nowrap",
    outline: "none",
  },

  activeTabButton: {
    background: "linear-gradient(135deg, rgba(251, 113, 133, 0.1), rgba(217, 70, 239, 0.08))",
    borderColor: "rgba(251, 113, 133, 0.35)",
    color: "#1e293b",
    boxShadow: "0 4px 15px rgba(251, 113, 133, 0.08)",
  },

  contentArea: {
    minHeight: "350px",
  },

  sectionTitle: {
    fontSize: "clamp(1.3rem, 3vw, 1.8rem)",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "1.25rem",
    fontFamily: "'Space Grotesk', sans-serif",
  },

  tabContent: {
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
  },

  paragraph: {
    fontSize: "1rem",
    lineHeight: "1.7",
    color: "#475569",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "1.25rem",
    marginTop: "1.5rem",
  },

  card: {
    background: "rgba(255, 255, 255, 0.95)",
    border: "1px solid rgba(203, 213, 225, 0.25)",
    borderRadius: "16px",
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    boxShadow: "0 4px 15px rgba(30, 41, 59, 0.02)",
  },

  cardIcon: {
    fontSize: "1.75rem",
  },

  cardTitle: {
    fontSize: "1.1rem",
    fontWeight: "700",
    color: "#1e293b",
  },

  cardText: {
    fontSize: "0.9rem",
    lineHeight: "1.6",
    color: "#64748b",
  },

  listContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
    marginTop: "1rem",
  },

  listItem: {
    display: "flex",
    gap: "1rem",
    alignItems: "flex-start",
  },

  bulletSymbol: {
    fontSize: "1.35rem",
    paddingTop: "2px",
  },

  listItemTitle: {
    display: "block",
    fontSize: "1.05rem",
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: "0.25rem",
  },

  listItemDesc: {
    fontSize: "0.95rem",
    lineHeight: "1.6",
    color: "#64748b",
  },

  alertCard: {
    display: "flex",
    gap: "1rem",
    alignItems: "flex-start",
    background: "rgba(251, 113, 133, 0.08)",
    border: "1px solid rgba(251, 113, 133, 0.2)",
    borderRadius: "16px",
    padding: "1.25rem 1.5rem",
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

  supportContainer: {
    marginTop: "2.5rem",
    padding: "1.75rem",
    background: "linear-gradient(135deg, rgba(251, 113, 133, 0.03), rgba(217, 70, 239, 0.03))",
    border: "1px solid rgba(251, 113, 133, 0.15)",
    borderRadius: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: "0.75rem",
  },

  supportTitle: {
    fontSize: "1.2rem",
    fontWeight: "700",
    color: "#1e293b",
  },

  supportText: {
    fontSize: "0.95rem",
    color: "#64748b",
    maxWidth: "500px",
    lineHeight: "1.6",
    marginBottom: "0.75rem",
  },

  supportButton: {
    display: "inline-flex",
    alignItems: "center",
    background: "linear-gradient(135deg, #fb7185 0%, #d946ef 100%)",
    border: "none",
    borderRadius: "12px",
    padding: "12px 24px",
    color: "#ffffff",
    fontWeight: "700",
    fontSize: "0.95rem",
    textDecoration: "none",
    boxShadow: "0 4px 15px rgba(251, 113, 133, 0.25)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    cursor: "pointer",
  },

  footer: {
    marginTop: "3rem",
    textAlign: "center",
    maxWidth: "600px",
  },

  footerText: {
    fontSize: "0.8rem",
    color: "#94a3b8",
    lineHeight: "1.6",
  },
};

export default Privacy;
