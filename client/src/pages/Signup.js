// src/pages/Signup.js
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  React.useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;700;800&display=swap');
            
            * { margin: 0; padding: 0; box-sizing: border-box; }
            
            body {
                background: linear-gradient(135deg, #0f0f23 0%, #1a0a2e 30%, #16213e 70%, #0f3460 100%);
                color: #ffffff;
                font-family: 'Inter', sans-serif;
                overflow-x: hidden;
                min-height: 100vh;
                position: relative;
            }
            
            body::before {
                content: '';
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: 
                    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
                    radial-gradient(circle at 40% 40%, rgba(120, 219, 226, 0.2) 0%, transparent 50%);
                z-index: -2;
            }
            
            .floating-orb {
                position: fixed;
                border-radius: 50%;
                filter: blur(60px);
                z-index: -1;
                animation: float 12s ease-in-out infinite;
            }
            
            .floating-orb:nth-child(1) {
                top: 10%;
                left: 15%;
                width: 200px;
                height: 200px;
                background: linear-gradient(45deg, rgba(168, 85, 247, 0.4), rgba(236, 72, 153, 0.3));
                animation-delay: -2s;
            }
            
            .floating-orb:nth-child(2) {
                bottom: 15%;
                right: 20%;
                width: 150px;
                height: 150px;
                background: linear-gradient(45deg, rgba(59, 130, 246, 0.4), rgba(147, 51, 234, 0.3));
                animation-delay: -6s;
            }
            
            .floating-orb:nth-child(3) {
                top: 50%;
                left: 5%;
                width: 100px;
                height: 100px;
                background: linear-gradient(45deg, rgba(34, 197, 94, 0.3), rgba(168, 85, 247, 0.2));
                animation: pulse 8s ease-in-out infinite;
                animation-delay: -4s;
            }
            
            .signup-page {
                padding: 2rem !important;
            }
            .signup-form {
                padding: 3rem 2.5rem !important;
            }

            /* Enhanced styles for better visual appeal */
            @media (hover: hover) and (pointer: fine) {
                .signup-input:hover {
                    border-color: rgba(168, 85, 247, 0.6) !important;
                    box-shadow: 0 0 20px rgba(168, 85, 247, 0.2) !important;
                    transform: translateY(-1px) !important;
                }
                
                .signup-button:hover {
                    transform: translateY(-3px) scale(1.02) !important;
                    box-shadow: 0 15px 35px rgba(168, 85, 247, 0.4) !important;
                }
                
                .login-link:hover {
                    color: rgba(236, 72, 153, 0.9) !important;
                    transform: scale(1.05) !important;
                }
            }
            
            /* Mobile optimizations */
            @media (max-width: 767px) {
                .signup-page {
                    padding: 1rem 0.75rem !important;
                }
                .signup-container {
                    margin: 0 !important;
                    padding: 0 !important;
                    width: 100% !important;
                    max-width: 100% !important;
                }
                .signup-form {
                    padding: 2rem 1.25rem !important;
                }
                
                .signup-title {
                    font-size: 1.8rem !important;
                }
                
                .signup-input, .signup-button {
                    padding: 14px 18px !important;
                    font-size: 0.95rem !important;
                }
            }
            
            @media (min-width: 768px) and (max-width: 1024px) {
                .signup-container {
                    max-width: 450px !important;
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

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/post"); // 🔁 after signup, go to post page
    } catch (error) {
      console.error(error);
      switch (error.code) {
        case "auth/email-already-in-use":
          setErr("That email is already registered!");
          break;
        case "auth/invalid-email":
          setErr("That email is not valid.");
          break;
        case "auth/weak-password":
          setErr("Password should be at least 6 characters.");
          break;
        default:
          setErr("Signup failed. Please try again.");
      }
    }
  };

  return (
    <div className="signup-page" style={styles.page}>
      <div className="floating-orb"></div>
      <div className="floating-orb"></div>
      <div className="floating-orb"></div>

      <div className="signup-container" style={styles.container}>
        <form onSubmit={handleSignup} className="signup-form" style={styles.form}>
          <div style={styles.headerSection}>
            <h2 className="signup-title" style={styles.title}>
              🧁 Join TIMUU
            </h2>
            <p style={styles.subtitle}>
              Create your account and start your journey
            </p>
          </div>

          {err && (
            <div style={styles.errorContainer}>
              <span style={styles.errorIcon}>⚠️</span>
              <p style={styles.error}>{err}</p>
            </div>
          )}

          <div style={styles.inputGroup}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="signup-input"
              style={styles.input}
            />
            <div style={styles.inputUnderline}></div>
          </div>

          <div style={styles.inputGroup}>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className="signup-input"
              style={styles.input}
            />
            <div style={styles.inputUnderline}></div>
          </div>

          <button type="submit" className="signup-button" style={styles.button}>
            <span style={styles.buttonText}>Create Account</span>
            <div style={styles.buttonShimmer}></div>
          </button>

          <div style={styles.divider}>
            <span style={styles.dividerText}>or</span>
          </div>

          <p style={styles.loginText}>
            Already have an account?{" "}
            <Link to="/login" className="login-link" style={styles.loginLink}>
              Sign in here ✨
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

// Signup Page - Updated Color Styles for Light Theme

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    position: "relative",
    background: "transparent",
  },

  container: {
    animation: "slideInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
    width: "100%",
    maxWidth: "420px",
  },

  form: {
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Changed to light background
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(203, 213, 225, 0.3)", // Changed to slate border
    borderRadius: "24px",
    padding: "3rem 2.5rem",
    boxShadow: `
      0 25px 50px -12px rgba(30, 41, 59, 0.15),
      0 0 0 1px rgba(203, 213, 225, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.8)
    `,
    position: "relative",
    overflow: "hidden",
  },

  headerSection: {
    textAlign: "center",
    marginBottom: "2.5rem",
  },

  title: {
    fontSize: "2.2rem",
    fontWeight: "800",
    fontFamily: "'Space Grotesk', sans-serif",
    background:
      "linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #3b82f6 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    marginBottom: "0.5rem",
    letterSpacing: "-0.02em",
  },

  subtitle: {
    color: "#475569", // Changed from white to slate-600
    fontSize: "0.95rem",
    fontWeight: "400",
    letterSpacing: "0.01em",
  },

  inputGroup: {
    position: "relative",
    marginBottom: "1.5rem",
  },

  input: {
    width: "100%",
    padding: "16px 20px",
    fontSize: "1rem",
    borderRadius: "16px",
    border: "1px solid rgba(203, 213, 225, 0.4)", // Changed to slate border
    backgroundColor: "rgba(248, 250, 252, 0.8)", // Changed to light slate background
    color: "#1e293b", // Changed from white to slate-800
    outline: "none",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    fontFamily: "'Inter', sans-serif",
    fontWeight: "400",
    backdropFilter: "blur(10px)",
  },

  inputUnderline: {
    position: "absolute",
    bottom: "0",
    left: "0",
    height: "2px",
    width: "0%",
    background: "linear-gradient(90deg, #a855f7, #ec4899)",
    transition: "width 0.3s ease",
    borderRadius: "1px",
  },

  button: {
    width: "100%",
    padding: "16px 24px",
    fontSize: "1.05rem",
    fontWeight: "600",
    borderRadius: "16px",
    border: "none",
    background: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
    color: "#ffffff",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Inter', sans-serif",
    marginTop: "1rem",
    boxShadow: "0 10px 25px rgba(168, 85, 247, 0.3)",
  },

  buttonText: {
    position: "relative",
    zIndex: "2",
  },

  buttonShimmer: {
    position: "absolute",
    top: "0",
    left: "-100%",
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
    animation: "shimmer 2s infinite",
  },

  divider: {
    display: "flex",
    alignItems: "center",
    margin: "2rem 0 1.5rem 0",
    position: "relative",
  },

  dividerText: {
    color: "#64748b", // Changed from white to slate-500
    fontSize: "0.85rem",
    fontWeight: "500",
    margin: "0 auto",
    padding: "0 1rem",
    backgroundColor: "rgba(248, 250, 252, 0.8)", // Changed to light background
    borderRadius: "20px",
    border: "1px solid rgba(203, 213, 225, 0.3)", // Changed to slate border
    backdropFilter: "blur(10px)",
  },

  errorContainer: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "12px 16px",
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    borderRadius: "12px",
    marginBottom: "1.5rem",
    backdropFilter: "blur(10px)",
  },

  errorIcon: {
    fontSize: "1.1rem",
  },

  error: {
    color: "#dc2626", // Changed from light red to red-600
    fontSize: "0.9rem",
    fontWeight: "500",
    margin: "0",
  },

  loginText: {
    textAlign: "center",
    fontSize: "0.95rem",
    color: "#475569", // Changed from white to slate-600
    fontWeight: "400",
  },

  loginLink: {
    color: "#a855f7",
    textDecoration: "none",
    fontWeight: "600",
    transition: "all 0.2s ease",
    backgroundImage: "linear-gradient(135deg, #a855f7, #ec4899)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
};

