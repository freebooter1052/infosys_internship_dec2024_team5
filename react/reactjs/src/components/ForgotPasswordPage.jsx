import React, { useState } from "react";
import "./../styles/ForgotPassword.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate(); // Initialize navigate

  const handleGetOTP = (e) => {
    e.preventDefault();
    axios
      .post("http://127.0.0.1:5000/api/forgot-password", { email })
      .then((response) => {
        alert(response.data.message); // Success message
        navigate("/forgot-password2", { state: { email } }); // Pass email to the next page
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
    <div className="forgot-password-container bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%">
      <form className="forgot-password-form" onSubmit={handleGetOTP}>
        <h2>Forgot Password</h2>
        <p>Enter your registered email</p>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <button type="submit" className="forgot-password-button">
          Get OTP
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
