import React, { useState } from 'react';
import { FaSave, FaKey, FaUserEdit, FaEnvelope, FaIdCard, FaUserTie } from 'react-icons/fa';
import apiServices from '../../services/api';

const TeacherProfile = ({ teacherInfo }) => {
	const [profileData, setProfileData] = useState({
		first_name: teacherInfo?.first_name || '',
		last_name: teacherInfo?.last_name || '',
		email: teacherInfo?.email || '',
		current_password: '',
		new_password: '',
		confirm_password: ''
	});

	const [errors, setErrors] = useState({});
	const [success, setSuccess] = useState('');
	const [loading, setLoading] = useState(false);
	const [editMode, setEditMode] = useState(false);
	const [changePassword, setChangePassword] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setProfileData(prev => ({ ...prev, [name]: value }));

		// Effacer l'erreur et le message de succès lors de la modification
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
    
    if (success) {
      setSuccess('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (editMode) {
      if (!profileData.first_name.trim()) {
        newErrors.first_name = "Le prénom est requis";
      }
      
      if (!profileData.last_name.trim()) {
        newErrors.last_name = "Le nom est requis";
      }
      
      if (!profileData.email.trim()) {
        newErrors.email = "L'email est requis";
      } else if (!/^\S+@\S+\.\S+$/.test(profileData.email)) {
        newErrors.email = "Le format d'email est invalide";
      }
    }
    
    if (changePassword) {
      if (!profileData.current_password) {
        newErrors.current_password = "Le mot de passe actuel est requis";
      }
      
      if (!profileData.new_password) {
        newErrors.new_password = "Le nouveau mot de passe est requis";
      } else if (profileData.new_password.length < 8) {
        newErrors.new_password = "Le mot de passe doit comporter au moins 8 caractères";
      }
      
      if (profileData.new_password !== profileData.confirm_password) {
        newErrors.confirm_password = "Les mots de passe ne correspondent pas";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setSuccess('');
      
      const dataToSend = {};
      
      if (editMode) {
        dataToSend.first_name = profileData.first_name;
        dataToSend.last_name = profileData.last_name;
        dataToSend.email = profileData.email;
      }
      
      if (changePassword) {
        dataToSend.current_password = profileData.current_password;
        dataToSend.new_password = profileData.new_password;
      }
      
      await apiServices.teacher.updateProfile(dataToSend);
      
      setSuccess("Votre profil a été mis à jour avec succès");
      
      // Réinitialiser les champs de mot de passe
      if (changePassword) {
        setProfileData(prev => ({
          ...prev,
          current_password: '',
          new_password: '',
          confirm_password: ''
        }));
      }
      
      // Désactiver les modes d'édition
			setEditMode(false);
			setChangePassword(false);

		} catch (err) {
			console.error('Erreur lors de la mise à jour du profil:', err);
			setErrors(prev => ({
				...prev,
				form: err.message || 'Une erreur est survenue lors de la mise à jour du profil'
			}));
		} finally {
			setLoading(false);
		}
	};

	const toggleEditMode = () => {
		setEditMode(!editMode);

		// Réinitialiser les erreurs
		setErrors({});

		// Réinitialiser le message de succès
		if (success) {
			setSuccess('');
		}
	};

	const toggleChangePassword = () => {
		setChangePassword(!changePassword);

		// Réinitialiser les erreurs
		setErrors({});

		// Réinitialiser le message de succès
		if (success) {
			setSuccess('');
		}
	};

	return (
		<div className="openstack-profile">
			<div className="openstack-profile-header">
				<h2>Mon Profil Enseignant</h2>

				<div className="openstack-profile-actions">
					<button 
						className={`openstack-toggle-btn ${editMode ? 'active' : ''}`}
						onClick={toggleEditMode}
					>
						<FaUserEdit /> {editMode ? 'Annuler' : 'Modifier mon Profil'}
					</button>

					<button 
						className={`openstack-toggle-btn ${changePassword ? 'active' : ''}`}
						onClick={toggleChangePassword}
					>
						<FaKey /> {changePassword ? 'Annuler' : 'Changer de Mot de Passe'}
					</button>
				</div>
			</div>

			{errors.form && <div className="openstack-error">{errors.form}</div>}
			{success && <div className="openstack-success">{success}</div>}

			<form onSubmit={handleSubmit} className="openstack-profile-form">
				<div className="openstack-profile-section">
					<div className="openstack-section-header">
						<FaIdCard /> Informations Personnelles
					</div>

					<div className="openstack-form-row">
						<div className="openstack-form-group">
							<label htmlFor="first_name">Prénom</label>
							<input
								type="text"
								id="first_name"
								name="first_name"
								value={profileData.first_name}
								onChange={handleChange}
								disabled={!editMode}
								className={!editMode ? 'openstack-disabled' : ''}
							/>
							{errors.first_name && <span className="openstack-field-error">{errors.first_name}</span>}
						</div>

						<div className="openstack-form-group">
							<label htmlFor="last_name">Nom</label>
							<input
								type="text"
								id="last_name"
								name="last_name"
								value={profileData.last_name}
								onChange={handleChange}
								disabled={!editMode}
								className={!editMode ? 'openstack-disabled' : ''}
							/>
							{errors.last_name && <span className="openstack-field-error">{errors.last_name}</span>}
						</div>
					</div>
				</div>

				<div className="openstack-profile-section">
					<div className="openstack-section-header">
						<FaEnvelope /> Contact
					</div>

					<div className="openstack-form-group">
						<label htmlFor="email">Email</label>
						<input
							type="email"
							id="email"
							name="email"
							value={profileData.email}
							onChange={handleChange}
							disabled={!editMode}
							className={!editMode ? 'openstack-disabled' : ''}
						/>
						{errors.email && <span className="openstack-field-error">{errors.email}</span>}
					</div>
				</div>

				<div className="openstack-profile-section">
					<div className="openstack-section-header">
						<FaUserTie /> Statut
					</div>

					<div className="openstack-form-group">
						<label>Rôle</label>
						<input
							type="text"
							value="Enseignant"
							disabled
							className="openstack-disabled"
						/>
					</div>
				</div>

				{changePassword && (
					<div className="openstack-profile-section">
						<div className="openstack-section-header">
							<FaKey /> Changer de Mot de Passe
						</div>

						<div className="openstack-form-group">
							<label htmlFor="current_password">Mot de Passe Actuel</label>
							<input
								type="password"
								id="current_password"
								name="current_password"
								value={profileData.current_password}
								onChange={handleChange}
							/>
							{errors.current_password && <span className="openstack-field-error">{errors.current_password}</span>}
						</div>

						<div className="openstack-form-row">
							<div className="openstack-form-group">
								<label htmlFor="new_password">Nouveau Mot de Passe</label>
								<input
									type="password"
									id="new_password"
									name="new_password"
									value={profileData.new_password}
									onChange={handleChange}
								/>
								{errors.new_password && <span className="openstack-field-error">{errors.new_password}</span>}
							</div>

							<div className="openstack-form-group">
								<label htmlFor="confirm_password">Confirmer le Mot de Passe</label>
								<input
									type="password"
									id="confirm_password"
									name="confirm_password"
									value={profileData.confirm_password}
									onChange={handleChange}
								/>
								{errors.confirm_password && <span className="openstack-field-error">{errors.confirm_password}</span>}
							</div>
						</div>
					</div>
				)}

				{(editMode || changePassword) && (
					<div className="openstack-form-actions">
						<button 
							type="submit" 
							className="openstack-submit-btn"
							disabled={loading}
						>
							{loading ? (
								<>
									<div className="openstack-button-spinner"></div> Enregistrement...
								</>
							) : (
								<>
									<FaSave /> Enregistrer les Modifications
								</>
							)}
						</button>
					</div>
				)}
			</form>
		</div>
	);
};

export default TeacherProfile;
