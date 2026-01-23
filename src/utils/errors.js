// CLASE BASE - AppError
// Esta es la clase padre de todos nuestros errores personalizados
export class AppError extends Error {
  
  // CONSTRUCTOR - Inicializa el error
  constructor(message, statusCode = 500) {
    
    // PASO 1: Llamar al constructor de Error (clase padre)
    // super() llama al constructor de la clase Error nativa de JavaScript
    super(message);
    
    // PASO 2: Asignar el código de estado HTTP
    // Ejemplo: 404 (Not Found), 400 (Bad Request), 500 (Internal Server Error)
    this.statusCode = statusCode;
    
    // PASO 3: Marcar como error operacional
    // isOperational = true significa que es un error esperado/manejable
    // Por ejemplo: validación fallida, recurso no encontrado
    // isOperational = false serían errores de programación (bugs)
    this.isOperational = true;
    
    // PASO 4: Capturar el stack trace
    // Esto ayuda al debugging mostrando dónde ocurrió el error
    // captureStackTrace elimina el constructor del stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

// ============================================
// ERRORES ESPECÍFICOS
// ============================================

// NOT FOUND ERROR - Error 404
// Se lanza cuando no se encuentra un recurso
export class NotFoundError extends AppError {
  
  // CONSTRUCTOR
  constructor(resource = 'Recurso') {
    
    // PASO 1: Llamar al constructor padre con mensaje y código 404
    // resource = nombre del recurso no encontrado (Aeropuerto, Vuelo, etc.)
    // Si no se especifica, usa 'Recurso' por defecto
    super(`${resource} no encontrado`, 404);
  }
}

// VALIDATION ERROR - Error 400
// Se lanza cuando los datos enviados no son válidos
export class ValidationError extends AppError {
  
  // CONSTRUCTOR
  constructor(message = 'Error de validación', errors = null) {
    
    // PASO 1: Llamar al constructor padre con código 400
    // 400 = Bad Request (petición malformada o datos inválidos)
    super(message, 400);
    
    // PASO 2: Guardar array de errores (opcional)
    // errors puede ser un array con detalles específicos de validación
    // Ejemplo: [{ field: 'email', message: 'Email inválido' }]
    this.errors = errors;
  }
}

// UNAUTHORIZED ERROR - Error 401
// Se lanza cuando falta autenticación (API Key inválida o faltante)
export class UnauthorizedError extends AppError {
  
  // CONSTRUCTOR
  constructor(message = 'No autorizado') {
    
    // PASO 1: Llamar al constructor padre con código 401
    // 401 = Unauthorized (falta autenticación válida)
    super(message, 401);
  }
}

// FORBIDDEN ERROR - Error 403
// Se lanza cuando el usuario no tiene permisos suficientes
export class ForbiddenError extends AppError {
  
  // CONSTRUCTOR
  constructor(message = 'Acceso prohibido') {
    
    // PASO 1: Llamar al constructor padre con código 403
    // 403 = Forbidden (autenticado pero sin permisos)
    // Ejemplo: usuario normal intenta acceder a función de admin
    super(message, 403);
  }
}

// CONFLICT ERROR - Error 409
// Se lanza cuando hay conflicto con el estado actual
export class ConflictError extends AppError {
  
  // CONSTRUCTOR
  constructor(message = 'Conflicto con el estado actual') {
    
    // PASO 1: Llamar al constructor padre con código 409
    // 409 = Conflict (el recurso ya existe)
    // Ejemplo: intentar crear un aeropuerto con código IATA duplicado
    super(message, 409);
  }
}