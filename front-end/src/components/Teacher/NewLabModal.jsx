import React, { useState, useEffect } from 'react';
import { FaTimes, FaFlask, FaSpinner } from 'react-icons/fa';
import apiService from '../../services/api/teacherService'; // Corrected import
import { API_BASE_URL } from '../../services/api/config';
import './NewLabModal.css';

const NewLabModal = ({ onClose, onSubmit, classId, subjectId }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    subject_id: subjectId || null,
    status: 'pending'
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [subjects, setSubjects] = useState([]);
  
  // Fetch available subjects for this class if subjectId is not provided
  useEffect(() => {
    const fetchSubjects = async () => {
      if (!subjectId && classId) {
        try {          // Get class details to find available subjects
          const response = await fetch(`${API_BASE_URL}/class/${classId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          const data = await response.json();
          
          if (data && Array.isArray(data.subjects)) {
            setSubjects(data.subjects);
            // Set default subject if available
            if (data.subjects.length > 0) {
              setFormData(prev => ({
                ...prev,
                subject_id: data.subjects[0].id
              }));
            }
          }
        } catch (error) {
          console.error('Error fetching subjects:', error);
        }
      }
    };
    
    fetchSubjects();
  }, [classId, subjectId]);

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
    
    if (!formData.subject_id) {
      newErrors.subject_id = 'La matière est requise';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      setApiError(null);
      
      try {
        // Use the teacherService to create the lab
        const labData = {
          name: formData.name,
          description: formData.description,
          subject_id: parseInt(formData.subject_id),
          status: 'pending'
        };
        
        // Log the request data
        console.log('Lab creation request:', labData);
        
        // Call the service method
        const result = await apiService.createLabRequest(labData);
        console.log('Lab creation success:', result);
        
        // On success, call the onSubmit callback with the created lab
        if (result && result.lab_id) {
          // Create a complete lab object for the callback
          const createdLab = {
            id: result.lab_id,
            name: formData.name,
            description: formData.description,
            subject_id: parseInt(formData.subject_id),
            status: 'pending'
          };
          
          onSubmit(createdLab);
        } else {
          setApiError('Le laboratoire a été créé mais les données retournées sont incomplètes');
        }
      } catch (error) {
        console.error('Error creating lab:', error);
        setApiError(error.message || 'Une erreur est survenue lors de la création du laboratoire');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">        <div className="modal-header">
          <div className="modal-title">
            <FaFlask className="icon" />
            <h2>Créer un nouveau laboratoire</h2>
          </div>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        {apiError && (
          <div className="api-error">
            {apiError}
          </div>
        )}
        
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
              disabled={isLoading}
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
              disabled={isLoading}
            ></textarea>
            {errors.description && <div className="error-message">{errors.description}</div>}
          </div>
          
          {!subjectId && subjects.length > 0 && (
            <div className="form-group">
              <label htmlFor="subject_id">Matière *</label>
              <select
                id="subject_id"
                name="subject_id"
                value={formData.subject_id || ''}
                onChange={handleChange}
                className={errors.subject_id ? 'error' : ''}
                disabled={isLoading}
              >
                <option value="">Sélectionner une matière</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
              {errors.subject_id && <div className="error-message">{errors.subject_id}</div>}
            </div>
          )}

            <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button" 
              onClick={onClose}
              disabled={isLoading}
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <FaSpinner className="spinner-icon" /> 
                  Création en cours...
                </>
              ) : (
                'Soumettre pour création'
              )}
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
