
// Importamos el repositorio (acceso a datos)
import { AeropuertosRepository } from '../repositories/aeropuertos.repository.mjs';

// Importamos errores personalizados
import { NotFoundError, ConflictError } from '../utils/errors.js';

// Importamos el cliente de Redis para caché
import { redisClient } from '../config/redis.js';

// Creamos UNA instancia del repositorio
const repo = new AeropuertosRepository();

// (Time To Live) del caché en segundos , 300 segundos = 5 minutos
const CACHE_TTL = 300;

// Exportamos la clase del servicio
export class AeropuertosService {
  
  // GET ALL - Obtener todos los aeropuertos
  async getAll() {
    
    // PASO 1: Definir clave única para el caché
    const cacheKey = 'aeropuertos:all';
    
    // PASO 2: Intentar obtener datos del caché, Redis.get() devuelve null si no existe la clave
    const cached = await redisClient.get(cacheKey);
    
    // PASO 3: Si hay datos en caché, devolverlos
    if (cached) {
      // Los datos están en formato string JSON, Necesitamos parsearlos a objeto JavaScript
      return JSON.parse(cached);
    }
    
    // PASO 4: Si NO hay caché, consultar base de datos
    const aeropuertos = await repo.findAll();
    
    // PASO 5: Guardar en caché para la próxima consulta, setEx() = set con expiración automática, Después de 300 segundos, Redis elimina esta clave
    await redisClient.setEx(
      cacheKey,                           // Clave
      CACHE_TTL,                          // Tiempo de vida (300s)
      JSON.stringify(aeropuertos)         // Valor (en JSON string)
    );
    
    // PASO 6: Devolver los datos
    return aeropuertos;
  }

  // GET BY ID - Obtener un aeropuerto específico
  async getById(id) {
    
    // PASO 1: Consultar en el repositorio
    const aeropuerto = await repo.findById(id);
    
    // PASO 2: Validar que existe, Si repo.findById devuelve null → no existe
    if (!aeropuerto) {
      // Lanzamos error 404 personalizado, Este error será capturado por errorHandler
      throw new NotFoundError('Aeropuerto');
    }
    // PASO 3: Si existe, devolverlo
    return aeropuerto;
  }

  // CREATE - Crear nuevo aeropuerto
  async create(aeropuertoData) {
    
    // PASO 1: Validar que el código IATA es único,  Buscamos si ya existe otro aeropuerto con ese código
    const existing = await repo.findByCodigoIata(aeropuertoData.codigo_iata);
    
    // PASO 2: Si ya existe, lanzar error
    if (existing) {
      // Error 409 Conflict
      throw new ConflictError('El código IATA ya existe');
    }
    
    // PASO 3: Si no existe, crear el aeropuerto
    const aeropuerto = await repo.create(aeropuertoData);
    
    // PASO 4: Invalidar el caché, Como hay un nuevo aeropuerto, la lista completa cambió
    // Eliminamos la clave del caché para que se recargue
    await redisClient.del('aeropuertos:all');
    // La próxima consulta getAll() obtendrá datos frescos

    // PASO 5: Devolver el aeropuerto creado
    return aeropuerto;
  }

  // UPDATE - Actualizar aeropuerto existente
  async update(id, aeropuertoData) {
    
    // PASO 1: Verificar que el aeropuerto existe, getById lanza NotFoundError si no existe
    await this.getById(id);
    
    // PASO 2: Si se actualiza el código IATA, validar unicidad
    if (aeropuertoData.codigo_iata) {
      
      // Buscar si otro aeropuerto tiene ese código
      const existing = await repo.findByCodigoIata(aeropuertoData.codigo_iata);
      
      // Si existe Y no es el mismo aeropuerto
      if (existing && existing.id !== parseInt(id)) {
        // Error 409 Conflict
        throw new ConflictError('El código IATA ya existe');
      }
    }
    
    // PASO 3: Actualizar en la base de datos
    const aeropuerto = await repo.update(id, aeropuertoData);
    
    // PASO 4: Invalidar el caché
    await redisClient.del('aeropuertos:all');
    
    // PASO 5: Devolver el aeropuerto actualizado
    return aeropuerto;
  }

  // DELETE - Eliminar aeropuerto
  async delete(id) {
    
    // PASO 1: Verificar que existe
    await this.getById(id);
    
    // PASO 2: Eliminar de la base de datos
    await repo.delete(id);
    
    // PASO 3: Invalidar el caché
    await redisClient.del('aeropuertos:all');
    
    // PASO 4: Devolver true (éxito)
    return true;
  }
}