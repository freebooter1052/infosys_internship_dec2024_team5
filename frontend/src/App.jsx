import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// ...existing code...
import ForgotPasswordPage2 from "./components/ForgotPasswordPage2";
import ResetPage from "./components/ResetPage"; // Ensure this import is correct
import Home from "./components/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/forgot-password-2" element={<ForgotPasswordPage2 />} />
        <Route path="/reset-password" element={<ResetPage />} /> {/* Ensure this path matches */}
      </Routes>
    </Router>
  );
}

export default App;