// Updated CSS for Signup page light theme
const signupUpdatedCSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;700;800&display=swap');

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  background: #f1f5f9; /* Changed to light slate */
  color: #1e293b; /* Changed to dark text */
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
  min-height: 100vh;
  position: relative;
}

body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(168, 85, 247, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(59, 130, 246, 0.06) 0%, transparent 50%);
  z-index: -2;
}

.floating-orb {
  position: fixed;
  border-radius: 50%;
  filter: blur(60px);
  z-index: -1;
  animation: float 12s ease-in-out infinite;
}

.floating-orb:nth-child(1) {
  top: 10%;
  left: 15%;
  width: 200px;
  height: 200px;
  background: linear-gradient(45deg, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.15));
  animation-delay: -2s;
}

.floating-orb:nth-child(2) {
  bottom: 15%;
  right: 20%;
  width: 150px;
  height: 150px;
  background: linear-gradient(45deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.15));
  animation-delay: -6s;
}

.floating-orb:nth-child(3) {
  top: 50%;
  left: 5%;
  width: 100px;
  height: 100px;
  background: linear-gradient(45deg, rgba(34, 197, 94, 0.15), rgba(168, 85, 247, 0.1));
  animation: pulse 8s ease-in-out infinite;
  animation-delay: -4s;
}

