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
import CourseInsights from "./components/CourseInsights";
import OverallIndividualVisualization from "./components/OverallIndividualVisualization";
import ManagerView from "./components/ManagerView";
import HRView from "./components/HRView";

function App() {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const role = sessionStorage.getItem("user_role");
    console.log("App.js - Role from session storage:", role); // Debug log
    if (role) {
      setUserRole(role.toLowerCase());
    }
  }, []);

  // Protected route based on user role
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
        <Route path="/IndVis" element={<OverallIndividualVisualization />} />
        
        
        {/* Home page based on user role */}
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        
        {/* Course and content pages */}
        <Route path="/courseInsights/:courseId" element={<CourseInsights />} />
        <Route path="/course-page" element={<CoursePage />} />
        <Route path="/course-page2" element={<CoursePage2 />} />
        
        
        {/* Additional admin or other role-based pages */}
        <Route path="/home2" element={<Home2 />} />
        <Route path="/home3" element={<Home3 />} />
        <Route path="/home4" element={<Home4 />} />
        
        {/* Reset and approval pages */}
        <Route path="/reset-page" element={<ResetPage />} />
        <Route path="/admin-edit" element={<AdminEditSuite />} />
        <Route path="/approve" element={<Approve />} />

        <Route path="/HRView" element={<HRView/>} />
        <Route path="/MView" element={<ManagerView/>} />
      </Routes>
    </Router>
  );
}

export default App;
