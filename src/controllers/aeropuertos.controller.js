import { AeropuertosService } from '../services/aeropuertos.service.js';
import { successResponse } from '../utils/response.js';

const service = new AeropuertosService();

export const aeropuertosController = {
  async getAll(req, res, next) {
    try {
      const aeropuertos = await service.getAll();
      successResponse(res, aeropuertos, 'Aeropuertos obtenidos exitosamente');
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const aeropuerto = await service.getById(id);
      successResponse(res, aeropuerto, 'Aeropuerto obtenido exitosamente');
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const aeropuerto = await service.create(req.body);
      successResponse(res, aeropuerto, 'Aeropuerto creado exitosamente', 201);
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const aeropuerto = await service.update(id, req.body);
      successResponse(res, aeropuerto, 'Aeropuerto actualizado exitosamente');
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await service.delete(id);
      successResponse(res, null, 'Aeropuerto eliminado exitosamente');
    } catch (error) {
      next(error);
    }
  }
};