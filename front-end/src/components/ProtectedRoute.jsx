import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, isAuthenticated, allowedRoles = [], userRole, redirectPath = '/' }) => {
  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} />;
  }
  
  // Check if user has the required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // Redirect based on role if not authorized
    if (userRole === 'administrator') {
      return <Navigate to="/admin/dashboard" />;
    } else if (userRole === 'teacher') {
      return <Navigate to="/teacher/dashboard" />;
    } else if (userRole === 'student') {
      return <Navigate to="/student/dashboard" />;
    } else {
      // If role is not recognized, redirect to home
      return <Navigate to="/" />;
    }
  }

  // User is authenticated and has the required role, render the protected component
  return children;
};

export default ProtectedRoute;