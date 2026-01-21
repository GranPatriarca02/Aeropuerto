export class Aerolinea {
  constructor(data) {
    this.id = data.id;
    this.nombre = data.nombre;
    this.codigo = data.codigo;
    this.activa = data.activa;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      codigo: this.codigo,
      activa: this.activa,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }

  toPublic() {
    return {
      id: this.id,
      nombre: this.nombre,
      codigo: this.codigo,
      activa: this.activa
    };
  }
}