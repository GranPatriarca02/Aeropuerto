
// Importamos el servicio que contiene la lógica de negocio
import { AeropuertosService } from '../services/aeropuertos.service.js';

// Importamos la función para enviar respuestas exitosas
import { successResponse } from '../utils/response.js';

// Creamos UNA SOLA instancia del servicio, Esto es eficiente porque no creamos múltiples instancias
const service = new AeropuertosService();

// Exportamos un objeto con todos los métodos del controlador
export const aeropuertosController = {
  
  // GET ALL - Obtener todos los aeropuertos
  async getAll(req, res, next) {
    try {
      // 1. Llamamos al servicio para obtener los datos, El servicio maneja caché, base de datos, etc.
      const aeropuertos = await service.getAll();
      
      // 2. Enviamos respuesta exitosa al cliente, successResponse formatea la respuesta en JSON estándar
      successResponse(res, aeropuertos, 'Aeropuertos obtenidos exitosamente');
      
         // Si algo falla (error de BD, Redis, etc.), Pasamos el error al middleware errorHandler
    } catch (error) {

      next(error);
    }
  },

  // GET BY ID - Obtener un aeropuerto específico
  async getById(req, res, next) {
    try {
      // 1. Extraemos el ID de los parámetros de la URL
      const { id } = req.params;
      
      // 2. Llamamos al servicio pasando el ID, Si no existe, el servicio lanzará NotFoundError
      const aeropuerto = await service.getById(id);
      
      // 3. Enviamos respuesta exitosa
      successResponse(res, aeropuerto, 'Aeropuerto obtenido exitosamente');

      // Si el aeropuerto no existe → NotFoundError (404) , Si hay otro error → lo captura errorHandler
    } catch (error) {

      next(error);
    }
  },

  // CREATE - Crear nuevo aeropuerto (ADMIN)
  async create(req, res, next) {
    try {
      // 1. Extraemos los datos del body de la petición, req.body contiene el JSON enviado por el cliente
      // 2. Pasamos los datos al servicio, El servicio valida que el código IATA no exista
      const aeropuerto = await service.create(req.body);
      
      // 3. Enviamos respuesta exitosa con código 201 Created, 201 indica que se creó un nuevo recurso
      successResponse(res, aeropuerto, 'Aeropuerto creado exitosamente', 201);
      
    } catch (error) {
      // Posibles errores:ConflictError: código IATA duplicado (409) y ValidationError: datos inválidos (400)
      next(error);
    }
  },

  // UPDATE - Actualizar aeropuerto existente (ADMIN)
  async update(req, res, next) {
    try {
      // 1. Extraemos el ID de la URL
      const { id } = req.params;
      
      // 2. Llamamos al servicio con ID y datos a actualizar, Solo los campos presentes en req.body se actualizan
      const aeropuerto = await service.update(id, req.body);
      
      // 3. Enviamos respuesta exitosa
      successResponse(res, aeropuerto, 'Aeropuerto actualizado exitosamente');
      
    } catch (error) {
      // Posibles errores:NotFoundError: aeropuerto no existe (404) y ConflictError: código IATA duplicado (409)
      next(error);
    }
  },

  // DELETE - Eliminar aeropuerto (ADMIN)
  async delete(req, res, next) {
    try {
      // 1. Extraemos el ID de la URL
      const { id } = req.params;
      
      // 2. Llamamos al servicio para eliminar, Verifica que exista antes de eliminar
      await service.delete(id);
      
      // 3. Enviamos respuesta exitosa sin datos, data = null porque no hay contenido que devolver
      successResponse(res, null, 'Aeropuerto eliminado exitosamente');
      
    } catch (error) {
      // NotFoundError: aeropuerto no existe (404)
      next(error);
    }
  }
};