// SUCCESS RESPONSE - Respuesta exitosa estándar
export const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  
  // PASO 1: Enviar respuesta JSON con formato estandarizado
  // res = objeto response de Express
  // data = datos a devolver (aeropuertos, vuelos, etc.)
  // message = mensaje descriptivo
  // statusCode = código HTTP (por defecto 200 OK)
  
  return res.status(statusCode).json({
    success: true,          // Indica que la operación fue exitosa
    message,                // Mensaje descriptivo
    data                    // Datos de la respuesta
  });
};

// ERROR RESPONSE - Respuesta de error estándar
export const errorResponse = (res, message = 'Error', statusCode = 500, errors = null) => {
  
  // PASO 1: Crear objeto de respuesta base
  const response = {
    success: false,         // Indica que hubo un error
    message                 // Mensaje descriptivo del error
  };

  // PASO 2: Agregar errores detallados si existen
  // errors es opcional, contiene detalles adicionales
  if (errors) {
    response.errors = errors;
  }

  // PASO 3: Enviar respuesta JSON con código de error
  return res.status(statusCode).json(response);
};

// PAGINATED RESPONSE - Respuesta con paginación
export const paginatedResponse = (res, data, pagination, message = 'Success') => {
  
  // PASO 1: Enviar respuesta con datos paginados
  // data = array de resultados de la página actual
  // pagination = objeto con info de paginación
  
  return res.status(200).json({
    success: true,          // Operación exitosa
    message,                // Mensaje descriptivo
    data,                   // Datos de esta página
    pagination              // Información de paginación
  });
};