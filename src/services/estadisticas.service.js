import { VuelosRepository } from '../repositories/vuelos.repository.mjs';
import { PilotosRepository } from '../repositories/pilotos.repository.mjs';
import { supabase } from '../config/supabase.js';
import { redisClient } from '../config/redis.js';

const vuelosRepo = new VuelosRepository();
const pilotosRepo = new PilotosRepository();
const CACHE_TTL = 600; // 10 minutos para estadísticas

export class EstadisticasService {
  async getEstadisticasGenerales() {
    const cacheKey = 'estadisticas:generales';
    
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
    
    // Contar registros de cada tabla
    const { count: totalAeropuertos } = await supabase
      .from('aeropuertos')
      .select('*', { count: 'exact', head: true });
    
    const { count: totalAerolineas } = await supabase
      .from('aerolineas')
      .select('*', { count: 'exact', head: true });
    
    const { count: totalVuelos } = await supabase
      .from('vuelos')
      .select('*', { count: 'exact', head: true });
    
    const { count: totalPilotos } = await supabase
      .from('pilotos')
      .select('*', { count: 'exact', head: true });
    
    const { count: totalPasajeros } = await supabase
      .from('pasajeros')
      .select('*', { count: 'exact', head: true });
    
    const vuelosPorEstado = await vuelosRepo.countByEstado();
    
    const estadisticas = {
      total_aeropuertos: totalAeropuertos,
      total_aerolineas: totalAerolineas,
      total_vuelos: totalVuelos,
      total_pilotos: totalPilotos,
      total_pasajeros: totalPasajeros,
      vuelos_por_estado: vuelosPorEstado
    };
    
    await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(estadisticas));
    
    return estadisticas;
  }

  async getTopAerolineasPorVuelos(limit = 5) {
    const cacheKey = `estadisticas:top_aerolineas:${limit}`;
    
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
    
    const { data, error } = await supabase.rpc('get_top_aerolineas_por_vuelos', {
      limite: limit
    });
    
    if (error) {
      // Si la función no existe, hacerlo manualmente
      const { data: aerolineas } = await supabase
        .from('aerolineas')
        .select(`
          id,
          nombre,
          codigo,
          pilotos (
            id,
            vuelos_pilotos (
              id_vuelo
            )
          )
        `);
      
      const result = aerolineas.map(aerolinea => {
        const vuelosUnicos = new Set();
        aerolinea.pilotos?.forEach(piloto => {
          piloto.vuelos_pilotos?.forEach(vp => {
            vuelosUnicos.add(vp.id_vuelo);
          });
        });
        
        return {
          id: aerolinea.id,
          nombre: aerolinea.nombre,
          codigo: aerolinea.codigo,
          total_vuelos: vuelosUnicos.size
        };
      })
      .sort((a, b) => b.total_vuelos - a.total_vuelos)
      .slice(0, limit);
      
      await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(result));
      return result;
    }
    
    await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(data));
    return data;
  }

  async getTopPilotosPorHoras(limit = 10) {
    const cacheKey = `estadisticas:top_pilotos:${limit}`;
    
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
    
    const pilotos = await pilotosRepo.getTopPilotosByHoras(limit);
    
    await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(pilotos));
    return pilotos;
  }

  async getAeropuertoMasActivo() {
    const cacheKey = 'estadisticas:aeropuerto_mas_activo';
    
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
    
    const { data: aeropuertos } = await supabase
      .from('aeropuertos')
      .select(`
        id,
        nombre,
        codigo_iata,
        ciudad,
        pais
      `);
    
    const resultados = [];
    
    for (const aeropuerto of aeropuertos) {
      const { count } = await supabase
        .from('vuelos')
        .select('*', { count: 'exact', head: true })
        .or(`id_aeropuerto_origen.eq.${aeropuerto.id},id_aeropuerto_destino.eq.${aeropuerto.id}`);
      
      resultados.push({
        ...aeropuerto,
        total_vuelos: count
      });
    }
    
    resultados.sort((a, b) => b.total_vuelos - a.total_vuelos);
    const masActivo = resultados[0] || null;
    
    await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(masActivo));
    
    return masActivo;
  }
}