import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave } from 'react-icons/fa';

const UserForm = ({ user, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      // Editing existing user
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '', // Fixed typo: name -> last_name
        email: user.email || '', // Fixed typo: username -> email
        password: '', // Don't pre-fill password
        role: user.role || 'student'
      });
    }
  }, [user]);
  const validate = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) newErrors.first_name = 'Le prénom est requis';
    if (!formData.last_name.trim()) newErrors.last_name = 'Le nom est requis';

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Le format d\'email est invalide';
    }

    if (!user && !formData.password.trim()) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (!user && formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit comporter au moins 8 caractères';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }

    // Clear API error when user makes any change
    if (apiError) {
      setApiError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setApiError('');

    // Validate form
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Prepare data for submission
    const userData = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      role: formData.role
    };

    // Only include password if it's provided or creating new user
    if (formData.password.trim()) {
      userData.password = formData.password;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(userData);
      // If successful, the parent component will likely close the form
    } catch (error) {
      console.error('Error submitting user form:', error); setApiError(error.message || 'Une erreur est survenue lors de l\'enregistrement de l\'utilisateur. Veuillez réessayer.');

      // Check for specific error types that might relate to form fields
      if (error.message?.toLowerCase().includes('email')) {
        setErrors(prev => ({
          ...prev,
          email: 'Cette adresse email est déjà utilisée'
        }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="form-modal">        <h2>{user ? 'Modifier l\'utilisateur' : 'Ajouter un nouvel utilisateur'}</h2>

        {apiError && (
          <div className="error-message">
            <FaTimes className="error-icon" />
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-row">
            <div className="form-group">              <label htmlFor="first_name">Prénom*</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.first_name && <span className="field-error">{errors.first_name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="last_name">Nom*</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.name}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.last_name && <span className="field-error">{errors.last_name}</span>}
            </div>
          </div>          <div className="form-group">
            <label htmlFor="email">Adresse Email*</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>          <div className="form-group">
            <label htmlFor="password">{user ? 'Mot de passe (laisser vide pour conserver l\'actuel)' : 'Mot de passe*'}</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={user ? "Laisser vide pour conserver le mot de passe actuel" : ""}
              disabled={isSubmitting}
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>          <div className="form-group">
            <label htmlFor="role">Rôle*</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              <option value="student">Étudiant</option>
              <option value="teacher">Enseignant</option>
              <option value="administrator">Administrateur</option>
            </select>
          </div>

          <div className="form-actions">
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
              <FaSave /> {isSubmitting ? 'Enregistrement...' : (user ? 'Mettre à jour' : 'Créer')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;