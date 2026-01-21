import { PasajerosRepository } from '../repositories/pasajeros.repository.mjs';
import { NotFoundError, ConflictError } from '../utils/errors.js';
import { redisClient } from '../config/redis.js';

const repo = new PasajerosRepository();
const CACHE_TTL = 300;

export class PasajerosService {
  async getAll() {
    const cacheKey = 'pasajeros:all';
    
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
    
    const pasajeros = await repo.findAll();
    await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(pasajeros));
    
    return pasajeros;
  }

  async getById(id) {
    const pasajero = await repo.findById(id);
    
    if (!pasajero) {
      throw new NotFoundError('Pasajero');
    }
    
    return pasajero;
  }

  async create(pasajeroData) {
    const existing = await repo.findByDocumento(pasajeroData.documento);
    if (existing) {
      throw new ConflictError('El documento ya está registrado');
    }
    
    const pasajero = await repo.create(pasajeroData);
    await redisClient.del('pasajeros:all');
    
    return pasajero;
  }

  async update(id, pasajeroData) {
    await this.getById(id);
    
    if (pasajeroData.documento) {
      const existing = await repo.findByDocumento(pasajeroData.documento);
      if (existing && existing.id !== parseInt(id)) {
        throw new ConflictError('El documento ya está registrado');
      }
    }
    
    const pasajero = await repo.update(id, pasajeroData);
    await redisClient.del('pasajeros:all');
    
    return pasajero;
  }

  async delete(id) {
    await this.getById(id);
    await repo.delete(id);
    await redisClient.del('pasajeros:all');
    
    return true;
  }
}