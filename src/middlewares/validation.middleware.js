// Importamos el error de validación
import { ValidationError } from '../utils/errors.js';

// Exportamos una función que devuelve el middleware
// validationFn = función de validación específica (validateAeropuerto, etc.)
export const validateSchema = (validationFn) => {
  
  // PASO 1: Devolver el middleware real
  // Este patrón se llama "middleware factory"
  return (req, res, next) => {
    
    try {
      // PASO 2: Determinar si es una actualización
      // PUT y PATCH son para actualizar
      // POST es para crear
      const isUpdate = req.method === 'PUT' || req.method === 'PATCH';
      
      // PASO 3: Ejecutar la función de validación
      // Le pasamos el body y si es update
      const result = validationFn(req.body, isUpdate);
      
      // PASO 4: Procesar el resultado de la validación
      let errors = [];
      
      // Si devuelve un string, es un solo error
      if (typeof result === 'string') {
        errors = [{ message: result }];
      } 
      // Si devuelve un array con elementos, son múltiples errores
      else if (Array.isArray(result) && result.length > 0) {
        errors = result.map(msg => ({ message: msg }));
      }

      // PASO 5: Si hay errores, lanzar ValidationError
      if (errors.length > 0) {
        throw new ValidationError('Errores de validación', errors);
      }
      
      // PASO 6: Guardar los datos validados en req
      // Útil para que el controlador sepa que ya está validado
      req.validatedData = req.body; 
      
      // PASO 7: Si no hay errores, continuar
      next();
      
    } catch (err) {
      // Pasar error al error handler
      next(err);
    }
  };
};