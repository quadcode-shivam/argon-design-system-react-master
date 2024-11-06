// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import "assets/vendor/nucleo/css/nucleo.css";
import "assets/vendor/font-awesome/css/font-awesome.min.css";
import "assets/scss/argon-design-system-react.scss?v1.1.0";

import Index from "views/Index.js";
import Login from "components/auth/Login.js";
import Register from "components/auth/Register.js";
import Profile from "components/auth/Profile";
import Dashboard from "components/dashbord/Dashboard";
import Backlink from "components/Report/Backlinks";
import Attendance from "components/Attendance/Attendance";
import Leave from "components/Leaves/Leaves";
import ViewAllLeaves from "components/Report/ViewAllLeaves";
import SalaryReport from "components/Salary/Salary";
import MarkAttendance from "components/Attendance/MarkAttendance";
import Calendor from "components/Calendor/Calendor";
import UserTask from "components/Task/UserTask";
import ProtectedRoute from "ProtectedRoute";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Routes>
      {/* Public Routes: Login and Register */}
      <Route path="/login-page" element={<Login />} />
      <Route path="/register-page" element={<Register />} />

      {/* Protected Routes */}
      <Route path="/" element={<ProtectedRoute element={<Index />} />} />
      <Route path="/profile-page" element={<ProtectedRoute element={<Profile />} />} />
      <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
      <Route path="/backlinks-report" element={<ProtectedRoute element={<Backlink />} />} />
      <Route path="/attendance-report" element={<ProtectedRoute element={<Attendance />} />} />
      <Route path="/mark-attendance" element={<ProtectedRoute element={<MarkAttendance />} />} />
      <Route path="/leaves-report" element={<ProtectedRoute element={<Leave />} />} />
      <Route path="/salary-reports" element={<ProtectedRoute element={<SalaryReport />} />} />
      <Route path="/view-all-leave" element={<ProtectedRoute element={<ViewAllLeaves />} />} />
      <Route path="/view-approved-leave" element={<ProtectedRoute element={<ViewAllLeaves />} />} />
      <Route path="/view-pending-leave" element={<ProtectedRoute element={<ViewAllLeaves />} />} />
      <Route path="/view-suspended-leave" element={<ProtectedRoute element={<ViewAllLeaves />} />} />
      <Route path="/download-report" element={<ProtectedRoute element={<ViewAllLeaves />} />} />
      <Route path="/apply-leave" element={<ProtectedRoute element={<ViewAllLeaves />} />} />
      <Route path="/calendar" element={<ProtectedRoute element={<Calendor />} />} />
      <Route path="/tasks-report" element={<ProtectedRoute element={<UserTask />} />} />

      {/* Redirect any other path to login if unauthenticated */}
      <Route path="*" element={<Navigate to="/login-page" replace />} />
    </Routes>
  </BrowserRouter>
);
