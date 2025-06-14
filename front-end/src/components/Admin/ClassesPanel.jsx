import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaUserPlus, FaBook } from 'react-icons/fa';
import apiServices from '../../services/api';
import ClassForm from '../Admin/forms/ClassForm';
import ManageClassStudents from '../Admin/forms/ManageClassStudents';
import ManageClassSubjects from '../Admin/forms/ManageClassSubjects';

const ClassesPanel = () => {
  const [classes, setClasses] = useState([]);
  const [classDetails, setClassDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [currentClass, setCurrentClass] = useState(null);
  const [showStudentsManager, setShowStudentsManager] = useState(false);
  const [showSubjectsManager, setShowSubjectsManager] = useState(false);
  
  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await apiServices.admin.getClasses();
      setClasses(response.classes || response);
      
      // Fetch details for each class
      const details = {};
      for (const classItem of (response.classes || response)) {
        try {
          // Fetch students
          const studentsResponse = await apiServices.admin.getClassStudents(classItem.id);
          // Fetch subjects
          const subjectsResponse = await apiServices.admin.getClassSubjects(classItem.id);
          
          details[classItem.id] = {
            students: Array.isArray(studentsResponse) ? studentsResponse : 
                     (studentsResponse.students || []),
            subjects: Array.isArray(subjectsResponse) ? subjectsResponse :
                     (subjectsResponse.subjects || [])
          };
        } catch (err) {
          console.error(`Erreur lors du chargement des détails pour la classe ${classItem.id}:`, err);
          details[classItem.id] = { students: [], subjects: [] };
        }
      }
      
      setClassDetails(details);
    } catch (err) {
      console.error('Erreur lors du chargement des classes:', err);
      setError('Échec du chargement des classes. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchClasses();
  }, []);
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredClasses = classes.filter(classItem => {
    return classItem.name.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  const handleAddClass = () => {
    setCurrentClass(null);
    setShowForm(true);
  };
  
  const handleEditClass = (classItem) => {
    setCurrentClass(classItem);
    setShowForm(true);
  };
  
  const handleDeleteClass = async (classId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette classe? Toutes les données des élèves seront perdues.')) {
      try {
        await apiServices.admin.deleteClass(classId);
        fetchClasses();
      } catch (err) {
        console.error('Erreur lors de la suppression de la classe:', err);
        setError('Échec de la suppression de la classe. Veuillez réessayer.');
      }
    }
  };
  
  const handleManageStudents = (classItem) => {
    setCurrentClass(classItem);
    setShowStudentsManager(true);
  };
  
  const handleManageSubjects = (classItem) => {
    setCurrentClass(classItem);
    setShowSubjectsManager(true);
  };
  
  const handleFormSubmit = async (classData) => {
    try {
      if (currentClass) {
        await apiServices.admin.updateClass(currentClass.id, classData);
      } else {
        await apiServices.admin.createClass(classData);
      }
      setShowForm(false);
      fetchClasses();
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement de la classe:', err);
      setError('Échec de l\'enregistrement de la classe. Veuillez réessayer.');
    }
  };
  
  if (loading) {
    return <div className="loading-container">Chargement des classes...</div>;
  }
  
  return (
    <div className="classes-panel">
      <div className="panel-header">
        <h1>Gestion des Classes</h1>
        <button className="add-btn" onClick={handleAddClass}>
          <FaPlus /> Ajouter une Nouvelle Classe
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="search-bar">
        <FaSearch />
        <input
          type="text"
          placeholder="Rechercher des classes..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      
      {showForm && (
        <ClassForm
          classData={currentClass}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}
      
      {showStudentsManager && (
        <ManageClassStudents
          classData={currentClass}
          onClose={() => {
            setShowStudentsManager(false);
            fetchClasses();
          }}
        />
      )}
      
      {showSubjectsManager && (
        <ManageClassSubjects
          classData={currentClass}
          onClose={() => {
            setShowSubjectsManager(false);
            fetchClasses();
          }}
        />
      )}
      
      <div className="classes-grid">
        {filteredClasses.map(classItem => (
          <div key={classItem.id} className="class-card">
            <div className="class-header">
              <h3>{classItem.name}</h3>
              <div className="class-actions">
                <button 
                  className="edit-btn" 
                  onClick={() => handleEditClass(classItem)}
                  title="Modifier la Classe"
                >
                  <FaEdit />
                </button>
                <button 
                  className="delete-btn" 
                  onClick={() => handleDeleteClass(classItem.id)}
                  title="Supprimer la Classe"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
            
            <div className="class-stats">
              <div className="stat">
                <span className="label">Élèves:</span>
                <span className="value">
                  {classDetails[classItem.id]?.students?.length || 0}
                </span>
              </div>
              <div className="stat">
                <span className="label">Matières:</span>
                <span className="value">
                  {classDetails[classItem.id]?.subjects?.length || 0}
                </span>
              </div>
            </div>
            
            <div className="class-actions-row">
              <button 
                className="manage-btn"
                onClick={() => handleManageStudents(classItem)}
              >
                <FaUserPlus /> Gérer les Élèves
              </button>
              <button 
                className="manage-btn"
                onClick={() => handleManageSubjects(classItem)}
              >
                <FaBook /> Gérer les Matières
              </button>
            </div>
          </div>
        ))}
        
        {filteredClasses.length === 0 && (
          <div className="no-results">
            Aucune classe trouvée
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassesPanel;