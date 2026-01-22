######################################################################################### Airport API - Sistema de Gestión de aeropuerto #######################################################################

API REST completa para la gestión de aeropuertos, aerolíneas, vuelos, pilotos y pasajeros. Construida con Node.js, Express y Supabase.
- Descripción del Proyecto
Este proyecto implementa un sistema backend robusto para la gestión de operaciones aeroportuarias. Permite administrar información de aeropuertos, aerolíneas, pilotos, vuelos y pasajeros, incluyendo la asignación de pilotos a vuelos, reservas de pasajeros y generación de estadísticas operacionales.
Características Principales

. CRUD completo para todos los recursos
. Sistema de autenticación con API Keys (usuario y admin)
. Caché con Redis para optimizar rendimiento
. Endpoints de estadísticas y reportes
. Validación de datos con middleware personalizado
. Arquitectura escalable en capas 
. Documentación completa de endpoints

- Tecnologías Utilizadas

Node.js (v18+) - Runtime de JavaScript
Express.js (v4.22.1) - Framework web
Supabase (v2.39.0) - Base de datos PostgreSQL en la nube
Redis (v4.6.12) - Sistema de caché en memoria
Helmet (v7.1.0) - Seguridad HTTP
CORS (v2.8.5) - Control de acceso
dotenv (v16.3.1) - Variables de entorno

########################################################################################################## INSTALACIÓN #########################################################################################
- Prerrequisitos

. Node.js >= 18.0.0
. npm >= 9.0.0
. Cuenta de Supabase (gratuita)
. Redis instalado localmente o en la nube

1º Instalar dependencias

bashnpm install

2º Configurar la base de datos en Supabase

Crear un proyecto en Supabase
Ejecutar el script SQL de creación de tablas: src/database/schema.sql
Ejecutar el script SQL de datos iniciales: src/database/ingesta.sql


3º Configurar variables de entorno

Crear archivo .env en la raíz del proyecto y meter los credenciales necesarios

. ejemplo del (.env)
# Servidor
PORT=3000
NODE_ENV=development

# Supabase
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu-supabase-anon-key

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# API Keys
API_KEYS=user-key-?,user-key-?
ADMIN_API_KEYS=admin-key-?,admin-key-?

4º Iniciar el servidor

node server.mjs

############################################################################################################## ENDPOINTS ######################################################################################
- Health Check
    GET http://localhost:3000/api/health
    No requiere API Key


- Aeropuertos
   . Listar todos
      GET http://localhost:3000/api/aeropuertos
      Headers: x-api-key: tu-api-key


   . Obtener por ID
      GET http://localhost:3000/api/aeropuertos/1
      Headers: x-api-key: tu-api-key


   . Crear (Admin)
      POST http://localhost:3000/api/aeropuertos
      Headers: x-api-key: admin-api-key
      Body:
      {
        "nombre": "Aeropuerto de Sevilla",
        "codigo_iata": "SVQ",
        "ciudad": "Sevilla",
        "pais": "España"
      }


   . Actualizar (Admin)
      PUT http://localhost:3000/api/aeropuertos/1
      Headers: x-api-key: admin-api-key
      Body:
      {
        "nombre": "Aeropuerto Adolfo Suárez Madrid-Barajas",
        "ciudad": "Madrid"
      }


   . Eliminar (Admin)
      DELETE http://localhost:3000/api/aeropuertos/11
      Headers: x-api-key: admin-api-key

- Aerolíneas
   . Listar todas
      GET http://localhost:3000/api/aerolineas
      Headers: x-api-key: tu-api-key


   . Crear (Admin)
      POST http://localhost:3000/api/aerolineas
      Headers: x-api-key: admin-api-key
      Body:
      {
        "nombre": "Air Madrid",
        "codigo": "AM",
        "activa": true
      }

