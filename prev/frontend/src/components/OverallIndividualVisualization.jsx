// File: components/OverallIndividualVisualization.js

import React from 'react';
import { ProgressBar } from 'react-bootstrap';
import { PieChart, Pie, Cell } from 'recharts';

import '../styles/OverallIndividualVisualization.css'
const dummyData = {
  courses: [
    { id: 1, name: 'React Basics', status: 'Active', completionPercentage: 40, performanceScore: 70, milestones: 3, learningPoints: 120, quizScore: 85 },
    { id: 2, name: 'Advanced JavaScript', status: 'Completed', completionPercentage: 100, performanceScore: 90, milestones: 5, learningPoints: 200, quizScore: 95 },
    { id: 3, name: 'UI/UX Design', status: 'Active', completionPercentage: 20, performanceScore: 60, milestones: 1, learningPoints: 50, quizScore: 75 },
  ],
  completedCourses: 1,
  inProgressCourses: 2,
};


const OverallIndividualVisualization = () => {
  const userData = dummyData;

  return (
    <div className="overall-visualization">
      {/* Courses Taken Section */}
      <div className="courses-taken">
        <b>  <h2>Courses Taken</h2>  </b>
        <ul>
          {userData.courses.map((course) => (
            <li key={course.id}>
              {course.name} - <strong>{course.status}</strong>
            </li>
          ))}
        </ul>
      </div>

      {/* Completion Status Section */}
      <div className="completion-status">
        <b><h2>Completion Status</h2></b>
        {userData.courses.map((course) => (
          <div key={course.id} className="course-completion">
            <span>{course.name}</span>
            <ProgressBar now={ course.completionPercentage} label={`${course.completionPercentage}%`} />
          </div>
        ))}
      </div>

      {/* Completed vs. In Progress Section */}
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
      label
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
            <ProgressBar now={course.performanceScore} label={`${course.performanceScore}%`} />
            <p>Milestones Achieved: {course.milestones}</p>
            <p>Learning Points: {course.learningPoints}</p>
            <p>Quiz Performance: {course.quizScore}%</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OverallIndividualVisualization;
