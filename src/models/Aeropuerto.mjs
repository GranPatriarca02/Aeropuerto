export class Aeropuerto {
  constructor(data) {
    this.id = data.id;
    this.nombre = data.nombre;
    this.codigo_iata = data.codigo_iata;
    this.ciudad = data.ciudad;
    this.pais = data.pais;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  toJSON() {
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

  toPublic() {
    return {
      id: this.id,
      nombre: this.nombre,
      codigo_iata: this.codigo_iata,
      ciudad: this.ciudad,
      pais: this.pais
    };
  }
}