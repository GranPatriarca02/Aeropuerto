import { supabase } from '../config/supabase.js';

export class VuelosPasajerosRepository {
  async findByVuelo(idVuelo) {
    const { data, error } = await supabase
      .from('vuelos_pasajeros')
      .select(`
        *,
        pasajeros (*)
      `)
      .eq('id_vuelo', idVuelo);
    
    if (error) throw error;
    return data;
  }

  async findByPasajero(idPasajero) {
    const { data, error } = await supabase
      .from('vuelos_pasajeros')
      .select(`
        *,
        vuelos (*)
      `)
      .eq('id_pasajero', idPasajero)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async create(vueloPasajeroData) {
    const { data, error } = await supabase
      .from('vuelos_pasajeros')
      .insert(vueloPasajeroData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async delete(idVuelo, idPasajero) {
    const { error } = await supabase
      .from('vuelos_pasajeros')
      .delete()
      .eq('id_vuelo', idVuelo)
      .eq('id_pasajero', idPasajero);
    
    if (error) throw error;
    return true;
  }

  async deleteByVuelo(idVuelo) {
    const { error } = await supabase
      .from('vuelos_pasajeros')
      .delete()
      .eq('id_vuelo', idVuelo);
    
    if (error) throw error;
    return true;
  }

  async countByVuelo(idVuelo) {
    const { count, error } = await supabase
      .from('vuelos_pasajeros')
      .select('*', { count: 'exact', head: true })
      .eq('id_vuelo', idVuelo);
    
    if (error) throw error;
    return count;
  }
}