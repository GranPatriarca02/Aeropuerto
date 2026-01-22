
// Exportamos la clase Aeropuerto
export class Aeropuerto {

  // CONSTRUCTOR - Inicializa el objeto
  constructor(data) {
    // data es un objeto con propiedades del aeropuerto
    // Asignamos cada propiedad al objeto this
    this.id = data.id;
    this.nombre = data.nombre;
    this.codigo_iata = data.codigo_iata;
    this.ciudad = data.ciudad;
    this.pais = data.pais;
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
      codigo_iata: this.codigo_iata,
      ciudad: this.ciudad,
      pais: this.pais,
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
      codigo_iata: this.codigo_iata,
      ciudad: this.ciudad,
      pais: this.pais
    };
  }
}