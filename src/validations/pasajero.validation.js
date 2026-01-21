export const validateCreatePasajero = (data) => {
    // 1. Validar Nombre 
    if (!data.nombre || typeof data.nombre !== 'string') {
        return 'El nombre es requerido y debe ser texto';
    }
    if (data.nombre.length < 3 || data.nombre.length > 100) {
        return 'El nombre debe tener entre 3 y 100 caracteres';
    }

    // 2. Validar Documento 
    if (!data.documento || typeof data.documento !== 'string') {
        return 'El documento es requerido y debe ser texto';
    }
    // Ponemos un minimo de 5 porque un DNI o pasaporte suele ser largo
    if (data.documento.length < 5 || data.documento.length > 50) {
        return 'El documento debe tener entre 5 y 50 caracteres';
    }

    // 3. Validar Nacionalidad 
    // Solo validamos si viene algo distinto de null o cadena vacia
    if (data.nacionalidad) {
        if (typeof data.nacionalidad !== 'string') {
            return 'La nacionalidad debe ser texto';
        }
        if (data.nacionalidad.length < 2 || data.nacionalidad.length > 50) {
            return 'La nacionalidad debe tener entre 2 y 50 caracteres';
        }
    }

    return null;
};

// Validacion para actualizar un pasajero 
export const validateUpdatePasajero = (data) => {
    // Primero comprobamos si nos han enviado al menos un campo para actualizar
    const campos = Object.keys(data);
    if (campos.length === 0) {
        return 'Debes enviar al menos un campo para actualizar';
    }

    // Si envian el nombre, lo validamos
    if (data.nombre !== undefined) {
        if (typeof data.nombre !== 'string' || data.nombre.length < 3 || data.nombre.length > 100) {
            return 'El nombre debe ser texto entre 3 y 100 caracteres';
        }
    }

    // Si envian el documento, lo validamos
    if (data.documento !== undefined) {
        if (typeof data.documento !== 'string' || data.documento.length < 5 || data.documento.length > 50) {
            return 'El documento debe ser texto entre 5 y 50 caracteres';
        }
    }

    // Si envian la nacionalidad, la validamos
    if (data.nacionalidad !== undefined && data.nacionalidad !== null && data.nacionalidad !== '') {
        if (typeof data.nacionalidad !== 'string' || data.nacionalidad.length < 2 || data.nacionalidad.length > 50) {
            return 'La nacionalidad debe ser texto entre 2 y 50 caracteres';
        }
    }

    return null;
};