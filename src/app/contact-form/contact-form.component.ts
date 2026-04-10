import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-contact-form',
  imports: [FormsModule, CommonModule],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.css'
})
export class ContactFormComponent {
  private supabaseService = inject(SupabaseService);
  private supabase = this.supabaseService.getClient();

  nombre: string = '';
  apellidos: string = '';
  email: string = '';

  enviado: boolean = false;
  emailYaExiste: boolean = false;
  enviando: boolean = false;
  error: string = '';

  touched: { [key: string]: boolean } = {
    nombre: false,
    apellidos: false,
    email: false
  };

  marcarTocado(campo: string): void {
    this.touched[campo] = true;
  }

  get emailValido(): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(this.email);
  }

  get formularioValido(): boolean {
    return this.nombre.trim().length > 0
      && this.apellidos.trim().length > 0
      && this.emailValido;
  }

  async verificarEmail(): Promise<boolean> {
    if (!this.emailValido) return false;
    
    const emailNormalizado = this.email.toLowerCase().trim();
    console.log('Verificando email en formulario:', emailNormalizado);
    
    const existe = await this.supabaseService.verificarEmailExistente(emailNormalizado);
    this.emailYaExiste = existe;
    
    console.log('Resultado verificarEmail:', existe);
    
    if (this.emailYaExiste) {
      this.error = 'Ya has enviado tu información anteriormente. No es necesario enviar nuevamente.';
    } else {
      this.error = '';
    }
    
    return existe;
  }

  async enviarFormulario(): Promise<void> {
    this.touched['nombre'] = true;
    this.touched['apellidos'] = true;
    this.touched['email'] = true;

    if (!this.formularioValido) return;

    console.log('Iniciando envío...');
    
    const yaExiste = await this.verificarEmail();
    console.log('Verificación completada, yaExiste:', yaExiste);
    
    if (yaExiste) {
      console.log('Email ya existe, cancelando envío');
      return;
    }

    console.log('Email no existe, continuando con envío...');
    this.enviando = true;
    this.error = '';

    try {
      const emailNormalizado = this.email.toLowerCase().trim();
      
      const { error } = await this.supabase
        .from('contactos')
        .insert([
          {
            nombre: this.nombre,
            apellidos: this.apellidos,
            email: emailNormalizado
          }
        ]);

      if (error) throw error;

      await this.supabase.functions.invoke('enviar-confirmacion', {
        body: {
          nombre: this.nombre,
          apellidos: this.apellidos,
          email: emailNormalizado
        }
      });

      this.enviado = true;

      setTimeout(() => {
        this.nombre = '';
        this.apellidos = '';
        this.email = '';
        this.enviado = false;
        this.touched = { nombre: false, apellidos: false, email: false };
      }, 4000);
    } catch (err: any) {
      this.error = 'Error al enviar el formulario. Intenta de nuevo.';
      console.error('Error:', err);
    } finally {
      this.enviando = false;
    }
  }
}