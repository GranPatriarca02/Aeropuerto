import { supabase } from '../config/supabase.js';
import { Piloto } from '../models/Piloto.mjs';

export class PilotosRepository {
  async findAll() {
    const { data, error } = await supabase
      .from('pilotos')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) throw error;
    return data.map(item => new Piloto(item));
  }

  async findById(id) {
    const { data, error } = await supabase
      .from('pilotos')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data ? new Piloto(data) : null;
  }

  async findByAerolinea(idAerolinea) {
    const { data, error } = await supabase
      .from('pilotos')
      .select('*')
      .eq('id_aerolinea', idAerolinea)
      .order('horas_vuelo', { ascending: false });
    
    if (error) throw error;
    return data.map(item => new Piloto(item));
  }

  async create(pilotoData) {
    const { data, error } = await supabase
      .from('pilotos')
      .insert(pilotoData)
      .select()
      .single();
    
    if (error) throw error;
    return new Piloto(data);
  }

  async update(id, pilotoData) {
    const { data, error } = await supabase
      .from('pilotos')
      .update({ ...pilotoData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data ? new Piloto(data) : null;
  }

  async delete(id) {
    const { error } = await supabase
      .from('pilotos')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  async getTopPilotosByHoras(limit = 10) {
    const { data, error } = await supabase
      .from('pilotos')
      .select('*')
      .order('horas_vuelo', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data.map(item => new Piloto(item));
  }
}