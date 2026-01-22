import { ValidationError } from '../utils/errors.js';

export const validateSchema = (validationFn) => {
  return (req, res, next) => {
    try {
      const isUpdate = req.method === 'PUT' || req.method === 'PATCH';
      const result = validationFn(req.body, isUpdate);
      
      // Manejamos si el resultado es un string (error único) o un array de errores
      let errors = [];
      if (typeof result === 'string') {
        errors = [{ message: result }];
      } else if (Array.isArray(result) && result.length > 0) {
        errors = result.map(msg => ({ message: msg }));
      }

      if (errors.length > 0) {
        throw new ValidationError('Errores de validación', errors);
      }
      
      next();
    } catch (err) {
      next(err);
    }
  };
};