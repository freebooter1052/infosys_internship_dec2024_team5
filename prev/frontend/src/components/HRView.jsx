import React, { useState } from 'react';
import '../styles/HRView.css';

// Dummy data for demonstration
const dummyData = [
  { id: 1, name: 'John Doe', team: 'Team A', manager: 'Manager 1', course: 'React Basics', completion: 85, quizScore: 90, status: 'Active' },
  { id: 2, name: 'Jane Smith', team: 'Team B', manager: 'Manager 2', course: 'JavaScript Advanced', completion: 100, quizScore: 95, status: 'Completed' },
  { id: 3, name: 'Alice Johnson', team: 'Team A', manager: 'Manager 1', course: 'Python for Beginners', completion: 60, quizScore: 75, status: 'Active' },
  { id: 4, name: 'Bob Brown', team: 'Team B', manager: 'Manager 2', course: 'Data Structures', completion: 40, quizScore: 65, status: 'Active' },
];

const managerPerformanceData = [
  { manager: 'Manager 1', team: 'Team A', averageCompletion: 72.5, topPerformer: 'John Doe' },
  { manager: 'Manager 2', team: 'Team B', averageCompletion: 70, topPerformer: 'Jane Smith' },
];

const HRView = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedManager, setSelectedManager] = useState(null);

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
    setSelectedManager(null);
  };

  const handleManagerClick = (managerName) => {
    const managerData = managerPerformanceData.find((data) => data.manager === managerName);
    setSelectedManager(managerData);
    setSelectedEmployee(null);
  };

  const overallCompletionRate = (
    dummyData.reduce((total, employee) => total + employee.completion, 0) / dummyData.length
  ).toFixed(2);

  return (
    <div className="hr-view">
      <h2>HR View</h2>

      <div className="insights">
        <div className="insight-card">
          <h3>Overall Completion Rate</h3>
          <p>{overallCompletionRate}%</p>
        </div>
        <div className="insight-card">
          <h3>Top Performer</h3>
          <p>{dummyData.sort((a, b) => b.quizScore - a.quizScore)[0].name}</p>
        </div>
        <div className="insight-card">
          <h3>Needs Training</h3>
          <p>
            {
              dummyData.filter((employee) => employee.completion < 50).map((e) => e.name).join(', ') ||
              'None'
            }
          </p>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Team</th>
            <th>Manager</th>
            <th>Course</th>
            <th>Completion %</th>
            <th>Quiz Score</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {dummyData.map((item) => (
            <tr key={item.id}>
              <td onClick={() => handleEmployeeClick(item)}>{item.name}</td>
              <td>{item.team}</td>
              <td onClick={() => handleManagerClick(item.manager)} style={{ color: 'blue', cursor: 'pointer' }}>{item.manager}</td>
              <td>{item.course}</td>
              <td>{item.completion}%</td>
              <td>{item.quizScore}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedEmployee && (
        <div className="employee-details">
          <h3>Details for {selectedEmployee.name}</h3>
          <p>Team: {selectedEmployee.team}</p>
          <p>Manager: {selectedEmployee.manager}</p>
          <p>Course: {selectedEmployee.course}</p>
          <p>Completion: {selectedEmployee.completion}%</p>
          <p>Quiz Score: {selectedEmployee.quizScore}</p>
          <p>Status: {selectedEmployee.status}</p>
        </div>
      )}

      {selectedManager && (
        <div className="manager-details">
          <h3>Performance for {selectedManager.manager}</h3>
          <p>Team: {selectedManager.team}</p>
          <p>Average Completion Rate: {selectedManager.averageCompletion}%</p>
          <p>Top Performer: {selectedManager.topPerformer}</p>
        </div>
      )}
    </div>
  );
};

export default HRView;