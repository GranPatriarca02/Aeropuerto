import { PasajerosService } from '../services/pasajeros.service.js';
import { successResponse } from '../utils/response.js';

const service = new PasajerosService();

export const pasajerosController = {
  async getAll(req, res, next) {
    try {
      const pasajeros = await service.getAll();
      successResponse(res, pasajeros, 'Pasajeros obtenidos exitosamente');
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const pasajero = await service.getById(id);
      successResponse(res, pasajero, 'Pasajero obtenido exitosamente');
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const pasajero = await service.create(req.body);
      successResponse(res, pasajero, 'Pasajero creado exitosamente', 201);
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const pasajero = await service.update(id, req.body);
      successResponse(res, pasajero, 'Pasajero actualizado exitosamente');
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await service.delete(id);
      successResponse(res, null, 'Pasajero eliminado exitosamente');
    } catch (error) {
      next(error);
    }
  }
};