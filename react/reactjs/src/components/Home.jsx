import React from 'react';
import "../styles/Home.css";

const Home = () => {
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
          <h2>Your Courses</h2>
          <p>Explore the courses you're enrolled</p>
          <button onClick={() => alert('Explore Courses!')}>Explore Courses</button>
        </section>

        <section id="progress">
          <h2>Your Progress</h2>
          <p>Track your learning progress and milestones.</p>
          <button onClick={() => alert('View Progress!')}>View Progress</button>
        </section>

        <section id="community">
          <h2>Community</h2>
          <p>Engage with other learners and share knowledge.</p>
          <button onClick={() => alert('Join Community!')}>Join Community</button>
        </section>

        <section id="settings">
          <h2>Settings</h2>
          <p>Customize your preferences and account details.</p>
          <button onClick={() => alert('Update Settings!')}>Update Settings</button>
        </section>
      </main>

      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} Upskill Vision. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
