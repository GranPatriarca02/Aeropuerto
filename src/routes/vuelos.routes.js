import { Router } from 'express';
import { vuelosController } from '../controllers/vuelos.controller.js';
import { apiKeyMiddleware } from '../middlewares/apiKey.middleware.js';
import { adminMiddleware } from '../middlewares/admin.middleware.js';
import { validateSchema } from '../middlewares/validation.middleware.js';
import { validateVuelo } from '../validations/vuelo.validation.js';

const router = Router();

router.use(apiKeyMiddleware);

// Rutas de consulta
router.get('/', vuelosController.getAll);
router.get('/aeropuerto/:idAeropuerto', vuelosController.getByAeropuerto);
router.get('/estado/:estado', vuelosController.getByEstado);
router.get('/:id', vuelosController.getById);
router.get('/:id/pilotos', vuelosController.getPilotos);
router.get('/:id/pasajeros', vuelosController.getPasajeros);

// Rutas administrativas (POST)
router.post(
  '/',
  adminMiddleware,
  validateSchema(validateVuelo), // isUpdate = false
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

// Rutas administrativas (PUT/DELETE)
router.put(
  '/:id',
  adminMiddleware,
  validateSchema(validateVuelo), // isUpdate = true
  vuelosController.update
);

router.delete(
  '/:id',
  adminMiddleware,
  vuelosController.delete
);

export default router;