// ============================================
// ADMIN MIDDLEWARE
// ============================================

// Importamos el error personalizado
import { ForbiddenError } from '../utils/errors.js';

// Exportamos el middleware de administrador
export const adminMiddleware = (req, res, next) => {
  
  try {
    // PASO 1: Verificar si el usuario es admin
    // req.isAdmin fue establecido por apiKeyMiddleware
    // Si es false o undefined → no tiene permisos de admin
    if (!req.isAdmin) {
      
      // PASO 2: Lanzar error 403 Forbidden
      // Este error será capturado por errorHandler
      throw new ForbiddenError('Se requieren permisos de administrador');
    }
    
    // PASO 3: Si es admin, continuar con el siguiente middleware
    // next() pasa el control al siguiente middleware o controlador
    next();
    
  } catch (error) {
    // Si hay cualquier error, pasarlo al error handler
    next(error);
  }
};
