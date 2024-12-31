import React, { useState, useEffect } from "react";
import "../styles/Approve.css";

// Sample backend request function to update user approval status
const updateApprovalStatus = (email, status) => {
  // Simulate a backend request
  // Ideally, you'd send this to your backend API using fetch/axios
  console.log(`Updating status of ${email} to ${status}`);
};

const Approve = () => {
  const [users, setUsers] = useState([
    { email: "user1@example.com", status: "pending" },
    { email: "user2@example.com", status: "pending" },
    { email: "user3@example.com", status: "pending" },
  ]);

  useEffect(() => {
    // Fetch users from backend when the component loads
    // You can replace this with an actual API call
    // fetch('/api/users') 
    //   .then(response => response.json())
    //   .then(data => setUsers(data));
  }, []);

  const handleApprove = (email) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.email === email ? { ...user, status: "approved" } : user
      )
    );
    updateApprovalStatus(email, "approved");
  };

  const handleReject = (email) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.email === email ? { ...user, status: "rejected" } : user
      )
    );
    updateApprovalStatus(email, "rejected");
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