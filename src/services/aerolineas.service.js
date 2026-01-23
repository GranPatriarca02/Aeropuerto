// ============================================
// ARCHIVO: src/services/aerolineas.service.js
// ============================================

// Importamos el repositorio (acceso a datos)
import { AerolineasRepository } from '../repositories/aerolineas.repository.mjs';

// Importamos errores personalizados
import { NotFoundError, ConflictError } from '../utils/errors.js';

// Importamos el cliente de Redis para caché
import { redisClient } from '../config/redis.js';

// Creamos UNA instancia del repositorio
const repo = new AerolineasRepository();

// TTL (Time To Live) del caché en segundos, 300 segundos = 5 minutos
const CACHE_TTL = 300;

// Exportamos la clase del servicio
export class AerolineasService {
  
  // GET ALL - Obtener todas las aerolíneas
  async getAll() {
    
    // PASO 1: Definir clave única para el caché
    const cacheKey = 'aerolineas:all';
    
    // PASO 2: Intentar obtener datos del caché, Redis.get() devuelve null si no existe la clave
    const cached = await redisClient.get(cacheKey);
    
    // PASO 3: Si hay datos en caché, devolverlos
    if (cached) {
      // Los datos están en formato string JSON, Necesitamos parsearlos a objeto JavaScript
      return JSON.parse(cached);
    }
    
    // PASO 4: Si NO hay caché, consultar base de datos
    const aerolineas = await repo.findAll();
    
    // PASO 5: Guardar en caché para la próxima consulta, setEx() = set con expiración automática
    await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(aerolineas));
    
    // PASO 6: Devolver los datos
    return aerolineas;
  }

  // GET BY ID - Obtener una aerolínea específica
  async getById(id) {
    
    // PASO 1: Consultar en el repositorio
    const aerolinea = await repo.findById(id);
    
    // PASO 2: Validar que existe, Si repo.findById devuelve null → no existe
    if (!aerolinea) {
      // Lanzamos error 404 personalizado, Este error será capturado por errorHandler
      throw new NotFoundError('Aerolínea');
    }
    
    // PASO 3: Si existe, devolverla
    return aerolinea;
  }

  // CREATE - Crear nueva aerolínea
  async create(aerolineaData) {
    
    // PASO 1: Validar que el código es único, Buscamos si ya existe otra aerolínea con ese código
    const existing = await repo.findByCodigo(aerolineaData.codigo);
    
    // PASO 2: Si ya existe, lanzar error
    if (existing) {
      // Error 409 Conflict
      throw new ConflictError('El código de aerolínea ya existe');
    }
    
    // PASO 3: Si no existe, crear la aerolínea
    const aerolinea = await repo.create(aerolineaData);
    
    // PASO 4: Invalidar el caché, Como hay una nueva aerolínea, la lista completa cambió
    await redisClient.del('aerolineas:all');
    
    // PASO 5: Devolver la aerolínea creada
    return aerolinea;
  }

  // UPDATE - Actualizar aerolínea existente
  async update(id, aerolineaData) {
    
    // PASO 1: Verificar que la aerolínea existe, getById lanza NotFoundError si no existe
    await this.getById(id);
    
    // PASO 2: Si se actualiza el código, validar unicidad
    if (aerolineaData.codigo) {
      
      // Buscar si otra aerolínea tiene ese código
      const existing = await repo.findByCodigo(aerolineaData.codigo);
      
      // Si existe Y no es la misma aerolínea
      if (existing && existing.id !== parseInt(id)) {
        // Error 409 Conflict
        throw new ConflictError('El código de aerolínea ya existe');
      }
    }
    
    // PASO 3: Actualizar en la base de datos
    const aerolinea = await repo.update(id, aerolineaData);
    
    // PASO 4: Invalidar el caché
    await redisClient.del('aerolineas:all');
    
    // PASO 5: Devolver la aerolínea actualizada
    return aerolinea;
  }

  // DELETE - Eliminar aerolínea
  async delete(id) {
    
    // PASO 1: Verificar que existe
    await this.getById(id);
    
    // PASO 2: Eliminar de la base de datos
    await repo.delete(id);
    
    // PASO 3: Invalidar el caché
    await redisClient.del('aerolineas:all');
    
    // PASO 4: Devolver true (éxito)
    return true;
  }
}