
// Importamos la clase base de errores personalizados
import { AppError } from '../utils/errors.js';

// ERROR HANDLER - Middleware de manejo de errores
export const errorHandler = (err, req, res, next) => {
  
  // IMPORTANTE: Este middleware tiene 4 parámetros (err, req, res, next)
  // Express reconoce automáticamente que es un error handler
  // Registramos el error en consola para debugging
  console.error('Error:', err);
  
  // CASO 1: Error operacional conocido (AppError)
  // instanceof verifica si err es una instancia de AppError
  // AppError incluye: NotFoundError, ValidationError, etc.
  if (err instanceof AppError) {
    // Respondemos con el status code del error
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      // Si hay errores adicionales (array), los incluimos
      ...(err.errors && { errors: err.errors })
    });
  }
  
  // CASO 2: Error de Supabase
  // Los errores de Supabase tienen propiedad .code
  if (err.code) {
    return res.status(500).json({
      success: false,
      message: 'Error en la base de datos',
      // Solo mostramos detalles en desarrollo
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
  
  // CASO 3: Error genérico desconocido
  // Si no es AppError ni error de Supabase
  // Ejemplo: SyntaxError, ReferenceError, etc.
  return res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    // Solo en desarrollo mostramos el mensaje original
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

// NOT FOUND HANDLER - Ruta no encontrada (404)
export const notFoundHandler = (req, res) => {
  // Este middleware se ejecuta si NINGUNA ruta coincidió
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
};