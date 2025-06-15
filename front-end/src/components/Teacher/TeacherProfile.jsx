import React, { useState, useEffect } from 'react';
import { FaEdit, FaLock, FaUser } from 'react-icons/fa';
import apiService from '../../services/api/teacherService';
// Import the image directly
import teacherAvatar from '../../components/images/MenAvatar.jpg';
// Import CSS for styling
import './TeacherProfile.css';

const TeacherProfile = ({ teacherData }) => {
	// Handle API response format - data may be in user object
	const userData = teacherData?.user || teacherData || {};

	const [editing, setEditing] = useState(false);
	const [passwordModal, setPasswordModal] = useState(false);
	const [profileData, setProfileData] = useState({
		first_name: userData?.first_name || '',
		last_name: userData?.name || '', // API uses 'name' for last name
		email: userData?.email || '',
		designation: userData?.designation || ''
	});

	// Update profile data when teacherData changes
	useEffect(() => {
		if (userData && Object.keys(userData).length > 0) {
			setProfileData(prevData => ({
				...prevData,
				first_name: userData.first_name || prevData.first_name,
				last_name: userData.name || prevData.last_name, // API uses 'name' for last name
				email: userData.email || prevData.email,
			}));
		}
	}, [userData]);
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
				// Adapt profile data to match the API expectations
				const dataToSend = {
					first_name: profileData.first_name,
					last_name: profileData.last_name, // API will store as 'name'
					email: profileData.email,
				};


				if (profileData.designation) {
					dataToSend.designation = profileData.designation;
				}

				await apiService.updateProfile(dataToSend);
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
					<div className="profile-section"> <div className="profile-avatar"> <div className="avatar-container">
						{teacherAvatar ? (
							<img 
								src={teacherAvatar} 
								alt="Teacher Avatar"
								className="profile-image"
								onError={(e) => {
									e.target.onerror = null; 
									e.target.classList.add('error');
									e.target.parentNode.appendChild(
										Object.assign(document.createElement('div'), {
											className: 'avatar-fallback',
											innerHTML: '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="user" class="svg-inline--fa fa-user fa-w-14 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style="width: 40px; height: 40px;"><path fill="currentColor" d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path></svg>'
										})
									);
								}}
							/>
						) : (
							<div className="avatar-fallback">
								<FaUser size={40} />
							</div>
						)}
						</div>
						<h2>{userData?.first_name} {userData?.name}</h2>
						<p className="designation">{userData?.role === 'teacher' ? 'Enseignant' : userData?.designation || 'Utilisateur'}</p>
						</div>
							<div className="profile-info">
							<div className="info-group">
								<label>Email:</label>
								<p>{userData?.email}</p>
							</div>


							<div className="info-group">
								<label>Rôle:</label>
								<p>{userData?.role === 'teacher' ? 'Enseignant' : userData?.role || 'Non défini'}</p>
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
