// Importamos el cliente de Supabase
import { supabase } from '../config/supabase.js';

// Importamos el modelo de Vuelo
import { Vuelo } from '../models/Vuelo.mjs';

// Exportamos la clase del repositorio
export class VuelosRepository {
  
  // FIND ALL - Obtener todos los vuelos
  async findAll() {
    
    // PASO 1: Ejecutar query en Supabase
    // .from('vuelos') → selecciona la tabla
    // .select('*') → selecciona todas las columnas
    // .order('fecha_salida', { ascending: false }) → ordena por fecha de salida (descendente)
    // Los vuelos más recientes aparecen primero
    const { data, error } = await supabase
      .from('vuelos')
      .select('*')
      .order('fecha_salida', { ascending: false });
    
    // PASO 2: Manejar errores de Supabase
    // Si hay error (conexión, permisos, etc.), lanzarlo
    if (error) throw error;
    
    // PASO 3: Convertir datos a objetos Vuelo
    // data es un array: [ {id: 1, numero_vuelo: "..."}, {id: 2, ...} ]
    // .map() transforma cada objeto en instancia de Vuelo
    return data.map(item => new Vuelo(item));
  }

  // FIND BY ID - Buscar vuelo por ID
  async findById(id) {
    
    // PASO 1: Query con filtro
    // .eq('id', id) → WHERE id = ?
    // .single() → esperamos UN solo resultado (no array)
    const { data, error } = await supabase
      .from('vuelos')
      .select('*')
      .eq('id', id)
      .single();
    
    // PASO 2: Manejar error
    if (error) throw error;
    
    // PASO 3: Devolver vuelo o null
    // Si no existe, data será null
    return data ? new Vuelo(data) : null;
  }

  // FIND BY AEROPUERTO - Buscar vuelos que pasan por un aeropuerto
  async findByAeropuerto(idAeropuerto) {
    
    // PASO 1: Query filtrando por origen O destino
    // .or() → WHERE id_aeropuerto_origen = X OR id_aeropuerto_destino = X
    // Busca vuelos que salen O llegan a ese aeropuerto
    const { data, error } = await supabase
      .from('vuelos')
      .select('*')
      .or(`id_aeropuerto_origen.eq.${idAeropuerto},id_aeropuerto_destino.eq.${idAeropuerto}`)
      .order('fecha_salida', { ascending: false });
    
    // PASO 2: Manejar error
    if (error) throw error;
    
    // PASO 3: Convertir datos a objetos Vuelo
    return data.map(item => new Vuelo(item));
  }

  // FIND BY ESTADO - Buscar vuelos por estado
  async findByEstado(estado) {
    
    // PASO 1: Query filtrando por estado
    // .eq('estado', estado) → WHERE estado = 'programado'/'en_vuelo'/'cancelado'/'finalizado'
    const { data, error } = await supabase
      .from('vuelos')
      .select('*')
      .eq('estado', estado)
      .order('fecha_salida', { ascending: false });
    
    // PASO 2: Manejar error
    if (error) throw error;
    
    // PASO 3: Convertir datos a objetos Vuelo
    return data.map(item => new Vuelo(item));
  }

  // CREATE - Insertar nuevo vuelo
  async create(vueloData) {
    
    // PASO 1: Insertar en la tabla
    // .insert() → INSERT INTO vuelos (...)
    // .select() → devuelve el registro insertado
    // .single() → un solo resultado
    const { data, error } = await supabase
      .from('vuelos')
      .insert(vueloData)
      .select()
      .single();
    
    // PASO 2: Manejar error
    // Posibles errores: Foreign key constraint (aeropuertos no existen) y Check constraint (estado inválido, fecha_llegada < fecha_salida)
    if (error) throw error;
    
    // PASO 3: Devolver el vuelo creado
    // data incluye el ID auto-generado
    return new Vuelo(data);
  }

  // UPDATE - Actualizar vuelo existente
  async update(id, vueloData) {
    
    // PASO 1: Actualizar en la tabla
    // .update() → UPDATE vuelos SET ...
    // Agregamos updated_at con timestamp actual
    // .eq('id', id) → WHERE id = ?
    const { data, error } = await supabase
      .from('vuelos')
      .update({ 
        ...vueloData,                        // Datos a actualizar
        updated_at: new Date().toISOString() // Timestamp actual
      })
      .eq('id', id)
      .select()
      .single();
    
    // PASO 2: Manejar error
    if (error) throw error;
    
    // PASO 3: Devolver vuelo actualizado
    return data ? new Vuelo(data) : null;
  }

  // DELETE - Eliminar vuelo
  async delete(id) {
    
    // PASO 1: Eliminar de la tabla
    // .delete() → DELETE FROM vuelos
    // .eq('id', id) → WHERE id = ?
    // Esto también eliminará automáticamente (CASCADE) los registros relacionados en:
    // - vuelos_pilotos (asignaciones de pilotos)
    // - vuelos_pasajeros (reservas de pasajeros)
    const { error } = await supabase
      .from('vuelos')
      .delete()
      .eq('id', id);
    
    // PASO 2: Manejar error
    if (error) throw error;
    
    // PASO 3: Devolver true (éxito)
    return true;
  }

  // COUNT BY ESTADO - Contar vuelos agrupados por estado
  async countByEstado() {
    
    // PASO 1: Obtener todos los estados
    // Solo necesitamos la columna 'estado'
    const { data, error } = await supabase
      .from('vuelos')
      .select('estado')
      .order('estado');
    
    // PASO 2: Manejar error
    if (error) throw error;
    
    // PASO 3: Contar manualmente con reduce
    // Creamos un objeto tipo: { programado: 5, en_vuelo: 2, cancelado: 1, finalizado: 3 }
    const counts = {};
    data.forEach(row => {
      counts[row.estado] = (counts[row.estado] || 0) + 1;
    });
    
    // PASO 4: Devolver objeto con conteos
    return counts;
  }
}