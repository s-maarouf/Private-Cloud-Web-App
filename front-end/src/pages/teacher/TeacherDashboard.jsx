import React, { useState, useEffect } from 'react';
import { FaUser, FaBook, FaFlask, FaBell } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import apiServices from '../../services/api';
import ClassesList from './ClassesList';
import TeacherProfile from './TeacherProfile';
import './TeacherDashboard.css';

const TeacherDashboard = ({ activeTab: initialActiveTab }) => {
  const [activeTab, setActiveTab] = useState(initialActiveTab || 'classes');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teacherInfo, setTeacherInfo] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Récupérer les informations de l'enseignant connecté
        const userResponse = await apiServices.teacher.getProfile();
        setTeacherInfo(userResponse);
        
        // Récupérer les notifications (optionnel)
        const notificationsResponse = await apiServices.teacher.getNotifications();
        setNotifications(notificationsResponse);
        
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError('Impossible de charger vos informations. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTeacherData();
  }, []);
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Update the URL to reflect the tab
    if(tab === 'classes') {
      navigate('/teacher/classes');
    } else if(tab === 'profile') {
      navigate('/teacher/profile');
    } else if(tab === 'labs') {
      navigate('/teacher/labs');
    } else {
      navigate('/teacher/dashboard');
    }
  };
  
  const handleLogout = async () => {
    try {
      await apiServices.auth.logout();
      // Rediriger vers la page de connexion
      navigate('/login');
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err);
    }
  };

  if (loading) {
    return (
      <div className="openstack-teacher-dashboard">
        <div className="openstack-loading">
          <div className="spinner"></div>
          <p>Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="openstack-teacher-dashboard">
      <div className="openstack-teacher-header">
        <div className="openstack-teacher-welcome">
          <h1>Bienvenue, {teacherInfo?.first_name || 'Enseignant'}</h1>
          <p>Tableau de bord enseignant</p>
        </div>
        
        <div className="openstack-teacher-actions">
          <div className="openstack-notifications">
            <FaBell />
            {notifications && notifications.length > 0 && (
              <span className="notification-badge">{notifications.length}</span>
            )}
          </div>
          
          <div className="openstack-user-info">
            <span>{teacherInfo?.first_name} {teacherInfo?.last_name}</span>
            <button className="openstack-logout-btn" onClick={handleLogout}>Déconnexion</button>
          </div>
        </div>
      </div>

      {error && <div className="openstack-error">{error}</div>}

      <div className="openstack-teacher-tabs">
        <button 
          className={`tab-btn ${activeTab === 'classes' ? 'active' : ''}`} 
          onClick={() => handleTabChange('classes')}
        >
          <FaBook /> Classes & Groupes
        </button>
        <button 
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`} 
          onClick={() => handleTabChange('profile')}
        >
          <FaUser /> Mon Profil
        </button>
      </div>

      <div className="openstack-teacher-content">
        {activeTab === 'classes' && <ClassesList teacherId={teacherInfo?.id} />}
        {activeTab === 'profile' && <TeacherProfile teacherInfo={teacherInfo} />}
      </div>
    </div>
  );
};

export default TeacherDashboard;