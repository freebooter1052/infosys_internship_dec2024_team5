import React, { useState, useEffect } from "react";
import "../styles/Home.css";
import { Link } from "react-router-dom";

const HomeNoCourse = () => {
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    // Fetch the user role from the session or API
    const fetchUserRole = async () => {
      try {
        // Assuming the role is stored in session storage
        const role = sessionStorage.getItem("user_role");
        if (role) {
          setUserRole(role);
        } else {
          // Fetch from API if not found in session storage
          const response = await fetch("http://127.0.0.1:5000/api/get-user-role", {
            credentials: "include"
          });
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          setUserRole(data.role);
          sessionStorage.setItem("user_role", data.role);
        }
      } catch (error) {
        console.error("Failed to fetch user role:", error);
      }
    };
    fetchUserRole();
  }, []);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome to Upskill Vision</h1>
        <p>Empowering your journey of continuous learning and growth.</p>
      </header>

      <nav className="dashboard-nav">
        <ul>
          <li><a href="#courses">Courses</a></li>
          <li><a href="#progress">Your Progress</a></li>
          <li><a href="#community">Community</a></li>
          <li><a href="#settings">Settings</a></li>
        </ul>
      </nav>

      <main className="dashboard-main">
        <section id="courses">
          <h2>Courses</h2>
          <p>Explore the available courses</p>
          <Link to="/Course-page">
          <button onClick={() => alert("Explore Courses!")}>Explore Courses</button>
          </Link>
        </section>

        <section id="community">
          <h2>Community</h2>
          <p>Engage with other learners and share knowledge.</p>
          <button onClick={() => alert("Join Community!")}>Join Community</button>
        </section>

        <section id="settings">
          <h2>Settings</h2>
          <p>Customize your preferences and account details.</p>
          <button onClick={() => alert("Update Settings!")}>Update Settings</button>
        </section>
      </main>

      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} Upskill Vision. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomeNoCourse;
