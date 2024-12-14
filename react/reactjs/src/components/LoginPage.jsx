import React from "react";
import { Link } from "react-router-dom";
import "./../styles/LoginPage.css";

const LoginPage = () => {
  return (
    <div className="login-container">
      <h2>Login</h2>
      <form>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" placeholder="Enter your email" required />

        <label htmlFor="password">Password</label>
        <input type="password" id="password" placeholder="Enter your password" required />

        <div className="options">
          <Link to="/forgot-password" className="forgot-password">Forgot Password?</Link>
        </div>
        <Link to="/home">
        <button type="submit" className="login-button">Login</button>
        </Link>
      </form>
      <p className="signup-prompt">
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
};

export default LoginPage;
