import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

interface DiaCalendario {
  numero: number;
  disponibilidad: 'disponible' | 'medio' | 'lleno' | 'cerrado';
  fecha: Date;
  horas?: string[];
}

@Component({
  selector: 'app-citas',
  imports: [CommonModule],
  templateUrl: './citas.html',
  styleUrl: './citas.scss'
})
export class Citas {
  protected readonly mesActual = signal(new Date().getMonth());
  protected readonly anioActual = signal(new Date().getFullYear());
  protected readonly diaSeleccionado = signal<DiaCalendario | null>(null);
  protected readonly horaSeleccionada = signal<string | null>(null);

  // Horarios de atención (miércoles a sábado, lunes y martes)
  private readonly horarioAtencion = [
    { dia: 1, horas: '9:00 AM - 5:00 PM' }, // Lunes
    { dia: 2, horas: '9:00 AM - 5:00 PM' }, // Martes
    { dia: 3, horas: '9:00 AM - 5:00 PM' }, // Miércoles
    { dia: 4, horas: '9:00 AM - 5:00 PM' }, // Jueves
    { dia: 5, horas: '9:00 AM - 5:00 PM' }, // Viernes
    { dia: 6, horas: '9:00 AM - 5:00 PM' }, // Sábado
  ];

  private readonly horasDisponibles = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
  ];

  protected readonly nombreMes = computed(() => {
    const fecha = new Date(this.anioActual(), this.mesActual(), 1);
    return fecha.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' });
  });

  protected readonly diasCalendario = computed(() => {
    const primerDia = new Date(this.anioActual(), this.mesActual(), 1);
    const ultimoDia = new Date(this.anioActual(), this.mesActual() + 1, 0);
    const dias: DiaCalendario[] = [];

    // Días vacíos al inicio
    const diaSemanaPrimerDia = primerDia.getDay();
    for (let i = 0; i < diaSemanaPrimerDia; i++) {
      dias.push({
        numero: 0,
        disponibilidad: 'cerrado',
        fecha: new Date()
      });
    }

    // Días del mes
    for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
      const fecha = new Date(this.anioActual(), this.mesActual(), dia);
      const diaSemana = fecha.getDay();

      // Determinar disponibilidad (simulada para el ejemplo)
      let disponibilidad: 'disponible' | 'medio' | 'lleno' | 'cerrado' = 'cerrado';

      // Domingo cerrado
      if (diaSemana === 0) {
        disponibilidad = 'cerrado';
      } else if (this.horarioAtencion.some(h => h.dia === diaSemana)) {
        // Simulación de disponibilidad (en producción vendría de un backend)
        const random = Math.random();
        if (fecha < new Date()) {
          disponibilidad = 'cerrado'; // Días pasados
        } else if (random > 0.7) {
          disponibilidad = 'disponible';
        } else if (random > 0.4) {
          disponibilidad = 'medio';
        } else {
          disponibilidad = 'lleno';
        }
      }

      dias.push({
        numero: dia,
        disponibilidad,
        fecha,
        horas: disponibilidad !== 'cerrado' && disponibilidad !== 'lleno'
          ? this.horasDisponibles
          : []
      });
    }

    return dias;
  });

  mesAnterior(): void {
    if (this.mesActual() === 0) {
      this.mesActual.set(11);
      this.anioActual.set(this.anioActual() - 1);
    } else {
      this.mesActual.set(this.mesActual() - 1);
    }
    this.diaSeleccionado.set(null);
    this.horaSeleccionada.set(null);
  }

  mesSiguiente(): void {
    if (this.mesActual() === 11) {
      this.mesActual.set(0);
      this.anioActual.set(this.anioActual() + 1);
    } else {
      this.mesActual.set(this.mesActual() + 1);
    }
    this.diaSeleccionado.set(null);
    this.horaSeleccionada.set(null);
  }

  seleccionarDia(dia: DiaCalendario): void {
    if (dia.numero > 0 && dia.disponibilidad !== 'cerrado' && dia.disponibilidad !== 'lleno') {
      this.diaSeleccionado.set(dia);
      this.horaSeleccionada.set(null);
    }
  }

  seleccionarHora(hora: string): void {
    this.horaSeleccionada.set(hora);
  }

  agendarCita(): void {
    if (this.diaSeleccionado() && this.horaSeleccionada()) {
      const dia = this.diaSeleccionado()!;
      const hora = this.horaSeleccionada()!;
      const fecha = dia.fecha.toLocaleDateString('es-MX', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const mensaje = encodeURIComponent(
        `Hola! Me gustaría agendar una cita para el ${fecha} a las ${hora}`
      );

      window.open(`https://wa.me/5216621949884?text=${mensaje}`, '_blank');
    }
  }

  obtenerClaseDia(dia: DiaCalendario): string {
    if (dia.numero === 0) return 'dia-vacio';

    const clases = ['dia-calendario'];
    clases.push(`dia-${dia.disponibilidad}`);

    if (this.diaSeleccionado()?.numero === dia.numero) {
      clases.push('dia-seleccionado');
    }

    return clases.join(' ');
  }
}
