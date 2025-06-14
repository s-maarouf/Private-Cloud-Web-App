import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ role }) => {
  // Define navigation items based on user role
  const getNavItems = () => {
    switch (role) {
      case 'administrator':
        return [
          { path: '/admin/dashboard', label: 'Tableau de bord', icon: '📊' },
          { path: '/admin/users', label: 'Utilisateurs', icon: '👥' },
          { path: '/admin/classes', label: 'Classes', icon: '🏫' },
          { path: '/admin/subjects', label: 'Matières', icon: '📚' },
          { path: '/admin/labs', label: 'Laboratoires', icon: '🧪' },
        ];
      case 'teacher':
        return [
          { path: '/teacher/dashboard', label: 'Tableau de bord', icon: '📊' },
          { path: '/teacher/classes', label: 'Mes Classes', icon: '🏫' },
          { path: '/teacher/labs', label: 'Mes Laboratoires', icon: '🧪' },
          { path: '/teacher/students', label: 'Mes Étudiants', icon: '👨‍🎓' },
        ];
      case 'student':
        return [
          { path: '/student/dashboard', label: 'Tableau de bord', icon: '📊' },
          { path: '/student/classes', label: 'Mes Classes', icon: '🏫' },
          { path: '/student/labs', label: 'Laboratoires', icon: '🧪' },
          { path: '/student/progress', label: 'Ma Progression', icon: '📈' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>{role === 'administrator' ? 'Administration' : role === 'teacher' ? 'Espace Enseignant' : 'Espace Étudiant'}</h3>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          {navItems.map((item, index) => (
            <li key={index}>
              <NavLink 
                to={item.path}
                className={({ isActive }) => 
                  isActive ? 'sidebar-link active' : 'sidebar-link'
                }
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-text">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <p>© OpenStack Éducatif</p>
      </div>
    </div>
  );
};

export default Sidebar;
