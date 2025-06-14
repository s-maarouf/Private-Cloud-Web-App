import React, { useState, useEffect } from 'react';
import { FaSearch, FaPlus, FaEye, FaFlask } from 'react-icons/fa';
import apiServices from '../../services/api';
import { useNavigate } from 'react-router-dom';
import ClassDetails from './ClassDetails';
import CreateLab from './CreateLab';

const ClassesList = ({ teacherId }) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);
  const [showCreateLab, setShowCreateLab] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Récupérer les classes associées à cet enseignant
        const response = await apiServices.teacher.getAssignedClasses(teacherId);
        setClasses(response.classes || response);
        
      } catch (err) {
        console.error('Erreur lors du chargement des classes:', err);
        setError('Impossible de charger vos classes. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchClasses();
  }, [teacherId]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredClasses = classes.filter(classItem => 
    classItem.name.toLowerCase().includes(searchTerm) || 
    (classItem.description && classItem.description.toLowerCase().includes(searchTerm))
  );

  const handleViewClass = (classItem) => {
    setSelectedClass(classItem);
  };

  const handleBackToList = () => {
    setSelectedClass(null);
  };

  const handleCreateLab = () => {
    setShowCreateLab(true);
  };

  const handleLabCreationSuccess = () => {
    setShowCreateLab(false);
    // Afficher un message de succès ou rafraîchir les données si nécessaire
  };

  if (loading) {
    return (
      <div className="openstack-loading">
        <div className="spinner"></div>
        <p>Chargement des classes...</p>
      </div>
    );
  }

  if (selectedClass) {
    return (
      <ClassDetails 
        classData={selectedClass} 
        onBack={handleBackToList} 
        onCreateLab={handleCreateLab}
      />
    );
  }

  if (showCreateLab) {
    return (
      <CreateLab 
        teacherId={teacherId} 
        onSuccess={handleLabCreationSuccess} 
        onCancel={() => setShowCreateLab(false)}
        preselectedClass={selectedClass}
      />
    );
  }

  return (
    <div className="openstack-classes-list">
      <div className="openstack-classes-header">
        <h2>Mes Classes et Groupes</h2>
        <button className="openstack-create-lab-btn" onClick={handleCreateLab}>
          <FaFlask /> Créer un Nouveau Laboratoire
        </button>
      </div>

      <div className="openstack-search-bar">
        <FaSearch />
        <input 
          type="text" 
          placeholder="Rechercher une classe..." 
          value={searchTerm} 
          onChange={handleSearchChange}
        />
      </div>

      {error && <div className="openstack-error">{error}</div>}

      {classes.length === 0 ? (
        <div className="openstack-no-classes">
          <p>Vous n'êtes actuellement assigné à aucune classe ou groupe.</p>
        </div>
      ) : (
        <div className="openstack-classes-grid">
          {filteredClasses.map(classItem => (
            <div key={classItem.id} className="openstack-class-card">
              <div className="openstack-class-header">
                <h3>{classItem.name}</h3>
                <span className="openstack-class-id">ID: {classItem.id}</span>
              </div>
              
              <div className="openstack-class-meta">
                <div className="openstack-meta-item">
                  <span className="openstack-meta-label">Matières:</span>
                  <span className="openstack-meta-value">{classItem.subjects_count || 0}</span>
                </div>
                <div className="openstack-meta-item">
                  <span className="openstack-meta-label">Étudiants:</span>
                  <span className="openstack-meta-value">{classItem.students_count || 0}</span>
                </div>
                <div className="openstack-meta-item">
                  <span className="openstack-meta-label">Laboratoires:</span>
                  <span className="openstack-meta-value">{classItem.labs_count || 0}</span>
                </div>
              </div>
              
              {classItem.description && (
                <div className="openstack-class-description">
                  <p>{classItem.description}</p>
                </div>
              )}
              
              <div className="openstack-class-actions">
                <button 
                  className="openstack-view-btn" 
                  onClick={() => handleViewClass(classItem)}
                >
                  <FaEye /> Voir les Détails
                </button>
              </div>
            </div>
          ))}

          {filteredClasses.length === 0 && (
            <div className="openstack-no-results">
              <p>Aucune classe ne correspond à votre recherche.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClassesList;