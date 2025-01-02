import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import ForgotPasswordPage from "./components/ForgotPasswordPage";
import ForgotPasswordPage2 from "./components/ForgotPasswordPage2";
import Home from "./components/Home";
import ResetPage from "./components/ResetPage";
import CoursePage from "./components/CoursePage";
import AdminEditSuite from "./components/AdminEditSuite";
import CoursePage2 from "./components/CoursePage2";
import Approve from "./components/Approve";
import Home2 from "./components/Home2_HR";
import Home3 from "./components/Home3_Instructor";
import Home4 from "./components/Home4_Manager";

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
    let role = sessionStorage.getItem("user_role");
    console.log("Protected Route - Current role:", role); // Debug log

    if (!role) {
      return <Navigate to="/" />;
    }

    role = role.toLowerCase();

    switch (role) {
      case "hr":
        return <Navigate to="/home2" />;
      case "instructor":
        return <Navigate to="/home3" />;
      case "manager":
        return <Navigate to="/home4" />;
      case "user":
        return <Home />;
      default:
        return <Navigate to="/" />;
    }
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
        <Route path="/home2" element={<Home2 />} />
        <Route path="/home3" element={<Home3/>} />
        <Route path="/home4" element={<Home4 />} />
        <Route path="/reset-page" element={<ResetPage />} />
        <Route path="/Course-page" element={<CoursePage />} />
        <Route path="/admin-edit" element={<AdminEditSuite />} />
        <Route path="/Course-page2" element={<CoursePage2/>}/>
        <Route path="/approve" element={<Approve />}/>
      </Routes>
    </Router>
  );
}

export default App;
