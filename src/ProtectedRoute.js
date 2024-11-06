// src/components/auth/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  // Redirect to login if no user is stored in localStorage
  return storedUser ? element : <Navigate to="/login-page" replace />;
};

export default ProtectedRoute;
