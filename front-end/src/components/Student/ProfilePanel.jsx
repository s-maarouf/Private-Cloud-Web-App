import React, { useState } from 'react';
import studentService from '../../services/api/studentService';
import './ProfilePanel.css';

const ProfilePanel = ({ userData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: userData?.first_name || '',
    last_name: userData?.name || '',
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    // Check if passwords match for password change
    if (formData.new_password && formData.new_password !== formData.confirm_password) {
      setMessage({ text: 'Les mots de passe ne correspondent pas', type: 'error' });
      return;
    }

    try {
      // Prepare data for API call
      const updateData = {
        first_name: formData.first_name,
        last_name: formData.last_name
      };

      // Add password data if changing password
      if (formData.current_password && formData.new_password) {
        updateData.current_password = formData.current_password;
        updateData.new_password = formData.new_password;
      }

      // Call API to update profile
      const response = await studentService.updateProfile(updateData);
      
      if (response.success) {
        setMessage({ text: 'Profil mis à jour avec succès', type: 'success' });
        setIsEditing(false);
        // Reset password fields
        setFormData(prev => ({
          ...prev,
          current_password: '',
          new_password: '',
          confirm_password: ''
        }));
      } else {
        setMessage({ text: response.error || 'Erreur lors de la mise à jour du profil', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Erreur lors de la mise à jour du profil', type: 'error' });
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="profile-panel">
      <h2 className="panel-title">Mon Profil</h2>
      
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
      
      <div className="profile-card">
        {!isEditing ? (
          <>
            <div className="profile-info">
              <div className="info-group">
                <label>Prénom:</label>
                <span>{userData?.first_name}</span>
              </div>
              <div className="info-group">
                <label>Nom:</label>
                <span>{userData?.name}</span>
              </div>
              <div className="info-group">
                <label>Email:</label>
                <span>{userData?.email}</span>
              </div>
              <div className="info-group">
                <label>Rôle:</label>
                <span>Étudiant</span>
              </div>
            </div>
            <button 
              className="btn-edit" 
              onClick={() => setIsEditing(true)}
            >
              Modifier mon profil
            </button>
          </>
        ) : (
          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="first_name">Prénom:</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="last_name">Nom:</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
            
            <hr className="divider" />
            <h3>Changer de mot de passe</h3>
            
            <div className="form-group">
              <label htmlFor="current_password">Mot de passe actuel:</label>
              <input
                type="password"
                id="current_password"
                name="current_password"
                value={formData.current_password}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="new_password">Nouveau mot de passe:</label>
              <input
                type="password"
                id="new_password"
                name="new_password"
                value={formData.new_password}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirm_password">Confirmer le mot de passe:</label>
              <input
                type="password"
                id="confirm_password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-buttons">
              <button type="submit" className="btn-save">Enregistrer</button>
              <button 
                type="button" 
                className="btn-cancel"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    first_name: userData?.first_name || '',
                    last_name: userData?.name || '',
                    current_password: '',
                    new_password: '',
                    confirm_password: ''
                  });
                }}
              >
                Annuler
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfilePanel;
