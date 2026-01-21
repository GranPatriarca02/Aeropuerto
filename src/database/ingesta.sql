-- Insertar Aeropuertos
INSERT INTO aeropuertos (nombre, codigo_iata, ciudad, pais) VALUES
('Aeropuerto Internacional Adolfo Suárez Madrid-Barajas', 'MAD', 'Madrid', 'España'),
('Aeropuerto de Barcelona-El Prat', 'BCN', 'Barcelona', 'España'),
('Aeropuerto John F. Kennedy', 'JFK', 'Nueva York', 'Estados Unidos'),
('Aeropuerto Internacional de Los Ángeles', 'LAX', 'Los Ángeles', 'Estados Unidos'),
('Aeropuerto Internacional de Miami', 'MIA', 'Miami', 'Estados Unidos'),
('Aeropuerto Charles de Gaulle', 'CDG', 'París', 'Francia'),
('Aeropuerto de Heathrow', 'LHR', 'Londres', 'Reino Unido'),
('Aeropuerto Internacional de Tokio-Narita', 'NRT', 'Tokio', 'Japón'),
('Aeropuerto Internacional Jorge Chávez', 'LIM', 'Lima', 'Perú'),
('Aeropuerto Internacional El Dorado', 'BOG', 'Bogotá', 'Colombia');

-- Insertar Aerolíneas
INSERT INTO aerolineas (nombre, codigo, activa) VALUES
('Iberia', 'IB', true),
('Air Europa', 'UX', true),
('Vueling', 'VY', true),
('American Airlines', 'AA', true),
('United Airlines', 'UA', true),
('Air France', 'AF', true),
('British Airways', 'BA', true),
('LATAM Airlines', 'LA', true),
('Avianca', 'AV', true),
('Ryanair', 'FR', true);

-- Insertar Pilotos
INSERT INTO pilotos (nombre, licencia, horas_vuelo, id_aerolinea) VALUES
('Carlos Martínez', 'ATP-001-ESP', 5000, 1),
('Ana García', 'ATP-002-ESP', 4500, 1),
('Pedro López', 'ATP-003-ESP', 3200, 2),
('María Fernández', 'ATP-004-ESP', 4800, 2),
('Juan Rodríguez', 'ATP-005-ESP', 6000, 3),
('Laura Sánchez', 'ATP-006-ESP', 3500, 3),
('David Brown', 'ATP-007-USA', 7500, 4),
('Sarah Wilson', 'ATP-008-USA', 5200, 4),
('Michael Davis', 'ATP-009-USA', 6300, 5),
('Emily Taylor', 'ATP-010-USA', 4100, 5),
('Pierre Dubois', 'ATP-011-FRA', 5800, 6),
('Sophie Martin', 'ATP-012-FRA', 4200, 6),
('James Smith', 'ATP-013-GBR', 6500, 7),
('Emma Johnson', 'ATP-014-GBR', 3900, 7),
('Takashi Tanaka', 'ATP-015-JPN', 5500, 8),
('Luis Torres', 'ATP-016-PER', 4000, 8),
('Andrés Silva', 'ATP-017-COL', 4700, 9),
('Camila Ruiz', 'ATP-018-COL', 3300, 9),
('Roberto Vega', 'ATP-019-ESP', 2800, 10),
('Patricia Castro', 'ATP-020-ESP', 3100, 10);

