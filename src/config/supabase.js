import { createClient } from '@supabase/supabase-js';
import { config } from './index.js';

// Verificamos que las credenciales existan para no perder tiempo depurando errores tontos
if (!config.supabase.url || !config.supabase.key) {
    throw new Error('Faltan las credenciales de Supabase en el config.js');
}

[cite_start]// Creamos el cliente de Supabase una sola vez para reutilizarlo [cite: 16]
export const supabase = createClient(config.supabase.url, config.supabase.key);