import React, { useState, useEffect } from 'react';
import './ClassesPanel.css';

const ClassesPanel = ({ teacherId }) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [classLabs, setClassLabs] = useState([]);
  const [classStudents, setClassStudents] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        
        // Using the /api/class endpoint to get all classes
        const response = await fetch('/api/class', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`Erreur serveur: ${response.status}`);
        }
        
        const allClasses = await response.json();
        
        // Filter classes associated with this teacher
        // Note: Since the API doesn't provide a direct endpoint for teacher's classes,
        // we need to filter on the client side
        const teacherClasses = allClasses.filter(c => 
          c.teacher_id === teacherId || 
          (c.teachers && c.teachers.some(t => t.id === teacherId))
        );
        
        setClasses(teacherClasses);
      } catch (err) {
        setError("Impossible de charger les classes");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (teacherId) {
      fetchClasses();
    }
  }, [teacherId]);

  const handleClassClick = async (classId) => {
    try {
      setLoadingDetails(true);
      setSelectedClass(classId);
      
      // Get class details
      const classResponse = await fetch(`/api/class/${classId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!classResponse.ok) {
        throw new Error(`Erreur serveur: ${classResponse.status}`);
      }
      
      const classData = await classResponse.json();
      
      // Note: The API doesn't provide direct endpoints for students in a class
      // or labs in a class. We'll have to work with what we have.
      
      // For labs, we can try to get all labs and filter by class
      try {
        // Get labs from class data if available
        if (classData.labs && Array.isArray(classData.labs)) {
          setClassLabs(classData.labs);
        } else {
          // Since we don't have a way to fetch all labs, we'll set an empty array
          // or keep placeholder data for now
          setClassLabs([]);
        }
      } catch (labError) {
        console.error('Erreur lors du chargement des laboratoires:', labError);
        setClassLabs([]);
      }
      
      // For students, we can try to get from class data if available
      try {
        if (classData.students && Array.isArray(classData.students)) {
          setClassStudents(classData.students);
        } else {
          // Since we don't have a way to fetch students directly, we'll set an empty array
          // or keep placeholder data for now
          setClassStudents([]);
        }
      } catch (studentError) {
        console.error('Erreur lors du chargement des étudiants:', studentError);
        setClassStudents([]);
      }
    } catch (err) {
      setError("Impossible de charger les détails de la classe");
      console.error(err);
    } finally {
      setLoadingDetails(false);
    }
  };

  if (loading) {
    return <div className="openstack-loading">Chargement des classes...</div>;
  }

  if (error) {
    return <div className="openstack-error">{error}</div>;
  }

  if (classes.length === 0) {
    return <div className="no-classes">Vous n'avez pas encore de classes assignées.</div>;
  }

  return (
    <div className="classes-panel">
      <h2>Mes Classes</h2>
      
      <div className="classes-grid">
        {classes.map(classItem => (
          <div 
            key={classItem.id} 
            className={`class-card ${selectedClass === classItem.id ? 'selected' : ''}`}
            onClick={() => handleClassClick(classItem.id)}
          >
            <h3>{classItem.name}</h3>
            <p>{classItem.description || 'Aucune description disponible'}</p>
            <div className="class-meta">
              <span className="student-count">
                <i className="student-icon">👨‍🎓</i> {classItem.student_count || '?'} étudiants
              </span>
            </div>
            <div className="class-actions">
              <button className="view-btn">Voir les détails</button>
            </div>
          </div>
        ))}
      </div>
      
      {selectedClass && (
        <div className="class-details">
          <h3>Détails de la classe</h3>
          
          {loadingDetails ? (
            <div className="openstack-loading">Chargement des détails...</div>
          ) : (
            <>
              <div className="details-section">
                <h4>Laboratoires</h4>
                {classLabs.length > 0 ? (
                  <div className="labs-list">
                    {classLabs.map(lab => (
                      <div key={lab.id} className="lab-item">
                        <div className="lab-info">
                          <h5>{lab.name}</h5>
                          <p>{lab.description || 'Aucune description disponible'}</p>
                        </div>
                        <div className="lab-progress">
                          <div className="progress-bar">
                            <div 
                              className="progress-fill" 
                              style={{ width: `${lab.completion || 0}%` }}
                            ></div>
                          </div>
                          <span className="progress-text">{lab.completion || 0}% complété</span>
                        </div>
                        <div className="lab-status">
                          <span className={`status-badge ${lab.status || 'draft'}`}>
                            {lab.status === 'active' ? 'Actif' : 'Brouillon'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>Aucun laboratoire associé à cette classe.</p>
                )}
              </div>
              
              <div className="details-section">
                <h4>Étudiants</h4>
                {classStudents.length > 0 ? (
                  <div className="students-list">
                    {classStudents.map(student => (
                      <div key={student.id} className="student-item">
                        <div className="student-name">
                          {student.first_name} {student.last_name}
                        </div>
                        <div className="student-email">
                          {student.email}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>Aucun étudiant inscrit dans cette classe.</p>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ClassesPanel;
