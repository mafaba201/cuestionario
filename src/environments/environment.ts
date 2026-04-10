/**
 * Archivo de entorno para desarrollo.
 *
 * Las variables SUPABASE_URL y SUPABASE_ANON_KEY se injectan durante el build.
 */
export const environment = {
  production: false,
  supabaseUrl: '__SUPABASE_URL__',
  supabaseAnonKey: '__SUPABASE_ANON_KEY__'
};