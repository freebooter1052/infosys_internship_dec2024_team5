import React, { useState } from "react";
import "./../styles/ForgotPassword.css";

const ForgotPasswordPage2 = () => {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleResetPassword = (e) => {
    e.preventDefault();
    console.log("OTP entered:", otp);
    console.log("New password:", newPassword);
    alert("Password has been reset successfully!");
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
        <button type="submit" className="forgot-password-button">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordPage2;
