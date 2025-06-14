import React, { useState, useEffect } from 'react';
import { FaFlask, FaArrowLeft, FaPlus, FaSearch } from 'react-icons/fa';
import apiService from '../../services/api/teacherService';
import NewLabModal from './NewLabModal';

const LabsPanel = ({ classData }) => {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [showNewLabModal, setShowNewLabModal] = useState(false);

  useEffect(() => {
    const fetchLabs = async () => {
      if (!classData || !classData.id) {
        setError('No class selected');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const labsData = await apiService.getClassLabs(classData.id);
        setLabs(labsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching labs:', err);
        setError('Failed to load laboratories data');
        setLoading(false);
      }
    };

    fetchLabs();
  }, [classData]);

  const filteredLabs = labs.filter(lab => 
    lab.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lab.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewLab = (labData) => {
    // In a real app, this would make an API call
    console.log('Creating new lab request:', labData);
    setShowNewLabModal(false);
    // After successful creation, you might want to show a success message
  };

  if (!classData) {
    return (
      <div className="no-data-message">
        <FaFlask size={48} />
        <p>Veuillez sélectionner une classe pour voir ses laboratoires.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement des laboratoires...</p>
      </div>
    );
  }

  return (
    <div className="labs-panel">
      <div className="panel-header">
        <div className="header-left">
          <button className="back-button">
            <FaArrowLeft />
            <span>Retour aux classes</span>
          </button>
          <h1>Laboratoires: {classData.name}</h1>
        </div>
        <div className="header-actions">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher un laboratoire..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button 
            className="new-lab-button"
            onClick={() => setShowNewLabModal(true)}
          >
            <FaPlus />
            <span>Créer un nouveau labo</span>
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {filteredLabs.length === 0 && !loading && !error && (
        <div className="no-data-message">
          <FaFlask size={48} />
          <p>
            {searchTerm 
              ? 'Aucun laboratoire ne correspond à votre recherche.' 
              : 'Aucun laboratoire pour cette classe. Créez-en un nouveau!'}
          </p>
        </div>
      )}

      <div className="labs-grid">
        {filteredLabs.map(lab => (
          <div 
            className="lab-card" 
            key={lab.id}
          >
            <div className="lab-card-header">
              <h3>{lab.name}</h3>
              <span className={`lab-status ${lab.status}`}>
                {lab.status === 'active' ? 'Actif' : 
                 lab.status === 'pending' ? 'En attente' : 
                 lab.status === 'completed' ? 'Terminé' : 'Indéfini'}
              </span>
            </div>
            <div className="lab-card-body">
              <p>{lab.description || 'Aucune description disponible.'}</p>
            </div>
            <div className="lab-card-footer">
              <div className="completion-info">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{width: `${lab.completion_rate || 0}%`}}
                  ></div>
                </div>
                <span>{lab.completion_rate || 0}% complété</span>
              </div>
              <button className="view-button">Détails</button>
            </div>
          </div>
        ))}
      </div>

      {showNewLabModal && (
        <NewLabModal 
          onClose={() => setShowNewLabModal(false)} 
          onSubmit={handleNewLab}
          classId={classData.id}
        />
      )}
    </div>
  );
};

export default LabsPanel;
