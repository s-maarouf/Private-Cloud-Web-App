import React, { useState } from 'react';
import './ProfilePanel.css';

const ProfilePanel = ({ teacher }) => {
  const [formData, setFormData] = useState({
    first_name: teacher?.first_name || '',
    last_name: teacher?.last_name || '',
    email: teacher?.email || '',
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    
    try {
      setError(null);
      setIsSubmitting(true);
      
      // Validation
      if (!formData.first_name || !formData.last_name || !formData.email) {
        setError('Veuillez remplir tous les champs obligatoires.');
        setIsSubmitting(false);
        return;
      }
      
      // Using the PUT /user/{user_id} endpoint to update user data
      const response = await fetch(`/api/user/${teacher.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          role: 'teacher' // Ensure the role remains teacher
        })
      });
      
      if (!response.ok) {
        throw new Error(`Erreur serveur: ${response.status}`);
      }
      
      // Get the updated user data
      const updatedUserResponse = await fetch(`/api/user/${teacher.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (updatedUserResponse.ok) {
        const updatedUser = await updatedUserResponse.json();
        
        // Update locally stored user data
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      setSuccess('Profil mis à jour avec succès.');
      setIsEditing(false);
    } catch (err) {
      setError("Erreur lors de la mise à jour du profil. Veuillez réessayer.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    try {
      setError(null);
      setIsSubmitting(true);
      
      // Validation
      if (!formData.current_password || !formData.new_password || !formData.confirm_password) {
        setError('Veuillez remplir tous les champs obligatoires.');
        setIsSubmitting(false);
        return;
      }
      
      if (formData.new_password !== formData.confirm_password) {
        setError('Les nouveaux mots de passe ne correspondent pas.');
        setIsSubmitting(false);
        return;
      }
      
      if (formData.new_password.length < 8) {
        setError('Le nouveau mot de passe doit contenir au moins 8 caractères.');
        setIsSubmitting(false);
        return;
      }
      
      // Note: The API doesn't have a specific endpoint for password changes.
      // We'll use the user update endpoint with both the current profile data and the new password.
      // This approach assumes the backend can handle password updates via the regular update endpoint.
      // If this is not the case, additional backend changes would be needed.
      
      const response = await fetch(`/api/user/${teacher.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          // Include all current user data
          first_name: teacher.first_name,
          last_name: teacher.last_name,
          email: teacher.email,
          role: 'teacher',
          // Add password information
          current_password: formData.current_password,
          new_password: formData.new_password
        })
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Le mot de passe actuel est incorrect.');
        } else {
          throw new Error(`Erreur serveur: ${response.status}`);
        }
      }
      
      setSuccess('Mot de passe mis à jour avec succès.');
      setIsChangingPassword(false);
      setFormData({
        ...formData,
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
    } catch (err) {
      setError(err.message || "Erreur lors de la mise à jour du mot de passe. Veuillez réessayer.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!teacher) {
    return <div className="openstack-loading">Chargement du profil...</div>;
  }

  return (
    <div className="profile-panel">
      <h2>Mon Profil</h2>
      
      {error && <div className="profile-error">{error}</div>}
      {success && <div className="profile-success">{success}</div>}
      
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {/* Utiliser les initiales si pas d'avatar */}
            {teacher.first_name && teacher.last_name ? (
              `${teacher.first_name[0]}${teacher.last_name[0]}`
            ) : 'EP'}
          </div>
          <div className="profile-info">
            <h3>{teacher.first_name} {teacher.last_name}</h3>
            <p className="teacher-role">Enseignant</p>
            <p className="teacher-email">{teacher.email}</p>
          </div>
        </div>
        
        <div className="profile-details">
          {!isEditing ? (
            <>
              <div className="info-group">
                <label>Prénom:</label>
                <div className="info-value">{teacher.first_name}</div>
              </div>
              
              <div className="info-group">
                <label>Nom:</label>
                <div className="info-value">{teacher.last_name}</div>
              </div>
              
              <div className="info-group">
                <label>Email:</label>
                <div className="info-value">{teacher.email}</div>
              </div>
              
              <div className="profile-actions">
                <button 
                  className="edit-btn"
                  onClick={() => setIsEditing(true)}
                >
                  Modifier mon profil
                </button>
                
                <button 
                  className="password-btn"
                  onClick={() => setIsChangingPassword(true)}
                >
                  Changer mot de passe
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmitProfile} className="profile-form">
              <div className="form-group">
                <label>Prénom:</label>
                <input 
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="form-group">
                <label>Nom:</label>
                <input 
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="form-group">
                <label>Email:</label>
                <input 
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setIsEditing(false)}
                  disabled={isSubmitting}
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="save-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      
      {isChangingPassword && (
        <div className="password-modal">
          <div className="modal-content">
            <h3>Changer de mot de passe</h3>
            
            <form onSubmit={handleChangePassword} className="password-form">
              <div className="form-group">
                <label>Mot de passe actuel:</label>
                <input 
                  type="password"
                  name="current_password"
                  value={formData.current_password}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="form-group">
                <label>Nouveau mot de passe:</label>
                <input 
                  type="password"
                  name="new_password"
                  value={formData.new_password}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="form-group">
                <label>Confirmer le nouveau mot de passe:</label>
                <input 
                  type="password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setIsChangingPassword(false)}
                  disabled={isSubmitting}
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="save-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Modification...' : 'Modifier le mot de passe'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePanel;
