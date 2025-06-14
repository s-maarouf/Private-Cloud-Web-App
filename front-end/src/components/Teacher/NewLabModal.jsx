import React, { useState } from 'react';
import { FaTimes, FaFlask } from 'react-icons/fa';

const NewLabModal = ({ onClose, onSubmit, classId }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    objectives: '',
    requirements: '',
    classId: classId
  });
  
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du laboratoire est requis';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <div className="modal-title">
            <FaFlask className="icon" />
            <h2>Créer un nouveau laboratoire</h2>
          </div>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="lab-form">
          <div className="form-group">
            <label htmlFor="name">Nom du laboratoire *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <div className="error-message">{errors.name}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className={errors.description ? 'error' : ''}
            ></textarea>
            {errors.description && <div className="error-message">{errors.description}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="objectives">Objectifs pédagogiques</label>
            <textarea
              id="objectives"
              name="objectives"
              value={formData.objectives}
              onChange={handleChange}
              rows={3}
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="requirements">Prérequis techniques</label>
            <textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows={3}
            ></textarea>
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="submit-button">
              Soumettre pour création
            </button>
          </div>
        </form>
        
        <div className="modal-footer">
          <p className="info-text">
            * Note: Les demandes de création de laboratoire sont soumises à l'administrateur pour approbation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewLabModal;
