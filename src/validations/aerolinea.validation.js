export const validateCreateAerolinea = (data) => {
    // Validar Nombre
    if (!data.nombre || typeof data.nombre !== 'string') {
        return 'El nombre de la aerolínea es obligatorio';
    }
    if (data.nombre.length < 3) {
        return 'El nombre debe tener al menos 3 caracteres';
    }

    //  Validar Código
    if (!data.codigo || typeof data.codigo !== 'string') {
        return 'El código es obligatorio';
    }
    if (data.codigo.length < 2 || data.codigo.length > 10) {
        return 'El código debe tener entre 2 y 10 caracteres';
    }

    // Validar
    if (data.activa !== undefined && typeof data.activa !== 'boolean') {
        return 'El campo activa debe ser verdadero o falso';
    }

    return null;
};