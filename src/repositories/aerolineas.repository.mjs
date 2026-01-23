// Importamos el cliente de Supabase
import { supabase } from '../config/supabase.js';

// Importamos el modelo de Aerolinea
import { Aerolinea } from '../models/Aerolinea.mjs';

// Exportamos la clase del repositorio
export class AerolineasRepository {
  
  // FIND ALL - Obtener todas las aerolíneas
  async findAll() {
    
    // PASO 1: Ejecutar query en Supabase
    // .from('aerolineas') → selecciona la tabla
    // .select('*') → selecciona todas las columnas
    // .order('id', { ascending: true }) → ordena por ID ascendente
    const { data, error } = await supabase
      .from('aerolineas')
      .select('*')
      .order('id', { ascending: true });
    
    // PASO 2: Manejar errores de Supabase
    // Si hay error (conexión, permisos, etc.), lanzarlo
    if (error) throw error;
    
    // PASO 3: Convertir datos a objetos Aerolinea
    // data es un array: [ {id: 1, nombre: "..."}, {id: 2, ...} ]
    // .map() transforma cada objeto en instancia de Aerolinea
    return data.map(item => new Aerolinea(item));
  }

  // FIND BY ID - Buscar aerolínea por ID
  async findById(id) {
    
    // PASO 1: Query con filtro
    // .eq('id', id) → WHERE id = ?
    // .single() → esperamos UN solo resultado (no array)
    const { data, error } = await supabase
      .from('aerolineas')
      .select('*')
      .eq('id', id)
      .single();
    
    // PASO 2: Manejar error
    if (error) throw error;
    
    // PASO 3: Devolver aerolínea o null
    // Si no existe, data será null
    return data ? new Aerolinea(data) : null;
  }

  // FIND BY CODIGO - Buscar por código de aerolínea
  async findByCodigo(codigo) {
    
    // PASO 1: Query filtrando por código
    const { data, error } = await supabase
      .from('aerolineas')
      .select('*')
      .eq('codigo', codigo)
      .single();
    
    // PASO 2: Manejar error especial
    // PGRST116 = "No se encontraron filas"
    // No es un error crítico, simplemente no existe
    if (error && error.code !== 'PGRST116') throw error;
    
    // PASO 3: Devolver resultado
    return data ? new Aerolinea(data) : null;
  }

  // CREATE - Insertar nueva aerolínea
  async create(aerolineaData) {
    
    // PASO 1: Insertar en la tabla
    // .insert() → INSERT INTO aerolineas (...)
    // .select() → devuelve el registro insertado
    // .single() → un solo resultado
    const { data, error } = await supabase
      .from('aerolineas')
      .insert(aerolineaData)
      .select()
      .single();
    
    // PASO 2: Manejar error
    // Posibles errores: Código duplicado (unique constraint) y Campos faltantes (not null constraint)
    if (error) throw error;
    
    // PASO 3: Devolver la aerolínea creada
    // data incluye el ID auto-generado
    return new Aerolinea(data);
  }

  // UPDATE - Actualizar aerolínea existente
  async update(id, aerolineaData) {
    
    // PASO 1: Actualizar en la tabla
    // .update() → UPDATE aerolineas SET ...
    // Agregamos updated_at con timestamp actual
    // .eq('id', id) → WHERE id = ?
    const { data, error } = await supabase
      .from('aerolineas')
      .update({ 
        ...aerolineaData,                    // Datos a actualizar
        updated_at: new Date().toISOString() // Timestamp actual
      })
      .eq('id', id)
      .select()
      .single();
    
    // PASO 2: Manejar error
    if (error) throw error;
    
    // PASO 3: Devolver aerolínea actualizada
    return data ? new Aerolinea(data) : null;
  }

  // DELETE - Eliminar aerolínea
  async delete(id) {
    
    // PASO 1: Eliminar de la tabla
    // .delete() → DELETE FROM aerolineas
    // .eq('id', id) → WHERE id = ?
    const { error } = await supabase
      .from('aerolineas')
      .delete()
      .eq('id', id);
    
    // PASO 2: Manejar error
    // Posibles errores: Restricción de clave foránea (hay pilotos usando esta aerolínea)
    if (error) throw error;
    
    // PASO 3: Devolver true (éxito)
    return true;
  }
}
