export const validateAerolinea = (data, isUpdate = false) => {
    // Validar Nombre
    // Solo valida si no es update (obligatorio) O si el nombre viene en los datos
    if (!isUpdate || data.nombre !== undefined) {
        if (!data.nombre || typeof data.nombre !== 'string') {
            return 'El nombre de la aerolínea es obligatorio';
        }
        if (data.nombre.length < 3) {
            return 'El nombre debe tener al menos 3 caracteres';
        }
    }

    // Validar Código
    if (!isUpdate || data.codigo !== undefined) {
        if (!data.codigo || typeof data.codigo !== 'string') {
            return 'El código es obligatorio';
        }
        if (data.codigo.length < 2 || data.codigo.length > 10) {
            return 'El código debe tener entre 2 y 10 caracteres';
        }
    }

    // Validar Activa (siempre opcional, pero si viene, debe ser booleano)
    if (data.activa !== undefined && typeof data.activa !== 'boolean') {
        return 'El campo activa debe ser verdadero o falso';
    }

    return null;
};