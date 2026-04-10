/**
 * Archivo de entorno para producción.
 *
 * Las variables SUPABASE_URL y SUPABASE_ANON_KEY se injectan desde
 * las variables de entorno de Netlify durante el build.
 */
export const environment = {
  production: true,
  supabaseUrl: '__SUPABASE_URL__',
  supabaseAnonKey: '__SUPABASE_ANON_KEY__'  
};