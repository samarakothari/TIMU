import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

const isMobile = window.innerWidth < 768;

const Leaderboard = () => {
  const [posts, setPosts] = useState([]);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [animatedScores, setAnimatedScores] = useState({});
  const [editingPost, setEditingPost] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editStory, setEditStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);

  const isMobile = screenWidth < 768;

  useEffect(() => {
    // Add enhanced fonts and animations
    const style = document.createElement("style");
    style.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
            
            * { margin: 0; padding: 0; box-sizing: border-box; }
            
            body {
                background: linear-gradient(135deg, #0a0a0a 0%, #1a0a1a 50%, #0a0a1a 100%);
                color: #ffffff;
                font-family: 'Inter', sans-serif;
                overflow-x: hidden;
                min-height: 100vh;
            }
            .cosmic-leaderboard-orb {
                position: fixed;
                width: 300px;
                height: 300px;
                border-radius: 50%;
                filter: blur(80px);
                z-index: -1;
                opacity: 0.4;
                animation: titleFloat 12s ease-in-out infinite;
            }
            
            .cosmic-leaderboard-orb:nth-child(1) {
                top: 10%;
                left: 5%;
                background: radial-gradient(circle, rgba(255, 215, 0, 0.3), transparent);
                animation-delay: 0s;
            }
            
            .cosmic-leaderboard-orb:nth-child(2) {
                top: 40%;
                right: 5%;
                background: radial-gradient(circle, rgba(168, 85, 247, 0.3), transparent);
                animation-delay: 4s;
            }
            
            .cosmic-leaderboard-orb:nth-child(3) {
                bottom: 20%;
                left: 30%;
                background: radial-gradient(circle, rgba(236, 72, 153, 0.3), transparent);
                animation-delay: 8s;
            }
            
            .champion-crown {
                position: absolute;
                top: -15px;
                right: -15px;
                font-size: 2.5rem;
                animation: sparkle 2s ease-in-out infinite;
                filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.8));
            }
            
            .podium-sparkle {
                position: absolute;
                top: 10px;
                right: 10px;
                font-size: 1.5rem;
                animation: sparkle 1.5s ease-in-out infinite;
                opacity: 0.7;
            }
        `;
    document.head.appendChild(style);

    const onResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const postSnapshot = await getDocs(collection(db, "posts"));
      const postData = postSnapshot.docs.map((doc) => {
        const data = doc.data();
        const totalReactions = Object.values(data.reactions || {}).reduce(
          (a, b) => a + b,
          0
        );
        return {
          id: doc.id,
          ...data,
          totalReactions,
        };
      });

      // Sort posts by total reactions
      postData.sort((a, b) => b.totalReactions - a.totalReactions);
      setPosts(postData);

      // Animate score counting
      const scores = {};
      postData.forEach((post, index) => {
        setTimeout(() => {
          scores[post.id] = post.totalReactions;
          setAnimatedScores((prev) => ({
            ...prev,
            [post.id]: post.totalReactions,
          }));
        }, index * 100);
      });
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleDelete = async (postId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this post? This action cannot be undone."
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      await deleteDoc(doc(db, "posts", postId));
      setPosts(posts.filter((post) => post.id !== postId));

      // Remove from animated scores
      setAnimatedScores((prev) => {
        const newScores = { ...prev };
        delete newScores[postId];
        return newScores;
      });
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post. Please try again.");
    }
    setLoading(false);
  };

  const handleEdit = (post) => {
    setEditingPost(post.id);
    setEditTitle(post.title);
    setEditStory(post.story);
  };

  const handleSaveEdit = async (postId) => {
    if (!editTitle.trim() || !editStory.trim()) {
      alert("Please fill in both title and story.");
      return;
    }

    setLoading(true);
    try {
      await updateDoc(doc(db, "posts", postId), {
        title: editTitle.trim(),
        story: editStory.trim(),
        updatedAt: new Date(),
      });

      // Update local state
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? { ...post, title: editTitle.trim(), story: editStory.trim() }
            : post
        )
      );

      setEditingPost(null);
      setEditTitle("");
      setEditStory("");
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post. Please try again.");
    }
    setLoading(false);
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
    setEditTitle("");
    setEditStory("");
  };

  const canEditPost = (post) => {
    return user?.email && post?.user === user?.email;
  };

  const getRankStyle = (index) => {
    const baseStyle = { ...styles.card };

    if (index === 0) {
      return {
        ...baseStyle,
        ...styles.championCard,
        animation: "championGlow 3s ease-in-out infinite",
      };
    } else if (index === 1) {
      return {
        ...baseStyle,
        ...styles.silverCard,
        animation: "silverGlow 3s ease-in-out infinite",
      };
    } else if (index === 2) {
      return {
        ...baseStyle,
        ...styles.bronzeCard,
        animation: "bronzeGlow 3s ease-in-out infinite",
      };
    }

    return baseStyle;
  };

  const getRankIcon = (index) => {
    if (index === 0) return "👑";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `#${index + 1}`;
  };

  const getRankColor = (index) => {
    if (index === 0) return "#FFD700";
    if (index === 1) return "#C0C0C0";
    if (index === 2) return "#CD7F32";
    return "#a855f7";
  };

  return (
    <div style={styles.page}>
      <div className="cosmic-leaderboard-orb"></div>
      <div className="cosmic-leaderboard-orb"></div>
      <div className="cosmic-leaderboard-orb"></div>

      <div style={styles.backgroundOverlay}></div>

      <div style={styles.headerContainer}>
        <h1 style={styles.title}>
          <span style={styles.titleIcon}>🏆</span>
          <span style={styles.titleMain}>Hall of Chaos</span>
          <div style={styles.titleSubtitle}>
          Oops, upgraded
          </div>
          <div style={styles.titleUnderline}></div>
        </h1>
      </div>

      {posts.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🌌</div>
          <h3 style={styles.emptyTitle}>The Arena Awaits</h3>
          <p style={styles.emptyText}>
            No champions yet. Share your chaos and claim your throne in the hall
            of legends.
          </p>
          <div style={styles.emptyGlow}></div>
        </div>
      ) : (
        <div style={styles.container}>
          <div style={styles.statsBar}>
            <div style={styles.stat}>
              <span style={styles.statNumber}>
                {posts.reduce((sum, post) => sum + post.totalReactions, 0)}
              </span>
              <span style={styles.statLabel}>Total Reactions</span>
            </div>
          </div>

          <div style={styles.list}>
            {posts.slice(0, 10).map((post, index) => {
              const displayName = post.username || "Anonymous";
              const emoji = post.emoji || "👤";
              const color = post.color || "#ccc";
              const isEditing = editingPost === post.id;

              return (
                <div
                  key={post.id}
                  style={{
                    ...getRankStyle(index),
                    animationDelay: `${index * 0.1}s`,
                    animation: `${
                      getRankStyle(index).animation
                    }, slideInUp 0.6s ease-out ${index * 0.1}s both`,
                  }}
                  onMouseEnter={(e) => {
                    if (!isEditing) {
                      e.currentTarget.style.transform =
                        "translateY(-8px) scale(1.02)";
                      if (index < 3) {
                        e.currentTarget.style.filter =
                          "brightness(1.1) saturate(1.2)";
                      }
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isEditing) {
                      e.currentTarget.style.transform =
                        "translateY(0) scale(1)";
                      e.currentTarget.style.filter =
                        "brightness(1) saturate(1)";
                    }
                  }}
                >
                  {/* {index === 0 && <div className="champion-crown">👑</div>}
                  {(index === 1 || index === 2) && (
                    <div className="podium-sparkle">✨</div>
                  )} */}

                  <div style={styles.cardHeader}>
                    <div style={styles.rankContainer}>
                      <span
                        style={{
                          ...styles.rankNumber,
                          color: getRankColor(index),
                          animation:
                            index < 3
                              ? "pulseRank 2s ease-in-out infinite"
                              : "none",
                        }}
                      >
                        {getRankIcon(index)}
                      </span>
                      <div style={styles.rankInfo}>
                        <span style={styles.rankLabel}>
                          {index === 0
                            ? "Champion"
                            : index === 1
                            ? "Runner-up"
                            : index === 2
                            ? "Bronze"
                            : "Contestant"}
                        </span>
                      </div>
                    </div>

                    <div style={styles.scoreContainer}>
                      <span
                        style={{
                          ...styles.scoreNumber,
                          color: getRankColor(index),
                          animation: "countUp 0.8s ease-out",
                        }}
                      >
                        {animatedScores[post.id] || 0}
                      </span>
                      <span style={styles.scoreLabel}>reactions</span>
                    </div>
                  </div>

                  <div
                    style={{
                      ...styles.cardContent,
                      flexDirection: isMobile ? "column" : "row",
                      gap: isMobile ? "1rem" : "2rem",
                    }}
                  >
                    <div
                      style={{
                        ...styles.postInfo,
                        width: isMobile ? "100%" : "auto",
                      }}
                    >
                      {isEditing ? (
                        <div style={styles.editForm}>
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            style={styles.editInput}
                            placeholder="Post title..."
                            maxLength={100}
                          />
                          <textarea
                            value={editStory}
                            onChange={(e) => setEditStory(e.target.value)}
                            style={styles.editTextarea}
                            placeholder="Tell your story..."
                            maxLength={500}
                            rows={4}
                          />
                          <div style={styles.editButtons}>
                            <button
                              style={{
                                ...styles.editActionButton,
                                ...styles.saveButton,
                              }}
                              onClick={() => handleSaveEdit(post.id)}
                              disabled={
                                loading ||
                                !editTitle.trim() ||
                                !editStory.trim()
                              }
                            >
                              {loading ? "Saving..." : "Save"}
                            </button>
                            <button
                              style={{
                                ...styles.editActionButton,
                                ...styles.cancelButton,
                              }}
                              onClick={handleCancelEdit}
                              disabled={loading}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h3 style={styles.postTitle}>{post.title}</h3>
                          <p style={styles.postStory}>{post.story}</p>
                        </>
                      )}
                    </div>

                    <div
                      style={{
                        ...styles.authorInfo,
                        minWidth: isMobile ? "auto" : "200px",
                        width: isMobile ? "100%" : "auto",
                      }}
                    >
                      <div style={styles.authorAvatar}>
                        <span style={styles.authorEmoji}>{emoji}</span>
                      </div>
                      <div style={styles.authorDetails}>
                        <span style={{ ...styles.authorName, color }}>
                          {displayName}
                        </span>
                        <span style={styles.authorTitle}>
                          {new Date(
                            post.createdAt?.seconds * 1000 +
                              post.createdAt?.nanoseconds / 1e6
                          ).toLocaleString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={styles.reactionsSection}>
                    <div style={styles.reactionsSummary}>
                      <span style={styles.reactionsLabel}>
                        Community Response
                      </span>
                    </div>
                    <div style={styles.reactions}>
                      {Object.entries(post.reactions || {})
                        .filter(([, count]) => count > 0)
                        .sort(([, a], [, b]) => b - a)
                        .map(([emoji, count], reactionIndex) => (
                          <div
                            key={emoji}
                            style={{
                              ...styles.reaction,
                              animationDelay: `${
                                index * 0.1 + reactionIndex * 0.05
                              }s`,
                            }}
                          >
                            <span style={styles.reactionEmoji}>{emoji}</span>
                            <span style={styles.reactionCount}>{count}</span>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Place this AFTER the reactions section and before the card's closing div */}
                  {canEditPost(post) && !isEditing && (
                    <div style={styles.actionButtons}>
                      <button
                        style={styles.editButton}
                        onClick={() => handleEdit(post)}
                        disabled={loading}
                        title="Edit post"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.05)";
                          e.currentTarget.style.background =
                            "linear-gradient(135deg, #3b82f6, #1d4ed8)";
                          e.currentTarget.style.boxShadow =
                            "0 8px 25px rgba(59, 130, 246, 0.4)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                          e.currentTarget.style.background =
                            "linear-gradient(135deg, #4f46e5, #3730a3)";
                          e.currentTarget.style.boxShadow =
                            "0 4px 15px rgba(79, 70, 229, 0.3)";
                        }}
                      >
                        <span style={styles.buttonIcon}>✏️</span>
                        {/* <span style={styles.buttonText}>Edit</span> */}
                      </button>
                      <button
                        style={styles.deleteButton}
                        onClick={() => handleDelete(post.id)}
                        disabled={loading}
                        title="Delete post"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.05)";
                          e.currentTarget.style.background =
                            "linear-gradient(135deg, #dc2626, #991b1b)";
                          e.currentTarget.style.boxShadow =
                            "0 8px 25px rgba(220, 38, 38, 0.4)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                          e.currentTarget.style.background =
                            "linear-gradient(135deg, #ef4444, #b91c1c)";
                          e.currentTarget.style.boxShadow =
                            "0 4px 15px rgba(239, 68, 68, 0.3)";
                        }}
                      >
                        <span style={styles.buttonIcon}>🗑️</span>
                        {/* <span style={styles.buttonText}>Delete</span> */}
                      </button>
                    </div>
                  )}

                  <div style={styles.cardGlow}></div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Replace the existing styles object with these updated colors for better text visibility

const styles = {
  page: {
    background: "#f1f5f9", // Keep your existing light background
    backgroundSize: "400% 400%",
    minHeight: "100vh",
    padding: "2rem",
    fontFamily: "'Inter', sans-serif",
    position: "relative",
    overflow: "hidden",
  },

  backgroundOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "radial-gradient(ellipse at top center, rgba(251, 113, 133, 0.08) 0%, transparent 60%)",
    pointerEvents: "none",
    zIndex: 0,
  },

  headerContainer: {
    textAlign: "center",
    marginBottom: "3rem",
    zIndex: 1,
    position: "relative",
  },

  title: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
    animation: "titleFloat 6s ease-in-out infinite",
    position: "relative",
  },

  titleIcon: {
    fontSize: "4rem",
    filter: "drop-shadow(0 0 30px rgba(251, 113, 133, 0.6))",
    animation: "sparkle 2s ease-in-out infinite",
  },

  titleMain: {
    fontSize: "clamp(2.5rem, 8vw, 5rem)",
    fontWeight: "900",
    background:
      "linear-gradient(135deg, #fb7185 0%, #d946ef 50%, #6366f1 100%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "3px",
    fontFamily: "'Space Grotesk', sans-serif",
    textShadow: "0 0 50px rgba(251, 113, 133, 0.3)",
  },

  titleSubtitle: {
    fontSize: "1.2rem",
    color: "#475569", // Already good - slate-600
    fontWeight: "400",
    letterSpacing: "1px",
    fontFamily: "'JetBrains Mono', monospace",
    textAlign: "center",
    maxWidth: "600px",
    lineHeight: "1.4",
  },

  titleUnderline: {
    width: "300px",
    height: "4px",
    background:
      "linear-gradient(90deg, transparent, #fb7185, #d946ef, transparent)",
    borderRadius: "2px",
    marginTop: "1rem",
  },

  emptyState: {
    textAlign: "center",
    padding: "4rem 2rem",
    background: "rgba(255, 255, 255, 0.7)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(251, 113, 133, 0.2)",
    borderRadius: "32px",
    position: "relative",
    maxWidth: "600px",
    margin: "0 auto",
    zIndex: 1,
    animation: "championGlow 4s ease-in-out infinite",
  },

  emptyIcon: {
    fontSize: "5rem",
    marginBottom: "2rem",
    filter: "drop-shadow(0 0 30px rgba(251, 113, 133, 0.4))",
  },

  emptyTitle: {
    fontSize: "2.5rem",
    fontWeight: "800",
    marginBottom: "1rem",
    background: "linear-gradient(135deg, #fb7185, #d946ef)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontFamily: "'Space Grotesk', sans-serif",
  },

  emptyText: {
    fontSize: "1.2rem",
    color: "#1e293b", // Changed from #000 to slate-800 for better consistency
    lineHeight: "1.6",
    fontWeight: "300",
    maxWidth: "500px",
    margin: "0 auto",
  },

  emptyGlow: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    height: "80%",
    background:
      "radial-gradient(ellipse, rgba(251, 113, 133, 0.1), transparent)",
    borderRadius: "50%",
    filter: "blur(50px)",
    zIndex: -1,
  },

  container: {
    maxWidth: "750px",
    margin: "0 auto",
    zIndex: 1,
    position: "relative",
  },

  statsBar: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "2rem",
    marginBottom: "3rem",
    background: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(203, 213, 225, 0.3)",
    borderRadius: "20px",
    padding: "1.5rem 2rem",
    flexWrap: "wrap",
    boxShadow: "0 8px 32px rgba(30, 41, 59, 0.08)",
  },

  stat: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.5rem",
  },

  statNumber: {
    fontSize: "2rem",
    fontWeight: "800",
    background: "linear-gradient(135deg, #d946ef, #6366f1)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontFamily: "'JetBrains Mono', monospace",
  },

  statLabel: {
    fontSize: "0.9rem",
    color: "#64748b", // Already good - slate-500
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },

  statDivider: {
    width: "1px",
    height: "40px",
    background:
      "linear-gradient(to bottom, transparent, rgba(203, 213, 225, 0.5), transparent)",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },

  card: {
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(30px)",
    border: "1px solid rgba(203, 213, 225, 0.3)",
    borderRadius: "24px",
    padding: "2rem",
    position: "relative",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer",
    overflow: "hidden",
    boxShadow: "0 20px 40px rgba(30, 41, 59, 0.08)",
  },

  championCard: {
    border: "2px solid rgba(251, 113, 133, 0.4)",
    background: "rgba(251, 113, 133, 0.05)",
    transform: "scale(1.02)",
  },

  silverCard: {
    border: "2px solid rgba(148, 163, 184, 0.4)",
    background: "rgba(148, 163, 184, 0.05)",
  },

  bronzeCard: {
    border: "2px solid rgba(245, 158, 11, 0.4)",
    background: "rgba(245, 158, 11, 0.05)",
  },

  actionButtons: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "20px",
    paddingTop: "20px",
    borderTop: "1px solid rgba(203, 213, 225, 0.3)",
  },

  editButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 16px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #4f46e5, #3730a3)",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    fontFamily: "'Inter', sans-serif",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 4px 15px rgba(79, 70, 229, 0.3)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    outline: "none",
    position: "relative",
    overflow: "hidden",
  },

  deleteButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 16px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #ef4444, #b91c1c)",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    fontFamily: "'Inter', sans-serif",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 4px 15px rgba(239, 68, 68, 0.3)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    outline: "none",
    position: "relative",
    overflow: "hidden",
  },

  buttonIcon: {
    fontSize: "16px",
    filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))",
  },

  buttonText: {
    fontSize: "12px",
    fontWeight: "700",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
    paddingBottom: "1rem",
    borderBottom: "1px solid rgba(203, 213, 225, 0.3)", // Changed from white to slate
  },

  rankContainer: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },

  rankNumber: {
    fontSize: "2.5rem",
    fontWeight: "900",
    fontFamily: "'Space Grotesk', sans-serif",
    filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))",
  },

  rankInfo: {
    display: "flex",
    flexDirection: "column",
  },

  rankLabel: {
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#64748b", // Changed from white to slate-500
    textTransform: "uppercase",
    letterSpacing: "1px",
  },

  scoreContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "0.3rem",
  },

  scoreNumber: {
    fontSize: "2.2rem",
    fontWeight: "800",
    fontFamily: "'JetBrains Mono', monospace",
    filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))",
  },

  scoreLabel: {
    fontSize: "0.8rem",
    color: "#94a3b8", // Changed from white to slate-400
    textTransform: "uppercase",
    letterSpacing: "1px",
  },

  cardContent: {
    display: "flex",
    gap: isMobile ? "1rem" : "2rem",
    marginBottom: "2rem",
    alignItems: "flex-start",
    flexDirection: isMobile ? "column" : "row",
  },

  postInfo: {
    flex: 1,
    width: isMobile ? "100%" : "auto",
  },

  postTitle: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#1e293b", // Changed from white to slate-800
    marginBottom: "1rem",
    lineHeight: "1.3",
    fontFamily: "'Space Grotesk', sans-serif",
  },

  postStory: {
    fontSize: "1rem",
    color: "#475569", // Changed from white to slate-600
    lineHeight: "1.6",
    fontWeight: "400", // Increased from 300 for better readability
  },

  editForm: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },

  editInput: {
    padding: "1rem",
    borderRadius: "12px",
    border: "1px solid rgba(203, 213, 225, 0.5)", // Changed from white to slate
    background: "rgba(255, 255, 255, 0.8)", // Increased opacity
    backdropFilter: "blur(10px)",
    color: "#1e293b", // Changed from white to slate-800
    fontSize: "1.2rem",
    fontWeight: "600",
    fontFamily: "'Space Grotesk', sans-serif",
    outline: "none",
    transition: "all 0.3s ease",
  },

  editTextarea: {
    padding: "1rem",
    borderRadius: "12px",
    border: "1px solid rgba(203, 213, 225, 0.5)", // Changed from white to slate
    background: "rgba(255, 255, 255, 0.8)", // Increased opacity
    backdropFilter: "blur(10px)",
    color: "#1e293b", // Changed from white to slate-800
    fontSize: "1rem",
    fontFamily: "'Inter', sans-serif",
    outline: "none",
    resize: "vertical",
    minHeight: "100px",
    transition: "all 0.3s ease",
  },

  editButtons: {
    display: "flex",
    gap: "0.8rem",
    justifyContent: "flex-end",
    marginTop: "0.5rem",
  },

  editActionButton: {
    padding: "0.8rem 1.5rem",
    borderRadius: "12px",
    border: "1px solid rgba(203, 213, 225, 0.3)",
    background: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(10px)",
    color: "#1e293b", // Changed from white to slate-800
    fontSize: "0.9rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  saveButton: {
    background: "linear-gradient(135deg, #10b981, #059669)",
    borderColor: "rgba(16, 185, 129, 0.5)",
    color: "#ffffff", // Keep white for good contrast on green
  },

  cancelButton: {
    background: "rgba(148, 163, 184, 0.2)",
    borderColor: "rgba(148, 163, 184, 0.5)",
    color: "#475569", // slate-600 for better readability
  },

  authorInfo: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    minWidth: isMobile ? "auto" : "200px",
    width: isMobile ? "100%" : "auto",
  },

  authorAvatar: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: "rgba(248, 250, 252, 0.8)", // Changed to light slate
    border: "2px solid rgba(203, 213, 225, 0.4)", // Changed to slate
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(10px)",
  },

  authorEmoji: {
    fontSize: "1.8rem",
    filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))",
  },

  authorDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "0.3rem",
  },

  authorName: {
    fontSize: "1rem",
    fontWeight: "700",
    filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))", // Reduced shadow
    // Color will be applied dynamically from post.color
  },

  authorTitle: {
    fontSize: "0.8rem",
    color: "#94a3b8", // Changed from white to slate-400
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  reactionsSection: {
    borderTop: "1px solid rgba(203, 213, 225, 0.3)", // Changed from white to slate
    paddingTop: "1.5rem",
  },

  reactionsSummary: {
    marginBottom: "1rem",
  },

  reactionsLabel: {
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#8b5cf6", // Keep violet for accent
    textTransform: "uppercase",
    letterSpacing: "1px",
    fontFamily: "'JetBrains Mono', monospace",
  },

  reactions: {
    display: "flex",
    gap: "0.8rem",
    flexWrap: "wrap",
  },

  reaction: {
    background: "rgba(248, 250, 252, 0.6)", // Changed to light slate
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(203, 213, 225, 0.3)", // Changed to slate
    borderRadius: "16px",
    padding: "8px 16px",
    display: "flex",
    alignItems: "center",
    gap: "0.3rem",
    fontSize: "0.85rem",
    whiteSpace: "nowrap",
    color: "#475569", // Added slate-600 for text
  },

  reactionEmoji: {},

  reactionCount: {
    fontWeight: "600",
    fontFamily: "'JetBrains Mono', monospace",
    color: "#1e293b", // Added slate-800 for count
  },

  cardGlow: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    height: "90%",
    background:
      "radial-gradient(ellipse, rgba(168, 85, 247, 0.1), transparent)",
    borderRadius: "inherit",
    filter: "blur(30px)",
    zIndex: -1,
    opacity: 0.5,
  },
};

export default Leaderboard;
