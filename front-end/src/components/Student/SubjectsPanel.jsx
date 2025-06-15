import React from 'react';
import './SubjectsPanel.css';

const SubjectsPanel = ({ subjects, onSelectSubject }) => {
  return (
    <div className="subjects-panel">
      <h2 className="panel-title">Mes Matières</h2>
      
      {subjects.length === 0 ? (
        <div className="no-subjects">
          <i className="fas fa-book-open"></i>
          <p>Aucune matière disponible pour le moment.</p>
        </div>
      ) : (
        <div className="subjects-grid">
          {subjects.map((subject) => (
            <div 
              key={subject.id} 
              className="subject-card" 
              onClick={() => onSelectSubject(subject)}
            >
              <div className="subject-icon">
                <i className="fas fa-book"></i>
              </div>
              <h3 className="subject-name">{subject.name}</h3>
              <button className="btn-view">
                Voir les laboratoires
                <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubjectsPanel;
