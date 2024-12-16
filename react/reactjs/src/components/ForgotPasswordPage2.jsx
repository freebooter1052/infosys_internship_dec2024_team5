import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./../styles/ForgotPassword.css";
import { Link } from "react-router-dom";

const ForgotPasswordPage2 = () => {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const location = useLocation();
  const email = location.state?.email || ""; // Get email from location state

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:5000/api/verify-otp", {
        email: email,
        otp: otp,
      });
      if (response.data.message === "OTP verified successfully") {
        console.log("OTP verified:", otp);
        console.log("New password:", newPassword);
        alert("OTP verified successfully! You can now reset your password.");
        // Add logic to reset the password
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="forgot-password-container">
      <form className="forgot-password-form" onSubmit={handleResetPassword}>
        <h2>Forgot Password</h2>
        <p>
          An email with a verification code has been sent to your registered
          email address. Please enter it below.
        </p>
        <div className="form-group">
          <label htmlFor="otp">Enter Verification Code</label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            required
          />
        </div>
        <Link to="/reset-page" >
        <button type="submit" className="forgot-password-button">
          Reset Password
        </button>
        </Link>
      </form>
    </div>
  );
};

export default ForgotPasswordPage2;
