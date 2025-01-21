import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/CourseInsights.css";

const CourseInsights = () => {
  const { courseId } = useParams(); // Access courseId from the URL
  const [courseData, setCourseData] = useState(null);
  const [error, setError] = useState(null);
  const [modulesVisible, setModulesVisible] = useState(false);
  const [lastAccessedModule, setLastAccessedModule] = useState(null);
  const [completedModules, setCompletedModules] = useState([]);
  const [expandedModule, setExpandedModule] = useState(null); // To track which module is expanded
  const [courseDuration, setCourseDuration] = useState(null); // Add state for course duration
  const [modules, setModules] = useState([]); // Add state for modules
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResults, setQuizResults] = useState({});

  useEffect(() => {
    if (!courseId) {
      setError("Course ID is missing");
      return;
    }

    const fetchCourseData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/course/${courseId}/introduction`);
        if (!response.ok) {
          throw new Error("Failed to fetch course data");
        }
        const data = await response.json();
        setCourseData(data);
      } catch (error) {
        setError(error.message);
      }
    };

    const fetchCourseDuration = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/course/${courseId}/duration`);
        if (!response.ok) {
          throw new Error("Failed to fetch course duration");
        }
        const data = await response.json();
        setCourseDuration(data);
      } catch (error) {
        setError(error.message);
      }
    };

    const fetchModules = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/course/${courseId}/modules`);
        if (!response.ok) {
          throw new Error("Failed to fetch modules");
        }
        const data = await response.json();
        setModules(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchCourseData();
    fetchCourseDuration(); // Fetch course duration
    fetchModules(); // Fetch modules
  }, [courseId]);

  const markModuleAsCompleted = async (moduleIndex) => {
    try {
      const module = modules[moduleIndex];
      if (!module || !module.id) {
        throw new Error('Invalid module');
      }

      const response = await fetch(`http://localhost:5000/api/course/${courseId}/module/${module.id}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        mode: 'cors',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update module status');
      }

      const result = await response.json();
      console.log('Module completion result:', result);

      // Update local state
      const updatedModules = [...modules];
      updatedModules[moduleIndex] = {
        ...updatedModules[moduleIndex],
        completion_status: "Completed"
      };
      setModules(updatedModules);
      setCompletedModules([...completedModules, moduleIndex]);

    } catch (error) {
      console.error('Error completing module:', error);
      setError(error.message);
    }
  };

  const handleStartLearning = () => {
    if (lastAccessedModule) {
      scrollToModule(lastAccessedModule.moduleIndex);
      alert(`Continuing with ${lastAccessedModule.moduleTitle}`);
    } else {
      alert("Starting the first module!");
      scrollToModule(0); // Start from the first module
    }
  };

  const scrollToModule = (moduleIndex) => {
    const moduleElement = document.getElementById(`module-${moduleIndex}`);
    if (moduleElement) {
      moduleElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const toggleContent = (index) => {
    setExpandedModule(expandedModule === index ? null : index); // Toggle the expanded module
  };

  const fetchModuleQuiz = async (moduleId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/course/${courseId}/module/${moduleId}/quiz`
      );
      if (!response.ok) throw new Error('Failed to fetch quiz');
      const data = await response.json();
      setCurrentQuiz({ moduleId, questions: data });
      setQuizAnswers({});
    } catch (error) {
      setError(error.message);
    }
  };

  const handleAnswerSelection = (questionId, answer) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const submitQuiz = async (moduleId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/course/${courseId}/module/${moduleId}/quiz/submit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ answers: quizAnswers }),
        }
      );
      
      if (!response.ok) throw new Error('Failed to submit quiz');
      const result = await response.json();
      
      setQuizResults(prev => ({
        ...prev,
        [moduleId]: result
      }));
      setCurrentQuiz(null);
    } catch (error) {
      setError(error.message);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!courseData || !courseDuration) {
    return <div>Loading course data...</div>;
  }

  return (
    <div className="course-overview">
      <div className="course-header">
        <h1>{courseData.title}</h1>
        <p className="description">{courseData.description}</p>
        <p className="instructor">
          <strong>Instructor:</strong> {courseData.instructor}
        </p>
        <button className="start-learning-button" onClick={handleStartLearning}>
          Start Learning
        </button>
      </div>

      <div className="course-duration">
        <h3>Course Duration</h3>
        <p><strong>Start Date:</strong> {courseDuration.start_date}</p>
        <p><strong>End Date:</strong> {courseDuration.end_date}</p>
        <p><strong>Total Duration:</strong> {courseDuration.total_duration} days</p>
      </div>

      {true && ( // Assuming enrollment status is always true in this example
        <>
          <div className="module-list">
            <h3>Modules</h3>
            <button
              className="toggle-button"
              onClick={() => setModulesVisible(!modulesVisible)}
            >
              {modulesVisible ? "Hide Modules" : "Show Modules"}
            </button>
            {modulesVisible && modules.length > 0 && (
              <ul>
                {modules.map((module, index) => (
                  <li key={index} id={`module-${index}`} className="module-item">
                    <h4>{module.title}</h4>
                    <p><strong>Learning points:</strong>{module.learning_points}</p>
                    <p><strong>Status:</strong> {module.completion_status}</p>

                    <button onClick={() => toggleContent(index)}>
                      {expandedModule === index ? "Hide Content" : "Show Content"}
                    </button>

                    {expandedModule === index && (
                      <div className="module-content">
                        {(module.content || []).map((content, idx) => (
                          <div key={idx}>
                            <h5>{content.title}</h5>
                            {content.type === "video" ? (
                              <video controls>
                                <source src={content.url} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            ) : (
                              <a href={content.url} target="_blank" rel="noopener noreferrer">
                                Download Reading Material
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {module.completion_status !== "Completed" && (
                      <button
                        onClick={() => markModuleAsCompleted(index)}
                        style={{ color: module.completion_status === "Completed" ? "blue" : "initial" }}
                      >
                        Mark as Completed
                      </button>
                    )}

                    <div className="module-progress-bar">
                      <div
                        className={`progress-bar-filled ${(module.completion_status || "not started").toLowerCase()}`}
                        style={{
                          width:
                            module.completion_status === "Completed"
                              ? "100%"
                              : module.completion_status === "In Progress"
                              ? "50%"
                              : "0%",
                        }}
                      ></div>
                    </div>
                    <div className="quizzes-section">
                      <h5>Quizzes & Assessments</h5>
                      {currentQuiz && currentQuiz.moduleId === module.id ? (
                        <div className="quiz-container">
                          <h4>Module Quiz</h4>
                          {currentQuiz.questions.map((question, idx) => (
                            <div key={idx} className="quiz-question">
                              <p>{question.question}</p>
                              <div className="quiz-options">
                                {question.options.map((option, optIdx) => (
                                  <label key={optIdx}>
                                    <input
                                      type="radio"
                                      name={`question-${question.id}`}
                                      value={option}
                                      onChange={() => handleAnswerSelection(question.id, option)}
                                      checked={quizAnswers[question.id] === option}
                                    />
                                    {option}
                                  </label>
                                ))}
                              </div>
                            </div>
                          ))}
                          <button onClick={() => submitQuiz(module.id)}>
                            Submit Quiz
                          </button>
                        </div>
                      ) : quizResults[module.id] ? (
                        <div className="quiz-results">
                          <h4>Quiz Results</h4>
                          <p>Score: {quizResults[module.id].score}%</p>
                          <p>Status: {quizResults[module.id].status}</p>
                          <p>
                            Correct Answers: {quizResults[module.id].correct_answers} 
                            out of {quizResults[module.id].total_questions}
                          </p>
                        </div>
                      ) : module.quizzes && module.quizzes.length > 0 ? (
                        <div>
                          {module.quizzes.map((quiz, index) => (
                            <div key={index} className="quiz-item">
                              <h6>{quiz.title}</h6>
                              <p><strong>Status:</strong> {quiz.status}</p>
                              {quiz.status !== "Completed" && (
                                <button onClick={() => fetchModuleQuiz(module.id)}>
                                  Attempt Quiz
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p>No quizzes available for this module</p>
                      )}
                    </div>

                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="visualization-section">
            <h3>Progress Monitoring</h3>
            <div className="course-progress">
              <h4>Course Progress</h4>
              <div className="progress-bar">
                <div
                  className="progress-bar-filled"
                  style={{ 
                    width: `${modules.length > 0 
                      ? (modules.filter(m => m.completion_status === "Completed").length / modules.length) * 100 
                      : 0}%` 
                  }}
                ></div>
              </div>
              <p>{modules.length > 0 
                ? Math.round((modules.filter(m => m.completion_status === "Completed").length / modules.length) * 100) 
                : 0}% Completed</p>
            </div>

            <div className="module-progress">
              <h4>Module Progress</h4>
              <ul>
                {modules.map((module, index) => (
                  <li key={index} className="module-progress-item">
                    <div className="module-header">
                      <h5>{module.title}</h5>
                      <span className={module.completion_status.toLowerCase()}>
                        {module.completion_status}
                      </span>
                    </div>
                    
                    {module.quizzes && module.quizzes.length > 0 && (
                      <div className="quiz-progress">
                        <h6>Quiz Results:</h6>
                        <ul className="quiz-list">
                          {module.quizzes.map((quiz, quizIndex) => (
                            <li key={quizIndex} className="quiz-progress-item">
                              <span>{quiz.title}</span>
                              {quizResults[module.id] ? (
                                <div className="quiz-score">
                                  <span className={quizResults[module.id].status.toLowerCase()}>
                                    {quizResults[module.id].status}
                                  </span>
                                  <span>Score: {quizResults[module.id].score}%</span>
                                </div>
                              ) : (
                                <span className="not-attempted">Not attempted</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CourseInsights;
