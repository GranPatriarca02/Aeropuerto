// Exportamos la clase Pasajero
export class Pasajero {
  
  // CONSTRUCTOR - Inicializa el objeto
  constructor(data) {
    // data es un objeto con propiedades del pasajero
    // Asignamos cada propiedad al objeto this
    this.id = data.id;
    this.nombre = data.nombre;
    this.documento = data.documento;
    this.nacionalidad = data.nacionalidad;
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
      documento: this.documento,
      nacionalidad: this.nacionalidad,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }

  // TO PUBLIC - Versión simplificada para APIs públicas
  toPublic() {
    // Devuelve solo los campos públicos
    // Útil cuando queremos ocultar información sensible como el documento
    return {
      id: this.id,
      nombre: this.nombre,
      nacionalidad: this.nacionalidad
    };
  }
}