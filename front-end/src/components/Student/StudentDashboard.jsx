import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import studentService from '../../services/api/studentService';
import Sidebar from './Sidebar';
import ProfilePanel from './ProfilePanel';
import SubjectsPanel from './SubjectsPanel';
import LabsPanel from './LabsPanel';
import ProgressPanel from './ProgressPanel';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const [activePanel, setActivePanel] = useState('profile');
  const [userData, setUserData] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [labs, setLabs] = useState([]);
  const [selectedLab, setSelectedLab] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await studentService.getProfile();
        if (response.user) {
          setUserData(response.user);
        } else {
          setError('Failed to load user data');
        }
      } catch (err) {
        setError('Error fetching user data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await studentService.getSubjects();
        if (response.subjects) {
          setSubjects(response.subjects);
        }
      } catch (err) {
        console.error('Error fetching subjects:', err);
      }
    };

    if (activePanel === 'subjects' || activePanel === 'labs') {
      fetchSubjects();
    }
  }, [activePanel]);

  useEffect(() => {
    const fetchLabs = async () => {
      if (selectedSubject) {
        try {
          const response = await studentService.getLabs(selectedSubject.id);
          if (response.labs) {
            setLabs(response.labs);
          }
        } catch (err) {
          console.error('Error fetching labs:', err);
        }
      }
    };

    if (selectedSubject) {
      fetchLabs();
    }
  }, [selectedSubject]);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await studentService.getProgress();
        if (response.progress) {
          setProgressData(response.progress);
        }
      } catch (err) {
        console.error('Error fetching progress:', err);
      }
    };

    if (activePanel === 'progress') {
      fetchProgress();
    }
  }, [activePanel]);

  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
    setActivePanel('labs');
  };

  const handleLabSelect = (lab) => {
    setSelectedLab(lab);
    // Navigate to lab detail view or update state to show lab details
  };

  const renderActivePanel = () => {
    switch (activePanel) {
      case 'profile':
        return <ProfilePanel userData={userData} />;
      case 'subjects':
        return <SubjectsPanel subjects={subjects} onSelectSubject={handleSubjectSelect} />;
      case 'labs':
        return (
          <LabsPanel 
            subject={selectedSubject} 
            labs={labs} 
            onSelectLab={handleLabSelect} 
          />
        );
      case 'progress':
        return <ProgressPanel progressData={progressData} />;
      default:
        return <ProfilePanel userData={userData} />;
    }
  };
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement du tableau de bord...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="loading-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="student-dashboard">
      <Sidebar 
        activePanel={activePanel} 
        setActivePanel={setActivePanel} 
        userData={userData}
      />
      <div className="dashboard-content">
        <div className="panel-container">
          {renderActivePanel()}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
