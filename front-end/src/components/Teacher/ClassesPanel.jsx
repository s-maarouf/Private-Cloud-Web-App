import React, { useState, useEffect } from 'react';
import { FaChalkboardTeacher, FaUsers, FaSearch } from 'react-icons/fa';
import apiService from '../../services/api/teacherService';

const ClassesPanel = ({ onClassSelect }) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const classesData = await apiService.getAssignedClasses();
        setClasses(classesData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching classes:', err);
        setError('Failed to load classes data');
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const filteredClasses = classes.filter(cls => 
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement des classes...</p>
      </div>
    );
  }

  return (
    <div className="classes-panel">
      <div className="panel-header">
        <h1>Mes Classes et Groupes</h1>
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher une classe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {filteredClasses.length === 0 && !loading && !error && (
        <div className="no-data-message">
          <FaChalkboardTeacher size={48} />
          <p>Aucune classe trouvée. {searchTerm ? 'Essayez une autre recherche.' : ''}</p>
        </div>
      )}

      <div className="classes-grid">
        {filteredClasses.map(cls => (
          <div 
            className="class-card" 
            key={cls.id}
            onClick={() => onClassSelect(cls)}
          >
            <div className="class-card-header">
              <h3>{cls.name}</h3>
              <span className="student-count">
                <FaUsers />
                {cls.student_count || '0'} étudiants
              </span>
            </div>
            <div className="class-card-body">
              <p>{cls.description || 'Aucune description disponible.'}</p>
            </div>
            <div className="class-card-footer">
              <button className="view-button">Voir les laboratoires</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassesPanel;
