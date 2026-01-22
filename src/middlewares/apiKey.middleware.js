import { config } from '../config/index.js';
import { UnauthorizedError } from '../utils/errors.js';

export const apiKeyMiddleware = (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey) {
      throw new UnauthorizedError('API Key requerida');
    }
    
    const validKeys = [...config.apiKeys, ...config.adminApiKeys];
    
    if (!validKeys.includes(apiKey)) {
      throw new UnauthorizedError('API Key inválida');
    }
    
    // Guardar si es admin 
    req.isAdmin = config.adminApiKeys.includes(apiKey);
    
    next();
  } catch (error) {
    next(error);
  }
};