import { Router } from 'express';
import { pilotosController } from '../controllers/pilotos.controller.js';
import { apiKeyMiddleware } from '../middlewares/apiKey.middleware.js';
import { adminMiddleware } from '../middlewares/admin.middleware.js';
import { validateSchema } from '../middlewares/validation.middleware.js';
import { createPilotoSchema, updatePilotoSchema } from '../validations/piloto.validation.js';

const router = Router();

router.use(apiKeyMiddleware);

router.get('/', pilotosController.getAll);
router.get('/top', pilotosController.getTopByHoras);
router.get('/aerolinea/:idAerolinea', pilotosController.getByAerolinea);
router.get('/:id', pilotosController.getById);

router.post(
  '/',
  adminMiddleware,
  validateSchema(createPilotoSchema),
  pilotosController.create
);

router.put(
  '/:id',
  adminMiddleware,
  validateSchema(updatePilotoSchema),
  pilotosController.update
);

router.delete(
  '/:id',
  adminMiddleware,
  pilotosController.delete
);

export default router;