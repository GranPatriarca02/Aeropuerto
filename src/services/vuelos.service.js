// Importamos repositorios necesarios
import { VuelosRepository } from '../repositories/vuelos.repository.mjs';
import { AeropuertosRepository } from '../repositories/aeropuertos.repository.mjs';
import { VuelosPilotosRepository } from '../repositories/vuelosPilotos.repository.mjs';
import { VuelosPasajerosRepository } from '../repositories/vuelosPasajeros.repository.mjs';

// Importamos errores personalizados
import { NotFoundError, ValidationError } from '../utils/errors.js';

// Importamos el cliente de Redis
import { redisClient } from '../config/redis.js';

// Creamos instancias de los repositorios
const repo = new VuelosRepository();
const aeropuertosRepo = new AeropuertosRepository();
const vuelosPilotosRepo = new VuelosPilotosRepository();
const vuelosPasajerosRepo = new VuelosPasajerosRepository();

// TTL más corto (3 minutos) porque los vuelos cambian frecuentemente
const CACHE_TTL = 180;

// Exportamos la clase del servicio
export class VuelosService {
  
  // GET ALL - Obtener todos los vuelos
  async getAll() {
    
    // PASO 1: Definir clave de caché
    const cacheKey = 'vuelos:all';
    
    // PASO 2: Intentar obtener del caché
    const cached = await redisClient.get(cacheKey);
    
    // PASO 3: Si hay caché, devolver
    if (cached) {
      return JSON.parse(cached);
    }
    
    // PASO 4: Consultar base de datos
    const vuelos = await repo.findAll();
    
    // PASO 5: Guardar en caché
    await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(vuelos));
    
    // PASO 6: Devolver datos
    return vuelos;
  }

  // GET BY ID - Obtener un vuelo específico
  async getById(id) {
    
    // PASO 1: Consultar en el repositorio
    const vuelo = await repo.findById(id);
    
    // PASO 2: Validar que existe
    if (!vuelo) {
      throw new NotFoundError('Vuelo');
    }
    
    // PASO 3: Devolver el vuelo
    return vuelo;
  }

  // GET BY AEROPUERTO - Obtener vuelos de un aeropuerto
  async getByAeropuerto(idAeropuerto) {
    
    // PASO 1: Verificar que el aeropuerto existe
    const aeropuerto = await aeropuertosRepo.findById(idAeropuerto);
    if (!aeropuerto) {
      throw new NotFoundError('Aeropuerto');
    }
    
    // PASO 2: Obtener vuelos (origen o destino)
    return await repo.findByAeropuerto(idAeropuerto);
  }

  // GET BY ESTADO - Obtener vuelos por estado
  async getByEstado(estado) {
    
    // PASO 1: Validar que el estado es válido
    // Estados permitidos: programado, en_vuelo, cancelado, finalizado
    const estadosValidos = ['programado', 'en_vuelo', 'cancelado', 'finalizado'];
    if (!estadosValidos.includes(estado)) {
      throw new ValidationError('Estado no válido');
    }
    
    // PASO 2: Obtener vuelos con ese estado
    return await repo.findByEstado(estado);
  }

  // CREATE - Crear nuevo vuelo
  async create(vueloData) {
    
    // PASO 1: Verificar que el aeropuerto de origen existe
    const origen = await aeropuertosRepo.findById(vueloData.id_aeropuerto_origen);
    if (!origen) {
      throw new NotFoundError('Aeropuerto de origen');
    }
    
    // PASO 2: Verificar que el aeropuerto de destino existe
    const destino = await aeropuertosRepo.findById(vueloData.id_aeropuerto_destino);
    if (!destino) {
      throw new NotFoundError('Aeropuerto de destino');
    }
    
    // PASO 3: Validar que origen y destino son diferentes
    // Un vuelo no puede salir y llegar al mismo aeropuerto
    if (vueloData.id_aeropuerto_origen === vueloData.id_aeropuerto_destino) {
      throw new ValidationError('El aeropuerto de origen y destino deben ser diferentes');
    }
    
    // PASO 4: Crear el vuelo
    const vuelo = await repo.create(vueloData);
    
    // PASO 5: Invalidar caché
    await redisClient.del('vuelos:all');
    
    // PASO 6: Devolver el vuelo creado
    return vuelo;
  }

  // UPDATE - Actualizar vuelo existente
  async update(id, vueloData) {
    
    // PASO 1: Verificar que el vuelo existe
    await this.getById(id);
    
    // PASO 2: Si se cambia el aeropuerto de origen, verificar que existe
    if (vueloData.id_aeropuerto_origen) {
      const origen = await aeropuertosRepo.findById(vueloData.id_aeropuerto_origen);
      if (!origen) {
        throw new NotFoundError('Aeropuerto de origen');
      }
    }
    
    // PASO 3: Si se cambia el aeropuerto de destino, verificar que existe
    if (vueloData.id_aeropuerto_destino) {
      const destino = await aeropuertosRepo.findById(vueloData.id_aeropuerto_destino);
      if (!destino) {
        throw new NotFoundError('Aeropuerto de destino');
      }
    }
    
    // PASO 4: Actualizar en la base de datos
    const vuelo = await repo.update(id, vueloData);
    
    // PASO 5: Invalidar caché
    await redisClient.del('vuelos:all');
    
    // PASO 6: Devolver el vuelo actualizado
    return vuelo;
  }

  // DELETE - Eliminar vuelo
  async delete(id) {
    
    // PASO 1: Verificar que existe
    await this.getById(id);
    
    // PASO 2: Eliminar (también elimina automáticamente pilotos y pasajeros por CASCADE)
    await repo.delete(id);
    
    // PASO 3: Invalidar caché
    await redisClient.del('vuelos:all');
    
    // PASO 4: Devolver true (éxito)
    return true;
  }

  // GET PILOTOS - Obtener pilotos asignados a un vuelo
  async getPilotos(idVuelo) {
    
    // PASO 1: Verificar que el vuelo existe
    await this.getById(idVuelo);
    
    // PASO 2: Obtener pilotos de la tabla intermedia
    return await vuelosPilotosRepo.findByVuelo(idVuelo);
  }

  // GET PASAJEROS - Obtener pasajeros de un vuelo
  async getPasajeros(idVuelo) {
    
    // PASO 1: Verificar que el vuelo existe
    await this.getById(idVuelo);
    
    // PASO 2: Obtener pasajeros de la tabla intermedia
    return await vuelosPasajerosRepo.findByVuelo(idVuelo);
  }

  // ASIGNAR PILOTO - Asignar un piloto a un vuelo
  async asignarPiloto(idVuelo, idPiloto, rol) {
    
    // PASO 1: Verificar que el vuelo existe
    await this.getById(idVuelo);
    
    // PASO 2: Validar que el rol es válido
    // Roles permitidos: capitan o copiloto
    const rolesValidos = ['capitan', 'copiloto'];
    if (!rolesValidos.includes(rol)) {
      throw new ValidationError('Rol no válido');
    }
    
    // PASO 3: Crear la asignación en la tabla intermedia
    return await vuelosPilotosRepo.create({
      id_vuelo: idVuelo,
      id_piloto: idPiloto,
      rol
    });
  }

  // ASIGNAR PASAJERO - Asignar un pasajero a un vuelo
  async asignarPasajero(idVuelo, idPasajero, asiento) {
    
    // PASO 1: Verificar que el vuelo existe
    await this.getById(idVuelo);
    
    // PASO 2: Crear la reserva en la tabla intermedia
    return await vuelosPasajerosRepo.create({
      id_vuelo: idVuelo,
      id_pasajero: idPasajero,
      asiento
    });
  }
}