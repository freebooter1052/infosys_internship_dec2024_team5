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
      // Redirect if not HR, instructor, user, or manager
      if (lowerRole !== "hr" && lowerRole !== "instructor" && lowerRole !== "user" && lowerRole !== "manager") {
        window.location.href = "/";
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
        <h1> Manager Dashboard</h1>
       </nav>

      <main className="dashboard-main">
        <section id="courses">
          <h2>Courses</h2>
          <p>Explore the available courses</p>
          <Link to="/Course-page2">
          <button onClick={() => alert("Explore Courses!")}>Course Overview</button>
          </Link>
        </section>

        {userRole === "hr" && (
          <section id="progress">
            <h2>New Course Creation</h2>
            <p>Add new courses here:</p>

            {/* Button to open the CourseCreationForm */}
            <button onClick={handleShowCourseForm}>Create New Course</button>

            {/* Conditionally render the CourseCreationForm */}
            {isCourseFormVisible && (
              <CourseCreationForm onClose={handleCloseCourseForm} />
            )}
          </section>
        )}

       
        
      </main>

      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} Upskill Vision. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
