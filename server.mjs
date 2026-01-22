
// Importamos la aplicación Express ya configurada desde app.js
import app from './src/app.js';

// Importamos el objeto config que contiene todas las variables de entorno
import { config } from './src/config/index.js';

// Extraemos el puerto del objeto config (viene del archivo .env)
const PORT = config.port;

// Iniciamos el servidor en el puerto especificado
// .listen() es una función de Express que pone el servidor a "escuchar" peticiones
app.listen(PORT, () => {
  
 
  console.log('='.repeat(50));
  
  // Confirmamos que el servidor arrancó
  console.log('Servidor iniciado correctamente');
  
  // Mostramos en qué puerto está escuchando
  console.log(`Puerto: ${PORT}`);
  
  // Mostramos el entorno 
  console.log(`Entorno: ${config.nodeEnv}`);
  
  // Mostramos la URL completa donde podemos acceder a la API
  console.log(`URL: http://localhost:${PORT}/api`);
  

  console.log('='.repeat(50));
});
