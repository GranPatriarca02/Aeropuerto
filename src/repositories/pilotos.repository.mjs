
// ============================================
// PILOTOS REPOSITORY
// ============================================

// Importamos el cliente de Supabase
import { supabase } from '../config/supabase.js';

// Importamos el modelo de Piloto
import { Piloto } from '../models/Piloto.mjs';

// Exportamos la clase del repositorio
export class PilotosRepository {
  
  // FIND ALL - Obtener todos los pilotos
  async findAll() {
    
    // PASO 1: Ejecutar query en Supabase
    // .from('pilotos') → selecciona la tabla
    // .select('*') → selecciona todas las columnas
    // .order('id', { ascending: true }) → ordena por ID ascendente
    const { data, error } = await supabase
      .from('pilotos')
      .select('*')
      .order('id', { ascending: true });
    
    // PASO 2: Manejar errores de Supabase
    // Si hay error (conexión, permisos, etc.), lanzarlo
    if (error) throw error;
    
    // PASO 3: Convertir datos a objetos Piloto
    // data es un array: [ {id: 1, nombre: "..."}, {id: 2, ...} ]
    // .map() transforma cada objeto en instancia de Piloto
    return data.map(item => new Piloto(item));
  }

  // FIND BY ID - Buscar piloto por ID
  async findById(id) {
    
    // PASO 1: Query con filtro
    // .eq('id', id) → WHERE id = ?
    // .single() → esperamos UN solo resultado (no array)
    const { data, error } = await supabase
      .from('pilotos')
      .select('*')
      .eq('id', id)
      .single();
    
    // PASO 2: Manejar error
    if (error) throw error;
    
    // PASO 3: Devolver piloto o null
    // Si no existe, data será null
    return data ? new Piloto(data) : null;
  }

  // FIND BY AEROLINEA - Buscar pilotos de una aerolínea específica
  async findByAerolinea(idAerolinea) {
    
    // PASO 1: Query filtrando por ID de aerolínea
    // .eq('id_aerolinea', idAerolinea) → WHERE id_aerolinea = ?
    // .order('horas_vuelo', { ascending: false }) → ordena por horas de vuelo (descendente)
    const { data, error } = await supabase
      .from('pilotos')
      .select('*')
      .eq('id_aerolinea', idAerolinea)
      .order('horas_vuelo', { ascending: false });
    
    // PASO 2: Manejar error
    if (error) throw error;
    
    // PASO 3: Convertir datos a objetos Piloto
    return data.map(item => new Piloto(item));
  }

  // CREATE - Insertar nuevo piloto
  async create(pilotoData) {
    
    // PASO 1: Insertar en la tabla
    // .insert() → INSERT INTO pilotos (...)
    // .select() → devuelve el registro insertado
    // .single() → un solo resultado
    const { data, error } = await supabase
      .from('pilotos')
      .insert(pilotoData)
      .select()
      .single();
    
    // PASO 2: Manejar error
    // Posibles errores: Licencia duplicada (unique constraint) y id_aerolinea inválido (foreign key constraint)
    if (error) throw error;
    
    // PASO 3: Devolver el piloto creado
    // data incluye el ID auto-generado
    return new Piloto(data);
  }

  // UPDATE - Actualizar piloto existente
  async update(id, pilotoData) {
    
    // PASO 1: Actualizar en la tabla
    // .update() → UPDATE pilotos SET ...
    // Agregamos updated_at con timestamp actual
    // .eq('id', id) → WHERE id = ?
    const { data, error } = await supabase
      .from('pilotos')
      .update({ 
        ...pilotoData,                       // Datos a actualizar
        updated_at: new Date().toISOString() // Timestamp actual
      })
      .eq('id', id)
      .select()
      .single();
    
    // PASO 2: Manejar error
    if (error) throw error;
    
    // PASO 3: Devolver piloto actualizado
    return data ? new Piloto(data) : null;
  }

  // DELETE - Eliminar piloto
  async delete(id) {
    
    // PASO 1: Eliminar de la tabla
    // .delete() → DELETE FROM pilotos
    // .eq('id', id) → WHERE id = ?
    const { error } = await supabase
      .from('pilotos')
      .delete()
      .eq('id', id);
    
    // PASO 2: Manejar error
    // Posibles errores: Restricción de clave foránea (hay vuelos asignados a este piloto)
    if (error) throw error;
    
    // PASO 3: Devolver true (éxito)
    return true;
  }

  // GET TOP PILOTOS BY HORAS - Obtener top pilotos por horas de vuelo
  async getTopPilotosByHoras(limit = 10) {
    
    // PASO 1: Query ordenada por horas de vuelo
    // .order('horas_vuelo', { ascending: false }) → orden descendente
    // .limit(limit) → limita resultados (por defecto 10)
    const { data, error } = await supabase
      .from('pilotos')
      .select('*')
      .order('horas_vuelo', { ascending: false })
      .limit(limit);
    
    // PASO 2: Manejar error
    if (error) throw error;
    
    // PASO 3: Convertir datos a objetos Piloto
    return data.map(item => new Piloto(item));
  }
}