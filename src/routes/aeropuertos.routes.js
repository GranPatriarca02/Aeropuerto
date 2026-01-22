import { Router } from 'express';
import { aeropuertosController } from '../controllers/aeropuertos.controller.js';
import { apiKeyMiddleware } from '../middlewares/apiKey.middleware.js';
import { adminMiddleware } from '../middlewares/admin.middleware.js';
import { validateSchema } from '../middlewares/validation.middleware.js';
import { validateAeropuerto } from '../validations/aeropuerto.validation.js';

const router = Router();

router.use(apiKeyMiddleware);

router.get('/', aeropuertosController.getAll);
router.get('/:id', aeropuertosController.getById);

router.post(
  '/',
  adminMiddleware,
  validateSchema(validateAeropuerto), // Usamos la misma función
  aeropuertosController.create
);

router.put(
  '/:id',
  adminMiddleware,
  validateSchema(validateAeropuerto), // El middleware ahora es compatible
  aeropuertosController.update
);

router.delete(
  '/:id',
  adminMiddleware,
  aeropuertosController.delete
);

export default router;