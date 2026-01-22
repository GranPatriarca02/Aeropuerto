import { Router } from 'express';
import { pilotosController } from '../controllers/pilotos.controller.js';
import { apiKeyMiddleware } from '../middlewares/apiKey.middleware.js';
import { adminMiddleware } from '../middlewares/admin.middleware.js';
import { validateSchema } from '../middlewares/validation.middleware.js';
import { validatePiloto } from '../validations/piloto.validation.js';

const router = Router();

router.use(apiKeyMiddleware);

// Rutas de consulta
router.get('/', pilotosController.getAll);
router.get('/top', pilotosController.getTopByHoras);
router.get('/aerolinea/:idAerolinea', pilotosController.getByAerolinea);
router.get('/:id', pilotosController.getById);

// Rutas administrativas
router.post(
  '/',
  adminMiddleware,
  validateSchema(validatePiloto), // isUpdate será false internamente
  pilotosController.create
);

router.put(
  '/:id',
  adminMiddleware,
  validateSchema(validatePiloto), // isUpdate será true internamente
  pilotosController.update
);

router.delete(
  '/:id',
  adminMiddleware,
  pilotosController.delete
);

export default router;