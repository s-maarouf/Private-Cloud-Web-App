import React, { useState, useEffect } from 'react';
import { FaChalkboardTeacher, FaSearch } from 'react-icons/fa';
import apiService from '../../services/api/teacherService';

const ClassesPanel = ({ onClassSelect, teacherData }) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        
        // If teacherData has assigned_classes, use that instead of making another API call
        if (teacherData && teacherData.assigned_classes) {
          const formattedClasses = teacherData.assigned_classes.map(cls => ({
            id: cls.id,
            name: cls.name,
            subjects: cls.subjects || [],
            subjectCount: cls.subjects ? cls.subjects.length : 0,
            description: `Classe ${cls.name}`
          }));
          setClasses(formattedClasses);
        } else {
          // Fallback to API call if data not available in props
          const classesData = await apiService.getAssignedClasses();
          setClasses(classesData);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching classes:', err);
        setError('Failed to load classes data');
        setLoading(false);
      }
    };

    fetchClasses();
  }, [teacherData]);

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
      )}      <div className="classes-grid">
        {filteredClasses.map(cls => (
          <div 
            className="class-card" 
            key={cls.id}
            onClick={() => onClassSelect(cls)}
          >
            <div className="class-card-header">
              <h3>{cls.name}</h3>
            </div>
            <div className="class-card-body">
              <p className="class-description">{cls.name}</p>
              {cls.subjects && cls.subjects.length > 0 && (
                <div className="subjects-list">
                  <h4>Matières enseignées:</h4>
                  <ul>
                    {cls.subjects.map(subject => (
                      <li key={subject.id}>{subject.name}</li>
                    ))}
                  </ul>
                </div>
              )}
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
