import { Router } from 'express';
import { aerolineasController } from '../controllers/aerolineas.controller.js';
import { apiKeyMiddleware } from '../middlewares/apiKey.middleware.js';
import { adminMiddleware } from '../middlewares/admin.middleware.js';
import { validateSchema } from '../middlewares/validation.middleware.js';
import { validateCreateAerolinea } from '../validations/aerolinea.validation.js';

const router = Router();

router.use(apiKeyMiddleware);

router.get('/', aerolineasController.getAll);
router.get('/:id', aerolineasController.getById);

router.post(
  '/',
  adminMiddleware,
  validateSchema(validateCreateAerolinea), // Usamos la misma función
  aerolineasController.create
);

router.put(
  '/:id',
  adminMiddleware,
  validateSchema(validateCreateAerolinea), // El middleware ahora es compatible
  aerolineasController.update
);

router.delete(
  '/:id',
  adminMiddleware,
  aerolineasController.delete
);

export default router;