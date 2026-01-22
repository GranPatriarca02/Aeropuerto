import { config } from '../config/index.js';
import { UnauthorizedError } from '../utils/errors.js';

export const apiKeyMiddleware = (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey) {
      throw new UnauthorizedError('API Key requerida');
    }
    
    // Si config es undefined o no tiene las propiedades, esto fallará.
    // Asegúrate de que config.apiKeys y config.adminApiKeys sean ARRAYS.
    const userKeys = config.apiKeys || [];
    const adminKeys = config.adminApiKeys || [];
    const validKeys = [...userKeys, ...adminKeys];
    
    if (!validKeys.includes(apiKey)) {
      throw new UnauthorizedError('API Key inválida');
    }
    
    req.isAdmin = adminKeys.includes(apiKey);
    next();
  } catch (error) {
    next(error);
  }
};