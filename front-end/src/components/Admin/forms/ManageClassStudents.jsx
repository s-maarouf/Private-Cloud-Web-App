import React, { useState, useEffect } from 'react';
import { FaTimes, FaSearch, FaUserPlus, FaUserMinus } from 'react-icons/fa';
import apiServices from '../../../services/api';

const ManageClassStudents = ({ classData, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]);
  const [classStudents, setClassStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all students
        const studentsResponse = await apiServices.admin.getUsers();
        console.log("API Response for users:", studentsResponse);

        // Filter only students from all users - check the actual structure of your response
        // It might be studentsResponse.users if your API returns {users: [...]}
        let allStudents = [];
        if (Array.isArray(studentsResponse)) {
          allStudents = studentsResponse.filter(user => user.role === 'student');
        } else if (studentsResponse.users && Array.isArray(studentsResponse.users)) {
          allStudents = studentsResponse.users.filter(user => user.role === 'student');
        } else {
          console.error("Unexpected users response format:", studentsResponse);
          throw new Error("Invalid response format for users");
        }

        // Fetch students assigned to this class
        const classStudentsResponse = await apiServices.admin.getClassStudents(classData.id);
        console.log("API Response for class students:", classStudentsResponse);

        // Check the structure of classStudentsResponse
        let enrolledStudents = [];
        if (Array.isArray(classStudentsResponse)) {
          enrolledStudents = classStudentsResponse;
        } else if (classStudentsResponse.students && Array.isArray(classStudentsResponse.students)) {
          enrolledStudents = classStudentsResponse.students;
        } else {
          console.error("Unexpected class students response format:", classStudentsResponse);
          throw new Error("Invalid response format for class students");
        }

        setStudents(allStudents);
        setClassStudents(enrolledStudents);
      } catch (err) {
        console.error('Error fetching students data:', err);
        setError(`Échec du chargement des étudiants. ${err.message || 'Veuillez réessayer.'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [classData.id]);

  // The rest of your component remains the same...
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const isStudentInClass = (studentId) => {
    if (!classStudents || classStudents.length === 0) return false;

    return classStudents.some(student => {
      // Handle different possible data structures
      if (typeof student === 'object') {
        return student.id === studentId || student.user_id === studentId;
      } else {
        // If students are stored just as IDs
        return student === studentId;
      }
    });
  };
  const handleAddStudent = async (student) => {
    try {
      setError('');
      setSuccess('');

      const response = await apiServices.admin.addStudentToClass(classData.id, { user_id: student.id });
      console.log("Add student response:", response);

      // Update the local state
      setClassStudents([...classStudents, student]);
      setSuccess(`${student.first_name} ${student.name} a été ajouté à la classe avec succès`);

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error adding student to class:', err);
      setError(`Échec de l'ajout de ${student.first_name} à la classe. ${err.message || 'Veuillez réessayer.'}`);
    }
  };
  const handleRemoveStudent = async (studentId, student) => {
    try {
      setError('');
      setSuccess('');

      const response = await apiServices.admin.removeStudentFromClass(classData.id, studentId);
      console.log("Remove student response:", response);

      // Update the local state
      setClassStudents(classStudents.filter(student => student.id !== studentId));
      setSuccess(`${student.first_name} ${student.name} a été retiré de la classe avec succès`);

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error removing student from class:', err);
      setError(`Échec du retrait de l'étudiant de la classe. ${err.message || 'Veuillez réessayer.'}`);
    }
  };

  // Filter students based on search
  const filteredStudents = students.filter(student => {
    const fullName = `${student.first_name} ${student.name}`.toLowerCase();
    return fullName.includes(searchTerm) || student.email.toLowerCase().includes(searchTerm);
  });

  // The rest of your render code remains the same...  
  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="form-modal">
          <div className="loading-container">
            <div className="spinner"></div>
            Chargement des étudiants...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="form-modal">        <div className="modal-header">
        <h2>Gérer les étudiants pour {classData.name}</h2>
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
            placeholder="Search students by name or email..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="student-stats">
          <div className="stat">
            <span className="label">Students Enrolled:</span>
            <span className="value">{classStudents.length}</span>
          </div>
          <div className="stat">
            <span className="label">Class Capacity:</span>
            <span className="value">{classData.capacity || 'Unlimited'}</span>
          </div>
        </div>

        <div className="students-table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map(student => (
                  <tr key={student.id}>
                    <td>{student.first_name} {student.name}</td>
                    <td>{student.email}</td>
                    <td>
                      {isStudentInClass(student.id) ? (
                        <span className="status-badge approved">Enrolled</span>
                      ) : (
                        <span className="status-badge">Not Enrolled</span>
                      )}
                    </td>
                    <td>
                      {isStudentInClass(student.id) ? (
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleRemoveStudent(student.id, `${student.first_name} ${student.name}`)}
                          title="Remove from class"
                        >
                          <FaUserMinus /> Remove
                        </button>
                      ) : (
                        <button
                          className="action-btn approve-btn"
                          onClick={() => handleAddStudent(student)}
                          title="Add to class"
                          disabled={classData.capacity && classStudents.length >= classData.capacity}
                        >
                          <FaUserPlus /> Add
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-results">
                    No students match your search criteria
                  </td>
                </tr>
              )}

              {students.length === 0 && (
                <tr>
                  <td colSpan="4" className="no-results">
                    No students found in the system. Please add students first.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            <FaTimes /> Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageClassStudents;