import { AeropuertosRepository } from '../repositories/aeropuertos.repository.mjs';
import { NotFoundError, ConflictError } from '../utils/errors.js';
import { redisClient } from '../config/redis.js';

const repo = new AeropuertosRepository();
const CACHE_TTL = 300; // 5 minutos

export class AeropuertosService {
  async getAll() {
    const cacheKey = 'aeropuertos:all';
    
    // Intentar obtener del caché
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
    
    const aeropuertos = await repo.findAll();
    
    // Guardar en caché
    await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(aeropuertos));
    
    return aeropuertos;
  }

  async getById(id) {
    const aeropuerto = await repo.findById(id);
    
    if (!aeropuerto) {
      throw new NotFoundError('Aeropuerto');
    }
    
    return aeropuerto;
  }

  async create(aeropuertoData) {
    // Verificar código IATA único
    const existing = await repo.findByCodigoIata(aeropuertoData.codigo_iata);
    if (existing) {
      throw new ConflictError('El código IATA ya existe');
    }
    
    const aeropuerto = await repo.create(aeropuertoData);
    
    // Invalidar caché
    await redisClient.del('aeropuertos:all');
    
    return aeropuerto;
  }

  async update(id, aeropuertoData) {
    await this.getById(id); // Verificar existencia
    
    // Si se actualiza el código IATA, verificar unicidad
    if (aeropuertoData.codigo_iata) {
      const existing = await repo.findByCodigoIata(aeropuertoData.codigo_iata);
      if (existing && existing.id !== parseInt(id)) {
        throw new ConflictError('El código IATA ya existe');
      }
    }
    
    const aeropuerto = await repo.update(id, aeropuertoData);
    
    // Invalidar caché
    await redisClient.del('aeropuertos:all');
    
    return aeropuerto;
  }

  async delete(id) {
    await this.getById(id); // Verificar existencia
    
    await repo.delete(id);
    
    // Invalidar caché
    await redisClient.del('aeropuertos:all');
    
    return true;
  }
}