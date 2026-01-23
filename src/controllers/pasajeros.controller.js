// Importamos el servicio
import { PasajerosService } from '../services/pasajeros.service.js';

// Importamos la función de respuesta
import { successResponse } from '../utils/response.js';

// Creamos instancia del servicio
const service = new PasajerosService();

// Exportamos el controlador
export const pasajerosController = {
  
  // GET ALL - Obtener todos los pasajeros
  async getAll(req, res, next) {
    try {
      const pasajeros = await service.getAll();
      successResponse(res, pasajeros, 'Pasajeros obtenidos exitosamente');
    } catch (error) {
      next(error);
    }
  },

  // GET BY ID - Obtener un pasajero específico
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const pasajero = await service.getById(id);
      successResponse(res, pasajero, 'Pasajero obtenido exitosamente');
    } catch (error) {
      next(error);
    }
  },

  // CREATE - Crear nuevo pasajero (ADMIN)
  async create(req, res, next) {
    try {
      const pasajero = await service.create(req.body);
      successResponse(res, pasajero, 'Pasajero creado exitosamente', 201);
    } catch (error) {
      next(error);
    }
  },

  // UPDATE - Actualizar pasajero (ADMIN)
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const pasajero = await service.update(id, req.body);
      successResponse(res, pasajero, 'Pasajero actualizado exitosamente');
    } catch (error) {
      next(error);
    }
  },

  // DELETE - Eliminar pasajero (ADMIN)
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