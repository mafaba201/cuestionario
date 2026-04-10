/**
 * Archivo de ejemplo para configuración de entorno.
 *
 * Copia este archivo a environment.ts (para desarrollo local) o usa variables
 * de entorno de Netlify en producción.
 */
export const environment = {
  production: false,
  supabaseUrl: '__SUPABASE_URL__',
  supabaseAnonKey: '__SUPABASE_ANON_KEY__'
};