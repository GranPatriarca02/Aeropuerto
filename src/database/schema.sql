
DROP TABLE IF EXISTS vuelos_pasajeros CASCADE;
DROP TABLE IF EXISTS vuelos_pilotos CASCADE;
DROP TABLE IF EXISTS pasajeros CASCADE;
DROP TABLE IF EXISTS vuelos CASCADE;
DROP TABLE IF EXISTS pilotos CASCADE;
DROP TABLE IF EXISTS aerolineas CASCADE;
DROP TABLE IF EXISTS aeropuertos CASCADE;

-- Crear tablas
CREATE TABLE aeropuertos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    codigo_iata CHAR(3) UNIQUE NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    pais VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE aerolineas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    codigo VARCHAR(10) UNIQUE NOT NULL,
    activa BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pilotos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    licencia VARCHAR(50) UNIQUE NOT NULL,
    horas_vuelo INT DEFAULT 0,
    id_aerolinea INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_aerolinea) REFERENCES aerolineas(id) ON DELETE CASCADE
);

CREATE TABLE vuelos (
    id SERIAL PRIMARY KEY,
    numero_vuelo VARCHAR(20) NOT NULL,
    fecha_salida TIMESTAMP NOT NULL,
    fecha_llegada TIMESTAMP NOT NULL,
    estado VARCHAR(20)
        CHECK (estado IN ('programado','en_vuelo','cancelado','finalizado'))
        DEFAULT 'programado',
    id_aeropuerto_origen INT NOT NULL,
    id_aeropuerto_destino INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_aeropuerto_origen) REFERENCES aeropuertos(id) ON DELETE CASCADE,
    FOREIGN KEY (id_aeropuerto_destino) REFERENCES aeropuertos(id) ON DELETE CASCADE
);

CREATE TABLE pasajeros (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    documento VARCHAR(50) UNIQUE NOT NULL,
    nacionalidad VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vuelos_pilotos (
    id SERIAL PRIMARY KEY,
    id_vuelo INT NOT NULL,
    id_piloto INT NOT NULL,
    rol VARCHAR(20)
        CHECK (rol IN ('capitan','copiloto'))
        NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_vuelo) REFERENCES vuelos(id) ON DELETE CASCADE,
    FOREIGN KEY (id_piloto) REFERENCES pilotos(id) ON DELETE CASCADE
);

CREATE TABLE vuelos_pasajeros (
    id SERIAL PRIMARY KEY,
    id_vuelo INT NOT NULL,
    id_pasajero INT NOT NULL,
    asiento VARCHAR(5) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_vuelo) REFERENCES vuelos(id) ON DELETE CASCADE,
    FOREIGN KEY (id_pasajero) REFERENCES pasajeros(id) ON DELETE CASCADE
);