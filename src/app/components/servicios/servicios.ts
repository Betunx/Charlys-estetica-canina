import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Servicio {
  id: string;
  nombre: string;
  precio: number;
  icono: string;
}

interface TamanoPerro {
  id: string;
  nombre: string;
  multiplicador: number;
}

@Component({
  selector: 'app-servicios',
  imports: [CommonModule, FormsModule],
  templateUrl: './servicios.html',
  styleUrl: './servicios.scss'
})
export class Servicios {
  protected servicios: Servicio[] = [
    { id: 'bano', nombre: 'Baño', precio: 150, icono: '🛁' },
    { id: 'corte-pelo', nombre: 'Corte de Pelo', precio: 200, icono: '✂️' },
    { id: 'bano-corte', nombre: 'Baño y Corte', precio: 300, icono: '🐕' },
    { id: 'corte-unas', nombre: 'Corte de Uñas', precio: 50, icono: '💅' },
    { id: 'limpieza-oidos', nombre: 'Limpieza de Oídos', precio: 80, icono: '👂' },
    { id: 'cepillado', nombre: 'Cepillado Especial', precio: 100, icono: '🧹' }
  ];

  protected tamanos: TamanoPerro[] = [
    { id: 'chico', nombre: 'Chico (hasta 10kg)', multiplicador: 1 },
    { id: 'mediano', nombre: 'Mediano (10-25kg)', multiplicador: 1.3 },
    { id: 'grande', nombre: 'Grande (más de 25kg)', multiplicador: 1.6 }
  ];

  protected serviciosSeleccionados = signal<string[]>([]);
  protected tamanoSeleccionado = signal<string>('chico');

  protected total = computed(() => {
    const servicios = this.serviciosSeleccionados();
    const tamano = this.tamanos.find(t => t.id === this.tamanoSeleccionado());

    if (!servicios.length || !tamano) return 0;

    const subtotal = servicios.reduce((sum, id) => {
      const servicio = this.servicios.find(s => s.id === id);
      return sum + (servicio?.precio || 0);
    }, 0);

    return subtotal * tamano.multiplicador;
  });

  toggleServicio(servicioId: string): void {
    this.serviciosSeleccionados.update(selected => {
      if (selected.includes(servicioId)) {
        return selected.filter(id => id !== servicioId);
      } else {
        return [...selected, servicioId];
      }
    });
  }

  isServicioSeleccionado(servicioId: string): boolean {
    return this.serviciosSeleccionados().includes(servicioId);
  }

  limpiarSeleccion(): void {
    this.serviciosSeleccionados.set([]);
    this.tamanoSeleccionado.set('chico');
  }

  // Métodos auxiliares para el template
  getServicioById(id: string): Servicio | undefined {
    return this.servicios.find(s => s.id === id);
  }

  getTamanoActual(): TamanoPerro | undefined {
    return this.tamanos.find(t => t.id === this.tamanoSeleccionado());
  }
}
