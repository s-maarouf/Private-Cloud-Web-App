import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import Input from '../common/Input';
import { authService } from '../../services/api';

const RegisterForm = ({ onSuccess, onError }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student', // Default role
    acceptTerms: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = "Le prénom est requis";
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Le nom est requis";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }
    
    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 8) {
      newErrors.password = "Le mot de passe doit contenir au moins 8 caractères";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }
    
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "Vous devez accepter les conditions d'utilisation";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        setLoading(true);
        
        // Call the register API
        const result = await authService.register({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          password: formData.password,
          role: formData.role
        });
        
        // If registration successful
        if (result.success) {
          if (onSuccess) {
            onSuccess(result);
          }
          
          // Redirect to login page
          setTimeout(() => {
            navigate('/login', { 
              state: { 
                registrationSuccess: true,
                message: "Inscription réussie! Vous pouvez maintenant vous connecter." 
              } 
            });
          }, 1500);
        }
      } catch (error) {
        console.error('Registration error:', error);
        setErrors({
          form: error.message || "Erreur lors de l'inscription. Veuillez réessayer."
        });
        
        if (onError) {
          onError(error);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {errors.form && <div className="auth-error">{errors.form}</div>}
      
      <div className="form-row">
        <Input
          label="Prénom"
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="Votre prénom"
          error={errors.firstName}
          required
        />
        
        <Input
          label="Nom"
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Votre nom"
          error={errors.lastName}
          required
        />
      </div>
      
      <Input
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="votre@email.com"
        error={errors.email}
        required
      />
      
      <Input
        label="Mot de passe"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Créer un mot de passe"
        error={errors.password}
        required
      />
      
      <Input
        label="Confirmer le mot de passe"
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="Confirmer votre mot de passe"
        error={errors.confirmPassword}
        required
      />
      
      <div className="form-group">
        <label className="form-label">Je suis</label>
        <div className="radio-group">
          <label className="radio-label">
            <input
              type="radio"
              name="role"
              value="student"
              checked={formData.role === 'student'}
              onChange={handleChange}
            />
            <span>Étudiant</span>
          </label>
          
          <label className="radio-label">
            <input
              type="radio"
              name="role"
              value="teacher"
              checked={formData.role === 'teacher'}
              onChange={handleChange}
            />
            <span>Enseignant</span>
          </label>
        </div>
      </div>
      
      <Button
        type="submit"
        disabled={loading}
        className="btn-primary btn-block"
      >
        {loading ? "Inscription en cours..." : "S'inscrire"}
      </Button>
    </form>
  );
};

export default RegisterForm;