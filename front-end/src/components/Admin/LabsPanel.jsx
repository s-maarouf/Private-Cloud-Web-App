import React, { useState, useEffect } from 'react';
import { FaSearch, FaCheck, FaTimes, FaEye } from 'react-icons/fa';
import apiServices from '../../services/api';
import LabDetails from '../Admin/forms/LabDetails';

const LabsPanel = () => {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('pending');
  const [currentLab, setCurrentLab] = useState(null);
  const [showLabDetails, setShowLabDetails] = useState(false);

  const fetchLabs = async () => {
    try {
      setLoading(true);
      const response = await apiServices.admin.getLabs();
      setLabs(response.labs);
    } catch (err) {
      console.error('Erreur lors de la récupération des labs:', err);
      setError('Échec du chargement des labs. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabs();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  const filteredLabs = labs.filter(lab => {
    const matchesSearch = lab.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || lab.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleViewLab = (lab) => {
    setCurrentLab(lab);
    setShowLabDetails(true);
  };

  const handleApproveLab = async (labId) => {
    try {
      await apiServices.admin.updateLabStatus(labId, { status: 'approved' });
      fetchLabs();
    } catch (err) {
      console.error('Erreur lors de l\'approbation du lab:', err);
      setError('Échec de l\'approbation du lab. Veuillez réessayer.');
    }
  };

  const handleRejectLab = async (labId) => {
    try {
      await apiServices.admin.updateLabStatus(labId, { status: 'rejected' });
      fetchLabs();
    } catch (err) {
      console.error('Erreur lors du rejet du lab:', err);
      setError('Échec du rejet du lab. Veuillez réessayer.');
    }
  };

  if (loading) {
    return <div className="loading-container">Chargement des labs...</div>;
  }

  return (
    <div className="labs-panel">
      <div className="panel-header">
        <h1>Approbation des Labs</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="filter-controls">
        <div className="search-bar">
          <FaSearch />
          <input
            type="text"
            placeholder="Rechercher des labs..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="status-filter">
          <label htmlFor="status-filter">Filtrer par Statut:</label>
          <select
            id="status-filter"
            value={filterStatus}
            onChange={handleFilterChange}
          >
            <option value="all">Tous</option>
            <option value="pending">En attente</option>
            <option value="approved">Approuvé</option>
            <option value="rejected">Rejeté</option>
          </select>
        </div>
      </div>

      {showLabDetails && (
        <LabDetails
          lab={currentLab}
          onClose={() => setShowLabDetails(false)}
          onApprove={() => {
            handleApproveLab(currentLab.id);
            setShowLabDetails(false);
          }}
          onReject={() => {
            handleRejectLab(currentLab.id);
            setShowLabDetails(false);
          }}
        />
      )}

      <div className="labs-table-container">
        <table className="labs-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Sujet</th>
              <th>Créé par</th>
              <th>Date de création</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLabs.map(lab => (
              <tr key={lab.id} className={lab.status}>
                <td>{lab.id}</td>
                <td>{lab.name}</td>
                <td>{lab.subject_name}</td>
                <td>{lab.creator_name}</td>
                <td>{new Date(lab.creation_date).toLocaleDateString()}</td>
                <td>
                  <span className={`status-badge ${lab.status}`}>
                    {lab.status === 'pending' ? 'En attente' : 
                     lab.status === 'approved' ? 'Approuvé' : 'Rejeté'}
                  </span>
                </td>
                <td className="actions">
                  <button
                    className="view-btn"
                    onClick={() => handleViewLab(lab)}
                    title="Voir les détails du lab"
                  >
                    <FaEye />
                  </button>

                  {lab.status === 'pending' && (
                    <>
                      <button
                        className="approve-btn"
                        onClick={() => handleApproveLab(lab.id)}
                        title="Approuver le lab"
                      >
                        <FaCheck />
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => handleRejectLab(lab.id)}
                        title="Rejeter le lab"
                      >
                        <FaTimes />
                      </button>
                    </>
                  )}

                  {lab.status === 'rejected' && (
                    <button
                      className="approve-btn"
                      onClick={() => handleApproveLab(lab.id)}
                      title="Approuver le lab"
                    >
                      <FaCheck />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LabsPanel;