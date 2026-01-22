import { Router } from 'express';
import { pasajerosController } from '../controllers/pasajeros.controller.js';
import { apiKeyMiddleware } from '../middlewares/apiKey.middleware.js';
import { adminMiddleware } from '../middlewares/admin.middleware.js';
import { validateSchema } from '../middlewares/validation.middleware.js';
import { 
  validateCreatePasajero, 
  validateUpdatePasajero 
} from '../validations/pasajero.validation.js';

const router = Router();

router.use(apiKeyMiddleware);

router.get('/', pasajerosController.getAll);
router.get('/:id', pasajerosController.getById);

// Rutas admin
router.post(
  '/',
  adminMiddleware,
  validateSchema(validateCreatePasajero), // Usa la función de creación
  pasajerosController.create
);

router.put(
  '/:id',
  adminMiddleware,
  validateSchema(validateUpdatePasajero), // Usa la función de actualización
  pasajerosController.update
);

router.delete(
  '/:id',
  adminMiddleware,
  pasajerosController.delete
);

export default router;