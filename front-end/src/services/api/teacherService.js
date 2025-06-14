// src/services/api/teacherService.js

import { API_BASE_URL, handleResponse } from './config';

const teacherService = {
  // Récupérer le profil de l'enseignant (uses the general profile endpoint)
  getProfile: async () => {
    try {
      // Using the profile endpoint available for all users
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
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
  
  // Mettre à jour le profil de l'enseignant
  updateProfile: async (userData) => {
    try {
      // Using the common profile update endpoint
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
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
  
  // Récupérer les classes assignées à l'enseignant
  getAssignedClasses: async () => {
    try {
      // Get all classes and filter for those assigned to the teacher on client side
      const response = await fetch(`${API_BASE_URL}/class`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
      const allClasses = await handleResponse(response);
      
      // Get the current user ID to filter classes
      const userResponse = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const userData = await handleResponse(userResponse);
      
      // Client-side filtering for teacher's classes until a specific endpoint is available
      return allClasses.classes.filter(cls => {
        // If the class has teacher assignments, check if this teacher is assigned
        return cls.teacher_id === userData.user.id || 
               (cls.teachers && cls.teachers.some(t => t.id === userData.user.id));
      });
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
    // Récupérer les matières assignées à l'enseignant
  getAssignedSubjects: async () => {
    try {
      // Get all subjects and filter for those assigned to the teacher
      const response = await fetch(`${API_BASE_URL}/subject`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
      const allSubjects = await handleResponse(response);
      
      // Get the current user ID to filter subjects
      const userResponse = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const userData = await handleResponse(userResponse);
      
      // Filter subjects assigned to this teacher
      return allSubjects.filter(subject => 
        subject.teacher_id === userData.user.id
      );
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  
  // Récupérer les laboratoires d'une classe
  getClassLabs: async (classId) => {
    try {
      // Get all labs and filter by class ID
      const response = await fetch(`${API_BASE_URL}/lab?class_id=${classId}`, {
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
  
  // Récupérer les étudiants d'une classe
  getClassStudents: async (classId) => {
    try {
      // Get class details with students
      const response = await fetch(`${API_BASE_URL}/class/${classId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
      const classData = await handleResponse(response);
      
      // Extract just the students list from the class data
      return classData.students || [];
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
    // Créer une demande de laboratoire
  createLabRequest: async (labData) => {
    try {
      // Use the standard lab creation endpoint which is protected by teacher_required decorator
      const response = await fetch(`${API_BASE_URL}/lab`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(labData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  
  // Récupérer les notifications (placeholder - no specific endpoint exists)
  getNotifications: async () => {
    try {
      // Since there's no notifications endpoint, 
      // we'll return an empty array for now
      console.warn('Notifications endpoint not implemented in API');
      return [];
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  
  // Récupérer les statistiques des laboratoires
  getLabStats: async (labId) => {
    try {
      // Fetch lab details and calculate stats on client side
      const response = await fetch(`${API_BASE_URL}/lab/${labId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
      
      // You would need to add additional logic here to calculate stats
      // based on student progress data
      const labData = await handleResponse(response);
      
      // For now, return placeholder stats
      return {
        ...labData,
        completion_rate: Math.floor(Math.random() * 100), // Placeholder
        student_count: Math.floor(Math.random() * 30) + 5, // Placeholder
        average_time: Math.floor(Math.random() * 120) + 30 // Placeholder in minutes
      };
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  
  // Évaluer la progression d'un étudiant (placeholder - no endpoint exists yet)
  evaluateStudentProgress: async (studentId, labId, evaluationData) => {
    try {
      // This endpoint doesn't exist in the API yet
      // We'll log a warning and return a mock success response
      console.warn(`Student evaluation endpoint not implemented in API (student: ${studentId}, lab: ${labId})`);
      
      // Mock successful evaluation
      return {
        success: true,
        message: "Évaluation enregistrée (simulation)"
      };
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  
  // Update teacher's password
  updatePassword: async (passwordData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          current_password: passwordData.current_password,
          new_password: passwordData.new_password
        })
      });
      return handleResponse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
};

export default teacherService;
