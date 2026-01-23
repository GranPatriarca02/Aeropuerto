// Importamos el repositorio de pilotos
import { PilotosRepository } from '../repositories/pilotos.repository.mjs';

// Importamos el repositorio de aerolíneas (para validaciones)
import { AerolineasRepository } from '../repositories/aerolineas.repository.mjs';

// Importamos errores personalizados
import { NotFoundError } from '../utils/errors.js';

// Importamos el cliente de Redis para caché
import { redisClient } from '../config/redis.js';

// Creamos instancias de los repositorios
const repo = new PilotosRepository();
const aerolineasRepo = new AerolineasRepository();

// (Time To Live) del caché en segundos, 300 segundos = 5 minutos
const CACHE_TTL = 300;

// Exportamos la clase del servicio
export class PilotosService {
  
  // GET ALL - Obtener todos los pilotos
  async getAll() {
    
    // PASO 1: Definir clave única para el caché
    const cacheKey = 'pilotos:all';
    
    // PASO 2: Intentar obtener datos del caché
    const cached = await redisClient.get(cacheKey);
    
    // PASO 3: Si hay datos en caché, devolverlos
    if (cached) {
      return JSON.parse(cached);
    }
    
    // PASO 4: Si NO hay caché, consultar base de datos
    const pilotos = await repo.findAll();
    
    // PASO 5: Guardar en caché
    await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(pilotos));
    
    // PASO 6: Devolver los datos
    return pilotos;
  }

  // GET BY ID - Obtener un piloto específico
  async getById(id) {
    
    // PASO 1: Consultar en el repositorio
    const piloto = await repo.findById(id);
    
    // PASO 2: Validar que existe
    if (!piloto) {
      throw new NotFoundError('Piloto');
    }
    
    // PASO 3: Si existe, devolverlo
    return piloto;
  }

  // GET BY AEROLINEA - Obtener pilotos de una aerolínea
  async getByAerolinea(idAerolinea) {
    
    // PASO 1: Verificar que la aerolínea existe
    // Si no existe, lanzará NotFoundError
    const aerolinea = await aerolineasRepo.findById(idAerolinea);
    if (!aerolinea) {
      throw new NotFoundError('Aerolínea');
    }
    
    // PASO 2: Obtener pilotos de esa aerolínea
    return await repo.findByAerolinea(idAerolinea);
  }

  // GET TOP PILOTOS BY HORAS - Top pilotos por horas de vuelo
  async getTopPilotosByHoras(limit = 10) {
    
    // PASO 1: Definir clave de caché con el límite
    // Ejemplo: 'pilotos:top:10' o 'pilotos:top:5'
    const cacheKey = `pilotos:top:${limit}`;
    
    // PASO 2: Intentar obtener del caché
    const cached = await redisClient.get(cacheKey);
    
    // PASO 3: Si hay caché, devolver
    if (cached) {
      return JSON.parse(cached);
    }
    
    // PASO 4: Si no hay caché, consultar
    const pilotos = await repo.getTopPilotosByHoras(limit);
    
    // PASO 5: Guardar en caché
    await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(pilotos));
    
    // PASO 6: Devolver datos
    return pilotos;
  }

  // CREATE - Crear nuevo piloto
  async create(pilotoData) {
    
    // PASO 1: Verificar que la aerolínea existe
    // Un piloto DEBE pertenecer a una aerolínea válida
    const aerolinea = await aerolineasRepo.findById(pilotoData.id_aerolinea);
    if (!aerolinea) {
      throw new NotFoundError('Aerolínea');
    }
    
    // PASO 2: Crear el piloto
    const piloto = await repo.create(pilotoData);
    
    // PASO 3: Invalidar cachés relacionados
    // Invalidamos lista completa
    await redisClient.del('pilotos:all');
    // Invalidamos todos los tops (usando wildcard pattern)
    await redisClient.del('pilotos:top:*');
    
    // PASO 4: Devolver el piloto creado
    return piloto;
  }

  // UPDATE - Actualizar piloto existente
  async update(id, pilotoData) {
    
    // PASO 1: Verificar que el piloto existe
    await this.getById(id);
    
    // PASO 2: Si se cambia de aerolínea, verificar que existe
    if (pilotoData.id_aerolinea) {
      const aerolinea = await aerolineasRepo.findById(pilotoData.id_aerolinea);
      if (!aerolinea) {
        throw new NotFoundError('Aerolínea');
      }
    }
    
    // PASO 3: Actualizar en la base de datos
    const piloto = await repo.update(id, pilotoData);
    
    // PASO 4: Invalidar cachés
    await redisClient.del('pilotos:all');
    await redisClient.del('pilotos:top:*');
    
    // PASO 5: Devolver el piloto actualizado
    return piloto;
  }

  // DELETE - Eliminar piloto
  async delete(id) {
    
    // PASO 1: Verificar que existe
    await this.getById(id);
    
    // PASO 2: Eliminar de la base de datos
    await repo.delete(id);
    
    // PASO 3: Invalidar caché
    await redisClient.del('pilotos:all');
    
    // PASO 4: Devolver true (éxito)
    return true;
  }
}