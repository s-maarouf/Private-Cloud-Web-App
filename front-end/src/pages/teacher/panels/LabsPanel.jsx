import React, { useState, useEffect } from 'react';
import './LabsPanel.css';

const LabsPanel = ({ teacherId }) => {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLab, setSelectedLab] = useState(null);
  const [labDetails, setLabDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'draft', 'pending'
  const [classes, setClasses] = useState([]); // To associate labs with classes

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get all classes first - we need this to filter labs by teacher
        const classesResponse = await fetch('/api/class', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!classesResponse.ok) {
          throw new Error(`Erreur serveur pour les classes: ${classesResponse.status}`);
        }
        
        const classesData = await classesResponse.json();
        
        // Filter classes for this teacher
        const teacherClasses = classesData.filter(c => 
          c.teacher_id === teacherId || 
          (c.teachers && c.teachers.some(t => t.id === teacherId))
        );
        
        setClasses(teacherClasses);
        
        // Note: Since there's no endpoint to get all labs or labs by teacher,
        // we'll need to collect them from each class that this teacher teaches
        
        const labsPromises = teacherClasses.map(async (classItem) => {
          try {
            // Get detailed class info which might include labs
            const classDetailResponse = await fetch(`/api/class/${classItem.id}`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            });
            
            if (!classDetailResponse.ok) {
              console.error(`Couldn't fetch details for class ${classItem.id}`);
              return [];
            }
            
            const classDetail = await classDetailResponse.json();
            
            // If the class has labs, add the class name to each lab for display
            if (classDetail.labs && Array.isArray(classDetail.labs)) {
              return classDetail.labs.map(lab => ({
                ...lab,
                class_name: classItem.name,
                class_id: classItem.id
              }));
            }
            
            return [];
          } catch (err) {
            console.error(`Error fetching labs for class ${classItem.id}:`, err);
            return [];
          }
        });
        
        // Collect all labs from all classes
        const labsFromClasses = await Promise.all(labsPromises);
        const allLabs = labsFromClasses.flat();
        
        // If we have labs, use them
        if (allLabs.length > 0) {
          setLabs(allLabs);
        } else {
          // If no labs were found via classes, try another approach:
          // Get any labs created by this teacher directly
          // Note: This is a fallback and may not work with the current API
          setLabs([]);
        }
      } catch (err) {
        setError("Impossible de charger les laboratoires");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (teacherId) {
      fetchData();
    }
  }, [teacherId]);

  const handleLabClick = async (labId) => {
    try {
      setLoadingDetails(true);
      setSelectedLab(labId);
      
      // Get lab details using the lab/:id endpoint
      const labResponse = await fetch(`/api/lab/${labId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!labResponse.ok) {
        throw new Error(`Erreur serveur: ${labResponse.status}`);
      }
      
      const labData = await labResponse.json();
      
      // Find the related class info
      const labClass = classes.find(c => c.id === labData.course_id);
      
      // Combine the lab data with class info and other required info
      const enhancedLabData = {
        ...labData,
        class_name: labClass ? labClass.name : 'Classe inconnue',
        // Add default values for fields that might not be in the API response
        student_progress: labData.student_progress || [],
        steps: labData.steps || [],
        completion_rate: labData.completion_rate || 0,
        status: labData.status || 'draft'
      };
      
      setLabDetails(enhancedLabData);
    } catch (err) {
      setError("Impossible de charger les détails du laboratoire");
      console.error(err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const getFilteredLabs = () => {
    if (filter === 'all') return labs;
    return labs.filter(lab => lab.status === filter);
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'draft': return 'Brouillon';
      case 'pending': return 'En attente';
      default: return status || 'Inconnu';
    }
  };

  if (loading) {
    return <div className="openstack-loading">Chargement des laboratoires...</div>;
  }

  if (error) {
    return <div className="openstack-error">{error}</div>;
  }

  if (labs.length === 0) {
    return (
      <div className="labs-panel">
        <h2>Mes Laboratoires</h2>
        <div className="no-labs">Vous n'avez pas encore créé de laboratoires.</div>
      </div>
    );
  }

  return (
    <div className="labs-panel">
      <div className="panel-header">
        <h2>Mes Laboratoires</h2>
        <div className="lab-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`} 
            onClick={() => setFilter('all')}
          >
            Tous
          </button>
          <button 
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`} 
            onClick={() => setFilter('active')}
          >
            Actifs
          </button>
          <button 
            className={`filter-btn ${filter === 'draft' ? 'active' : ''}`} 
            onClick={() => setFilter('draft')}
          >
            Brouillons
          </button>
          <button 
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`} 
            onClick={() => setFilter('pending')}
          >
            En attente
          </button>
        </div>
      </div>
      
      <div className="labs-list">
        {getFilteredLabs().map(lab => (
          <div 
            key={lab.id} 
            className={`lab-card ${selectedLab === lab.id ? 'selected' : ''}`}
            onClick={() => handleLabClick(lab.id)}
          >
            <div className="lab-header">
              <h3>{lab.name}</h3>
              <span className={`status-badge ${lab.status || 'draft'}`}>
                {getStatusLabel(lab.status)}
              </span>
            </div>
            <p>{lab.description || 'Aucune description disponible'}</p>
            <div className="lab-meta">
              <span className="lab-class">Classe: {lab.class_name || 'Non assigné'}</span>
              <span className="lab-date">Créé le: {formatDate(lab.created_at)}</span>
            </div>
            {lab.status === 'active' && (
              <div className="lab-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${lab.completion_rate || 0}%` }}
                  ></div>
                </div>
                <span className="progress-text">{lab.completion_rate || 0}% complété en moyenne</span>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {selectedLab && labDetails && (
        <div className="lab-details">
          <h3>Détails du laboratoire</h3>
          
          {loadingDetails ? (
            <div className="openstack-loading">Chargement des détails...</div>
          ) : (
            <>
              <div className="lab-info-header">
                <div>
                  <h4>{labDetails.name}</h4>
                  <p>{labDetails.description || 'Aucune description disponible'}</p>
                </div>
                <div className="lab-status-info">
                  <span className={`status-badge ${labDetails.status || 'draft'}`}>
                    {getStatusLabel(labDetails.status)}
                  </span>
                </div>
              </div>
              
              <div className="details-section">
                <h4>Étapes du laboratoire</h4>
                {labDetails.steps && labDetails.steps.length > 0 ? (
                  <div className="lab-steps">
                    {labDetails.steps.map((step, index) => (
                      <div key={step.id || index} className="lab-step">
                        <div className="step-number">{index + 1}</div>
                        <div className="step-content">
                          <h5>{step.title}</h5>
                          <p>{step.description || 'Aucune description disponible'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>Aucune étape définie pour ce laboratoire.</p>
                )}
              </div>
              
              <div className="details-section">
                <h4>Progression des étudiants</h4>
                {labDetails.student_progress && labDetails.student_progress.length > 0 ? (
                  <div className="student-progress-list">
                    {labDetails.student_progress.map((student, index) => (
                      <div key={index} className="student-progress-item">
                        <div className="student-info">
                          <span className="student-name">{student.student_name}</span>
                          {student.completed_at && (
                            <span className="completion-date">
                              Terminé le {formatDate(student.completed_at)}
                            </span>
                          )}
                        </div>
                        <div className="progress-container">
                          <div className="progress-bar">
                            <div 
                              className="progress-fill" 
                              style={{ width: `${student.progress || 0}%` }}
                            ></div>
                          </div>
                          <span className="progress-percentage">{student.progress || 0}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>Aucune donnée de progression disponible.</p>
                )}
              </div>
              
              {labDetails.status === 'draft' && (
                <div className="lab-actions">
                  <button className="edit-btn">Modifier</button>
                  <button className="submit-btn">Soumettre pour approbation</button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default LabsPanel;
