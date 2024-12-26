import React, { useState } from "react";
import "./../styles/CourseCreationForm.css";
import axios from "axios";

const CourseCreationForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    courseId: "",
    courseTitle: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/courses", {
        id: formData.courseId,
        title: formData.courseTitle,
        description: formData.description,
        start_date: formData.startDate,
        end_date: formData.endDate,
      });
      console.log("Course Data Submitted:", response.data);
      alert("Course created and notifications sent!");
      onClose();
    } catch (error) {
      console.error("There was an error creating the course!", error);
      alert("Failed to create course. Please try again.");
    }
  };

  return (
    <div className="course-form-overlay">
      <div className="course-form-container">
        <h2>Create New Course</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="courseId">Course ID</label>
            <input
              type="text"
              id="courseId"
              name="courseId"
              placeholder="Enter Course ID"
              value={formData.courseId}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="courseTitle">Course Title</label>
            <input
              type="text"
              id="courseTitle"
              name="courseTitle"
              placeholder="Enter Course Title"
              value={formData.courseTitle}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Enter Course Description"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="startDate">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="endDate">Projected End Date</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-buttons">
            <button type="submit">Submit</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseCreationForm;
