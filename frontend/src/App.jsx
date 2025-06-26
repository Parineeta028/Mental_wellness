// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Register";
import Dashboard from "./pages/Dashboard"; // ✅ real dashboard
import Chat from "./pages/Chat";
import Resources from "./pages/Resources";
const App = () => {
  const { currentUser } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={!currentUser ? <Home /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/login"
          element={!currentUser ? <Login /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/signup"
          element={!currentUser ? <Signup /> : <Navigate to="/dashboard" />}
        />

        {/* Protected Route */}
        <Route
          path="/dashboard"
          element={currentUser ? <Dashboard /> : <Navigate to="/login" />}
        />

        <Route
          path="/chat"
          element={currentUser ? <Chat /> : <Navigate to="/login" />}

        />
        <Route
          path="/resources"
          element={currentUser ? <Resources /> : <Navigate to="/login" />}

        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
