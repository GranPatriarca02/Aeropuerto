// Importamos el repositorio (acceso a datos)
import { PasajerosRepository } from '../repositories/pasajeros.repository.mjs';

// Importamos errores personalizados
import { NotFoundError, ConflictError } from '../utils/errors.js';

// Importamos el cliente de Redis para caché
import { redisClient } from '../config/redis.js';

// Creamos UNA instancia del repositorio
const repo = new PasajerosRepository();

// (Time To Live) del caché en segundos, 300 segundos = 5 minutos
const CACHE_TTL = 300;

// Exportamos la clase del servicio
export class PasajerosService {
  
  // GET ALL - Obtener todos los pasajeros
  async getAll() {
    
    // PASO 1: Definir clave única para el caché
    const cacheKey = 'pasajeros:all';
    
    // PASO 2: Intentar obtener datos del caché
    const cached = await redisClient.get(cacheKey);
    
    // PASO 3: Si hay datos en caché, devolverlos
    if (cached) {
      return JSON.parse(cached);
    }
    
    // PASO 4: Si NO hay caché, consultar base de datos
    const pasajeros = await repo.findAll();
    
    // PASO 5: Guardar en caché
    await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(pasajeros));
    
    // PASO 6: Devolver los datos
    return pasajeros;
  }

  // GET BY ID - Obtener un pasajero específico
  async getById(id) {
    
    // PASO 1: Consultar en el repositorio
    const pasajero = await repo.findById(id);
    
    // PASO 2: Validar que existe
    if (!pasajero) {
      throw new NotFoundError('Pasajero');
    }
    
    // PASO 3: Si existe, devolverlo
    return pasajero;
  }

  // CREATE - Crear nuevo pasajero
  async create(pasajeroData) {
    
    // PASO 1: Validar que el documento es único
    // No puede haber dos pasajeros con el mismo documento
    const existing = await repo.findByDocumento(pasajeroData.documento);
    
    // PASO 2: Si ya existe, lanzar error
    if (existing) {
      throw new ConflictError('El documento ya está registrado');
    }
    
    // PASO 3: Si no existe, crear el pasajero
    const pasajero = await repo.create(pasajeroData);
    
    // PASO 4: Invalidar el caché
    await redisClient.del('pasajeros:all');
    
    // PASO 5: Devolver el pasajero creado
    return pasajero;
  }

  // UPDATE - Actualizar pasajero existente
  async update(id, pasajeroData) {
    
    // PASO 1: Verificar que el pasajero existe
    await this.getById(id);
    
    // PASO 2: Si se actualiza el documento, validar unicidad
    if (pasajeroData.documento) {
      
      // Buscar si otro pasajero tiene ese documento
      const existing = await repo.findByDocumento(pasajeroData.documento);
      
      // Si existe Y no es el mismo pasajero
      if (existing && existing.id !== parseInt(id)) {
        throw new ConflictError('El documento ya está registrado');
      }
    }
    
    // PASO 3: Actualizar en la base de datos
    const pasajero = await repo.update(id, pasajeroData);
    
    // PASO 4: Invalidar el caché
    await redisClient.del('pasajeros:all');
    
    // PASO 5: Devolver el pasajero actualizado
    return pasajero;
  }

  // DELETE - Eliminar pasajero
  async delete(id) {
    
    // PASO 1: Verificar que existe
    await this.getById(id);
    
    // PASO 2: Eliminar de la base de datos
    await repo.delete(id);
    
    // PASO 3: Invalidar el caché
    await redisClient.del('pasajeros:all');
    
    // PASO 4: Devolver true (éxito)
    return true;
  }
}
