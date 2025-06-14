import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AuthPages.css';
import { FaArrowLeft } from 'react-icons/fa';
import apiServices from '../../services/api';

const Login = ({ setIsAuthenticated, setUserRole }) => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});

	const [error, setError] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

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

		// Basic validation
		if (!formData.email || !formData.password) {
			setError('Please fill in all fields');
			return;
		}

		try {
			setIsSubmitting(true);

			// Use the auth service to login
			const response = await apiServices.auth.login(formData);

			// Store the authentication token in localStorage
			localStorage.setItem('token', response.token);

			// Redirect to dashboard or home page after successful login
			localStorage.setItem('userRole', response.user.role);
				// Update authentication state in App.js
			setIsAuthenticated(true);
			setUserRole(response.user.role);

			// Redirect based on user role
			if (response.user.role === 'administrator') {
				navigate('/admin/dashboard');
			} else if (response.user.role === 'teacher') {
				navigate('/teacher/dashboard');
			} else if (response.user.role === 'student') {
				navigate('/student/dashboard');
			} else {
				navigate('/'); // Default redirect if role is not recognized
			}

		} catch (err) {
			console.error('Login error:', err);
			setError(err.message || 'Login failed. Please try again.');
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

        <h2 className="auth-title">Se connecter à la plateforme</h2>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Example form fields */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>
          <button type="submit" className="auth-button" disabled={isSubmitting}>
            {isSubmitting ? 'Connection en cours...' : 'Se connecter'}
          </button>
        </form>

        <div className="auth-footer">
          Vous n'avez pas un compte ? <Link to="/register" className="auth-link">Créez le</Link>
				</div>
			</div>
		</div>
	);
};

export default Login;
