import { supabase } from '../config/supabase.js';
import { Vuelo } from '../models/Vuelo.mjs';

export class VuelosRepository {
  async findAll() {
    const { data, error } = await supabase
      .from('vuelos')
      .select('*')
      .order('fecha_salida', { ascending: false });
    
    if (error) throw error;
    return data.map(item => new Vuelo(item));
  }

  async findById(id) {
    const { data, error } = await supabase
      .from('vuelos')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data ? new Vuelo(data) : null;
  }

  async findByAeropuerto(idAeropuerto) {
    const { data, error } = await supabase
      .from('vuelos')
      .select('*')
      .or(`id_aeropuerto_origen.eq.${idAeropuerto},id_aeropuerto_destino.eq.${idAeropuerto}`)
      .order('fecha_salida', { ascending: false });
    
    if (error) throw error;
    return data.map(item => new Vuelo(item));
  }

  async findByEstado(estado) {
    const { data, error } = await supabase
      .from('vuelos')
      .select('*')
      .eq('estado', estado)
      .order('fecha_salida', { ascending: false });
    
    if (error) throw error;
    return data.map(item => new Vuelo(item));
  }

  async create(vueloData) {
    const { data, error } = await supabase
      .from('vuelos')
      .insert(vueloData)
      .select()
      .single();
    
    if (error) throw error;
    return new Vuelo(data);
  }

  async update(id, vueloData) {
    const { data, error } = await supabase
      .from('vuelos')
      .update({ ...vueloData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data ? new Vuelo(data) : null;
  }

  async delete(id) {
    const { error } = await supabase
      .from('vuelos')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  async countByEstado() {
    const { data, error } = await supabase
      .from('vuelos')
      .select('estado')
      .order('estado');
    
    if (error) throw error;
    
    const counts = {};
    data.forEach(row => {
      counts[row.estado] = (counts[row.estado] || 0) + 1;
    });
    
    return counts;
  }
}