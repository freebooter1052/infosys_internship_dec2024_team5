import React, { useState } from "react";
// import "./../styles/SignUp.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const navigate = useNavigate(); // Initialize navigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://127.0.0.1:5001/api/signup", formData)
      .then((response) => {
        alert(response.data.message); // Success message
        navigate("/"); // Navigate to the login page
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
    <div className="form-container flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% px-4">
  <form
    onSubmit={handleSubmit}
    className="form-box bg-slate-50 backdrop-blur p-6 rounded-lg shadow-md w-full max-w-md"
  >
    <h2 className="form-title text-2xl font-bold text-center mb-6">Register Here</h2>
    <div className="form-row flex flex-col sm:flex-row gap-4 mb-4">
      <input
        type="text"
        name="firstName"
        placeholder="First Name"
        value={formData.firstName}
        onChange={handleChange}
        className="form-input flex-1 p-2 border rounded-md"
      />
      <input
        type="text"
        name="lastName"
        placeholder="Last Name"
        value={formData.lastName}
        onChange={handleChange}
        className="form-input flex-1 p-2 border rounded-md"
      />
    </div>
    <div className="form-row mb-4">
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="form-input w-full p-2 border rounded-md"
      />
    </div>
    <div className="form-row mb-4">
      <input
        type="password"
        name="password"
        placeholder="Enter Password"
        value={formData.password}
        onChange={handleChange}
        className="form-input w-full p-2 border rounded-md"
      />
    </div>
    <div className="form-row mb-4">
      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChange={handleChange}
        className="form-input w-full p-2 border rounded-md"
      />
    </div>
    <div className="form-row mb-4">
      <select
        name="role"
        value={formData.role}
        onChange={handleChange}
        className="form-input w-full p-2 border rounded-md"
      >
        <option value="">Select Role</option>
        <option value="hr">HR</option>
        <option value="instructor">Instructor</option>
        <option value="manager">Manager</option>
        <option value="user">Learner</option>
      </select>
    </div>
    <button
      type="submit"
      className="form-button w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
    >
      Create Account
    </button>
    <p className="form-footer text-center text-sm mt-4">
      Already have an account?{" "}
      <a href="/" className="form-link text-blue-500 hover:underline">
        Sign In
      </a>
    </p>
  </form>
</div>

  );
};

export default SignupPage;
