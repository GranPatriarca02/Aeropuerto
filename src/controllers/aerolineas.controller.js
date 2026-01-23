// Importamos el servicio que contiene la lógica de negocio
import { AerolineasService } from '../services/aerolineas.service.js';

// Importamos la función para enviar respuestas exitosas
import { successResponse } from '../utils/response.js';

// Creamos UNA SOLA instancia del servicio
const service = new AerolineasService();

// Exportamos un objeto con todos los métodos del controlador
export const aerolineasController = {
  
  // GET ALL - Obtener todas las aerolíneas
  async getAll(req, res, next) {
    try {
      // 1. Llamamos al servicio para obtener los datos
      const aerolineas = await service.getAll();
      
      // 2. Enviamos respuesta exitosa
      successResponse(res, aerolineas, 'Aerolíneas obtenidas exitosamente');
    } catch (error) {
      next(error);
    }
  },

  // GET BY ID - Obtener una aerolínea específica
  async getById(req, res, next) {
    try {
      // 1. Extraemos el ID de los parámetros
      const { id } = req.params;
      
      // 2. Llamamos al servicio
      const aerolinea = await service.getById(id);
      
      // 3. Enviamos respuesta
      successResponse(res, aerolinea, 'Aerolínea obtenida exitosamente');
    } catch (error) {
      next(error);
    }
  },

  // CREATE - Crear nueva aerolínea (ADMIN)
  async create(req, res, next) {
    try {
      // 1. Pasamos los datos al servicio
      const aerolinea = await service.create(req.body);
      
      // 2. Enviamos respuesta 201 Created
      successResponse(res, aerolinea, 'Aerolínea creada exitosamente', 201);
    } catch (error) {
      next(error);
    }
  },

  // UPDATE - Actualizar aerolínea existente (ADMIN)
  async update(req, res, next) {
    try {
      // 1. Extraemos el ID
      const { id } = req.params;
      
      // 2. Actualizamos con el servicio
      const aerolinea = await service.update(id, req.body);
      
      // 3. Enviamos respuesta
      successResponse(res, aerolinea, 'Aerolínea actualizada exitosamente');
    } catch (error) {
      next(error);
    }
  },

  // DELETE - Eliminar aerolínea (ADMIN)
  async delete(req, res, next) {
    try {
      // 1. Extraemos el ID
      const { id } = req.params;
      
      // 2. Eliminamos
      await service.delete(id);
      
      // 3. Enviamos respuesta sin datos
      successResponse(res, null, 'Aerolínea eliminada exitosamente');
    } catch (error) {
      next(error);
    }
  }
};