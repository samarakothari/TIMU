import React, { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
} from "firebase/firestore";

const OBJECTIONABLE_WORDS = [
  "abuse", "harass", "kill yourself", "kys", "slur", "nigger", "faggot", "retard", "cunt",
  "bitch", "whore", "bastard", "dick", "pussy", "asshole", "hate speech", "porn", "sex",
  "naked", "terrorist", "bomb", "kill all", "threaten", "fuck", "shit", "vulgar", "explicit"
];

const containsObjectionableContent = (text) => {
  if (!text) return false;
  const lowerText = text.toLowerCase();
  return OBJECTIONABLE_WORDS.some(word => lowerText.includes(word));
};

function Post() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const prefix = "TIMU by ";
  const [title, setTitle] = useState("");
  const [storyBody, setStoryBody] = useState(prefix);
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");


  useEffect(() => {
    // Add Google Fonts and animation keyframes
    const style = document.createElement("style");
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
      
      * { margin: 0; padding: 0; box-sizing: border-box; }
      
      body {
        background: #f1f5f9;
        color: #1e293b;
        font-family: 'Inter', sans-serif;
        overflow-x: hidden;
        min-height: 100vh;
      }
      
      @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-8px) rotate(1deg); }
      }
      
      @keyframes glow {
        0%, 100% { box-shadow: 0 4px 20px rgba(251, 113, 133, 0.3); }
        50% { box-shadow: 0 8px 40px rgba(251, 113, 133, 0.4), 0 0 60px rgba(217, 70, 239, 0.3); }
      }
      
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      
      @keyframes slideIn {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      .floating-orb {
        position: fixed;
        width: 300px;
        height: 300px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(251, 113, 133, 0.08), transparent);
        filter: blur(40px);
        animation: float 6s ease-in-out infinite;
        z-index: -1;
      }
      
      .floating-orb:nth-child(1) {
        top: 10%;
        left: 10%;
        animation-delay: 0s;
      }
      
      .floating-orb:nth-child(2) {
        top: 60%;
        right: 10%;
        animation-delay: 2s;
        background: radial-gradient(circle, rgba(217, 70, 239, 0.08), transparent);
      }
      
      .floating-orb:nth-child(3) {
        bottom: 10%;
        left: 30%;
        animation-delay: 4s;
        background: radial-gradient(circle, rgba(99, 102, 241, 0.08), transparent);
      }
      
      .enhanced-input:focus {
        border-color: rgba(251, 113, 133, 0.6) !important;
        box-shadow: 0 0 0 3px rgba(251, 113, 133, 0.1) !important;
        transform: translateY(-2px);
      }
      
      .enhanced-input:focus + .input-underline {
        transform: scaleX(1) !important;
      }
      
      .enhanced-button:hover {
        transform: translateY(-3px) scale(1.02);
        box-shadow: 0 20px 40px rgba(251, 113, 133, 0.4) !important;
      }
      
      .enhanced-button:hover .button-icon {
        transform: translateX(4px) rotate(15deg);
      }
      
      .enhanced-button:active {
        transform: translateY(-1px) scale(0.98);
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  useEffect(() => {
    if (user) {
      const savedUsername = localStorage.getItem(`username_${user.uid}`);
      if (savedUsername) {
        setUsername(savedUsername);
      } else {
        const newUsername = `user_${Math.floor(1000 + Math.random() * 9000)}`;
        localStorage.setItem(`username_${user.uid}`, newUsername);
        setUsername(newUsername);
      }
    }
  }, [user]);

  if (loading) return <p style={styles.loading}>Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;

  const handleStoryChange = (e) => {
    let input = e.target.value;

    if (!input.startsWith(prefix)) {
      input = prefix + input.slice(prefix.length);
    }

    const userInput = input.slice(prefix.length).slice(0, 300);
    setStoryBody(prefix + userInput);
  };

  const handleKeyDown = (e) => {
    const cursorPos = e.target.selectionStart;
    if (
      (e.key === "Backspace" || e.key === "ArrowLeft") &&
      cursorPos <= prefix.length
    ) {
      e.preventDefault();
    }
  };

  const isUsernameTaken = async (name) => {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, where("username", "==", name));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.some((doc) => doc.data().user !== user.email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const actualStoryContent = storyBody.slice(prefix.length).trim();
    if (!title.trim() || !actualStoryContent) {
      setError("Both title and story are required.");
      return;
    }

    if (containsObjectionableContent(title) || containsObjectionableContent(actualStoryContent)) {
      setError("Warning: Your post contains content that violates our safety policy. Please remove any objectionable, abusive, or offensive terms and try again.");
      return;
    }

    if (!username.trim()) {
      setError("Username is required.");
      return;
    }

    try {
      const taken = await isUsernameTaken(username.trim());
      if (taken) {
        setError(
          "This username is already taken by another user. Please pick something else 🕵️‍♀️"
        );
        return;
      }

      await addDoc(collection(db, "posts"), {
        title,
        story: storyBody,
        reactions: {
          "😂": 0,
          "😬": 0,
          "😭": 0,
          "🤯": 0,
          "🔥": 0,
        },
        createdAt: serverTimestamp(),
        user: user.email,
        username: username.trim(),
        authorId: user.uid,
      });

      localStorage.setItem(`username_${user.uid}`, username.trim());

      setTitle("");
      setStoryBody(prefix);
      setError("");
      navigate("/browse");
    } catch (err) {
      console.error("Error posting to Firestore:", err);
      setError("Failed to post. Try again later.");
    }
  };

  return (
    <div style={styles.page}>
      <div className="floating-orb"></div>
      <div className="floating-orb"></div>
      <div className="floating-orb"></div>

      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>
            <span style={styles.emoji}>✨</span>
            Share Your Story
            <span style={styles.subtitle}>Let the world hear your truth</span>
          </h2>
        </div>

        {error && (
          <div style={styles.errorContainer}>
            <span style={styles.errorIcon}>⚠️</span>
            <p style={styles.error}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Title</label>
            <input
              type="text"
              placeholder="Give your story a compelling title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={styles.input}
              className="enhanced-input"
              required
            />
            <div style={styles.inputUnderline} className="input-underline"></div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Your Story</label>
            <textarea
              value={storyBody}
              onChange={handleStoryChange}
              onKeyDown={handleKeyDown}
              style={styles.textarea}
              className="enhanced-input"
              maxLength={prefix.length + 300}
              placeholder="Share your experience..."
              required
            />
            <div style={styles.charCountContainer}>
              <span style={styles.charCount}>
                {storyBody.length - prefix.length}/300 characters
              </span>
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              placeholder="Choose your identity..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              className="enhanced-input"
              required
            />
            <div style={styles.inputUnderline} className="input-underline"></div>
          </div>

          <button type="submit" style={styles.button} className="enhanced-button">
            <span style={styles.buttonContent}>
              <span style={styles.buttonText}>Publish Story</span>
              <span style={styles.buttonIcon} className="button-icon">🚀</span>
            </span>
            <div style={styles.buttonShimmer}></div>
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    background: "#f1f5f9",
    minHeight: "100vh",
    padding: "2rem",
    fontFamily: "'Inter', sans-serif",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },

  container: {
    width: "100%",
    maxWidth: "750px",
    animation: "slideIn 0.8s ease-out",
    zIndex: 1,
  },

  header: {
    textAlign: "center",
    marginBottom: "3rem",
  },

  title: {
    fontSize: "clamp(2rem, 5vw, 3rem)",
    fontWeight: "800",
    background:
      "linear-gradient(135deg, #ffffff 0%, #a855f7 50%, #ec4899 100%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "0.5rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.5rem",
    animation: "float 4s ease-in-out infinite",
  },

  emoji: {
    fontSize: "1.5em",
    filter: "drop-shadow(0 0 10px rgba(251, 113, 133, 0.3))",
  },

  subtitle: {
    fontSize: "0.4em",
    fontWeight: "400",
    opacity: "0.8",
    background: "linear-gradient(90deg, #d946ef, #6366f1)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  form: {
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(203, 213, 225, 0.3)",
    borderRadius: "24px",
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
    boxShadow: `
      0 20px 40px rgba(30, 41, 59, 0.08),
      0 0 0 1px rgba(203, 213, 225, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.8)
    `,
    position: "relative",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    position: "relative",
  },

  label: {
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#d946ef",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  },

  input: {
    padding: "16px 20px",
    background: "rgba(248, 250, 252, 0.8)",
    border: "2px solid rgba(203, 213, 225, 0.3)",
    borderRadius: "16px",
    color: "#1e293b",
    fontSize: "1rem",
    fontFamily: "inherit",
    fontWeight: "400",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    outline: "none",
    backdropFilter: "blur(10px)",
  },

  textarea: {
    padding: "20px",
    background: "rgba(248, 250, 252, 0.8)",
    border: "2px solid rgba(203, 213, 225, 0.3)",
    borderRadius: "20px",
    color: "#1e293b",
    fontSize: "1rem",
    fontFamily: "inherit",
    fontWeight: "400",
    minHeight: "160px",
    resize: "vertical",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    outline: "none",
    backdropFilter: "blur(10px)",
    lineHeight: "1.6",
  },

  inputUnderline: {
    height: "2px",
    background: "linear-gradient(90deg, transparent, #fb7185, #d946ef, transparent)",
    borderRadius: "1px",
    transform: "scaleX(0)",
    transformOrigin: "center",
    transition: "transform 0.3s ease",
  },

  charCountContainer: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "0.5rem",
  },

  charCount: {
    fontSize: "0.8rem",
    color: "#64748b",
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: "500",
  },

  button: {
    padding: "18px 32px",
    background: "linear-gradient(135deg, #fb7185 0%, #d946ef 50%, #6366f1 100%)",
    border: "none",
    borderRadius: "16px",
    color: "#ffffff",
    fontSize: "1.1rem",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    overflow: "hidden",
    textTransform: "uppercase",
    letterSpacing: "1px",
    boxShadow: `
      0 10px 30px rgba(251, 113, 133, 0.3),
      0 0 0 1px rgba(255, 255, 255, 0.2)
    `,
    animation: "glow 3s ease-in-out infinite",
  },

  buttonContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    position: "relative",
    zIndex: 1,
  },

  buttonText: {
    fontWeight: "700",
  },

  buttonIcon: {
    fontSize: "1.2em",
    transition: "transform 0.3s ease",
  },

  buttonShimmer: {
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "100%",
    height: "100%",
    background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)",
    animation: "shimmer 2s infinite",
  },

  errorContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.2)",
    borderRadius: "12px",
    padding: "16px 20px",
    marginBottom: "1rem",
    backdropFilter: "blur(10px)",
  },

  errorIcon: {
    fontSize: "1.2rem",
  },

  error: {
    color: "#ef4444",
    fontSize: "0.95rem",
    fontWeight: "500",
    margin: 0,
  },

  loading: {
    color: "#1e293b",
    textAlign: "center",
    fontSize: "1.2rem",
    fontWeight: "500",
  },
};

export default Post;