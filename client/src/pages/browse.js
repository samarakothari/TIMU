import React, { useEffect, useState, useCallback } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  updateDoc,
  increment,
  getDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const EMOJIS = ["🔥", "😂", "🤯", "😬", "😭"];
const FALLBACK_NAMES = ["Tiger", "Sloth", "Ferret", "Koala", "Capybara"];
const PROFILE_EMOJIS = ["🐸", "🦊", "🐼", "🦁", "🐧"];
const USERNAME_COLORS = ["#f43f5e", "#0ea5e9", "#f59e0b", "#22c55e", "#8b5cf6"];

function Browse() {
  const [posts, setPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [navDisabled, setNavDisabled] = useState(false);
  const [usernames, setUsernames] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: "", story: "" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { user } = useAuth();

  

  console.log(posts,"postsposts")

  useEffect(() => {
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
            
            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-8px); }
            }
            
            @keyframes glow {
                0%, 100% { box-shadow: 0 0 20px rgba(251, 113, 133, 0.15); }
                50% { box-shadow: 0 0 30px rgba(217, 70, 239, 0.2); }
            }
            
            @keyframes orbitFloat {
                0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
                33% { transform: translate(30px, -30px) rotate(120deg); }
                66% { transform: translate(-20px, 20px) rotate(240deg); }
            }
            
            .orb {
                position: fixed;
                width: 180px;
                height: 180px;
                border-radius: 50%;
                filter: blur(60px);
                z-index: -1;
                opacity: 0.4;
            }
            
            .orb:nth-child(1) {
                top: 10%;
                left: 10%;
                background: radial-gradient(circle, rgba(251, 113, 133, 0.3), transparent);
                animation: orbitFloat 8s ease-in-out infinite;
            }
            
            .orb:nth-child(2) {
                top: 60%;
                right: 10%;
                background: radial-gradient(circle, rgba(217, 70, 239, 0.25), transparent);
                animation: orbitFloat 10s ease-in-out infinite reverse;
            }
            
            .orb:nth-child(3) {
                bottom: 20%;
                left: 60%;
                width: 150px;
                height: 150px;
                background: radial-gradient(circle, rgba(99, 102, 241, 0.2), transparent);
                animation: orbitFloat 12s ease-in-out infinite;
                animation-delay: -4s;
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
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, async (snapshot) => {
      const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setPosts(docs);

      const uids = [...new Set(docs.map((p) => p.user))];
      const map = {};
      await Promise.all(
        uids.map(async (uid) => {
          try {
            const ref = doc(db, "usernames", uid);
            const snap = await getDoc(ref);

            if (snap.exists()) {
              const d = snap.data();
              map[uid] = {
                ...d,
                displayName: d.username || d.anonName || "Anonymous",
              };
            } else {
              const fallbackAnimal =
                FALLBACK_NAMES[
                  Math.floor(Math.random() * FALLBACK_NAMES.length)
                ];
              const rand = Math.floor(100 + Math.random() * 900);
              const emoji =
                PROFILE_EMOJIS[
                  Math.floor(Math.random() * PROFILE_EMOJIS.length)
                ];
              const color =
                USERNAME_COLORS[
                  Math.floor(Math.random() * USERNAME_COLORS.length)
                ];
              const anonName = `Anonymous ${fallbackAnimal} #${rand}`;
              const newProfile = {
                anonName,
                emoji,
                color,
                displayName: anonName,
              };
              await setDoc(ref, newProfile);
              map[uid] = newProfile;
            }
          } catch {
            map[uid] = { displayName: "Anonymous", emoji: "👻", color: "#475569" };
          }
        })
      );
      setUsernames(map);
    });
    return () => unsub();
  }, []);

  const handleReaction = useCallback(
    async (postId, emoji) => {
      if (!user)
        return alert(
          "Oops! You need to be logged in to react. Head over to Post and log in to join the fun!"
        );
      const uid = user.uid;
      const postRef = doc(db, "posts", postId);
      const psnap = await getDoc(postRef);
      if (!psnap.exists()) return;

      const data = psnap.data();
      const uReacts = data.reactionUsers?.[uid] || [];
      if (uReacts.length >= 5) return alert("Max 5 reactions per post.");

      const updated = [...uReacts, emoji];
      await updateDoc(postRef, {
        [`reactions.${emoji}`]: increment(1),
        [`reactionUsers.${uid}`]: updated,
      });
    },
    [user]
  );

  const handleEdit = () => {
    const current = posts[currentIndex];
    if (!current || !user || current.user !== user?.email) return;

    setEditForm({
      title: current.title,
      story: current.story,
    });
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    const current = posts[currentIndex];
    if (!current || !user || current.user !== user?.email) return;

    if (!editForm.title.trim() || !editForm.story.trim()) {
      alert("Title and story cannot be empty!");
      return;
    }

    try {
      const postRef = doc(db, "posts", current?.id);
      await updateDoc(postRef, {
        title: editForm.title.trim(),
        story: editForm.story.trim(),
        updatedAt: new Date(),
      });
      setIsEditing(false);
      setEditForm({ title: "", story: "" });
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post. Please try again.");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({ title: "", story: "" });
  };

  const handleDelete = () => {
    const current = posts[currentIndex];
    console.log(current, "handleDelete");
    if (!current || !user || current.user !== user?.email) return;
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    const current = posts[currentIndex];
    console.log(current, "confirmDelete");
    if (!current || !user || current.user !== user?.email) return;

    try {
      const postRef = doc(db, "posts", current.id);
      await deleteDoc(postRef);

      // Navigate to next post or previous if this was the last one
      if (posts.length > 1) {
        if (currentIndex >= posts.length - 1) {
          setCurrentIndex(0);
        }
      } else {
        setCurrentIndex(0);
      }

      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post. Please try again.");
    }
  };

  const next = () => {
    if (navDisabled || posts.length === 0) return;
    setDirection(1);
    setCurrentIndex((i) => (i + 1) % posts.length);
    setNavDisabled(true);
    setTimeout(() => setNavDisabled(false), 200);
  };
  const prev = () => {
    if (navDisabled || posts.length === 0) return;
    setDirection(-1);
    setCurrentIndex((i) => (i - 1 + posts.length) % posts.length);
    setNavDisabled(true);
    setTimeout(() => setNavDisabled(false), 200);
  };
  const variants = {
    enter: (dir) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: (dir) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    }),
  };

  const current = posts[currentIndex];
  const meta = current
    ? {
        ...usernames[current.user],
        displayName:
          current.username ||
          usernames[current.user]?.displayName ||
          "Anonymous",
      }
    : null;

  const isOwner = current && user && current.user === user?.email;

  return (
    <div style={styles.page}>
      <div className="orb"></div>
      <div className="orb"></div>
      <div className="orb"></div>

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={styles.headerContainer}
      >
        <h1 style={styles.title}>
          <span style={styles.titleMain}>Today I</span>
          <span style={styles.titleEmphasis}>Messed Up</span>
        </h1>
        <p style={styles.subtitle}>Real stories, real chaos</p>
      </motion.div>

      {!current ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={styles.emptyState}
        >
          <div style={styles.emptyIcon}>🌌</div>
          <h3 style={styles.emptyTitle}>No Stories Yet</h3>
          <p style={styles.emptyText}>Be the first to share your chaos.</p>
        </motion.div>
      ) : (
        <div style={styles.contentWrapper}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={styles.postIndicator}
          >
            Story {currentIndex + 1} of {posts.length}
          </motion.div>

          <div style={styles.postContainer}>
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={current.id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                style={styles.post}
                drag={!isEditing ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={
                  !isEditing
                    ? (e, { offset, velocity }) => {
                        const swipePower = Math.abs(offset.x) * velocity.x;
                        const swipeConfidenceThreshold = 3000;

                        if (swipePower > swipeConfidenceThreshold) {
                          prev();
                        } else if (swipePower < -swipeConfidenceThreshold) {
                          next();
                        }
                      }
                    : undefined
                }
              >
                <div style={styles.postHeader}>
                  <div style={styles.profileContainer}>
                    <span style={styles.profileEmoji}>
                      {meta?.emoji || "👤"}
                    </span>
                    <div style={styles.profileInfo}>
                      <span
                        style={{
                          ...styles.username,
                          color: meta?.color || "#475569",
                        }}
                      >
                        {meta?.displayName}
                      </span>
                      <span style={styles.postTime}>
                        {new Date(
                          current?.createdAt?.seconds * 1000 +
                            current?.createdAt?.nanoseconds / 1e6
                        ).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                        {current?.updatedAt && " • Edited"}
                      </span>
                    </div>
                  </div>
                  {/* Edit/Delete Actions */}
                  {isOwner && !isEditing && (
                    <div style={styles.actionsContainer}>
                      <motion.button
                        onClick={handleEdit}
                        style={styles.actionButton}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        ✏️ Edit
                      </motion.button>
                      <motion.button
                        onClick={handleDelete}
                        style={{
                          ...styles.actionButton,
                          ...styles.deleteButton,
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        🗑️ Delete
                      </motion.button>
                    </div>
                  )}

                  {isEditing ? (
                    <div style={styles.editForm}>
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) =>
                          setEditForm({ ...editForm, title: e.target.value })
                        }
                        style={styles.editInput}
                        placeholder="Enter title..."
                        maxLength={100}
                      />
                    </div>
                  ) : (
                    <h2 style={styles.postTitle}>{current.title}</h2>
                  )}
                </div>

                {isEditing ? (
                  <div style={styles.editForm}>
                    <textarea
                      value={editForm.story}
                      onChange={(e) =>
                        setEditForm({ ...editForm, story: e.target.value })
                      }
                      style={styles.editTextarea}
                      placeholder="Share your story..."
                      maxLength={2000}
                      rows={8}
                    />
                    <div style={styles.editActions}>
                      <motion.button
                        onClick={handleSaveEdit}
                        style={styles.saveButton}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        💾 Save Changes
                      </motion.button>
                      <motion.button
                        onClick={handleCancelEdit}
                        style={styles.cancelButton}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        ❌ Cancel
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <p style={styles.story}>{current.story}</p>
                )}

                {!isEditing && (
                  <div style={styles.reactionsContainer}>
                    <div style={styles.reactions}>
                      {EMOJIS.map((e) => (
                        <motion.button
                          key={e}
                          style={styles.reaction}
                          onClick={() => handleReaction(current.id, e)}
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <span style={styles.reactionEmoji}>{e}</span>
                          <span style={styles.reactionCount}>
                            {current.reactions?.[e] || 0}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            style={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              style={styles.modal}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={styles.modalTitle}>Delete Story?</h3>
              <p style={styles.modalText}>
                This action cannot be undone. Your story and all reactions will
                be permanently deleted.
              </p>
              <div style={styles.modalActions}>
                <motion.button
                  onClick={confirmDelete}
                  style={styles.confirmDeleteButton}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Delete Forever
                </motion.button>
                <motion.button
                  onClick={() => setShowDeleteModal(false)}
                  style={styles.cancelButton}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Keep Story
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const styles = {
  page: {
    background: "#f1f5f9",
    minHeight: "100vh",
    padding: "clamp(1rem, 4vw, 2rem)",
    fontFamily: "'Inter', sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },

  headerContainer: {
    textAlign: "center",
    marginBottom: "clamp(1.5rem, 4vw, 2rem)",
    zIndex: 1,
  },

  title: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.25rem",
    marginBottom: "0.5rem",
    animation: "float 4s ease-in-out infinite",
  },

  titleMain: {
    fontSize: "clamp(1.8rem, 6vw, 3rem)",
    fontWeight: "300",
    color: "#475569",
    letterSpacing: "1px",
    fontFamily: "'Space Grotesk', sans-serif",
  },

  titleEmphasis: {
    fontSize: "clamp(2rem, 7vw, 3.5rem)",
    fontWeight: "700",
    background: "linear-gradient(135deg, #fb7185 0%, #d946ef 50%, #6366f1 100%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "2px",
    fontFamily: "'Space Grotesk', sans-serif",
    filter: "drop-shadow(0 0 20px rgba(251, 113, 133, 0.2))",
  },

  subtitle: {
    fontSize: "clamp(0.9rem, 2vw, 1.1rem)",
    color: "#64748b",
    fontWeight: "400",
    letterSpacing: "0.5px",
  },

  emptyState: {
    textAlign: "center",
    padding: "clamp(2rem, 6vw, 3rem)",
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(203, 213, 225, 0.3)",
    borderRadius: "24px",
    maxWidth: "400px",
    zIndex: 1,
    animation: "glow 3s ease-in-out infinite",
    boxShadow: "0 8px 32px rgba(30, 41, 59, 0.08)",
  },

  emptyIcon: {
    fontSize: "clamp(3rem, 8vw, 4rem)",
    marginBottom: "1rem",
  },

  emptyTitle: {
    fontSize: "clamp(1.2rem, 4vw, 1.8rem)",
    fontWeight: "700",
    marginBottom: "0.5rem",
    background: "linear-gradient(135deg, #1e293b, #fb7185)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  emptyText: {
    fontSize: "clamp(0.9rem, 2vw, 1rem)",
    color: "#64748b",
    lineHeight: "1.5",
  },

  contentWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "clamp(1rem, 3vw, 1.5rem)",
    width: "100%",
    maxWidth: "900px",
    zIndex: 1,
  },

  postIndicator: {
    background: "rgba(248, 250, 252, 0.9)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(203, 213, 225, 0.3)",
    borderRadius: "16px",
    padding: "clamp(8px, 2vw, 12px) clamp(16px, 4vw, 24px)",
    fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
    fontWeight: "600",
    color: "#475569",
    boxShadow: "0 4px 15px rgba(30, 41, 59, 0.05)",
  },

  postContainer: {
    width: "100%",
    maxWidth: "700px",
  },

  post: {
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(203, 213, 225, 0.2)",
    borderRadius: "24px",
    padding: "clamp(1.5rem, 5vw, 2.5rem)",
    boxShadow: "0 20px 40px rgba(30, 41, 59, 0.08), 0 0 60px rgba(251, 113, 133, 0.05)",
    animation: "glow 5s ease-in-out infinite",
  },

  postHeader: {
    marginBottom: "clamp(1rem, 3vw, 1.5rem)",
    paddingBottom: "clamp(1rem, 3vw, 1.5rem)",
    borderBottom: "1px solid rgba(203, 213, 225, 0.2)",
  },

  profileContainer: {
    display: "flex",
    alignItems: "center",
    gap: "clamp(0.75rem, 2vw, 1rem)",
    marginBottom: "clamp(1rem, 3vw, 1.5rem)",
  },

  profileEmoji: {
    fontSize: "clamp(1.5rem, 4vw, 2rem)",
    width: "clamp(40px, 10vw, 50px)",
    height: "clamp(40px, 10vw, 50px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(248, 250, 252, 0.8)",
    border: "2px solid rgba(203, 213, 225, 0.3)",
    borderRadius: "50%",
    backdropFilter: "blur(10px)",
  },

  profileInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  },

  username: {
    fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
    fontWeight: "700",
  },

  postTime: {
    fontSize: "clamp(0.7rem, 1.8vw, 0.8rem)",
    color: "#94a3b8",
  },

  postTitle: {
    fontSize: "clamp(1.2rem, 4vw, 2rem)",
    fontWeight: "800",
    lineHeight: "1.2",
    background: "linear-gradient(135deg, #1e293b 0%, #475569 100%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontFamily: "'Space Grotesk', sans-serif",
  },

  story: {
    fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
    lineHeight: "1.6",
    color: "#475569",
    fontWeight: "400",
    marginBottom: "clamp(1rem, 3vw, 1.5rem)",
    paddingLeft: "0.75rem",
    borderLeft: "3px solid rgba(251, 113, 133, 0.3)",
  },

  reactionsContainer: {
    borderTop: "1px solid rgba(203, 213, 225, 0.2)",
    paddingTop: "clamp(1rem, 3vw, 1.5rem)",
  },

  reactions: {
    display: "flex",
    gap: "clamp(0.5rem, 2vw, 1rem)",
    justifyContent: "center",
    flexWrap: "wrap",
  },

  reaction: {
    cursor: "pointer",
    background: "rgba(248, 250, 252, 0.9)",
    backdropFilter: "blur(10px)",
    border: "2px solid rgba(203, 213, 225, 0.2)",
    borderRadius: "16px",
    padding: "clamp(8px, 2vw, 12px) clamp(12px, 3vw, 16px)",
    display: "flex",
    alignItems: "center",
    gap: "clamp(4px, 1vw, 8px)",
    fontSize: "clamp(0.8rem, 2vw, 1rem)",
    fontWeight: "600",
    color: "#1e293b",
    transition: "all 0.2s ease",
    outline: "none",
    boxShadow: "0 4px 15px rgba(30, 41, 59, 0.05)",
  },

  reactionEmoji: {
    fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
  },

  reactionCount: {
    fontSize: "clamp(0.7rem, 1.8vw, 0.8rem)",
    fontWeight: "700",
    color: "#fb7185",
    minWidth: "16px",
    textAlign: "center",
  },

  // New styles for edit/delete functionality
  actionsContainer: {
    display: "flex",
    gap: "0.5rem",
    marginBottom: "1rem",
    justifyContent: "flex-end",
    flexWrap: "wrap",
  },

  actionButton: {
    background: "rgba(248, 250, 252, 0.9)",
    backdropFilter: "blur(10px)",
    border: "2px solid rgba(203, 213, 225, 0.2)",
    borderRadius: "12px",
    padding: "8px 16px",
    color: "#1e293b",
    fontSize: "0.85rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    outline: "none",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    boxShadow: "0 2px 8px rgba(30, 41, 59, 0.05)",
  },

  deleteButton: {
    borderColor: "rgba(239, 68, 68, 0.3)",
    background: "rgba(254, 242, 242, 0.9)",
    color: "#dc2626",
  },

  editForm: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },

  editInput: {
    background: "rgba(248, 250, 252, 0.95)",
    backdropFilter: "blur(10px)",
    border: "2px solid rgba(203, 213, 225, 0.2)",
    borderRadius: "12px",
    padding: "12px 16px",
    color: "#1e293b",
    fontSize: "1.1rem",
    fontWeight: "600",
    outline: "none",
    fontFamily: "'Space Grotesk', sans-serif",
    boxShadow: "0 2px 8px rgba(30, 41, 59, 0.05)",
  },

  editTextarea: {
    background: "rgba(248, 250, 252, 0.95)",
    backdropFilter: "blur(10px)",
    border: "2px solid rgba(203, 213, 225, 0.2)",
    borderRadius: "12px",
    padding: "16px",
    color: "#1e293b",
    fontSize: "1rem",
    lineHeight: "1.6",
    outline: "none",
    resize: "vertical",
    minHeight: "200px",
    fontFamily: "'Inter', sans-serif",
    boxShadow: "0 2px 8px rgba(30, 41, 59, 0.05)",
  },

  editActions: {
    display: "flex",
    gap: "1rem",
    justifyContent: "flex-end",
    flexWrap: "wrap",
  },

  saveButton: {
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    border: "2px solid rgba(34, 197, 94, 0.3)",
    borderRadius: "12px",
    padding: "12px 24px",
    color: "#ffffff",
    fontSize: "0.9rem",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.2s ease",
    outline: "none",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    boxShadow: "0 4px 15px rgba(34, 197, 94, 0.2)",
  },

  cancelButton: {
    background: "rgba(148, 163, 184, 0.2)",
    border: "2px solid rgba(148, 163, 184, 0.3)",
    borderRadius: "12px",
    padding: "12px 24px",
    color: "#1e293b",
    fontSize: "0.9rem",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.2s ease",
    outline: "none",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    boxShadow: "0 2px 8px rgba(30, 41, 59, 0.05)",
  },

  // Modal styles
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(30, 41, 59, 0.8)",
    backdropFilter: "blur(8px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "1rem",
  },

  modal: {
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    border: "2px solid rgba(203, 213, 225, 0.2)",
    borderRadius: "24px",
    padding: "2rem",
    maxWidth: "400px",
    width: "100%",
    textAlign: "center",
    boxShadow: "0 20px 40px rgba(30, 41, 59, 0.15)",
  },

  modalTitle: {
    fontSize: "1.5rem",
    fontWeight: "700",
    marginBottom: "1rem",
    background: "linear-gradient(135deg, #1e293b, #ef4444)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontFamily: "'Space Grotesk', sans-serif",
  },

  modalText: {
    fontSize: "1rem",
    color: "#475569",
    lineHeight: "1.5",
    marginBottom: "2rem",
  },

  modalActions: {
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
    flexWrap: "wrap",
  },

  confirmDeleteButton: {
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    border: "2px solid rgba(239, 68, 68, 0.3)",
    borderRadius: "12px",
    padding: "12px 24px",
    color: "#ffffff",
    fontSize: "0.9rem",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.2s ease",
    outline: "none",
    boxShadow: "0 4px 15px rgba(239, 68, 68, 0.2)",
  },
};

export default Browse;