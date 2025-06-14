import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import './TeacherDashboard.css';
import TeacherSidebar from './TeacherSidebar';
import ClassesPanel from './ClassesPanel';
import LabsPanel from './LabsPanel';
import TeacherProfile from './TeacherProfile';
import TeacherOverview from './TeacherOverview';
import apiService from '../../services/api/teacherService';

const TeacherDashboard = () => {
  const [activePanel, setActivePanel] = useState('overview');
  const [teacherData, setTeacherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState(null);
  const [error, setError] = useState(null);

  // Check if user is authenticated and is teacher
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        setLoading(true);
        const profile = await apiService.getProfile();
        setTeacherData(profile);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching teacher data:', err);
        setError('Failed to load teacher data');
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, []);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (userRole !== 'teacher') {
    return <Navigate to="/dashboard" replace />;
  }

  // Render the active panel based on selection
  const renderPanel = () => {
    switch (activePanel) {
      case 'classes':
        return <ClassesPanel onClassSelect={(classData) => {
          setSelectedClass(classData);
          setActivePanel('labs');
        }} />;
      case 'labs':
        return <LabsPanel classData={selectedClass} />;
      case 'profile':
        return <TeacherProfile teacherData={teacherData} />;
      default:
        return <TeacherOverview teacherData={teacherData} />;
    }
  };

  if (loading) {
    return (
      <div className="teacher-dashboard">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Chargement en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="teacher-dashboard">
      <TeacherSidebar activePanel={activePanel} setActivePanel={setActivePanel} teacherData={teacherData} />
      <div className="teacher-content">
        <div className="panel-container">
          {error && <div className="error-message">{error}</div>}
          {renderPanel()}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
