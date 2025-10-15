import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';

export interface Cita {
  fecha: string;
  hora: string;
  nombreCliente: string;
  telefono: string;
  emailCliente?: string;
  nombreMascota: string;
  servicio: string;
  estado: 'Pendiente' | 'Confirmada' | 'Completada' | 'Cancelada';
  notas?: string;
  fechaCreacion?: string;
}

export interface DisponibilidadDia {
  fecha: string;
  disponibilidad: 'disponible' | 'medio' | 'lleno' | 'cerrado';
  citasReservadas: number;
}

@Injectable({
  providedIn: 'root'
})
export class CitasService {
  // ⚠️ IMPORTANTE: Reemplaza esta URL con la URL de tu Google Apps Script deployment
  private readonly APPS_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todas las citas del Google Sheet
   */
  getCitas(): Observable<Cita[]> {
    return this.http.get<any>(this.APPS_SCRIPT_URL).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data as Cita[];
        }
        return [];
      }),
      catchError(error => {
        console.error('Error al obtener citas:', error);
        return of([]);
      })
    );
  }

  /**
   * Crea una nueva cita en el Google Sheet
   */
  crearCita(cita: Cita): Observable<any> {
    const citaConFecha = {
      ...cita,
      estado: 'Pendiente' as const,
      fechaCreacion: new Date().toISOString()
    };

    return this.http.post<any>(
      this.APPS_SCRIPT_URL,
      citaConFecha,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    ).pipe(
      retry(2), // Reintentar 2 veces si falla
      catchError(error => {
        console.error('Error al crear cita:', error);
        return throwError(() => new Error('No se pudo crear la cita. Por favor intenta de nuevo.'));
      })
    );
  }

  /**
   * Obtiene la disponibilidad de un mes específico
   */
  getDisponibilidadMes(año: number, mes: number): Observable<DisponibilidadDia[]> {
    return this.getCitas().pipe(
      map(citas => {
        const diasMes = new Date(año, mes + 1, 0).getDate();
        const disponibilidad: DisponibilidadDia[] = [];

        for (let dia = 1; dia <= diasMes; dia++) {
          const fecha = new Date(año, mes, dia);
          const fechaStr = this.formatearFecha(fecha);
          const diaSemana = fecha.getDay();

          // Domingo cerrado
          if (diaSemana === 0) {
            disponibilidad.push({
              fecha: fechaStr,
              disponibilidad: 'cerrado',
              citasReservadas: 0
            });
            continue;
          }

          // Contar citas para este día
          const citasDelDia = citas.filter(c =>
            c.fecha === fechaStr &&
            c.estado !== 'Cancelada'
          ).length;

          // Máximo 8 citas por día (horarios cada 30 min de 9am a 4:30pm)
          const maxCitas = 16;
          let disponibilidadEstado: 'disponible' | 'medio' | 'lleno' | 'cerrado';

          if (citasDelDia === 0) {
            disponibilidadEstado = 'disponible';
          } else if (citasDelDia < maxCitas * 0.5) {
            disponibilidadEstado = 'disponible';
          } else if (citasDelDia < maxCitas * 0.8) {
            disponibilidadEstado = 'medio';
          } else {
            disponibilidadEstado = 'lleno';
          }

          disponibilidad.push({
            fecha: fechaStr,
            disponibilidad: disponibilidadEstado,
            citasReservadas: citasDelDia
          });
        }

        return disponibilidad;
      })
    );
  }

  /**
   * Obtiene los horarios disponibles para un día específico
   */
  getHorariosDisponibles(fecha: string): Observable<string[]> {
    return this.getCitas().pipe(
      map(citas => {
        const horariosBase = [
          '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
          '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
          '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
        ];

        const citasDelDia = citas.filter(c =>
          c.fecha === fecha &&
          c.estado !== 'Cancelada'
        );

        const horasReservadas = citasDelDia.map(c => c.hora);

        return horariosBase.filter(h => !horasReservadas.includes(h));
      })
    );
  }

  /**
   * Formatea una fecha a string YYYY-MM-DD
   */
  private formatearFecha(fecha: Date): string {
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${año}-${mes}-${dia}`;
  }

  /**
   * Valida si una cita es válida
   */
  validarCita(cita: Partial<Cita>): { valida: boolean; errores: string[] } {
    const errores: string[] = [];

    if (!cita.nombreCliente || cita.nombreCliente.trim().length < 3) {
      errores.push('El nombre del cliente debe tener al menos 3 caracteres');
    }

    if (!cita.telefono || !/^\d{10}$/.test(cita.telefono.replace(/\D/g, ''))) {
      errores.push('El teléfono debe tener 10 dígitos');
    }

    if (cita.emailCliente && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cita.emailCliente)) {
      errores.push('El email no es válido');
    }

    if (!cita.nombreMascota || cita.nombreMascota.trim().length < 2) {
      errores.push('El nombre de la mascota debe tener al menos 2 caracteres');
    }

    if (!cita.fecha) {
      errores.push('Debe seleccionar una fecha');
    }

    if (!cita.hora) {
      errores.push('Debe seleccionar una hora');
    }

    if (!cita.servicio) {
      errores.push('Debe seleccionar un servicio');
    }

    return {
      valida: errores.length === 0,
      errores
    };
  }
}
