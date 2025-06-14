import React, { useState, useEffect } from 'react';
import { FaTimes, FaCheck, FaBan, FaDownload } from 'react-icons/fa';
import apiServices from '../../../services/api';

const LabDetails = ({ labId, onClose, onStatusUpdate }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lab, setLab] = useState(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  
  useEffect(() => {
    const fetchLabDetails = async () => {
      try {
        setLoading(true);
        const response = await apiServices.admin.getLab(labId);
        setLab(response);
      } catch (err) {        console.error('Error fetching lab details:', err);
        setError('Échec du chargement des détails du laboratoire. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchLabDetails();
  }, [labId]);
  
  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };
  
  const handleStatusUpdate = async (status) => {
    try {
      setIsSubmitting(true);
      setError('');
      setSuccess('');
      
      await apiServices.admin.updateLabStatus(labId, {
        status,
        admin_comment: comment
      });
      
      // Update the local state
      setLab({ ...lab, status, admin_comment: comment });
        // Show success message
      setSuccess(`Le laboratoire a été ${status === 'approved' ? 'approuvé' : 'rejeté'} avec succès.`);
      
      // Notify parent component to update the list
      if (onStatusUpdate) {
        onStatusUpdate(labId, status);
      }
      
      // Auto close after a delay if approved
      if (status === 'approved') {
        setTimeout(() => onClose(), 2000);
      }    } catch (err) {
      console.error('Error updating lab status:', err);
      setError(`Échec de la mise à jour du statut du laboratoire. ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
    const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'approved':
        return 'status-badge approved';
      case 'rejected':
        return 'status-badge rejected';
      default:
        return 'status-badge pending';
    }
  };
  
  if (loading) {
    return (      <div className="modal-overlay">
        <div className="form-modal">
          <div className="loading-container">
            <div className="spinner"></div>
            Chargement des détails du laboratoire...
          </div>
        </div>
      </div>
    );
  }
  
  if (error && !lab) {
    return (      <div className="modal-overlay">
        <div className="form-modal">
          <div className="error-message">{error}</div>
          <div className="modal-actions">
            <button className="cancel-btn" onClick={onClose}>
              <FaTimes /> Fermer
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="modal-overlay">
      <div className="form-modal">        <div className="modal-header">
          <h2>Détails du laboratoire</h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <div className="lab-details">
          <div className="lab-header">
            <h3>{lab.title}</h3>
            <span className={getStatusBadgeClass(lab.status)}>
              {lab.status.charAt(0).toUpperCase() + lab.status.slice(1)}
            </span>
          </div>
            <div className="lab-meta">
            <div className="meta-item">
              <span className="meta-label">Soumis par:</span>
              <span className="meta-value">{lab.user?.first_name} {lab.user?.last_name}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Date de soumission:</span>
              <span className="meta-value">{formatDate(lab.created_at)}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Sujet:</span>
              <span className="meta-value">{lab.subject?.name || 'Non spécifié'}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Durée estimée:</span>
              <span className="meta-value">{lab.duration_hours} heures</span>
            </div>
          </div>
            <div className="lab-content">
            <h4>Description</h4>
            <div className="lab-description">
              {lab.description}
            </div>
            
            <h4>Objectifs d'apprentissage</h4>
            <div className="lab-objectives">
              {lab.objectives ? (
                <ul>
                  {lab.objectives.split('\n').map((objective, index) => (
                    objective.trim() ? <li key={index}>{objective}</li> : null
                  ))}
                </ul>
              ) : (
                <p>Aucun objectif d'apprentissage spécifié</p>
              )}
            </div>
              {lab.resources && (
              <>
                <h4>Ressources requises</h4>
                <div className="lab-resources">
                  {lab.resources}
                </div>
              </>
            )}
              {lab.files && lab.files.length > 0 && (
              <>
                <h4>Fichiers joints</h4>
                <div className="lab-files">
                  {lab.files.map((file, index) => (
                    <div key={index} className="file-item">
                      <span className="file-name">{file.name}</span>
                      <a href={file.url} download className="file-download">
                        <FaDownload /> Télécharger
                      </a>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
            {lab.admin_comment && (
            <div className="admin-feedback">
              <h4>Retour de l'administrateur</h4>
              <div className="feedback-content">
                {lab.admin_comment}
              </div>
            </div>
          )}
            {lab.status === 'pending' && (
            <div className="admin-actions">
              <h4>Décision d'évaluation</h4>
              <div className="form-group">
                <label htmlFor="admin_comment">Commentaire (optionnel pour l'approbation, obligatoire pour le rejet)</label>
                <textarea
                  id="admin_comment"
                  value={comment}
                  onChange={handleCommentChange}
                  placeholder="Fournir un commentaire sur cette demande de laboratoire..."
                  rows={4}
                  disabled={isSubmitting}
                ></textarea>
              </div>
                <div className="decision-buttons">
                <button
                  className="action-btn approve-btn"
                  onClick={() => handleStatusUpdate('approved')}
                  disabled={isSubmitting}
                >
                  <FaCheck /> Approuver le laboratoire
                </button>
                <button
                  className="action-btn reject-btn"
                  onClick={() => handleStatusUpdate('rejected')}
                  disabled={isSubmitting || comment.trim() === ''}
                >
                  <FaBan /> Rejeter le laboratoire
                </button>
              </div>
                {comment.trim() === '' && lab.status !== 'approved' && (
                <p className="form-help-text">
                  Un commentaire est requis lors du rejet d'une demande de laboratoire.
                </p>
              )}
            </div>
          )}
        </div>
          <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            <FaTimes /> Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default LabDetails;