import { AerolineasService } from '../services/aerolineas.service.js';
import { successResponse } from '../utils/response.js';

const service = new AerolineasService();

export const aerolineasController = {
  async getAll(req, res, next) {
    try {
      const aerolineas = await service.getAll();
      successResponse(res, aerolineas, 'Aerolíneas obtenidas exitosamente');
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const aerolinea = await service.getById(id);
      successResponse(res, aerolinea, 'Aerolínea obtenida exitosamente');
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const aerolinea = await service.create(req.validatedData);
      successResponse(res, aerolinea, 'Aerolínea creada exitosamente', 201);
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const aerolinea = await service.update(id, req.validatedData);
      successResponse(res, aerolinea, 'Aerolínea actualizada exitosamente');
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await service.delete(id);
      successResponse(res, null, 'Aerolínea eliminada exitosamente');
    } catch (error) {
      next(error);
    }
  }
};