// src/App.js
import React from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Browse from './pages/browse';
import Post from './pages/post';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Leaderboard from './pages/leaderboard';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import { PostProvider } from './context/PostContext';


function App() {
  return (
    <AuthProvider>
      <PostProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/post" element={<Post />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />


          </Routes>
        </Router>
      </PostProvider>
    </AuthProvider>
  );
}

export default App;