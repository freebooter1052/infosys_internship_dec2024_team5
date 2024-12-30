
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../styles/AdminEditSuite.css";

const AdminEditSuite = () => {
  const [courses, setCourses] = useState([]);
  const [editCourse, setEditCourse] = useState(null);
  const [auditTrail, setAuditTrail] = useState([]);

  // Fetch courses and audit trail when the component mounts
  useEffect(() => {
    fetchCourses();
    fetchAuditTrail();
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

  const handleEditCourse = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    setEditCourse(course);
  };

  const handleUpdateCourse = async () => {
    if (editCourse) {
      try {
        await axios.put(`http://localhost:5000/api/courses/${editCourse.id}`, editCourse);
        alert('Course updated successfully');
        // Refetch courses and audit trail to reflect updates
        fetchCourses(); // Ensure courses are refetched
        fetchAuditTrail(); // Ensure audit trail is updated
        logAudit('Updated course: ' + editCourse.title); // Log the audit entry
        setEditCourse(null); // Reset after update
      } catch (error) {
        console.error('Error updating course:', error);
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
            Module Status:
            <select
              value={editCourse.module_status}
              onChange={(e) => setEditCourse({ ...editCourse, module_status: e.target.value })}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
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
