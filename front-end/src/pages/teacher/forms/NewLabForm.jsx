import React, { useState, useEffect } from 'react';
import './NewLabForm.css';

const NewLabForm = ({ teacherId }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    class_id: '',
    steps: [{ title: '', description: '' }]
  });
  
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoadingClasses(true);
        
        // Using the /api/class endpoint to get all classes
        const response = await fetch('/api/class', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`Erreur serveur: ${response.status}`);
        }
        
        const allClasses = await response.json();
        
        // Filter classes associated with this teacher
        const teacherClasses = allClasses.filter(c => 
          c.teacher_id === teacherId || 
          (c.teachers && c.teachers.some(t => t.id === teacherId))
        );
        
        setClasses(teacherClasses);
      } catch (err) {
        console.error('Erreur lors du chargement des classes:', err);
        setError('Impossible de charger vos classes');
      } finally {
        setLoadingClasses(false);
      }
    };
    
    if (teacherId) {
      fetchClasses();
    }
  }, [teacherId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleStepChange = (index, field, value) => {
    const updatedSteps = [...formData.steps];
    updatedSteps[index] = { ...updatedSteps[index], [field]: value };
    setFormData({ ...formData, steps: updatedSteps });
  };

  const addStep = () => {
    setFormData({
      ...formData,
      steps: [...formData.steps, { title: '', description: '' }]
    });
  };

  const removeStep = (index) => {
    const updatedSteps = [...formData.steps];
    updatedSteps.splice(index, 1);
    setFormData({ ...formData, steps: updatedSteps });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      // Validation
      if (!formData.name || !formData.description || !formData.class_id) {
        setError('Veuillez remplir tous les champs obligatoires');
        setLoading(false);
        return;
      }
      
      // Vérifier que toutes les étapes ont un titre
      const invalidStep = formData.steps.findIndex(step => !step.title);
      if (invalidStep >= 0) {
        setError(`L'étape ${invalidStep + 1} nécessite au moins un titre`);
        setLoading(false);
        return;
      }
      
      // Using the POST /lab/{lab_id} endpoint
      // The Swagger shows lab_id in the path, and for new labs it should be 0 or similar
      const response = await fetch('/api/lab/0', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          course_id: parseInt(formData.class_id),
          teacher_id: teacherId,
          // The steps array needs to be included in a way the API expects
          // If the API doesn't support steps directly, we can add it as a note in the description
          steps: formData.steps,
          status: 'pending' // Set initial status as pending for approval
        })
      });
      
      if (!response.ok) {
        throw new Error(`Erreur lors de la création du laboratoire: ${response.status}`);
      }
      
      // Réinitialiser le formulaire
      setFormData({
        name: '',
        description: '',
        class_id: '',
        steps: [{ title: '', description: '' }]
      });
      
      setSuccess('Demande de création de laboratoire soumise avec succès. Un administrateur l\'examinera prochainement.');
    } catch (err) {
      console.error('Erreur lors de la création du laboratoire:', err);
      setError('Une erreur est survenue lors de la création du laboratoire');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-lab-form">
      <h2>Créer un nouveau laboratoire</h2>
      <p className="form-instruction">Remplissez le formulaire ci-dessous pour soumettre une demande de création de laboratoire.</p>
      
      {error && <div className="lab-form-error">{error}</div>}
      {success && <div className="lab-form-success">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Informations générales</h3>
          
          <div className="form-group">
            <label htmlFor="name">Nom du laboratoire *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ex: Installation d'OpenStack"
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Décrivez brièvement l'objectif et le contenu du laboratoire"
              rows={4}
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="class_id">Classe associée *</label>
            {loadingClasses ? (
              <div className="select-loading">Chargement des classes...</div>
            ) : (
              <select
                id="class_id"
                name="class_id"
                value={formData.class_id}
                onChange={handleChange}
                disabled={loading || classes.length === 0}
              >
                <option value="">Sélectionner une classe</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            )}
          </div>
        </div>
        
        <div className="form-section">
          <h3>Étapes du laboratoire</h3>
          <p className="section-description">Définissez les étapes que les étudiants devront suivre pour compléter ce laboratoire.</p>
          
          {formData.steps.map((step, index) => (
            <div key={index} className="step-item">
              <div className="step-header">
                <h4>Étape {index + 1}</h4>
                {formData.steps.length > 1 && (
                  <button 
                    type="button" 
                    className="remove-step-btn"
                    onClick={() => removeStep(index)}
                    disabled={loading}
                  >
                    Supprimer
                  </button>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor={`step-title-${index}`}>Titre *</label>
                <input
                  type="text"
                  id={`step-title-${index}`}
                  value={step.title}
                  onChange={(e) => handleStepChange(index, 'title', e.target.value)}
                  placeholder="Ex: Installation des prérequis"
                  disabled={loading}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor={`step-description-${index}`}>Description</label>
                <textarea
                  id={`step-description-${index}`}
                  value={step.description}
                  onChange={(e) => handleStepChange(index, 'description', e.target.value)}
                  placeholder="Instructions détaillées pour cette étape"
                  rows={3}
                  disabled={loading}
                />
              </div>
            </div>
          ))}
          
          <button 
            type="button"
            className="add-step-btn"
            onClick={addStep}
            disabled={loading}
          >
            + Ajouter une étape
          </button>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="submit-lab-btn" disabled={loading}>
            {loading ? 'Soumission en cours...' : 'Soumettre pour approbation'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewLabForm;
