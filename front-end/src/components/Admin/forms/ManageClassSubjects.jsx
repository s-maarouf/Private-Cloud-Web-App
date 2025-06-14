import React, { useState, useEffect } from 'react';
import { FaTimes, FaSearch, FaPlus, FaMinus } from 'react-icons/fa';
import apiServices from '../../../services/api';

const ManageClassSubjects = ({ classData, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [classSubjects, setClassSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedTeachers, setSelectedTeachers] = useState({});
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all subjects
        const subjectsResponse = await apiServices.admin.getSubjects();
        console.log("API Response for subjects:", subjectsResponse);

        // Extract subjects array from response based on your API format
        const allSubjects = subjectsResponse.subjects || [];

        // Fetch subjects assigned to this class
        const classSubjectsResponse = await apiServices.admin.getClassSubjects(classData.id);
        console.log("API Response for class subjects:", classSubjectsResponse);

        // Extract class subjects array from response
        const assignedSubjects = classSubjectsResponse.subjects || [];

        // Fetch all teachers for assigning
        const teachersResponse = await apiServices.admin.getUsers();
        console.log("API Response for teachers:", teachersResponse);

        // Extract teachers from response
        let allTeachers = [];
        if (Array.isArray(teachersResponse)) {
          allTeachers = teachersResponse.filter(user => user.role === 'teacher');
        } else if (teachersResponse.users && Array.isArray(teachersResponse.users)) {
          allTeachers = teachersResponse.users.filter(user => user.role === 'teacher');
        }

        setSubjects(allSubjects);
        setClassSubjects(assignedSubjects);
        setTeachers(allTeachers);

        // Initialize selected teachers
        const teacherSelections = {};
        assignedSubjects.forEach(subject => {
          if (subject.teacher_id) {
            teacherSelections[subject.id] = subject.teacher_id;
          }
        });
        setSelectedTeachers(teacherSelections);
      } catch (err) {
        console.error('Error fetching subjects data:', err);
        setError(`Échec du chargement des sujets. ${err.message || 'Veuillez réessayer.'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [classData.id]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const isSubjectInClass = (subjectId) => {
    return classSubjects.some(subject => subject.id === subjectId);
  };

  const handleAddSubject = async (subject) => {
    try {
      setError('');
      setSuccess('');

      await apiServices.admin.addSubjectToClass(classData.id, { subject_id: subject.id });
      // Update the local state
      setClassSubjects([...classSubjects, subject]);
      setSuccess(`${subject.name} a été ajouté à la classe avec succès`);

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error adding subject to class:', err);
      setError(`Échec de l'ajout de "${subject.name}" à la classe. ${err.message || 'Veuillez réessayer.'}`);
    }
  };

  const handleRemoveSubject = async (subjectId, subjectName) => {
    try {
      setError('');
      setSuccess('');

      await apiServices.admin.removeSubjectFromClass(classData.id, subjectId);

      // Update the local state
      setClassSubjects(classSubjects.filter(subject => subject.id !== subjectId));

      // Remove teacher assignment for this subject
      const updatedTeachers = { ...selectedTeachers }; delete updatedTeachers[subjectId];
      setSelectedTeachers(updatedTeachers);

      setSuccess(`${subjectName} a été retiré de la classe avec succès`);

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error removing subject from class:', err);
      setError(`Échec du retrait du sujet de la classe. ${err.message || 'Veuillez réessayer.'}`);
    }
  };

  const handleTeacherChange = async (subjectId, teacherId) => {
    try {
      setError('');
      setSuccess('');

      await apiServices.admin.assignTeacher(classData.id, {
        subject_id: subjectId,
        teacher_id: teacherId || null
      });
      // Update local state
      setSelectedTeachers({
        ...selectedTeachers,
        [subjectId]: teacherId
      });

      setSuccess('Affectation de l\'enseignant mise à jour avec succès');

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error assigning teacher:', err);
      setError(`Échec de l'affectation de l'enseignant. ${err.message || 'Veuillez réessayer.'}`);
    }
  };

  // Filter subjects based on search
  const filteredSubjects = subjects.filter(subject => {
    return subject.name.toLowerCase().includes(searchTerm) ||
      (subject.description && subject.description.toLowerCase().includes(searchTerm));
  });

  if (loading) {
    return (<div className="modal-overlay">
      <div className="form-modal">
        <div className="loading-container">
          <div className="spinner"></div>
          Chargement des sujets...
        </div>
      </div>
    </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="form-modal">        <div className="modal-header">
        <h2>Gérer les sujets pour {classData.name}</h2>
        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>
      </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <div className="search-bar">
          <FaSearch />
          <input
            type="text"
            placeholder="Rechercher des sujets par nom ou description..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="subject-stats">
          <div className="stat">
            <span className="label">Sujets assignés:</span>
            <span className="value">{classSubjects.length}</span>
          </div>
        </div>

        <div className="subjects-table-container">
          <table>            <thead>
            <tr>
              <th>Nom du sujet</th>
              <th>Description</th>
              <th>Enseignant</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
            <tbody>
              {filteredSubjects.length > 0 ? (
                filteredSubjects.map(subject => (
                  <tr key={subject.id}>
                    <td>{subject.name}</td>                    <td>{subject.description || 'Aucune description'}</td>
                    <td>
                      {isSubjectInClass(subject.id) && (
                        <select
                          value={selectedTeachers[subject.id] || ''}
                          onChange={(e) => handleTeacherChange(subject.id, e.target.value)}
                          className="teacher-select"
                        >
                          <option value="">-- Sélectionner un enseignant --</option>
                          {teachers.map(teacher => (
                            <option key={teacher.id} value={teacher.id}>
                              {teacher.first_name} {teacher.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>                    <td>
                      {isSubjectInClass(subject.id) ? (
                        <span className="status-badge approved">Assigné</span>
                      ) : (
                        <span className="status-badge">Non assigné</span>
                      )}
                    </td>
                    <td>
                      {isSubjectInClass(subject.id) ? (<button
                        className="action-btn delete-btn"
                        onClick={() => handleRemoveSubject(subject.id, subject.name)}
                        title="Retirer de la classe"
                      >
                        <FaMinus /> Retirer
                      </button>
                      ) : (
                        <button
                          className="action-btn approve-btn"
                          onClick={() => handleAddSubject(subject)}
                          title="Ajouter à la classe"
                        >
                          <FaPlus /> Ajouter
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>                  <td colSpan="5" className="no-results">
                  Aucun sujet ne correspond à vos critères de recherche
                </td>
                </tr>
              )}

              {subjects.length === 0 && (
                <tr>
                  <td colSpan="5" className="no-results">
                    Aucun sujet trouvé dans le système. Veuillez d'abord ajouter des sujets.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            <FaTimes /> Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageClassSubjects;