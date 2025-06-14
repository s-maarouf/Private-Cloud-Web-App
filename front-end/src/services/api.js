// src/services/api.js
// Import services from the modular structure
import authService from './api/authService';
import adminService from './api/adminService';
import teacherService from './api/teacherService';
import studentService from './api/studentService';

// Export as a unified apiServices object
const apiServices = {
  auth: authService,
  admin: adminService,
  teacher: teacherService,
  student: studentService
};

export default apiServices;