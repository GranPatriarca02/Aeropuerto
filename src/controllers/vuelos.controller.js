import { Router } from 'express';
import { vuelosController } from '../controllers/vuelos.controller.js';
import { apiKeyMiddleware } from '../middlewares/apiKey.middleware.js';
import { adminMiddleware } from '../middlewares/admin.middleware.js';
import { validateSchema } from '../middlewares/validation.middleware.js';
import { createVueloSchema, updateVueloSchema } from '../validations/vuelo.validation.js';

const router = Router();

router.use(apiKeyMiddleware);

router.get('/', vuelosController.getAll);
router.get('/aeropuerto/:idAeropuerto', vuelosController.getByAeropuerto);
router.get('/estado/:estado', vuelosController.getByEstado);
router.get('/:id', vuelosController.getById);
router.get('/:id/pilotos', vuelosController.getPilotos);
router.get('/:id/pasajeros', vuelosController.getPasajeros);

router.post(
  '/',
  adminMiddleware,
  validateSchema(createVueloSchema),
  vuelosController.create
);

router.post(
  '/:id/pilotos',
  adminMiddleware,
  vuelosController.asignarPiloto
);

router.post(
  '/:id/pasajeros',
  adminMiddleware,
  vuelosController.asignarPasajero
);

router.put(
  '/:id',
  adminMiddleware,
  validateSchema(updateVueloSchema),
  vuelosController.update
);

router.delete(
  '/:id',
  adminMiddleware,
  vuelosController.delete
);

export default router;