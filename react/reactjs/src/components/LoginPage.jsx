import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import "./../styles/LoginPage.css";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate(); // Initialize navigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://127.0.0.1:5000/api/login", formData)
      .then((response) => {
        //alert("Login successful!"); // Display success message
        navigate("/home"); // Navigate to the home page
      })
      .catch((error) => {
        if (error.response) {
          alert(error.response.data.error); // Error message
        } else {
          alert("Something went wrong. Please try again.");
        }
      });
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <div className="options">
          <Link to="/forgot-password" className="forgot-password">
            Forgot Password?
          </Link>
        </div>
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
      <p className="signup-prompt">
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
};

export default LoginPage;
