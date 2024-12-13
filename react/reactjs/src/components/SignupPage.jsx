
import React, { useState } from "react";
import "./../styles/SignUp.css";
import { Link } from "react-router-dom";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form-box">
        <h2 className="form-title">Register Here</h2>
        <div className="form-row">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className="form-input"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        <div className="form-row">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        <div className="form-row">
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        <div className="form-row">
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        <div className="form-row">
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="form-input"
          >
            <option value="">Select Role</option>
            <option value="hr">HR</option>
            <option value="instructor">Instructor</option>
            <option value="manager">Manager</option>
            <option value="learner">Learner</option>
          </select>
        </div>
        <Link to="/">
        <button type="submit" className="form-button">
          Create Account
        </button>
        </Link>
        <p className="form-footer">
          Already have an account?{" "}
          <a href="/" className="form-link">
            Sign In
          </a>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;

