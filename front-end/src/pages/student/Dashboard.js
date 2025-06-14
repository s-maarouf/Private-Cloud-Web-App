import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const [user, setUser] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setSubjects(parsedUser.subjects || []);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="student-dashboard-container">
      <div className="student-dashboard-card">
        <div className="student-dashboard-header">
          <div className="student-avatar">{user.firstName.charAt(0).toUpperCase()}</div>
          <div>
            <h1 className="student-dashboard-title">{user.firstName} {user.lastName}</h1>
            <p className="student-dashboard-role">{user.role}</p>
          </div>
          <div className="student-dashboard-actions">
            <button className="student-button-outline">Paramètres</button>
            <button className="student-button-destructive" onClick={handleLogout}>
              Se Déconnecter
            </button>
          </div>
        </div>
        <div className="student-dashboard-content">
          <div>
            <div className="student-subjects-card">
              <h2 className="student-subjects-title">Matières</h2>
              <ul className="student-subjects-list">
                {subjects.length > 0 ? (
                  subjects.map((subject) => (
                    <li key={subject.id} className="student-subject-item">
                      <h3>{subject.name}</h3>
                      <h4>{subject.teacher}</h4>
                      <p>{subject.description || 'Aucune description disponible'}</p>
                    </li>
                  ))
                ) : (
                  <p>Aucune matière disponible.</p>
                )}
              </ul>
            </div>
            <div className="student-news-card">
              <h2 className="student-news-title">Des informations d'actualité</h2>
              <div className="student-news-content">
                peut être affiché ici. (optionnel)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;