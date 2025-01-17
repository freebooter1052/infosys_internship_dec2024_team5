import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../styles/CoursePage2.css";

const CoursePage2 = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showPerformance, setShowPerformance] = useState(false); // Add state for performance view

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/courses');
        const coursesData = response.data;

        const coursesWithDetails = await Promise.all(
          coursesData.map(async (course) => {
            // Fetch students and their progress
            const studentsResponse = await axios.get(
              `http://localhost:5000/api/courses/${course.id}/students`
            );
            
            // Fetch modules data
            const modulesResponse = await axios.get(
              `http://localhost:5000/api/course/${course.id}/modules`
            );

            return {
              ...course,
              students: studentsResponse.data,
              modules: modulesResponse.data
            };
          })
        );

        setCourses(coursesWithDetails);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  const handleViewDetails = (course) => {
    setSelectedCourse(course);
    setShowParticipants(false); // Reset participants view state
    setShowPerformance(false); // Reset performance view state
  };

  const handleViewParticipants = () => {
    setShowParticipants(true);
    setShowPerformance(false); // Reset performance view state
  };

  const handleViewPerformance = () => {
    setShowPerformance(true);
    setShowParticipants(false); // Reset participants view state
  };

  const handleCloseModal = () => {
    setSelectedCourse(null);
    setShowParticipants(false);
    setShowPerformance(false);
  };

  return (
    <div className="courses-page">
      <h1 className="title">Courses Overview</h1>

      <div className="courses-list">
        {courses.map((course) => (
          <div key={course.id} className="course-card">
            <h2 className="course-title">{course.title}</h2>
            <p className="course-instructor">Instructor: {course.instructor}</p>
            <p className="course-creation-date">
              Start Date: {new Date(course.start_date).toLocaleDateString()}
            </p>
            <p className="course-ending-date">
              End Date: {new Date(course.end_date).toLocaleDateString()}
            </p>
            <p className="course-duration">
              Duration: {Math.ceil((new Date(course.end_date) - new Date(course.start_date)) / (1000 * 3600 * 24))} days
            </p>
            <button
              className="view-details-button"
              onClick={() => handleViewDetails(course)}
            >
              View Details
            </button>
          </div>
        ))}
      </div>
      {selectedCourse && (
        <div className="course-details-modal">
          {!showParticipants && !showPerformance ? (
            <>
              <h2>Course Details: {selectedCourse.title}</h2>
              {/* <p>Instructor: {selectedCourse.instructor}</p> */}
              <p>Creation Date: {new Date(selectedCourse.start_date).toLocaleDateString()}</p>
              <p>
                Duration:{" "}
                {Math.ceil((new Date(selectedCourse.end_date) - new Date(selectedCourse.start_date)) / (1000 * 3600 * 24))}{" "}
                days
              </p>
              <p>Total Participants Enrolled: {selectedCourse.students?.length || 0}</p>
              <p>
                Completed Participants:{" "}
                {selectedCourse.students?.filter((student) => student.completed).length || 0}
              </p>
              <button
                className="view-participants-button"
                onClick={handleViewParticipants}
              >
                View Participants
              </button>
              <button
                className="view-performance-button"
                onClick={handleViewPerformance}
              >
                View Performance
              </button>
              <button className="close-modal-button" onClick={handleCloseModal}>
                Close
              </button>
            </>
          ) : showParticipants ? (
            <>
              <h2>Participants for {selectedCourse.title}</h2>
              <b><h1>Enrolled Participants:</h1></b>
              <ul>
                {selectedCourse.students?.map((student, index) => (
                  <li key={index}>
                    <strong>Name:</strong> {student.name} <br />
                    <strong>Email:</strong> {student.email}
                  </li>
                ))}
              </ul>
              <b><h1>Completed Participants:</h1></b>
              <ul>
                {selectedCourse.students
                  ?.filter((student) => student.completed)
                  .map((student, index) => (
                    <li key={index}>
                      <strong>Name:</strong> {student.name} <br />
                      <strong>Email:</strong> {student.email}
                    </li>
                  ))}
              </ul>
              <button className="close-modal-button" onClick={handleCloseModal}>
                Close
              </button>
            </>
          ) : (
            <>
              <h2>Performance for {selectedCourse.title}</h2>
              {selectedCourse.students && selectedCourse.students.length > 0 ? (
                <ul className="performance-list">
                  {selectedCourse.students.map((student, index) => (
                    <li key={index} className="performance-item">
                      <div className="student-info">
                        <strong>Name:</strong> {student.name} <br />
                        <strong>Email:</strong> {student.email}
                      </div>
                      <div className="progress-info">
                        <strong>Course Progress:</strong>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill"
                            style={{ width: `${student.progress}%` }}
                          ></div>
                        </div>
                        <span>{student.progress}</span>
                      </div>
                      <div className="modules-info">
                        <strong>Completed Modules:</strong>
                        {selectedCourse.modules && selectedCourse.modules.length > 0 ? (
                          <ul>
                            {selectedCourse.modules.map((module, idx) => (
                              <li key={idx}>
                                {module.title}
                                {/* <span className="completion-status">
                                  ({student.completedModules?.some(m => m.title === module.title) 
                                    ? `Completed: ${new Date(student.completedModules.find(m => m.title === module.title).completedAt).toLocaleDateString()}`
                                    : 'Not Completed'})
                                </span> */}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>No modules available</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No students enrolled in this course</p>
              )}
              <button className="close-modal-button" onClick={handleCloseModal}>
                Close
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CoursePage2;
