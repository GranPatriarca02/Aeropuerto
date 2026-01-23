// Exportamos la clase Piloto
export class Piloto {
  
  // CONSTRUCTOR - Inicializa el objeto
  constructor(data) {
    // data es un objeto con propiedades del piloto
    // Asignamos cada propiedad al objeto this
    this.id = data.id;
    this.nombre = data.nombre;
    this.licencia = data.licencia;
    this.horas_vuelo = data.horas_vuelo;
    this.id_aerolinea = data.id_aerolinea;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // TO JSON - Convierte el objeto a JSON completo
  toJSON() {
    // Devuelve un objeto plano con TODAS las propiedades
    // Útil para logging, debugging, o respuestas completas
    return {
      id: this.id,
      nombre: this.nombre,
      licencia: this.licencia,
      horas_vuelo: this.horas_vuelo,
      id_aerolinea: this.id_aerolinea,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }

  // TO PUBLIC - Versión simplificada para APIs públicas
  toPublic() {
    // Devuelve solo los campos públicos
    // Útil cuando queremos ocultar información sensible como licencia
    return {
      id: this.id,
      nombre: this.nombre,
      horas_vuelo: this.horas_vuelo
    };
  }
}