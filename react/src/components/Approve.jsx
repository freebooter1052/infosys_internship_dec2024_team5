import React, { useState, useEffect } from "react";
import "../styles/Approve.css";

const API_BASE_URL = 'http://localhost:5000/api';  // Add API base URL

const updateApprovalStatus = async (email, status) => {
  try {
    const response = await fetch(`${API_BASE_URL}/updateApprovalStatus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, status }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error updating status:', errorText);
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log(`Status updated: ${data.message}`);
  } catch (error) {
    console.error('Error updating status:', error);
  }
};

const Approve = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/users`);
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error fetching users:', errorText);
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleApprove = async (email) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.email === email ? { ...user, status: "approved" } : user
      )
    );
    await updateApprovalStatus(email, "approved");
  };

  const handleReject = async (email) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.email === email ? { ...user, status: "rejected" } : user
      )
    );
    await updateApprovalStatus(email, "rejected");
  };

  return (
    <div className="pending-approvals-container">
      <div className="card">
        <h2 className="title">Pending Approvals</h2>
        {users
          .filter((user) => user.status === "pending")
          .map((user, index) => (
            <div key={index} className="user-row">
              <span className="user-email">{user.email}</span>
              <div className="buttons">
                <button
                  className="approve-button"
                  onClick={() => handleApprove(user.email)}
                >
                  Approve
                </button>
                <button
                  className="reject-button"
                  onClick={() => handleReject(user.email)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Approve;