import React, { useState } from 'react';
import './styles.css';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'student',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }

      // eslint-disable-next-line no-unused-vars
      const data = await response.json();
      setMessage('Inscription réussie ! Vous pouvez maintenant vous connecter.');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h1>Créer un compte</h1>
      {message && <p className="message-success">{message}</p>}
      {error && <p className="message-error">{error}</p>}
      <div className="form-group">
        <div className="form-field">
          <label>Prénom :</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-field">
          <label>Nom :</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-field">
          <label>Rôle :</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="student">Étudiant</option>
            <option value="teacher">Enseignant</option>
          </select>
        </div>
        <div className="form-field">
          <label>Email :</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-field">
          <label>Mot de passe :</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="auth-button" onClick={handleSubmit}>
          S'inscrire
        </button>
      </div>
    </div>
  );
};

export default Register;