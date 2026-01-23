// Importamos Router
import { Router } from 'express';

// Importamos controlador
import { pilotosController } from '../controllers/pilotos.controller.js';

// Importamos middlewares
import { apiKeyMiddleware } from '../middlewares/apiKey.middleware.js';
import { adminMiddleware } from '../middlewares/admin.middleware.js';
import { validateSchema } from '../middlewares/validation.middleware.js';

// Importamos validación
import { validatePiloto } from '../validations/piloto.validation.js';

// Creamos router
const router = Router();

// ====================================
// MIDDLEWARE GLOBAL
// ====================================
router.use(apiKeyMiddleware);

// ====================================
// RUTAS DE CONSULTA
// ====================================

// GET /api/pilotos - Obtiene todos los pilotos
router.get('/', pilotosController.getAll);

// GET /api/pilotos/top - Top pilotos por horas de vuelo
// IMPORTANTE: Esta ruta va ANTES de '/:id' para evitar conflictos
// Si estuviera después, Express interpretaría "top" como un ID
router.get('/top', pilotosController.getTopByHoras);

// GET /api/pilotos/aerolinea/:idAerolinea - Pilotos de una aerolínea
router.get('/aerolinea/:idAerolinea', pilotosController.getByAerolinea);

// GET /api/pilotos/:id - Obtiene un piloto específico
router.get('/:id', pilotosController.getById);

// ====================================
// RUTAS ADMINISTRATIVAS
// ====================================

// POST /api/pilotos - Crea un nuevo piloto
router.post(
  '/',
  adminMiddleware,
  validateSchema(validatePiloto),       // isUpdate será false
  pilotosController.create
);

// PUT /api/pilotos/:id - Actualiza un piloto
router.put(
  '/:id',
  adminMiddleware,
  validateSchema(validatePiloto),       // isUpdate será true
  pilotosController.update
);

// DELETE /api/pilotos/:id - Elimina un piloto
router.delete(
  '/:id',
  adminMiddleware,
  pilotosController.delete
);

// Exportamos
export default router;