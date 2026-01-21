import { createClient } from 'redis';
import { config } from './index.js';

const redisClient = createClient({
  socket: {
    host: config.redis.host,
    port: config.redis.port
  },
  password: config.redis.password || undefined
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  console.log('Redis conectado correctamente');
});

// Conectar al iniciar
await redisClient.connect();

export { redisClient };