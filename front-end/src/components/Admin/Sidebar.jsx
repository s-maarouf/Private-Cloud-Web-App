import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaUsers, 
  FaSchool, 
  FaBook, 
  FaFlask, 
  FaSignOutAlt 
} from 'react-icons/fa';

const Sidebar = ({ activePanel, setActivePanel }) => {
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    window.location.href = '/login';
  };
  
  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <h2>Panneau d'administration</h2>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          <li 
            className={activePanel === 'overview' ? 'active' : ''}
            onClick={() => setActivePanel('overview')}
          >
            <FaTachometerAlt /> Acceuil
          </li>
          <li 
            className={activePanel === 'users' ? 'active' : ''}
            onClick={() => setActivePanel('users')}
          >
            <FaUsers /> Gestion des utilisateurs
          </li>
          <li 
            className={activePanel === 'classes' ? 'active' : ''}
            onClick={() => setActivePanel('classes')}
          >
            <FaSchool /> Gestion des classes
          </li>
          <li 
            className={activePanel === 'subjects' ? 'active' : ''}
            onClick={() => setActivePanel('subjects')}
          >
            <FaBook /> Gestion des matières
          </li>
          <li 
            className={activePanel === 'labs' ? 'active' : ''}
            onClick={() => setActivePanel('labs')}
          >
            <FaFlask /> Approbations de laboratoires
          </li>
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <Link to="/" className="home-link">Voir le site</Link>
        <button onClick={handleLogout} className="logout-btn">
          <FaSignOutAlt /> Déconnexion
        </button>
      </div>
    </div>
  );
};

export default Sidebar;