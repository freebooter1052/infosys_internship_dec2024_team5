
import React from 'react';
import "../styles/CoursePage.css"

const courses = [
  { id: 1, title: 'React for Beginners', description: 'Learn the basics of React.' },
  { id: 2, title: 'Advanced JavaScript', description: 'Deep dive into JavaScript.' },
  { id: 3, title: 'Web Development Bootcamp', description: 'Become a full-stack web developer.' },
];

const CoursesPage = () => {
  return (
    <div className="courses-page">
      <h1 className="title">Available Courses</h1>
      <div className="courses-list">
        {courses.map((course) => (
          <div key={course.id} className="course-card">
            <h2 className="course-title">{course.title}</h2>
            <p className="course-description">{course.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;
