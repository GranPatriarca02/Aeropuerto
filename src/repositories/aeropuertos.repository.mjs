import { supabase } from '../config/supabase.js';
import { Aeropuerto } from '../models/Aeropuerto.mjs';

export class AeropuertosRepository {
  async findAll() {
    const { data, error } = await supabase
      .from('aeropuertos')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) throw error;
    return data.map(item => new Aeropuerto(item));
  }

  async findById(id) {
    const { data, error } = await supabase
      .from('aeropuertos')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data ? new Aeropuerto(data) : null;
  }

  async findByCodigoIata(codigo) {
    const { data, error } = await supabase
      .from('aeropuertos')
      .select('*')
      .eq('codigo_iata', codigo)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data ? new Aeropuerto(data) : null;
  }

  async create(aeropuertoData) {
    const { data, error } = await supabase
      .from('aeropuertos')
      .insert(aeropuertoData)
      .select()
      .single();
    
    if (error) throw error;
    return new Aeropuerto(data);
  }

  async update(id, aeropuertoData) {
    const { data, error } = await supabase
      .from('aeropuertos')
      .update({ ...aeropuertoData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data ? new Aeropuerto(data) : null;
  }

  async delete(id) {
    const { error } = await supabase
      .from('aeropuertos')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
}