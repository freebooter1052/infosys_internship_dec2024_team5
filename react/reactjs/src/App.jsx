import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// ...existing code...
import ForgotPasswordPage2 from "./components/ForgotPasswordPage2";
import ResetPage from "./components/ResetPage"; // Ensure this import is correct

function App() {
  return (
    <Router>
      <Routes>
        // ...existing routes...
        <Route path="/forgot-password-2" element={<ForgotPasswordPage2 />} />
        <Route path="/reset-password" element={<ResetPage />} /> {/* Ensure this path matches */}
      </Routes>
    </Router>
  );
}

export default App;
