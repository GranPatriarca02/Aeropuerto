import { AppError } from '../utils/errors.js';

export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  // Si es un error operacional conocido
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.errors && { errors: err.errors })
    });
  }
  
  // Error de Supabase
  if (err.code) {
    return res.status(500).json({
      success: false,
      message: 'Error en la base de datos',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
  
  // Error genérico
  return res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
};