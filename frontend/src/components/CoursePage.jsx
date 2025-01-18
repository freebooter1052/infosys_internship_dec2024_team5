import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../styles/CoursePage.css";
import { useNavigate } from 'react-router-dom';  // Keep useNavigate import here

const CoursePage = () => {
  const [courses, setCourses] = useState([]);
  const [userStatus, setUserStatus] = useState({
    enrolledCourses: [],
    completedCourses: [],
  });
  const [message, setMessage] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [filter, setFilter] = useState("All Courses");
  const [loading, setLoading] = useState(true); // Added loading state

  const navigate = useNavigate(); // Initialize useNavigate here

  // Function to navigate to Course Insights
  const goToCourseInsights = (courseId) => {
    navigate(`/courseInsights/${courseId}`);
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/courses');
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    const fetchUserStatus = async (user_email) => {
      try {
        const userResponse = await axios.get(`http://localhost:5000/api/user-status?email=${user_email}`);
        setUserStatus(userResponse.data);
      } catch (error) {
        console.error('Error fetching user status:', error);
      }
    };

    const user_email = sessionStorage.getItem('user_email');
    fetchCourses();
    fetchUserStatus(user_email);

    // Set loading to false once the data is fetched
    setLoading(false);
  }, []);

  const handleEnroll = async (courseId, courseTitle) => {
    try {
      const user_email = sessionStorage.getItem('user_email');
      const user_name = sessionStorage.getItem('user_name');

      const response = await axios.post('http://localhost:5000/api/enroll', { courseId, user_email, user_name });
      if (response.status === 200) {
        setUserStatus((prevStatus) => ({
          ...prevStatus,
          enrolledCourses: [...prevStatus.enrolledCourses, courseId],
        }));
        setMessage(`You are enrolled in "${courseTitle}". Start learning today!`);
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
      setMessage('Failed to enroll in the course. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleViewDetails = (course) => {
    setSelectedCourse(course);
  };

  const getEnrollmentStatus = (courseId) => {
    if (userStatus.completedCourses.includes(courseId)) {
      return 'Completed';
    } else if (userStatus.enrolledCourses.includes(courseId)) {
      return 'Enrolled';
    } else {
      return 'Not Enrolled';
    }
  };

  const getDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationInMs = end - start;
    const durationInDays = durationInMs / (1000 * 3600 * 24);
    return `${durationInDays} days`;
  };

  const filteredCourses = courses.filter((course) => {
    if (filter === "All Courses") return true;
    if (filter === "Enrolled Courses") return userStatus.enrolledCourses.includes(course.id);
    if (filter === "Completed Courses") return userStatus.completedCourses.includes(course.id);
    return false;
  });

  // Render loading state
  if (loading) {
    return <div>Loading data...</div>;
  }

  return (
    <div className="courses-page">
      <h1 className="title">Courses Overview</h1>
      {message && <div className="enrollment-message">{message}</div>}

      {/* Filter Buttons */}
      <div className="filter-buttons">
        <button
          className={`filter-button ${filter === "All Courses" ? "active" : ""}`}
          onClick={() => setFilter("All Courses")}
        >
          All Courses
        </button>
        <button
          className={`filter-button ${filter === "Enrolled Courses" ? "active" : ""}`}
          onClick={() => setFilter("Enrolled Courses")}
        >
          Enrolled Courses
        </button>
        <button
          className={`filter-button ${filter === "Completed Courses" ? "active" : ""}`}
          onClick={() => setFilter("Completed Courses")}
        >
          Completed Courses
        </button>
      </div>

      {/* Course List */}
      <div className="courses-list">
        {filteredCourses.map((course) => (
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
              Duration: {getDuration(course.start_date, course.end_date)}
            </p>
            <p className="course-enrollment-status">
              Enrollment Status: {getEnrollmentStatus(course.id)}
            </p>
            {getEnrollmentStatus(course.id) === 'Not Enrolled' && (
              <button
                className="enroll-button"
                onClick={() => handleEnroll(course.id, course.title)}
              >
                Enroll
              </button>
            )}
            {getEnrollmentStatus(course.id) === 'Enrolled' && (
              <button
                className="explore-button"
                onClick={() => goToCourseInsights(course.id)}  // Using dynamic course.id
              >
                Explore
              </button>
            )}
            {/* View Details Button for All Courses */}
            <button
              className="view-details-button"
              onClick={() => handleViewDetails(course)}
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* Course Details Modal */}
      {selectedCourse && (
        <div className="course-details-modal">
          <h2>{selectedCourse.title}</h2>
          <p>Instructor: {selectedCourse.instructor}</p>
          <p>
            Creation Date: {new Date(selectedCourse.creation_date).toLocaleDateString()}
          </p>
          <p>
            Duration: {getDuration(selectedCourse.start_date, selectedCourse.end_date)}
          </p>
          <p>Description: {selectedCourse.description}</p>
          <button className="close-button" onClick={() => setSelectedCourse(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default CoursePage;