- Pilotos
   . Listar todos
      GET http://localhost:3000/api/pilotos
      Headers: x-api-key: tu-api-key


   . Top pilotos por horas
      GET http://localhost:3000/api/pilotos/top?limit=10
      Headers: x-api-key: tu-api-key


   . Pilotos de una aerolínea
      GET http://localhost:3000/api/pilotos/aerolinea/1
      Headers: x-api-key: tu-api-key


   - Crear (Admin)
      POST http://localhost:3000/api/pilotos
      Headers: x-api-key: admin-api-key
      Body:
      {
        "nombre": "Miguel Hernández",
        "licencia": "ATP-021-ESP",
        "horas_vuelo": 2500,
        "id_aerolinea": 1
      }

- Vuelos
   . Listar todos
      GET http://localhost:3000/api/vuelos
      Headers: x-api-key: tu-api-key


   . Vuelos por aeropuerto
      GET http://localhost:3000/api/vuelos/aeropuerto/1
      Headers: x-api-key: tu-api-key


   . Vuelos por estado
      GET http://localhost:3000/api/vuelos/estado/programado
      Headers: x-api-key: tu-api-key


   . Pilotos de un vuelo
      GET http://localhost:3000/api/vuelos/1/pilotos
      Headers: x-api-key: tu-api-key


   . Pasajeros de un vuelo
      GET http://localhost:3000/api/vuelos/1/pasajeros
      Headers: x-api-key: tu-api-key


   . Crear vuelo (Admin)
      POST http://localhost:3000/api/vuelos
      Headers: x-api-key: admin-api-key
      Body:
      {
        "numero_vuelo": "IB8888",
        "fecha_salida": "2025-03-01T10:00:00",
        "fecha_llegada": "2025-03-01T14:00:00",
        "estado": "programado",
        "id_aeropuerto_origen": 1,
        "id_aeropuerto_destino": 3
      }


   . Asignar piloto (Admin)
      POST http://localhost:3000/api/vuelos/1/pilotos
      Headers: x-api-key: admin-api-key
      Body:
      {
        "id_piloto": 5,
        "rol": "capitan"
      }


   . Asignar pasajero (Admin)
      POST http://localhost:3000/api/vuelos/1/pasajeros
      Headers: x-api-key: admin-api-key
      Body:
      {
        "id_pasajero": 10,
        "asiento": "15A"
      }


-  Pasajeros
   . Listar todos
      GET http://localhost:3000/api/pasajeros
      Headers: x-api-key: tu-api-key


   . Crear (Admin)
      POST http://localhost:3000/api/pasajeros
      Headers: x-api-key: admin-api-key
      Body:
      {
        "nombre": "Laura Martínez",
        "documento": "DNI99887766M",
        "nacionalidad": "España"
      }

- Estadísticas
   . Estadísticas generales
      GET http://localhost:3000/api/estadisticas
      Headers: x-api-key: tu-api-key


   . Top aerolíneas por vuelos
      GET http://localhost:3000/api/estadisticas/top-aerolineas?limit=5
      Headers: x-api-key: tu-api-key


   . Top pilotos por horas
      GET http://localhost:3000/api/estadisticas/top-pilotos?limit=10
      Headers: x-api-key: tu-api-key


   . Aeropuerto más activo
      GET http://localhost:3000/api/estadisticas/aeropuerto-mas-activo
      Headers: x-api-key: tu-api-key


