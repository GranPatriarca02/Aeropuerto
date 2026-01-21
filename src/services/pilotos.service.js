import { PilotosRepository } from '../repositories/pilotos.repository.mjs';
import { AerolineasRepository } from '../repositories/aerolineas.repository.mjs';
import { NotFoundError } from '../utils/errors.js';
import { redisClient } from '../config/redis.js';

const repo = new PilotosRepository();
const aerolineasRepo = new AerolineasRepository();
const CACHE_TTL = 300;

export class PilotosService {
  async getAll() {
    const cacheKey = 'pilotos:all';
    
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
    
    const pilotos = await repo.findAll();
    await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(pilotos));
    
    return pilotos;
  }

  async getById(id) {
    const piloto = await repo.findById(id);
    
    if (!piloto) {
      throw new NotFoundError('Piloto');
    }
    
    return piloto;
  }

  async getByAerolinea(idAerolinea) {
    // Verificar que la aerolínea existe
    const aerolinea = await aerolineasRepo.findById(idAerolinea);
    if (!aerolinea) {
      throw new NotFoundError('Aerolínea');
    }
    
    return await repo.findByAerolinea(idAerolinea);
  }

  async getTopPilotosByHoras(limit = 10) {
    const cacheKey = `pilotos:top:${limit}`;
    
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
    
    const pilotos = await repo.getTopPilotosByHoras(limit);
    await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(pilotos));
    
    return pilotos;
  }

  async create(pilotoData) {
    // Verificar que la aerolínea existe
    const aerolinea = await aerolineasRepo.findById(pilotoData.id_aerolinea);
    if (!aerolinea) {
      throw new NotFoundError('Aerolínea');
    }
    
    const piloto = await repo.create(pilotoData);
    await redisClient.del('pilotos:all');
    await redisClient.del(`pilotos:top:*`);
    
    return piloto;
  }

  async update(id, pilotoData) {
    await this.getById(id);
    
    if (pilotoData.id_aerolinea) {
      const aerolinea = await aerolineasRepo.findById(pilotoData.id_aerolinea);
      if (!aerolinea) {
        throw new NotFoundError('Aerolínea');
      }
    }
    
    const piloto = await repo.update(id, pilotoData);
    await redisClient.del('pilotos:all');
    await redisClient.del(`pilotos:top:*`);
    
    return piloto;
  }

  async delete(id) {
    await this.getById(id);
    await repo.delete(id);
    await redisClient.del('pilotos:all');
    
    return true;
  }
}