// src/services/api/authService.js

import { API_BASE_URL, handleResponse } from './config';

const authService = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    try {
      // Remove token from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      return { success: true };
    } catch (error) {
      console.error('Logout Error:', error);
      throw error;
    }
  },
};

export default authService;
