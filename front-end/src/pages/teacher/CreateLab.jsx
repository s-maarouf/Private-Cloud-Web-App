import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave, FaCloudUploadAlt, FaTrash } from 'react-icons/fa';
import apiServices from '../../services/api';

const CreateLab = ({ teacherId, onSuccess, onCancel, preselectedClass = null }) => {
	const [formData, setFormData] = useState({
		title: '',
		description: '',
		objectives: '',
		duration_hours: 2,
		resources: '',
		subject_id: '',
		class_id: preselectedClass ? preselectedClass.id : ''
	});

	const [files, setFiles] = useState([]);
	const [errors, setErrors] = useState({});
	const [subjects, setSubjects] = useState([]);
	const [classes, setClasses] = useState([]);
	const [loading, setLoading] = useState(false);
	const [loadingData, setLoadingData] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoadingData(true);

				// Récupérer les matières assignées à l'enseignant
        const subjectsResponse = await apiServices.teacher.getAssignedSubjects(teacherId);
        setSubjects(subjectsResponse.subjects || subjectsResponse || []);
        
        // Récupérer les classes assignées à l'enseignant
				const classesResponse = await apiServices.teacher.getAssignedClasses(teacherId);
				setClasses(classesResponse.classes || classesResponse || []);

			} catch (err) {
				console.error('Erreur lors du chargement des données:', err);
			} finally {
				setLoadingData(false);
			}
		};

		fetchData();
	}, [teacherId]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));

		// Effacer l'erreur lors de la modification
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Le titre du laboratoire est requis";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "La description du laboratoire est requise";
    }
    
    if (!formData.subject_id) {
      newErrors.subject_id = "Veuillez sélectionner une matière";
    }
    
    if (!formData.class_id) {
      newErrors.class_id = "Veuillez sélectionner une classe";
    }
    
    if (formData.duration_hours < 1) {
      newErrors.duration_hours = "La durée minimale est de 1 heure";
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
      
      // Créer un FormData pour gérer les fichiers
      const formDataToSend = new FormData();
      
      // Ajouter les champs du formulaire
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      
      // Ajouter l'ID de l'enseignant
      formDataToSend.append('teacher_id', teacherId);
      
      // Ajouter les fichiers
      files.forEach(file => {
        formDataToSend.append('files', file);
      });
      
      // Envoyer la demande
      await apiServices.teacher.createLabRequest(formDataToSend);
      
      // Notifier le succès
      onSuccess();
      
    } catch (err) {
      console.error('Erreur lors de la création du laboratoire:', err);
      setErrors(prev => ({
        ...prev,
        form: err.message || 'Une erreur est survenue lors de la création du laboratoire'
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="openstack-create-lab">
      <div className="openstack-form-header">
        <h2>Créer un Nouveau Laboratoire</h2>
        <button className="openstack-close-btn" onClick={onCancel}>
          <FaTimes />
        </button>
      </div>

      {loadingData ? (
        <div className="openstack-loading">
          <div className="spinner"></div>
          <p>Chargement des données...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="openstack-lab-form">
          {errors.form && (
            <div className="openstack-error">{errors.form}</div>
          )}

          <div className="openstack-form-group">
            <label htmlFor="title">Titre du Laboratoire*</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Entrez un titre descriptif pour le laboratoire"
            />
            {errors.title && <span className="openstack-field-error">{errors.title}</span>}
          </div>

          <div className="openstack-form-row">
            <div className="openstack-form-group">
              <label htmlFor="subject_id">Matière*</label>
              <select
                id="subject_id"
                name="subject_id"
                value={formData.subject_id}
                onChange={handleChange}
              >
                <option value="">Sélectionnez une matière</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
              {errors.subject_id && <span className="openstack-field-error">{errors.subject_id}</span>}
            </div>

            <div className="openstack-form-group">
              <label htmlFor="class_id">Classe*</label>
              <select
                id="class_id"
                name="class_id"
                value={formData.class_id}
                onChange={handleChange}
              >
                <option value="">Sélectionnez une classe</option>
                {classes.map(classItem => (
                  <option key={classItem.id} value={classItem.id}>
                    {classItem.name}
                  </option>
                ))}
              </select>
              {errors.class_id && <span className="openstack-field-error">{errors.class_id}</span>}
            </div>
          </div>

          <div className="openstack-form-group">
            <label htmlFor="description">Description du Laboratoire*</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Décrivez le laboratoire, son but et son contenu"
            ></textarea>
            {errors.description && <span className="openstack-field-error">{errors.description}</span>}
          </div>

          <div className="openstack-form-group">
            <label htmlFor="objectives">Objectifs d'Apprentissage</label>
			<textarea
				id="objectives"
				name="objectives"
				value={formData.objectives}
				onChange={handleChange}
				rows="4"
				placeholder="Énumérez les objectifs d'apprentissage (un par ligne)"
			></textarea>
			<small className="openstack-form-help">Listez chaque objectif sur une nouvelle ligne.</small>
			</div>

			<div className="openstack-form-row">
				<div className="openstack-form-group">
					<label htmlFor="duration_hours">Durée Estimée (heures)*</label>
					<input
						type="number"
						id="duration_hours"
						name="duration_hours"
						value={formData.duration_hours}
						onChange={handleChange}
						min="1"
						max="24"
					/>
					{errors.duration_hours && <span className="openstack-field-error">{errors.duration_hours}</span>}
				</div>
			</div>

			<div className="openstack-form-group">
				<label htmlFor="resources">Ressources Requises</label>
				<textarea
					id="resources"
					name="resources"
					value={formData.resources}
					onChange={handleChange}
					rows="3"
					placeholder="Décrivez les ressources matérielles ou logicielles nécessaires"
				></textarea>
			</div>

			<div className="openstack-form-group">
				<label htmlFor="files">Fichiers Joints</label>
				<div className="openstack-file-upload">
					<label htmlFor="file-input" className="openstack-upload-btn">
						<FaCloudUploadAlt /> Choisir des fichiers
					</label>
					<input
						type="file"
						id="file-input"
						onChange={handleFileChange}
						multiple
						style={{ display: 'none' }}
					/>
				</div>

				{files.length > 0 && (
					<div className="openstack-file-list">
						{files.map((file, index) => (
							<div key={index} className="openstack-file-item">
								<span className="openstack-file-name">{file.name}</span>
								<span className="openstack-file-size">
									{(file.size / 1024).toFixed(1)} KB
								</span>
								<button 
									type="button" 
									className="openstack-remove-file"
									onClick={() => removeFile(index)}
								>
									<FaTrash />
								</button>
							</div>
						))}
					</div>
				)}
			</div>

			<div className="openstack-form-actions">
				<button 
					type="button" 
					className="openstack-cancel-btn"
					onClick={onCancel}
					disabled={loading}
				>
					<FaTimes /> Annuler
				</button>

				<button 
					type="submit" 
					className="openstack-submit-btn"
					disabled={loading}
				>
					{loading ? (
						<>
							<div className="openstack-button-spinner"></div> Envoi en cours...
						</>
					) : (
						<>
							<FaSave /> Soumettre pour Approbation
						</>
					)}
				</button>
			</div>
			</form>
			)}
		</div>
	);
};

export default CreateLab;
