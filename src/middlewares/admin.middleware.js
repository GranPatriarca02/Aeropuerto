import { ForbiddenError } from '../utils/errors.js';

export const adminMiddleware = (req, res, next) => {
  try {
    if (!req.isAdmin) {
      throw new ForbiddenError('Se requieren permisos de administrador');
    }
    next();
  } catch (error) {
    next(error);
  }
};