import { VuelosService } from '../services/vuelos.service.js';
import { successResponse } from '../utils/response.js';

const service = new VuelosService();

export const vuelosController = {
  async getAll(req, res, next) {
    try {
      const vuelos = await service.getAll();
      successResponse(res, vuelos, 'Vuelos obtenidos exitosamente');
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const vuelo = await service.getById(id);
      successResponse(res, vuelo, 'Vuelo obtenido exitosamente');
    } catch (error) {
      next(error);
    }
  },

  async getByAeropuerto(req, res, next) {
    try {
      const { idAeropuerto } = req.params;
      const vuelos = await service.getByAeropuerto(idAeropuerto);
      successResponse(res, vuelos, 'Vuelos obtenidos exitosamente');
    } catch (error) {
      next(error);
    }
  },

  async getByEstado(req, res, next) {
    try {
      const { estado } = req.params;
      const vuelos = await service.getByEstado(estado);
      successResponse(res, vuelos, 'Vuelos obtenidos exitosamente');
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const vuelo = await service.create(req.body);
      successResponse(res, vuelo, 'Vuelo creado exitosamente', 201);
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const vuelo = await service.update(id, req.body);
      successResponse(res, vuelo, 'Vuelo actualizado exitosamente');
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await service.delete(id);
      successResponse(res, null, 'Vuelo eliminado exitosamente');
    } catch (error) {
      next(error);
    }
  },

  async getPilotos(req, res, next) {
    try {
      const { id } = req.params;
      const pilotos = await service.getPilotos(id);
      successResponse(res, pilotos, 'Pilotos del vuelo obtenidos exitosamente');
    } catch (error) {
      next(error);
    }
  },

  async getPasajeros(req, res, next) {
    try {
      const { id } = req.params;
      const pasajeros = await service.getPasajeros(id);
      successResponse(res, pasajeros, 'Pasajeros del vuelo obtenidos exitosamente');
    } catch (error) {
      next(error);
    }
  },

  async asignarPiloto(req, res, next) {
    try {
      const { id } = req.params;
      const { id_piloto, rol } = req.body;
      const result = await service.asignarPiloto(id, id_piloto, rol);
      successResponse(res, result, 'Piloto asignado exitosamente', 201);
    } catch (error) {
      next(error);
    }
  },

  async asignarPasajero(req, res, next) {
    try {
      const { id } = req.params;
      const { id_pasajero, asiento } = req.body;
      const result = await service.asignarPasajero(id, id_pasajero, asiento);
      successResponse(res, result, 'Pasajero asignado exitosamente', 201);
    } catch (error) {
      next(error);
    }
  }
};