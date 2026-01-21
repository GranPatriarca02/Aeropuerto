import { supabase } from '../config/supabase.js';

export class VuelosPilotosRepository {
  async findByVuelo(idVuelo) {
    const { data, error } = await supabase
      .from('vuelos_pilotos')
      .select(`
        *,
        pilotos (*)
      `)
      .eq('id_vuelo', idVuelo);
    
    if (error) throw error;
    return data;
  }

  async findByPiloto(idPiloto) {
    const { data, error } = await supabase
      .from('vuelos_pilotos')
      .select(`
        *,
        vuelos (*)
      `)
      .eq('id_piloto', idPiloto)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async create(vueloPilotoData) {
    const { data, error } = await supabase
      .from('vuelos_pilotos')
      .insert(vueloPilotoData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async delete(idVuelo, idPiloto) {
    const { error } = await supabase
      .from('vuelos_pilotos')
      .delete()
      .eq('id_vuelo', idVuelo)
      .eq('id_piloto', idPiloto);
    
    if (error) throw error;
    return true;
  }

  async deleteByVuelo(idVuelo) {
    const { error } = await supabase
      .from('vuelos_pilotos')
      .delete()
      .eq('id_vuelo', idVuelo);
    
    if (error) throw error;
    return true;
  }
}