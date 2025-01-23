import React, { useState } from 'react';
import '../styles/ManagerView.css'

// Dummy data for demonstration
const dummyData = [
  { id: 1, name: 'John Doe', course: 'React Basics', completion: 85, quizScore: 90, status: 'Active', team: 'Team A' },
  { id: 2, name: 'Jane Smith', course: 'JavaScript Advanced', completion: 100, quizScore: 95, status: 'Completed', team: 'Team B' },
  { id: 3, name: 'Alice Johnson', course: 'Python for Beginners', completion: 60, quizScore: 75, status: 'Active', team: 'Team A' },
  { id: 4, name: 'Bob Brown', course: 'Data Structures', completion: 40, quizScore: 65, status: 'Active', team: 'Team B' },
];

const ManagerView = () => {
  const [filter, setFilter] = useState({ course: '', dateRange: '', employee: '' });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  const filteredData = dummyData.filter((data) => {
    return (
      (filter.course ? data.course.includes(filter.course) : true) &&
      (filter.employee ? data.name.includes(filter.employee) : true)
    );
  });

  const teamName = "Team A"; // Hardcoded for demonstration, replace with dynamic team name if needed

  return (
    <div className="manager-view">
      <h2>Manager View</h2>
      <h3>Team: {teamName}</h3>

      <div className="filters">
        <input
          type="text"
          name="course"
          placeholder="Filter by Course"
          value={filter.course}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="employee"
          placeholder="Filter by Employee"
          value={filter.employee}
          onChange={handleFilterChange}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Course</th>
            <th>Completion %</th>
            <th>Quiz Score</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.course}</td>
              <td>{item.completion}%</td>
              <td>{item.quizScore}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManagerView; 