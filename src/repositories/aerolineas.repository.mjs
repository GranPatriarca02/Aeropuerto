import { supabase } from '../config/supabase.js';
import { Aerolinea } from '../models/Aerolinea.mjs';

export class AerolineasRepository {
  async findAll() {
    const { data, error } = await supabase
      .from('aerolineas')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) throw error;
    return data.map(item => new Aerolinea(item));
  }

  async findById(id) {
    const { data, error } = await supabase
      .from('aerolineas')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data ? new Aerolinea(data) : null;
  }

  async findByCodigo(codigo) {
    const { data, error } = await supabase
      .from('aerolineas')
      .select('*')
      .eq('codigo', codigo)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data ? new Aerolinea(data) : null;
  }

  async create(aerolineaData) {
    const { data, error } = await supabase
      .from('aerolineas')
      .insert(aerolineaData)
      .select()
      .single();
    
    if (error) throw error;
    return new Aerolinea(data);
  }

  async update(id, aerolineaData) {
    const { data, error } = await supabase
      .from('aerolineas')
      .update({ ...aerolineaData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data ? new Aerolinea(data) : null;
  }

  async delete(id) {
    const { error } = await supabase
      .from('aerolineas')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
}