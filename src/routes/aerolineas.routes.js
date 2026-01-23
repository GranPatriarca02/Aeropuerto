// Importamos Router de Express
import { Router } from 'express';

// Importamos el controlador
import { aerolineasController } from '../controllers/aerolineas.controller.js';

// Importamos middlewares
import { apiKeyMiddleware } from '../middlewares/apiKey.middleware.js';
import { adminMiddleware } from '../middlewares/admin.middleware.js';
import { validateSchema } from '../middlewares/validation.middleware.js';

// Importamos la validación
import { validateAerolinea } from '../validations/aerolinea.validation.js';

// Creamos router
const router = Router();

// ====================================
// MIDDLEWARE GLOBAL
// ====================================
// Todas las rutas requieren API Key
router.use(apiKeyMiddleware);

// ====================================
// RUTAS PÚBLICAS
// ====================================

// GET /api/aerolineas - Obtiene todas las aerolíneas
router.get('/', aerolineasController.getAll);

// GET /api/aerolineas/:id - Obtiene una aerolínea por ID
router.get('/:id', aerolineasController.getById);

// ====================================
// RUTAS ADMINISTRATIVAS
// ====================================

// POST /api/aerolineas - Crea una nueva aerolínea
router.post(
  '/',
  adminMiddleware,                      // Verifica admin
  validateSchema(validateAerolinea),    // Valida datos
  aerolineasController.create           // Crea
);

// PUT /api/aerolineas/:id - Actualiza una aerolínea
router.put(
  '/:id',
  adminMiddleware,
  validateSchema(validateAerolinea),
  aerolineasController.update
);

// DELETE /api/aerolineas/:id - Elimina una aerolínea
router.delete(
  '/:id',
  adminMiddleware,
  aerolineasController.delete
);

// Exportamos el router
export default router;