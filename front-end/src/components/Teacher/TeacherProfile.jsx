import React, { useState } from 'react';
import { FaEdit, FaLock } from 'react-icons/fa';
import apiService from '../../services/api/teacherService';

const TeacherProfile = ({ teacherData }) => {
  const [editing, setEditing] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [profileData, setProfileData] = useState({
    first_name: teacherData?.first_name || '',
    last_name: teacherData?.last_name || '',
    email: teacherData?.email || '',
    phone: teacherData?.phone || '',
    designation: teacherData?.designation || ''
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateProfileForm = () => {
    const newErrors = {};
    
    if (!profileData.first_name.trim()) {
      newErrors.first_name = 'Le prénom est requis';
    }
    
    if (!profileData.last_name.trim()) {
      newErrors.last_name = 'Le nom est requis';
    }
    
    if (!profileData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};
    
    if (!passwordData.current_password) {
      newErrors.current_password = 'Le mot de passe actuel est requis';
    }
    
    if (!passwordData.new_password) {
      newErrors.new_password = 'Le nouveau mot de passe est requis';
    } else if (passwordData.new_password.length < 8) {
      newErrors.new_password = 'Le mot de passe doit contenir au moins 8 caractères';
    }
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      newErrors.confirm_password = 'Les mots de passe ne correspondent pas';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (validateProfileForm()) {
      try {
        await apiService.updateProfile(profileData);
        setSuccessMessage('Profil mis à jour avec succès!');
        setEditing(false);
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } catch (error) {
        setErrors({
          form: 'Une erreur est survenue. Veuillez réessayer.'
        });
      }
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (validatePasswordForm()) {
      try {
        await apiService.updatePassword(passwordData);
        setSuccessMessage('Mot de passe changé avec succès!');
        setPasswordModal(false);
        setPasswordData({
          current_password: '',
          new_password: '',
          confirm_password: ''
        });
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } catch (error) {
        setErrors({
          password_form: 'Une erreur est survenue. Veuillez vérifier votre mot de passe actuel.'
        });
      }
    }
  };

  return (
    <div className="teacher-profile">
      <div className="profile-header">
        <h1>Profil enseignant</h1>
        {!editing && (
          <button className="edit-button" onClick={() => setEditing(true)}>
            <FaEdit />
            <span>Modifier le profil</span>
          </button>
        )}
      </div>

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      {errors.form && (
        <div className="error-message">
          {errors.form}
        </div>
      )}
      
      {!editing ? (
        <div className="profile-view">
          <div className="profile-section">
            <div className="profile-avatar">
              <div className="avatar-container">
                <img src="/avatar-placeholder.png" alt="Teacher Avatar" />
              </div>
              <h2>{teacherData?.first_name} {teacherData?.last_name}</h2>
              <p className="designation">{teacherData?.designation || 'Enseignant'}</p>
            </div>
            
            <div className="profile-info">
              <div className="info-group">
                <label>Email:</label>
                <p>{teacherData?.email}</p>
              </div>
              
              <div className="info-group">
                <label>Téléphone:</label>
                <p>{teacherData?.phone || 'Non renseigné'}</p>
              </div>
              
              <div className="info-group">
                <label>Date d'inscription:</label>
                <p>{teacherData?.created_at ? new Date(teacherData.created_at).toLocaleDateString() : 'Non disponible'}</p>
              </div>
            </div>
          </div>
          
          <div className="profile-actions">
            <button className="password-button" onClick={() => setPasswordModal(true)}>
              <FaLock />
              <span>Changer le mot de passe</span>
            </button>
          </div>
        </div>
      ) : (
        <form className="profile-form" onSubmit={handleProfileSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="first_name">Prénom *</label>
              <input 
                type="text" 
                id="first_name"
                name="first_name"
                value={profileData.first_name}
                onChange={handleProfileChange}
                className={errors.first_name ? 'error' : ''}
              />
              {errors.first_name && <div className="error-message">{errors.first_name}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="last_name">Nom *</label>
              <input 
                type="text" 
                id="last_name"
                name="last_name"
                value={profileData.last_name}
                onChange={handleProfileChange}
                className={errors.last_name ? 'error' : ''}
              />
              {errors.last_name && <div className="error-message">{errors.last_name}</div>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input 
                type="email" 
                id="email"
                name="email"
                value={profileData.email}
                onChange={handleProfileChange}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Téléphone</label>
              <input 
                type="tel" 
                id="phone"
                name="phone"
                value={profileData.phone}
                onChange={handleProfileChange}
              />
            </div>
          </div>
          
          <div className="form-group full-width">
            <label htmlFor="designation">Désignation</label>
            <input 
              type="text" 
              id="designation"
              name="designation"
              value={profileData.designation}
              onChange={handleProfileChange}
              placeholder="Par exemple: Professeur de Mathématiques"
            />
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={() => setEditing(false)}>
              Annuler
            </button>
            <button type="submit" className="submit-button">
              Enregistrer les modifications
            </button>
          </div>
        </form>
      )}
      
      {passwordModal && (
        <div className="modal-overlay">
          <div className="modal-container password-modal">
            <div className="modal-header">
              <h2>Changer le mot de passe</h2>
              <button className="close-button" onClick={() => setPasswordModal(false)}>
              </button>
            </div>
            
            {errors.password_form && (
              <div className="error-message">
                {errors.password_form}
              </div>
            )}
            
            <form onSubmit={handlePasswordSubmit} className="password-form">
              <div className="form-group">
                <label htmlFor="current_password">Mot de passe actuel *</label>
                <input 
                  type="password" 
                  id="current_password"
                  name="current_password"
                  value={passwordData.current_password}
                  onChange={handlePasswordChange}
                  className={errors.current_password ? 'error' : ''}
                />
                {errors.current_password && <div className="error-message">{errors.current_password}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="new_password">Nouveau mot de passe *</label>
                <input 
                  type="password" 
                  id="new_password"
                  name="new_password"
                  value={passwordData.new_password}
                  onChange={handlePasswordChange}
                  className={errors.new_password ? 'error' : ''}
                />
                {errors.new_password && <div className="error-message">{errors.new_password}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="confirm_password">Confirmer le mot de passe *</label>
                <input 
                  type="password" 
                  id="confirm_password"
                  name="confirm_password"
                  value={passwordData.confirm_password}
                  onChange={handlePasswordChange}
                  className={errors.confirm_password ? 'error' : ''}
                />
                {errors.confirm_password && <div className="error-message">{errors.confirm_password}</div>}
              </div>
              
              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={() => setPasswordModal(false)}>
                  Annuler
                </button>
                <button type="submit" className="submit-button">
                  Changer le mot de passe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherProfile;
