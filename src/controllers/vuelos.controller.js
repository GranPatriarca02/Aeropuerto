// Importamos el servicio
import { VuelosService } from '../services/vuelos.service.js';

// Importamos la función de respuesta
import { successResponse } from '../utils/response.js';

// Creamos instancia del servicio
const service = new VuelosService();

// Exportamos el controlador
export const vuelosController = {
  
  // GET ALL - Obtener todos los vuelos
  async getAll(req, res, next) {
    try {
      const vuelos = await service.getAll();
      successResponse(res, vuelos, 'Vuelos obtenidos exitosamente');
    } catch (error) {
      next(error);
    }
  },

  // GET BY ID - Obtener un vuelo específico
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const vuelo = await service.getById(id);
      successResponse(res, vuelo, 'Vuelo obtenido exitosamente');
    } catch (error) {
      next(error);
    }
  },

  // GET BY AEROPUERTO - Obtener vuelos de un aeropuerto
  async getByAeropuerto(req, res, next) {
    try {
      // Obtiene vuelos donde el aeropuerto sea origen O destino
      const { idAeropuerto } = req.params;
      const vuelos = await service.getByAeropuerto(idAeropuerto);
      successResponse(res, vuelos, 'Vuelos obtenidos exitosamente');
    } catch (error) {
      next(error);
    }
  },

  // GET BY ESTADO - Obtener vuelos por estado
  async getByEstado(req, res, next) {
    try {
      // Estados válidos: programado, en_vuelo, cancelado, finalizado
      const { estado } = req.params;
      const vuelos = await service.getByEstado(estado);
      successResponse(res, vuelos, 'Vuelos obtenidos exitosamente');
    } catch (error) {
      next(error);
    }
  },

  // CREATE - Crear nuevo vuelo (ADMIN)
  async create(req, res, next) {
    try {
      const vuelo = await service.create(req.body);
      successResponse(res, vuelo, 'Vuelo creado exitosamente', 201);
    } catch (error) {
      next(error);
    }
  },

  // UPDATE - Actualizar vuelo (ADMIN)
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const vuelo = await service.update(id, req.body);
      successResponse(res, vuelo, 'Vuelo actualizado exitosamente');
    } catch (error) {
      next(error);
    }
  },

  // DELETE - Eliminar vuelo (ADMIN)
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await service.delete(id);
      successResponse(res, null, 'Vuelo eliminado exitosamente');
    } catch (error) {
      next(error);
    }
  },

  // GET PILOTOS - Obtener pilotos asignados a un vuelo
  async getPilotos(req, res, next) {
    try {
      const { id } = req.params;
      const pilotos = await service.getPilotos(id);
      successResponse(res, pilotos, 'Pilotos del vuelo obtenidos exitosamente');
    } catch (error) {
      next(error);
    }
  },

  // GET PASAJEROS - Obtener pasajeros de un vuelo
  async getPasajeros(req, res, next) {
    try {
      const { id } = req.params;
      const pasajeros = await service.getPasajeros(id);
      successResponse(res, pasajeros, 'Pasajeros del vuelo obtenidos exitosamente');
    } catch (error) {
      next(error);
    }
  },

  // ASIGNAR PILOTO - Asignar un piloto a un vuelo (ADMIN)
  async asignarPiloto(req, res, next) {
    try {
      // Extraemos el ID del vuelo de la URL
      const { id } = req.params;
      
      // Extraemos id_piloto y rol del body
      const { id_piloto, rol } = req.body;
      
      const result = await service.asignarPiloto(id, id_piloto, rol);
      successResponse(res, result, 'Piloto asignado exitosamente', 201);
    } catch (error) {
      next(error);
    }
  },

  // ASIGNAR PASAJERO - Asignar un pasajero a un vuelo (ADMIN)
  async asignarPasajero(req, res, next) {
    try {
      // Extraemos el ID del vuelo
      const { id } = req.params;
      
      // Extraemos id_pasajero y asiento del body
      const { id_pasajero, asiento } = req.body;
      
      const result = await service.asignarPasajero(id, id_pasajero, asiento);
      successResponse(res, result, 'Pasajero asignado exitosamente', 201);
    } catch (error) {
      next(error);
    }
  }
};