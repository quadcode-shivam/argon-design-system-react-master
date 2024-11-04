import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import "assets/vendor/nucleo/css/nucleo.css";
import "assets/vendor/font-awesome/css/font-awesome.min.css";
import "assets/scss/argon-design-system-react.scss?v1.1.0";

import Index from "views/Index.js";
import Login from "components/auth/Login.js";
import Profile from "components/auth/Profile";
import Register from "components/auth/Register.js";
import Dashboard from "components/dashbord/Dashboard";
import Backlink from "components/Report/Backlinks";
import Attendance from "components/Attendance/Attendance";
import Leave from "components/Leaves/Leaves";
import ViewAllLeaves from "components/Report/ViewAllLeaves";
import SalaryReport from "components/Salary/Salary";
import MarkAttendance from "components/Attendance/MarkAttendance";



const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" exact element={<Index />} />
      <Route path="/login-page" exact element={<Login />} />
      <Route path="/profile-page" exact element={<Profile />} />
      <Route path="/register-page" exact element={<Register />} />
      <Route path="/dashboard" exact element={<Dashboard />} />
      <Route path="/backlinks-report" exact element={<Backlink />} />
      <Route path="/attendance-report" exact element={<Attendance />} />
      <Route path="/mark-attendance" exact element={<MarkAttendance />} />
      <Route path="/leaves-report" exact element={<Leave />} />
      <Route path="/salary-reports" exact element={<SalaryReport />} />
      <Route path="/view-all-leave" exact element={<ViewAllLeaves />} />
      <Route path="/view-approved-leave" exact element={<ViewAllLeaves />} />
      <Route path="/view-pending-leave" exact element={<ViewAllLeaves />} />
      <Route path="/view-suspended-leave" exact element={<ViewAllLeaves />} />
      <Route path="/download-report" exact element={<ViewAllLeaves />} />
      <Route path="/apply-leave" exact element={<ViewAllLeaves />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);
