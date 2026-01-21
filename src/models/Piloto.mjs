export class Piloto {
  constructor(data) {
    this.id = data.id;
    this.nombre = data.nombre;
    this.licencia = data.licencia;
    this.horas_vuelo = data.horas_vuelo;
    this.id_aerolinea = data.id_aerolinea;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  toJSON() {
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

  toPublic() {
    return {
      id: this.id,
      nombre: this.nombre,
      horas_vuelo: this.horas_vuelo
    };
  }
}