import React from 'react';
import './ProgressPanel.css';

const ProgressPanel = ({ progressData }) => {
  // Group labs by status for visual representation
  const getStatusCounts = () => {
    if (!progressData || progressData.length === 0) return { completed: 0, inProgress: 0, notStarted: 0 };
    
    return progressData.reduce((counts, item) => {
      if (item.status === 'completed') counts.completed += 1;
      else if (item.status === 'in_progress') counts.inProgress += 1;
      else counts.notStarted += 1;
      return counts;
    }, { completed: 0, inProgress: 0, notStarted: 0 });
  };

  const statusCounts = getStatusCounts();
  const totalLabs = progressData ? progressData.length : 0;
  const completionPercentage = totalLabs > 0 ? Math.round((statusCounts.completed / totalLabs) * 100) : 0;

  return (
    <div className="progress-panel">
      <h2 className="panel-title">Ma Progression</h2>
        {!progressData || progressData.length === 0 ? (
        <div className="no-progress">
          <i className="fas fa-chart-line"></i>
          <p>Aucune progression enregistrée pour le moment.</p>
        </div>
      ) : (
        <>
          <div className="progress-overview">
            <div className="progress-card">
              <div className="progress-stat">
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar" 
                    style={{ width: `${completionPercentage}%` }}
                  >
                    <span className="progress-percentage">{completionPercentage}%</span>
                  </div>
                </div>
                <div className="progress-summary">
                  <div className="progress-item completed">
                    <span className="dot"></span>
                    <span className="label">Terminés</span>
                    <span className="value">{statusCounts.completed}</span>
                  </div>
                  <div className="progress-item in-progress">
                    <span className="dot"></span>
                    <span className="label">En cours</span>
                    <span className="value">{statusCounts.inProgress}</span>
                  </div>
                  <div className="progress-item not-started">
                    <span className="dot"></span>
                    <span className="label">Non commencés</span>
                    <span className="value">{statusCounts.notStarted}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <h3 className="section-title">Détails des laboratoires</h3>
          
          <div className="progress-details">
            <table className="progress-table">
              <thead>
                <tr>
                  <th>Laboratoire</th>
                  <th>Statut</th>
                  <th>Date de début</th>
                  <th>Date de fin</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {progressData.map((item) => (
                  <tr key={item.id}>
                    <td>{item.lab_name}</td>
                    <td>
                      <span className={`status-badge ${item.status}`}>
                        {item.status === 'completed' && 'Terminé'}
                        {item.status === 'in_progress' && 'En cours'}
                        {item.status === 'not_started' && 'Non commencé'}
                      </span>
                    </td>
                    <td>{item.start_date ? new Date(item.start_date).toLocaleDateString() : '-'}</td>
                    <td>{item.completion_date ? new Date(item.completion_date).toLocaleDateString() : '-'}</td>
                    <td>{item.score !== null ? `${item.score}/100` : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ProgressPanel;
