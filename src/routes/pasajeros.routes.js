// Importamos Router
import { Router } from 'express';

// Importamos controlador
import { pasajerosController } from '../controllers/pasajeros.controller.js';

// Importamos middlewares
import { apiKeyMiddleware } from '../middlewares/apiKey.middleware.js';
import { adminMiddleware } from '../middlewares/admin.middleware.js';
import { validateSchema } from '../middlewares/validation.middleware.js';

// Importamos validaciones
import { 
  validateCreatePasajero, 
  validateUpdatePasajero 
} from '../validations/pasajero.validation.js';

// Creamos router
const router = Router();

// ====================================
// MIDDLEWARE GLOBAL
// ====================================
router.use(apiKeyMiddleware);

// ====================================
// RUTAS PÚBLICAS
// ====================================

// GET /api/pasajeros - Obtiene todos los pasajeros
router.get('/', pasajerosController.getAll);

// GET /api/pasajeros/:id - Obtiene un pasajero específico
router.get('/:id', pasajerosController.getById);

// ====================================
// RUTAS ADMINISTRATIVAS
// ====================================

// POST /api/pasajeros - Crea un nuevo pasajero
router.post(
  '/',
  adminMiddleware,
  validateSchema(validateCreatePasajero),   // Usa validación de creación
  pasajerosController.create
);

// PUT /api/pasajeros/:id - Actualiza un pasajero
router.put(
  '/:id',
  adminMiddleware,
  validateSchema(validateUpdatePasajero),   // Usa validación de actualización
  pasajerosController.update
);

// DELETE /api/pasajeros/:id - Elimina un pasajero
router.delete(
  '/:id',
  adminMiddleware,
  pasajerosController.delete
);

// Exportamos
export default router;