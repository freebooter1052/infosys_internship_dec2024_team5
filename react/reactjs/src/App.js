import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import ForgotPasswordPage from "./components/ForgotPasswordPage";
import ForgotPasswordPage2 from "./components/ForgotPasswordPage2";
import Home from "./components/Home";
import ResetPage from "./components/ResetPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/forgot-password2" element={<ForgotPasswordPage2 />} />
        <Route path="/home" element={<Home />} />
        <Route path="/reset-page" element={<ResetPage />} /> {/* Ensure this path matches */}
      </Routes>
    </Router>
  );
}

export default App;

