// Importamos el cliente de Redis
import { createClient } from 'redis';

// Importamos la configuración
import { config } from './index.js';

// PASO 1: Crear el cliente de Redis
// createClient() crea una nueva instancia del cliente
const redisClient = createClient({
  
  // Configuración de conexión
  socket: {
    // Host donde está Redis (localhost en desarrollo)
    host: config.redis.host,
    
    // Puerto de Redis (por defecto 6379)
    port: config.redis.port
  },
  
  // Contraseña de Redis (si existe)
  // undefined = sin contraseña
  password: config.redis.password || undefined
});

// EVENTOS DEL CLIENTE REDIS

// PASO 2: Manejar errores de conexión, Este evento se dispara cuando hay un error
redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

// PASO 3: Confirmar conexión exitosa, Este evento se dispara cuando se conecta correctamente
redisClient.on('connect', () => {
  console.log('Redis conectado correctamente');
});

// CONECTAR AL SERVIDOR REDIS

// PASO 4: Establecer conexión, await porque connect() es asíncrono
// Esta línea se ejecuta cuando se carga el módulo
await redisClient.connect();

// PASO 5: Exportar el cliente para usarlo en otros archivos
// Ahora podemos hacer: import { redisClient } from './config/redis.js'
export { redisClient };