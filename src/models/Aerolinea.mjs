// Exportamos la clase Aerolinea
export class Aerolinea {
  
  // CONSTRUCTOR - Inicializa el objeto
  constructor(data) {
    // data es un objeto con propiedades de la aerolínea
    // Asignamos cada propiedad al objeto this
    this.id = data.id;
    this.nombre = data.nombre;
    this.codigo = data.codigo;
    this.activa = data.activa;
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
      codigo: this.codigo,
      activa: this.activa,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }

  // TO PUBLIC - Versión simplificada para APIs públicas
  toPublic() {
    // Devuelve solo los campos públicos
    // Útil cuando queremos ocultar metadatos internos
    return {
      id: this.id,
      nombre: this.nombre,
      codigo: this.codigo,
      activa: this.activa
    };
  }
}