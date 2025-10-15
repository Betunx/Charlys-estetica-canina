import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CitasService, type Cita } from '../../services/citas.service';

interface DiaCalendario {
  numero: number;
  disponibilidad: 'disponible' | 'medio' | 'lleno' | 'cerrado';
  fecha: Date;
  horas?: string[];
}

@Component({
  selector: 'app-citas',
  imports: [CommonModule, FormsModule],
  templateUrl: './citas.html',
  styleUrl: './citas.scss'
})
export class Citas implements OnInit {
  private citasService = inject(CitasService);

  protected readonly mesActual = signal(new Date().getMonth());
  protected readonly anioActual = signal(new Date().getFullYear());
  protected readonly diaSeleccionado = signal<DiaCalendario | null>(null);
  protected readonly horaSeleccionada = signal<string | null>(null);
  protected readonly cargando = signal(false);
  protected readonly mostrarFormulario = signal(false);
  protected readonly mensajeExito = signal<string | null>(null);
  protected readonly mensajeError = signal<string | null>(null);

  // Datos del formulario
  protected formularioCita = {
    nombreCliente: '',
    telefono: '',
    emailCliente: '',
    nombreMascota: '',
    servicio: '',
    notas: ''
  };

  protected serviciosDisponibles = [
    'Baño y corte',
    'Corte de pelo',
    'Baño medicado',
    'Limpieza dental',
    'Corte de uñas',
    'Otro'
  ];

  // Horarios de atención
  private readonly horarioAtencion = [
    { dia: 1, horas: '9:00 AM - 5:00 PM' },
    { dia: 2, horas: '9:00 AM - 5:00 PM' },
    { dia: 3, horas: '9:00 AM - 5:00 PM' },
    { dia: 4, horas: '9:00 AM - 5:00 PM' },
    { dia: 5, horas: '9:00 AM - 5:00 PM' },
    { dia: 6, horas: '9:00 AM - 5:00 PM' }
  ];

  private horasDisponibles: string[] = [];
  private disponibilidadMes = signal<Map<string, any>>(new Map());

  protected readonly nombreMes = computed(() => {
    const fecha = new Date(this.anioActual(), this.mesActual(), 1);
    return fecha.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' });
  });

  protected readonly diasCalendario = computed(() => {
    const primerDia = new Date(this.anioActual(), this.mesActual(), 1);
    const ultimoDia = new Date(this.anioActual(), this.mesActual() + 1, 0);
    const dias: DiaCalendario[] = [];
    const disponibilidad = this.disponibilidadMes();

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
      const fechaStr = this.formatearFecha(fecha);
      const diaSemana = fecha.getDay();

      let disponibilidadDia: 'disponible' | 'medio' | 'lleno' | 'cerrado' = 'cerrado';

      // Días pasados
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      if (fecha < hoy) {
        disponibilidadDia = 'cerrado';
      }
      // Domingo cerrado
      else if (diaSemana === 0) {
        disponibilidadDia = 'cerrado';
      }
      // Obtener disponibilidad del servicio
      else if (disponibilidad.has(fechaStr)) {
        disponibilidadDia = disponibilidad.get(fechaStr).disponibilidad;
      }
      // Si no hay datos, asumir disponible
      else if (this.horarioAtencion.some(h => h.dia === diaSemana)) {
        disponibilidadDia = 'disponible';
      }

      dias.push({
        numero: dia,
        disponibilidad: disponibilidadDia,
        fecha,
        horas: disponibilidadDia !== 'cerrado' && disponibilidadDia !== 'lleno'
          ? []
          : []
      });
    }

    return dias;
  });

  ngOnInit(): void {
    this.cargarDisponibilidad();
  }

  cargarDisponibilidad(): void {
    this.cargando.set(true);
    this.citasService.getDisponibilidadMes(this.anioActual(), this.mesActual()).subscribe({
      next: (disponibilidad) => {
        const mapa = new Map();
        disponibilidad.forEach(d => {
          mapa.set(d.fecha, d);
        });
        this.disponibilidadMes.set(mapa);
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al cargar disponibilidad:', error);
        this.cargando.set(false);
      }
    });
  }

  mesAnterior(): void {
    if (this.mesActual() === 0) {
      this.mesActual.set(11);
      this.anioActual.set(this.anioActual() - 1);
    } else {
      this.mesActual.set(this.mesActual() - 1);
    }
    this.diaSeleccionado.set(null);
    this.horaSeleccionada.set(null);
    this.mostrarFormulario.set(false);
    this.cargarDisponibilidad();
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
    this.mostrarFormulario.set(false);
    this.cargarDisponibilidad();
  }

  seleccionarDia(dia: DiaCalendario): void {
    if (dia.numero > 0 && dia.disponibilidad !== 'cerrado' && dia.disponibilidad !== 'lleno') {
      this.diaSeleccionado.set(dia);
      this.horaSeleccionada.set(null);
      this.mostrarFormulario.set(false);
      this.cargarHorariosDisponibles(dia.fecha);
    }
  }

  cargarHorariosDisponibles(fecha: Date): void {
    const fechaStr = this.formatearFecha(fecha);
    this.cargando.set(true);

    this.citasService.getHorariosDisponibles(fechaStr).subscribe({
      next: (horarios) => {
        this.horasDisponibles = horarios;
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al cargar horarios:', error);
        this.horasDisponibles = [];
        this.cargando.set(false);
      }
    });
  }

  seleccionarHora(hora: string): void {
    this.horaSeleccionada.set(hora);
    this.mostrarFormulario.set(true);
    this.mensajeExito.set(null);
    this.mensajeError.set(null);
  }

  getHorasDisponibles(): string[] {
    return this.horasDisponibles;
  }

  agendarCita(): void {
    if (!this.diaSeleccionado() || !this.horaSeleccionada()) {
      this.mensajeError.set('Por favor selecciona un día y una hora');
      return;
    }

    const cita: Cita = {
      fecha: this.formatearFecha(this.diaSeleccionado()!.fecha),
      hora: this.horaSeleccionada()!,
      nombreCliente: this.formularioCita.nombreCliente,
      telefono: this.formularioCita.telefono,
      emailCliente: this.formularioCita.emailCliente,
      nombreMascota: this.formularioCita.nombreMascota,
      servicio: this.formularioCita.servicio,
      notas: this.formularioCita.notas,
      estado: 'Pendiente'
    };

    // Validar cita
    const validacion = this.citasService.validarCita(cita);
    if (!validacion.valida) {
      this.mensajeError.set(validacion.errores.join('. '));
      return;
    }

    this.cargando.set(true);
    this.mensajeError.set(null);

    this.citasService.crearCita(cita).subscribe({
      next: (response) => {
        this.mensajeExito.set('¡Cita agendada exitosamente! Te contactaremos pronto.');
        this.limpiarFormulario();
        this.cargando.set(false);

        // Recargar disponibilidad
        setTimeout(() => {
          this.cargarDisponibilidad();
        }, 1000);
      },
      error: (error) => {
        this.mensajeError.set('Hubo un error al agendar la cita. Por favor intenta de nuevo o contáctanos por WhatsApp.');
        this.cargando.set(false);
        console.error('Error:', error);
      }
    });
  }

  limpiarFormulario(): void {
    this.formularioCita = {
      nombreCliente: '',
      telefono: '',
      emailCliente: '',
      nombreMascota: '',
      servicio: '',
      notas: ''
    };
    this.diaSeleccionado.set(null);
    this.horaSeleccionada.set(null);
    this.mostrarFormulario.set(false);
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

  private formatearFecha(fecha: Date): string {
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${año}-${mes}-${dia}`;
  }
}
