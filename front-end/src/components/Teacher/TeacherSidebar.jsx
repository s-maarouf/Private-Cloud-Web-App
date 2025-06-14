import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaChalkboardTeacher, FaFlask, FaHome, FaPowerOff } from 'react-icons/fa';

const TeacherSidebar = ({ activePanel, setActivePanel, teacherData }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    // Navigate to login
    navigate('/login');
  };

  return (
    <div className="teacher-sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <img src="/logo.svg" alt="OpenStack Logo" />
          <span>OpenStack</span>
        </div>
        <div className="user-info">
          <div className="avatar">
            <img src="/avatar-placeholder.png" alt="Teacher Avatar" />
          </div>
          <div className="user-details">
            <h3>{teacherData?.first_name} {teacherData?.last_name}</h3>
            <span className="user-role">Enseignant</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li>
            <button
              className={activePanel === 'overview' ? 'active' : ''}
              onClick={() => setActivePanel('overview')}
            >
              <FaHome className="icon" />
              <span>Tableau de bord</span>
            </button>
          </li>
          <li>
            <button
              className={activePanel === 'classes' ? 'active' : ''}
              onClick={() => setActivePanel('classes')}
            >
              <FaChalkboardTeacher className="icon" />
              <span>Mes Classes</span>
            </button>
          </li>
          <li>
            <button
              className={activePanel === 'profile' ? 'active' : ''}
              onClick={() => setActivePanel('profile')}
            >
              <FaUser className="icon" />
              <span>Profil Enseignant</span>
            </button>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          <FaPowerOff className="icon" />
          <span>Se déconnecter</span>
        </button>
      </div>
    </div>
  );
};

export default TeacherSidebar;
