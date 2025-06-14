// src/services/api/config.js

export const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to handle API responses
export const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    // Get error message from the response body
    const errorMessage = data.error || data.message || data.detail || 'Unknown error occurred';
    throw new Error(errorMessage);
  }

  return data;
};
