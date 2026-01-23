// Importamos los repositorios necesarios
import { VuelosRepository } from '../repositories/vuelos.repository.mjs';
import { PilotosRepository } from '../repositories/pilotos.repository.mjs';

// Importamos el cliente de Supabase para queries personalizadas
import { supabase } from '../config/supabase.js';

// Importamos el cliente de Redis para caché
import { redisClient } from '../config/redis.js';

// Creamos instancias de los repositorios
const vuelosRepo = new VuelosRepository();
const pilotosRepo = new PilotosRepository();

// TTL más largo (10 minutos) porque las estadísticas cambian menos frecuentemente
const CACHE_TTL = 600;

// Exportamos la clase del servicio
export class EstadisticasService {
  
  // GET ESTADISTICAS GENERALES - Obtener resumen general del sistema
  async getEstadisticasGenerales() {
    
    // PASO 1: Definir clave de caché
    const cacheKey = 'estadisticas:generales';
    
    // PASO 2: Intentar obtener del caché
    const cached = await redisClient.get(cacheKey);
    
    // PASO 3: Si hay caché, devolver
    if (cached) {
      return JSON.parse(cached);
    }
    
    // PASO 4: Contar aeropuertos
    // .select('*', { count: 'exact', head: true }) → solo cuenta, no devuelve datos
    const { count: totalAeropuertos } = await supabase
      .from('aeropuertos')
      .select('*', { count: 'exact', head: true });
    
    // PASO 5: Contar aerolíneas
    const { count: totalAerolineas } = await supabase
      .from('aerolineas')
      .select('*', { count: 'exact', head: true });
    
    // PASO 6: Contar vuelos
    const { count: totalVuelos } = await supabase
      .from('vuelos')
      .select('*', { count: 'exact', head: true });
    
    // PASO 7: Contar pilotos
    const { count: totalPilotos } = await supabase
      .from('pilotos')
      .select('*', { count: 'exact', head: true });
    
    // PASO 8: Contar pasajeros
    const { count: totalPasajeros } = await supabase
      .from('pasajeros')
      .select('*', { count: 'exact', head: true });
    
    // PASO 9: Obtener vuelos agrupados por estado
    // vuelosRepo.countByEstado() devuelve: { programado: 5, en_vuelo: 2, ... }
    const vuelosPorEstado = await vuelosRepo.countByEstado();
    
    // PASO 10: Construir objeto de respuesta
    const estadisticas = {
      total_aeropuertos: totalAeropuertos,
      total_aerolineas: totalAerolineas,
      total_vuelos: totalVuelos,
      total_pilotos: totalPilotos,
      total_pasajeros: totalPasajeros,
      vuelos_por_estado: vuelosPorEstado
    };
    
    // PASO 11: Guardar en caché
    await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(estadisticas));
    
