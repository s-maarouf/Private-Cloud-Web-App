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
      // Get the current user first to ensure we're authenticated
      const userResponse = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const userData = await handleResponse(userResponse);
      
      if (!userData || !userData.user) {
        console.error('Could not fetch user profile data');
        return [];
      }
      
      // Verify user is a teacher
      if (userData.user.role !== 'teacher') {
        console.warn('Non-teacher user trying to access teacher classes');
        return [];
      }
      
      // Get all classes
      const response = await fetch(`${API_BASE_URL}/class`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
      const data = await handleResponse(response);
      
      // Check if we have classes in the response
      if (!data || !Array.isArray(data.classes)) {
        console.error('Invalid classes response format:', data);
        return [];
      }
      
      // TEMPORARY IMPLEMENTATION:
      // Currently, the backend doesn't provide a way to filter classes by teacher
      // In a proper implementation, we would:
      // 1. Either have a dedicated endpoint for teacher classes
      // 2. Or filter the classes on the backend
      // 3. Or get teacher assignments and filter classes client-side
      
      // For now, return all classes with enhanced data for the UI
      return data.classes.map(cls => ({
        id: cls.id,
        name: cls.name,
        // Add additional data needed by the frontend components
        studentCount: Math.floor(Math.random() * 20) + 10, // Dummy data: 10-30 students
        description: `Classe ${cls.name}`, // Simple description
        // Could add more fields that the UI might need
        subjectCount: Math.floor(Math.random() * 5) + 1, // Dummy data: 1-5 subjects
      }));
      
      /* TODO: Future implementation once backend provides teacher assignments:
      
      // Get teacher assignments for the current user
      const assignmentsResponse = await fetch(`${API_BASE_URL}/teacher/assignments`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const assignments = await handleResponse(assignmentsResponse);
      
      // Get the class IDs this teacher is assigned to
      const assignedClassIds = new Set(
        assignments.map(assignment => assignment.class_id)
      );
      
      // Filter classes by the assignments
      return data.classes
        .filter(cls => assignedClassIds.has(cls.id))
        .map(cls => ({
          id: cls.id,
          name: cls.name,
          studentCount: cls.student_count || 0,
          description: cls.description || `Class ${cls.name}`
        }));
      */
    } catch (error) {
      console.error('API Error in getAssignedClasses:', error);
      // Return an empty array instead of throwing to prevent UI crashes
      return [];
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
  // Get all labs
  getLabs: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/labs`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
      const allLabsData = await handleResponse(response);
      
      if (!allLabsData || !Array.isArray(allLabsData.labs)) {
        console.error('Invalid labs response format:', allLabsData);
        return [];
      }
      
      // Get current user to filter labs created by this teacher
      const userResponse = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const userData = await handleResponse(userResponse);
      
      if (!userData || !userData.user) {
        console.error('Could not fetch user profile data');
        return allLabsData.labs; // Return all labs if we can't filter
      }
      
      // Filter labs created by the current teacher
      return allLabsData.labs.filter(lab => lab.created_by === userData.user.id);
    } catch (error) {
      console.error('API Error in getLabs:', error);
      return [];
    }
  },

  // Récupérer les laboratoires d'une classe
  getClassLabs: async (classId) => {
    try {
      if (!classId) {
        console.error('No classId provided to getClassLabs');
        return [];
      }
      
      // First get the class details to find subjects for this class
      const classResponse = await fetch(`${API_BASE_URL}/class/${classId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
      const classData = await handleResponse(classResponse);
      
      if (!classData || !Array.isArray(classData.subjects)) {
        console.error('Invalid class data or missing subjects:', classData);
        return [];
      }
      
      // Get subject IDs for this class
      const subjectIds = classData.subjects.map(subject => subject.id);
      
      if (subjectIds.length === 0) {
        console.warn(`No subjects found for class ${classId}`);
        return [];
      }
      
      // Get all labs
      const labsResponse = await fetch(`${API_BASE_URL}/labs`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
      const allLabsData = await handleResponse(labsResponse);
      
      if (!allLabsData || !Array.isArray(allLabsData.labs)) {
        console.error('Invalid labs response format:', allLabsData);
        return [];
      }
      
      // Filter labs by the subject IDs for this class
      const classLabs = allLabsData.labs.filter(lab => 
        subjectIds.includes(lab.subject_id)
      );
      
      // Add class_id for frontend compatibility and return
      return classLabs.map(lab => ({
        ...lab,
        class_id: classId
      }));
    } catch (error) {
      console.error('API Error in getClassLabs:', error);
      // Return empty array instead of throwing to prevent UI crashes
      return [];
    }
  },
  // Récupérer les étudiants d'une classe
  getClassStudents: async (classId) => {
    try {
      if (!classId) {
        console.error('No classId provided to getClassStudents');
        return [];
      }
      
      // Get class details with students
      const response = await fetch(`${API_BASE_URL}/class/${classId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
      const classData = await handleResponse(response);
      
      if (!classData) {
        console.error('Invalid class data response');
        return [];
      }
      
      // If the API returns students directly, use that
      if (Array.isArray(classData.students)) {
        return classData.students.map(student => ({
          id: student.id,
          user_id: student.user_id,
          name: student.name || 'Unknown',
          firstName: student.first_name || 'Unknown',
          email: student.email || student.username || 'Unknown'
        }));
      } 
      
      // If there are no students in the response, return an empty array
      console.warn(`No students found for class ${classId}`, classData);
      return [];
    } catch (error) {
      console.error('API Error in getClassStudents:', error);
      // Return empty array instead of throwing to prevent UI crashes
      return [];
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
  },  // This is a duplicate of the getLabs function above (already implemented)
};

export default teacherService;
