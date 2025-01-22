import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import axios from "axios";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user" // default role
  });

  const navigate = useNavigate(); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://127.0.0.1:5001/api/login", formData, {
        withCredentials: true
      })
      .then((response) => {
        alert("Login successful!");
        const userRole = response.data.role.toLowerCase();
        console.log("Setting user role:", userRole); // Debug log
        sessionStorage.setItem("user_role", userRole);
        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("user_email", response.data.email);
        sessionStorage.setItem("user_name", response.data.name);
        
        navigate("/home");
      })
      .catch((error) => {
        if (error.response) {
          alert(error.response.data.error);
        } else {
          alert("Something went wrong. Please try again.");
        }
      });
  };

  return (
    <div className="login-container flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% px-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md mt-1"
            />
          </div>
    
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md mt-1"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md mt-1"
            >
              <option value="user">User</option>
              <option value="hr">HR</option>
              <option value="instructor">Instructor</option>
              <option value="manager">Manager</option>
            </select>
          </div>
    
          <div className="mb-4">
            <Link to="/forgot-password" className="text-sm text-blue-500 hover:underline">
              Forgot Password?
            </Link>
          </div>
    
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>
    
        <p className="text-center text-sm mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
