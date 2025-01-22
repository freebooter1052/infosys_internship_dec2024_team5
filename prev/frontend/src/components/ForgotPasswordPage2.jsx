import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./../styles/ForgotPassword.css";

const ForgotPasswordPage2 = () => {
  const [otp, setOtp] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
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
        alert("OTP verified successfully! You can now reset your password.");
        navigate("/reset-page"); // Ensure this path matches
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="forgot-password-container bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%">
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
        <button type="submit" className="forgot-password-button">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordPage2;