    // PASO 12: Devolver estadísticas
    return estadisticas;
  }

  // GET TOP AEROLINEAS POR VUELOS - Top aerolíneas con más vuelos
  async getTopAerolineasPorVuelos(limit = 5) {
    
    // PASO 1: Definir clave de caché con el límite
    const cacheKey = `estadisticas:top_aerolineas:${limit}`;
    
    // PASO 2: Intentar obtener del caché
    const cached = await redisClient.get(cacheKey);
    
    // PASO 3: Si hay caché, devolver
    if (cached) {
      return JSON.parse(cached);
    }
    
    // PASO 4: Intentar usar función RPC de Supabase
    // RPC = Remote Procedure Call (función SQL personalizada)
    const { data, error } = await supabase.rpc('get_top_aerolineas_por_vuelos', {
      limite: limit
    });
    
    // PASO 5: Si la función RPC no existe, calcular manualmente
    if (error) {
      
      // PASO 5.1: Obtener todas las aerolíneas con sus pilotos y vuelos
      // Usamos JOINs anidados para obtener toda la información relacionada
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
      
      // PASO 5.2: Contar vuelos únicos por aerolínea
      const result = aerolineas.map(aerolinea => {
        
        // Usamos Set para evitar duplicados (un vuelo puede tener varios pilotos)
        const vuelosUnicos = new Set();
        
        // Recorremos todos los pilotos de la aerolínea
        aerolinea.pilotos?.forEach(piloto => {
          
          // Recorremos todos los vuelos del piloto
          piloto.vuelos_pilotos?.forEach(vp => {
            
            // Agregamos el ID del vuelo al Set (automáticamente elimina duplicados)
            vuelosUnicos.add(vp.id_vuelo);
          });
        });
        
        // Devolvemos objeto con la información de la aerolínea
        return {
          id: aerolinea.id,
          nombre: aerolinea.nombre,
          codigo: aerolinea.codigo,
          total_vuelos: vuelosUnicos.size  // .size = cantidad de elementos en el Set
        };
      })
      // PASO 5.3: Ordenar por total de vuelos (descendente)
      .sort((a, b) => b.total_vuelos - a.total_vuelos)
      // PASO 5.4: Tomar solo los primeros 'limit' elementos
      .slice(0, limit);
      
      // PASO 5.5: Guardar en caché
      await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(result));
      
      // PASO 5.6: Devolver resultado
      return result;
    }
    
    // PASO 6: Si la función RPC existe, guardar su resultado en caché
    await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(data));
    
    // PASO 7: Devolver datos de la función RPC
    return data;
  }

  // GET TOP PILOTOS POR HORAS - Top pilotos con más horas de vuelo
  async getTopPilotosPorHoras(limit = 10) {
    
    // PASO 1: Definir clave de caché con el límite
    const cacheKey = `estadisticas:top_pilotos:${limit}`;
    
    // PASO 2: Intentar obtener del caché
    const cached = await redisClient.get(cacheKey);
    
    // PASO 3: Si hay caché, devolver
    if (cached) {
      return JSON.parse(cached);
    }
    
    // PASO 4: Obtener del repositorio
    // El repositorio ya tiene este método implementado
    const pilotos = await pilotosRepo.getTopPilotosByHoras(limit);
    
    // PASO 5: Guardar en caché
    await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(pilotos));
    
    // PASO 6: Devolver pilotos
    return pilotos;
  }

  // GET AEROPUERTO MAS ACTIVO - Aeropuerto con más vuelos (origen + destino)
  async getAeropuertoMasActivo() {
    
    // PASO 1: Definir clave de caché
    const cacheKey = 'estadisticas:aeropuerto_mas_activo';
    
    // PASO 2: Intentar obtener del caché
    const cached = await redisClient.get(cacheKey);
    
    // PASO 3: Si hay caché, devolver
    if (cached) {
      return JSON.parse(cached);
    }
    
    // PASO 4: Obtener todos los aeropuertos
    const { data: aeropuertos } = await supabase
      .from('aeropuertos')
      .select(`
        id,
        nombre,
        codigo_iata,
        ciudad,
        pais
      `);
    
    // PASO 5: Inicializar array de resultados
    const resultados = [];
    
    // PASO 6: Para cada aeropuerto, contar sus vuelos
    for (const aeropuerto of aeropuertos) {
      
      // PASO 6.1: Contar vuelos donde este aeropuerto es origen O destino
      // .or() → WHERE id_aeropuerto_origen = X OR id_aeropuerto_destino = X
      const { count } = await supabase
        .from('vuelos')
        .select('*', { count: 'exact', head: true })
        .or(`id_aeropuerto_origen.eq.${aeropuerto.id},id_aeropuerto_destino.eq.${aeropuerto.id}`);
      
      // PASO 6.2: Agregar aeropuerto con su conteo al array
      resultados.push({
        ...aeropuerto,           // Spread: copia todas las propiedades del aeropuerto
        total_vuelos: count      // Agrega el total de vuelos
      });
    }
    
    // PASO 7: Ordenar de mayor a menor por total de vuelos
    // .sort() con función comparadora: b - a = descendente
    resultados.sort((a, b) => b.total_vuelos - a.total_vuelos);
    
    // PASO 8: Obtener el primero (más activo)
    // Si no hay aeropuertos, devolver null
    const masActivo = resultados[0] || null;
    
    // PASO 9: Guardar en caché
    await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(masActivo));
    
    // PASO 10: Devolver el aeropuerto más activo
    return masActivo;
  }
}