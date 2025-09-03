// src/routes.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import ChatBot from "../pages/chatbot/chatContainer";
import NotFound from "../pages/error/NotFound";

// Auth (example: replace with real corporate auth check)
const isAuthenticated = true;

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ChatBot />} />

      {/* Protected Route */}
      <Route
        path="/dashboard"
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}
      />

      <Route path="/chat/new" element={<ChatBot />} />

      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
