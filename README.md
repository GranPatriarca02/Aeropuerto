 LISTADO COMPLETO DE ENDPOINTS GET
 HEALTH CHECK (sin API Key)
GET http://localhost:3000/api/health


 AEROPUERTOS
GET http://localhost:3000/api/aeropuertos

GET http://localhost:3000/api/aeropuertos/1

(Cambia el 1 por cualquier ID)

 AEROLÍNEAS
GET http://localhost:3000/api/aerolineas

GET http://localhost:3000/api/aerolineas/1


👨‍✈️ PILOTOS
GET http://localhost:3000/api/pilotos

GET http://localhost:3000/api/pilotos/1

GET http://localhost:3000/api/pilotos/top

(Top 10 pilotos por horas de vuelo)
GET http://localhost:3000/api/pilotos/top?limit=5

(Top 5 pilotos - puedes cambiar el número)
GET http://localhost:3000/api/pilotos/aerolinea/1

(Pilotos de la aerolínea con ID 1)

🛩️ VUELOS
GET http://localhost:3000/api/vuelos

GET http://localhost:3000/api/vuelos/1

GET http://localhost:3000/api/vuelos/aeropuerto/1

(Vuelos desde/hacia el aeropuerto con ID 1)
GET http://localhost:3000/api/vuelos/estado/programado

(Estados: programado, en_vuelo, cancelado, finalizado)
GET http://localhost:3000/api/vuelos/estado/en_vuelo

GET http://localhost:3000/api/vuelos/estado/cancelado

GET http://localhost:3000/api/vuelos/estado/finalizado

GET http://localhost:3000/api/vuelos/1/pilotos

(Pilotos asignados al vuelo 1)
GET http://localhost:3000/api/vuelos/1/pasajeros

(Pasajeros del vuelo 1)

 PASAJEROS
GET http://localhost:3000/api/pasajeros

GET http://localhost:3000/api/pasajeros/1


 ESTADÍSTICAS
GET http://localhost:3000/api/estadisticas

(Estadísticas generales: totales de todo)
GET http://localhost:3000/api/estadisticas/top-aerolineas

(Top 5 aerolíneas por número de vuelos)
GET http://localhost:3000/api/estadisticas/top-aerolineas?limit=10

(Top 10 aerolíneas - puedes cambiar el número)
GET http://localhost:3000/api/estadisticas/top-pilotos

(Top 10 pilotos por horas de vuelo)
GET http://localhost:3000/api/estadisticas/top-pilotos?limit=5

GET http://localhost:3000/api/estadisticas/aeropuerto-mas-activo





 POST (Crear recursos)
 AEROPUERTOS
POST http://localhost:3000/api/aeropuertos

Body (JSON):
{
  "nombre": "Aeropuerto de Sevilla",
  "codigo_iata": "SVQ",
  "ciudad": "Sevilla",
  "pais": "España"
}
 AEROLÍNEAS
POST http://localhost:3000/api/aerolineas

Body (JSON):
{
  "nombre": "Air Madrid",
  "codigo": "AM",
  "activa": true
}
 PILOTOS
POST http://localhost:3000/api/pilotos

Body (JSON):
{
  "nombre": "Miguel Hernández",
  "licencia": "ATP-021-ESP",
  "horas_vuelo": 2500,
  "id_aerolinea": 1
}
 VUELOS
POST http://localhost:3000/api/vuelos

Body (JSON):
{
  "numero_vuelo": "IB8888",
  "fecha_salida": "2025-03-01T10:00:00",
  "fecha_llegada": "2025-03-01T14:00:00",
  "estado": "programado",
  "id_aeropuerto_origen": 1,
  "id_aeropuerto_destino": 3
}
 PASAJEROS
POST http://localhost:3000/api/pasajeros

Body (JSON):
{
  "nombre": "Laura Martínez",
  "documento": "DNI99887766M",
  "nacionalidad": "España"
}
 ASIGNAR PILOTO A VUELO
POST http://localhost:3000/api/vuelos/1/pilotos

Body (JSON):
{
  "id_piloto": 5,
  "rol": "capitan"
}
(rol puede ser: "capitan" o "copiloto")
 ASIGNAR PASAJERO A VUELO
POST http://localhost:3000/api/vuelos/1/pasajeros

Body (JSON):
{
  "id_pasajero": 10,
  "asiento": "15A"
}

 PUT (Actualizar recursos)
 AEROPUERTOS
PUT http://localhost:3000/api/aeropuertos/1

Body (JSON):
{
  "nombre": "Aeropuerto Adolfo Suárez Madrid-Barajas",
  "ciudad": "Madrid"
}
(Solo incluye los campos que quieres actualizar)
 AEROLÍNEAS
PUT http://localhost:3000/api/aerolineas/1

Body (JSON):
{
  "activa": false
}
 PILOTOS
PUT http://localhost:3000/api/pilotos/1

Body (JSON):
{
  "horas_vuelo": 5500,
  "id_aerolinea": 2
}
 VUELOS
PUT http://localhost:3000/api/vuelos/1

Body (JSON):
{
  "estado": "en_vuelo"
}
(Estados válidos: "programado", "en_vuelo", "cancelado", "finalizado")
PUT http://localhost:3000/api/vuelos/2

Body (JSON):
{
  "estado": "cancelado",
  "fecha_salida": "2025-03-05T10:00:00"
}
 PASAJEROS
PUT http://localhost:3000/api/pasajeros/1

Body (JSON):
{
  "nombre": "José González García",
  "nacionalidad": "España"
}

DELETE (Eliminar recursos)
 AEROPUERTOS
DELETE http://localhost:3000/api/aeropuertos/11

(No necesita Body)
 AEROLÍNEAS
DELETE http://localhost:3000/api/aerolineas/11

 PILOTOS
DELETE http://localhost:3000/api/pilotos/21

 VUELOS
DELETE http://localhost:3000/api/vuelos/13

 PASAJEROS
DELETE http://localhost:3000/api/pasajeros/21
