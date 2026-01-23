// Importamos Router
import { Router } from 'express';

// Importamos todos los routers de recursos
import aeropuertosRoutes from './aeropuertos.routes.js';
import aerolineasRoutes from './aerolineas.routes.js';
import pilotosRoutes from './pilotos.routes.js';
import vuelosRoutes from './vuelos.routes.js';
import pasajerosRoutes from './pasajeros.routes.js';

// Importamos el controlador de estadísticas
import { estadisticasController } from '../controllers/estadisticas.controller.js';

// Importamos middleware de API Key
import { apiKeyMiddleware } from '../middlewares/apiKey.middleware.js';

// Creamos el router principal
const router = Router();

// ====================================
// RUTA DE SALUD (Health Check)
// ====================================
// Esta ruta NO requiere API Key
// Útil para verificar que el servidor está funcionando
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// ====================================
// RUTAS DE RECURSOS
// ====================================
// Cada uno de estos routers maneja su propio conjunto de rutas
// Ejemplo: /api/aeropuertos, /api/aeropuertos/:id, etc.

router.use('/aeropuertos', aeropuertosRoutes);
router.use('/aerolineas', aerolineasRoutes);
router.use('/pilotos', pilotosRoutes);
router.use('/vuelos', vuelosRoutes);
router.use('/pasajeros', pasajerosRoutes);

// ====================================
// RUTAS DE ESTADÍSTICAS
// ====================================
// Todas requieren API Key

// GET /api/estadisticas - Estadísticas generales del sistema
router.get('/estadisticas', apiKeyMiddleware, estadisticasController.getGenerales);

// GET /api/estadisticas/top-aerolineas - Top aerolíneas por vuelos
// Query param opcional: ?limit=5
router.get('/estadisticas/top-aerolineas', apiKeyMiddleware, estadisticasController.getTopAerolineas);

// GET /api/estadisticas/top-pilotos - Top pilotos por horas
// Query param opcional: ?limit=10
router.get('/estadisticas/top-pilotos', apiKeyMiddleware, estadisticasController.getTopPilotos);

// GET /api/estadisticas/aeropuerto-mas-activo - Aeropuerto con más vuelos
router.get('/estadisticas/aeropuerto-mas-activo', apiKeyMiddleware, estadisticasController.getAeropuertoMasActivo);

// Exportamos el router principal
export default router;