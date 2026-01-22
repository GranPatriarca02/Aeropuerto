import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';

const app = express();

// Middlewares globales
app.use(helmet()); // Seguridad HTTP
app.use(cors()); // CORS
app.use(express.json()); // Parse JSON
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded

// Logger simple
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rutas
app.use('/api', routes);

// Manejo de errores
app.use(notFoundHandler);
app.use(errorHandler);

export default app;