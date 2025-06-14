import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave } from 'react-icons/fa';

const SubjectForm = ({ subjectData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If editing an existing subject, populate the form with its data
  useEffect(() => {
    if (subjectData) {
      setFormData({
        name: subjectData.name || '',
        description: subjectData.description || '',
      });
    }
  }, [subjectData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // For checkbox inputs, use the checked property
    const val = type === 'checkbox' ? checked : value;

    // For number inputs, convert to number
    const finalValue = type === 'number' ? parseInt(val, 10) : val;

    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));

    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Le nom du sujet est requis';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting subject form:', error); setFormErrors(prev => ({
        ...prev,
        form: 'Échec de l\'enregistrement du sujet. Veuillez réessayer.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="modal-overlay">
      <div className="form-modal">        <h2>{subjectData ? 'Modifier le sujet' : 'Créer un nouveau sujet'}</h2>

        {formErrors.form && (
          <div className="error-message">
            {formErrors.form}
          </div>
        )}

        <form onSubmit={handleSubmit}>          <div className="form-group">
          <label htmlFor="name">Nom du sujet*</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Entrer le nom du sujet"
            disabled={isSubmitting}
          />
          {formErrors.name && <span className="field-error">{formErrors.name}</span>}
        </div>          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Entrer la description du sujet"
              rows={4}
              disabled={isSubmitting}
            ></textarea>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onCancel}
              disabled={isSubmitting}
            >              <FaTimes /> Annuler
            </button>

            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              <FaSave /> {isSubmitting ? 'Enregistrement...' : 'Enregistrer le sujet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubjectForm;