// Importamos el cliente de Supabase
import { supabase } from '../config/supabase.js';

// Exportamos la clase del repositorio
// Esta tabla relaciona vuelos con pilotos (relación N:M)
export class VuelosPilotosRepository {
  
  // FIND BY VUELO - Obtener pilotos asignados a un vuelo
  async findByVuelo(idVuelo) {
    
    // PASO 1: Query con JOIN
    // .select() incluye datos de la tabla pilotos relacionada
    // vuelos_pilotos (*) → todos los campos de la tabla intermedia
    // pilotos (*) → todos los campos de la tabla pilotos
    const { data, error } = await supabase
      .from('vuelos_pilotos')
      .select(`
        *,
        pilotos (*)
      `)
      .eq('id_vuelo', idVuelo);
    
    // PASO 2: Manejar error
    if (error) throw error;
    
    // PASO 3: Devolver datos
    // Formato: [ { id, id_vuelo, id_piloto, rol, pilotos: {...} }, ... ]
    return data;
  }

  // FIND BY PILOTO - Obtener vuelos asignados a un piloto
  async findByPiloto(idPiloto) {
    
    // PASO 1: Query con JOIN
    // Incluye datos del vuelo relacionado
    // .order('created_at', { ascending: false }) → más recientes primero
    const { data, error } = await supabase
      .from('vuelos_pilotos')
      .select(`
        *,
        vuelos (*)
      `)
      .eq('id_piloto', idPiloto)
      .order('created_at', { ascending: false });
    
    // PASO 2: Manejar error
    if (error) throw error;
    
    // PASO 3: Devolver datos
    // Formato: [ { id, id_vuelo, id_piloto, rol, vuelos: {...} }, ... ]
    return data;
  }

  // CREATE - Asignar un piloto a un vuelo
  async create(vueloPilotoData) {
    
    // PASO 1: Insertar en la tabla intermedia
    // .insert() → INSERT INTO vuelos_pilotos (id_vuelo, id_piloto, rol)
    // vueloPilotoData debe contener: { id_vuelo, id_piloto, rol }
    const { data, error } = await supabase
      .from('vuelos_pilotos')
      .insert(vueloPilotoData)
      .select()
      .single();
    
    // PASO 2: Manejar error
    // Posibles errores: Foreign key constraint (vuelo o piloto no existe) y Check constraint (rol inválido: debe ser 'capitan' o 'copiloto')
    if (error) throw error;
    
    // PASO 3: Devolver asignación creada
    return data;
  }

  // DELETE - Desasignar un piloto de un vuelo
  async delete(idVuelo, idPiloto) {
    
    // PASO 1: Eliminar de la tabla intermedia
    // .delete() → DELETE FROM vuelos_pilotos
    // Necesitamos ambos IDs porque es una relación compuesta
    const { error } = await supabase
      .from('vuelos_pilotos')
      .delete()
      .eq('id_vuelo', idVuelo)
      .eq('id_piloto', idPiloto);
    
    // PASO 2: Manejar error
    if (error) throw error;
    
    // PASO 3: Devolver true (éxito)
    return true;
  }

  // DELETE BY VUELO - Eliminar todas las asignaciones de un vuelo
  async deleteByVuelo(idVuelo) {
    
    // PASO 1: Eliminar todos los pilotos de un vuelo
    // Útil cuando se cancela un vuelo
    const { error } = await supabase
      .from('vuelos_pilotos')
      .delete()
      .eq('id_vuelo', idVuelo);
    
    // PASO 2: Manejar error
    if (error) throw error;
    
    // PASO 3: Devolver true (éxito)
    return true;
  }
}