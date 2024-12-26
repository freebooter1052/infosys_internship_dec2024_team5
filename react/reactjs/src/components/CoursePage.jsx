import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../styles/CoursePage.css";

const CoursePage = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/courses');
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="courses-page">
      <h1 className="title">Available Courses</h1>
      <div className="courses-list">
        {courses.map((course) => (
          <div key={course.id} className="course-card">
            <h2 className="course-title">{course.title}</h2>
            <p className="course-description">{course.description}</p>
            <p className="course-dates">
              Start Date: {new Date(course.start_date).toLocaleDateString()}<br />
              End Date: {new Date(course.end_date).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursePage;
