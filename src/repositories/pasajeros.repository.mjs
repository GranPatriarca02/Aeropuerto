import { supabase } from '../config/supabase.js';
import { Pasajero } from '../models/Pasajero.mjs';

export class PasajerosRepository {
  async findAll() {
    const { data, error } = await supabase
      .from('pasajeros')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) throw error;
    return data.map(item => new Pasajero(item));
  }

  async findById(id) {
    const { data, error } = await supabase
      .from('pasajeros')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data ? new Pasajero(data) : null;
  }

  async findByDocumento(documento) {
    const { data, error } = await supabase
      .from('pasajeros')
      .select('*')
      .eq('documento', documento)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data ? new Pasajero(data) : null;
  }

  async create(pasajeroData) {
    const { data, error } = await supabase
      .from('pasajeros')
      .insert(pasajeroData)
      .select()
      .single();
    
    if (error) throw error;
    return new Pasajero(data);
  }

  async update(id, pasajeroData) {
    const { data, error } = await supabase
      .from('pasajeros')
      .update({ ...pasajeroData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data ? new Pasajero(data) : null;
  }

  async delete(id) {
    const { error } = await supabase
      .from('pasajeros')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
}