import { VuelosRepository } from '../repositories/vuelos.repository.mjs';
import { AeropuertosRepository } from '../repositories/aeropuertos.repository.mjs';
import { VuelosPilotosRepository } from '../repositories/vuelosPilotos.repository.mjs';
import { VuelosPasajerosRepository } from '../repositories/vuelosPasajeros.repository.mjs';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import { redisClient } from '../config/redis.js';

const repo = new VuelosRepository();
const aeropuertosRepo = new AeropuertosRepository();
const vuelosPilotosRepo = new VuelosPilotosRepository();
const vuelosPasajerosRepo = new VuelosPasajerosRepository();
const CACHE_TTL = 180;

export class VuelosService {
  async getAll() {
    const cacheKey = 'vuelos:all';
    
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
    
    const vuelos = await repo.findAll();
    await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(vuelos));
    
    return vuelos;
  }

  async getById(id) {
    const vuelo = await repo.findById(id);
    
    if (!vuelo) {
      throw new NotFoundError('Vuelo');
    }
    
    return vuelo;
  }

  async getByAeropuerto(idAeropuerto) {
    const aeropuerto = await aeropuertosRepo.findById(idAeropuerto);
    if (!aeropuerto) {
      throw new NotFoundError('Aeropuerto');
    }
    
    return await repo.findByAeropuerto(idAeropuerto);
  }

  async getByEstado(estado) {
    const estadosValidos = ['programado', 'en_vuelo', 'cancelado', 'finalizado'];
    if (!estadosValidos.includes(estado)) {
      throw new ValidationError('Estado no válido');
    }
    
    return await repo.findByEstado(estado);
  }

  async create(vueloData) {
    // Verificar aeropuertos
    const origen = await aeropuertosRepo.findById(vueloData.id_aeropuerto_origen);
    if (!origen) {
      throw new NotFoundError('Aeropuerto de origen');
    }
    
    const destino = await aeropuertosRepo.findById(vueloData.id_aeropuerto_destino);
    if (!destino) {
      throw new NotFoundError('Aeropuerto de destino');
    }
    
    if (vueloData.id_aeropuerto_origen === vueloData.id_aeropuerto_destino) {
      throw new ValidationError('El aeropuerto de origen y destino deben ser diferentes');
    }
    
    const vuelo = await repo.create(vueloData);
    await redisClient.del('vuelos:all');
    
    return vuelo;
  }

  async update(id, vueloData) {
    await this.getById(id);
    
    if (vueloData.id_aeropuerto_origen) {
      const origen = await aeropuertosRepo.findById(vueloData.id_aeropuerto_origen);
      if (!origen) {
        throw new NotFoundError('Aeropuerto de origen');
      }
    }
    
    if (vueloData.id_aeropuerto_destino) {
      const destino = await aeropuertosRepo.findById(vueloData.id_aeropuerto_destino);
      if (!destino) {
        throw new NotFoundError('Aeropuerto de destino');
      }
    }
    
    const vuelo = await repo.update(id, vueloData);
    await redisClient.del('vuelos:all');
    
    return vuelo;
  }

  async delete(id) {
    await this.getById(id);
    await repo.delete(id);
    await redisClient.del('vuelos:all');
    
    return true;
  }

  async getPilotos(idVuelo) {
    await this.getById(idVuelo);
    return await vuelosPilotosRepo.findByVuelo(idVuelo);
  }

  async getPasajeros(idVuelo) {
    await this.getById(idVuelo);
    return await vuelosPasajerosRepo.findByVuelo(idVuelo);
  }

  async asignarPiloto(idVuelo, idPiloto, rol) {
    await this.getById(idVuelo);
    
    const rolesValidos = ['capitan', 'copiloto'];
    if (!rolesValidos.includes(rol)) {
      throw new ValidationError('Rol no válido');
    }
    
    return await vuelosPilotosRepo.create({
      id_vuelo: idVuelo,
      id_piloto: idPiloto,
      rol
    });
  }

  async asignarPasajero(idVuelo, idPasajero, asiento) {
    await this.getById(idVuelo);
    
    return await vuelosPasajerosRepo.create({
      id_vuelo: idVuelo,
      id_pasajero: idPasajero,
      asiento
    });
  }
}