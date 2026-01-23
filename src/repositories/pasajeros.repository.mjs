// Importamos el cliente de Supabase
import { supabase } from '../config/supabase.js';

// Importamos el modelo de Pasajero
import { Pasajero } from '../models/Pasajero.mjs';

// Exportamos la clase del repositorio
export class PasajerosRepository {
  
  // FIND ALL - Obtener todos los pasajeros
  async findAll() {
    
    // PASO 1: Ejecutar query en Supabase
    // .from('pasajeros') → selecciona la tabla
    // .select('*') → selecciona todas las columnas
    // .order('id', { ascending: true }) → ordena por ID ascendente
    const { data, error } = await supabase
      .from('pasajeros')
      .select('*')
      .order('id', { ascending: true });
    
    // PASO 2: Manejar errores de Supabase
    // Si hay error (conexión, permisos, etc.), lanzarlo
    if (error) throw error;
    
    // PASO 3: Convertir datos a objetos Pasajero
    // data es un array: [ {id: 1, nombre: "..."}, {id: 2, ...} ]
    // .map() transforma cada objeto en instancia de Pasajero
    return data.map(item => new Pasajero(item));
  }

  // FIND BY ID - Buscar pasajero por ID
  async findById(id) {
    
    // PASO 1: Query con filtro
    // .eq('id', id) → WHERE id = ?
    // .single() → esperamos UN solo resultado (no array)
    const { data, error } = await supabase
      .from('pasajeros')
      .select('*')
      .eq('id', id)
      .single();
    
    // PASO 2: Manejar error
    if (error) throw error;
    
    // PASO 3: Devolver pasajero o null
    // Si no existe, data será null
    return data ? new Pasajero(data) : null;
  }

  // FIND BY DOCUMENTO - Buscar por documento de identidad
  async findByDocumento(documento) {
    
    // PASO 1: Query filtrando por documento
    const { data, error } = await supabase
      .from('pasajeros')
      .select('*')
      .eq('documento', documento)
      .single();
    
    // PASO 2: Manejar error especial
    // PGRST116 = "No se encontraron filas"
    // No es un error crítico, simplemente no existe
    if (error && error.code !== 'PGRST116') throw error;
    
    // PASO 3: Devolver resultado
    return data ? new Pasajero(data) : null;
  }

  // CREATE - Insertar nuevo pasajero
  async create(pasajeroData) {
    
    // PASO 1: Insertar en la tabla
    // .insert() → INSERT INTO pasajeros (...)
    // .select() → devuelve el registro insertado
    // .single() → un solo resultado
    const { data, error } = await supabase
      .from('pasajeros')
      .insert(pasajeroData)
      .select()
      .single();
    
    // PASO 2: Manejar error
    // Posibles errores: Documento duplicado (unique constraint) y Campos faltantes (not null constraint)
    if (error) throw error;
    
    // PASO 3: Devolver el pasajero creado
    // data incluye el ID auto-generado
    return new Pasajero(data);
  }

  // UPDATE - Actualizar pasajero existente
  async update(id, pasajeroData) {
    
    // PASO 1: Actualizar en la tabla
    // .update() → UPDATE pasajeros SET ...
    // Agregamos updated_at con timestamp actual
    // .eq('id', id) → WHERE id = ?
    const { data, error } = await supabase
      .from('pasajeros')
      .update({ 
        ...pasajeroData,                     // Datos a actualizar
        updated_at: new Date().toISOString() // Timestamp actual
      })
      .eq('id', id)
      .select()
      .single();
    
    // PASO 2: Manejar error
    if (error) throw error;
    
    // PASO 3: Devolver pasajero actualizado
    return data ? new Pasajero(data) : null;
  }

  // DELETE - Eliminar pasajero
  async delete(id) {
    
    // PASO 1: Eliminar de la tabla
    // .delete() → DELETE FROM pasajeros
    // .eq('id', id) → WHERE id = ?
    const { error } = await supabase
      .from('pasajeros')
      .delete()
      .eq('id', id);
    
    // PASO 2: Manejar error
    // Posibles errores: Restricción de clave foránea (hay vuelos asignados a este pasajero)
    if (error) throw error;
    
    // PASO 3: Devolver true (éxito)
    return true;
  }
}