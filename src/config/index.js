
// Importamos dotenv para leer el archivo .env
import dotenv from 'dotenv';

// Cargamos las variables del archivo .env
dotenv.config();

// Exportamos un objeto con todas las configuraciones
export const config = {
  
  // CONFIGURACIÓN DEL SERVIDOR
  // Puerto donde se ejecutará el servidor ,Si no está en .env, usa 3000 por defecto
  port: process.env.PORT || 3000,
  
  // Entorno de ejecución
  // Afecta al nivel de logging y manejo de errores
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // CONFIGURACIÓN DE SUPABASE (Base de datos)
  
  supabase: {
    // URL del proyecto en Supabase
    url: process.env.SUPABASE_URL,
    
    // API Key anónima de Supabase 
    key: process.env.SUPABASE_KEY
  },
  
  // CONFIGURACIÓN DE REDIS (Caché)
  redis: {
    // Dirección del servidor Redis
    // localhost si está en tu máquina
    host: process.env.REDIS_HOST || 'localhost',
    
    // Puerto donde escucha Redis 
    port: process.env.REDIS_PORT || 6379,
    
    // Contraseña de Redis (vacía por defecto en local)
    password: process.env.REDIS_PASSWORD || ''
  },
  
  // API KEYS PARA AUTENTICACIÓN
  // Claves de usuario normal (solo lectura)
  apiKeys: process.env.API_KEYS?.split(',') || [],
  
  // Claves de administrador (lectura + escritura)
  adminApiKeys: process.env.ADMIN_API_KEYS?.split(',') || []
};
