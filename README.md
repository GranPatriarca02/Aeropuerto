 Estructura del Proyecto

Proyecto: API REST – Sistema de Gestión de Aeropuerto

airport-api/
│
├── src/
│   ├── app.js
│   ├── server.js
│
│   ├── config/
│   │   ├── supabase.js
│   │   ├── redis.js
│   │   └── index.js
│
│   ├── routes/
│   │   ├── aeropuertos.routes.js
│   │   ├── aerolineas.routes.js
│   │   ├── vuelos.routes.js
│   │   ├── pilotos.routes.js
│   │   ├── pasajeros.routes.js
│   │   └── index.js
│
│   ├── controllers/
│   │   ├── aeropuertos.controller.js
│   │   ├── aerolineas.controller.js
│   │   ├── vuelos.controller.js
│   │   ├── pilotos.controller.js
│   │   ├── pasajeros.controller.js
│   │   └── estadisticas.controller.js
│
│   ├── services/
│   │   ├── aeropuertos.service.js
│   │   ├── aerolineas.service.js
│   │   ├── vuelos.service.js
│   │   ├── pilotos.service.js
│   │   ├── pasajeros.service.js
│   │   └── estadisticas.service.js
│
│   ├── repositories/
│   │   ├── aeropuertos.repository.js
│   │   ├── aerolineas.repository.js
│   │   ├── vuelos.repository.js
│   │   ├── pilotos.repository.js
│   │   ├── pasajeros.repository.js
│   │   ├── vuelosPilotos.repository.js
│   │   └── vuelosPasajeros.repository.js
│
│   ├── models/
│   │   ├── Aeropuerto.js
│   │   ├── Aerolinea.js
│   │   ├── Vuelo.js
│   │   ├── Piloto.js
│   │   └── Pasajero.js
│
│   ├── middlewares/
│   │   ├── apiKey.middleware.js
│   │   ├── admin.middleware.js
│   │   ├── validation.middleware.js
│   │   └── error.middleware.js
│
│   ├── validations/
│   │   ├── aeropuerto.validation.js
│   │   ├── aerolinea.validation.js
│   │   ├── vuelo.validation.js
│   │   ├── piloto.validation.js
│   │   └── pasajero.validation.js
│
│   ├── utils/
│   │   ├── response.js
│   │   └── errors.js
│
│   └── database/
│       ├── schema.sql
│       └── seed.sql
│
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── aad-psp_grupo_X.pdf

.............. Explicación por capas..................
🔹 routes/

Define endpoints

NO lógica de negocio

Aplica middlewares

Ejemplo:

router.get(
  '/api/vuelos',
  apiKeyMiddleware,
  vuelosController.getAll
);

🔹 controllers/

Recibe req y res

Valida entrada

Llama al service

Devuelve respuesta JSON estándar

 No accede a la BD
 No lógica compleja

🔹 services/

Lógica de negocio

Orquesta repositorios

Implementa consultas avanzadas

Maneja caché con Redis

Ejemplo:

vuelos por aeropuerto

top aerolíneas

pilotos con más horas

🔹 repositories/

CRUD puro

Acceso a Supabase

Una tabla → un repositorio

Ejemplo:

findAll()
findById(id)
create(data)
update(id, data)
delete(id)

🔹 models/

 Obligatorio por enunciado

Ejemplo Piloto.js:

export class Piloto {
  constructor(data) {
    this.id = data.id;
    this.nombre = data.nombre;
    this.licencia = data.licencia;
    this.horas_vuelo = data.horas_vuelo;
    this.id_aerolinea = data.id_aerolinea;
    this.created_at = data.created_at;
  }

  toJSON() {
    return { ...this };
  }

  toPublic() {
    return {
      id: this.id,
      nombre: this.nombre,
      horas_vuelo: this.horas_vuelo
    };
  }
}

🔹 validations/

Validaciones de entrada

Tipos, rangos, formatos

Errores 400 Bad Request

🔹 middlewares/

API Key

Roles (admin)

Manejo de errores

Validación centralizada

🔹 database/

schema.sql → creación de tablas

seed.sql → datos de prueba