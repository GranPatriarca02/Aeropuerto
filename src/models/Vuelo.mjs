// Exportamos la clase Vuelo
export class Vuelo {
  
  // CONSTRUCTOR - Inicializa el objeto
  constructor(data) {
    // data es un objeto con propiedades del vuelo
    // Asignamos cada propiedad al objeto this
    this.id = data.id;
    this.numero_vuelo = data.numero_vuelo;
    this.fecha_salida = data.fecha_salida;
    this.fecha_llegada = data.fecha_llegada;
    this.estado = data.estado;
    this.id_aeropuerto_origen = data.id_aeropuerto_origen;
    this.id_aeropuerto_destino = data.id_aeropuerto_destino;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // TO JSON - Convierte el objeto a JSON completo
  toJSON() {
    // Devuelve un objeto plano con TODAS las propiedades
    // Útil para logging, debugging, o respuestas completas
    return {
      id: this.id,
      numero_vuelo: this.numero_vuelo,
      fecha_salida: this.fecha_salida,
      fecha_llegada: this.fecha_llegada,
      estado: this.estado,
      id_aeropuerto_origen: this.id_aeropuerto_origen,
      id_aeropuerto_destino: this.id_aeropuerto_destino,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }

  // TO PUBLIC - Versión simplificada para APIs públicas
  toPublic() {
    // Devuelve solo los campos públicos
    // Útil cuando queremos ocultar IDs internos de aeropuertos
    return {
      id: this.id,
      numero_vuelo: this.numero_vuelo,
      fecha_salida: this.fecha_salida,
      fecha_llegada: this.fecha_llegada,
      estado: this.estado
    };
  }
}