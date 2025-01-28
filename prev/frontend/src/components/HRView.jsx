import React, { useState, useEffect } from 'react';
import '../styles/HRView.css';

const HRView = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [stats, setStats] = useState({
    overall_completion_rate: 0,
    top_performer: '',
    needs_training: [] // Initialize as empty array
  });
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedManager, setSelectedManager] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [statsResponse, employeesResponse] = await Promise.all([
          fetch('http://localhost:5000/api/hr-view/stats', {
            credentials: 'include'
          }),
          fetch('http://localhost:5000/api/hr-view/employees', {
            credentials: 'include'
          })
        ]);

        if (!statsResponse.ok || !employeesResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const [statsData, employeesData] = await Promise.all([
          statsResponse.json(),
          employeesResponse.json()
        ]);

        setStats({
          overall_completion_rate: statsData.overall_completion_rate || 0,
          top_performer: statsData.top_performer || '',
          needs_training: Array.isArray(statsData.needs_training) ? statsData.needs_training : []
        });
        setEmployeeData(Array.isArray(employeesData) ? employeesData : []);
      } catch (err) {
        setError('Failed to fetch data: ' + err.message);
        console.error('Error fetching data:', err);
        setEmployeeData([]);  // Ensure it's always an array
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
    setSelectedManager(null);
  };

  const handleManagerClick = (managerName) => {
    const managerTeam = employeeData.filter(emp => emp.manager === managerName);
    const avgCompletion = managerTeam.reduce((acc, emp) => acc + emp.completion, 0) / managerTeam.length;
    const topPerformer = managerTeam.reduce((prev, curr) => 
      (prev.quizScore > curr.quizScore) ? prev : curr
    );

    setSelectedManager({
      manager: managerName,
      team: managerTeam[0]?.team || 'N/A',
      averageCompletion: avgCompletion.toFixed(2),
      topPerformer: topPerformer.name
    });
    setSelectedEmployee(null);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="hr-view">
      <h2>HR View</h2>

      <div className="insights">
        <div className="insight-card">
          <h3>Overall Completion Rate</h3>
          <p>{stats?.overall_completion_rate || 0}%</p>
        </div>
        <div className="insight-card">
          <h3>Top Performer</h3>
          <p>{stats?.top_performer || 'N/A'}</p>
        </div>
        <div className="insight-card">
          <h3>Needs Training</h3>
          <p>{Array.isArray(stats?.needs_training) ? stats.needs_training.join(', ') : 'None'}</p>
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
          {employeeData.map((item) => (
            <tr key={item.id}>
              <td onClick={() => handleEmployeeClick(item)}>{item.name}</td>
              <td>{item.team}</td>
              <td onClick={() => handleManagerClick(item.manager)} 
                  style={{ color: 'blue', cursor: 'pointer' }}>
                {item.manager}
              </td>
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