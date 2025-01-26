import React, { useState, useEffect } from 'react';
import '../styles/ManagerView.css';

const ManagerView = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState({ course: '', employee: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    try {
      const queryParams = new URLSearchParams({
        course: filter.course,
        employee: filter.employee
      });
      
      const response = await fetch(`http://localhost:5000/api/manager-view?${queryParams}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

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

      {loading ? (
        <p>Loading...</p>
      ) : (
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
            {data.map((item) => (
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
      )}
    </div>
  );
};

export default ManagerView;