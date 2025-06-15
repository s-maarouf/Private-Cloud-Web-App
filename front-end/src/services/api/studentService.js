// src/services/api/studentService.js

import { API_BASE_URL, handleResponse } from './config';

const studentService = {
  // Récupérer le profil de l'étudiant
  getProfile: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  
  // Mettre à jour le profil de l'étudiant
  updateProfile: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/profile`, {
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
    // Récupérer les informations de classe de l'étudiant
  getClassInfo: async () => {
    try {
      // First get the profile to get the class_id
      const profileResponse = await fetch(`${API_BASE_URL}/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
      const profileData = await handleResponse(profileResponse);
      
      if (profileData.user && profileData.user.class_id) {
        const response = await fetch(`${API_BASE_URL}/classes/${profileData.user.class_id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        });
        return handleResponse(response);
      }
      return { error: "No class information found for this student" };
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  
  // Récupérer toutes les matières disponibles
  getSubjects: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/subjects`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  
  // Récupérer les laboratoires par matière
  getLabs: async (subjectId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/labs?subject_id=${subjectId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
    // Récupérer un laboratoire spécifique
  getLab: async (labId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/labs/${labId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  
  // Mettre à jour la progression d'un laboratoire
  updateLabProgress: async (labId, progressData) => {
    try {
      // Get student ID first from profile
      const profileResponse = await fetch(`${API_BASE_URL}/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
      const profileData = await handleResponse(profileResponse);
      
      if (profileData.user && profileData.user.student_id) {
        const studentId = profileData.user.student_id;
        const response = await fetch(`${API_BASE_URL}/students/${studentId}/labs/${labId}/progress`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(progressData)
        });
        return handleResponse(response);
      }
      return { error: "No student ID found" };
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
    // Récupérer la progression globale de l'étudiant
  getProgress: async () => {
    try {
      // Get student ID first from profile
      const profileResponse = await fetch(`${API_BASE_URL}/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
      const profileData = await handleResponse(profileResponse);
      
      if (profileData.user && profileData.user.student_id) {
        const studentId = profileData.user.student_id;
        const response = await fetch(`${API_BASE_URL}/students/${studentId}/progress`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        });
        return handleResponse(response);
      }
      return { error: "No student ID found" };
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  
  // Changer le mot de passe de l'étudiant
  changePassword: async (passwordData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(passwordData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
    // Soumettre un travail pour un laboratoire (Note: endpoint might need to be adjusted based on actual API implementation)
  submitLabWork: async (labId, formData) => {
    try {
      // Get student ID first from profile
      const profileResponse = await fetch(`${API_BASE_URL}/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
      const profileData = await handleResponse(profileResponse);
      
      if (profileData.user && profileData.user.student_id) {
        const studentId = profileData.user.student_id;
        // Using the progress endpoint to submit lab work with appropriate status
        const response = await fetch(`${API_BASE_URL}/students/${studentId}/labs/${labId}/progress`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            status: 'completed',
            ...formData
          })
        });
        return handleResponse(response);
      }
      return { error: "No student ID found" };
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};

export default studentService;
