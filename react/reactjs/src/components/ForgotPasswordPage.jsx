import React, { useState } from "react";
import "./../styles/ForgotPassword.css";
import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");

  const handleGetOTP = (e) => {
    e.preventDefault();
    console.log("Email entered:", email);
    alert("OTP sent to your registered email!");
  };

  return (
    <div className="forgot-password-container">
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
        <Link to="/forgot-password2">
        <button type="submit" className="forgot-password-button">
          Get OTP
        </button>
        </Link>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;

