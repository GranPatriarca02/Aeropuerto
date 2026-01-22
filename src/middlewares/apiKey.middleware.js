
// Importamos la configuración (contiene las API Keys válidas)
import { config } from '../config/index.js';

// Importamos el error personalizado de no autorizado
import { UnauthorizedError } from '../utils/errors.js';

// Exportamos el middleware como función
export const apiKeyMiddleware = (req, res, next) => {
  
  // PASO 1: Extraer la API Key del header
  // Buscamos el header 'x-api-key' en la petición
  const apiKey = req.headers['x-api-key'];
  
  // PASO 2: Verificar si existe la API Key
  // Si no hay API Key en el header , Lanzamos error 401 Unauthorized, Este error será capturado por errorHandler
  if (!apiKey) {
    throw new UnauthorizedError('API Key requerida');
  }
  
  // PASO 3: Obtener todas las claves válidas
  // Extraemos las claves de usuario del config , Si config.apiKeys es undefined, usamos array vacío
  const userKeys = config.apiKeys || [];
  
  // Extraemos las claves de admin del config
  const adminKeys = config.adminApiKeys || [];
  
  // Combinamos ambos arrays en uno solo usando spread operator , ValidKeys = ["user-key-1", "user-key-2", "admin-key-1", "admin-key-2"]
  const validKeys = [...userKeys, ...adminKeys];
  
  // PASO 4: Validar si la API Key es correcta
  // .includes() verifica si apiKey está en el array validKeys , Si no está en la lista → Error 401
  if (!validKeys.includes(apiKey)) {
    throw new UnauthorizedError('API Key inválida');
  }
  
  // PASO 5: Determinar si es admin
  // Añadimos una propiedad al objeto request , Esto permite que otros middlewares sepan si es admin , Si apiKey = "admin-key-1" → req.isAdmin = true , Si apiKey = "user-key-1" → req.isAdmin = false
  req.isAdmin = adminKeys.includes(apiKey);

  // PASO 6: Pasar al siguiente middleware
  // IMPORTANTE: Sin next() la petición se quedaría colgada, next() dice: "Este middleware terminó, continúa con el siguiente"
  next();
};
