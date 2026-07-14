import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    // PKCE es el flujo de autenticación recomendado por Supabase para SSR
    flowType: 'pkce',
    
    // Evita que el servidor intente buscar tokens en la URL automáticamente
    detectSessionInUrl: false,
    
    // Evita que el cliente intente persistir datos en localStorage si se ejecuta en el servidor (Node.js)
    persistSession: typeof window !== 'undefined', 
  },
});