/* Animation keyframes */
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-20px) rotate(120deg); }
  66% { transform: translateY(10px) rotate(240deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 0.2; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(1.1); }
}

@keyframes slideInUp {
  from { 
    opacity: 0; 
    transform: translateY(50px) scale(0.95);
  }
  to { 
    opacity: 1; 
    transform: translateY(0) scale(1);
  }
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* Enhanced hover effects */
@media (hover: hover) and (pointer: fine) {
  .signup-input:hover {
    border-color: rgba(168, 85, 247, 0.6) !important;
    box-shadow: 0 0 20px rgba(168, 85, 247, 0.2) !important;
    transform: translateY(-1px) !important;
  }
  
  .signup-button:hover {
    transform: translateY(-3px) scale(1.02) !important;
    box-shadow: 0 15px 35px rgba(168, 85, 247, 0.4) !important;
  }
  
  .login-link:hover {
    color: rgba(236, 72, 153, 0.9) !important;
    transform: scale(1.05) !important;
  }
}

/* Input styling for light theme */
.signup-input::placeholder {
  color: #94a3b8; /* slate-400 for placeholder */
}

.signup-input:focus {
  border-color: rgba(168, 85, 247, 0.6);
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.15);
  background-color: rgba(255, 255, 255, 0.9);
}

/* Mobile responsive */
@media (max-width: 767px) {
  .signup-container {
    margin: 1rem !important;
    padding: 2rem 1.5rem !important;
  }
  
  .signup-title {
    font-size: 1.8rem !important;
  }
  
  .signup-input, .signup-button {
    padding: 14px 18px !important;
    font-size: 0.95rem !important;
  }
}

@media (min-width: 768px) and (max-width: 1024px) {
  .signup-container {
    max-width: 450px !important;
  }
}
`;

export { styles as signupStyles, signupUpdatedCSS };

export default Signup;
