import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';

const ResetPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState(''); // Add email state
  const navigate = useNavigate(); // Initialize navigate

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value); // Add email change handler
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (newPassword === confirmPassword) {
      try {
        const response = await axios.post('http://localhost:5000/api/reset-password', {
          email: email,
          new_password: newPassword
        });
        console.log(response.data.message);
        navigate('/'); // Redirect to login page
      } catch (error) {
        if (error.response && error.response.data) {
          console.error('Error resetting password:', error.response.data.error);
        } else {
          console.error('Error resetting password:', error.message);
        }
      }
    } else {
      alert('Passwords do not match.');
    }
  };

  return (
<div className="reset-password-container flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% px-4">
  <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
    <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={handleEmailChange}
          required
          className="w-full p-2 border rounded-md mt-1"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password:</label>
        <input
          type="password"
          id="newPassword"
          value={newPassword}
          onChange={handleNewPasswordChange}
          required
          className="w-full p-2 border rounded-md mt-1"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password:</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          required
          className="w-full p-2 border rounded-md mt-1"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
      >
        Reset Password
      </button>
    </form>
  </div>
</div>

  );
};

export default ResetPage;