################################################################################################### ESTRUCTURA DEL PROYECTO ####################################################################################
                                                                                                           
                                                                                                           
                                                                                                            airport-api/
                                                                                                            ├── src/
                                                                                                            │   ├── config/              # Configuración (DB, Redis, env)
                                                                                                            │   │   ├── index.js
                                                                                                            │   │   ├── supabase.js
                                                                                                            │   │   └── redis.js
                                                                                                            │   ├── controllers/         # Controladores de rutas
                                                                                                            │   │   ├── aeropuertos.controller.js
                                                                                                            │   │   ├── aerolineas.controller.js
                                                                                                            │   │   ├── pilotos.controller.js
                                                                                                            │   │   ├── vuelos.controller.js
                                                                                                            │   │   ├── pasajeros.controller.js
                                                                                                            │   │   └── estadisticas.controller.js
                                                                                                            │   ├── database/            # Scripts SQL
                                                                                                            │   │   ├── schema.sql       # Creación de tablas
                                                                                                            │   │   └── ingesta.sql      # Datos iniciales
                                                                                                            │   ├── middlewares/         # Middlewares personalizados
                                                                                                            │   │   ├── apiKey.middleware.js
                                                                                                            │   │   ├── admin.middleware.js
                                                                                                            │   │   ├── validation.middleware.js
                                                                                                            │   │   └── error.middleware.js
                                                                                                            │   ├── models/              # Modelos de datos
                                                                                                            │   │   ├── Aeropuerto.mjs
                                                                                                            │   │   ├── Aerolinea.mjs
                                                                                                            │   │   ├── Piloto.mjs
                                                                                                            │   │   ├── Vuelo.mjs
                                                                                                            │   │   └── Pasajero.mjs
                                                                                                            │   ├── repositories/        # Capa de acceso a datos
                                                                                                            │   │   ├── aeropuertos.repository.mjs
                                                                                                            │   │   ├── aerolineas.repository.mjs
                                                                                                            │   │   ├── pilotos.repository.mjs
                                                                                                            │   │   ├── vuelos.repository.mjs
                                                                                                            │   │   ├── pasajeros.repository.mjs
                                                                                                            │   │   ├── vuelosPilotos.repository.mjs
                                                                                                            │   │   └── vuelosPasajeros.repository.mjs
                                                                                                            │   ├── routes/              # Definición de rutas
                                                                                                            │   │   ├── index.js
                                                                                                            │   │   ├── aeropuertos.routes.js
                                                                                                            │   │   ├── aerolineas.routes.js
                                                                                                            │   │   ├── pilotos.routes.js
                                                                                                            │   │   ├── vuelos.routes.js
                                                                                                            │   │   └── pasajeros.routes.js
                                                                                                            │   ├── services/            # Lógica de negocio
                                                                                                            │   │   ├── aeropuertos.service.js
                                                                                                            │   │   ├── aerolineas.service.js
                                                                                                            │   │   ├── pilotos.service.js
                                                                                                            │   │   ├── vuelos.service.js
                                                                                                            │   │   ├── pasajeros.service.js
                                                                                                            │   │   └── estadisticas.service.js
                                                                                                            │   ├── utils/               # Utilidades
                                                                                                            │   │   ├── errors.js        # Errores personalizados
                                                                                                            │   │   └── response.js      # Formatos de respuesta
                                                                                                            │   ├── validations/         # Validaciones de datos
                                                                                                            │   │   ├── aeropuerto.validation.js
                                                                                                            │   │   ├── aerolinea.validation.js
                                                                                                            │   │   ├── piloto.validation.js
                                                                                                            │   │   ├── vuelo.validation.js
                                                                                                            │   │   └── pasajero.validation.js
                                                                                                            │   └── app.js               # Configuración de Express
                                                                                                            ├── .env                     # Variables de entorno (no incluir en Git)
                                                                                                            ├── .gitignore
                                                                                                            ├── package.json
                                                                                                            ├── server.mjs               # Punto de entrada
                                                                                                            └── README.md


