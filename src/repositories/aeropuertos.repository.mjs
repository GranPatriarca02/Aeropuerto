
// Importamos el cliente de Supabase
import { supabase } from '../config/supabase.js';

// Importamos el modelo de Aeropuerto
import { Aeropuerto } from '../models/Aeropuerto.mjs';

// Exportamos la clase del repositorio
export class AeropuertosRepository {
  
  // FIND ALL - Obtener todos los aeropuertos
  async findAll() {
    
    // PASO 1: Ejecutar query en Supabase, .from('aeropuertos') → selecciona la tabla, .select('*') → selecciona todas las columnas, .order('id', { ascending: true }) → ordena por ID ascendente
    const { data, error } = await supabase
      .from('aeropuertos')
      .select('*')
      .order('id', { ascending: true });
    
    // PASO 2: Manejar errores de Supabase, Si hay error (conexión, permisos, etc.), lanzarlo
    if (error) throw error;
    
    // PASO 3: Convertir datos a objetos Aeropuerto, data es un array: [ {id: 1, nombre: "..."}, {id: 2, ...} ]
    // .map() transforma cada objeto en instancia de Aeropuerto
    return data.map(item => new Aeropuerto(item));
  }

  // FIND BY ID - Buscar aeropuerto por ID
  async findById(id) {
    
    // PASO 1: Query con filtro
    // .eq('id', id) → WHERE id = ?
    // .single() → esperamos UN solo resultado (no array)
    const { data, error } = await supabase
      .from('aeropuertos')
      .select('*')
      .eq('id', id)
      .single();
    
    // PASO 2: Manejar error
    if (error) throw error;
    
    // PASO 3: Devolver aeropuerto o null, Si no existe, data será null
    return data ? new Aeropuerto(data) : null;
  }

  // FIND BY CODIGO IATA - Buscar por código IATA
  async findByCodigoIata(codigo) {
    
    // PASO 1: Query filtrando por código IATA
    const { data, error } = await supabase
      .from('aeropuertos')
      .select('*')
      .eq('codigo_iata', codigo)
      .single();
    
    // PASO 2: Manejar error especial
    // PGRST116 = "No se encontraron filas"
    // No es un error crítico, simplemente no existe
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    // PASO 3: Devolver resultado
    return data ? new Aeropuerto(data) : null;
  }

  // CREATE - Insertar nuevo aeropuerto
  async create(aeropuertoData) {
    
    // PASO 1: Insertar en la tabla
    // .insert() → INSERT INTO aeropuertos (...)
    // .select() → devuelve el registro insertado
    // .single() → un solo resultado
    const { data, error } = await supabase
      .from('aeropuertos')
      .insert(aeropuertoData)
      .select()
      .single();
    
    // PASO 2: Manejar error, Posibles errores:Código IATA duplicado (unique constraint) y Campos faltantes (not null constraint)
    if (error) throw error;
    
    // PASO 3: Devolver el aeropuerto creado
    // data incluye el ID auto-generado
    return new Aeropuerto(data);
  }

  // UPDATE - Actualizar aeropuerto existente
  async update(id, aeropuertoData) {
    
    // PASO 1: Actualizar en la tabla
    // .update() → UPDATE aeropuertos SET ...
    // Agregamos updated_at con timestamp actual
    // .eq('id', id) → WHERE id = ?
    const { data, error } = await supabase
      .from('aeropuertos')
      .update({ 
        ...aeropuertoData,                    // Datos a actualizar
        updated_at: new Date().toISOString()  // Timestamp actual
      })
      .eq('id', id)
      .select()
      .single();
    
    // PASO 2: Manejar error
    if (error) throw error;
    
    // PASO 3: Devolver aeropuerto actualizado
    return data ? new Aeropuerto(data) : null;
  }

  // DELETE - Eliminar aeropuerto
  async delete(id) {
    // PASO 1: Eliminar de la tabla
    // .delete() → DELETE FROM aeropuertos
    // .eq('id', id) → WHERE id = ?
    const { error } = await supabase
      .from('aeropuertos')
      .delete()
      .eq('id', id);
    
    // PASO 2: Manejar error, Posibles errores: Restricción de clave foránea (hay vuelos usando este aeropuerto)
    if (error) throw error;
    
    // PASO 3: Devolver true (éxito)
    return true;
  }
}