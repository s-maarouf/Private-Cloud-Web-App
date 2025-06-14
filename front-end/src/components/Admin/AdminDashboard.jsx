import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import './AdminDashboard.css';
import Sidebar from './Sidebar';
import UsersPanel from './UsersPanel';
import ClassesPanel from './ClassesPanel';
import SubjectsPanel from './SubjectsPanel';
import LabsPanel from './LabsPanel';
import Overview from './Overview';

const AdminDashboard = () => {
  const [activePanel, setActivePanel] = useState('overview');

  // Check if user is authenticated and is admin
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (userRole !== 'administrator') {
    return <Navigate to="/dashboard" replace />;
  }

  // Render the active panel based on selection
  const renderPanel = () => {
    switch (activePanel) {
      case 'users':
        return <UsersPanel />;
      case 'classes':
        return <ClassesPanel />;
      case 'subjects':
        return <SubjectsPanel />;
      case 'labs':
        return <LabsPanel />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="admin-dashboard">
      <Sidebar activePanel={activePanel} setActivePanel={setActivePanel} />
      <div className="admin-content">
        <div className="panel-container">
          {renderPanel()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;