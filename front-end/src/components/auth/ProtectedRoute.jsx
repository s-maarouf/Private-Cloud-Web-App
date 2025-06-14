import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { currentUser, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    // You could render a loading spinner here
    return <div className="loading-container">Chargement...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role (if specified)
  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    // Redirect to unauthorized page or dashboard
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated and authorized
  return children;
};

export default ProtectedRoute;