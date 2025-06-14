// Exporter tous les services API
import * as authService from './authService';
import * as classesService from './classesService';
import * as subjectsService from './subjectsService';
import * as labsService from './labsService';
import * as usersService from './usersService';

export {
  authService,
  classesService,
  subjectsService,
  labsService,
  usersService
};

// Pour la compatibilité avec le code existant
export { default } from './api';
