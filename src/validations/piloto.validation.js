export const validatePiloto = (data, isUpdate = false) => {
  const errors = [];
  const { nombre, licencia, horas_vuelo, id_aerolinea } = data;
    // validar nombre
  if (!isUpdate || nombre !== undefined) {
    if (!nombre) errors.push('El nombre es requerido');
  }
  //validar licencia
  if (!isUpdate || licencia !== undefined) {
    if (!licencia || licencia.length < 5) errors.push('La licencia es requerida (min 5 caracteres)');
  }
  //validar horas de vuelo
  if (horas_vuelo !== undefined) {
    if (typeof horas_vuelo !== 'number' || horas_vuelo < 0) errors.push('Las horas de vuelo no pueden ser negativas');
  }
  //validar aerolinea
  if (!isUpdate || id_aerolinea !== undefined) {
    if (!id_aerolinea || isNaN(id_aerolinea)) errors.push('El ID de aerolínea válido es requerido');
  }

  return errors;
};