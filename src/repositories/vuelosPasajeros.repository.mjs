// Importamos el cliente de Supabase
import { supabase } from '../config/supabase.js';

// Exportamos la clase del repositorio
// Esta tabla relaciona vuelos con pasajeros (relación N:M)
export class VuelosPasajerosRepository {
  
  // FIND BY VUELO - Obtener pasajeros de un vuelo
  async findByVuelo(idVuelo) {
    
    // PASO 1: Query con JOIN
    // .select() incluye datos de la tabla pasajeros relacionada
    // vuelos_pasajeros (*) → todos los campos de la tabla intermedia
    // pasajeros (*) → todos los campos de la tabla pasajeros
    const { data, error } = await supabase
      .from('vuelos_pasajeros')
      .select(`
        *,
        pasajeros (*)
      `)
      .eq('id_vuelo', idVuelo);
    
    // PASO 2: Manejar error
    if (error) throw error;
    
    // PASO 3: Devolver datos
    // Formato: [ { id, id_vuelo, id_pasajero, asiento, pasajeros: {...} }, ... ]
    return data;
  }

  // FIND BY PASAJERO - Obtener vuelos de un pasajero
  async findByPasajero(idPasajero) {
    
    // PASO 1: Query con JOIN
    // Incluye datos del vuelo relacionado
    // .order('created_at', { ascending: false }) → reservas más recientes primero
    const { data, error } = await supabase
      .from('vuelos_pasajeros')
      .select(`
        *,
        vuelos (*)
      `)
      .eq('id_pasajero', idPasajero)
      .order('created_at', { ascending: false });
    
    // PASO 2: Manejar error
    if (error) throw error;
    
    // PASO 3: Devolver datos
    // Formato: [ { id, id_vuelo, id_pasajero, asiento, vuelos: {...} }, ... ]
    return data;
  }

  // CREATE - Asignar un pasajero a un vuelo (crear reserva)
  async create(vueloPasajeroData) {
    
    // PASO 1: Insertar en la tabla intermedia
    // .insert() → INSERT INTO vuelos_pasajeros (id_vuelo, id_pasajero, asiento)
    // vueloPasajeroData debe contener: { id_vuelo, id_pasajero, asiento }
    const { data, error } = await supabase
      .from('vuelos_pasajeros')
      .insert(vueloPasajeroData)
      .select()
      .single();
    
    // PASO 2: Manejar error
    // Posibles errores: Foreign key constraint (vuelo o pasajero no existe) y Asiento duplicado en el mismo vuelo
    if (error) throw error;
    
    // PASO 3: Devolver reserva creada
    return data;
  }

  // DELETE - Desasignar un pasajero de un vuelo (cancelar reserva)
  async delete(idVuelo, idPasajero) {
    
    // PASO 1: Eliminar de la tabla intermedia
    // .delete() → DELETE FROM vuelos_pasajeros
    // Necesitamos ambos IDs porque es una relación compuesta
    const { error } = await supabase
      .from('vuelos_pasajeros')
      .delete()
      .eq('id_vuelo', idVuelo)
      .eq('id_pasajero', idPasajero);
    
    // PASO 2: Manejar error
    if (error) throw error;
    
    // PASO 3: Devolver true (éxito)
    return true;
  }

  // DELETE BY VUELO - Eliminar todas las reservas de un vuelo
  async deleteByVuelo(idVuelo) {
    
    // PASO 1: Eliminar todos los pasajeros de un vuelo
    // Útil cuando se cancela un vuelo
    const { error } = await supabase
      .from('vuelos_pasajeros')
      .delete()
      .eq('id_vuelo', idVuelo);
    
    // PASO 2: Manejar error
    if (error) throw error;
    
    // PASO 3: Devolver true (éxito)
    return true;
  }

  // COUNT BY VUELO - Contar pasajeros en un vuelo
  async countByVuelo(idVuelo) {
    
    // PASO 1: Contar registros
    // { count: 'exact', head: true } → solo cuenta, no devuelve datos
    const { count, error } = await supabase
      .from('vuelos_pasajeros')
      .select('*', { count: 'exact', head: true })
      .eq('id_vuelo', idVuelo);
    
    // PASO 2: Manejar error
    if (error) throw error;
    
    // PASO 3: Devolver el número de pasajeros
    // count será un número: 0, 1, 2, 3, etc.
    return count;
  }
}