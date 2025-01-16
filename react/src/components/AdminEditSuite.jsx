import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../styles/AdminEditSuite.css";

// Configure axios to include credentials
axios.defaults.withCredentials = true;

const AdminEditSuite = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('');
  const [courses, setCourses] = useState([]);
  const [editCourse, setEditCourse] = useState(null);
  const [auditTrail, setAuditTrail] = useState([]);
  const [instructors, setInstructors] = useState([]); // Add state for instructors

  // Add session check
  useEffect(() => {
    const role = sessionStorage.getItem('user_role');
    if (!role || (role.toLowerCase() !== 'hr' && role.toLowerCase() !== 'instructor')) {
      navigate('/');
      return;
    }
    setUserRole(role.toLowerCase());
  }, [navigate]);

  // Fetch courses, audit trail, and instructors when the component mounts
  useEffect(() => {
    fetchCourses();
    fetchAuditTrail();
    fetchInstructors(); // Fetch instructors
  }, []); // Empty dependency array to run this effect once on mount

  // Fetch courses from the API
  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  // Fetch the audit trail from the API
  const fetchAuditTrail = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/audit-trail');
      setAuditTrail(response.data);
    } catch (error) {
      console.error('Error fetching audit trail:', error);
    }
  };

  // Fetch instructors from the API
  const fetchInstructors = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/instructors');
      setInstructors(response.data);
    } catch (error) {
      console.error('Error fetching instructors:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleEditCourse = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    setEditCourse({
      ...course,
      start_date: formatDate(course.start_date),
      end_date: formatDate(course.end_date)
    });
  };

  const handleUpdateCourse = async () => {
    if (editCourse) {
      try {
        const response = await axios.put(
          `http://localhost:5000/api/courses/${editCourse.id}`, 
          editCourse,
          {
            headers: {
              'Content-Type': 'application/json',
              'User-Role': userRole
            },
            withCredentials: true
          }
        );
        console.log("Update response:", response.data);
        alert('Course updated successfully');
        fetchCourses();
        fetchAuditTrail();
        logAudit('Updated course: ' + editCourse.title);
        setEditCourse(null);
      } catch (error) {
        console.error('Error updating course:', error.response?.data || error.message);
        alert(error.response?.data?.error || 'Failed to update course');
      }
    }
  };

  const logAudit = async (action) => {
    try {
      await axios.post('http://localhost:5000/api/audit-trail', {
        action,
        timestamp: new Date(),
      });
      fetchAuditTrail(); // Refetch the audit trail to include the new entry
    } catch (error) {
      console.error('Error logging audit:', error);
    }
  };

  return (
    <div className="admin-edit-page">
      <h1 className="title">Admin Edit Suite</h1>

      <div className="courses-list">
        {courses.map((course) => (
          <div key={course.id} className="course-card">
            <h2 className="course-title">{course.title}</h2>
            <button onClick={() => handleEditCourse(course.id)} className="edit-button">Edit</button>
          </div>
        ))}
      </div>

      {editCourse && (
        <div className="edit-form">
          <h2>Edit Course: {editCourse.title}</h2>
          <label>
            Title:
            <input
              type="text"
              value={editCourse.title}
              onChange={(e) => setEditCourse({ ...editCourse, title: e.target.value })}
            />
          </label>

          <label>
            Description:
            <textarea
              value={editCourse.description}
              onChange={(e) => setEditCourse({ ...editCourse, description: e.target.value })}
            />
          </label>

          <label>
            Start Date:
            <input
              type="date"
              value={editCourse.start_date}
              onChange={(e) => setEditCourse({ ...editCourse, start_date: e.target.value })}
            />
          </label>

          <label>
            End Date:
            <input
              type="date"
              value={editCourse.end_date}
              onChange={(e) => setEditCourse({ ...editCourse, end_date: e.target.value })}
            />
          </label>

          <label>
            Instructor:
            <select
              value={editCourse.instructor}
              onChange={(e) => setEditCourse({ ...editCourse, instructor: e.target.value })}
            >
              <option value="">Select Instructor</option>
              {instructors.map((instructor) => (
                <option key={instructor.id} value={`${instructor.first_name} ${instructor.last_name}`}>
                  {instructor.first_name} {instructor.last_name}
                </option>
              ))}
            </select>
          </label>

          <button onClick={handleUpdateCourse} className="update-button">Update Course</button>
        </div>
      )}

      <div className="audit-trail">
        {auditTrail.map((entry, index) => (
          <div key={index} className="audit-entry">
            <p>{entry.timestamp} - {entry.action}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminEditSuite;
