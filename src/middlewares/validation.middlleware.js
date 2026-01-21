import { ValidationError } from '../utils/errors.js';

export const validateSchema = (schema) => {
  return (req, res, next) => {
    try {
      const { error, value } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
      });
      
      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }));
        
        throw new ValidationError('Errores de validación', errors);
      }
      
      req.validatedData = value;
      next();
    } catch (err) {
      next(err);
    }
  };
};