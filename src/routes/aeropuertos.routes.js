import { Router } from 'express';
import { aeropuertosController } from '../controllers/aeropuertos.controller.js';
import { apiKeyMiddleware } from '../middlewares/apiKey.middleware.js';
import { adminMiddleware } from '../middlewares/admin.middleware.js';
import { validateSchema } from '../middlewares/validation.middleware.js';
import { createAeropuertoSchema, updateAeropuertoSchema } from '../validations/aeropuerto.validation.js';

const router = Router();

// Todas las rutas requieren API Key
router.use(apiKeyMiddleware);

// Rutas públicas (con API Key)
router.get('/', aeropuertosController.getAll);
router.get('/:id', aeropuertosController.getById);

// Rutas admin
router.post(
  '/',
  adminMiddleware,
  validateSchema(createAeropuertoSchema),
  aeropuertosController.create
);

router.put(
  '/:id',
  adminMiddleware,
  validateSchema(updateAeropuertoSchema),
  aeropuertosController.update
);

router.delete(
  '/:id',
  adminMiddleware,
  aeropuertosController.delete
);

export default router;