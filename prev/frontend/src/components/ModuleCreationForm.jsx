import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ModuleCreationForm.css";

const ModuleCreationForm = ({ onClose }) => {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [moduleTitle, setModuleTitle] = useState("");
  const [learningPoints, setLearningPoints] = useState("");
  const [materials, setMaterials] = useState([
    { type: "", title: "", url: "", file: null, quiz: [], options: [], correctAnswer: "" }
  ]);
  const [courseIntroduction, setCourseIntroduction] = useState("");
  const [objectives, setObjectives] = useState("");
  const [learningOutcomes, setLearningOutcomes] = useState("");
  const [instructorDetails, setInstructorDetails] = useState("");
  const [error, setError] = useState("");
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Fetch courses when component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/courses');
        setCourses(response.data);
      } catch (error) {
        setError("Failed to fetch courses: " + error.message);
      }
    };
    fetchCourses();
  }, []);

  // Handle file upload
  const handleFileUpload = async (materialIndex, file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(
        `http://localhost:5000/api/module/material/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Update material with file path
      const updatedMaterials = [...materials];
      updatedMaterials[materialIndex].file = response.data.file_path;
      setMaterials(updatedMaterials);
    } catch (error) {
      setError("File upload failed: " + error.message);
    }
  };

  // Modified handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitError("");

    try {
      // Validate materials
      for (const material of materials) {
        if ((material.type === "video" && !material.url) || 
            (material.type === "reading" && !material.file)) {
          throw new Error("URL must be provided for Video material or File must be provided for Reading material.");
        }
        if (material.type === "quiz") {
          material.quiz.forEach((question) => {
            if (!question.question || question.options.some(opt => !opt) || !question.correctAnswer) {
              throw new Error("Each quiz question must have a question, 4 options, and a correct answer.");
            }
          });
        }
      }

      const moduleData = {
        courseId: selectedCourse,
        title: moduleTitle,
        learningPoints,
        materials,
        courseIntroduction,
        objectives,
        learningOutcomes,
        instructorDetails,
      };

      // Send data to backend
      const response = await axios.post(
        'http://localhost:5000/api/module/create',
        moduleData
      );

      console.log("Module created:", response.data);
      onClose();
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Modified material change handler
  const handleMaterialChange = async (index, field, value) => {
    const updatedMaterials = [...materials];
    updatedMaterials[index][field] = value;

    if (field === 'file' && value) {
      await handleFileUpload(index, value);
    } else {
      setMaterials(updatedMaterials);
    }
  };

  const addQuizQuestion = (materialIndex) => {
    const updatedMaterials = [...materials];
    updatedMaterials[materialIndex].quiz.push({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: ""
    });
    setMaterials(updatedMaterials);
  };

  const removeQuizQuestion = (materialIndex, questionIndex) => {
    const updatedMaterials = [...materials];
    updatedMaterials[materialIndex].quiz = updatedMaterials[materialIndex].quiz.filter((_, i) => i !== questionIndex);
    setMaterials(updatedMaterials);
  };

  const handleQuizFieldChange = (materialIndex, questionIndex, field, value) => {
    const updatedMaterials = [...materials];
    updatedMaterials[materialIndex].quiz[questionIndex][field] = value;
    setMaterials(updatedMaterials);
  };

  const addMaterial = () => {
    setMaterials([
      ...materials,
      { type: "", title: "", url: "", file: null, quiz: [], options: [], correctAnswer: "" }
    ]);
  };

  const removeMaterial = (index) => {
    const updatedMaterials = materials.filter((_, i) => i !== index);
    setMaterials(updatedMaterials);
  };

  return (
    <div className="module-creation-overlay">
      <div className="module-creation-form">
        <h2>Create New Module</h2>
        {isLoading && <div className="loading">Loading...</div>}
        {submitError && <div className="error-message">{submitError}</div>}
        <form onSubmit={handleSubmit}>
          {/* Course Selection - Updated to use fetched courses */}
          <div>
            <label htmlFor="course">Select Course:</label>
            <select
              id="course"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          {/* Module Title */}
          <div>
            <label htmlFor="module-title">Module Title:</label>
            <input
              type="text"
              id="module-title"
              value={moduleTitle}
              onChange={(e) => setModuleTitle(e.target.value)}
              required
            />
          </div>

          {/* Learning Points */}
          <div>
            <label htmlFor="learning-points">Learning Points (Numeric):</label>
            <input
              type="number"
              id="learning-points"
              value={learningPoints}
              onChange={(e) => setLearningPoints(e.target.value)}
              required
            />
          </div>

          {/* Course Introduction */}
          <div>
            <label htmlFor="course-introduction">Course Introduction:</label>
            <textarea
              id="course-introduction"
              value={courseIntroduction}
              onChange={(e) => setCourseIntroduction(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Course Objectives */}
          <div>
            <label htmlFor="objectives">Course Objectives:</label>
            <textarea
              id="objectives"
              value={objectives}
              onChange={(e) => setObjectives(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Learning Outcomes */}
          <div>
            <label htmlFor="learning-outcomes">Learning Outcomes:</label>
            <textarea
              id="learning-outcomes"
              value={learningOutcomes}
              onChange={(e) => setLearningOutcomes(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Instructor Details */}
          <div>
            <label htmlFor="instructor-details">Instructor Details:</label>
            <textarea
              id="instructor-details"
              value={instructorDetails}
              onChange={(e) => setInstructorDetails(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Materials Section */}
          <div className="materials-section">
            <h3>Materials</h3>
            {materials.map((material, materialIndex) => (
              <div key={materialIndex} className="material">
                <div>
                  <label htmlFor={`material-type-${materialIndex}`}>Material Type:</label>
                  <select
                    id={`material-type-${materialIndex}`}
                    value={material.type}
                    onChange={(e) =>
                      handleMaterialChange(materialIndex, "type", e.target.value)
                    }
                  >
                    <option value="">Select type</option>
                    <option value="video">Video</option>
                    <option value="reading">Reading</option>
                    <option value="quiz">Quiz</option>
                  </select>
                </div>

                {/* Handle Video/Reading material fields */}
                {material.type === "video" && (
                  <div>
                    <label>Video Title:</label>
                    <input
                      type="text"
                      value={material.title}
                      onChange={(e) =>
                        handleMaterialChange(materialIndex, "title", e.target.value)
                      }
                      placeholder="Enter Video Title"
                    />
                    <label>Video URL:</label>
                    <input
                      type="url"
                      value={material.url}
                      onChange={(e) =>
                        handleMaterialChange(materialIndex, "url", e.target.value)
                      }
                      placeholder="Enter Video URL"
                    />
                  </div>
                )}

                {material.type === "reading" && (
                  <div>
                    <label>Reading Title:</label>
                    <input
                      type="text"
                      value={material.title}
                      onChange={(e) =>
                        handleMaterialChange(materialIndex, "title", e.target.value)
                      }
                      placeholder="Enter Reading Title"
                    />
                    <label>Upload File:</label>
                    <input
                      type="file"
                      onChange={(e) =>
                        handleMaterialChange(materialIndex, "file", e.target.files[0])
                      }
                    />
                  </div>
                )}

                {/* Display quiz-related fields */}
                {material.type === "quiz" && (
                  <div>
                    <h4>Quiz Questions</h4>
                    {material.quiz.map((question, questionIndex) => (
                      <div key={questionIndex}>
                        <div>
                          <label htmlFor={`question-${questionIndex}`}>
                            Question {questionIndex + 1}:
                          </label>
                          <input
                            type="text"
                            value={question.question}
                            onChange={(e) =>
                              handleQuizFieldChange(materialIndex, questionIndex, "question", e.target.value)
                            }
                          />
                        </div>

                        <div>
                          <label>Options:</label>
                          {question.options.map((option, optIndex) => (
                            <div key={optIndex}>
                              <input
                                type="text"
                                value={option}
                                onChange={(e) =>
                                  handleQuizFieldChange(
                                    materialIndex,
                                    questionIndex,
                                    "options",
                                    question.options.map((opt, i) =>
                                      i === optIndex ? e.target.value : opt
                                    )
                                  )
                                }
                                placeholder={`Option ${optIndex + 1}`}
                              />
                            </div>
                          ))}
                        </div>

                        <div>
                          <label>Correct Answer:</label>
                          <input
                            type="text"
                            value={question.correctAnswer}
                            onChange={(e) =>
                              handleQuizFieldChange(materialIndex, questionIndex, "correctAnswer", e.target.value)
                            }
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => removeQuizQuestion(materialIndex, questionIndex)}
                          className="remove-question"
                        >
                          Remove Question
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addQuizQuestion(materialIndex)}
                      className="add-question"
                    >
                      Add Another Question
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => removeMaterial(materialIndex)}
                  className="remove-material"
                >
                  Remove Material
                </button>
              </div>
            ))}
            <button type="button" onClick={addMaterial}>
              Add Another Material
            </button>
          </div>

          {/* Display Error Message */}
          {error && <div className="error-message">{error}</div>}

          {/* Updated Submit Button with loading state */}
          <div>
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Module"}
            </button>
          </div>
        </form>

        <button onClick={onClose} className="close-btn" disabled={isLoading}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ModuleCreationForm;
