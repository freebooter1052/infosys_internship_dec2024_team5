// File: components/OverallIndividualVisualization.js

import React, { useState, useEffect } from 'react';
import { ProgressBar, Alert, Spinner } from 'react-bootstrap';
import { PieChart, Pie, Cell } from 'recharts';
import '../styles/OverallIndividualVisualization.css';

const OverallIndividualVisualization = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProgress = async () => {
      try {
        console.log('Fetching user progress data...');
        const response = await fetch('http://localhost:5000/api/user/overall-progress', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'User-Email': localStorage.getItem('userEmail') // Make sure this is set during login
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Received data:', data);
        setUserData(data);
      } catch (err) {
        console.error('Error fetching user progress:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProgress();
  }, []);

  if (loading) {
    return (
      <div className="loading-spinner">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        Error loading data: {error}
      </Alert>
    );
  }

  if (!userData) {
    return (
      <Alert variant="info">
        No data available
      </Alert>
    );
  }

  console.log('Rendering with userData:', userData);

  return (
    <div className="overall-visualization">
      {/* Courses Taken Section */}
      <div className="courses-taken">
        <b><h2>Courses Taken</h2></b>
        {userData.courses.length > 0 ? (
          <ul>
            {userData.courses.map((course) => (
              <li key={course.id}>
                {course.name} - <strong>{course.status}</strong>
              </li>
            ))}
          </ul>
        ) : (
          <p>No courses taken yet</p>
        )}
      </div>

      {/* Completion Status Section */}
      <div className="completion-status">
        <b><h2>Completion Status</h2></b>
        {userData.courses.map((course) => (
          <div key={course.id} className="course-completion">
            <span>{course.name}</span>
            <ProgressBar 
              now={course.completionPercentage} 
              label={`${course.completionPercentage}%`}
              variant={course.completionPercentage === 100 ? "success" : "primary"}
            />
          </div>
        ))}
      </div>

      {/* Completed vs. In Progress Section */}
      <div className="completed-vs-in-progress">
        <b><h2>Completed vs. In Progress</h2></b>
        <PieChart width={400} height={400}>
          <Pie
            data={[
              { name: 'Completed', value: userData.completedCourses },
              { name: 'In Progress', value: userData.inProgressCourses },
            ]}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
            label={({ name, value }) => `${name}: ${value}`}
          >
            <Cell key="completed" fill="#82ca9d" />
            <Cell key="inProgress" fill="#ff8c00" />
          </Pie>
        </PieChart>
      </div>

      {/* Performance Overview Section */}
      <div className="performance-overview">
        <b><h2>Performance Overview</h2></b>
        {userData.courses.map((course) => (
          <div key={course.id} className="course-performance">
            <h3>{course.name}</h3>
            <ProgressBar 
              now={course.performanceScore} 
              label={`${course.performanceScore}%`}
              variant={course.performanceScore >= 70 ? "success" : "warning"}
            />
            <p>Milestones Achieved: {course.milestones}</p>
            <p>Learning Points: {course.learningPoints}</p>
            {/* <p>Quiz Performance: {course.quizScore}%</p> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OverallIndividualVisualization;
