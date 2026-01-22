
// Importamos Router de Express para crear rutas
import { Router } from 'express';

// Importamos el controlador con toda la lógica
import { aeropuertosController } from '../controllers/aeropuertos.controller.js';

// Importamos los middlewares de seguridad
import { apiKeyMiddleware } from '../middlewares/apiKey.middleware.js';
import { adminMiddleware } from '../middlewares/admin.middleware.js';

// Importamos el middleware de validación
import { validateSchema } from '../middlewares/validation.middleware.js';

// Importamos la función de validación específica
import { validateAeropuerto } from '../validations/aeropuerto.validation.js';

// Creamos una instancia de Router
const router = Router();

// MIDDLEWARE GLOBAL DE ESTE ROUTER
// TODAS las rutas de este archivo requieren API Key, .use() aplica el middleware a todas las rutas del router
router.use(apiKeyMiddleware);

// Desde aquí, TODAS las rutas necesitan x-api-key válida , Si no hay API Key → Error 401 Unauthorized

// RUTAS PÚBLICAS (solo lectura)
// GET /api/aeropuertos
// Obtiene TODOS los aeropuertos , Requiere: x-api-key (user o admin)
router.get('/', aeropuertosController.getAll);

// GET /api/aeropuertos/:id
// Obtiene UN aeropuerto por ID
router.get('/:id', aeropuertosController.getById);


// RUTAS ADMINISTRATIVAS (requieren permisos admin)
// POST /api/aeropuertos , Crea un nuevo aeropuerto , Requiere: x-api-key de admin + body JSON válido
router.post(
  '/',                                    // Ruta
  adminMiddleware,                        // 1º: Verifica que sea admin
  validateSchema(validateAeropuerto),     // 2º: Valida el body
  aeropuertosController.create            // 3º: Ejecuta el controlador
);

// PUT /api/aeropuertos/:id , Actualiza un aeropuerto existente
router.put(
  '/:id',                                 // Ruta con parámetro
  adminMiddleware,                        // 1º: Verifica admin
  validateSchema(validateAeropuerto),     // 2º: Valida body (isUpdate=true)
  aeropuertosController.update            // 3º: Actualiza
);

// DELETE /api/aeropuertos/:id , Elimina un aeropuerto
router.delete(
  '/:id',                                 // Ruta con parámetro
  adminMiddleware,                        // Solo admin puede eliminar
  aeropuertosController.delete            // Ejecuta eliminación
);

// Exportamos el router para usarlo en routes/index.js
export default router;
