// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Browse from './pages/browse';
import Post from './pages/post';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Leaderboard from './pages/leaderboard';
import Navbar from './components/Navbar';
import { useAuth } from './context/AuthContext';

function App() {
    const [posts, setPosts] = useState([]);
    const { user } = useAuth();

    const handleNewPost = (post) => setPosts((prev) => [...prev, post]);

    const handleReactUpdate = (postId, updatedReactions) => {
        setPosts((prev) =>
            prev.map((p) => (p.id === postId ? { ...p, reactions: updatedReactions } : p))
        );
    };

    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/browse" element={<Browse posts={posts} onReact={handleReactUpdate} />} />
                <Route
                    path="/post"
                    element={user ? <Post onNewPost={handleNewPost} /> : <Login />}
                />
                <Route path="/leaderboard" element={<Leaderboard posts={posts} />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </Router>
    );
}

export default App;
