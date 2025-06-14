import { API_BASE_URL, handleResponse } from './config';

const adminService = {
  // Users
  getUsers: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  getUser: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  createUser: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(userData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  updateUser: async (userId, userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(userData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Classes
  getClasses: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/classes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  getClass: async (classId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/classes/${classId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  getClassStudents: async (classId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/classes/${classId}/students`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  createClass: async (classData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/classes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(classData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  updateClass: async (classId, classData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/classes/${classId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(classData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  deleteClass: async (classId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/classes/${classId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Student management for classes
  addStudentToClass: async (classId, userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/classes/${classId}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(userData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  removeStudentFromClass: async (classId, studentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/classes/${classId}/students/${studentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // get class subjects
  getClassSubjects: async (classId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/classes/${classId}/subjects`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Subject management for classes
  addSubjectToClass: async (classId, subjectData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/classes/${classId}/subjects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(subjectData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  removeSubjectFromClass: async (classId, subjectId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/classes/${classId}/subjects/${subjectId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  assignTeacher: async (classId, teacherData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/classes/${classId}/teachers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(teacherData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Subjects
  getSubjects: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/subjects`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  getSubjectClasses: async (subjectId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/subjects/${subjectId}/classes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  getSubjectLabs: async (subjectId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/subjects/${subjectId}/labs`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  createSubject: async (subjectData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/subjects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(subjectData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  updateSubject: async (subjectId, subjectData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/subjects/${subjectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(subjectData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  deleteSubject: async (subjectId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/subjects/${subjectId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Labs
  getLabs: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/labs`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  getLab: async (labId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/labs/${labId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  updateLabStatus: async (labId, statusData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/labs/${labId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(statusData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  deleteLab: async (labId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/labs/${labId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};

export default adminService;
