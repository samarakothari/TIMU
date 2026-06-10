// src/pages/support.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

function Support() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  
  // Modal states
  const [activeModalType, setActiveModalType] = useState(null); // 'deletion', 'bug', 'feedback'
  const [contactEmail, setContactEmail] = useState("");
  const [details, setDetails] = useState("");
  const [extraDetails, setExtraDetails] = useState(""); // for steps to reproduce
  const [confirmDeletion, setConfirmDeletion] = useState(false);
  
  // Submission flow states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [formError, setFormError] = useState("");

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

      @keyframes drawCheck {
        0% { stroke-dashoffset: 80px; }
        100% { stroke-dashoffset: 0px; }
      }

      .support-orb {
        position: fixed;
        border-radius: 50%;
        filter: blur(60px);
        z-index: -1;
        opacity: 0.35;
        animation: orbitFloat 12s ease-in-out infinite;
      }

      .support-orb:nth-child(1) {
        top: 15%;
        left: 5%;
        width: 200px;
        height: 200px;
        background: radial-gradient(circle, rgba(99, 102, 241, 0.3), transparent);
      }

      .support-orb:nth-child(2) {
        bottom: 20%;
        right: 8%;
        width: 180px;
        height: 180px;
        background: radial-gradient(circle, rgba(217, 70, 239, 0.25), transparent);
        animation-delay: -3s;
      }

      .support-orb:nth-child(3) {
        top: 55%;
        left: 70%;
        width: 150px;
        height: 150px;
        background: radial-gradient(circle, rgba(251, 113, 133, 0.2), transparent);
        animation-delay: -6s;
      }

      .back-btn:hover {
        background: rgba(255, 255, 255, 0.9) !important;
        border-color: rgba(99, 102, 241, 0.3) !important;
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(99, 102, 241, 0.1) !important;
        color: #1e293b !important;
      }

      .interactive-card {
        transition: all 0.3s ease;
      }

      .interactive-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 30px rgba(30, 41, 59, 0.08) !important;
        border-color: rgba(99, 102, 241, 0.25) !important;
      }

      .faq-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        text-align: left;
        background: none;
        border: none;
        padding: 1.25rem 1.5rem;
        cursor: pointer;
        color: #1e293b;
        font-weight: 600;
        font-size: 1.05rem;
        transition: all 0.2s ease;
        outline: none;
      }

      .faq-header:hover {
        color: #6366f1;
        background: rgba(99, 102, 241, 0.03);
      }

      .faq-item {
        background: rgba(255, 255, 255, 0.9);
        border: 1px solid rgba(203, 213, 225, 0.3);
        border-radius: 16px;
        overflow: hidden;
        margin-bottom: 0.75rem;
        transition: all 0.2s ease;
      }

      .faq-item.open {
        border-color: rgba(99, 102, 241, 0.25);
        box-shadow: 0 4px 15px rgba(99, 102, 241, 0.05);
      }

      .action-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        background: linear-gradient(135deg, #6366f1 0%, #d946ef 100%);
        border: none;
        border-radius: 12px;
        padding: 12px 20px;
        color: #ffffff;
        font-weight: 700;
        font-size: 0.9rem;
        text-decoration: none;
        box-shadow: 0 4px 15px rgba(99, 102, 241, 0.2);
        transition: all 0.2s ease;
        cursor: pointer;
        width: 100%;
        text-align: center;
        outline: none;
      }

      .action-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(99, 102, 241, 0.3);
        filter: brightness(1.05);
      }

      .form-input:focus {
        border-color: rgba(99, 102, 241, 0.6) !important;
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1) !important;
        transform: translateY(-1px);
      }

      .success-checkmark {
        stroke-dasharray: 80px;
        stroke-dashoffset: 80px;
        animation: drawCheck 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards 0.2s;
      }

      @media (max-width: 767px) {
        .support-page-container {
          padding: 1.5rem 1rem !important;
        }
        .support-grid {
          grid-template-columns: 1fr !important;
        }
        .support-layout-wrapper {
          grid-template-columns: 1fr !important;
          gap: 1.5rem !important;
        }
        .modal-content-card {
          margin: 1rem !important;
          padding: 1.5rem !important;
          max-height: 90vh !important;
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

  // Prefill email if user is logged in
  useEffect(() => {
    if (user?.email) {
      setContactEmail(user.email);
    } else {
      setContactEmail("");
    }
  }, [user]);

  const faqs = [
    {
      q: "✍️ How do I share a story on TIMU?",
      a: "Go to the 'Post' section in the navigation menu. Simply fill in a title, write out your embarrassing blunder, and specify a custom pseudonym username. Click the 'Publish Story' button, and your story will instantly join the public browse feed."
    },
    {
      q: "🔒 Will other users be able to see my personal email?",
      a: "Absolutely not. Your privacy and anonymity are our primary concerns. Your email credentials are only used by Firebase Authentication to let you log in and control your own posts. On the public board, only your pseudonym or randomized anonymous animal identifier is shown."
    },
    {
      q: "✏️ Can I modify or delete a story after publishing?",
      a: "Yes. Find your story in the 'Browse' board. If you are signed in using the same email address that created the post, edit and delete buttons will appear on the card layout. Editing lets you correct text, while deleting permanently removes it along with all reaction metadata from our system."
    },
    {
      q: "🏆 How does the Leaderboard work?",
      a: "The leaderboard tracks stories that have collected the most total reactions (like 😂, 🔥, 😭, 🤯, 😬) from users. Users can cast reactions to posts in the browse feed to help them rise in leaderboard standings."
    },
    {
      q: "🗑️ How do I request complete account or data deletion?",
      a: "You have complete ownership of your data. You can instantly delete all individual stories you created directly from the browse board. If you want us to completely purge your authenticated account credentials and all matching entries, simply use the 'Request Account Deletion' form below."
    }
  ];

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleOpenModal = (type) => {
    setActiveModalType(type);
    setDetails("");
    setExtraDetails("");
    setConfirmDeletion(false);
    setSubmitSuccess(false);
    setFormError("");
    setTicketId("");
    if (user?.email) {
      setContactEmail(user.email);
    }
  };

  const handleCloseModal = () => {
    setActiveModalType(null);
  };

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    setFormError("");

    // Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail.trim())) {
      setFormError("Please enter a valid contact email address.");
      return;
    }

    if (activeModalType === "deletion" && !confirmDeletion) {
      setFormError("You must confirm that you understand the terms of account deletion.");
      return;
    }

    if (activeModalType !== "deletion" && !details.trim()) {
      setFormError("Please provide the required details for this request.");
      return;
    }

    setIsSubmitting(true);

    try {
      const ticketPayload = {
        type: activeModalType,
        email: contactEmail.trim(),
        status: "open",
        createdAt: serverTimestamp(),
      };

      if (activeModalType === "deletion") {
        ticketPayload.details = details.trim() || "User requested complete account deletion.";
      } else if (activeModalType === "bug") {
        ticketPayload.details = details.trim();
        ticketPayload.stepsToReproduce = extraDetails.trim();
      } else if (activeModalType === "feedback") {
        ticketPayload.details = details.trim();
      }

      // Add document to support_tickets collection in Firestore
      const docRef = await addDoc(collection(db, "support_tickets"), ticketPayload);
      
      setTicketId(docRef.id);
      setSubmitSuccess(true);
    } catch (err) {
      console.error("Error submitting support ticket:", err);
      setFormError("Failed to submit request. Please try again or email us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.page} className="support-page-container">
      {/* Background Orbs */}
      <div className="support-orb"></div>
      <div className="support-orb"></div>
      <div className="support-orb"></div>

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
          <span style={styles.titleGradient}>TIMU Support</span>
        </h1>
        <p style={styles.subtitle}>
          Need help navigating your blunders? Find answers below or open an interactive support request.
        </p>
      </div>

      {/* Main Containers Wrapper */}
      <div style={styles.layoutWrapper} className="support-layout-wrapper">
        
        {/* Left Column: FAQs Accordion */}
        <div style={styles.faqSection}>
          <h2 style={styles.sectionHeading}>Frequently Asked Questions</h2>
          <div style={styles.faqContainer}>
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div key={index} className={`faq-item ${isOpen ? 'open' : ''}`}>
                  <button onClick={() => toggleFaq(index)} className="faq-header">
                    <span>{faq.q}</span>
                    <span style={{
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                      fontSize: "0.8rem",
                      color: "#6366f1"
                    }}>
                      ▼
                    </span>
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        style={{ overflow: "hidden" }}
                      >
                        <div style={styles.faqBody}>
                          <p style={styles.faqText}>{faq.a}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Contact Cards */}
        <div style={styles.contactSection}>
          <h2 style={styles.sectionHeading}>Contact & Request Center</h2>
          <div style={styles.contactGrid} className="support-grid">
            
            {/* Card 1: Account Deletion */}
            <div style={styles.contactCard} className="interactive-card">
              <div style={styles.cardHeader}>
                <span style={styles.cardIcon}>🗑️</span>
                <h4 style={styles.cardTitle}>Account Deletion</h4>
              </div>
              <p style={styles.cardDesc}>
                Purge your registered email authentication credentials and delete all matching story logs permanently.
              </p>
              <button 
                onClick={() => handleOpenModal("deletion")}
                className="action-button"
              >
                🛠️ Request Deletion Form
              </button>
            </div>

            {/* Card 2: Bug Report */}
            <div style={styles.contactCard} className="interactive-card">
              <div style={styles.cardHeader}>
                <span style={styles.cardIcon}>🐛</span>
                <h4 style={styles.cardTitle}>Report a Bug</h4>
              </div>
              <p style={styles.cardDesc}>
                Encountered visual glitches, layout shifts, or broken interfaces? Open a ticket so we can fix it.
              </p>
              <button 
                onClick={() => handleOpenModal("bug")}
                className="action-button"
              >
                🛠️ Open Bug Form
              </button>
            </div>

            {/* Card 3: Feedback */}
            <div style={styles.contactCard} className="interactive-card">
              <div style={styles.cardHeader}>
                <span style={styles.cardIcon}>💡</span>
                <h4 style={styles.cardTitle}>Feedback & Ideas</h4>
              </div>
              <p style={styles.cardDesc}>
                Have feature requests, comments on styling, or suggestions to make sharing blunders more entertaining?
              </p>
              <button 
                onClick={() => handleOpenModal("feedback")}
                className="action-button"
              >
                🛠️ Share Your Ideas
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Modal Overlay and Form */}
      <AnimatePresence>
        {activeModalType && (
          <motion.div 
            style={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
          >
            <motion.div 
              style={styles.modalCard}
              className="modal-content-card"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button onClick={handleCloseModal} style={styles.modalCloseButton}>×</button>

              {!submitSuccess ? (
                <>
                  <h3 style={styles.modalHeading}>
                    {activeModalType === "deletion" && "🗑️ Account Deletion Request"}
                    {activeModalType === "bug" && "🐛 Submit Bug Report"}
                    {activeModalType === "feedback" && "💡 Send Feedback & Ideas"}
                  </h3>
                  
                  {formError && (
                    <div style={styles.errorText}>
                      ⚠️ {formError}
                    </div>
                  )}

                  <form onSubmit={handleSubmitTicket} style={styles.modalForm}>
                    {/* Contact Email field */}
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Your Contact Email</label>
                      <input 
                        type="email" 
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="Enter email address..."
                        style={styles.formInput}
                        className="form-input"
                      />
                    </div>

                    {/* Conditional Deletion Confirmations */}
                    {activeModalType === "deletion" && (
                      <>
                        <div style={styles.deletionWarning}>
                          <strong>WARNING:</strong> Account deletion is permanent and cannot be undone. All stories, ratings, and account records linked to this email will be scrubbed from our systems.
                        </div>
                        <div style={{ ...styles.formGroup, flexDirection: "row", alignItems: "flex-start", gap: "10px" }}>
                          <input 
                            type="checkbox" 
                            id="confirm-chk"
                            checked={confirmDeletion}
                            onChange={(e) => setConfirmDeletion(e.target.checked)}
                            style={{ marginTop: "4px", cursor: "pointer" }}
                          />
                          <label htmlFor="confirm-chk" style={{ ...styles.formLabel, fontSize: "0.85rem", cursor: "pointer", textTransform: "none" }}>
                            I confirm that I want to delete my account and understand that this action is irreversible.
                          </label>
                        </div>
                        <div style={styles.formGroup}>
                          <label style={styles.formLabel}>Reason for leaving (Optional)</label>
                          <textarea 
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            placeholder="Tell us why you want to delete your account..."
                            style={styles.formTextarea}
                            rows={3}
                          />
                        </div>
                      </>
                    )}

                    {/* Conditional Bug Form Details */}
                    {activeModalType === "bug" && (
                      <>
                        <div style={styles.formGroup}>
                          <label style={styles.formLabel}>What went wrong?</label>
                          <textarea 
                            required
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            placeholder="Describe the issue in detail..."
                            style={styles.formTextarea}
                            rows={3}
                          />
                        </div>
                        <div style={styles.formGroup}>
                          <label style={styles.formLabel}>Steps to reproduce</label>
                          <textarea 
                            value={extraDetails}
                            onChange={(e) => setExtraDetails(e.target.value)}
                            placeholder="1. Go to page...&#13;2. Click on...&#13;3. The app does..."
                            style={styles.formTextarea}
                            rows={3}
                          />
                        </div>
                      </>
                    )}

                    {/* Conditional Feedback Details */}
                    {activeModalType === "feedback" && (
                      <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Your suggestions or ideas</label>
                        <textarea 
                          required
                          value={details}
                          onChange={(e) => setDetails(e.target.value)}
                          placeholder="Tell us your feedback or proposed feature ideas..."
                          style={styles.formTextarea}
                          rows={6}
                        />
                      </div>
                    )}

                    {/* Submit and Cancel Row */}
                    <div style={styles.formActions}>
                      <button 
                        type="button" 
                        onClick={handleCloseModal} 
                        style={styles.cancelButton}
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        style={styles.submitButton}
                      >
                        {isSubmitting ? "Submitting..." : "Submit Ticket"}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                /* Success Screen */
                <div style={styles.successScreen}>
                  <div style={styles.checkmarkWrapper}>
                    <svg width="60" height="60" viewBox="0 0 60 60">
                      <circle cx="30" cy="30" r="28" fill="none" stroke="#22c55e" strokeWidth="4" />
                      <path d="M18 30 L26 38 L42 22" fill="none" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" className="success-checkmark" />
                    </svg>
                  </div>
                  <h3 style={styles.successHeading}>Request Received!</h3>
                  <p style={styles.successText}>
                    Your ticket has been written directly to our support queue. We will review it and get back to you shortly.
                  </p>
                  <div style={styles.ticketIdBadge}>
                    <span>Ticket Reference:</span>
                    <code>{ticketId}</code>
                  </div>
                  <button onClick={handleCloseModal} style={styles.successCloseButton}>
                    Done
                  </button>
                </div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer disclaimer */}
      <div style={styles.footer}>
        <p>Direct support contact: <strong>samarakothari2504@gmail.com</strong>. We generally respond to submissions within 24 hours.</p>
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
    maxWidth: "1100px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    marginBottom: "3rem",
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
    background: "linear-gradient(135deg, #6366f1 0%, #d946ef 50%, #fb7185 100%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "0.5px",
    fontFamily: "'Space Grotesk', sans-serif",
    filter: "drop-shadow(0 0 15px rgba(99, 102, 241, 0.25))",
  },

  subtitle: {
    fontSize: "clamp(0.9rem, 2.2vw, 1.1rem)",
    color: "#64748b",
    fontWeight: "400",
    lineHeight: "1.5",
    maxWidth: "600px",
  },

  layoutWrapper: {
    width: "100%",
    maxWidth: "1100px",
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.3fr) minmax(0, 1fr)",
    gap: "2.5rem",
    zIndex: 1,
    alignItems: "start",
  },

  sectionHeading: {
    fontSize: "1.3rem",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "1.25rem",
    fontFamily: "'Space Grotesk', sans-serif",
    letterSpacing: "0.2px",
  },

  faqSection: {
    width: "100%",
  },

  faqContainer: {
    display: "flex",
    flexDirection: "column",
  },

  faqBody: {
    padding: "0 1.5rem 1.25rem 1.5rem",
    borderTop: "1px solid rgba(203, 213, 225, 0.15)",
  },

  faqText: {
    fontSize: "0.95rem",
    lineHeight: "1.65",
    color: "#475569",
  },

  contactSection: {
    width: "100%",
  },

  contactGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },

  contactCard: {
    background: "rgba(255, 255, 255, 0.85)",
    backdropFilter: "blur(25px)",
    border: "1px solid rgba(203, 213, 225, 0.35)",
    borderRadius: "20px",
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    boxShadow: "0 8px 25px rgba(30, 41, 59, 0.03)",
  },

  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },

  cardIcon: {
    fontSize: "1.4rem",
  },

  cardTitle: {
    fontSize: "1.1rem",
    fontWeight: "700",
    color: "#1e293b",
  },

  cardDesc: {
    fontSize: "0.9rem",
    lineHeight: "1.6",
    color: "#475569",
    marginBottom: "0.5rem",
  },

  // Modal styling
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    backdropFilter: "blur(12px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },

  modalCard: {
    background: "rgba(255, 255, 255, 0.95)",
    border: "1px solid rgba(203, 213, 225, 0.4)",
    borderRadius: "24px",
    padding: "2.25rem",
    maxWidth: "500px",
    width: "100%",
    boxShadow: "0 25px 50px rgba(30, 41, 59, 0.25)",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    maxHeight: "95vh",
    overflowY: "auto",
  },

  modalCloseButton: {
    position: "absolute",
    top: "16px",
    right: "18px",
    background: "none",
    border: "none",
    fontSize: "1.8rem",
    cursor: "pointer",
    color: "#64748b",
    lineHeight: "1",
    transition: "color 0.2s ease",
    outline: "none",
  },

  modalHeading: {
    fontSize: "1.35rem",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "1.5rem",
    fontFamily: "'Space Grotesk', sans-serif",
  },

  errorText: {
    color: "#e11d48",
    background: "rgba(225, 29, 72, 0.08)",
    border: "1px solid rgba(225, 29, 72, 0.2)",
    borderRadius: "10px",
    padding: "10px 14px",
    fontSize: "0.88rem",
    fontWeight: "500",
    marginBottom: "1.25rem",
    lineHeight: "1.5",
  },

  modalForm: {
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
  },

  formLabel: {
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "#6366f1",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  formInput: {
    padding: "12px 16px",
    background: "rgba(248, 250, 252, 0.8)",
    border: "1px solid rgba(203, 213, 225, 0.8)",
    borderRadius: "12px",
    fontSize: "0.95rem",
    color: "#1e293b",
    transition: "all 0.25s ease",
    outline: "none",
    fontFamily: "inherit",
  },

  formTextarea: {
    padding: "12px 16px",
    background: "rgba(248, 250, 252, 0.8)",
    border: "1px solid rgba(203, 213, 225, 0.8)",
    borderRadius: "14px",
    fontSize: "0.95rem",
    color: "#1e293b",
    resize: "vertical",
    transition: "all 0.25s ease",
    outline: "none",
    fontFamily: "inherit",
    lineHeight: "1.5",
  },

  deletionWarning: {
    background: "rgba(225, 29, 72, 0.05)",
    borderLeft: "4px solid #e11d48",
    color: "#9f1239",
    padding: "12px 14px",
    borderRadius: "0 8px 8px 0",
    fontSize: "0.85rem",
    lineHeight: "1.5",
  },

  formActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "0.75rem",
    marginTop: "0.75rem",
  },

  cancelButton: {
    background: "rgba(248, 250, 252, 0.9)",
    border: "1px solid rgba(203, 213, 225, 0.8)",
    borderRadius: "12px",
    padding: "10px 18px",
    fontWeight: "600",
    color: "#64748b",
    fontSize: "0.9rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
    outline: "none",
  },

  submitButton: {
    background: "linear-gradient(135deg, #6366f1 0%, #d946ef 100%)",
    border: "none",
    borderRadius: "12px",
    padding: "11px 22px",
    fontWeight: "700",
    color: "#ffffff",
    fontSize: "0.9rem",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(99, 102, 241, 0.15)",
    transition: "all 0.2s ease",
    outline: "none",
  },

  // Success view
  successScreen: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    padding: "1rem 0",
  },

  checkmarkWrapper: {
    marginBottom: "1.25rem",
  },

  successHeading: {
    fontSize: "1.4rem",
    fontWeight: "700",
    color: "#22c55e",
    marginBottom: "0.75rem",
    fontFamily: "'Space Grotesk', sans-serif",
  },

  successText: {
    fontSize: "0.95rem",
    lineHeight: "1.6",
    color: "#64748b",
    marginBottom: "1.5rem",
    maxWidth: "380px",
  },

  ticketIdBadge: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
    background: "rgba(99, 102, 241, 0.05)",
    border: "1px dashed rgba(99, 102, 241, 0.3)",
    borderRadius: "12px",
    padding: "10px 20px",
    marginBottom: "2rem",
  },

  successCloseButton: {
    background: "#22c55e",
    border: "none",
    borderRadius: "12px",
    padding: "12px 32px",
    color: "#ffffff",
    fontWeight: "700",
    fontSize: "0.95rem",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(34, 197, 94, 0.2)",
    transition: "all 0.2s ease",
    outline: "none",
  },

  footer: {
    marginTop: "4rem",
    textAlign: "center",
    maxWidth: "600px",
    color: "#94a3b8",
    fontSize: "0.85rem",
    lineHeight: "1.6",
  },
};

export default Support;
