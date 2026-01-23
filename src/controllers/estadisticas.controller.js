// Importamos el servicio
import { EstadisticasService } from '../services/estadisticas.service.js';

// Importamos la función de respuesta
import { successResponse } from '../utils/response.js';

// Creamos instancia del servicio
const service = new EstadisticasService();

// Exportamos el controlador
export const estadisticasController = {
  
  // GET GENERALES - Obtener estadísticas generales del sistema
  async getGenerales(req, res, next) {
    try {
      // Obtiene totales de aeropuertos, aerolíneas, vuelos, pilotos, pasajeros
      // y vuelos agrupados por estado
      const estadisticas = await service.getEstadisticasGenerales();
      successResponse(res, estadisticas, 'Estadísticas generales obtenidas exitosamente');
    } catch (error) {
      next(error);
    }
  },

  // GET TOP AEROLINEAS - Top aerolíneas por número de vuelos
  async getTopAerolineas(req, res, next) {
    try {
      // Extraemos el límite del query string (default: 5)
      // Ejemplo: /api/estadisticas/top-aerolineas?limit=10
      const limit = parseInt(req.query.limit) || 5;
      
      const aerolineas = await service.getTopAerolineasPorVuelos(limit);
      successResponse(res, aerolineas, 'Top aerolíneas obtenidas exitosamente');
    } catch (error) {
      next(error);
    }
  },

  // GET TOP PILOTOS - Top pilotos por horas de vuelo
  async getTopPilotos(req, res, next) {
    try {
      // Extraemos el límite del query string (default: 10)
      const limit = parseInt(req.query.limit) || 10;
      
      const pilotos = await service.getTopPilotosPorHoras(limit);
      successResponse(res, pilotos, 'Top pilotos obtenidos exitosamente');
    } catch (error) {
      next(error);
    }
  },

  // GET AEROPUERTO MAS ACTIVO - Aeropuerto con más vuelos
  async getAeropuertoMasActivo(req, res, next) {
    try {
      // Obtiene el aeropuerto que tiene más vuelos (como origen + destino)
      const aeropuerto = await service.getAeropuertoMasActivo();
      successResponse(res, aeropuerto, 'Aeropuerto más activo obtenido exitosamente');
    } catch (error) {
      next(error);
    }
  }
};