-- Insertar Vuelos
INSERT INTO vuelos (numero_vuelo, fecha_salida, fecha_llegada, estado, id_aeropuerto_origen, id_aeropuerto_destino) VALUES
('IB6501', '2025-02-01 08:00:00', '2025-02-01 17:30:00', 'programado', 1, 3),
('IB6502', '2025-02-02 10:00:00', '2025-02-02 13:00:00', 'programado', 1, 6),
('UX9201', '2025-02-01 14:00:00', '2025-02-01 16:30:00', 'en_vuelo', 1, 2),
('VY8301', '2025-02-03 09:00:00', '2025-02-03 18:00:00', 'programado', 2, 4),
('AA1234', '2025-02-01 06:00:00', '2025-02-01 08:30:00', 'finalizado', 3, 5),
('UA5678', '2025-02-02 12:00:00', '2025-02-02 21:00:00', 'programado', 4, 8),
('AF7890', '2025-02-01 16:00:00', '2025-02-01 18:30:00', 'en_vuelo', 6, 7),
('BA3456', '2025-02-04 11:00:00', '2025-02-04 13:00:00', 'programado', 7, 6),
('LA2345', '2025-02-01 20:00:00', '2025-02-02 09:00:00', 'programado', 9, 1),
('AV6789', '2025-02-03 15:00:00', '2025-02-03 20:00:00', 'programado', 10, 5),
('IB6503', '2025-02-05 07:00:00', '2025-02-05 09:30:00', 'programado', 1, 7),
('FR1111', '2025-02-01 05:00:00', '2025-02-01 07:30:00', 'cancelado', 1, 6);

-- Insertar Pasajeros
INSERT INTO pasajeros (nombre, documento, nacionalidad) VALUES
('José González', 'DNI12345678A', 'España'),
('Carmen Díaz', 'DNI23456789B', 'España'),
('Antonio Ruiz', 'DNI34567890C', 'España'),
('Isabel Moreno', 'DNI45678901D', 'España'),
('Francisco Álvarez', 'DNI56789012E', 'España'),
('Dolores Romero', 'DNI67890123F', 'España'),
('Manuel Torres', 'DNI78901234G', 'España'),
('Pilar Ramírez', 'DNI89012345H', 'España'),
('John Anderson', 'PASS123456', 'Estados Unidos'),
('Mary Williams', 'PASS234567', 'Estados Unidos'),
('Robert Jones', 'PASS345678', 'Estados Unidos'),
('Lisa Brown', 'PASS456789', 'Estados Unidos'),
('Jean Dupont', 'PASS567890', 'Francia'),
('Marie Laurent', 'PASS678901', 'Francia'),
('Giorgio Rossi', 'PASS789012', 'Italia'),
('Sofia Bianchi', 'PASS890123', 'Italia'),
('Carlos Mendoza', 'DNI90123456I', 'Perú'),
('Ana Vargas', 'DNI01234567J', 'Colombia'),
('Luis Herrera', 'DNI12345678K', 'México'),
('Rosa Flores', 'DNI23456789L', 'Argentina');

-- Asignar pilotos a vuelos
INSERT INTO vuelos_pilotos (id_vuelo, id_piloto, rol) VALUES
(1, 1, 'capitan'),
(1, 2, 'copiloto'),
(2, 1, 'capitan'),
(2, 6, 'copiloto'),
(3, 3, 'capitan'),
(3, 4, 'copiloto'),
(4, 5, 'capitan'),
(4, 6, 'copiloto'),
(5, 7, 'capitan'),
(5, 8, 'copiloto'),
(6, 9, 'capitan'),
(6, 10, 'copiloto'),
(7, 11, 'capitan'),
(7, 12, 'copiloto'),
(8, 13, 'capitan'),
(8, 14, 'copiloto'),
(9, 16, 'capitan'),
(9, 15, 'copiloto'),
(10, 17, 'capitan'),
(10, 18, 'copiloto');

-- Asignar pasajeros a vuelos
INSERT INTO vuelos_pasajeros (id_vuelo, id_pasajero, asiento) VALUES
(1, 1, '12A'),
(1, 2, '12B'),
(1, 9, '15C'),
(1, 10, '15D'),
(2, 3, '8A'),
(2, 4, '8B'),
(2, 13, '10C'),
(3, 5, '5A'),
(3, 6, '5B'),
(4, 7, '20A'),
(4, 8, '20B'),
(4, 11, '22C'),
(5, 9, '3A'),
(5, 10, '3B'),
(5, 12, '4A'),
(6, 11, '18A'),
(6, 12, '18B'),
(7, 13, '7A'),
(7, 14, '7B'),
(8, 13, '11A'),
(8, 14, '11B'),
(9, 17, '14A'),
(9, 18, '14B'),
(9, 1, '16C'),
(10, 18, '9A'),
(10, 19, '9B'),
(10, 20, '9C');