/**
 * Archivo de entorno para producción.
 *
 * Las variables SUPABASE_URL y SUPABASE_ANON_KEY se injectan desde
 * las variables de entorno de Netlify durante el build.
 */
export const environment = {
  production: true,
  supabaseUrl: 'https://bdenieusmjzrpvfeoixa.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkZW5pZXVzbWp6cnB2ZmVvaXhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3MjQ4MjgsImV4cCI6MjA5MTMwMDgyOH0.1jcf1d5BvSY025hP7sN0qTSEjeDYmVRvp0Qm4a2cCu4'
};