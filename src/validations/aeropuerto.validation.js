export const validateAeropuerto = (data, isUpdate = false) => {
  const errors = [];
  const { nombre, codigo_iata, ciudad, pais } = data;
    // Validar nombre
  if (!isUpdate || nombre !== undefined) {
    if (!nombre) errors.push('El nombre es requerido');
    else if (nombre.length < 3 || nombre.length > 100) errors.push('El nombre debe tener entre 3 y 100 caracteres');
  }
  // validar codigo_iata
  if (!isUpdate || codigo_iata !== undefined) {
    if (!codigo_iata) errors.push('El código IATA es requerido');
    else if (codigo_iata.length !== 3) errors.push('El código IATA debe tener exactamente 3 caracteres');
  }
  //validar ciudad          
  if (!isUpdate || ciudad !== undefined) {
    if (!ciudad) errors.push('La ciudad es requerida');
  }
  //validar pais
  if (!isUpdate || pais !== undefined) {
    if (!pais) errors.push('El país es requerido');
  }

  return errors;
};