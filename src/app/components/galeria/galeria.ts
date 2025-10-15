import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FotoCliente {
  id: number;
  url: string;
  raza: string;
  sexo: 'macho' | 'hembra';
  nombre: string;
  descripcion?: string;
}

@Component({
  selector: 'app-galeria',
  imports: [CommonModule],
  templateUrl: './galeria.html',
  styleUrl: './galeria.scss'
})
export class Galeria {
  // En producción, estas fotos vendrían de un servicio/API
  protected fotos: FotoCliente[] = [
    { id: 1, url: 'assets/galeria/foto1.jpg', raza: 'Golden Retriever', sexo: 'macho', nombre: 'Max', descripcion: 'Baño y corte completo' },
    { id: 2, url: 'assets/galeria/foto2.jpg', raza: 'Poodle', sexo: 'hembra', nombre: 'Luna', descripcion: 'Corte estilo teddy' },
    { id: 3, url: 'assets/galeria/foto3.jpg', raza: 'Chihuahua', sexo: 'macho', nombre: 'Rocky', descripcion: 'Baño con acondicionador' },
    { id: 4, url: 'assets/galeria/foto4.jpg', raza: 'Labrador', sexo: 'hembra', nombre: 'Bella', descripcion: 'Corte de verano' },
    { id: 5, url: 'assets/galeria/foto5.jpg', raza: 'Poodle', sexo: 'macho', nombre: 'Charlie', descripcion: 'Baño y corte' },
    { id: 6, url: 'assets/galeria/foto6.jpg', raza: 'Golden Retriever', sexo: 'hembra', nombre: 'Daisy', descripcion: 'Cepillado especial' },
    { id: 7, url: 'assets/galeria/foto7.jpg', raza: 'Chihuahua', sexo: 'hembra', nombre: 'Mia', descripcion: 'Baño deluxe' },
    { id: 8, url: 'assets/galeria/foto8.jpg', raza: 'Labrador', sexo: 'macho', nombre: 'Zeus', descripcion: 'Corte y limpieza' },
  ];

  protected razasDisponibles = computed(() => {
    const razas = new Set(this.fotos.map(f => f.raza));
    return ['Todas', ...Array.from(razas)];
  });

  protected filtroRaza = signal<string>('Todas');
  protected filtroSexo = signal<'todos' | 'macho' | 'hembra'>('todos');
  protected fotoSeleccionada = signal<FotoCliente | null>(null);

  protected fotosFiltradas = computed(() => {
    let resultado = this.fotos;

    if (this.filtroRaza() !== 'Todas') {
      resultado = resultado.filter(f => f.raza === this.filtroRaza());
    }

    if (this.filtroSexo() !== 'todos') {
      resultado = resultado.filter(f => f.sexo === this.filtroSexo());
    }

    return resultado;
  });

  cambiarFiltroRaza(raza: string): void {
    this.filtroRaza.set(raza);
  }

  cambiarFiltroSexo(sexo: 'todos' | 'macho' | 'hembra'): void {
    this.filtroSexo.set(sexo);
  }

  abrirModal(foto: FotoCliente): void {
    this.fotoSeleccionada.set(foto);
  }

  cerrarModal(): void {
    this.fotoSeleccionada.set(null);
  }

  limpiarFiltros(): void {
    this.filtroRaza.set('Todas');
    this.filtroSexo.set('todos');
  }
}
