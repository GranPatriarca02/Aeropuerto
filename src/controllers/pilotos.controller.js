// Importamos el servicio
import { PilotosService } from '../services/pilotos.service.js';

// Importamos la función de respuesta
import { successResponse } from '../utils/response.js';

// Creamos instancia del servicio
const service = new PilotosService();

// Exportamos el controlador
export const pilotosController = {
  
  // GET ALL - Obtener todos los pilotos
  async getAll(req, res, next) {
    try {
      const pilotos = await service.getAll();
      successResponse(res, pilotos, 'Pilotos obtenidos exitosamente');
    } catch (error) {
      next(error);
    }
  },

  // GET BY ID - Obtener un piloto específico
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const piloto = await service.getById(id);
      successResponse(res, piloto, 'Piloto obtenido exitosamente');
    } catch (error) {
      next(error);
    }
  },

  // GET BY AEROLINEA - Obtener pilotos de una aerolínea
  async getByAerolinea(req, res, next) {
    try {
      // Extraemos el ID de la aerolínea desde los parámetros
      const { idAerolinea } = req.params;
      
      // Llamamos al servicio que valida que la aerolínea exista
      const pilotos = await service.getByAerolinea(idAerolinea);
      
      successResponse(res, pilotos, 'Pilotos obtenidos exitosamente');
    } catch (error) {
      next(error);
    }
  },

  // GET TOP BY HORAS - Top pilotos por horas de vuelo
  async getTopByHoras(req, res, next) {
    try {
      // Extraemos el límite del query string (default: 10)
      // Ejemplo: /api/pilotos/top?limit=5
      const limit = parseInt(req.query.limit) || 10;
      
      const pilotos = await service.getTopPilotosByHoras(limit);
      successResponse(res, pilotos, 'Top pilotos obtenidos exitosamente');
    } catch (error) {
      next(error);
    }
  },

  // CREATE - Crear nuevo piloto (ADMIN)
  async create(req, res, next) {
    try {
      const piloto = await service.create(req.body);
      successResponse(res, piloto, 'Piloto creado exitosamente', 201);
    } catch (error) {
      next(error);
    }
  },

  // UPDATE - Actualizar piloto (ADMIN)
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const piloto = await service.update(id, req.body);
      successResponse(res, piloto, 'Piloto actualizado exitosamente');
    } catch (error) {
      next(error);
    }
  },

  // DELETE - Eliminar piloto (ADMIN)
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