################################################################################################### ESTRUCTURA DE CAPAS ########################################################################################

                                                                            ┌─────────────────────────────────────────────────────────────┐
                                                                            │                        CLIENTE HTTP                          │
                                                                            │                    (Postman, Frontend)                       │
                                                                            └────────────────────────────┬────────────────────────────────┘
                                                                                                        │
                                                                                                        ▼
                                                                            ┌─────────────────────────────────────────────────────────────┐
                                                                            │  CAPA 1: ROUTES (Enrutamiento)                              │
                                                                            │                     src/routes/                                              │
                                                                            │  ─────────────────────────────────────────────────────────  │
                                                                            │  • Define las rutas HTTP (GET, POST, PUT, DELETE)           │
                                                                            │  • Aplica middlewares (auth, validación)                    │
                                                                            │  • Delega a los Controllers                                 │
                                                                            └────────────────────────────┬────────────────────────────────┘
                                                                                                        │
                                                                                                        ▼
                                                                            ┌─────────────────────────────────────────────────────────────┐
                                                                            │  CAPA 2: MIDDLEWARES (Validación y Seguridad)               │
                                                                            │                  src/middlewares/                                         │
                                                                            │  ─────────────────────────────────────────────────────────  │
                                                                            │  • apiKey.middleware.js → Autenticación                     │
                                                                            │  • admin.middleware.js → Autorización                       │
                                                                            │  • validation.middleware.js → Validación de datos           │
                                                                            │  • error.middleware.js → Manejo de errores                  │
                                                                            └────────────────────────────┬────────────────────────────────┘
                                                                                                        │
                                                                                                        ▼
                                                                            ┌─────────────────────────────────────────────────────────────┐
                                                                            │  CAPA 3: CONTROLLERS (Controladores)                        │
                                                                            │                  src/controllers/                                         │
                                                                            │  ─────────────────────────────────────────────────────────  │
                                                                            │  • Recibe requests HTTP                                     │
                                                                            │  • Extrae parámetros (req.params, req.body, req.query)      │
                                                                            │  • Llama a los Services                                     │
                                                                            │  • Formatea respuestas (successResponse, errorResponse)     │
                                                                            │  • NO contiene lógica de negocio                            │
                                                                            └────────────────────────────┬────────────────────────────────┘
                                                                                                        │
                                                                                                        ▼
                                                                            ┌─────────────────────────────────────────────────────────────┐
                                                                            │  CAPA 4: SERVICES (Lógica de Negocio)                       │
                                                                            │                     src/services/                                            │
                                                                            │  ─────────────────────────────────────────────────────────  │
                                                                            │  • Contiene TODA la lógica de negocio                       │
                                                                            │  • Validaciones complejas                                   │
                                                                            │  • Orquesta llamadas a Repositories                         │
                                                                            │  • Gestión de caché (Redis)                                 │
                                                                            │  • Lanza errores personalizados (NotFoundError, etc.)       │
                                                                            └────────────────────────────┬────────────────────────────────┘
                                                                                                        │
                                                                                                        ▼
                                                                            ┌─────────────────────────────────────────────────────────────┐
                                                                            │  CAPA 5: REPOSITORIES (Acceso a Datos)                      │
                                                                            │                  src/repositories/                                        │
                                                                            │  ─────────────────────────────────────────────────────────  │
                                                                            │  • Interactúa DIRECTAMENTE con Supabase                     │
                                                                            │  • Queries SQL (select, insert, update, delete)             │
                                                                            │  • Mapea datos a Modelos                                    │
                                                                            │  • NO contiene lógica de negocio                            │
                                                                            └────────────────────────────┬────────────────────────────────┘
                                                                                                        │
                                                                                                        ▼
                                                                            ┌─────────────────────────────────────────────────────────────┐
                                                                            │  CAPA 6: MODELS (Modelos de Datos)                          │
                                                                            │                      src/models/                                              │
                                                                            │  ─────────────────────────────────────────────────────────  │
                                                                            │  • Define la estructura de datos                            │
                                                                            │  • Métodos toJSON(), toPublic()                             │
                                                                            │  • Representación del dominio                               │
                                                                            └────────────────────────────┬────────────────────────────────┘
                                                                                                        │
                                                                                                        ▼
                                                                            ┌─────────────────────────────────────────────────────────────┐
                                                                            │  BASE DE DATOS: Supabase (PostgreSQL)                       │
                                                                            │                      src/database/                                            │
                                                                            │  ─────────────────────────────────────────────────────────  │
                                                                            │  • schema.sql → Estructura de tablas                        │
                                                                            │  • ingesta.sql → Datos iniciales                            │
                                                                            └─────────────────────────────────────────────────────────────┘

####################################################################################################################################################################################################################################################################
############################################################################################################# AUTORES ##############################################################################################################################################


                                                                                                   . ADRIÁN GARCÍA SANTIAGO                                                                 
                                                                                                   . CARLOS ANDRÉS ROJAS MONASTERIO