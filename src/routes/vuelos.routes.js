// Importamos Router
import { Router } from 'express';

// Importamos controlador
import { vuelosController } from '../controllers/vuelos.controller.js';

// Importamos middlewares
import { apiKeyMiddleware } from '../middlewares/apiKey.middleware.js';
import { adminMiddleware } from '../middlewares/admin.middleware.js';
import { validateSchema } from '../middlewares/validation.middleware.js';

// Importamos validación
import { validateVuelo } from '../validations/vuelo.validation.js';

// Creamos router
const router = Router();

// ====================================
// MIDDLEWARE GLOBAL
// ====================================
router.use(apiKeyMiddleware);

// ====================================
// RUTAS DE CONSULTA
// ====================================

// GET /api/vuelos - Obtiene todos los vuelos
router.get('/', vuelosController.getAll);

// GET /api/vuelos/aeropuerto/:idAeropuerto - Vuelos de un aeropuerto
// Esta ruta va ANTES de '/:id' para evitar que "aeropuerto" se interprete como ID
router.get('/aeropuerto/:idAeropuerto', vuelosController.getByAeropuerto);

// GET /api/vuelos/estado/:estado - Vuelos por estado
// Estados válidos: programado, en_vuelo, cancelado, finalizado
router.get('/estado/:estado', vuelosController.getByEstado);

// GET /api/vuelos/:id - Obtiene un vuelo específico
router.get('/:id', vuelosController.getById);

// GET /api/vuelos/:id/pilotos - Obtiene pilotos del vuelo
router.get('/:id/pilotos', vuelosController.getPilotos);

// GET /api/vuelos/:id/pasajeros - Obtiene pasajeros del vuelo
router.get('/:id/pasajeros', vuelosController.getPasajeros);

// ====================================
// RUTAS ADMINISTRATIVAS (POST)
// ====================================

// POST /api/vuelos - Crea un nuevo vuelo
router.post(
  '/',
  adminMiddleware,
  validateSchema(validateVuelo),        // isUpdate = false
  vuelosController.create
);

// POST /api/vuelos/:id/pilotos - Asigna un piloto al vuelo
// Body esperado: { "id_piloto": 5, "rol": "capitan" }
router.post(
  '/:id/pilotos',
  adminMiddleware,
  vuelosController.asignarPiloto
);

// POST /api/vuelos/:id/pasajeros - Asigna un pasajero al vuelo
// Body esperado: { "id_pasajero": 10, "asiento": "15A" }
router.post(
  '/:id/pasajeros',
  adminMiddleware,
  vuelosController.asignarPasajero
);

// ====================================
// RUTAS ADMINISTRATIVAS (PUT/DELETE)
// ====================================

// PUT /api/vuelos/:id - Actualiza un vuelo
router.put(
  '/:id',
  adminMiddleware,
  validateSchema(validateVuelo),        // isUpdate = true
  vuelosController.update
);

// DELETE /api/vuelos/:id - Elimina un vuelo
router.delete(
  '/:id',
  adminMiddleware,
  vuelosController.delete
);

// Exportamos
export default router;
