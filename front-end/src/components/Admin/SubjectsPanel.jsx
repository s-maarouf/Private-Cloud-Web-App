import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import apiServices from '../../services/api';
import SubjectForm from '../Admin/forms/SubjectForm';

const SubjectsPanel = () => {
  const [subjects, setSubjects] = useState([]);
  const [subjectDetails, setSubjectDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [currentSubject, setCurrentSubject] = useState(null);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await apiServices.admin.getSubjects();

      // Get the subjects array from the response
      const subjectsArray = response.subjects || response;
      setSubjects(subjectsArray);

      // Fetch associated classes and labs for each subject
      const details = {};
      for (const subject of subjectsArray) {
        try {
          // Get classes where this subject is assigned
          const classesResponse = await apiServices.admin.getSubjectClasses(subject.id);

          // Get labs related to this subject
          const labsResponse = await apiServices.admin.getSubjectLabs(subject.id);

          details[subject.id] = {
            classes: Array.isArray(classesResponse) ? classesResponse :
              (classesResponse.classes || []),
            labs: Array.isArray(labsResponse) ? labsResponse :
              (labsResponse.labs || [])
          };
        } catch (err) {
          console.error(`Erreur lors du chargement des détails pour la matière ${subject.id}:`, err);
          details[subject.id] = { classes: [], labs: [] };
        }
      }

      setSubjectDetails(details);
    } catch (err) {
      console.error('Erreur lors de la récupération des matières:', err);
      setError('Impossible de charger les matières. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredSubjects = subjects.filter(subject => {
    return subject.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleAddSubject = () => {
    setCurrentSubject(null);
    setShowForm(true);
  };

  const handleEditSubject = (subject) => {
    setCurrentSubject(subject);
    setShowForm(true);
  };

  const handleDeleteSubject = async (subjectId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette matière? Cela affectera toutes les classes et les laboratoires associés.')) {
      try {
        await apiServices.admin.deleteSubject(subjectId);
        fetchSubjects();
      } catch (err) {
        console.error('Erreur lors de la suppression de la matière:', err);
        setError('Échec de la suppression de la matière. Veuillez réessayer.');
      }
    }
  };

  const handleFormSubmit = async (subjectData) => {
    try {
      if (currentSubject) {
        await apiServices.admin.updateSubject(currentSubject.id, subjectData);
      } else {
        await apiServices.admin.createSubject(subjectData);
      }
      setShowForm(false);
      fetchSubjects();
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement de la matière:', err);
      setError('Échec de l\'enregistrement de la matière. Veuillez réessayer.');
    }
  };

  if (loading) {
    return <div className="loading-container">Chargement des matières...</div>;
  }

  return (
    <div className="subjects-panel">
      <div className="panel-header">
        <h1>Gestion des Matières</h1>
        <button className="add-btn" onClick={handleAddSubject}>
          <FaPlus /> Ajouter Nouvelle Matière
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="search-bar">
        <FaSearch />
        <input
          type="text"
          placeholder="Rechercher des matières..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {showForm && (
        <SubjectForm
          subject={currentSubject}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="subjects-table-container">
        <table className="subjects-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom de la Matière</th>
              <th>Laboratoires Associés</th>
              <th>Classes Associées</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubjects.map(subject => (
              <tr key={subject.id}>
                <td>{subject.id}</td>
                <td>{subject.name}</td>
                <td>
                  {subjectDetails[subject.id]?.labs && subjectDetails[subject.id].labs.length > 0 ? (
                    <ul className="associated-list">
                      {subjectDetails[subject.id].labs.map(lab => (
                        <li key={lab.id}>{lab.title || lab.name}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="no-items">Pas de laboratoires</span>
                  )}
                </td>
                <td>
                  {subjectDetails[subject.id]?.classes && subjectDetails[subject.id].classes.length > 0 ? (
                    <ul className="associated-list">
                      {subjectDetails[subject.id].classes.map(cls => (
                        <li key={cls.id}>{cls.name}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="no-items">Pas de classes</span>
                  )}
                </td>
                <td className="actions">
                  <button
                    className="edit-btn"
                    onClick={() => handleEditSubject(subject)}
                    title="Modifier la Matière"
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteSubject(subject.id)}
                    title="Supprimer la Matière"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}

            {filteredSubjects.length === 0 && (
              <tr>
                <td colSpan="5" className="no-results">Aucune matière trouvée</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubjectsPanel;