import { EstadisticasService } from '../services/estadisticas.service.js';
import { successResponse } from '../utils/response.js';

const service = new EstadisticasService();

export const estadisticasController = {
  async getGenerales(req, res, next) {
    try {
      const estadisticas = await service.getEstadisticasGenerales();
      successResponse(res, estadisticas, 'Estadísticas generales obtenidas exitosamente');
    } catch (error) {
      next(error);
    }
  },

  async getTopAerolineas(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 5;
      const aerolineas = await service.getTopAerolineasPorVuelos(limit);
      successResponse(res, aerolineas, 'Top aerolíneas obtenidas exitosamente');
    } catch (error) {
      next(error);
    }
  },

  async getTopPilotos(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const pilotos = await service.getTopPilotosPorHoras(limit);
      successResponse(res, pilotos, 'Top pilotos obtenidos exitosamente');
    } catch (error) {
      next(error);
    }
  },

  async getAeropuertoMasActivo(req, res, next) {
    try {
      const aeropuerto = await service.getAeropuertoMasActivo();
      successResponse(res, aeropuerto, 'Aeropuerto más activo obtenido exitosamente');
    } catch (error) {
      next(error);
    }
  }
};