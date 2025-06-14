import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import Input from '../common/Input';
import { authService } from '../../services/api';

const LoginForm = ({ onSuccess, onError }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
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
    
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }
    
    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        setLoading(true);
        
        // Call the login API
        const result = await authService.login({
          email: formData.email,
          password: formData.password
        });
        
        // If login successful
        if (result.success) {
          if (onSuccess) {
            onSuccess(result);
          }
          
          // Redirect based on user role
          const { role } = result.user;
          if (role === 'admin') {
            navigate('/admin/dashboard');
          } else if (role === 'teacher') {
            navigate('/teacher/dashboard');
          } else {
            navigate('/student/dashboard');
          }
        }
      } catch (error) {
        console.error('Login error:', error);
        setErrors({
          form: error.message || "Erreur de connexion. Veuillez réessayer."
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
        placeholder="Votre mot de passe"
        error={errors.password}
        required
      />
      
      <div className="form-group-inline">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
          />
          <span>Se souvenir de moi</span>
        </label>
        
        <Link to="/forgot-password" className="forgot-password">
          Mot de passe oublié?
        </Link>
      </div>
      
      <Button
        type="submit"
        disabled={loading}
        className="btn-primary btn-block"
      >
        {loading ? 'Connexion en cours...' : 'Se connecter'}
      </Button>
    </form>
  );
};

export default LoginForm;