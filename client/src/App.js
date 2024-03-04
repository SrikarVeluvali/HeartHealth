// React Imports
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Components
import Login from "./Components/Login";
import Register from "./Components/Register";

// Services
import ProtectedRoutes from "./Services/ProtectedRoutes";

//Pages
import ForgetPassword from "./Pages/ForgetPassword";
import ChangePassword from "./Pages/ChangePassword";
import HomePage from "./Pages/HomePage";
import AssessmentForm from './Pages/AssessmentForm';
import ResultsPage from './Pages/PrevResults';
import SATest from "./Pages/SATest";
import ReportAnalysis from "./Pages/ReportAnalysis";
import NewPassword from "./Pages/NewPassword";
import Chatbot from "./Pages/ChatBot";
import Profile from "./Pages/Profile";
import AssessmentForm2 from "./Pages/AssessmentForm2";


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ForgetPassword />} />

        {/* Password reset route with token */}
        <Route path="/user/reset/:id/:token" element={<ChangePassword />} />

        {/* Protected Routes (require authentication) */}
        <Route path="/" element={<ProtectedRoutes />}>
          {/* Home page */}
          <Route index element={<HomePage />} />
          {/* Assessment 1 */}
          <Route path="/assessment" element={<AssessmentForm />} />
          {/* Assessment 1 */}
          <Route path="/assessment2" element={<AssessmentForm2 />} />
          {/* Self Assessment Test */}
          <Route path="/self-assessment" element={<SATest />} />
          {/* Previous Results */}
          <Route path="/results" element={<ResultsPage />} />
          {/* Analyse Medical Report */}
          <Route path="/analyse-report" element={<ReportAnalysis />} />
          {/* Change New Password */}
          <Route path="/newpassword" element={<NewPassword />} />
          {/* Chatbot */}
          <Route path="/chat" element={<Chatbot />} />
          {/* Profile */}
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
