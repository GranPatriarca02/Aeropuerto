
// Importamos Express (framework web para Node.js)
import express from 'express';

// Importamos CORS para permitir peticiones desde otros dominios
import cors from 'cors';

// Importamos Helmet para añadir seguridad HTTP
import helmet from 'helmet';

// Importamos todas las rutas de la aplicación
import routes from './routes/index.js';

// Importamos los middlewares de manejo de errores
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';

// Creamos la instancia de la aplicación Express
const app = express();

//  HELMET: Añade cabeceras de seguridad HTTP
app.use(helmet());

//  CORS: Permite peticiones desde otros orígenes
app.use(cors());

//  JSON PARSER: Convierte el body de las peticiones a JSON
app.use(express.json());

//  URL ENCODED: Para formularios HTML tradicionales
app.use(express.urlencoded({ extended: true }));

// 5. LOGGER SIMPLE: Registra cada petición en consola
app.use((req, res, next) => {

  // Muestra: "2025-01-22T10:30:00.000Z - GET /api/aeropuertos"
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  
  // IMPORTANTE: next() pasa al siguiente middleware .Sin esto, la petición se quedaría colgada
  next();
});

// Todas las rutas empiezan con /api
app.use('/api', routes);



// MANEJO DE ERRORES (se ejecutan AL FINAL)

//  404 NOT FOUND: Si ninguna ruta coincide
app.use(notFoundHandler);

//  ERROR HANDLER: Captura todos los errores
app.use(errorHandler);

// Exportamos la aplicación para usarla en server.mjs
export default app;
