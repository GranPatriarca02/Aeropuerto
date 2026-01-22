import { PilotosService } from '../services/pilotos.service.js';
import { successResponse } from '../utils/response.js';

const service = new PilotosService();

export const pilotosController = {
  async getAll(req, res, next) {
    try {
      const pilotos = await service.getAll();
      successResponse(res, pilotos, 'Pilotos obtenidos exitosamente');
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const piloto = await service.getById(id);
      successResponse(res, piloto, 'Piloto obtenido exitosamente');
    } catch (error) {
      next(error);
    }
  },

  async getByAerolinea(req, res, next) {
    try {
      const { idAerolinea } = req.params;
      const pilotos = await service.getByAerolinea(idAerolinea);
      successResponse(res, pilotos, 'Pilotos obtenidos exitosamente');
    } catch (error) {
      next(error);
    }
  },

  async getTopByHoras(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const pilotos = await service.getTopPilotosByHoras(limit);
      successResponse(res, pilotos, 'Top pilotos obtenidos exitosamente');
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const piloto = await service.create(req.validatedData);
      successResponse(res, piloto, 'Piloto creado exitosamente', 201);
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const piloto = await service.update(id, req.validatedData);
      successResponse(res, piloto, 'Piloto actualizado exitosamente');
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await service.delete(id);
      successResponse(res, null, 'Piloto eliminado exitosamente');
    } catch (error) {
      next(error);
    }
  }
};