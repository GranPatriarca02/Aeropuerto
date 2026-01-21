export const validateVuelo = (data, isUpdate = false) => {
  const errors = [];
  const { numero_vuelo, fecha_salida, fecha_llegada, id_aeropuerto_origen, id_aeropuerto_destino, estado } = data;

  if (!isUpdate || numero_vuelo !== undefined) {
    if (!numero_vuelo) errors.push('El número de vuelo es requerido');
  }

  // Validación de fechas
  const salida = new Date(fecha_salida);
  const llegada = new Date(fecha_llegada);

  if (!isUpdate || fecha_salida !== undefined) {
    if (isNaN(salida.getTime())) errors.push('La fecha de salida no es válida');
  }

  if (!isUpdate || fecha_llegada !== undefined) {
    if (isNaN(llegada.getTime())) errors.push('La fecha de llegada no es válida');
    if (llegada <= salida) errors.push('La fecha de llegada debe ser posterior a la de salida');
  }
  //validar aeropuertos
  if (id_aeropuerto_origen && id_aeropuerto_destino) {
    if (id_aeropuerto_origen === id_aeropuerto_destino) errors.push('El aeropuerto de destino debe ser diferente al de origen');
  }
  // validar estado vuelo
  const estadosValidos = ['programado', 'en_vuelo', 'cancelado', 'finalizado'];
  if (estado && !estadosValidos.includes(estado)) {
    errors.push('Estado de vuelo no válido');
  }

  return errors;
};