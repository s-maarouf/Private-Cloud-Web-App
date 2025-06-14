import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave } from 'react-icons/fa';

const ClassForm = ({ classData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    capacity: 30,
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If editing an existing class, populate the form with its data
  useEffect(() => {
    if (classData) {

      setFormData({
        name: classData.name || '',
        description: classData.description || '',
        capacity: classData.capacity || 30,
      });
    }
  }, [classData]);

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
      errors.name = 'Le nom de la classe est requis';
    }

    if (formData.capacity < 1) {
      errors.capacity = 'Le minimum de capacité est 1';
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
      console.error('Error submitting class form:', error);
      setFormErrors(prev => ({
        ...prev,
        form: 'Une erreur est survenue lors de l\'enregistrement de la classe. Veuillez réessayer.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="form-modal">
        <h2>{classData ? 'Modifier la calsse' : 'Créer une nouvelle classe'}</h2>

        {formErrors.form && (
          <div className="error-message">
            {formErrors.form}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nom de la classe*</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Entrer le nom de la classe"
              disabled={isSubmitting}
            />
            {formErrors.name && <span className="field-error">{formErrors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              disabled={isSubmitting}
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group form-group-half">
              <label htmlFor="capacity">Capacité de la classe</label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                min={1}
                max={500}
                disabled={isSubmitting}
              />
              {formErrors.capacity && <span className="field-error">{formErrors.capacity}</span>}
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              <FaTimes /> Annuler
            </button>

            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              <FaSave /> {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClassForm;