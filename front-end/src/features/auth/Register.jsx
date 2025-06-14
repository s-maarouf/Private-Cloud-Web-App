/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AuthPages.css';
import { FaUserPlus, FaArrowLeft } from 'react-icons/fa';
import apiServices from '../../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    role: 'student', // Default role
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic validation
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    try {
      setIsSubmitting(true);

      // Create payload object (excluding confirmPassword as it's not needed by the API)
      const payload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      };

      // Use the auth service to register
      const response = await apiServices.auth.register(payload);

      setSuccess('Inscription complete! Vous pouvez maintenant vous connecter.');

      // Redirect to login page after short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000); // 2 seconds delay

    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <Link to="/" className="back-link">
          <FaArrowLeft /> Retour à l'accueil
        </Link>

        <h2 className="auth-title">Créer votre compte</h2>
        <p className="auth-subtitle">Rejoignez votre plateforme virtuelle</p>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="first_name">Prènom*</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="Entrez votre prènom"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="last_name">Nom*</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Entrez votre nom"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="student">Étudiant</option>
              <option value="teacher">Enseignant</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="email">Adresse mail*</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Entrer votre email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe*</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Tapez votre mot de passe (min 8 charactères)"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmer le mot de passe*</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirmer votre mot de passe"
              required
            />
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              'Registering...'
            ) : (
              <>
                <FaUserPlus className="btn-icon" /> Créer un compte
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          Vous avez déjà un compte ? <Link to="/login" className="auth-link">Se connecter</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;