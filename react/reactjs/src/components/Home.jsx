import React, { useState } from "react";
import "../styles/Home.css";
import { Link} from "react-router-dom"; 
import CourseCreationForm from "../components/CourseCreationForm.jsx"


const Home = () => {
  const [isCourseFormVisible, setIsCourseFormVisible] = useState(false);

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

export default Home;
