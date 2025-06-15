import React from 'react';
import './LabsPanel.css';

const LabsPanel = ({ subject, labs, onSelectLab }) => {
  const handleStartLab = (lab) => {
    onSelectLab(lab);
  };

  if (!subject) {
    return (
      <div className="labs-panel">
        <h2 className="panel-title">Laboratoires</h2>
        <div className="select-subject-message">
          <i className="fas fa-flask"></i>
          <p>Veuillez sélectionner une matière pour voir les laboratoires associés.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="labs-panel">
      <div className="labs-header">
        <h2 className="panel-title">
          Laboratoires pour <span>{subject.name}</span>
        </h2>
        <button className="btn-back" onClick={() => window.history.back()}>
          <i className="fas fa-arrow-left"></i> Retour aux matières
        </button>
      </div>

      {labs.length === 0 ? (
        <div className="no-labs">
          <i className="fas fa-info-circle"></i>
          <p>Aucun laboratoire disponible pour cette matière.</p>
        </div>
      ) : (
        <div className="labs-list">
          {labs.map((lab) => (
            <div key={lab.id} className="lab-card">
              <div className="lab-status">
                <span className={`status ${lab.status === 'approved' ? 'active' : 'pending'}`}>
                  {lab.status === 'approved' ? 'Disponible' : 'En attente'}
                </span>
              </div>
              
              <h3 className="lab-name">{lab.name}</h3>
              
              <div className="lab-details">
                <div className="detail">
                  <i className="fas fa-calendar-alt"></i>
                  <span>Date de création: {new Date(lab.creation_date).toLocaleDateString()}</span>
                </div>
                {lab.approval_date && (
                  <div className="detail">
                    <i className="fas fa-check-circle"></i>
                    <span>Date d'approbation: {new Date(lab.approval_date).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
              
              <div className="lab-actions">
                <button 
                  className="btn-start-lab"
                  onClick={() => handleStartLab(lab)}
                >
                  <i className="fas fa-play-circle"></i>
                  Lancer le laboratoire
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LabsPanel;
