import React, { useState, useEffect } from "react";
import "../styles/Home.css";
import { Link } from "react-router-dom"; 
import CourseCreationForm from "../components/CourseCreationForm.jsx";

const Home = () => {
  const [isCourseFormVisible, setIsCourseFormVisible] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const role = sessionStorage.getItem("user_role");
    console.log("Home component - Current role:", role); // Debug log
    if (role) {
      const lowerRole = role.toLowerCase();
      setUserRole(lowerRole);
      // Update role check to use learner
      if (lowerRole !== "hr" && lowerRole !== "instructor" && lowerRole !== "user") {
        window.location.href = "/home-no-course";
      }
    }
  }, []);

  const handleShowCourseForm = () => {
    setIsCourseFormVisible(true);
  };

  const handleCloseCourseForm = () => {
    setIsCourseFormVisible(false);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome to Upskill Vision</h1>
        <p>Empowering your journey of continuous learning and growth.</p>
      </header>

      <nav className="dashboard-nav">
        <h1>User Dashboard</h1>
      </nav>

      <main className="dashboard-main">
        <section id="courses">
          <h2>Courses</h2>
          <p>Explore the available courses</p>
          <Link to="/Course-page">
          <button onClick={() => alert("Explore Courses!")}>Course Overview</button>
          </Link>
        </section>

        <section id="community">
          <h2>Community</h2>
          <p>Engage with other learners and share knowledge.</p>
          <button onClick={() => alert("Join Community!")}>Join Community</button>
        </section>

      </main>

      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} Upskill Vision. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
