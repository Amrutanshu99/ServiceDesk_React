// src/App.tsx
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "../src/components/Navbar";
import AppRoutes from "../src/routes/routes";

function App() {
  return (
    <Router>

      <main className="container mt-4">
        <AppRoutes />
      </main>
    </Router>
  );
}

export default App;
