import { Router } from 'express';
import { pasajerosController } from '../controllers/pasajeros.controller.js';
import { apiKeyMiddleware } from '../middlewares/apiKey.middleware.js';
import { adminMiddleware } from '../middlewares/admin.middleware.js';
import { validateSchema } from '../middlewares/validation.middleware.js';
import { createPasajeroSchema, updatePasajeroSchema } from '../validations/pasajero.validation.js';

const router = Router();

router.use(apiKeyMiddleware);

router.get('/', pasajerosController.getAll);
router.get('/:id', pasajerosController.getById);

router.post(
  '/',
  adminMiddleware,
  validateSchema(createPasajeroSchema),
  pasajerosController.create
);

router.put(
  '/:id',
  adminMiddleware,
  validateSchema(updatePasajeroSchema),
  pasajerosController.update
);

router.delete(
  '/:id',
  adminMiddleware,
  pasajerosController.delete
);

export default router;