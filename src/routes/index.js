import { Router } from 'express';
import aeropuertosRoutes from './aeropuertos.routes.js';
import aerolineasRoutes from './aerolineas.routes.js';
import pilotosRoutes from './pilotos.routes.js';
import vuelosRoutes from './vuelos.routes.js';
import pasajerosRoutes from './pasajeros.routes.js';
import { estadisticasController } from '../controllers/estadisticas.controller.js';
import { apiKeyMiddleware } from '../middlewares/apiKey.middleware.js';

const router = Router();

// Ruta de salud del API
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Rutas de recursos
router.use('/aeropuertos', aeropuertosRoutes);
router.use('/aerolineas', aerolineasRoutes);
router.use('/pilotos', pilotosRoutes);
router.use('/vuelos', vuelosRoutes);
router.use('/pasajeros', pasajerosRoutes);

// Rutas de estadísticas
router.get('/estadisticas', apiKeyMiddleware, estadisticasController.getGenerales);
router.get('/estadisticas/top-aerolineas', apiKeyMiddleware, estadisticasController.getTopAerolineas);
router.get('/estadisticas/top-pilotos', apiKeyMiddleware, estadisticasController.getTopPilotos);
router.get('/estadisticas/aeropuerto-mas-activo', apiKeyMiddleware, estadisticasController.getAeropuertoMasActivo);

export default router;