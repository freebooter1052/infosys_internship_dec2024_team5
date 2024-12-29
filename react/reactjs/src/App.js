import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import ForgotPasswordPage from "./components/ForgotPasswordPage";
import ForgotPasswordPage2 from "./components/ForgotPasswordPage2";
import Home from "./components/Home";
import ResetPage from "./components/ResetPage";
import CoursePage from "./components/CoursePage";
import HomeNoCourse from "./components/HomeNoCourse";
import AdminEditSuite from "./components/AdminEditSuite";

function App() {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const role = sessionStorage.getItem("user_role");
    console.log("App.js - Role from session storage:", role); // Debug log
    if (role) {
      setUserRole(role.toLowerCase());
    }
  }, []);

  const ProtectedRoute = ({ children }) => {
    const role = sessionStorage.getItem("user_role");
    console.log("Protected Route - Current role:", role); // Debug log

    if (!role) {
      return <Navigate to="/" />;
    }

    if (role.toLowerCase() === "hr" || role.toLowerCase() === "instructor") {
      return children;
    }

    return <HomeNoCourse />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/forgot-password2" element={<ForgotPasswordPage2 />} />
        <Route 
          path="/home" 
          element={<ProtectedRoute><Home /></ProtectedRoute>} 
        />
        <Route path="/reset-page" element={<ResetPage />} />
        <Route path="/Course-page" element={<CoursePage />} />
        <Route path="/admin-edit" element={<AdminEditSuite />} />
      </Routes>
    </Router>
  );
}

export default App;
