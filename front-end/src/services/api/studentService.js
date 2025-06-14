// src/services/api/studentService.js

import { API_BASE_URL, handleResponse } from './config';

const studentService = {
  // Récupérer le profil de l'étudiant
  getProfile: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/student/profile`, {
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
      const response = await fetch(`${API_BASE_URL}/student/profile`, {
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
  
  // Récupérer les classes de l'étudiant
  getClasses: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/student/classes`, {
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
  
  // Récupérer les laboratoires disponibles pour l'étudiant
  getLabs: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/student/labs`, {
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
      const response = await fetch(`${API_BASE_URL}/student/labs/${labId}`, {
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
      const response = await fetch(`${API_BASE_URL}/student/labs/${labId}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(progressData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  
  // Récupérer la progression globale de l'étudiant
  getProgress: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/student/progress`, {
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
  
  // Récupérer les notifications de l'étudiant
  getNotifications: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/student/notifications`, {
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
  
  // Soumettre un travail pour un laboratoire
  submitLabWork: async (labId, formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/student/labs/${labId}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      return handleResponse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};

export default studentService;
