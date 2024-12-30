import React, { useEffect, useState } from 'react';
import "../styles/CoursePage2.css";

const CoursePage2 = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showParticipants, setShowParticipants] = useState(false);

  useEffect(() => {
    // Mock data
    const mockCourses = [
      {
        id: 1,
        title: "AI Development",
        instructor: "Instructor A",
        creation_date: "2024-01-01",
        start_date: "2024-01-10",
        end_date: "2024-05-25",
        students: [
          { name: "John Doe", email: "john.doe@example.com", completed: true },
          { name: "Jane Smith", email: "jane.smith@example.com", completed: false }
        ]
      },
      {
        id: 2,
        title: "IT",
        instructor: "Instructor B",
        creation_date: "2024-04-01",
        start_date: "2024-04-10",
        end_date: "2024-04-24",
        students: [
          { name: "Alice Brown", email: "alice.brown@example.com", completed: true },
          { name: "Bob Johnson", email: "bob.johnson@example.com", completed: false }
        ]
      },
      {
        id: 3,
        title: "Cybersecurity",
        instructor: "Instructor C",
        creation_date: "2024-06-01",
        start_date: "2024-06-10",
        end_date: "2024-06-26",
        students: [
          { name: "Charlie Green", email: "charlie.green@example.com", completed: true },
          { name: "Diana White", email: "diana.white@example.com", completed: false }
        ]
      },
      {
        id: 4,
        title: "Web Development",
        instructor: "Instructor D",
        creation_date: "2024-07-01",
        start_date: "2024-07-10",
        end_date: "2024-07-26",
        students: [
          { name: "Eve Black", email: "eve.black@example.com", completed: true },
          { name: "Frank Adams", email: "frank.adams@example.com", completed: false }
        ]
      }
    ];
    setCourses(mockCourses);
  }, []);

  const handleViewDetails = (course) => {
    setSelectedCourse(course);
    setShowParticipants(false); // Reset participants view state
  };

  const handleViewParticipants = () => {
    setShowParticipants(true);
  };

  const handleCloseModal = () => {
    setSelectedCourse(null);
    setShowParticipants(false);
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
              Creation Date: {new Date(course.creation_date).toLocaleDateString()}
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
          {!showParticipants ? (
            <>
              <h2>Course Details: {selectedCourse.title}</h2>
              <p>Instructor: {selectedCourse.instructor}</p>
              <p>Creation Date: {new Date(selectedCourse.creation_date).toLocaleDateString()}</p>
              <p>
                Duration:{" "}
                {Math.ceil((new Date(selectedCourse.end_date) - new Date(selectedCourse.start_date)) / (1000 * 3600 * 24))}{" "}
                days
              </p>
              <p>Total Participants Enrolled: {selectedCourse.students.length}</p>
              <p>
                Completed Participants:{" "}
                {selectedCourse.students.filter((student) => student.completed).length}
              </p>
              <button
                className="view-participants-button"
                onClick={handleViewParticipants}
              >
                View Participants
              </button>
              <button className="close-modal-button" onClick={handleCloseModal}>
                Close
              </button>
            </>
          ) : (
            <>
              <h2>Participants for {selectedCourse.title}</h2>
              <b><h1>Enrolled Participants:</h1></b>
              <ul>
                {selectedCourse.students.map((student, index) => (
                  <li key={index}>
                    <strong>Name:</strong> {student.name} <br />
                    <strong>Email:</strong> {student.email}
                  </li>
                ))}
              </ul>
              <b><h1>Completed Participants:</h1></b>
              <ul>
                {selectedCourse.students
                  .filter((student) => student.completed)
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
          )}
        </div>
      )}
    </div>
  );
};

export default CoursePage2;
