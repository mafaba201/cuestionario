import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseAnonKey
    );
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }

  async verificarEmailExistente(email: string): Promise<boolean> {
    const emailNormalizado = email.toLowerCase().trim();
    console.log('=== Verificando email:', emailNormalizado);
    
    try {
      // Obtener todos los emails y comparar en JS
      const { data, error } = await this.supabase
        .from('contactos')
        .select('email');

      console.log('Todos los emails en BD:', data);
      
      if (error) {
        console.error('Error:', error);
        return false;
      }

      // Comparar manual (insensible a mayúsculas)
      const existe = data?.some(e => 
        e.email?.toLowerCase().trim() === emailNormalizado
      );
      
      console.log('=== Email existe:', existe);
      return existe || false;
    } catch (e) {
      console.error('Excepción:', e);
      return false;
    }
  }
}