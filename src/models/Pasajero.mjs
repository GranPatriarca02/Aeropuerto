export class Pasajero {
  constructor(data) {
    this.id = data.id;
    this.nombre = data.nombre;
    this.documento = data.documento;
    this.nacionalidad = data.nacionalidad;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      documento: this.documento,
      nacionalidad: this.nacionalidad,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }

  toPublic() {
    return {
      id: this.id,
      nombre: this.nombre,
      nacionalidad: this.nacionalidad
    };
  }
}