import { AerolineasRepository } from '../repositories/aerolineas.repository.mjs';
import { NotFoundError, ConflictError } from '../utils/errors.js';
import { redisClient } from '../config/redis.js';

const repo = new AerolineasRepository();
const CACHE_TTL = 300;

export class AerolineasService {
  async getAll() {
    const cacheKey = 'aerolineas:all';
    
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
    
    const aerolineas = await repo.findAll();
    await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(aerolineas));
    
    return aerolineas;
  }

  async getById(id) {
    const aerolinea = await repo.findById(id);
    
    if (!aerolinea) {
      throw new NotFoundError('Aerolínea');
    }
    
    return aerolinea;
  }

  async create(aerolineaData) {
    const existing = await repo.findByCodigo(aerolineaData.codigo);
    if (existing) {
      throw new ConflictError('El código de aerolínea ya existe');
    }
    
    const aerolinea = await repo.create(aerolineaData);
    await redisClient.del('aerolineas:all');
    
    return aerolinea;
  }

  async update(id, aerolineaData) {
    await this.getById(id);
    
    if (aerolineaData.codigo) {
      const existing = await repo.findByCodigo(aerolineaData.codigo);
      if (existing && existing.id !== parseInt(id)) {
        throw new ConflictError('El código de aerolínea ya existe');
      }
    }
    
    const aerolinea = await repo.update(id, aerolineaData);
    await redisClient.del('aerolineas:all');
    
    return aerolinea;
  }

  async delete(id) {
    await this.getById(id);
    await repo.delete(id);
    await redisClient.del('aerolineas:all');
    
    return true;
  }
}