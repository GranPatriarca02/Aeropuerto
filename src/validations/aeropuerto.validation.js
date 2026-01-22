
// Exportamos la función de validación
export const validateAeropuerto = (data, isUpdate = false) => {
  
  // Array para acumular errores
  const errors = [];
  
  // Extraemos los campos del objeto data
  // Usamos destructuring para facilitar el acceso
  const { nombre, codigo_iata, ciudad, pais } = data;
  
  // VALIDACIÓN 1: NOMBRE

  // Si NO es update O el campo nombre está presente
  if (!isUpdate || nombre !== undefined) {
    
    // Verificar que el nombre existe y no está vacío
    if (!nombre) {
      errors.push('El nombre es requerido');
    }
    // Verificar longitud (entre 3 y 100 caracteres)
    else if (nombre.length < 3 || nombre.length > 100) {
      errors.push('El nombre debe tener entre 3 y 100 caracteres');
    }
  }
  
  // VALIDACIÓN 2: CÓDIGO IATA
  if (!isUpdate || codigo_iata !== undefined) {
    
    // Verificar que existe
    if (!codigo_iata) {
      errors.push('El código IATA es requerido');
    }
    // Verificar que tiene EXACTAMENTE 3 caracteres
    else if (codigo_iata.length !== 3) {
      errors.push('El código IATA debe tener exactamente 3 caracteres');
    }
  }
  
  // VALIDACIÓN 3: CIUDAD
  if (!isUpdate || ciudad !== undefined) {
    
    // Solo verificamos que existe
    if (!ciudad) {
      errors.push('La ciudad es requerida');
    }
  }
  
  // VALIDACIÓN 4: PAÍS
  if (!isUpdate || pais !== undefined) {
    
    // Solo verificamos que existe
    if (!pais) {
      errors.push('El país es requerido');
    }
  }
  
  // RETORNO
  // Devolvemos el array de errores
  // Si está vacío → validación exitosa
  // Si tiene elementos → hay errores
  return errors;
};
